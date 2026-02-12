# Migration to sync Django state with DB reality.
# These models/fields were applied to the DB previously but no migration was recorded.
# SeparateDatabaseAndState tells Django about them without re-creating in the DB.

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0002_add_host_profile'),
    ]

    operations = [
        migrations.SeparateDatabaseAndState(
            state_operations=[
                # --- HostProfile rejection fields (already in DB) ---
                migrations.AddField(
                    model_name='hostprofile',
                    name='rejected_at',
                    field=models.DateTimeField(blank=True, null=True),
                ),
                migrations.AddField(
                    model_name='hostprofile',
                    name='rejected_by',
                    field=models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name='rejected_hosts',
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
                migrations.AddField(
                    model_name='hostprofile',
                    name='rejection_reason',
                    field=models.TextField(blank=True, default=''),
                    preserve_default=False,
                ),
                migrations.AlterField(
                    model_name='hostprofile',
                    name='status',
                    field=models.CharField(
                        choices=[
                            ('pending_review', 'Pending Review'),
                            ('approved', 'Approved'),
                            ('active', 'Active'),
                            ('suspended', 'Suspended'),
                            ('deactivated', 'Deactivated'),
                            ('rejected', 'Rejected'),
                        ],
                        default='pending_review',
                        max_length=20,
                    ),
                ),

                # --- ApplicationLog (already in DB with max_length=20) ---
                migrations.CreateModel(
                    name='ApplicationLog',
                    fields=[
                        ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                        ('action', models.CharField(
                            choices=[
                                ('approved', 'Approved'),
                                ('rejected', 'Rejected'),
                                ('link_resent', 'Password Link Resent'),
                                ('password_set', 'Password Set'),
                                ('note_added', 'Note Added'),
                                ('status_changed', 'Status Changed'),
                            ],
                            max_length=20,
                        )),
                        ('note', models.TextField(blank=True)),
                        ('ip_address', models.GenericIPAddressField(blank=True, null=True)),
                        ('metadata', models.JSONField(blank=True, default=dict)),
                        ('created_at', models.DateTimeField(auto_now_add=True)),
                        ('actor', models.ForeignKey(
                            blank=True, null=True,
                            on_delete=django.db.models.deletion.SET_NULL,
                            related_name='application_logs',
                            to=settings.AUTH_USER_MODEL,
                        )),
                        ('application', models.ForeignKey(
                            on_delete=django.db.models.deletion.CASCADE,
                            related_name='logs',
                            to='users.hostprofile',
                        )),
                    ],
                    options={
                        'verbose_name': 'Application Log',
                        'verbose_name_plural': 'Application Logs',
                        'ordering': ['-created_at'],
                    },
                ),

                # --- ApplicationPermission (already in DB) ---
                migrations.CreateModel(
                    name='ApplicationPermission',
                    fields=[
                        ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                        ('permission', models.CharField(
                            choices=[
                                ('view', 'View Applications'),
                                ('review', 'Review (Approve / Reject)'),
                                ('manage', 'Full Management'),
                            ],
                            max_length=20,
                        )),
                        ('created_at', models.DateTimeField(auto_now_add=True)),
                        ('granted_by', models.ForeignKey(
                            blank=True, null=True,
                            on_delete=django.db.models.deletion.SET_NULL,
                            related_name='granted_application_permissions',
                            to=settings.AUTH_USER_MODEL,
                        )),
                        ('user', models.ForeignKey(
                            on_delete=django.db.models.deletion.CASCADE,
                            related_name='application_permissions',
                            to=settings.AUTH_USER_MODEL,
                        )),
                    ],
                    options={
                        'verbose_name': 'Application Permission',
                        'verbose_name_plural': 'Application Permissions',
                        'unique_together': {('user', 'permission')},
                    },
                ),

                # --- Notification (already in DB) ---
                migrations.CreateModel(
                    name='Notification',
                    fields=[
                        ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                        ('category', models.CharField(
                            choices=[
                                ('subscription', 'Subscription'),
                                ('payment', 'Payment'),
                                ('system', 'System'),
                                ('info', 'Info'),
                            ],
                            default='info',
                            max_length=20,
                        )),
                        ('title', models.CharField(max_length=255)),
                        ('message', models.TextField()),
                        ('is_read', models.BooleanField(default=False)),
                        ('action_url', models.CharField(blank=True, max_length=255)),
                        ('created_at', models.DateTimeField(auto_now_add=True)),
                        ('user', models.ForeignKey(
                            on_delete=django.db.models.deletion.CASCADE,
                            related_name='notifications',
                            to=settings.AUTH_USER_MODEL,
                        )),
                    ],
                    options={
                        'verbose_name': 'Notification',
                        'verbose_name_plural': 'Notifications',
                        'ordering': ['-created_at'],
                    },
                ),
            ],
            database_operations=[],
        ),
    ]
