# temp.urls

from django.conf.urls import patterns, include, url
from django.views.generic import TemplateView, RedirectView

from django.contrib import admin
admin.autodiscover()

urlpatterns = [
	# i18n / l10n
	url(r'^i18n/', include('django.conf.urls.i18n')),

	# Example to include app-specific urls
	# url(r'^myapp/', include('myapp.urls')),
]
