# Generated by Django 3.2.8 on 2021-12-18 02:49

from django.db import migrations, models
import django.db.models.deletion
import jsonfield.fields


class Migration(migrations.Migration):

    dependencies = [
        ('FormSaz', '0005_auto_20211218_0240'),
    ]

    operations = [
        migrations.CreateModel(
            name='Record',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('UserCode', models.CharField(max_length=30)),
                ('DICT_DATA', jsonfield.fields.JSONField()),
                ('DateTimeSubmit', models.DateTimeField(auto_now_add=True)),
                ('Form', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='FormSaz.form')),
                ('INPUT_FILES', models.ManyToManyField(to='FormSaz.FileRecord')),
                ('INPUT_IMAGES', models.ManyToManyField(to='FormSaz.ImageRecord')),
            ],
        ),
    ]