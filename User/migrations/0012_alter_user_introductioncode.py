# Generated by Django 3.2.8 on 2021-12-19 02:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('User', '0011_alter_user_introductioncode'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='IntroductionCode',
            field=models.CharField(default='EOGR07VE', max_length=15),
        ),
    ]
