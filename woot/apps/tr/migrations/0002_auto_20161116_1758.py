# -*- coding: utf-8 -*-
# Generated by Django 1.9 on 2016-11-16 17:58
from __future__ import unicode_literals

import apps.tr.idgen
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('tr', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Phrase',
            fields=[
                ('id', models.CharField(default=apps.tr.idgen.idgen, editable=False, max_length=32, primary_key=True, serialize=False)),
                ('content', models.TextField(default='')),
            ],
        ),
        migrations.CreateModel(
            name='PhraseBlock',
            fields=[
                ('id', models.CharField(default=apps.tr.idgen.idgen, editable=False, max_length=32, primary_key=True, serialize=False)),
                ('date_created', models.DateTimeField(auto_now_add=True)),
                ('date_last_activated', models.DateTimeField(auto_now_add=True)),
                ('is_active', models.BooleanField(default=True)),
                ('metadata', models.TextField(default='')),
                ('parent', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='blocks', to='tr.Phrase')),
                ('role', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='phrase_blocks', to='tr.Role')),
            ],
        ),
        migrations.CreateModel(
            name='PhraseInstance',
            fields=[
                ('id', models.CharField(default=apps.tr.idgen.idgen, editable=False, max_length=32, primary_key=True, serialize=False)),
                ('date_created', models.DateTimeField(auto_now_add=True)),
                ('metadata', models.TextField(default='')),
                ('parent', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='instances', to='tr.Phrase')),
                ('role', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='phrases', to='tr.Role')),
            ],
        ),
        migrations.CreateModel(
            name='TokenShortcut',
            fields=[
                ('id', models.CharField(default=apps.tr.idgen.idgen, editable=False, max_length=32, primary_key=True, serialize=False)),
                ('date_created', models.DateTimeField(auto_now_add=True)),
                ('is_active', models.BooleanField(default=True)),
                ('combo', models.CharField(max_length=255)),
            ],
        ),
        migrations.RemoveField(
            model_name='userdictionary',
            name='parent',
        ),
        migrations.RemoveField(
            model_name='userdictionary',
            name='role',
        ),
        migrations.RemoveField(
            model_name='token',
            name='is_tag',
        ),
        migrations.RemoveField(
            model_name='token',
            name='user_dictionary',
        ),
        migrations.AddField(
            model_name='token',
            name='type',
            field=models.CharField(default='', max_length=255),
        ),
        migrations.AlterField(
            model_name='dictionary',
            name='project',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='dictionary', to='tr.Project'),
        ),
        migrations.AlterField(
            model_name='token',
            name='content',
            field=models.CharField(default='', max_length=255),
        ),
        migrations.AlterField(
            model_name='tokeninstance',
            name='caption',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='tokens', to='tr.CaptionInstance'),
        ),
        migrations.DeleteModel(
            name='UserDictionary',
        ),
        migrations.AddField(
            model_name='tokenshortcut',
            name='parent',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='shortcuts', to='tr.Token'),
        ),
        migrations.AddField(
            model_name='tokenshortcut',
            name='role',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='token_shortcuts', to='tr.Role'),
        ),
        migrations.AddField(
            model_name='phrase',
            name='dictionary',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='phrases', to='tr.Dictionary'),
        ),
        migrations.AddField(
            model_name='tokeninstance',
            name='phrase',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='tokens', to='tr.PhraseInstance'),
        ),
    ]
