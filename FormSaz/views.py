from django.shortcuts import render, get_object_or_404, redirect
from django.http import HttpResponse, JsonResponse, Http404
from django.core.exceptions import PermissionDenied
from django.views.decorators.csrf import csrf_exempt
from django.core.serializers import serialize
from Config.Tools import SerializerTool, ValidationText, ValidationNumber, Set_Cookie_Functionality
from Config.User import GetUser_ByMODEL
from .Settings import *
from .models import *
from User.models import SpendCoinsTransaction
from Config.Tools import ListIsNone, Get_IP
import json


def ViewFormSettings(request, ID_FORM):
    Context = {}
    User = GetUser_ByMODEL(request, 'User')
    if User != None:
        GetForm = FORM.objects.filter(ID_FORM=ID_FORM, User_id=User.id).first()
        if GetForm != None:
            Context['User'] = User
            Context['Form'] = GetForm
            Context['Form_JSON'] = SerializerTool(FORM, [GetForm],
                                                  Methods=['GetExpiryDate', 'GetConfig']).strip(
                '[]')
            return render(request, 'FormSaz/View/index.html', Context)
        else:
            raise Http404
    else:
        return redirect('/User/LoginRegister')


def CreateFormUrl(request):
    if request.POST:
        User = GetUser_ByMODEL(request, 'User')
        if User != None:
            if User.Coins >= 200:
                Context = {}
                Data = request.POST
                Title = Data.get('Title')
                Description = Data.get('Description')
                Type = Data.get('Type')
                if ValidationText(Title, 2, 150) == True and ValidationText(Description, -1,
                                                                            3000) == True and Type != None and (Type == 'Quiz' or Type == 'Customize'):
                    ConfigCreated = CONFIG_BASE_FORM.objects.create()
                    FormCreated = FORM.objects.create(
                        User_id=User.id,
                        Config_id=ConfigCreated.id,
                        Title=Title,
                        Description=Description,
                        Type=Type
                        )
                    User.Coins -= 200  # For Create Every Form = 200 Coin
                    User.save()
                    SpendCoinsTransaction.objects.create(User_id=User.id, Coins=200, Form_id=FormCreated.id)

                    return Set_Cookie_Functionality("فرم شما با موفقیت ایجاد شد", 'Success',
                                                    RedirectTo=f'/FormSaz/Create/{FormCreated.ID_FORM}')
                else:
                    return Set_Cookie_Functionality("لطفا فیلد های فرم را پر نمایید", 'Success',
                                                    RedirectTo='/User/Panel?CreateForm')
            else:
                return Set_Cookie_Functionality(" تعداد سکه برای ایجاد فرم کافی نمیباشد", 'Error',
                                                RedirectTo='/User/Panel?ManagementCoin')
        raise PermissionDenied()
    raise Http404


@csrf_exempt
def DeleteForm(request):
    if request.method == 'POST' and request.is_ajax():
        Context = {}
        User = GetUser_ByMODEL(request, 'User')
        Data = None
        ID = None
        if User != None:
            try:
                Data = json.loads(request.body)
                ID = Data.get('ID')
                Form = FORM.objects.filter(id=ID, User_id=User.id).first()
                if Form != None:
                    Form.delete()
                    Context['Status'] = '200'
                    Context['Status_Text'] = 'فرم با موفقیت حذف شد'
                else:
                    Context['Status'] = '404'
                    Context['Status_Text'] = 'فرم یافت نشد'
            except:
                Context['Status'] = '500'
                Context['Status_Text'] = 'مشکلی در گرفتن اطلاعات وجود دارد'
            return JsonResponse(Context)
        raise PermissionDenied()
    else:
        raise PermissionDenied()


def CreateFormView(request, ID_FORM):
    User = GetUser_ByMODEL(request, 'User')
    if User != None:
        Context = {}
        Form = get_object_or_404(FORM, ID_FORM=ID_FORM, User_id=User.id)
        if Form.Form_Edited == False:
            Context['User'] = User
            Context['Form'] = Form
            Context['Form_JSON'] = SerializerTool(FORM, [Form], Methods=['GetExpiryDate']).strip('[]')
            return render(request, 'FormSaz/Create/index.html', Context)
        return redirect(f'/FormSaz/Edit/{Form.ID_FORM}')
    return redirect('/User/LoginRegister')


def EditFormView(request, ID_FORM):
    User = GetUser_ByMODEL(request, 'User')
    if User != None:
        Context = {}
        Form = get_object_or_404(FORM, ID_FORM=ID_FORM, User_id=User.id)
        if Form.Form_Edited == True:
            Context['User'] = User
            Context['Form'] = Form
            Context['Form_JSON'] = SerializerTool(FORM, [Form], Methods=['GetExpiryDate', 'GetConfig']).strip('[]')
            return render(request, 'FormSaz/Edit/index.html', Context)
        return redirect(f'/FormSaz/Create/{Form.ID_FORM}')
    return redirect('/User/LoginRegister')


def GetSizeFile(File):
    if File:
        return (File.size) / 1000000  # Convert To Mb


def GetTypeFile(File):
    if File:
        return File.content_type.split('/')[-1]


def Create_Style_Object(Element):
    StyleJSON = Element['DICT_STYLE']
    Instance = STYLE_BASE.objects.create(DICT_STYLE=StyleJSON)
    return Instance


def Create_Config_Object(Element):
    ConfigJSON = Element['DICT_CONFIG']
    Instance = CONFIG_BASE.objects.create(DICT_CONFIG=ConfigJSON)
    return Instance


def Create_ConfigQuiz_Object(Element):
    ConfigJSON = Element['DICT_CONFIG_QUIZ']
    Instance = CONFIG_BASE_QUIZ.objects.create(DICT_CONFIG_QUIZ=ConfigJSON)
    return Instance


def Create_Validation_Object(Element):
    ValidationJSON = Element['DICT_VALIDATION']
    Instance = VALIDATION_BASE.objects.create(DICT_VALIDATION=ValidationJSON)
    return Instance


def Create_Elements_Title(Parent, _Element):
    Style = Create_Style_Object(_Element)
    Config = Create_Config_Object(_Element)
    Title = TAG_H3.objects.create(
        Type=_Element['Type'],
        Type_Base=_Element['Type_Base'],
        ID_Element=_Element['id'],
        OnlyCreate=_Element['OnlyCreate'],
        Style_id=Style.id,
        Config_id=Config.id,
        Parent_id=Parent.id)
    return Title


