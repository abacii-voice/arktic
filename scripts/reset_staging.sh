sh scripts/remove_migrations.sh
sh scripts/make_migrations_staging.sh
rm -rf woot/media/
python manage.py migrate --settings="woot.settings.staging"
python manage.py temp_create_test_data --settings="woot.settings.staging"
