from passlib.context import CryptContext
import secrets
import smtplib, ssl
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart


pwd_context = CryptContext(schemes = ["bcrypt"], deprecated = "auto")

def hash(password:str):
    return pwd_context.hash(password)

    
def verify(plain_password, hashed_password):
    return pwd_context.verify(plain_password,hashed_password)


def generate_reset_token() -> str:
    return secrets.token_urlsafe(20)


def send_reset_email(receiver_email: str, reset_token: str):
    sender_email = "your_email@example.com"
    password = "your_email_password"
    
    message = MIMEMultipart("alternative")
    message["Subject"] = "Password Reset Request"
    message["From"] = sender_email
    message["To"] = receiver_email
    
    # Plain-text version of the content
    text = f"Here is your password reset token: {reset_token}"
    
    # HTML version of the content (You can customize this part further)
    html = f"""
    <html>
    <body>
        <p>Here is your password reset token:</p>
        <p><b>{reset_token}</b></p>
    </body>
    </html>
    """
    
    # Adding the text and HTML parts to the email
    message.attach(MIMEText(text, "plain"))
    message.attach(MIMEText(html, "html"))
    
    # Sending the email
    context = ssl.create_default_context()
    with smtplib.SMTP_SSL("smtp.example.com", 465, context=context) as server:
        server.login(sender_email, password)
        server.sendmail(sender_email, receiver_email, message.as_string())
