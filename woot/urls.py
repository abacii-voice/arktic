# django
from django.conf.urls import include, url
from django.views.generic import TemplateView, RedirectView
from django.conf.urls.static import static
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.conf import settings

# local
from apps.users.views import HomeView, AdminSignupView, AccountSPAView, LoginView, logout_view

urlpatterns = [
	# i18n / l10n
	url(r'^i18n/', include('django.conf.urls.i18n')),
]

# Static
urlpatterns += staticfiles_urlpatterns()

### Users
'''
0. Home

This simply contains a link to login and an admin-signup.
'''

urlpatterns += [
	url(r'^$', HomeView.as_view()),
]

'''
1. Entry point: Admin signup

This is the first thing linked from the main page. When someone wants to "sign up", they will be directed to this view. It will allow them to choose an email, a password, and other contact details such as telephone number and the name and address of the company so that a contract can be set up between Abacii, Ltd. and the prospective client.

An email will be sent to their email address to verify it. A randomly generated key will be used for the link.
'''
urlpatterns += [
	url(r'^register/', AdminSignupView.as_view()),
]

'''
2. The account SPA

Every user on the site will view the details of their account from this View. It will appear different for each user, but many different users will share similar information and interfaces.

a. The Superadmin

	Someone's got to have to control. In this case, the managers of the site (me) need a way to see who is currently signed up to use the site. It gives a summary of the clients using the site and their recent activity, including:

	i. Signup activity
	ii. Requests for account activation
	iii. Addition of admins, moderators, and workers
	iv. Projects active and completed
	v. Hours, transcriptions, overwatch, and other metrics
	vi. Hits to the site and traffic information

b. The Admin

	Here the admin can see the activity of their organisation. If the client is a contract client, it can only see progress. If it is a production client, it can also see progress and performance of each worker and moderator.

c. Moderator

	One level down from the admin. They can see their activity and billing numbers, but not those of the organisation as a whole. They can also see reports on each worker that reports to them.

d. Worker

	They can only see their personal billing numbers.

'''
urlpatterns += [
	# account
	url(r'^account/$', AccountSPAView.as_view()),
]

'''
3. Fairly standard login page

With one exception: a key can be given as an argument that can be used to verify the user. When a admin signs up, they will be sent an email containing a url with a key that will lead here.

Workers and moderators will also get keys in their emails, but they do not sign up. Their accounts are created by the admin of a production client.
'''

urlpatterns += [
	# login
	url(r'^login/', LoginView.as_view()),
	url(r'^logout/', logout_view),
]

### Transcription
'''
1. The Transcription SPA

The main transcription interface includes the following components:

a. Transcription + (training, demo)
b. Overwatch + (training, demo)
c. Moderation + (training, demo)

### main.js
### |__ plugin.js

transcription.js
|__ transcription_training.js
|__ transcription_demo.js

overwatch.js
|__ overwatch_training.js
|__ overwatch_demo.js

moderation.js
|__ moderation_training.js
|__ moderation_demo.js

'''

### Audio upload


### Actions
