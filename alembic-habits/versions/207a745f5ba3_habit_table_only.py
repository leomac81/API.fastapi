"""habit table only

Revision ID: 207a745f5ba3
Revises: 
Create Date: 2023-07-03 16:58:26.750151

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '207a745f5ba3'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table('habtis', sa.Column('id', sa.INTEGER(), nullable = False, primary_key = True), sa.Column('title', sa.String(), nullable = False))
    pass
    pass


def downgrade() -> None:
    op.drop_table('posts')
    pass
