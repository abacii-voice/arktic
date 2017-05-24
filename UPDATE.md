#### UPDATING ARKTIC

Generally, there are three things that have to be done when the code is changed:
1. Pull the code from github.
2. Update static files.
3. Update the database.



### 1. Pull code from github

This can be done from the root directory (the directory containing manage.py and ./.git)
(~$ represents the command prompt)

~$ git pull
Please enter github username:
Please enter github password:



### 2. Update static files

Again from the root directory, run the collectstatic command.

~$ dm collectstatic

Do you want to overwrite (n) files (yes/no)? yes



### 3. Update the database

Opening a POSTGRES database shell via the pythonanywhere databases tab
(> represents the command prompt)

\> drop database arktic_db_staging;
\> create database arktic_db_staging;

Exit the prompt and return to the root directory of the project. Update the database.

~$ sh scripts/staging_reset.sh