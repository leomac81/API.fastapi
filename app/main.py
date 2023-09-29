
from fastapi import FastAPI,Request
from passlib.context import CryptContext
from .routers import habits, user, auth
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates



pwd_context = CryptContext(schemes = ["bcrypt"], deprecated = "auto")
app = FastAPI()

origins = ["https://www.google.com","http://127.0.0.1:8000","http://127.0.0.1:3000"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.mount("/static", StaticFiles(directory="~/app/src/habits-app/build"), name="static")
templates = Jinja2Templates(directory="templates")

app.include_router(habits.router)
app.include_router(user.router)
app.include_router(auth.router)

@app.get("/", response_class = HTMLResponse)
async def root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

