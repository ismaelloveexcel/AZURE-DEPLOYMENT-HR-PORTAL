"""Add gift tables for GiftForge MVP

Revision ID: 20260130_giftforge
Revises: 20260103_0007_add_templates_and_indexes
Create Date: 2026-01-30 22:10:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '20260130_giftforge'
down_revision = '20260103_0007_add_templates_and_indexes'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Create gift_templates table
    op.create_table(
        'gift_templates',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(length=100), nullable=False),
        sa.Column('description', sa.Text(), nullable=False),
        sa.Column('category', sa.String(length=50), nullable=False),
        sa.Column('preview_image', sa.String(length=500), nullable=False),
        sa.Column('questionnaire_fields', postgresql.JSON(astext_type=sa.Text()), nullable=False),
        sa.Column('template_structure', postgresql.JSON(astext_type=sa.Text()), nullable=False),
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('display_order', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.text('now()')),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.text('now()')),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_gift_templates_category'), 'gift_templates', ['category'], unique=False)
    op.create_index(op.f('ix_gift_templates_is_active'), 'gift_templates', ['is_active'], unique=False)

    # Create gifts table
    op.create_table(
        'gifts',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('unique_code', sa.String(length=50), nullable=False),
        sa.Column('template_id', sa.Integer(), nullable=False),
        sa.Column('recipient_name', sa.String(length=200), nullable=False),
        sa.Column('occasion', sa.String(length=100), nullable=False),
        sa.Column('custom_message', sa.Text(), nullable=True),
        sa.Column('questionnaire_data', postgresql.JSON(astext_type=sa.Text()), nullable=False),
        sa.Column('generated_content', sa.Text(), nullable=True),
        sa.Column('generation_status', sa.String(length=20), nullable=False, server_default='pending'),
        sa.Column('rejection_reason', sa.String(length=500), nullable=True),
        sa.Column('payment_status', sa.String(length=20), nullable=False, server_default='pending'),
        sa.Column('payment_amount', sa.Float(), nullable=True),
        sa.Column('creator_email', sa.String(length=255), nullable=True),
        sa.Column('creator_ip', sa.String(length=50), nullable=True),
        sa.Column('view_count', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.text('now()')),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.text('now()')),
        sa.Column('delivered_at', sa.DateTime(timezone=True), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_gifts_unique_code'), 'gifts', ['unique_code'], unique=True)
    op.create_index(op.f('ix_gifts_template_id'), 'gifts', ['template_id'], unique=False)
    op.create_index(op.f('ix_gifts_generation_status'), 'gifts', ['generation_status'], unique=False)
    op.create_index(op.f('ix_gifts_payment_status'), 'gifts', ['payment_status'], unique=False)
    op.create_index(op.f('ix_gifts_created_at'), 'gifts', ['created_at'], unique=False)


def downgrade() -> None:
    op.drop_index(op.f('ix_gifts_created_at'), table_name='gifts')
    op.drop_index(op.f('ix_gifts_payment_status'), table_name='gifts')
    op.drop_index(op.f('ix_gifts_generation_status'), table_name='gifts')
    op.drop_index(op.f('ix_gifts_template_id'), table_name='gifts')
    op.drop_index(op.f('ix_gifts_unique_code'), table_name='gifts')
    op.drop_table('gifts')
    
    op.drop_index(op.f('ix_gift_templates_is_active'), table_name='gift_templates')
    op.drop_index(op.f('ix_gift_templates_category'), table_name='gift_templates')
    op.drop_table('gift_templates')
