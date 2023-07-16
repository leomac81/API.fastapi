"""empty message

Revision ID: a1cd5da38f8b
Revises: 0cb408ab6fcf
Create Date: 2023-07-12 17:13:30.312451

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'a1cd5da38f8b'
down_revision = '0cb408ab6fcf'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.drop_table("habits")
    op.create_table("habits",
    sa.Column("id", sa.INTEGER(), primary_key=True),
    sa.Column("public", sa.String()),
    sa.Column("frequency", sa.String()),
    sa.Column("habit_description", sa.String()),
    sa.Column("end_goal", sa.String()),
    sa.Column("end_date", sa.Date()))


def downgrade() -> None:
    op.drop_table("habits")
