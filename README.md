#### ARKTIC VOICE README

A note on commands:
- Commands are run from the root directory of the project (the directory containing `manage.py`). Manage.py is simply a python
	script that imports everything from the directory it is in dynamically.
- the command `dm` is an alias of `python manage.py` that I have used from a long time. This can be set up in
	a `.bashrc` or `.profile` file by doing:

`dm () { python manage.py $@; # "$@" represents the list of args run with the command. }`

A note on pythonanywhere:
- Two commands, `staging` and `production`, put the environment in the mode for the respective site.

1. Import
2. Users
3. Clients
4. Tags
5. Flags
6. Transcription
7. Export
8. Worked example

### 1. Import

`dm import --path --client --project --grammar --batch --name`

Names an upload from a specified path. Will be placed into the media folder under `audio`. Used to create Transcription objects that will be immediately available on the system.

If they do not currently exist; client, project, grammar, and batch will be created.

### 2. Users

## add

`dm users add --first_name --last_name --email --password`

Sends a verification email to a user with the specified email. They will be directed to a login page once they have been verified. If the password argument is added, the user is activated immediately and the activation email is not sent.

## disable

`dm users disable --user`

Disables a user and prevents them from logging in. It does not remove them from the system as this would compromise database integrity.

## assign

`dm users assign --user --client --project`

Assigns a user to a specified project. The transcriptions that are available to them will come from this project and will deactivate their account when the project is complete. Re-assign a user to reactivate them.

## resend_verification_email

`dm users resend_verification_email --user`

Will resend the verification email with a different code. The verification page can only be loaded once per code.

## example commands

Add: `dm users add --first_name=FirstName --last_name=LastName --email=email@site.com --admin --moderator --worker`

Add: `dm users add --first_name=FirstName --last_name=LastName --email=email@site.com -a -m -w`

List: `dm users --user=UserId`

List: `dm users --is_enabled=False`

Disable: `dm users --user=EmailFragment --enable=False`

Reassign: `dm users assign --user=UserId --client=Client1 --project=Project1`

Resend: `dm users resend_verification_email --user=UserId`

### 3. Clients

Can be used to views the list of clients and projects currently active. Add the argument `--client` to view a single client.

## example commands

List: `dm clients --client=client_id_or_name`


### 4. Tags

Can be used to add tags to a specific project dictionary. They can listed, or filtered with the arguments `--tag`, `--client`, `--project`, or `--is_enabled`

## add

On top of the client and project, can also specify a `--description`. Can specify `--file` argument to import from a file with the following format:

{
	"tag_name": {
		"description": "DESCRIPTION",
		"shortcut": "shortcut"
	}
}

Standard rules apply for JSON (no trailing commas. double quotes only). Same type of file can used for flags.

## example commands

List: `dm tags --client=Client1 --project=Project1 --is_enabled=True`

Add: `dm tags add --client=Client1 --project=Project1 --name=TagName --description tag description`

Disable: `dm tags --tag=tag_id --enable=False`

Disable: `dm tags --client=Client1 --project=Project1 --tag=TagName --enable=False`

### 5. Flags

Can add flags to a client.

## example commands

List: `dm flags --client=Client1 --is_enabled=True`

Add: `dm flags add --client=Client1 --name=FlagName --description="flag description"`

Disable: `dm flags --flag=flag_id --enable=False`

Disable: `dm flags --client=Client1 --flag=FlagName --enable=False`

### 6. Transcription



### 7. Export

Once completed, transcriptions can be exported in `.csv` files, identified by project, batch, and date.

## example commands

Export: `dm export --client=Client1 --project=Project1 --batch=Batch1`

Export: `dm export --batch=BatchId`

List: `dm export`


### 8. Worked example

This example follows a single project from beginning to end.

1. Place a folder on the system anywhere, containing a relfile and corresponding audio files.

`/home/test/relfile.csv`

`/home/test/audio/`

2. Activate the virtualenv and go to the root directory of the project (the directory containing manage.py)

`~$ staging`

3. Run the import command from the root directory

`~$ dm import --path=/home/test/ --client=TestClient --project=TestProject --grammar=TestGrammar --batch=Batch1 --upload=Upload1`

4. Create a user

`~$ dm users add --first_name=FirstName --last_name=LastName --email=email@site.com --password=Password`

5. Create some tags in a file called tags.json in the root directory:

{
	"unintelligible": {
		"description": "Speech cannot be parsed.",
		"shortcut": "shift+ctrl+u"
	}
}

Remember to follow basic rules for json otherwise the file will not parse (No trailing commas in lists or objects, double quotes not single). Import tags using the following command:

`~$ dm tags add --client=ClientNameOrID --project=ProjectNameOrID --file=/path/to/file.json`

They can also be add individually

`~$ dm tags add --client=ClientNameOrID --project=ProjectNameOrID --name=TagName --shortcut=TagShortcut`

The shortcut string must follow the standard notation for keyboard shortcuts, e.g. ctrl+shift+u. To update a tag (or flag) run the command again. Tags can be disabled by running

`~$ dm tags --TagID --enable=False`

List tags by running

`~$ dm tags (filter by enabled with --is_enabled)`

6. Flags can be added in a similar way:

`~$ dm flags add --file=/path/to/file.json`

7. Create some rules and an FAQ. They are found in the rules.json and faq.json files in the root directory. More advances formatting will be added later.

8. Do transcription. At any point, a new project can be uploaded using steps 1+3. A user can be reassigned using:

`~$ dm users assign --user=UserIdOrEmailFragment --client=TestClient --project=Whatever`

9. Check a user total by running:

`~$ dms users --user=UserIdOrEmailFragment`

10. Export a project at any time using:

`~$ dms export --batch=BatchId`
