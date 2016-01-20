# apps.tr.models

# django
from django.db import models

# local
from apps.client.models import Client, Project
from apps.users.models import User

# util

### Create your models here.

class Grammar(models.Model):
	pass

class GrammarInstance(models.Model):
	pass

class GrammarFile(models.Model):
	pass

class Transcription(models.Model):
	pass

class RecognisedUtterance(models.Model):
	pass

class Utterance(models.Model):
	pass

class UserComment(models.Model):
	pass

class IssueTag(models.Model):
	pass

class Word(models.Model):
	pass

class Tag(models.Model):
	pass

class ClientTag(models.Model):
	### Connections

	### Properties

	pass
