# Generated by Django 3.2.8 on 2021-12-18 02:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('User', '0003_alter_user_introductioncode'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='IntroductionCode',
            field=models.CharField(default='LGO8AC6G', max_length=15),
        ),
    ]
