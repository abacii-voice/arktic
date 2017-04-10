ARKTIC VOICE README
===================

1. Import
2. Users
3. Clients
4. Tags
5. Flags
6. Transcription
7. Export

1. Import
---------

dm import --path --client --project --grammar --batch --name

Names an upload from a specified path. Will be placed into the media folder under 'audio'. Used to create Transcription objects that will be immediately available on the system.

If they do not currently exist; client, project, grammar, and batch will be created.

2. Users
--------

### add

dm users add --first_name --last_name --email

Sends a verification email to a user with the specified email. They will be directed to a login page once they have been verified.

### disable

dm users disable --user

Disables a user and prevents them from logging in. It does not remove them from the system as this would compromise database integrity.

### assign

dm users assign --user --client --project

Assigns a user to a specified project. The transcriptions that are available to them will come from this project and will deactivate their account when the project is complete. Re-assign a user to reactivate them.

### resend_verification_email

dm users resend_verification_email --user

Will resend the verification email with a different code. The verification page can only be loaded once per code.

### example commands

Add: dm users add --first_name=FirstName --last_name=LastName --email=email@site.com --admin --moderator --worker
Add: dm users add --first_name=FirstName --last_name=LastName --email=email@site.com -a -m -w
List: dm users --user=UserId
List: dm users --is_enabled=False
Disable: dm users --user=EmailFragment --enable=False
Reassign: dm users assign --user=UserId --client=Client1 --project=Project1
Resend: dm users resend_verification_email --user=UserId

3. Clients
----------

Can be used to views the list of clients and projects currently active. Add the argument --client to view a single client.

### example commands

Export: dm clients --client=client_id_or_name


4. Tags
-------

Can be used to add tags to a specific project dictionary. They can listed, or filtered with the arguments --tag, --client, --project, or --is_enabled

### add

On top of the client and project, can also specify a --description.

### example commands

List: dm tags --client=Client1 --project=Project1 --is_enabled=True
Add: dm tags add --client=Client1 --project=Project1 --name=TagName --description="tag description"
Disable: dm tags --tag=tag_id --enable=False
Disable: dm tags --client=Client1 --project=Project1 --tag=TagName --enable=False

5. Flags
--------

Can add flags to a client.

### example commands

List: dm flags --client=Client1 --is_enabled=True
Add: dm flags add --client=Client1 --name=FlagName --description="flag description"
Disable: dm flags --flag=flag_id --enable=False
Disable: dm flags --client=Client1 --flag=FlagName --enable=False

6. Transcription
----------------



7. Export
---------

Once completed, transcriptions can be exported in csv files, identified by project, batch, and date.

### example commands

Export: dm export --client=Client1 --project=Project1 --batch=Batch1
Export: dm export --batch=BatchId
List: dm export