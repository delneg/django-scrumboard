# -*- coding: utf-8 -*-
# Generated by Django 1.10.3 on 2016-11-27 20:24
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ('django_scrumboard', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='task',
            name='status',
            field=models.CharField(
                choices=[('Rejected', 'Rejected'), ('Pending', 'Pending'), ('In progress', 'In progress'),
                         ('Testing', 'Testing'), ('Done', 'Done')], default='Pending', max_length=20,
                verbose_name='Status'),
        ),
    ]
