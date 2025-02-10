from fastapi import FastAPI

from .config import settings

from .api import router as api_router


app = FastAPI()
<<<<<<< HEAD
app.include_router(api_router)
=======
app.include_router(spotify_router)
>>>>>>> 45b773e (fix)
