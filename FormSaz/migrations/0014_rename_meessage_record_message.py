# Generated by Django 3.2.8 on 2021-12-24 02:21

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('FormSaz', '0013_auto_20211224_0058'),
    ]

    operations = [
        migrations.RenameField(
            model_name='record',
            old_name='Meessage',
            new_name='Message',
        ),
    ]
