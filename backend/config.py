from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    SPOTIFY_CLIENT_ID: str
    SPOTIFY_CLIENT_SECRET: str
    SPOTIFY_API_URL: str = "https://api.spotify.com/v1"
    SPOTIFY_AUTH_URL: str = "https://accounts.spotify.com/api/token"
    
    GENIUS_CLIENT_ID: str
    GENIUS_CLIENT_SECRET: str
    GENIUS_ACCESS_TOKEN: str
    GENIUS_API_URL: str = "https://api.genius.com"

    model_config = SettingsConfigDict(env_file=".env")


settings = Settings()
