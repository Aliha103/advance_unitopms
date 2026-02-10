import time
import json
import logging

logger = logging.getLogger('audit')


class RequestLoggingMiddleware:
    """Log all API requests with timing, status, and user info."""

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Skip health/metrics endpoints
        skip_paths = ['/api/health/', '/metrics', '/favicon.ico']
        if any(request.path.startswith(p) for p in skip_paths):
            return self.get_response(request)

        start = time.time()
        response = self.get_response(request)
        duration = time.time() - start

        user = request.user.username if hasattr(request, 'user') and request.user.is_authenticated else 'anonymous'
        ip = self._get_client_ip(request)

        log_data = {
            'method': request.method,
            'path': request.path,
            'status': response.status_code,
            'duration_ms': round(duration * 1000, 2),
            'user': user,
            'ip': ip,
        }

        if response.status_code >= 500:
            logger.error(json.dumps(log_data))
        elif response.status_code >= 400:
            logger.warning(json.dumps(log_data))
        else:
            logger.info(json.dumps(log_data))

        return response

    @staticmethod
    def _get_client_ip(request):
        forwarded = request.META.get('HTTP_X_FORWARDED_FOR')
        if forwarded:
            return forwarded.split(',')[0].strip()
        return request.META.get('REMOTE_ADDR', '')


class AuditMiddleware:
    """Track important user actions (login, admin changes, etc)."""

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)

        # Log admin actions
        if request.path.startswith('/admin/') and request.method in ('POST', 'PUT', 'DELETE'):
            if hasattr(request, 'user') and request.user.is_authenticated:
                logger.info(json.dumps({
                    'event': 'admin_action',
                    'user': request.user.username,
                    'method': request.method,
                    'path': request.path,
                    'status': response.status_code,
                }))

        return response