def Create_Elements_Text(Parent, _Element):
    Style = Create_Style_Object(_Element)
    Config = Create_Config_Object(_Element)
    Text = TAG_P.objects.create(
        Type=_Element['Type'],
        Type_Base=_Element['Type_Base'],
        ID_Element=_Element['id'],
        OnlyCreate=_Element['OnlyCreate'],
        Style_id=Style.id,
        Config_id=Config.id,
        Parent_id=Parent.id)
    return Text


def Create_Elements_Alert(Parent, _Element):
    Style = Create_Style_Object(_Element)
    Config = Create_Config_Object(_Element)
    Alert = TAG_P.objects.create(
        Type=_Element['Type'],
        Type_Base=_Element['Type_Base'],
        ID_Element=_Element['id'],
        OnlyCreate=_Element['OnlyCreate'],
        Style_id=Style.id,
        Config_id=Config.id,
        Parent_id=Parent.id)

    return Alert


def Add_Alerts_Texts_Titles(Parent, _Element, **kwargs):
    if Parent and _Element != None:
        ListElements = _Element['ElementsCLASS_Secondary']
        for Element in ListElements:
            Config = Element['DICT_CONFIG']
            TypeTag = Config['TypeTag']
            if TypeTag == 'Tag_P_Text':
                Text = Create_Elements_Text(Parent, Element)
                if Text != None:
                    Parent.ElementsCLASS_Text.add(Text)
                    Parent.ElementsCLASS_Secondary.add(Text)
            elif TypeTag == 'Tag_P_Alert':
                Alert = Create_Elements_Alert(Parent, Element)
                if Alert != None:
                    Parent.ElementsCLASS_Alert.add(Alert)
                    Parent.ElementsCLASS_Secondary.add(Alert)
            elif TypeTag == 'Tag_H3_Title':
                Title = Create_Elements_Title(Parent, Element)
                if Title != None:
                    Parent.ElementsCLASS_Title.add(Title)
                    Parent.ElementsCLASS_Secondary.add(Title)
            elif TypeTag == 'Tag_IMAGE_Title':
                Status, Image = CREATE_TAG_IMAGE(kwargs.get('request'), Parent, Element)
                if Image != None:
                    Parent.ElementsCLASS_Secondary.add(Image)
            elif TypeTag == 'Tag_VIDEO_Title':
                Status, Video = CREATE_TAG_VIDEO(kwargs.get('request'), Parent, Element)
                if Video != None:
                    Parent.ElementsCLASS_Secondary.add(Video)
            elif TypeTag == 'Tag_AUDIO_Title':
                Status, Audio = CREATE_TAG_AUDIO(kwargs.get('request'), Parent, Element)
                if Audio != None:
                    Parent.ElementsCLASS_Secondary.add(Audio)

        # Alerts = Create_Elements_Alert(Parent, _Element)
        # Texts = Create_Elements_Text(Parent, _Element)
        # Titles = Create_Elements_Title(Parent, _Element)
        # if ListIsNone(Alerts) == False:
        #     Parent.ElementsCLASS_Alert.add(*Alerts)
        # if ListIsNone(Texts) == False:
        #     Parent.ElementsCLASS_Text.add(*Texts)
        # if ListIsNone(Titles) == False:
        #     Parent.ElementsCLASS_Title.add(*Titles)


def CREATE_BOX_ELEMENT(request, Parent, _Element):
    STATUS_CREATE = {}
    ElementCreate = None
    Style = Create_Style_Object(_Element)
    Config = Create_Config_Object(_Element)
    ElementCreate = BOX_ELEMENT.objects.create(
        ID_Element=_Element['id'],
        Type=_Element['Type'],
        Type_Base=_Element['Type_Base'],
        OnlyCreate=_Element['OnlyCreate'],
        Parent_id=Parent.id,
        Page_id=Parent.id,
        Style_id=Style.id,
        Config_id=Config.id
    )
    Add_Alerts_Texts_Titles(ElementCreate, _Element)
    STATUS_CREATE['Status'] = 'OK'
    return STATUS_CREATE, ElementCreate


def CREATE_TAG_H1(request, Parent, _Element):
    STATUS_CREATE = {}
    ElementCreate = None
    Style = Create_Style_Object(_Element)
    Config = Create_Config_Object(_Element)
    ElementCreate = TAG_H1.objects.create(
        ID_Element=_Element['id'],
        Type=_Element['Type'],
        Type_Base=_Element['Type_Base'],
        OnlyCreate=_Element['OnlyCreate'],
        Parent_id=Parent.id,
        Style_id=Style.id,
        Config_id=Config.id
    )
    Add_Alerts_Texts_Titles(ElementCreate, _Element)
    STATUS_CREATE['Status'] = 'OK'
    return STATUS_CREATE, ElementCreate


def CREATE_TAG_H3(request, Parent, _Element):
    STATUS_CREATE = {}
    ElementCreate = None
    Style = Create_Style_Object(_Element)
    Config = Create_Config_Object(_Element)
    ElementCreate = TAG_H3.objects.create(
        ID_Element=_Element['id'],
        Type=_Element['Type'],
        Type_Base=_Element['Type_Base'],
        OnlyCreate=_Element['OnlyCreate'],
        Parent_id=Parent.id,
        Style_id=Style.id,
        Config_id=Config.id
    )
    Add_Alerts_Texts_Titles(ElementCreate, _Element)
    STATUS_CREATE['Status'] = 'OK'
    return STATUS_CREATE, ElementCreate


def CREATE_TAG_H6(request, Parent, _Element):
    STATUS_CREATE = {}
    ElementCreate = None
    Style = Create_Style_Object(_Element)
    Config = Create_Config_Object(_Element)
    ElementCreate = TAG_H6.objects.create(
        ID_Element=_Element['id'],
        Type=_Element['Type'],
        Type_Base=_Element['Type_Base'],
        OnlyCreate=_Element['OnlyCreate'],
        Parent_id=Parent.id,
        Style_id=Style.id,
        Config_id=Config.id
    )
    Add_Alerts_Texts_Titles(ElementCreate, _Element)
    STATUS_CREATE['Status'] = 'OK'
    return STATUS_CREATE, ElementCreate


