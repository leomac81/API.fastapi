from fastapi import APIRouter, Depends, status, HTTPException, Response, Request
from fastapi.security.oauth2 import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from fastapi.templating import Jinja2Templates

templates = Jinja2Templates(directory="templates")

from .. import database,schemas, models, utils, oauth2

router = APIRouter(tags = ['Authentication'])
@router.post('/login', response_model= schemas.Token)
def login(user_credentials: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(database.get_db)):

    user = db.query(models.User).filter(models.User.email == user_credentials.username).first()

    if not user:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail = f"Invalid Credentials")
    if not utils.verify(user_credentials.password, user.password):
        raise HTTPException(status_code = status.HTTP_403_FORBIDDEN, detail = f"Invalid Credentials")

    access_token = oauth2.create_access_token(data = {"user_id": user.id})
    
    return {"access_token": access_token, "token_type": "bearer"}

@router.post('/password-reset', status_code=status.HTTP_200_OK)
async def password_reset(request: Request, email: str, db: Session = Depends(database.get_db)):
    user = db.query(models.User).filter(models.User.email == email).first()

    if user:
        reset_token = utils.generate_reset_token()
        expires_at = datetime.now() + timedelta(hours=1)
        
        password_reset = models.PasswordReset(
            user_id=user.id,
            reset_token=reset_token,
            expires_at=expires_at
        )
        db.add(password_reset)
        db.commit()

        utils.send_reset_email(email, reset_token)

    return templates.TemplateResponse("password_reset_email_sent.html", {"request": request})

@router.post('/password-reset/{reset_token}', status_code=status.HTTP_200_OK)
async def reset_password(reset_token: str, new_password: str, db: Session = Depends(database.get_db)):
    password_reset = db.query(models.PasswordReset)\
        .filter(models.PasswordReset.reset_token == reset_token)\
        .filter(models.PasswordReset.expires_at > datetime.now())\
        .first()

    if not password_reset:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid or expired token")

    user = db.query(models.User).get(password_reset.user_id)
    hashed_password = utils.hash(new_password)
    user.password = hashed_password

    db.delete(password_reset)  # Remove used or expired tokens
    db.commit()

    return {"message": "Password reset successfully"}
