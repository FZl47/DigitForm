# Generated by Django 3.2.8 on 2021-12-09 01:34

import FormSaz.models
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('FormSaz', '0001_initial'),
        ('User', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='form',
            name='User',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='User.user'),
        ),
        migrations.AddField(
            model_name='base_element',
            name='Config',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='FormSaz.config_base'),
        ),
        migrations.AddField(
            model_name='base_element',
            name='ElementsCLASS_Secondary',
            field=models.ManyToManyField(blank=True, null=True, related_name='Elements_CLASS_Secondary', to='FormSaz.BASE_ELEMENT'),
        ),
        migrations.AddField(
            model_name='base_element',
            name='Parent',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='FormSaz.base_element'),
        ),
        migrations.AddField(
            model_name='base_element',
            name='Style',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='FormSaz.style_base'),
        ),
        migrations.CreateModel(
            name='FIELD_EMAIL',
            fields=[
                ('box_element_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='FormSaz.box_element')),
            ],
            bases=('FormSaz.box_element',),
        ),
        migrations.CreateModel(
            name='FIELD_NAMEANDFAMILY',
            fields=[
                ('box_element_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='FormSaz.box_element')),
            ],
            bases=('FormSaz.box_element',),
        ),
        migrations.CreateModel(
            name='FIELD_NATIONALCODE',
            fields=[
                ('box_element_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='FormSaz.box_element')),
            ],
            bases=('FormSaz.box_element',),
        ),
        migrations.CreateModel(
            name='FIELD_PHONENUMBER',
            fields=[
                ('box_element_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='FormSaz.box_element')),
            ],
            bases=('FormSaz.box_element',),
        ),
        migrations.CreateModel(
            name='INPUT_CHAR',
            fields=[
                ('input_base_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='FormSaz.input_base')),
            ],
            bases=('FormSaz.input_base',),
        ),
        migrations.CreateModel(
            name='INPUT_CHECKBOX',
            fields=[
                ('input_base_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='FormSaz.input_base')),
            ],
            bases=('FormSaz.input_base',),
        ),
        migrations.CreateModel(
            name='INPUT_DATE',
            fields=[
                ('input_base_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='FormSaz.input_base')),
            ],
            bases=('FormSaz.input_base',),
        ),
        migrations.CreateModel(
            name='INPUT_EMAIL',
            fields=[
                ('input_base_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='FormSaz.input_base')),
            ],
            bases=('FormSaz.input_base',),
        ),
        migrations.CreateModel(
            name='INPUT_FILE',
            fields=[
                ('input_base_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='FormSaz.input_base')),
                ('File', models.FileField(upload_to=FormSaz.models.UploadInputFileSrc)),
            ],
            bases=('FormSaz.input_base',),
        ),
        migrations.CreateModel(
            name='INPUT_IMAGE',
            fields=[
                ('input_base_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='FormSaz.input_base')),
                ('Image', models.ImageField(upload_to=FormSaz.models.UploadInputImageSrc)),
            ],
            bases=('FormSaz.input_base',),
        ),
        migrations.CreateModel(
            name='INPUT_NUMBER',
            fields=[
                ('input_base_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='FormSaz.input_base')),
            ],
            bases=('FormSaz.input_base',),
        ),
        migrations.CreateModel(
            name='INPUT_PASSWORD',
            fields=[
                ('input_base_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='FormSaz.input_base')),
            ],
            bases=('FormSaz.input_base',),
        ),
        migrations.CreateModel(
            name='INPUT_RADIO',
            fields=[
                ('input_base_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='FormSaz.input_base')),
            ],
            bases=('FormSaz.input_base',),
        ),
        migrations.CreateModel(
            name='INPUT_TEXTAREA',
            fields=[
                ('input_base_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='FormSaz.input_base')),
            ],
            bases=('FormSaz.input_base',),
        ),
        migrations.CreateModel(
            name='INPUT_TIME',
            fields=[
                ('input_base_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='FormSaz.input_base')),
            ],
            bases=('FormSaz.input_base',),
        ),
        migrations.CreateModel(
            name='Question_Base',
            fields=[
                ('box_element_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='FormSaz.box_element')),
                ('ConfigQuiz', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='FormSaz.config_base_quiz')),
            ],
            bases=('FormSaz.box_element',),
        ),
        migrations.AddField(
            model_name='page_element',
            name='ElementsCLASS',
            field=models.ManyToManyField(blank=True, null=True, related_name='Elements_CLASS_Page', to='FormSaz.BASE_ELEMENT'),
        ),
        migrations.AddField(
            model_name='page_element',
            name='Form',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='FormSaz.form'),
        ),
        migrations.AddField(
            model_name='input_base',
            name='Validation',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='FormSaz.validation_base'),
        ),
        migrations.AddField(
            model_name='box_element',
            name='ElementsCLASS',
            field=models.ManyToManyField(blank=True, null=True, related_name='Elements_CLASS_Box', to='FormSaz.BASE_ELEMENT'),
        ),
        migrations.AddField(
            model_name='box_element',
            name='Page',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='FormSaz.page_element'),
        ),
        migrations.AddField(
            model_name='base_element',
            name='ElementsCLASS_Alert',
            field=models.ManyToManyField(blank=True, null=True, related_name='Elements_CLASS_Alert', to='FormSaz.TAG_P'),
        ),
        migrations.AddField(
            model_name='base_element',
            name='ElementsCLASS_Text',
            field=models.ManyToManyField(blank=True, null=True, related_name='Elements_CLASS_Text', to='FormSaz.TAG_P'),
        ),
        migrations.AddField(
            model_name='base_element',
            name='ElementsCLASS_Title',
            field=models.ManyToManyField(blank=True, null=True, related_name='Elements_CLASS_Title', to='FormSaz.TAG_H3'),
        ),
        migrations.CreateModel(
            name='QUESTION_DESCRIPTIVE',
            fields=[
                ('question_base_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='FormSaz.question_base')),
            ],
            bases=('FormSaz.question_base',),
        ),
        migrations.CreateModel(
            name='QUESTION_TEST',
            fields=[
                ('question_base_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='FormSaz.question_base')),
            ],
            bases=('FormSaz.question_base',),
        ),
    ]
