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

3. Clients
----------

Can be used to views the list of clients and projects currently active. Add the argument --client to view a single client.

4. Tags
-------

Can be used to add tags to a specific project dictionary. 

5. Flags
--------

Can add flags to a client or project
