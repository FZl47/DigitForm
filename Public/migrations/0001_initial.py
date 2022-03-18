# Generated by Django 3.2.8 on 2021-12-28 21:19

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='INFO_DIGITFORM',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('PhoneNumber', models.CharField(blank=True, max_length=100, null=True)),
                ('Email', models.CharField(blank=True, max_length=100, null=True)),
                ('Address', models.TextField(blank=True, null=True)),
                ('ID_Telegram', models.CharField(blank=True, max_length=100, null=True)),
                ('ID_Instagram', models.CharField(blank=True, max_length=100, null=True)),
                ('ContactUs_Desciption', models.TextField(blank=True, null=True)),
                ('AboutUs_Description', models.TextField(blank=True, null=True)),
            ],
        ),
    ]
