import json
from django.http import JsonResponse
from django.shortcuts import redirect
from django.views.decorators.csrf import csrf_exempt
from User.models import User
from .Security import Decode , UnDecode


MODELS = [
    {'MODEL':User,'UserNameField':'Email','PasswordField':'Password'}
]


FIELD_USERNAME = 'QlYSqVS_'
FIELD_PASSWORD = 'YPtIeRC_'



def GetUser(request, MODEL, UserNameField, PasswordField, TypeReturn='Object', URL='No',**kwargs):
    Context = {}
    UserState = None
    Context['User'] = None
    UserNameAccount = request.COOKIES.get(FIELD_USERNAME) # User Name
    UserPasswordAccount = request.COOKIES.get(FIELD_PASSWORD) # Password
    if UserNameAccount != 'None*_' and UserPasswordAccount != 'None*_':
        if (UserNameAccount != None and UserNameAccount != '' and UserNameAccount != ' ') and (
            UserPasswordAccount != None and UserPasswordAccount != '' and UserPasswordAccount != ' '):
            UserPasswordAccount = UnDecode(UserPasswordAccount)
            UserNameAccount = UnDecode(UserNameAccount)
            if UserPasswordAccount != None and UserPasswordAccount != None:
                UserState = MODEL.objects.filter(**{UserNameField : UserNameAccount}, **{PasswordField : UserPasswordAccount}).first()
    if TypeReturn == 'Object':
        Context['User'] = UserState
    # if URL != 'No' and UserState is None:   Not Work
    #     return redirect(URL)
    return Context['User']


def GetUser_ByMODEL(request,MODEL_NAME,Type='Object',URL='No',**kwargs):
    FieldsReturn = kwargs.get('FieldsReturn')
    UserName = kwargs.get('UserName')
    Password = kwargs.get('Password')
    try:
        for MODEL in MODELS:
            ModelFind = MODEL.get('MODEL')
            if ModelFind.__name__ == MODEL_NAME:
                UserNameField = MODEL.get('UserNameField')
                PasswordField = MODEL.get('PasswordField')
                Object = GetUser(request, ModelFind, UserNameField, PasswordField, TypeReturn=Type, URL=URL,UserName=UserName,Password=Password)
                if FieldsReturn is not None and Object is not None:
                    Context = {}
                    for Field in FieldsReturn:
                        try:
                            Field_Name = str(Field).split(':')[0]
                            Field_Set = str(Field).split(':')[1]
                            Context[Field_Set] = getattr(Object, Field_Name)
                        except:
                            Context[Field] = getattr(Object, Field)
                    return Context
                return Object
    except:
        return None

@csrf_exempt
def GetInformationSec(request):
    Context = {}
    if request.is_ajax() and request.method == 'POST':
        try:
            Data = json.loads(request.body)
            MODEL_NAME = Data.get('MODEL_NAME')
            UserName = Data.get('QlYSqVS_')
            Password = Data.get('YPtIeRC_')
            Object = GetUser_ByMODEL(request, MODEL_NAME,FieldsReturn=['UserNameLogin:QlYSqVS_','PasswordLogin:YPtIeRC_'],UserName=UserName,Password=Password)
            Context['Status'] = '200'
            Context['Object'] = Object
            return JsonResponse(Context)
        except:
            Context['Status'] = '500'
            return JsonResponse(Context)
    Context['Status'] = '403'
    return JsonResponse(Context)

