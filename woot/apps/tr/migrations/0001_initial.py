# -*- coding: utf-8 -*-
# Generated by Django 1.9 on 2016-03-15 14:35
from __future__ import unicode_literals

import apps.tr.models.utterance
from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('client', '0001_initial'),
        ('users', '__first__'),
    ]

    operations = [
        migrations.CreateModel(
            name='AutomaticQualityTest',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='AutomaticQualityTestInstance',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('is_successful', models.BooleanField(default=True)),
                ('date_created', models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name='Caption',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('from_recogniser', models.BooleanField(default=False)),
                ('metadata', models.TextField()),
                ('date_created', models.DateTimeField(auto_now_add=True)),
                ('role', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='captions', to='users.Role')),
            ],
        ),
        migrations.CreateModel(
            name='Dictionary',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('project', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='dictionaries', to='client.Project')),
            ],
        ),
        migrations.CreateModel(
            name='Flag',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='FlagInstance',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('caption', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='flags', to='tr.Caption')),
                ('parent', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='instances', to='tr.Flag')),
            ],
        ),
        migrations.CreateModel(
            name='Grammar',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('metadata', models.TextField(default='')),
                ('date_created', models.DateTimeField(auto_now_add=True)),
                ('file', models.FileField(upload_to='grammars')),
                ('project', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='grammars', to='client.Project')),
            ],
        ),
        migrations.CreateModel(
            name='Moderation',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('is_approved', models.BooleanField(default=True)),
                ('comment', models.TextField()),
                ('caption', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='moderations', to='tr.Caption')),
                ('moderator', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='moderations', to='users.Role')),
            ],
        ),
        migrations.CreateModel(
            name='Rule',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('number', models.PositiveIntegerField(default=0)),
                ('name', models.CharField(max_length=255)),
                ('description', models.TextField()),
                ('client', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='rules', to='client.Client')),
            ],
        ),
        migrations.CreateModel(
            name='RuleInstance',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('moderation', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='rules_cited', to='tr.Moderation')),
                ('parent', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='instances', to='tr.Rule')),
            ],
        ),
        migrations.CreateModel(
            name='Token',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('is_tag', models.BooleanField(default=False)),
                ('value', models.CharField(max_length=255)),
                ('dictionary', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='tokens', to='tr.Dictionary')),
            ],
        ),
        migrations.CreateModel(
            name='TokenInstance',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('index', models.IntegerField(default=0)),
                ('caption', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='tokens', to='tr.Caption')),
                ('parent', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='instances', to='tr.Token')),
            ],
        ),
        migrations.CreateModel(
            name='Transcription',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('original_caption', models.CharField(default='', max_length=255)),
                ('date_created', models.DateTimeField(auto_now_add=True)),
                ('requests', models.PositiveIntegerField(default=0)),
                ('request_allowance', models.PositiveIntegerField(default=1)),
                ('date_last_requested', models.DateTimeField(auto_now=True)),
                ('project', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='transcriptions', to='client.Project')),
            ],
        ),
        migrations.CreateModel(
            name='UserDictionary',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('parent', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='children', to='tr.Dictionary')),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='dictionary', to='users.Role')),
            ],
        ),
        migrations.CreateModel(
            name='Utterance',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('file', models.FileField(upload_to=apps.tr.models.utterance.rename_audio_file)),
                ('project', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='utterances', to='client.Project')),
                ('transcription', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='utterance', to='tr.Transcription')),
            ],
        ),
        migrations.AddField(
            model_name='token',
            name='user_dictionary',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='tokens', to='tr.UserDictionary'),
        ),
        migrations.AddField(
            model_name='moderation',
            name='transcription',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='moderations', to='tr.Transcription'),
        ),
        migrations.AddField(
            model_name='caption',
            name='transcription',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='captions', to='tr.Transcription'),
        ),
        migrations.AddField(
            model_name='caption',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='captions', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='automaticqualitytestinstance',
            name='caption',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='corrections', to='tr.Caption'),
        ),
        migrations.AddField(
            model_name='automaticqualitytestinstance',
            name='parent',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='instances', to='tr.AutomaticQualityTest'),
        ),
    ]
