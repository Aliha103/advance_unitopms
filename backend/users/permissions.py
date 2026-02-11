from rest_framework import permissions
from .models import ApplicationPermission

# Permission hierarchy: manage > review > view
PERMISSION_HIERARCHY = {
    ApplicationPermission.Permission.VIEW: [
        ApplicationPermission.Permission.VIEW,
        ApplicationPermission.Permission.REVIEW,
        ApplicationPermission.Permission.MANAGE,
    ],
    ApplicationPermission.Permission.REVIEW: [
        ApplicationPermission.Permission.REVIEW,
        ApplicationPermission.Permission.MANAGE,
    ],
    ApplicationPermission.Permission.MANAGE: [
        ApplicationPermission.Permission.MANAGE,
    ],
}


def _user_has_app_permission(user, required):
    """Check if user has the required application permission (or higher)."""
    if user.is_superuser:
        return True
    allowed = PERMISSION_HIERARCHY.get(required, [required])
    return ApplicationPermission.objects.filter(
        user=user, permission__in=allowed,
    ).exists()


class CanViewApplications(permissions.BasePermission):
    """User must be staff + have at least 'view' permission (or superuser)."""
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        if not request.user.is_staff:
            return False
        return _user_has_app_permission(
            request.user, ApplicationPermission.Permission.VIEW
        )


class CanReviewApplications(permissions.BasePermission):
    """User must be staff + have at least 'review' permission (or superuser)."""
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        if not request.user.is_staff:
            return False
        return _user_has_app_permission(
            request.user, ApplicationPermission.Permission.REVIEW
        )


class CanManageApplications(permissions.BasePermission):
    """User must be staff + have 'manage' permission (or superuser)."""
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        if not request.user.is_staff:
            return False
        return _user_has_app_permission(
            request.user, ApplicationPermission.Permission.MANAGE
        )
