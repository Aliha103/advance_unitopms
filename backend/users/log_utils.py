from .models import ApplicationLog


def get_client_ip(request):
    """Extract client IP from request, accounting for proxies."""
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        return x_forwarded_for.split(',')[0].strip()
    return request.META.get('REMOTE_ADDR')


def create_application_log(application, action, actor=None, request=None, note='', metadata=None):
    """Create an ApplicationLog entry."""
    return ApplicationLog.objects.create(
        application=application,
        action=action,
        actor=actor,
        note=note,
        ip_address=get_client_ip(request) if request else None,
        metadata=metadata or {},
    )
