from fastapi import APIRouter
from pydantic import BaseModel
from ..utils.prompts import render
from ..utils.llm_client import LLMClient
from ..utils.router import pick_model

router = APIRouter()

class MessageRequest(BaseModel):
    message: str

@router.post("/")
def classify_message(req: MessageRequest):
    model = pick_model('groq', 'general')
    client = LLMClient('groq', model=model)

    msg = req.message
    examples = '''
        Input: "BREAKING: Water levels in Kelani River (Colombo) have reached 9.5 meters. Critical flood warning issued."
        Output: "District: Colombo | Intent: Info | Priority: Low"

        Input: "Urgent! Flooding in Galle. People trapped in houses. Need immediate rescue!"
        Output: "District: Galle | Intent: Rescue | Priority: High"

        Input: "Food and water supplies running low in Jaffna. Requesting urgent supply drop."
        Output: "District: Jaffna | Intent: Supply | Priority: High"

        Input: "Where are you right now?"
        Output: "District: None | Intent: Other | Priority: Low"

        Input: "8 people trapped in a collapsed building. Rescue teams required immediately."
        Output: "District: None | Intent: Rescue | Priority: High"
    '''

    prompt_text, spec = render(
        'few_shot.v1',
        role='Crisis message classifier',
        examples=examples,
        query= f'Classify the following message: "{msg}"',
        constraints='Respond only with the extracted information. Do not include any explanations or additional text.',
        format='District: [Name or None] | Intent: [Category] | Priority: [High/Low]'
    )

    messages = [{ "role": "user", "content": prompt_text }]
    response = client.chat(messages, temperature=0.0, max_tokens=100)
    
    output = response['text']
    try:
        district = output.split('|')[0].split(':')[1].strip()
        intent = output.split('|')[1].split(':')[1].strip()
        priority = output.split('|')[2].split(':')[1].strip()
    except Exception:
        district, intent, priority = "Unknown", "Unknown", "Unknown"
        
    return {
        "message": msg,
        "district": district,
        "intent": intent,
        "priority": priority,
        "output": output,
    }
