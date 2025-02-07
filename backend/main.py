from typing import Union

from fastapi import FastAPI
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    SPOTIFY_CLIENT_ID: str
    SPOTIFY_CLIENT_SECRET: str
    SPOTIFY_API_URL: str
    SPOTIFY_AUTH_URL: str


settings = Settings()
app = FastAPI()


@app.get("/api/")
def read_root():
    return {"Hello": "World"}


@app.get("/api/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}
