# django
from django import forms

# local

### User forms
class NewAdminForm(forms.Form):
	email = forms.EmailField(label='Email', max_length=100)
	first_name = forms.CharField(label='First name', max_length=100)
	last_name = forms.CharField(label='Last name', max_length=100)
	company_name = forms.CharField(label='Company name', max_length=100)
	password = forms.CharField(label='Password', widget=forms.PasswordInput)
	password_repeat = forms.CharField(label='Password (again)', widget=forms.PasswordInput)

class LoginForm(forms.Form):
	email = forms.EmailField(max_length=100)
	password = forms.CharField(widget=forms.PasswordInput)