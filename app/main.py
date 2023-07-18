
from fastapi import FastAPI,Request
from passlib.context import CryptContext
from .routers import habits, user, auth
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates



pwd_context = CryptContext(schemes = ["bcrypt"], deprecated = "auto")
#models.Base.metadata.create_all(bind=engine)
#initialises app and assigns it to app
app = FastAPI()

#defines all websites that will be allowed to interact with the fasapi application through CORS
origins = ["https://www.google.com","http://127.0.0.1:8000"]
#The following block of code adds a middleware to the FastAPI application, allowing CORS for the specified origins, and allowing any methods and headers:
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
#This line mounts a directory named "static" to serve static files (e.g., images, CSS, JavaScript) under the "/static" path.
app.mount("/static", StaticFiles(directory="static"), name="static")
#This line initializes a Jinja2Templates instance to manage templates located in the "templates" directory.
templates = Jinja2Templates(directory="templates")

#The following lines include routers from different modules into the main FastAPI application:
app.include_router(habits.router)
app.include_router(user.router)
app.include_router(auth.router)
#The last block of code defines a root route ("/") that responds with an HTML file "index.html" using the Jinja2 template engine:
#This route takes a Request object as a parameter and returns an HTMLResponse with the rendered "index.html" template.
@app.get("/", response_class = HTMLResponse)
async def root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

