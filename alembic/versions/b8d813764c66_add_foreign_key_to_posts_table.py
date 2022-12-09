"""add foreign key to posts table

Revision ID: b8d813764c66
Revises: ab28a865f98b
Create Date: 2022-12-09 12:44:05.968443

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'b8d813764c66'
down_revision = 'ab28a865f98b'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column('posts', sa.Column('owner_id', sa.Integer(), nullable = False))
    op.create_foreign_key('posts_users_fk', source_table = "posts", referent_table = "users",
                    local_cols = ['owner_id'], remote_cols = ['id'], ondelete="CASCADE")
    pass


def downgrade() -> None:
    op.drop_constraint('post_users_fk', table_name='posts')
    op.drop_column('posts', 'ownder_id')
    pass
