# Generated by Django 3.2.8 on 2021-12-19 02:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('User', '0010_alter_user_introductioncode'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='IntroductionCode',
            field=models.CharField(default='FVCCXWM9', max_length=15),
        ),
    ]
