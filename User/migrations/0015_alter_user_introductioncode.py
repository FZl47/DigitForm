# Generated by Django 3.2.8 on 2021-12-24 00:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('User', '0014_alter_user_introductioncode'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='IntroductionCode',
            field=models.CharField(default='61J9KP86', max_length=15),
        ),
    ]