def CREATE_TAG_P(request, Parent, _Element):
    STATUS_CREATE = {}
    ElementCreate = None
    Style = Create_Style_Object(_Element)
    Config = Create_Config_Object(_Element)
    ElementCreate = TAG_P.objects.create(
        ID_Element=_Element['id'],
        Type=_Element['Type'],
        Type_Base=_Element['Type_Base'],
        OnlyCreate=_Element['OnlyCreate'],
        Parent_id=Parent.id,
        Style_id=Style.id,
        Config_id=Config.id
    )
    Add_Alerts_Texts_Titles(ElementCreate, _Element)
    STATUS_CREATE['Status'] = 'OK'
    return STATUS_CREATE, ElementCreate


def CREATE_TAG_VIDEO(request, Parent, _Element):
    STATUS_CREATE = {}
    Video = request.FILES.get(f"INPUT_MEDIA_{_Element['id']}")
    STATE = _Element['STATE']
    ElementCreate = None
    if STATE == 'Create':
        Status_TypeFile = GetTypeFile(Video) in LIST_TYPE_VIDEO
        Status_SizeFile = GetSizeFile(Video) < LIMIT_SIZE_VIDEO
    else:
        Status_TypeFile = True
        Status_SizeFile = True
    if Status_TypeFile and Status_SizeFile:
        Style = Create_Style_Object(_Element)
        Config = Create_Config_Object(_Element)
        ElementCreate = VIDEO_BASE.objects.create(
            ID_Element=_Element['id'],
            Type=_Element['Type'],
            Type_Base=_Element['Type_Base'],
            OnlyCreate=_Element['OnlyCreate'],
            STATE=_Element['STATE'],
            Parent_id=Parent.id,
            Style_id=Style.id,
            Config_id=Config.id)
        if STATE == 'Create':
            ElementCreate.Video = Video
            ElementCreate.Video_Url = ElementCreate.Video.url
            ElementCreate.save()
            Config.DICT_CONFIG['ValueVideo'] = ElementCreate.Video.url
            Config.save()
        Add_Alerts_Texts_Titles(ElementCreate, _Element)
        STATUS_CREATE['Status'] = 'OK'
    else:
        STATUS_CREATE['Status'] = 'Cant_Create'
        STATUS_CREATE['id'] = _Element['id']
        if Status_SizeFile == False:
            STATUS_CREATE['Status_Text'] = 'حجم فایل ویدئو بیشتر از حد مجاز است'
        if Status_TypeFile == False:
            STATUS_CREATE['Status_Text'] = 'نوع فایل ویدئو انتخاب شده مجاز نیست'
    if Video == None and STATE == 'Create':
        STATUS_CREATE['Status'] = 'Cant_Create'
        STATUS_CREATE['Status_Text'] = 'فایل فیلم انتخاب نشده است'
        STATUS_CREATE['id'] = _Element['id']
    return STATUS_CREATE, ElementCreate


def CREATE_TAG_IMAGE(request, Parent, _Element):
    STATUS_CREATE = {}
    Image = request.FILES.get(f"INPUT_MEDIA_{_Element['id']}")
    STATE = _Element['STATE']
    ElementCreate = None
    if Image != None and STATE == 'Create':
        Status_TypeFile = GetTypeFile(Image) in LIST_TYPE_IMAGE
        Status_SizeFile = GetSizeFile(Image) < LIMIT_SIZE_IMAGE
    else:
        Status_TypeFile = True
        Status_SizeFile = True
    if Status_TypeFile and Status_SizeFile:
        Style = Create_Style_Object(_Element)
        Config = Create_Config_Object(_Element)
        ElementCreate = IMAGE_BASE.objects.create(
            ID_Element=_Element['id'],
            Type=_Element['Type'],
            Type_Base=_Element['Type_Base'],
            OnlyCreate=_Element['OnlyCreate'],
            STATE=_Element['STATE'],
            Parent_id=Parent.id,
            Style_id=Style.id,
            Config_id=Config.id)
        if STATE == 'Create':
            ElementCreate.Image = Image
            ElementCreate.Image_Url = ElementCreate.Image.url
            ElementCreate.save()
            Config.DICT_CONFIG['ValueImage'] = ElementCreate.Image.url
            Config.save()
        Add_Alerts_Texts_Titles(ElementCreate, _Element)
        STATUS_CREATE['Status'] = 'OK'
    else:
        STATUS_CREATE['Status'] = 'Cant_Create'
        STATUS_CREATE['id'] = _Element['id']
        if Status_SizeFile == False:
            STATUS_CREATE['Status_Text'] = 'حجم فایل عکس بیشتر از حد مجاز است'
        if Status_TypeFile == False:
            STATUS_CREATE['Status_Text'] = 'نوع فایل عکس انتخاب شده مجاز نیست'
    if Image == None and STATE == 'Create':
        STATUS_CREATE['Status'] = 'Cant_Create'
        STATUS_CREATE['Status_Text'] = 'فایل عکس انتخاب نشده است'
        STATUS_CREATE['id'] = _Element['id']
    return STATUS_CREATE, ElementCreate


def CREATE_TAG_AUDIO(request, Parent, _Element):
    STATUS_CREATE = {}
    Audio = request.FILES.get(f"INPUT_MEDIA_{_Element['id']}")
    STATE = _Element['STATE']
    ElementCreate = None
    if STATE == 'Create':
        Status_TypeFile = GetTypeFile(Audio) in LIST_TYPE_AUDIO
        Status_SizeFile = GetSizeFile(Audio) < LIMIT_SIZE_AUDIO
    else:
        Status_TypeFile = True
        Status_SizeFile = True
    if Status_TypeFile and Status_SizeFile:
        Style = Create_Style_Object(_Element)
        Config = Create_Config_Object(_Element)
        ElementCreate = AUDIO_BASE.objects.create(
            ID_Element=_Element['id'],
            Type=_Element['Type'],
            Type_Base=_Element['Type_Base'],
            OnlyCreate=_Element['OnlyCreate'],
            STATE=_Element['STATE'],
            Parent_id=Parent.id,
            Style_id=Style.id,
            Config_id=Config.id)
        if STATE == 'Create':
            ElementCreate.Audio = Audio
            ElementCreate.Audio_Url = ElementCreate.Audio.url
            ElementCreate.save()
            Config.DICT_CONFIG['ValueAudio'] = ElementCreate.Audio.url
            Config.save()
        Add_Alerts_Texts_Titles(ElementCreate, _Element)
        STATUS_CREATE['Status'] = 'OK'
    else:
        STATUS_CREATE['Status'] = 'Cant_Create'
        STATUS_CREATE['id'] = _Element['id']
        if Status_SizeFile == False:
            STATUS_CREATE['Status_Text'] = 'حجم فایل صدا بیشتر از حد مجاز است'
        if Status_TypeFile == False:
            STATUS_CREATE['Status_Text'] = 'نوع فایل صدا انتخاب شده مجاز نیست'
    if Audio == None and STATE == 'Create':
        STATUS_CREATE['Status'] = 'Cant_Create'
        STATUS_CREATE['Status_Text'] = 'فایل صدا انتخاب نشده است'
        STATUS_CREATE['id'] = _Element['id']
    return STATUS_CREATE, ElementCreate


