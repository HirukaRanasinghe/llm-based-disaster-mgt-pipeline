from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes import classifier, logistics, budget, newsfeed

app = FastAPI(title="Operation Ditwah API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(classifier.router, prefix="/api/classifier")
app.include_router(logistics.router, prefix="/api/logistics")
app.include_router(budget.router, prefix="/api/budget")
app.include_router(newsfeed.router, prefix="/api/newsfeed")
