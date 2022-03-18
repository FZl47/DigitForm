from django.shortcuts import render, redirect, get_object_or_404
from django.http import HttpResponse, JsonResponse, Http404
from django.views.decorators.csrf import csrf_exempt
from django.core.exceptions import PermissionDenied
from Config.User import GetUser_ByMODEL, Decode, UnDecode, FIELD_PASSWORD, FIELD_USERNAME
from Config.Tools import *
from .models import BuyCoinModel, PurchaseCoinTransaction, User
from Config.settings import MERCHANT, ZP_API_REQUEST, ZP_API_STARTPAY, ZP_API_VERIFY, CallbackURLPay
import json, requests


def Panel(request):
    Context = {}
    User = GetUser_ByMODEL(request, 'User')
    if User != None:
        Context['User'] = User
        Context['BuyCoinModels'] = BuyCoinModel.objects.all()
        return render(request, 'Panel.html', Context)
    return redirect('/User/LoginRegister')


def SubmitInfo(request):
    UserCurrent = GetUser_ByMODEL(request, 'User')
    if UserCurrent != None:
        if request.method == 'POST' and request.is_ajax() == False:
            Context = {}
            STATUS = '200'
            Data = request.POST
            NameAndFamily = Data.get('NameAndFamily')
            PhoneNumber = Data.get('PhoneNumber')
            Email = Data.get('Email')
            Password = Data.get('Password')

            if ValidationText(NameAndFamily, 3, 50) == False:
                Context['Status'] = '204'
                Context['Status_Text'] = 'لطفا فیلد نام و نام خانوادگی را به درستی وارد نمایید'
                STATUS = '204'
            else:
                UserCurrent.NameAndFamily = NameAndFamily

            if ValidationText(PhoneNumber, 10, 12) == False:
                Context['Status'] = '204'
                Context['Status_Text'] = 'لطفا فیلد شماره همراه را به درستی وارد نمایید'
                STATUS = '204'
            else:
                UserCurrent.PhoneNumber = PhoneNumber

            # if ValidationEmail(Email, 3, 100) == False:
            #     Context['Status'] = '204'
            #     Context['Status_Text'] = 'لطفا فیلد ایمیل را به درستی وارد نمایید'
            #     STATUS = '204'
            # else:
            #     EmailIsUsed = User.objects.filter(Email=Email).exclude(id=UserCurrent.id).first()
            #     if EmailIsUsed != None:
            #         Context['Status'] = '403'
            #         Context['Status_Text'] = 'ایمیل وارد شده در سیستم ثبت شده است'
            #         STATUS = '403'
            #     else:
            #         pass
            #         # UserCurrent.Email = Email

            if ValidationText(Password, 7, 100, True, True) == False:
                Context['Status'] = '204'
                Context['Status_Text'] = 'لطفا فیلد رمز ورود را به درستی وارد نمایید'
                STATUS = '204'
            else:
                UserCurrent.Password = Password

            if STATUS == '200':
                if UserCurrent.GetedGiftCompleteInfo == False:
                    UserCurrent.Coins += 200
                    PurchaseCoinTransaction.objects.create(User_id=UserCurrent.id, Coins=0, CoinsGift=200,
                                                           TypeModel='-', Price=0,
                                                           Description='200 سکه هدیه برای تکمیل مشخصات حساب کاربری',
                                                           Ref_ID='-')
                UserCurrent.GetedGiftCompleteInfo = True
                UserCurrent.save()
                return Set_Cookie_Functionality("اطلاعات شما با موفقیت ثبت شدند", 'Success', RedirectTo='/User/Panel')
            else:
                return Set_Cookie_Functionality(Context['Status_Text'], 'Error', 6000, List=True,
                                                RedirectTo='/User/Panel?Info')

    raise PermissionDenied


def LoginRegister(request):
    User = GetUser_ByMODEL(request, 'User')
    if User == None:
        return render(request, 'LoginRegister.html')
    return redirect('/User/Panel')


