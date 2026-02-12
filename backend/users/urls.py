from django.urls import re_path
from rest_framework_simplejwt.views import TokenRefreshView

from .views import (
    HostApplicationView,
    LoginView,
    HostProfileView,
    ApplicationListView,
    ApplicationApproveView,
    ApplicationRejectView,
    SetPasswordView,
    ApplicationLogListView,
    HostProfileDetailView,
    ApplicationPermissionListView,
    GrantApplicationPermissionView,
    RevokeApplicationPermissionView,
    StaffListView,
    SubscriptionStatusView,
    NotificationListView,
    NotificationUnreadCountView,
    NotificationMarkReadView,
    NotificationMarkAllReadView,
    AdminSubscriptionUpdateView,
    ContractTemplateView,
    ContractStatusView,
    ContractSignView,
    CancellationRequestView,
    ContractDataExportView,
    ConversationListView,
    ConversationDetailView,
    ConversationCreateView,
    MessageSendView,
    ConversationCloseView,
    HostConversationsView,
)

urlpatterns = [
    re_path(r'^host-application/?$', HostApplicationView.as_view(), name='host-application'),
    re_path(r'^login/?$', LoginView.as_view(), name='login'),
    re_path(r'^token/refresh/?$', TokenRefreshView.as_view(), name='token-refresh'),
    re_path(r'^profile/?$', HostProfileView.as_view(), name='host-profile'),

    # Application management
    re_path(r'^applications/?$', ApplicationListView.as_view(), name='application-list'),
    re_path(r'^applications/permissions/?$', ApplicationPermissionListView.as_view(), name='application-permission-list'),
    re_path(r'^applications/permissions/grant/?$', GrantApplicationPermissionView.as_view(), name='application-permission-grant'),
    re_path(r'^applications/permissions/(?P<pk>\d+)/?$', RevokeApplicationPermissionView.as_view(), name='application-permission-revoke'),
    re_path(r'^applications/(?P<pk>\d+)/approve/?$', ApplicationApproveView.as_view(), name='application-approve'),
    re_path(r'^applications/(?P<pk>\d+)/reject/?$', ApplicationRejectView.as_view(), name='application-reject'),
    re_path(r'^applications/(?P<pk>\d+)/logs/?$', ApplicationLogListView.as_view(), name='application-logs'),
    re_path(r'^applications/(?P<pk>\d+)/profile/?$', HostProfileDetailView.as_view(), name='application-profile-detail'),

    re_path(r'^applications/(?P<pk>\d+)/subscription/?$', AdminSubscriptionUpdateView.as_view(), name='application-subscription-update'),

    # Staff list (for permission assignment UI)
    re_path(r'^staff/?$', StaffListView.as_view(), name='staff-list'),

    # Set password (public — host uses token from approval URL)
    re_path(r'^set-password/?$', SetPasswordView.as_view(), name='set-password'),

    # Subscription & Notifications
    re_path(r'^subscription-status/?$', SubscriptionStatusView.as_view(), name='subscription-status'),
    re_path(r'^notifications/?$', NotificationListView.as_view(), name='notification-list'),
    re_path(r'^notifications/unread-count/?$', NotificationUnreadCountView.as_view(), name='notification-unread-count'),
    re_path(r'^notifications/read-all/?$', NotificationMarkAllReadView.as_view(), name='notification-read-all'),
    re_path(r'^notifications/(?P<pk>\d+)/read/?$', NotificationMarkReadView.as_view(), name='notification-mark-read'),

    # Contract
    re_path(r'^contract-template/?$', ContractTemplateView.as_view(), name='contract-template'),
    re_path(r'^contract/?$', ContractStatusView.as_view(), name='contract-status'),
    re_path(r'^contract/sign/?$', ContractSignView.as_view(), name='contract-sign'),
    re_path(r'^contract/cancel/?$', CancellationRequestView.as_view(), name='contract-cancel'),
    re_path(r'^contract/export/?$', ContractDataExportView.as_view(), name='contract-export'),

    # Messaging
    re_path(r'^conversations/?$', ConversationListView.as_view(), name='conversation-list'),
    re_path(r'^conversations/(?P<pk>\d+)/?$', ConversationDetailView.as_view(), name='conversation-detail'),
    re_path(r'^conversations/(?P<pk>\d+)/messages/?$', MessageSendView.as_view(), name='conversation-send-message'),
    re_path(r'^conversations/(?P<pk>\d+)/close/?$', ConversationCloseView.as_view(), name='conversation-close'),

    # Admin: host-specific conversations
    re_path(r'^applications/(?P<pk>\d+)/conversations/?$', HostConversationsView.as_view(), name='host-conversations'),
]
