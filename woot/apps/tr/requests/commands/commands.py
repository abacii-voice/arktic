
# django
from django.shortcuts import render
from django.views.generic import View
from django.http import HttpResponse, HttpResponseRedirect
from django.conf import settings

# local
from apps.tr.access import access, process_request
from apps.tr.models.transcription import Transcription

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
