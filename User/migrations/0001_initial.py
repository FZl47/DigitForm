# Generated by Django 3.2.8 on 2021-12-09 01:34

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('FormSaz', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='BuyCoinModel',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('Title', models.CharField(max_length=150)),
                ('Coins', models.IntegerField()),
                ('Description', models.TextField(blank=True, default='خرید از سایت دیجیت فرم', null=True)),
                ('Coins_Gift', models.IntegerField(blank=True, null=True)),
                ('Type', models.CharField(max_length=20)),
                ('Price', models.BigIntegerField()),
            ],
        ),
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('NameAndFamily', models.CharField(blank=True, max_length=50, null=True)),
                ('PhoneNumber', models.CharField(blank=True, max_length=30, null=True)),
                ('Coins', models.IntegerField(default=600)),
                ('GetedGiftCompleteInfo', models.BooleanField(default=False)),
                ('IntroductionCode', models.CharField(default='RIVR8MFR', max_length=15)),
                ('Email', models.CharField(max_length=100)),
                ('Password', models.CharField(max_length=100)),
            ],
        ),
        migrations.CreateModel(
            name='SpendCoinsTransaction',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('Coins', models.IntegerField()),
                ('DateTimeSpend', models.DateTimeField(auto_now_add=True)),
                ('Form', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='FormSaz.form')),
                ('User', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='User.user')),
            ],
        ),
        migrations.CreateModel(
            name='PurchaseCoinTransaction',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('Coins', models.IntegerField()),
                ('CoinsGift', models.IntegerField()),
                ('TypeModel', models.CharField(max_length=10)),
                ('Price', models.BigIntegerField()),
                ('DateTimePurchase', models.DateTimeField(auto_now_add=True)),
                ('Description', models.TextField()),
                ('Ref_ID', models.CharField(max_length=200)),
                ('User', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='User.user')),
            ],
        ),
    ]
