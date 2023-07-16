"""change enddate type

Revision ID: 617cada13034
Revises: 13439207009a
Create Date: 2023-07-12 22:13:21.699053

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '617cada13034'
down_revision = '13439207009a'
branch_labels = None
depends_on = None


def upgrade():
    op.alter_column('habits', 'end_date',
               existing_type=sa.Date,
               type_=sa.DateTime,
               existing_nullable=True)


def downgrade():
    op.alter_column('habits', 'end_date',
               existing_type=sa.DateTime,
               type_=sa.Date,
               existing_nullable=True)
