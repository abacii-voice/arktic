
# django
from django.shortcuts import render
from django.views.generic import View
from django.http import HttpResponse, HttpResponseRedirect
from django.conf import settings

# local
from apps.tr.access import access, process_request
from apps.tr.models.transcription import Transcription, TranscriptionFragment

# load audio
# http://code.tutsplus.com/tutorials/the-web-audio-api-what-is-it--cms-23735
def load_audio(request):
	user, permission, data, verified = process_request(request)
	if verified:

		# maybe add extra check to verify the client of the transcription and permission match

		# load transcription
		transcription_id = data['id']
		transcription = Transcription.objects.get(id=transcription_id)

		# open file
		response = HttpResponse()
		with transcription.utterance.file as audio_file:
			response.write(audio_file.read())
			response['Content-Type'] = 'audio/wav'
			response['Content-Length'] = audio_file.size

		return response

# submit revisions
# Continuously submits a buffer of revisions
def submit_revisions(request):
	user, permission, data, verified = process_request(request)
	if verified:

		# 1. for each piece of data, release fragment, complete fragment, or double check.
		active_fragments = data['fragments']
		for active_fragment in active_fragments:
			# get fragment
			fragment = TranscriptionFragment.objects.get(id=active_fragment['id'])
			if active_fragment['release']:
				fragment.release()
			elif 'revisions' in active_fragment:
				for revision in active_fragment['revisions']:
					fragment.reconcile(revision)

		return HttpResponse()
