sh scripts/remove_migrations.sh
sh scripts/make_migrations.sh
rm db/arktic_db.sqlite3
rm -rf woot/media/
python manage.py migrate
python manage.py temp_create_default_user
python manage.py runserver
