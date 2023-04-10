from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_root():
    res = client.get("/")
    print(res.json().get('message'))
    assert res.status_code == 200
    assert res.json().get('message') == 'fixed it myself'

def test_create_user():
    res  = client.post("/users/", json= {"email": "hello123@gmail.com", "password":"password123"})
    print(res.json())
    #assert res.status_code == 201