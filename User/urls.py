from django.urls import path
from .views import *

app_name = 'User'
urlpatterns = [
    path('Panel',Panel),
    path('Panel/BuyCoin/<int:ID>',BuyCoin_SendRequest),
    path('Panel/BuyCoin/VerifyPay/<int:ID>',BuyCoin_VerifyPay),
    path('Panel/SubmitInfo',SubmitInfo),

    path('LoginRegister',LoginRegister),
    path('CheckLoginRegister',CheckLoginRegister),
]


