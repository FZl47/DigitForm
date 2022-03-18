from django.shortcuts import render, get_object_or_404, redirect
from FormSaz.models import FORM, Record
from Config.Tools import SerializerTool , Set_Cookie_Functionality , ValidationText , ValidationEmail
from Config.User import GetUser_ByMODEL
from Public.models import INFO_DIGITFORM , FAQ , Comment
from django.core.exceptions import PermissionDenied

def Home(request):
    Context = {}
    User = GetUser_ByMODEL(request,'User')
    Context['User'] = User
    Context['Faqs'] = FAQ.objects.filter(Show=True).all().order_by('-id')
    Context['Comments'] = Comment.objects.filter(Show=True).all().order_by('-id')
    return render(request, 'Home/index.html',Context)

def Learn(request):
    Context = {
        'User':GetUser_ByMODEL(request,'User')
    }
    return render(request,'Learn/index.html',Context)


def ContactUs(request):
    Context = {
        'User':GetUser_ByMODEL(request,'User'),
        'INFO_DIGIT':INFO_DIGITFORM.objects.first()
    }
    return render(request,'ContactUs/index.html',Context)


def ViewForm(request, ID_FORM):
    Context = {}
    Form = get_object_or_404(FORM, ID_FORM=ID_FORM)
    UserCode = request.COOKIES.get('UserCode')
    GetRecord = None
    if UserCode != None:
        GetRecord = Record.objects.filter(UserCode=UserCode, Form_id=Form.id).first()

    Context['Form'] = Form
    Context['RecordSubmited'] = False if GetRecord == None else True
    Context['Record'] = GetRecord
    Context['User'] = GetUser_ByMODEL(request,'User')
    if request.method == 'POST':
        if Form.AccessShowForm() == True and Context['RecordSubmited'] == False:
            Context['Form_JSON'] = SerializerTool(FORM, [Form],
                                                  Methods=['GetExpiryDate', 'GetConfig']).strip(
                '[]')
            return render(request, 'ViewForm/index.html', Context)

    return render(request,'ViewForm/PreForm.html',Context)


def SubmitComment(request):
    if request.method == 'POST':
        Data = request.POST
        NameAndFamily = Data.get('NameAndFamily') or None
        Email = Data.get('Email') or None
        Message = Data.get('Message') or None
        if ValidationText(NameAndFamily,3,100) == True and ValidationEmail(Email,3,100) == True and ValidationText(Message,3,2000):
            Comment.objects.create(NameAndFamily=NameAndFamily,Email=Email,Text=Message)
            return Set_Cookie_Functionality('نظر ارزشمند شما با موفقیت ثبت شد', 'Success')
        else:
            return Set_Cookie_Functionality('لطفا فیلد های فرم را به درستی پر نمایید','Error')

    raise PermissionDenied



