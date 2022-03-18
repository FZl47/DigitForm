# Generated by Django 3.2.8 on 2021-12-18 02:27

import FormSaz.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('FormSaz', '0003_base_element_type_base'),
    ]

    operations = [
        migrations.CreateModel(
            name='ImageRecord',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('Title', models.CharField(blank=True, max_length=100, null=True)),
                ('Image', models.ImageField(upload_to=FormSaz.models.UploadInputImageSrc)),
            ],
        ),
        migrations.RemoveField(
            model_name='input_file',
            name='File',
        ),
        migrations.RemoveField(
            model_name='input_image',
            name='Image',
        ),
    ]