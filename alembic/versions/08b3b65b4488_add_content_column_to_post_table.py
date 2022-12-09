"""add content column to post table

Revision ID: 08b3b65b4488
Revises: 7318f251712c
Create Date: 2022-12-09 12:08:50.895019

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '08b3b65b4488'
down_revision = '7318f251712c'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column('posts', sa.Column('content', sa.String(), nullable = False))
    pass


def downgrade() -> None:
    op.drop_column('posts', 'content')
    pass