@csrf_exempt
def CheckLoginRegister(request):
    if request.method == 'POST' and request.is_ajax():
        Context = {}
        Data = None
        try:
            Data = json.loads(request.body)
        except:
            Context['Status'] = '500'
            Context['Status_Text'] = 'مشکلی در تجزیه دیتا وجود دارد'
            return JsonResponse(Context)
        if Data != None:
            TypeForm = Data.get('TypeForm')
            if TypeForm == 'Login':
                Email = Data.get('Email')
                Password = Data.get('Password')
                if ValidationEmail(Email, 3, 100) == True and ValidationText(Password, 7, 100, True, True) == True:
                    FindUser = User.objects.filter(Email=Email, Password=Password).first()
                    if FindUser != None:
                        Email = Decode(Email)
                        Password = Decode(Password)
                        Context[FIELD_USERNAME] = Email
                        Context[FIELD_PASSWORD] = Password
                        Context['Status'] = '200'
                        Context['Status_Text'] = 'خوش امدید'
                    else:
                        Context['Status'] = '404'
                        Context['Status_Text'] = 'کاربری با این مشخصات یافت نشد'
                else:
                    Context['Status'] = '204'
                    Context['Status_Text'] = 'لطفا فیلد هارا به درستی وارد نمایید'
            elif TypeForm == 'Register':
                Email = Data.get('Email')
                Password = Data.get('Password')
                Password2 = Data.get('Password2')
                IntroductionCode = Data.get('IntroductionCode')
                if ValidationEmail(Email, 3, 100) == True and ValidationText(Password, 7,
                                                                             100) == True and ValidationText(Password2,
                                                                                                             7,
                                                                                                             100) == True and Password == Password2 and ValidationText(
                    IntroductionCode, -1, 9) == True:
                    FindUser = User.objects.filter(Email=Email).first()
                    if FindUser == None:
                        Coins = 600
                        StateUseIntroductionCode = False
                        StateValidIntroCode = False
                        if IntroductionCode != '':
                            StateUseIntroductionCode = True
                            UserIntroductionCode = User.objects.filter(IntroductionCode=IntroductionCode).exclude(Email=Email).first()
                            if UserIntroductionCode != None:
                                StateValidIntroCode = True
                                PurchaseCoinTransaction.objects.create(User_id=UserIntroductionCode.id, Coins=0, CoinsGift=200,
                                                                       TypeModel='-', Price=0,
                                                                       Description='200 سکه هدیه برای استفاده از کد معرفی شما',
                                                                       Ref_ID='-')
                                UserIntroductionCode.Coins += 200
                                UserIntroductionCode.save()
                                Coins = 800
                            else:
                                StateValidIntroCode = False
                                Context['Status'] = '204'
                                Context['Status_Text'] = 'کد معرفی وارد شده نامعتبر است'
                        if StateUseIntroductionCode == True:
                            if StateValidIntroCode == True:
                                UserCreate = User.objects.create(Email=Email, Password=Password2, Coins=Coins)
                                PurchaseCoinTransaction.objects.create(User_id=UserCreate.id, Coins=0, CoinsGift=200,
                                                                       TypeModel='-', Price=0,
                                                                       Description='200 سکه هدیه برای استفاده از کد معرفی',
                                                                       Ref_ID='-')
                                Context[FIELD_USERNAME] = Decode(Email)
                                Context[FIELD_PASSWORD] = Decode(Password2)
                                Context['Status'] = '200'
                                Context['Status_Text'] = 'خوش امدید'
                        else:
                            UserCreate = User.objects.create(Email=Email, Password=Password2, Coins=Coins)
                            Context[FIELD_USERNAME] = Decode(Email)
                            Context[FIELD_PASSWORD] = Decode(Password2)
                            Context['Status'] = '200'
                            Context['Status_Text'] = 'خوش امدید'
                    else:
                        Context['Status'] = '409'
                        Context['Status_Text'] = 'ایمیل وارد شده از قبل ثبت شده است'
                else:
                    Context['Status'] = '204'
                    Context['Status_Text'] = 'لطفا فیلد هارا به درستی وارد نمایید'
        return JsonResponse(Context)
    raise PermissionDenied


