sh scripts/remove_migrations.sh
sh scripts/staging_make_migrations.sh
rm -rf woot/media/
python manage.py migrate --settings="woot.settings.staging"
python manage.py test_data_sans_data --settings="woot.settings.staging"
