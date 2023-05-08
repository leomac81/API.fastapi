from fastapi import APIRouter, Depends, status, HTTPException, Response
from fastapi.security.oauth2 import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from .. import database,schemas, models, utils, oauth2

#create an APIRouter instance:
router = APIRouter(tags = ['Authentication'])
#This route is a POST route that expects an OAuth2PasswordRequestForm as input (user_credentials). 
# FastAPI will automatically parse the request body as a form and map it to the user_credentials parameter. 
# The db parameter is set to depend on the database.get_db function to manage the database session.
@router.post('/login', response_model= schemas.Token)
def login(user_credentials: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(database.get_db)):

    #Query the database for a user with the provided email address:
    user = db.query(models.User).filter(models.User.email == user_credentials.username).first()

    if not user:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail = f"Invalid Credentials")
    #Verify the provided password by comparing it to the stored password using the utils.verify function:
    if not utils.verify(user_credentials.password, user.password):
        raise HTTPException(status_code = status.HTTP_403_FORBIDDEN, detail = f"Invalid Credentials")

    #If the user is found and the password is valid, create an access token for the user using the oauth2.create_access_token function:
    access_token = oauth2.create_access_token(data = {"user_id": user.id})
    
    #Return the access token and the token type "bearer":
    return {"access_token": access_token, "token_type": "bearer"}