from fastapi import APIRouter
from pydantic import BaseModel, Field
from typing import Literal, List, Optional
from ..utils.prompts import render
from ..utils.llm_client import LLMClient
from ..utils.router import pick_model
from ..utils.json_utils import format_pydantic_schema_for_prompt, parse_json_with_pydantic

router = APIRouter()

class CrisisEvent(BaseModel):
    district: Literal[
        'Ampara', 'Anuradhapura', 'Badulla', 'Batticaloa', 'Colombo',
        'Galle', 'Gampaha', 'Hambantota', 'Jaffna', 'Kalutara',
        'Kandy', 'Kegalle', 'Kilinochchi', 'Kurunegala', 'Mannar',
        'Matale', 'Matara', 'Monaragala', 'Mullaitivu', 'Nuwara Eliya',
        'Polonnaruwa', 'Puttalam', 'Ratnapura', 'Trincomalee', 'Vavuniya'
    ] = Field(..., description="District affected by the crisis event")
    flood_level_meters: Optional[float] = Field(None, description="Flood level in meters, if applicable")
    victim_count: int = Field(..., ge=0, description="Number of victims affected")
    main_need: str = Field(..., min_length=1, description="Main need of the affected population")
    status: Literal["Critical", "Warning", "Stable"] = Field(..., description="Status of the crisis event")

class NewsFeedRequest(BaseModel):
    feed: str

@router.post("/")
def extract_newsfeed(req: NewsFeedRequest):
    model = pick_model('groq', 'reason')
    client = LLMClient('groq', model)
    schema_str = format_pydantic_schema_for_prompt(CrisisEvent)
    
    lines = [line.strip() for line in req.feed.splitlines() if line.strip()]
    results = []
    
    for news in lines:
        prompt_text, spec = render("json_extract.v1", schema=schema_str, text=news)
        response = client.json_chat([
            {
                "role": "user",
                "content": prompt_text
            }],
            temperature=0.0
        )
        success, data, err = parse_json_with_pydantic(response['text'], CrisisEvent)
        if success:
            results.append({
                "news": news,
                "extracted": data.model_dump(),
                "success": True
            })
        else:
            results.append({
                "news": news,
                "error": err,
                "success": False
            })

    return {"results": results}
