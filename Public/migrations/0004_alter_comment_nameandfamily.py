# Generated by Django 3.2.8 on 2022-01-07 00:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Public', '0003_comment_faq'),
    ]

    operations = [
        migrations.AlterField(
            model_name='comment',
            name='NameAndFamily',
            field=models.CharField(max_length=100),
        ),
    ]
