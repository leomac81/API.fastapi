"""create post table

Revision ID: 7318f251712c
Revises: 
Create Date: 2022-12-09 11:28:18.362980

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '7318f251712c'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table('posts', sa.Column('id', sa.INTEGER(), nullable = False, primary_key = True), sa.Column('title', sa.String(), nullable = False))
    pass


def downgrade() -> None:
    op.drop_table('posts')
    pass
