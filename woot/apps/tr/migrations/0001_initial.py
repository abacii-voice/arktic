# -*- coding: utf-8 -*-
# Generated by Django 1.10.6 on 2017-03-11 16:32
from __future__ import unicode_literals

import apps.tr.models.transcription.utterance
from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('users', '__first__'),
    ]

    operations = [
        migrations.CreateModel(
            name='Action',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('context', models.CharField(max_length=255)),
                ('session_index', models.PositiveIntegerField(default=0)),
                ('date_created', models.DateTimeField(auto_now_add=True)),
                ('type', models.CharField(max_length=255)),
                ('metadata', models.TextField(default='')),
            ],
        ),
        migrations.CreateModel(
            name='Attachment',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('index', models.PositiveIntegerField(default=0)),
                ('package_name', models.CharField(max_length=255)),
                ('class_name', models.CharField(max_length=255)),
                ('attach_pk', models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='Batch',
            fields=[
                ('date_created', models.DateTimeField(auto_now_add=True)),
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=255)),
                ('description', models.TextField(default='')),
                ('completion_percentage', models.FloatField(default=0.0)),
                ('redundancy_percentage', models.FloatField(default=0.0)),
                ('deadline', models.DateTimeField(auto_now_add=True)),
                ('priority_index', models.PositiveIntegerField(default=0)),
            ],
        ),
        migrations.CreateModel(
            name='Client',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=255)),
                ('is_production', models.BooleanField(default=False)),
                ('contract_clients', models.ManyToManyField(related_name='production_clients', to='tr.Client')),
                ('users', models.ManyToManyField(related_name='clients', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Cycle',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('start', models.DateTimeField(auto_now_add=True)),
                ('length', models.PositiveIntegerField(default=7)),
                ('is_active', models.BooleanField(default=True)),
            ],
        ),
        migrations.CreateModel(
            name='Day',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('count', models.PositiveIntegerField(default=0)),
                ('is_active', models.BooleanField(default=True)),
                ('cycle', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='days', to='tr.Cycle')),
            ],
        ),
        migrations.CreateModel(
            name='Dictionary',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
            ],
        ),
        migrations.CreateModel(
            name='Email',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('subject', models.CharField(max_length=255)),
                ('date_created', models.DateTimeField(auto_now_add=True)),
                ('text_content', models.TextField()),
                ('html_content', models.TextField()),
            ],
        ),
        migrations.CreateModel(
            name='Flag',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=255)),
                ('client', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='flags', to='tr.Client')),
            ],
        ),
        migrations.CreateModel(
            name='FlagInstance',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('parent', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='instances', to='tr.Flag')),
            ],
        ),
        migrations.CreateModel(
            name='FlagShortcut',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('date_created', models.DateTimeField(auto_now_add=True)),
                ('is_active', models.BooleanField(default=True)),
                ('combo', models.CharField(max_length=255)),
                ('parent', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='shortcuts', to='tr.Flag')),
            ],
        ),
        migrations.CreateModel(
            name='Fragment',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('filename', models.CharField(max_length=255)),
                ('is_reconciled', models.BooleanField(default=False)),
            ],
        ),
        migrations.CreateModel(
            name='Grammar',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=255)),
                ('date_created', models.DateTimeField(auto_now_add=True)),
                ('metadata', models.TextField(default='')),
                ('file', models.FileField(upload_to='grammars')),
                ('client', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='grammars', to='tr.Client')),
            ],
        ),
        migrations.CreateModel(
            name='Message',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('date_created', models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name='MessageToken',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('value', models.CharField(max_length=255)),
                ('index', models.PositiveIntegerField(default=0)),
                ('message', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='tokens', to='tr.Message')),
            ],
        ),
        migrations.CreateModel(
            name='Moderation',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('date_created', models.DateTimeField(auto_now_add=True)),
                ('is_approved', models.BooleanField(default=True)),
                ('is_active', models.BooleanField(default=True)),
                ('is_available', models.BooleanField(default=True)),
                ('metadata', models.TextField(default='')),
            ],
        ),
        migrations.CreateModel(
            name='ModerationFragment',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('index', models.PositiveIntegerField(default=0)),
                ('date_created', models.DateTimeField(auto_now_add=True)),
                ('date_reconciled', models.DateTimeField(auto_now_add=True)),
                ('is_reconciled', models.BooleanField(default=False)),
                ('is_released', models.BooleanField(default=False)),
                ('was_released_by_session', models.BooleanField(default=False)),
                ('parent', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='fragments', to='tr.Moderation')),
                ('session', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='moderation_fragments', to='users.Session')),
            ],
        ),
        migrations.CreateModel(
            name='ModerationInstance',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date_created', models.DateTimeField(auto_now_add=True)),
                ('fragment', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='moderation', to='tr.ModerationFragment')),
            ],
        ),
        migrations.CreateModel(
            name='ModerationToken',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('date_created', models.DateTimeField(auto_now_add=True)),
                ('moderation_limit', models.PositiveIntegerField(default=20)),
                ('is_active', models.BooleanField(default=True)),
            ],
        ),
        migrations.CreateModel(
            name='Phrase',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('content', models.TextField(default='')),
                ('dictionary', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='phrases', to='tr.Dictionary')),
            ],
        ),
        migrations.CreateModel(
            name='PhraseInstance',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('from_recogniser', models.BooleanField(default=False)),
                ('date_created', models.DateTimeField(auto_now_add=True)),
                ('metadata', models.TextField(default='')),
                ('parent', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='instances', to='tr.Phrase')),
            ],
        ),
        migrations.CreateModel(
            name='PhraseSubscription',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('date_created', models.DateTimeField(auto_now_add=True)),
                ('date_last_activated', models.DateTimeField(auto_now_add=True)),
                ('is_active', models.BooleanField(default=True)),
                ('metadata', models.TextField(default='')),
                ('parent', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='subscriptions', to='tr.Phrase')),
            ],
        ),
        migrations.CreateModel(
            name='Project',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=255)),
                ('date_created', models.DateTimeField(auto_now_add=True)),
                ('description', models.TextField(default='')),
                ('combined_priority_index', models.PositiveIntegerField(default=0)),
                ('is_active', models.BooleanField(default=False)),
                ('contract_client', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='contract_projects', to='tr.Client')),
                ('production_client', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='production_projects', to='tr.Client')),
            ],
            options={
                'get_latest_by': 'date_created',
            },
        ),
        migrations.CreateModel(
            name='QualityCheck',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=255)),
                ('is_automatic', models.BooleanField(default=True)),
                ('client', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='checks', to='tr.Client')),
            ],
        ),
        migrations.CreateModel(
            name='QualityCheckInstance',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('is_successful', models.BooleanField(default=True)),
                ('date_created', models.DateTimeField(auto_now_add=True)),
                ('parent', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='instances', to='tr.QualityCheck')),
            ],
        ),
        migrations.CreateModel(
            name='Role',
            fields=[
                ('date_created', models.DateTimeField(auto_now_add=True)),
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('type', models.CharField(max_length=255)),
                ('display', models.CharField(max_length=255)),
                ('status', models.CharField(default='pending', max_length=255)),
                ('time_zone', models.CharField(max_length=255)),
                ('client', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='roles', to='tr.Client')),
                ('project', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='assigned', to='tr.Project')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='roles', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Rule',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('number', models.PositiveIntegerField(default=0)),
                ('name', models.CharField(max_length=255)),
                ('description', models.TextField(default='')),
                ('client', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='rules', to='tr.Client')),
                ('project', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='rules', to='tr.Project')),
            ],
        ),
        migrations.CreateModel(
            name='RuleInstance',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('parent', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='instances', to='tr.Rule')),
                ('role', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='rules_cited', to='tr.Role')),
            ],
        ),
        migrations.CreateModel(
            name='Stat',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='StatInstance',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('value', models.FloatField(default=0.0)),
                ('date_created', models.DateTimeField(auto_now_add=True)),
                ('parent', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='instances', to='tr.Stat')),
                ('role', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='stats', to='tr.Role')),
            ],
        ),
        migrations.CreateModel(
            name='Threshold',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('date_created', models.DateTimeField(auto_now_add=True)),
                ('is_active', models.BooleanField(default=True)),
                ('index', models.PositiveIntegerField(default=0)),
                ('transcription_threshold', models.PositiveIntegerField(default=0)),
                ('transcriptions_done', models.PositiveIntegerField(default=0)),
                ('moderations_done', models.PositiveIntegerField(default=0)),
                ('goal_percentage', models.FloatField(default=0.0)),
                ('reached_percentage', models.FloatField(default=0.0)),
                ('project', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='thresholds', to='tr.Project')),
                ('role', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='thresholds', to='tr.Role')),
            ],
        ),
        migrations.CreateModel(
            name='Token',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('type', models.CharField(default='', max_length=255)),
                ('content', models.CharField(default='', max_length=255)),
                ('dictionary', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='tokens', to='tr.Dictionary')),
            ],
        ),
        migrations.CreateModel(
            name='TokenInstance',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('index', models.IntegerField(default=0)),
                ('parent', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='instances', to='tr.Token')),
                ('phrase', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='tokens', to='tr.Phrase')),
            ],
        ),
        migrations.CreateModel(
            name='TokenShortcut',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('date_created', models.DateTimeField(auto_now_add=True)),
                ('is_active', models.BooleanField(default=True)),
                ('combo', models.CharField(max_length=255)),
                ('parent', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='shortcuts', to='tr.Token')),
                ('role', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='token_shortcuts', to='tr.Role')),
            ],
        ),
        migrations.CreateModel(
            name='Transcription',
            fields=[
                ('date_created', models.DateTimeField(auto_now_add=True)),
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('filename', models.CharField(max_length=255)),
                ('is_active', models.BooleanField(default=True)),
                ('is_available', models.BooleanField(default=True)),
                ('requests', models.PositiveIntegerField(default=0)),
                ('request_allowance', models.PositiveIntegerField(default=1)),
                ('date_last_requested', models.DateTimeField(auto_now=True)),
                ('batch', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='transcriptions', to='tr.Batch')),
                ('content', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='transcriptions', to='tr.Phrase')),
                ('grammar', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='transcriptions', to='tr.Grammar')),
                ('project', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='transcriptions', to='tr.Project')),
            ],
        ),
        migrations.CreateModel(
            name='TranscriptionFragment',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('index', models.PositiveIntegerField(default=0)),
                ('date_created', models.DateTimeField(auto_now_add=True)),
                ('date_reconciled', models.DateTimeField(auto_now_add=True)),
                ('is_reconciled', models.BooleanField(default=False)),
                ('is_released', models.BooleanField(default=False)),
                ('was_released_by_session', models.BooleanField(default=False)),
                ('parent', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='fragments', to='tr.Transcription')),
                ('session', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='transcription_fragments', to='users.Session')),
            ],
        ),
        migrations.CreateModel(
            name='TranscriptionInstance',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('key', models.CharField(max_length=8)),
                ('date_created', models.DateTimeField(auto_now_add=True)),
                ('fragment', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='transcriptions', to='tr.TranscriptionFragment')),
                ('parent', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='instances', to='tr.Transcription')),
                ('phrase', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='transcription', to='tr.PhraseInstance')),
            ],
        ),
        migrations.CreateModel(
            name='TranscriptionToken',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('date_created', models.DateTimeField(auto_now_add=True)),
                ('transcription_limit', models.PositiveIntegerField(default=5)),
                ('is_active', models.BooleanField(default=True)),
                ('project', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='transcription_tokens', to='tr.Project')),
                ('role', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='transcription_tokens', to='tr.Role')),
            ],
        ),
        migrations.CreateModel(
            name='Upload',
            fields=[
                ('date_created', models.DateTimeField(auto_now_add=True)),
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('archive_name', models.CharField(default='', max_length=255)),
                ('is_complete', models.BooleanField(default=False)),
                ('batch', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='uploads', to='tr.Batch')),
            ],
        ),
        migrations.CreateModel(
            name='Utterance',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('file', models.FileField(upload_to=apps.tr.models.transcription.utterance.rename_audio_file)),
                ('transcription', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='utterance', to='tr.Transcription')),
            ],
        ),
        migrations.AddField(
            model_name='transcriptioninstance',
            name='token',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='transcriptions', to='tr.TranscriptionToken'),
        ),
        migrations.AddField(
            model_name='transcriptionfragment',
            name='token',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='fragments', to='tr.TranscriptionToken'),
        ),
        migrations.AddField(
            model_name='ruleinstance',
            name='transcription',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='rules_cited', to='tr.TranscriptionInstance'),
        ),
        migrations.AddField(
            model_name='qualitycheckinstance',
            name='transcription',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='checks', to='tr.TranscriptionInstance'),
        ),
        migrations.AddField(
            model_name='phrasesubscription',
            name='role',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='phrase_subscriptions', to='tr.Role'),
        ),
        migrations.AddField(
            model_name='phraseinstance',
            name='role',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='phrases', to='tr.Role'),
        ),
        migrations.AddField(
            model_name='moderationtoken',
            name='project',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='moderation_tokens', to='tr.Project'),
        ),
        migrations.AddField(
            model_name='moderationtoken',
            name='role',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='moderation_tokens', to='tr.Role'),
        ),
        migrations.AddField(
            model_name='moderationinstance',
            name='moderator',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='moderations', to='tr.Role'),
        ),
        migrations.AddField(
            model_name='moderationinstance',
            name='parent',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='instances', to='tr.Moderation'),
        ),
        migrations.AddField(
            model_name='moderationinstance',
            name='phrase',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='moderation', to='tr.PhraseInstance'),
        ),
        migrations.AddField(
            model_name='moderationinstance',
            name='token',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='moderations', to='tr.ModerationToken'),
        ),
        migrations.AddField(
            model_name='moderationfragment',
            name='token',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='fragments', to='tr.ModerationToken'),
        ),
        migrations.AddField(
            model_name='moderation',
            name='project',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='moderations', to='tr.Project'),
        ),
        migrations.AddField(
            model_name='moderation',
            name='transcription',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='moderations', to='tr.TranscriptionInstance'),
        ),
        migrations.AddField(
            model_name='message',
            name='from_user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='messages_from', to='tr.Role'),
        ),
        migrations.AddField(
            model_name='message',
            name='to_user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='messages_to', to='tr.Role'),
        ),
        migrations.AddField(
            model_name='fragment',
            name='upload',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='fragments', to='tr.Upload'),
        ),
        migrations.AddField(
            model_name='flagshortcut',
            name='role',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='flag_shortcuts', to='tr.Role'),
        ),
        migrations.AddField(
            model_name='flaginstance',
            name='role',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='flags', to='tr.Role'),
        ),
        migrations.AddField(
            model_name='flaginstance',
            name='transcription',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='flags', to='tr.TranscriptionInstance'),
        ),
        migrations.AddField(
            model_name='email',
            name='from_user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='emails_from', to='tr.Role'),
        ),
        migrations.AddField(
            model_name='email',
            name='to_user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='emails_to', to='tr.Role'),
        ),
        migrations.AddField(
            model_name='dictionary',
            name='grammar',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='dictionaries', to='tr.Grammar'),
        ),
        migrations.AddField(
            model_name='dictionary',
            name='project',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='dictionary', to='tr.Project'),
        ),
        migrations.AddField(
            model_name='day',
            name='role',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='days', to='tr.Role'),
        ),
        migrations.AddField(
            model_name='cycle',
            name='role',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='cycles', to='tr.Role'),
        ),
        migrations.AddField(
            model_name='batch',
            name='project',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='batches', to='tr.Project'),
        ),
        migrations.AddField(
            model_name='attachment',
            name='message',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='attachments', to='tr.Message'),
        ),
        migrations.AddField(
            model_name='action',
            name='role',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='actions', to='tr.Role'),
        ),
        migrations.AddField(
            model_name='action',
            name='session',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='actions', to='users.Session'),
        ),
    ]