def CREATE_INPUT_CHAR(request, Parent, _Element):
    STATUS_CREATE = {}
    ElementCreate = None
    Style = Create_Style_Object(_Element)
    Config = Create_Config_Object(_Element)
    Validation = Create_Validation_Object(_Element)
    ElementCreate = INPUT_CHAR.objects.create(
        ID_Element=_Element['id'],
        Type=_Element['Type'],
        Type_Base=_Element['Type_Base'],
        OnlyCreate=_Element['OnlyCreate'],
        Parent_id=Parent.id,
        Style_id=Style.id,
        Config_id=Config.id,
        Validation_id=Validation.id
    )
    Add_Alerts_Texts_Titles(ElementCreate, _Element)
    STATUS_CREATE['Status'] = 'OK'
    return STATUS_CREATE, ElementCreate


def CREATE_INPUT_TEXTAREA(request, Parent, _Element):
    STATUS_CREATE = {}
    ElementCreate = None
    Style = Create_Style_Object(_Element)
    Config = Create_Config_Object(_Element)
    Validation = Create_Validation_Object(_Element)
    ElementCreate = INPUT_TEXTAREA.objects.create(
        ID_Element=_Element['id'],
        Type=_Element['Type'],
        Type_Base=_Element['Type_Base'],
        OnlyCreate=_Element['OnlyCreate'],
        Parent_id=Parent.id,
        Style_id=Style.id,
        Config_id=Config.id,
        Validation_id=Validation.id
    )
    Add_Alerts_Texts_Titles(ElementCreate, _Element)
    STATUS_CREATE['Status'] = 'OK'
    return STATUS_CREATE, ElementCreate


def CREATE_INPUT_NUMBER(request, Parent, _Element):
    STATUS_CREATE = {}
    ElementCreate = None
    Style = Create_Style_Object(_Element)
    Config = Create_Config_Object(_Element)
    Validation = Create_Validation_Object(_Element)
    ElementCreate = INPUT_NUMBER.objects.create(
        ID_Element=_Element['id'],
        Type=_Element['Type'],
        Type_Base=_Element['Type_Base'],
        OnlyCreate=_Element['OnlyCreate'],
        Parent_id=Parent.id,
        Style_id=Style.id,
        Config_id=Config.id,
        Validation_id=Validation.id
    )
    Add_Alerts_Texts_Titles(ElementCreate, _Element)
    STATUS_CREATE['Status'] = 'OK'
    return STATUS_CREATE, ElementCreate


def CREATE_INPUT_EMAIL(request, Parent, _Element):
    STATUS_CREATE = {}
    ElementCreate = None
    Style = Create_Style_Object(_Element)
    Config = Create_Config_Object(_Element)
    Validation = Create_Validation_Object(_Element)
    ElementCreate = INPUT_EMAIL.objects.create(
        ID_Element=_Element['id'],
        Type=_Element['Type'],
        Type_Base=_Element['Type_Base'],
        OnlyCreate=_Element['OnlyCreate'],
        Parent_id=Parent.id,
        Style_id=Style.id,
        Config_id=Config.id,
        Validation_id=Validation.id
    )
    Add_Alerts_Texts_Titles(ElementCreate, _Element)
    STATUS_CREATE['Status'] = 'OK'
    return STATUS_CREATE, ElementCreate


def CREATE_INPUT_PASSWORD(request, Parent, _Element):
    STATUS_CREATE = {}
    ElementCreate = None
    Style = Create_Style_Object(_Element)
    Config = Create_Config_Object(_Element)
    Validation = Create_Validation_Object(_Element)
    ElementCreate = INPUT_PASSWORD.objects.create(
        ID_Element=_Element['id'],
        Type=_Element['Type'],
        Type_Base=_Element['Type_Base'],
        OnlyCreate=_Element['OnlyCreate'],
        Parent_id=Parent.id,
        Style_id=Style.id,
        Config_id=Config.id,
        Validation_id=Validation.id
    )
    Add_Alerts_Texts_Titles(ElementCreate, _Element)
    STATUS_CREATE['Status'] = 'OK'
    return STATUS_CREATE, ElementCreate


def CREATE_INPUT_TIME(request, Parent, _Element):
    STATUS_CREATE = {}
    ElementCreate = None
    Style = Create_Style_Object(_Element)
    Config = Create_Config_Object(_Element)
    Validation = Create_Validation_Object(_Element)
    ElementCreate = INPUT_TIME.objects.create(
        ID_Element=_Element['id'],
        Type=_Element['Type'],
        Type_Base=_Element['Type_Base'],
        OnlyCreate=_Element['OnlyCreate'],
        Parent_id=Parent.id,
        Style_id=Style.id,
        Config_id=Config.id,
        Validation_id=Validation.id
    )
    Add_Alerts_Texts_Titles(ElementCreate, _Element)
    STATUS_CREATE['Status'] = 'OK'
    return STATUS_CREATE, ElementCreate


