sh scripts/remove_migrations.sh
sh scripts/make_migrations.sh
rm db/arktic_db.sqlite3
python manage.py migrate
python manage.py temp_create_default_user
python manage.py runserver
