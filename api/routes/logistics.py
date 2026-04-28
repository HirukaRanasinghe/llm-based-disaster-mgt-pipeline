from fastapi import APIRouter
from pydantic import BaseModel
from ..utils.prompts import render
from ..utils.llm_client import LLMClient
from ..utils.router import pick_model

router = APIRouter()

class LogisticsRequest(BaseModel):
    incidents_text: str

@router.post("/")
def calculate_logistics(req: LogisticsRequest):
    reasoning_model = pick_model('groq', 'cot')
    client_reasoning = LLMClient('groq', reasoning_model)

    problem = ''
    instructions = f'''
Solve the following problem step by step.
1. Analyze the incidents and identify Age, Need, and Urgency for each incident.
2. Assign a priority score from 1 to 10 based on the identified factors, where 10 is the highest priority.
3. Base Score of the incident is 5.
4. +2 if Age > 60 or < 5
5. +3 if Need == ”Rescue” (Life Threat)
6. +1 if Need == ”Insulin/Medicine”

Analyze each incident and provide your reasoning for the assigned priority score. Clearly mention the thought process and then show formatted output as below:
"Location | Age | Need | Urgency | Score | Reasoning"

Incidents:
{req.incidents_text}
'''

    prompt_text, spec = render(
        'cot_reasoning.v1',
        role='Crisis logistic analyst',
        problem=problem
    )

    full_prompt = f"""text: {prompt_text}

instruction: {instructions}"""

    messages = [{'role': 'user', 'content': full_prompt}]
    response = client_reasoning.chat(messages, temperature=spec.temperature, max_tokens=spec.max_tokens)
    
    try:
        priority_scores = response['text'].strip().split('\n\n')[1]
    except Exception:
        priority_scores = response['text']
        
    tot_problem = f'''
Incidents (in Urgency column) and their Priority Scores:
{priority_scores}

Travel times:
- Ragama → Ja-Ela (10m)
- Ja-Ela → Gampaha (40m)

Constraints:
- have ONE rescue boat at Ragama
- boat can handle one incident per stop
- unlimited capacity for simplicity

Branches:
- 1: Save the highest score first (Greedy).
- 2: Save closest first (speed).
- 3: Save furthest first (Logistics).

Goal: maximize total priority score saved within the shortest time.

Output Format: 
- Summary table:
    Branch | Rescue Order (Locations) | Total Score Saved | Total Time Taken | Reasoning 
- Optimal Branch: [Optimal branch and the justification for why it's optimal]
- Hypothesis → Steps → Intermediate check for all branches
'''

    prompt_text_tot, spec_tot = render(
        'tot_reasoning.v1',
        role='Crisis logistics commander',
        problem=tot_problem,
        branches='3'
    )

    response_tot = client_reasoning.chat([{'role': 'user', 'content': prompt_text_tot}], temperature=spec_tot.temperature, max_tokens=spec_tot.max_tokens)

    return {
        "priority_scores_analysis": response['text'],
        "optimal_route_analysis": response_tot['text']
    }
