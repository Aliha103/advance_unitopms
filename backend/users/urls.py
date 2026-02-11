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
    ApplicationPermissionListView,
    GrantApplicationPermissionView,
    RevokeApplicationPermissionView,
    StaffListView,
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

    # Staff list (for permission assignment UI)
    re_path(r'^staff/?$', StaffListView.as_view(), name='staff-list'),

    # Set password (public — host uses token from approval URL)
    re_path(r'^set-password/?$', SetPasswordView.as_view(), name='set-password'),
]
