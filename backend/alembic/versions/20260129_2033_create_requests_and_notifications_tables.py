"""create_requests_and_notifications_tables

Revision ID: 20260129_2033
Revises: 20260127_1200
Create Date: 2026-01-29 20:33:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '20260129_2033'
down_revision: Union[str, None] = '20260127_1200'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Create requests and notification_log tables for Phase 1 Request Tracking System"""
    
    # Requests table
    op.create_table(
        'requests',
        sa.Column('id', sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column('reference', sa.String(20), unique=True, nullable=False),
        sa.Column('employee_id', sa.String(20), sa.ForeignKey('employees.employee_id', ondelete='CASCADE'), nullable=False),
        sa.Column('request_type', sa.String(50), nullable=False),
        sa.Column('status', sa.String(20), server_default='submitted', nullable=False),
        sa.Column('submitted_at', sa.DateTime(), server_default=sa.func.now(), nullable=False),
        sa.Column('completed_at', sa.DateTime(), nullable=True),
        sa.Column('estimated_completion_days', sa.Integer(), server_default='3', nullable=False),
        sa.Column('hr_notes', sa.Text(), nullable=True),
        sa.Column('public_notes', sa.Text(), nullable=True),
        sa.Column('metadata', sa.JSON(), nullable=True),
        sa.Column('created_by', sa.String(20), nullable=False),
        sa.Column('updated_at', sa.DateTime(), server_default=sa.func.now(), onupdate=sa.func.now(), nullable=False)
    )
    
    # Indexes for performance
    op.create_index('idx_requests_reference', 'requests', ['reference'])
    op.create_index('idx_requests_employee', 'requests', ['employee_id'])
    op.create_index('idx_requests_status', 'requests', ['status'])
    op.create_index('idx_requests_submitted_at', 'requests', ['submitted_at'])
    
    # Notification log table
    op.create_table(
        'notification_log',
        sa.Column('id', sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column('employee_id', sa.String(20), sa.ForeignKey('employees.employee_id', ondelete='SET NULL'), nullable=True),
        sa.Column('phone_number', sa.String(20), nullable=True),
        sa.Column('message', sa.Text(), nullable=False),
        sa.Column('channel', sa.String(20), server_default='whatsapp', nullable=False),
        sa.Column('status', sa.String(20), server_default='pending', nullable=False),
        sa.Column('reference_id', sa.String(20), nullable=True),
        sa.Column('sent_at', sa.DateTime(), nullable=True),
        sa.Column('delivered_at', sa.DateTime(), nullable=True),
        sa.Column('error_message', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(), server_default=sa.func.now(), nullable=False)
    )
    
    # Indexes for notification log
    op.create_index('idx_notif_employee', 'notification_log', ['employee_id'])
    op.create_index('idx_notif_reference', 'notification_log', ['reference_id'])
    op.create_index('idx_notif_status', 'notification_log', ['status'])
    op.create_index('idx_notif_created_at', 'notification_log', ['created_at'])


def downgrade() -> None:
    """Drop requests and notification_log tables"""
    op.drop_index('idx_notif_created_at', 'notification_log')
    op.drop_index('idx_notif_status', 'notification_log')
    op.drop_index('idx_notif_reference', 'notification_log')
    op.drop_index('idx_notif_employee', 'notification_log')
    op.drop_table('notification_log')
    
    op.drop_index('idx_requests_submitted_at', 'requests')
    op.drop_index('idx_requests_status', 'requests')
    op.drop_index('idx_requests_employee', 'requests')
    op.drop_index('idx_requests_reference', 'requests')
    op.drop_table('requests')
