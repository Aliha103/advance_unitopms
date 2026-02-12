# New models for contract system and messaging, plus ApplicationLog action field update.

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0003_hostprofile_rejection_fields'),
    ]

    operations = [
        # --- Widen ApplicationLog.action from 20 → 30 and add new choices ---
        migrations.AlterField(
            model_name='applicationlog',
            name='action',
            field=models.CharField(
                choices=[
                    ('approved', 'Approved'),
                    ('rejected', 'Rejected'),
                    ('link_resent', 'Password Link Resent'),
                    ('password_set', 'Password Set'),
                    ('note_added', 'Note Added'),
                    ('status_changed', 'Status Changed'),
                    ('contract_signed', 'Contract Signed'),
                    ('cancellation_requested', 'Cancellation Requested'),
                    ('subscription_paid', 'Subscription Paid'),
                    ('email_sent', 'Email Sent'),
                    ('service_ended', 'Service Ended'),
                    ('access_expired', 'Access Expired'),
                ],
                max_length=30,
            ),
        ),

        # --- ContractTemplate ---
        migrations.CreateModel(
            name='ContractTemplate',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('version', models.CharField(max_length=20, unique=True)),
                ('title', models.CharField(max_length=255)),
                ('body', models.TextField(help_text='HTML/Markdown contract text')),
                ('is_active', models.BooleanField(default=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
            options={
                'verbose_name': 'Contract Template',
                'verbose_name_plural': 'Contract Templates',
                'ordering': ['-created_at'],
            },
        ),

        # --- ServiceContract ---
        migrations.CreateModel(
            name='ServiceContract',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('version', models.CharField(max_length=20)),
                ('signed_at', models.DateTimeField(blank=True, null=True)),
                ('service_start_date', models.DateField(blank=True, null=True)),
                ('cancellation_requested_at', models.DateTimeField(blank=True, null=True)),
                ('cancellation_notice_months', models.PositiveIntegerField(default=2)),
                ('service_end_date', models.DateField(blank=True, help_text='Computed: cancellation_requested_at + notice period', null=True)),
                ('read_only_access_until', models.DateField(blank=True, help_text='service_end_date + 365 days', null=True)),
                ('status', models.CharField(
                    choices=[
                        ('pending', 'Pending Signature'),
                        ('active', 'Active'),
                        ('cancellation_requested', 'Cancellation Requested'),
                        ('cancelled', 'Cancelled'),
                        ('expired', 'Expired'),
                    ],
                    default='pending',
                    max_length=30,
                )),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('host_profile', models.OneToOneField(
                    on_delete=django.db.models.deletion.CASCADE,
                    related_name='contract',
                    to='users.hostprofile',
                )),
            ],
            options={
                'verbose_name': 'Service Contract',
                'verbose_name_plural': 'Service Contracts',
            },
        ),

        # --- Conversation ---
        migrations.CreateModel(
            name='Conversation',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('subject', models.CharField(max_length=255)),
                ('status', models.CharField(
                    choices=[('open', 'Open'), ('closed', 'Closed')],
                    default='open',
                    max_length=10,
                )),
                ('last_message_at', models.DateTimeField(auto_now_add=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('host', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE,
                    related_name='conversations',
                    to='users.hostprofile',
                )),
            ],
            options={
                'verbose_name': 'Conversation',
                'verbose_name_plural': 'Conversations',
                'ordering': ['-last_message_at'],
            },
        ),

        # --- Message ---
        migrations.CreateModel(
            name='Message',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('body', models.TextField()),
                ('is_from_host', models.BooleanField(default=True)),
                ('is_read', models.BooleanField(default=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('conversation', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE,
                    related_name='messages',
                    to='users.conversation',
                )),
                ('sender', models.ForeignKey(
                    null=True,
                    on_delete=django.db.models.deletion.SET_NULL,
                    related_name='sent_messages',
                    to=settings.AUTH_USER_MODEL,
                )),
            ],
            options={
                'verbose_name': 'Message',
                'verbose_name_plural': 'Messages',
                'ordering': ['created_at'],
            },
        ),
    ]
