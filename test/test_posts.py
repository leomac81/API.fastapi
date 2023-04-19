from typing import List
from app import schemas


def test_get_all_posts(authorized_client,test_posts):
    res = authorized_client.get("/posts/")

    def validate(post):
        return schemas.PostOut(**post)
    
    post_map = map(validate, res.json())
    post_list = list(post_map)

    assert len(res.json()) == len(test_posts)
    assert res.status_code == 200
    