
from fastapi import FastAPI
from fastapi.testclient import TestClient
from . import models
from .database import engine
from passlib.context import CryptContext
from .routers import post, user, auth, vote
from pydantic import BaseSettings
from .config import settings
from fastapi.middleware.cors import CORSMiddleware

pwd_context = CryptContext(schemes = ["bcrypt"], deprecated = "auto")
#models.Base.metadata.create_all(bind=engine)

app = FastAPI()

origins = ["https://www.google.com"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(post.router)
app.include_router(user.router)
app.include_router(auth.router)
app.include_router(vote.router)
@app.get("/")
def root():
    return {"message": "fixed it myself"}



#13.11