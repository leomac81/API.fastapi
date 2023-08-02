"""remove unique habit completion per day constraint

Revision ID: 829883c10657
Revises: f966e6944d0e
Create Date: 2023-08-02 21:59:09.842698

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '829883c10657'
down_revision = 'f966e6944d0e'
branch_labels = None
depends_on = None


def upgrade():
    # code to remove the constraint goes here
    
    op.create_table('habit_completions',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('date', sa.Date(), nullable=False),
    sa.Column('completed', sa.Boolean(), nullable=False),
    sa.Column('habit_id', sa.Integer(), nullable=True),
    sa.Column('comment', sa.String(), nullable=True),
    sa.ForeignKeyConstraint(['habit_id'], ['habits.id'], ),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('date', 'habit_id', name='unique_habit_completion_per_day')
    )
    op.create_index(op.f('ix_habit_completions_id'), 'habit_completions', ['id'], unique=False)
    # ### end Alembic commands ###
def downgrade():
    # code to remove the table goes here
    op.drop_index('ix_habit_completions_id', 'habit_completions')
    op.drop_table('habit_completions')
