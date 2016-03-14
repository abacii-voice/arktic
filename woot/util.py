# General utilities

# Check request for login
def check_request(request):
	return request.method == 'POST' and request.user.is_authenticated()