def CREATE_INPUT_DATE(request, Parent, _Element):
    STATUS_CREATE = {}
    ElementCreate = None
    Style = Create_Style_Object(_Element)
    Config = Create_Config_Object(_Element)
    Validation = Create_Validation_Object(_Element)
    ElementCreate = INPUT_DATE.objects.create(
        ID_Element=_Element['id'],
        Type=_Element['Type'],
        Type_Base=_Element['Type_Base'],
        OnlyCreate=_Element['OnlyCreate'],
        Parent_id=Parent.id,
        Style_id=Style.id,
        Config_id=Config.id,
        Validation_id=Validation.id
    )
    Add_Alerts_Texts_Titles(ElementCreate, _Element)
    STATUS_CREATE['Status'] = 'OK'
    return STATUS_CREATE, ElementCreate


def CREATE_INPUT_CHECKBOX(request, Parent, _Element):
    STATUS_CREATE = {}
    ElementCreate = None
    Style = Create_Style_Object(_Element)
    Config = Create_Config_Object(_Element)
    Validation = Create_Validation_Object(_Element)
    ElementCreate = INPUT_CHECKBOX.objects.create(
        ID_Element=_Element['id'],
        Type=_Element['Type'],
        Type_Base=_Element['Type_Base'],
        OnlyCreate=_Element['OnlyCreate'],
        Parent_id=Parent.id,
        Style_id=Style.id,
        Config_id=Config.id,
        Validation_id=Validation.id
    )
    Add_Alerts_Texts_Titles(ElementCreate, _Element)
    STATUS_CREATE['Status'] = 'OK'
    return STATUS_CREATE, ElementCreate


def CREATE_INPUT_RADIO(request, Parent, _Element):
    STATUS_CREATE = {}
    ElementCreate = None
    Style = Create_Style_Object(_Element)
    Config = Create_Config_Object(_Element)
    Validation = Create_Validation_Object(_Element)
    ElementCreate = INPUT_RADIO.objects.create(
        ID_Element=_Element['id'],
        Type=_Element['Type'],
        Type_Base=_Element['Type_Base'],
        OnlyCreate=_Element['OnlyCreate'],
        Parent_id=Parent.id,
        Style_id=Style.id,
        Config_id=Config.id,
        Validation_id=Validation.id
    )
    Add_Alerts_Texts_Titles(ElementCreate, _Element)
    STATUS_CREATE['Status'] = 'OK'
    return STATUS_CREATE, ElementCreate


def CREATE_INPUT_IMAGE(request, Parent, _Element):
    STATUS_CREATE = {}
    ElementCreate = None
    Style = Create_Style_Object(_Element)
    Config = Create_Config_Object(_Element)
    Validation = Create_Validation_Object(_Element)
    ElementCreate = INPUT_IMAGE.objects.create(
        ID_Element=_Element['id'],
        Type=_Element['Type'],
        Type_Base=_Element['Type_Base'],
        OnlyCreate=_Element['OnlyCreate'],
        Parent_id=Parent.id,
        Style_id=Style.id,
        Config_id=Config.id,
        Validation_id=Validation.id
    )
    Add_Alerts_Texts_Titles(ElementCreate, _Element)
    STATUS_CREATE['Status'] = 'OK'
    return STATUS_CREATE, ElementCreate


def CREATE_INPUT_FILE(request, Parent, _Element):
    STATUS_CREATE = {}
    ElementCreate = None
    Style = Create_Style_Object(_Element)
    Config = Create_Config_Object(_Element)
    Validation = Create_Validation_Object(_Element)
    ElementCreate = INPUT_FILE.objects.create(
        ID_Element=_Element['id'],
        Type=_Element['Type'],
        Type_Base=_Element['Type_Base'],
        OnlyCreate=_Element['OnlyCreate'],
        Parent_id=Parent.id,
        Style_id=Style.id,
        Config_id=Config.id,
        Validation_id=Validation.id
    )
    Add_Alerts_Texts_Titles(ElementCreate, _Element)
    STATUS_CREATE['Status'] = 'OK'
    return STATUS_CREATE, ElementCreate


def CREATE_QUESTION_DESCRIPTIVE(request, Parent, _Element):
    STATUS_CREATE = {}
    ElementCreate = None
    Style = Create_Style_Object(_Element)
    Config = Create_Config_Object(_Element)
    ConfigQuiz = Create_ConfigQuiz_Object(_Element)
    ElementCreate = QUESTION_DESCRIPTIVE.objects.create(
        ID_Element=_Element['id'],
        Type=_Element['Type'],
        Type_Base=_Element['Type_Base'],
        OnlyCreate=_Element['OnlyCreate'],
        Parent_id=Parent.id,
        Page_id=Parent.id,
        Style_id=Style.id,
        Config_id=Config.id,
        ConfigQuiz_id=ConfigQuiz.id,
    )
    Add_Alerts_Texts_Titles(ElementCreate, _Element, request=request)
    STATUS_CREATE['Status'] = 'OK'
    return STATUS_CREATE, ElementCreate


def CREATE_QUESTION_TEST(request, Parent, _Element):
    STATUS_CREATE = {}
    ElementCreate = None
    Style = Create_Style_Object(_Element)
    Config = Create_Config_Object(_Element)
    ConfigQuiz = Create_ConfigQuiz_Object(_Element)
    ElementCreate = QUESTION_TEST.objects.create(
        ID_Element=_Element['id'],
        Type=_Element['Type'],
        Type_Base=_Element['Type_Base'],
        OnlyCreate=_Element['OnlyCreate'],
        Parent_id=Parent.id,
        Page_id=Parent.id,
        Style_id=Style.id,
        Config_id=Config.id,
        ConfigQuiz_id=ConfigQuiz.id,
    )
    Add_Alerts_Texts_Titles(ElementCreate, _Element, request=request)
    STATUS_CREATE['Status'] = 'OK'
    return STATUS_CREATE, ElementCreate


def CREATE_FIELD_NAMEANDFAMILY(request, Parent, _Element):
    STATUS_CREATE = {}
    ElementCreate = None
    Style = Create_Style_Object(_Element)
    Config = Create_Config_Object(_Element)
    ElementCreate = FIELD_NAMEANDFAMILY.objects.create(
        ID_Element=_Element['id'],
        Type=_Element['Type'],
        Type_Base=_Element['Type_Base'],
        OnlyCreate=_Element['OnlyCreate'],
        Parent_id=Parent.id,
        Page_id=Parent.id,
        Style_id=Style.id,
        Config_id=Config.id
    )
    Add_Alerts_Texts_Titles(ElementCreate, _Element)
    STATUS_CREATE['Status'] = 'OK'
    return STATUS_CREATE, ElementCreate


