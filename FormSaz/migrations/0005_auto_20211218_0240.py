# Generated by Django 3.2.8 on 2021-12-18 02:40

import FormSaz.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('FormSaz', '0004_auto_20211218_0227'),
    ]

    operations = [
        migrations.CreateModel(
            name='FileRecord',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('Title', models.CharField(blank=True, max_length=100, null=True)),
                ('File', models.FileField(blank=True, null=True, upload_to=FormSaz.models.UploadInputFileSrc)),
            ],
        ),
        migrations.AlterField(
            model_name='imagerecord',
            name='Image',
            field=models.ImageField(blank=True, null=True, upload_to=FormSaz.models.UploadInputImageSrc),
        ),
    ]