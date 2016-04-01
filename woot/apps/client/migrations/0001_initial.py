# -*- coding: utf-8 -*-
# Generated by Django 1.9 on 2016-04-01 11:06
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Client',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('is_production', models.BooleanField(default=False)),
                ('is_contract', models.BooleanField(default=False)),
            ],
        ),
        migrations.CreateModel(
            name='Project',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('description', models.TextField()),
                ('priority_index', models.PositiveIntegerField(default=0)),
                ('due_date', models.DateTimeField()),
                ('completion_percentage', models.FloatField(default=0.0)),
                ('redundancy_percentage', models.FloatField(default=0.0)),
                ('contract_client', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='contract_projects', to='client.Client')),
                ('production_client', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='production_projects', to='client.Client')),
            ],
        ),
    ]