def CREATE_FIELD_NATIONALCODE(request, Parent, _Element):
    STATUS_CREATE = {}
    ElementCreate = None
    Style = Create_Style_Object(_Element)
    Config = Create_Config_Object(_Element)
    ElementCreate = FIELD_NATIONALCODE.objects.create(
        ID_Element=_Element['id'],
        Type=_Element['Type'],
        Type_Base=_Element['Type_Base'],
        OnlyCreate=_Element['OnlyCreate'],
        Parent_id=Parent.id,
        Page_id=Parent.id,
        Style_id=Style.id,
        Config_id=Config.id
    )
    Add_Alerts_Texts_Titles(ElementCreate, _Element)
    STATUS_CREATE['Status'] = 'OK'
    return STATUS_CREATE, ElementCreate


def CREATE_FIELD_PHONENUMBER(request, Parent, _Element):
    STATUS_CREATE = {}
    ElementCreate = None
    Style = Create_Style_Object(_Element)
    Config = Create_Config_Object(_Element)
    ElementCreate = FIELD_PHONENUMBER.objects.create(
        ID_Element=_Element['id'],
        Type=_Element['Type'],
        Type_Base=_Element['Type_Base'],
        OnlyCreate=_Element['OnlyCreate'],
        Parent_id=Parent.id,
        Page_id=Parent.id,
        Style_id=Style.id,
        Config_id=Config.id
    )
    Add_Alerts_Texts_Titles(ElementCreate, _Element)
    STATUS_CREATE['Status'] = 'OK'
    return STATUS_CREATE, ElementCreate


def CREATE_FIELD_EMAIL(request, Parent, _Element):
    STATUS_CREATE = {}
    ElementCreate = None
    Style = Create_Style_Object(_Element)
    Config = Create_Config_Object(_Element)
    ElementCreate = FIELD_EMAIL.objects.create(
        ID_Element=_Element['id'],
        Type=_Element['Type'],
        Type_Base=_Element['Type_Base'],
        OnlyCreate=_Element['OnlyCreate'],
        Parent_id=Parent.id,
        Page_id=Parent.id,
        Style_id=Style.id,
        Config_id=Config.id
    )
    Add_Alerts_Texts_Titles(ElementCreate, _Element)
    STATUS_CREATE['Status'] = 'OK'
    return STATUS_CREATE, ElementCreate


DICT_MODELS = {
    'BOX_ELEMENT': CREATE_BOX_ELEMENT,

    'TAG_H1_ELEMENT': CREATE_TAG_H1,
    'TAG_H3_ELEMENT': CREATE_TAG_H3,
    'TAG_H6_ELEMENT': CREATE_TAG_H6,
    'TAG_P_ELEMENT': CREATE_TAG_P,
    'TAG_VIDEO_ELEMENT': CREATE_TAG_VIDEO,
    'TAG_IMAGE_ELEMENT': CREATE_TAG_IMAGE,
    'TAG_AUDIO_ELEMENT': CREATE_TAG_AUDIO,

    'INPUT_CHAR': CREATE_INPUT_CHAR,
    'INPUT_TEXTAREA': CREATE_INPUT_TEXTAREA,
    'INPUT_NUMBER': CREATE_INPUT_NUMBER,
    'INPUT_EMAIL': CREATE_INPUT_EMAIL,
    'INPUT_PASSWORD': CREATE_INPUT_PASSWORD,
    'INPUT_TIME': CREATE_INPUT_TIME,
    'INPUT_DATE': CREATE_INPUT_DATE,
    'INPUT_CHECKBOX': CREATE_INPUT_CHECKBOX,
    'INPUT_RADIO': CREATE_INPUT_RADIO,
    'INPUT_IMAGE': CREATE_INPUT_IMAGE,
    'INPUT_FILE': CREATE_INPUT_FILE,

    'QUESTION_DESCRIPTIVE': CREATE_QUESTION_DESCRIPTIVE,
    'QUESTION_TEST': CREATE_QUESTION_TEST,
    'FIELD_NAMEANDFAMILY': CREATE_FIELD_NAMEANDFAMILY,
    'FIELD_NATIONALCODE': CREATE_FIELD_NATIONALCODE,
    'FIELD_PHONENUMBER': CREATE_FIELD_PHONENUMBER,
    'FIELD_EMAIL': CREATE_FIELD_EMAIL
}


# DICT_MODELS_QUIZ = {
#     'QUESTION_DESCRIPTIVE':QUESTION_DESCRIPTIVE,
#     'QUESTION_TEST':QUESTION_TEST,
#     'FIELD_NAMEANDFAMILY':FIELD_NAMEANDFAMILY,
#     'FIELD_NATIONALCODE':FIELD_NATIONALCODE,
#     'FIELD_PHONENUMBER':FIELD_PHONENUMBER,
#     'FIELD_EMAIL':FIELD_EMAIL,
# }
#


