sh scripts/remove_migrations.sh
sh scripts/make_migrations.sh
rm db/arktic_db.sqlite3
rm -rf woot/media/
python manage.py migrate
python manage.py import --path=./test/batch_0_containing_1_items/ --client=Client1 --project=Project1 --grammar=Grammar1 --batch=Batch1 --upload=Upload2
python manage.py users add --email=n@a.com --first_name=StJohn --last_name=Piano --password=mach
python manage.py users assign --client=Client1 --project=Project1 --user=n