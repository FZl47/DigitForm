from django.db import models
from FormSaz.models import FORM
from Config.Tools import SerializerTool, GetDifferenceTime, RandomString


class User(models.Model):
    NameAndFamily = models.CharField(max_length=50,null=True,blank=True)
    PhoneNumber = models.CharField(max_length=30, null=True, blank=True)
    Coins = models.IntegerField(default=600)
    GetedGiftCompleteInfo = models.BooleanField(default=False)
    IntroductionCode = models.CharField(max_length=15, default=RandomString(8))
    Email = models.CharField(max_length=100)  # User Name
    Password = models.CharField(max_length=100)

    def __str__(self):
        return self.NameAndFamily or 'Unknwoun'

    def GetForms(self):
        return FORM.objects.filter(User_id=self.id).all().order_by('-id')

    def GetForms_JSON(self):
        return SerializerTool(FORM, self.GetForms())

    def GetPurchaseTransaction(self):
        return self.purchasecointransaction_set.all()[::-1]

    def GetSpendTransaction(self):
        return self.spendcoinstransaction_set.all()[::-1]


class BuyCoinModel(models.Model):
    Title = models.CharField(max_length=150)
    Coins = models.IntegerField()
    Description = models.TextField(null=True, blank=True, default='خرید از سایت دیجیت فرم')
    Coins_Gift = models.IntegerField(null=True, blank=True)
    Type = models.CharField(max_length=20)
    Price = models.BigIntegerField()

    def __str__(self):
        return self.Title

    def GetPrice(self):
        return self.Price * 10  # Convert Toman To Rial

    def GetCoins(self):
        return int(self.Coins) + int(self.Coins_Gift or 0)


class PurchaseCoinTransaction(models.Model):
    User = models.ForeignKey('User.User', on_delete=models.CASCADE)
    Coins = models.IntegerField()
    CoinsGift = models.IntegerField()
    TypeModel = models.CharField(max_length=10)
    Price = models.BigIntegerField()
    DateTimePurchase = models.DateTimeField(auto_now_add=True)
    Description = models.TextField()
    Ref_ID = models.CharField(max_length=200)

    def __str__(self):
        return self.User.NameAndFamily

    def GetTimePast(self):
        return GetDifferenceTime(self.DateTimePurchase)


class SpendCoinsTransaction(models.Model):
    User = models.ForeignKey('User.User', on_delete=models.CASCADE)
    Form = models.ForeignKey('FormSaz.FORM', on_delete=models.CASCADE)
    Coins = models.IntegerField()
    DateTimeSpend = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.User.NameAndFamily

    def GetTimePast(self):
        return GetDifferenceTime(self.DateTimeSpend)