@csrf_exempt
def CreateElementsForm(request):
    if request.method == 'POST' and request.is_ajax():
        User = GetUser_ByMODEL(request, 'User')
        if User != None:
            Context = {
                'Status': '200'
            }
            Context['LIST_STAUTS_CREATE'] = []
            STATUS = '200'
            Data = None
            Form = None
            try:
                Data = request.POST
                ID_FORM = Data.get('ID_FORM') or None
                Form = FORM.objects.filter(ID_FORM=ID_FORM, User_id=User.id).first()
                if Form != None:
                    Data = json.loads(Data.get('Data'))
                    Form.DeletePages()
                else:
                    Context['Status'] = '404'
                    Context['Status_Text'] = 'فرم یافت نشد'
                    STATUS = '404'
            except:
                Context['Status'] = '500'
                Context['Status_Text'] = 'مشکلی در تجزیه داده وجود دارد'
                STATUS = '500'
                if Form != None:
                    Form.DeletePages()

            if Data != None and Form != None:
                _PAGES = Data
                for Page in _PAGES:
                    Style = Create_Style_Object(Page)
                    Config = Create_Config_Object(Page)
                    PageCreate = PAGE_ELEMENT.objects.create(
                        Form_id=Form.id,
                        Type='PAGE_ELEMENT',
                        Type_Base=Page['Type_Base'],
                        ID_Element=Page['id'],
                        OnlyCreate=Page['OnlyCreate'],
                        COUNTER_ID_PAGE=Page['COUNTER_ID_PAGE'],
                        Style_id=Style.id,
                        Config_id=Config.id)
                    for Element in Page['ElementsCLASS']:
                        try:
                            Type = Element['Type']
                            ContextStatusCreate, ElementCreated = DICT_MODELS[Type](request, PageCreate, Element)
                            Context['LIST_STAUTS_CREATE'].append(ContextStatusCreate)
                            if ElementCreated != None:
                                PageCreate.ElementsCLASS.add(ElementCreated)  # Add Element To ElementsCLASS Page
                        except BaseException as Error:
                            raise Error
                            Context['Status'] = '500'
                            Context['Status_Text'] = 'مشکلی در ساخت المان وجود دارد'
                            STATUS = '500'
                        if Type == 'BOX_ELEMENT' or Type == 'QUESTION_DESCRIPTIVE' or Type == 'QUESTION_TEST' or Type == 'FIELD_NAMEANDFAMILY' or Type == 'FIELD_NATIONALCODE' or Type == 'FIELD_PHONENUMBER' or Type == 'FIELD_EMAIL':
                            for Element_Box in Element['ElementsCLASS']:
                                try:
                                    TypeElementBox = Element_Box['Type']
                                    ContextStatusCreate, ElementCreatedBox = DICT_MODELS[TypeElementBox](request,
                                                                                                         ElementCreated,
                                                                                                         Element_Box)
                                    Context['LIST_STAUTS_CREATE'].append(ContextStatusCreate)
                                    if ElementCreated != None:
                                        ElementCreated.ElementsCLASS.add(
                                            ElementCreatedBox)  # Add Element To ElementsCLASS Box
                                except:
                                    Context['Status'] = '500'
                                    Context[
                                        'Status_Text'] = 'مشکلی در ساخت المان های باکس وجود دارد , لطفا صفحه را مجددا بارگذاری کنید'
                                    STATUS = '500'
                                    Form.DeletePages()
            else:
                Context['Status'] = '404'
                Context['Status_Text'] = 'فرم یا دیتای مربوطه یافت نشد'
                STATUS = '404'
            for State in Context['LIST_STAUTS_CREATE']:
                if State['Status'] != 'OK':
                    Context['Status'] = '500'
                    Context['Status_Text'] = 'مشکلی در ساخت المان وجود دارد , لطفا صفحه را مجددا بارگذاری کنید'
                    STATUS = '500'
                    break
            if Context['Status'] != '200':
                if Form != None:
                    Form.DeletePages()
            return JsonResponse(Context)
        return PermissionDenied()
    else:
        raise PermissionDenied()


@csrf_exempt
def ChangeInfoForm(request):
    Context = {}
    User = GetUser_ByMODEL(request, 'User')
    if request.method == 'POST':
        if User != None:
            if request.method == 'POST' and request.is_ajax():
                try:
                    Data = json.loads(request.body)
                    Data = Data.get('Form_Object')
                    ID_FORM = Data.get('ID_FORM')
                    Form = FORM.objects.filter(ID_FORM=ID_FORM, User_id=User.id).first()
                    if Form != None:
                        Title = Data.get('Title')
                        Description = Data.get('Description')
                        _TimeStart = f"{Data.get('DateStart')} {Data.get('TimeStart')}"
                        _TimeEnd = f"{Data.get('DateEnd')} {Data.get('TimeEnd')}"
                        TimeStart = datetime.strptime(_TimeStart, '%Y-%m-%d %H:%M')
                        TimeEnd = datetime.strptime(_TimeEnd, '%Y-%m-%d %H:%M')

                        if ValidationText(Title, 2, 150) == True and ValidationText(Description, -1, 3000) == True:
                            StateValidTime = True
                            if TimeStart > TimeEnd:
                                StateValidTime = False
                                Context['Status'] = '204'
                                Context['Status_Text'] = ' زمان شروع نمیتواند بیشتر از زمان پایان باشد'

                            if TimeStart < datetime.now():
                                # StateValidTime = False
                                # Context['Status'] = '204'
                                # Context['Status_Text'] = ' زمان شروع نمیتواند کمتر از زمان اکنون باشد'
                                pass

                            if TimeEnd > Form.GetExpiryDate():
                                StateValidTime = False
                                Context['Status'] = '204'
                                Context['Status_Text'] = ' زمان پایان فرم نمیتواند بیشتر از زمان اعتبار فرم باشد'

                            if TimeEnd < TimeStart:
                                StateValidTime = False
                                Context['Status'] = '204'
                                Context['Status_Text'] = ' زمان پایان فرم نمیتواند کمتر از زمان شروع ان باشد'

                            if StateValidTime == True:
                                Form.Title = Title
                                Form.Description = Description
                                Form.Config.DICT_CONFIG = Data
                                Form.Form_Edited = True
                                Form.Config.save()
                                Form.save()
                                Context['Status'] = '200'
                                Context['Status_Text'] = 'اطلاعات فرم با موفقیت ثبت شدند'
                        else:
                            Context['Status'] = '204'
                            Context['Status_Text'] = 'تعداد حروف فیلد های فرم بیش از حد مجاز است'
                    else:
                        Context['Status'] = '404'
                        Context['Status_Text'] = 'فرم یافت نشد'
                except:
                    Context['Status'] = '500'
                    Context['Status_Text'] = 'مشکلی در ثبت اطلاعات فرم وجود دارد'
            elif request.method == 'POST' and request.is_ajax() == False:
                pass
            return JsonResponse(Context)
        raise PermissionDenied()
    else:
        raise PermissionDenied()


