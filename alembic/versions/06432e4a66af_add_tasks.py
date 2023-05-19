"""add tasks

Revision ID: 06432e4a66af
Revises: 8ecead2e030a
Create Date: 2023-05-19 23:00:54.630401

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '06432e4a66af'
down_revision = '8ecead2e030a'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table('tasks', sa.Column('id', sa.Integer(), nullable = False, primary_key = True),
    sa.Column('content', sa.String(),nullable = False ), sa.Column('completed',sa.Boolean(), nullable= False, default = False),
    sa.Column('user_id',sa.Integer()),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'))    


def downgrade() -> None:
    op.drop_table('tasks')
