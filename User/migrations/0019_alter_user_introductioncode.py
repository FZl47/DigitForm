# Generated by Django 3.2.8 on 2021-12-28 21:12

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('User', '0018_alter_user_introductioncode'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='IntroductionCode',
            field=models.CharField(default='DALLUFEC', max_length=15),
        ),
    ]
