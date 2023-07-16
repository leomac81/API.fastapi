"""spelling fix

Revision ID: 0cb408ab6fcf
Revises: 207a745f5ba3
Create Date: 2023-07-03 17:01:06.512168

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '0cb408ab6fcf'
down_revision = '207a745f5ba3'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table('habits', sa.Column('id', sa.INTEGER(), nullable = False, primary_key = True), sa.Column('title', sa.String(), nullable = False))
    
    pass


def downgrade() -> None:
    op.drop_table('habits')
    pass
