# Generated by Django 3.2.8 on 2021-12-28 21:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('User', '0017_alter_user_introductioncode'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='IntroductionCode',
            field=models.CharField(default='JAZKZLIM', max_length=15),
        ),
    ]
