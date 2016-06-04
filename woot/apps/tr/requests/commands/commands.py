
# resolve audio
#Write text to file
# text_file_path = '/user/share/project/test.txt'
# audio_file_path = '/user/share/project/test.wav'
# text_file = open(text_file_path, "w")
# text_file.write('How are you?')
# text_file.close()
#
# #Convert file
# conv = 'flite -f "%s" -o "%s"' % (text_file_path, audio_file_path)
# response = commands.getoutput(conv)
#
# if os.path.isfile(audio_file_path):
#     response = HttpResponse()
#     f = open(audio_file_path, 'rb')
#     response['Content-Type'] = 'audio/x-wav'
#     response.write(f.read())
#     f.close()
#     return response

# def playAudioFile(request):
#     fname="C:\\test\\audio\\audio.mp3"
#     f = open(fname,"rb")
#     response = HttpResponse()
#     response.write(f.read())
#     response['Content-Type'] ='audio/mp3'
#     response['Content-Length'] =os.path.getsize(fname )
#     return response

# http://code.tutsplus.com/tutorials/the-web-audio-api-what-is-it--cms-23735
