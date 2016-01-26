# -*- coding: utf-8 -*-
# Generated by Django 1.9 on 2016-01-26 12:55
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('users', '__first__'),
        ('tr', '__first__'),
    ]

    operations = [
        migrations.CreateModel(
            name='ModeratorAbstractAction',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('date_created', models.DateTimeField(auto_now_add=True)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='UserAbstractAction',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('date_created', models.DateTimeField(auto_now_add=True)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='ModeratorOverwatchAction',
            fields=[
                ('moderatorabstractaction_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='action.ModeratorAbstractAction')),
                ('overwatch', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='moderator_actions', to='tr.Overwatch')),
            ],
            options={
                'abstract': False,
            },
            bases=('action.moderatorabstractaction',),
        ),
        migrations.CreateModel(
            name='ModeratorUtteranceAction',
            fields=[
                ('moderatorabstractaction_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='action.ModeratorAbstractAction')),
                ('utterance', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='moderator_actions', to='tr.Utterance')),
            ],
            options={
                'abstract': False,
            },
            bases=('action.moderatorabstractaction',),
        ),
        migrations.CreateModel(
            name='UserOverwatchAction',
            fields=[
                ('userabstractaction_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='action.UserAbstractAction')),
                ('overwatch', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='user_actions', to='tr.Overwatch')),
            ],
            options={
                'abstract': False,
            },
            bases=('action.userabstractaction',),
        ),
        migrations.CreateModel(
            name='UserUtteranceAction',
            fields=[
                ('userabstractaction_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='action.UserAbstractAction')),
                ('utterance', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='user_actions', to='tr.Utterance')),
            ],
            options={
                'abstract': False,
            },
            bases=('action.userabstractaction',),
        ),
        migrations.AddField(
            model_name='userabstractaction',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='actions', to='users.User'),
        ),
        migrations.AddField(
            model_name='moderatorabstractaction',
            name='moderator',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='actions', to='users.Moderator'),
        ),
    ]
