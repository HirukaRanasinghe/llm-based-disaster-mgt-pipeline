from fastapi import APIRouter
from pydantic import BaseModel
from ..utils.token_utils import count_text_tokens
from ..utils.prompts import render
from ..utils.llm_client import LLMClient
from ..utils.router import pick_model

router = APIRouter()

MAX_TOKENS = 150

class BudgetRequest(BaseModel):
    context: str

@router.post("/")
def analyze_overflow_spam(req: BudgetRequest):
    model = pick_model('groq', 'general')
    client_capped = LLMClient('groq', model)

    context_token_count = count_text_tokens(req.context, 'groq', model)
    out = {}

    if context_token_count > MAX_TOKENS:
        prompt_text, spec = render(
            'overflow_summarize.v1',
            context=req.context,
            max_tokens_context='150',
            task='Identify if the message is chain spam. If so, add "BLOCK Chain-Spam" to the summary of crisis-related information. Otherwise, return only essential crisis-related information.',
            format='plain text summary only with no markdown syntax, labels, step numbers or extra commentary'
        )
        
        response = client_capped.chat([{'role': 'user', 'content': prompt_text}], temperature=0.2, max_tokens=MAX_TOKENS)
        summarized_context = response['text'].strip()
        
        status = "Summarized"
        if 'block chain-spam' in summarized_context.lower():
            status = "BLOCKED/TRUNCATED"

        out = {
            'original': req.context,
            'summarized': summarized_context,
            'original_token_count': context_token_count,
            'summarized_token_count': count_text_tokens(summarized_context, 'groq', model),
            'overflow_handled': True,
            'status': status
        }
    else:
        out = {
            'original': req.context,
            'summarized': None,
            'original_token_count': context_token_count,
            'summarized_token_count': None,
            'overflow_handled': False,
            'status': 'OK'
        }
    
    return out