def BuyCoin_SendRequest(request, ID):
    User = GetUser_ByMODEL(request, 'User')

    if User != None:
        # Send request
        BuyCoinModelGet = get_object_or_404(BuyCoinModel, id=ID)
        if BuyCoinModelGet != None:
            Amount = BuyCoinModelGet.GetPrice()
            Description = BuyCoinModelGet.Description
            DataPortal_Body = {
                "merchant_id": MERCHANT,
                "amount": Amount,
                "callback_url": f"{CallbackURLPay}/{BuyCoinModelGet.id}",
                "description": Description,
                # "metadata": {"mobile": mobile, "email": email}
            }
            DataPortal_Header = {
                "accept": "application/json",
                "content-type": "application/json'"
            }
            DataPortal_Body = json.dumps(DataPortal_Body)
            Req = None
            try:
                Req = requests.post(url=ZP_API_REQUEST, data=DataPortal_Body, headers=DataPortal_Header)
                Response = Req.json()
                if len(Response['errors']) == 0:
                    Authority = Response['data']['authority']
                    return redirect(ZP_API_STARTPAY.format(authority=Authority))
                else:
                    return Set_Cookie_Functionality("مشکلی در خرید سکه و اعتبار وجود دارد", 'Error',
                                                    RedirectTo='/User/Panel?ManagementCoin')
            except:
                return Set_Cookie_Functionality("مشکل در برقراری ارتباط لطفا اینترنت خود را چک کنید", 'Error',
                                                RedirectTo='/User/Panel?ManagementCoin')
        else:
            raise Http404
    else:
        return redirect('/User/LoginRegister')


def BuyCoin_VerifyPay(request, ID):
    User = GetUser_ByMODEL(request, 'User')
    if User != None:
        BuyCoinModelGet = get_object_or_404(BuyCoinModel, id=ID)
        if BuyCoinModelGet != None:
            Status_Pay = request.GET.get('Status')
            Authority = request.GET.get('Authority')
            Amount = BuyCoinModelGet.GetPrice()
            if Status_Pay == 'OK':
                DataPortal_Body = {
                    "merchant_id": MERCHANT,
                    "amount": Amount,
                    "authority": Authority
                }
                DataPortal_Header = {
                    "accept": "application/json",
                    "content-type": "application/json'"
                }
                DataPortal_Body = json.dumps(DataPortal_Body)
                try:
                    Req = requests.post(url=ZP_API_VERIFY, data=DataPortal_Body, headers=DataPortal_Header)
                    Response = Req.json()
                    if len(Response['errors']) == 0:
                        StatusCode = Response['data']['code']
                        if StatusCode == 100:
                            Ref_ID = Response['data']['ref_id']
                            User.Coins += BuyCoinModelGet.GetCoins()
                            User.save()
                            PurchaseCoinTransaction.objects.create(User_id=User.id, Coins=BuyCoinModelGet.Coins,
                                                                   CoinsGift=BuyCoinModelGet.Coins_Gift,
                                                                   TypeModel=BuyCoinModelGet.Type, Price=Amount,
                                                                   Description=BuyCoinModelGet.Description,
                                                                   Ref_ID=Ref_ID)
                            return Set_Cookie_Functionality("عملیات پرداخت با موفقیت انجام شد", 'Success', Timer='7000',
                                                            RedirectTo='/User/Panel?ManagementCoin')
                        else:
                            return Set_Cookie_Functionality(Response['data']['message'], 'Error', Timer='7000',
                                                            RedirectTo='/User/Panel?ManagementCoin')
                except:
                    return Set_Cookie_Functionality("مشکل در برقراری ارتباط لطفا اینترنت خود را چک کنید", 'Error',
                                                    RedirectTo='/User/Panel?ManagementCoin')
            else:
                return Set_Cookie_Functionality("عملیات پرداخت ناموفق بود", 'Error', Timer='7000',
                                                RedirectTo='/User/Panel?ManagementCoin')
        else:
            raise Http404
    else:
        raise PermissionDenied
