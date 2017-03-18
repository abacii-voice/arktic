sh scripts/remove_migrations.sh
sh scripts/dev_make_migrations.sh
rm db/arktic_db.sqlite3
rm -rf woot/media/
python manage.py migrate
python manage.py test_data