def SubmitRecord(request, ID_FORM):
    if request.method == 'POST' and request.is_ajax():
        Context = {}
        Data = None
        RecordData = None
        Form = FORM.objects.filter(ID_FORM=ID_FORM).first()
        try:
            Data = request.POST
            RecordData = json.loads(Data.get('Data'))
        except:
            Context['Status'] = '500'
            Context['Status_Text'] = 'مشکلی در تجزیه و تحلیل دیتا وجود دارد'
        if Data != None and RecordData != None and Form != None:
            UserCode = request.COOKIES.get('UserCode')
            if UserCode != None:
                GetRecord = Record.objects.filter(UserCode=UserCode, Form_id=Form.id).first()
                if GetRecord == None:
                    if Form.FormEnded() == False:
                        RecordCreated = Record.objects.create(
                            UserCode=UserCode,
                            TrackingCode=RandomString(),
                            Form_id=Form.id,
                            DICT_DATA=RecordData,
                            IP=Get_IP(request),
                            InfoDevice=request.META['HTTP_USER_AGENT'])
                        LIST_INSTANCE_INPUT_MEDIA = RecordData.get('LIST_INSTANCE_INPUT_MEDIA') or {}
                        for InstanceID, InstanceType in LIST_INSTANCE_INPUT_MEDIA.items():
                            FILE_RECORD = request.FILES.get(f'{InstanceType}_{InstanceID}')
                            if FILE_RECORD != None:
                                if InstanceType == 'INPUT_IMAGE':
                                    Obj = ImageRecord.objects.create(Image=FILE_RECORD, Form_id=Form.id)
                                    RecordCreated.INPUT_IMAGES.add(Obj)
                                    RecordCreated.DICT_DATA['INPUT_FILES'][InstanceID] = Obj.Image.url
                                    RecordCreated.save()
                                elif InstanceType == 'INPUT_FILE':
                                    Obj = FileRecord.objects.create(File=FILE_RECORD, Form_id=Form.id)
                                    RecordCreated.INPUT_FILES.add(Obj)
                                    RecordCreated.DICT_DATA['INPUT_FILES'][InstanceID] = Obj.File.url
                                    RecordCreated.save()
                        Context['Status'] = '200'
                        Context['Status_Text'] = 'فرم شما با موفقیت ثبت شد'
                        Context['TrackingCode'] = RecordCreated.TrackingCode
                    else:
                        Context['Status'] = '403'
                        Context['Status_Text'] = 'زمان فرم به پایان رسیده است'
                else:
                    Context['Status'] = '409'
                    Context['Status_Text'] = 'شما یک بار به این فرم جواب داده اید'
        else:
            Context['Status'] = '204'
            Context['Status_Text'] = 'مشکلی در تجزیه و تحلیل دیتا وجود دارد'
        return JsonResponse(Context)
    raise PermissionDenied


def SubmitViewRecord(request, ID_FORM):
    if request.method == 'POST' and request.is_ajax():
        UserCode = request.COOKIES.get('UserCode')
        Context = {}
        if UserCode != None:
            GetForm = FORM.objects.filter(ID_FORM=ID_FORM).first()
            if GetForm != None:
                IP = Get_IP(request)
                InfoDevice = request.META['HTTP_USER_AGENT']
                ViewRecord.objects.create(UserCode=UserCode, Form_id=GetForm.id, IP=IP, InfoDevice=InfoDevice)
                Context['Status'] = '200'
            else:
                Context['Status'] = '404'
                Context['Status_Text'] = 'فرم یافت نشد'
        else:
            Context['Status'] = '403'
            Context['Status_Text'] = 'شما مجاز به ورود به فرم نیستید'

        return JsonResponse(Context)
    raise PermissionDenied


def TrackingCodeShow(request, ID_FORM, TrackingCode):
    Context = {}
    Form = get_object_or_404(FORM, ID_FORM=ID_FORM)
    User = GetUser_ByMODEL(request,'User')
    Context['Form'] = Form
    Context['User'] = User
    Context['TrackingCode'] = TrackingCode
    return render(request, 'TrackingCode/Show.html', Context)


def TrackingCodeCheck(request,ID_FORM,TrackingCode):
    Context = {}
    Form = get_object_or_404(FORM, ID_FORM=ID_FORM)
    UserCode = request.COOKIES.get('UserCode') or None
    if UserCode != None:
        GetRecord = Record.objects.filter(Form_id=Form.id,UserCode=UserCode,TrackingCode=TrackingCode).first()
        if GetRecord != None:
            Context['Form'] = Form
            Context['Record'] = GetRecord
            Context['User'] = GetUser_ByMODEL(request,'User')
            return render(request,'TrackingCode/Check.html',Context)
    raise Http404

def ShowRecord(request, ID_FORM, Record_id):
    if str(Record_id).isdigit():
        Context = {}
        User = GetUser_ByMODEL(request, 'User')
        if User != None:
            Form = get_object_or_404(FORM, ID_FORM=ID_FORM, User_id=User.id)
            RecordGet = get_object_or_404(Record, id=Record_id, Form_id=Form.id)
            RecordGet.IsChecked = True
            RecordGet.save()
            Context['User'] = User
            Context['Record'] = RecordGet
            Context['Form'] = Form
            Context['Form_JSON'] = SerializerTool(FORM, [Form], Methods=['GetExpiryDate', 'GetConfig']).strip('[]')
            return render(request, 'ViewForm/Record.html', Context)
    return redirect('/')

def SubmitMessageRecord(request, ID_FORM, Record_id):
    Context = {}
    if request.method == 'POST':
        User = GetUser_ByMODEL(request, 'User')
        if User != None:
            Form = get_object_or_404(FORM, ID_FORM=ID_FORM, User_id=User.id)
            RecordGet = get_object_or_404(Record, id=Record_id, Form_id=Form.id)
            Message = request.POST.get('Message')
            if ValidationText(Message, 0, 3000):
                RecordGet.Message = Message
                RecordGet.DateTimeSubmitMessage = datetime.now()
                RecordGet.save()
                return Set_Cookie_Functionality('پیام شما با موفقیت ثبت شد', 'Success')
            return Set_Cookie_Functionality('لطفا فیلد پیام را به درستی وارد نمایید', 'Error')
    raise PermissionDenied



@csrf_exempt
def DeleteRecord(request,ID_FORM,Record_id):
    if request.method == 'POST':
        User = GetUser_ByMODEL(request, 'User')
        if User != None:
            Form = get_object_or_404(FORM, ID_FORM=ID_FORM, User_id=User.id)
            RecordGet = get_object_or_404(Record, id=Record_id, Form_id=Form.id)
            RecordGet.delete()
            return Set_Cookie_Functionality(f"جواب با موفقیت حذف شد",'Success',RedirectTo=f"/FormSaz/View/{ID_FORM}")
    raise PermissionDenied
