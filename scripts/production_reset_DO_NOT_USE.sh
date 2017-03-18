sh scripts/remove_migrations.sh
sh scripts/production_make_migrations.sh
rm -rf woot/media/
python manage.py migrate --settings="woot.settings.production"
