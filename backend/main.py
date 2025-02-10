from fastapi import FastAPI

from .config import settings

from .api import router as api_router


app = FastAPI()
app.include_router(api_router)
