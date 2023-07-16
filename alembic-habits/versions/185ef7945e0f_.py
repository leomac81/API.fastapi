"""empty message

Revision ID: 185ef7945e0f
Revises: a1cd5da38f8b
Create Date: 2023-07-12 17:30:56.637250

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '185ef7945e0f'
down_revision = 'a1cd5da38f8b'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table('users',
                    sa.Column('id', sa.Integer(), nullable = False),
                    sa.Column('email', sa.String(), nullable = False),
                    sa.Column('password', sa.String(), nullable = False),
                    sa.Column('created_at', sa.TIMESTAMP(timezone = True),
                            server_default = sa.text('now()'), nullable = False),
                    sa.PrimaryKeyConstraint('id'),
                    sa.UniqueConstraint('email')
                    )


def downgrade() -> None:
    op.drop_table("users")
