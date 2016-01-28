# django
from django.conf.urls import include, url
from django.views.generic import TemplateView, RedirectView

# local
from apps.users.views import LoginView, AccountSPAView

urlpatterns = [
	# i18n / l10n
	url(r'^i18n/', include('django.conf.urls.i18n')),

	### Users
	# login
	url(r'^login/', LoginView.as_view()),

	# account
	url(r'^account/', AccountSPAView.as_view()),
]
