from fastapi import FastAPI

from .config import settings

from .spotify import router as spotify_router


app = FastAPI()
app.include_router(spotify_router)
