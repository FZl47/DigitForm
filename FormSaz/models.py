from django.db import models
from django.db.models import signals
from django.dispatch import receiver
from datetime import datetime, timedelta
from django.core.serializers import serialize
from Config.Tools import GetDifferenceTime, GetTimeIran, GetDifferenceTwoTime
from django.apps import apps
import jsonfield, string, random, os, json


def Upload_Src(Instance, Path, Type, TypeFile):
    Parent = Instance.Parent
    Src = ''
    Path = str(Path).split('.')[-1]
    if Parent != None:
        if Parent.Type == 'PAGE_ELEMENT':
            Parent = PAGE_ELEMENT.objects.filter(id=Parent.id).first()
            # Parent Page
            Src = f'Form_{Parent.Form.Title}/{Type}/Page_{Parent.CounterNumberPage()}/{TypeFile}/{TypeFile}_{Instance.ID_Element}_.{Path}'
        else:
            # Parent Box
            Parent = BOX_ELEMENT.objects.filter(id=Parent.id).first()
            Src = f'Form_{Parent.Page.Form.Title}/{Type}/Page_{Parent.Page.CounterNumberPage()}/Box_{Parent.ID_Element}/{TypeFile}/{TypeFile}_{Instance.ID_Element}_.{Path}'
    else:
        # No Parent : Parent is Form
        Instance = PAGE_ELEMENT.objects.filter(id=Instance.id).first()
        Src = f'Form_{Instance.Form.Title}/{Type}/Page_{Instance.id}/{TypeFile}/{TypeFile}_{Instance.ID_Element}_.{Path}'

    return Src


def RandomString(Len=14):
    Chars = string.ascii_lowercase + string.ascii_uppercase + string.digits
    return ''.join(random.choices(Chars, k=Len))


def Has_Method(Obj, Name):
    return callable(getattr(Obj, Name, None))


def GetElementByType(Type):
    if Type == 'BOX_ELEMENT':
        return BOX_ELEMENT
    elif Type == 'TAG_H1_ELEMENT':
        return TAG_H1
    elif Type == 'TAG_H3_ELEMENT':
        return TAG_H3
    elif Type == 'TAG_H6_ELEMENT':
        return TAG_H6
    elif Type == 'TAG_P_ELEMENT':
        return TAG_P
    elif Type == 'TAG_VIDEO_ELEMENT':
        return VIDEO_BASE
    elif Type == 'TAG_IMAGE_ELEMENT':
        return IMAGE_BASE
    elif Type == 'TAG_AUDIO_ELEMENT':
        return AUDIO_BASE
    elif Type == 'INPUT_CHAR':
        return INPUT_CHAR
    elif Type == 'INPUT_TEXTAREA':
        return INPUT_TEXTAREA
    elif Type == 'INPUT_NUMBER':
        return INPUT_NUMBER
    elif Type == 'INPUT_EMAIL':
        return INPUT_EMAIL
    elif Type == 'INPUT_PASSWORD':
        return INPUT_PASSWORD
    elif Type == 'INPUT_TIME':
        return INPUT_TIME
    elif Type == 'INPUT_DATE':
        return INPUT_DATE
    elif Type == 'INPUT_CHECKBOX':
        return INPUT_CHECKBOX
    elif Type == 'INPUT_RADIO':
        return INPUT_RADIO
    elif Type == 'INPUT_IMAGE':
        return INPUT_IMAGE
    elif Type == 'INPUT_FILE':
        return INPUT_FILE
    # Models Quiz
    elif Type == 'QUESTION_DESCRIPTIVE':
        return QUESTION_DESCRIPTIVE
    elif Type == 'QUESTION_TEST':
        return QUESTION_TEST
    elif Type == 'FIELD_NAMEANDFAMILY':
        return FIELD_NAMEANDFAMILY
    elif Type == 'FIELD_NATIONALCODE':
        return FIELD_NATIONALCODE
    elif Type == 'FIELD_PHONENUMBER':
        return FIELD_PHONENUMBER
    elif Type == 'FIELD_EMAIL':
        return FIELD_EMAIL

    return None


def GetRealChilds(Childs, Parent):
    LIST = []
    for Child in Childs:
        MODEL = GetElementByType(Child.Type)
        OBJ = MODEL.objects.filter(id=Child.id, Parent_id=Parent.id).first()
        LIST.append(OBJ)
    LIST = sorted(LIST, key=lambda i: i.id)
    return LIST


def SerilizeObj(Obj, **kwargs):
    JSON = {}
    LIST_ATTRIBUTES = kwargs.get('LIST_ATTRIBUTES') or []
    LIST_METHODS = kwargs.get('LIST_METHODS') or []
    LIST_FORIENKEYS = kwargs.get('LIST_FORIENKEYS') or []
    LIST_MANY_TO_MANY = kwargs.get('LIST_MANY_TO_MANY') or []

    for ATTR in LIST_ATTRIBUTES:
        JSON[ATTR] = getattr(Obj, ATTR)

    for METHOD in LIST_METHODS:
        JSON[METHOD] = getattr(Obj, METHOD)()

    for FOREIGNKEY in LIST_FORIENKEYS:
        ForienKey = getattr(Obj, FOREIGNKEY)
        if ForienKey:
            if Has_Method(ForienKey, 'GetJSON'):
                JSON[FOREIGNKEY] = ForienKey.GetJSON()
            else:
                if ForienKey:
                    JSON[FOREIGNKEY] = ForienKey.id

    for MANY_TO_MANY in LIST_MANY_TO_MANY:

        ManyToMany = getattr(Obj, MANY_TO_MANY)
        if ManyToMany:
            ManyToMany = ManyToMany.all()
            LIST_JSON = []
            for Instance in ManyToMany:
                if Has_Method(Instance, 'GetJSON'):
                    LIST_JSON.append(Instance.GetJSON())
                else:
                    LIST_JSON.append(Instance.id)
        JSON[MANY_TO_MANY] = LIST_JSON
    return JSON


class CONFIG_BASE_FORM(models.Model):
    DICT_CONFIG = jsonfield.JSONField(null=True, blank=True)

    def GetJSON(self):
        return self.DICT_CONFIG


class FORM(models.Model):
    User = models.ForeignKey('User.User', on_delete=models.CASCADE)
    ID_FORM = models.CharField(max_length=50, default=RandomString)
    Config = models.ForeignKey('CONFIG_BASE_FORM', on_delete=models.CASCADE)
    Title = models.CharField(max_length=150, default='')
    Description = models.TextField(null=True, blank=True)
    Type = models.CharField(max_length=30, default='Customize')
    DateTimeCreate = models.DateTimeField(auto_now_add=True)
    Form_Edited = models.BooleanField(default=False)

    def __str__(self):
        return self.Title

    def delete(self, *args, **kwargs):
        Pages = PAGE_ELEMENT.objects.filter(Form_id=self.id).all()
        for Page in Pages:
            Page.delete()
        self.Config.delete()
        try:
            super(CONFIG_BASE_FORM, self.Config).delete(*args, *kwargs)
        except:
            pass
        super(FORM, self).delete(*args, **kwargs)

    def DeletePages(self):
        Pages = self.GetPages()
        for Page in Pages:
            Page.delete()

    def GetPages(self):
        return PAGE_ELEMENT.objects.filter(Form_id=self.id).all()

    def GetExpiryDate(self):
        Result = (self.DateTimeCreate + timedelta(days=30))
        if Result < datetime.now():
            self.delete()
        return Result

    def GetTimeEndForm(self):
        Config = self.Config.DICT_CONFIG
        _TimeEnd = f"{Config.get('DateEnd')} {Config.get('TimeEnd')}"
        TimeEnd = datetime.strptime(_TimeEnd, '%Y-%m-%d %H:%M')
        return str(TimeEnd)

    def GetTimeStartForm(self):
        Config = self.Config.DICT_CONFIG
        _TimeStart = f"{Config.get('DateStart')} {Config.get('TimeStart')}"
        TimeStart = datetime.strptime(_TimeStart, '%Y-%m-%d %H:%M')
        return str(TimeStart)

    def GetExpiryDateSpan(self):
        return GetDifferenceTwoTime(self.GetExpiryDate(), GetTimeIran())

    def GetTimeSpan(self):
        return GetDifferenceTime(self.DateTimeCreate)

    def GetRecords(self):
        return self.record_set.all()[::-1]

    def GetViewRecords(self):
        return self.viewrecord_set.all()[::-1]

    def GetConfig(self):
        return json.dumps(self.Config.DICT_CONFIG)

    def GetConfigForm(self):
        return self.Config.DICT_CONFIG

    def GetSeenForm(self):
        return self.viewrecord_set.count()

    def GetSubmitForm(self):
        return self.record_set.count()

    def AccessShowForm(self):
        TimeNow = datetime.now()
        Config = self.Config.DICT_CONFIG
        _TimeStart = f"{Config.get('DateStart')} {Config.get('TimeStart')}"
        _TimeEnd = f"{Config.get('DateEnd')} {Config.get('TimeEnd')}"
        TimeStart = datetime.strptime(_TimeStart, '%Y-%m-%d %H:%M')
        TimeEnd = datetime.strptime(_TimeEnd, '%Y-%m-%d %H:%M')
        if TimeNow > TimeStart and TimeNow < TimeEnd:
            return True
        return False

    def FormEnded(self):
        TimeNow = datetime.now()
        Config = self.Config.DICT_CONFIG
        _TimeEnd = f"{Config.get('DateEnd')} {Config.get('TimeEnd')}"
        TimeEnd = datetime.strptime(_TimeEnd, '%Y-%m-%d %H:%M')
        if TimeNow > TimeEnd:
            return True
        return False


class STYLE_BASE(models.Model):
    DICT_STYLE = jsonfield.JSONField(null=True, blank=True)

    def GetJSON(self):
        return self.DICT_STYLE


class CONFIG_BASE(models.Model):
    DICT_CONFIG = jsonfield.JSONField(null=True, blank=True)

    def GetJSON(self):
        return self.DICT_CONFIG


class VALIDATION_BASE(models.Model):
    DICT_VALIDATION = jsonfield.JSONField(null=True, blank=True)

    def GetJSON(self):
        return self.DICT_VALIDATION


class BASE_ELEMENT(models.Model):
    ID_Element = models.CharField(max_length=30)
    Type = models.CharField(max_length=20)
    Type_Base = models.CharField(max_length=25)
    OnlyCreate = models.BooleanField(default=False)
    STATUS = models.CharField(max_length=7, default='OK')
    Style = models.ForeignKey(to='FormSaz.STYLE_BASE', on_delete=models.CASCADE)
    Config = models.ForeignKey(to='FormSaz.CONFIG_BASE', on_delete=models.CASCADE)
    Parent = models.ForeignKey(to='BASE_ELEMENT', on_delete=models.CASCADE, null=True,
                               blank=True)  # if Page_Element Creator this Attribute ==> None
    ElementsCLASS_Text = models.ManyToManyField(to='FormSaz.TAG_P', related_name='Elements_CLASS_Text', null=True,
                                                blank=True)
    ElementsCLASS_Title = models.ManyToManyField(to='FormSaz.TAG_H3', related_name='Elements_CLASS_Title', null=True,
                                                 blank=True)
    ElementsCLASS_Alert = models.ManyToManyField(to='FormSaz.TAG_P', related_name='Elements_CLASS_Alert', null=True,
                                                 blank=True)
    ElementsCLASS_Secondary = models.ManyToManyField('FormSaz.BASE_ELEMENT', related_name='Elements_CLASS_Secondary',
                                                     null=True, blank=True)

    SRZ_LIST_FIELDS_ATTRIBUTE = ['ID_Element', 'Type', 'OnlyCreate', 'STATUS']
    SRZ_LIST_FIELDS_METHODS = []
    SRZ_LIST_FIELDS_ATTRIBUTE_FORIENKEY = ['Style', 'Config']
    SRZ_LIST_FIELDS_ATTRIBUTE_MANYTOMANY = ['ElementsCLASS_Secondary']

    def __str__(self):
        if self.Parent != None:
            return f'{self.Type}_{self.Parent.__str__()}'
        return self.Type

    def GetConfig(self):
        return self.Config.DICT_CONFIG

    def GetStyle(self):
        return self.Style.DICT_STYLE

    def GetElementsSecondary(self):
        return self.ElementsCLASS_Secondary.all()

    def GetJSON(self):
        x = SerilizeObj(self, LIST_ATTRIBUTES=self.SRZ_LIST_FIELDS_ATTRIBUTE, LIST_METHODS=self.SRZ_LIST_FIELDS_METHODS,
                        LIST_FORIENKEYS=self.SRZ_LIST_FIELDS_ATTRIBUTE_FORIENKEY,
                        LIST_MANY_TO_MANY=self.SRZ_LIST_FIELDS_ATTRIBUTE_MANYTOMANY)
        return x

    def delete(self, *args, **kwargs):

        for ELement in self.ElementsCLASS_Title.all():
            ELement.delete()

        for ELement in self.ElementsCLASS_Text.all():
            ELement.delete()

        for ELement in self.ElementsCLASS_Alert.all():
            ELement.delete()
        if self.Config:
            super(CONFIG_BASE, self.Config).delete(*args, **kwargs)
        if self.Style:
            super(STYLE_BASE, self.Style).delete(*args, **kwargs)
        super(BASE_ELEMENT, self).delete(*args, **kwargs)


class PAGE_ELEMENT(BASE_ELEMENT):
    Form = models.ForeignKey('FormSaz.FORM', models.CASCADE)
    ElementsCLASS = models.ManyToManyField(to='FormSaz.BASE_ELEMENT', related_name='Elements_CLASS_Page', null=True,
                                           blank=True)
    COUNTER_ID_PAGE = models.IntegerField()

    SRZ_LIST_FIELDS_METHODS = ['GetElementsCLASS_JSON']

    def __str__(self):
        return f'{self.Type}_{self.CounterNumberPage()}_{self.Form.__str__()}'

    def CounterNumberPage(self):
        return self.COUNTER_ID_PAGE

    def GetElementsCLASS_JSON(self):
        List = []
        Childs = GetRealChilds(self.ElementsCLASS.all(), self)
        for Child in Childs:
            List.append(Child.GetJSON())
        return List

    def GetElements(self):
        return BASE_ELEMENT.objects.filter(Parent_id=self.id).all()

    def GetBoxs(self):
        return BOX_ELEMENT.objects.filter(Parent_id=self.id).all()

    def GetBoxsJSON(self):
        BOXS = BOX_ELEMENT.objects.filter(Parent_id=self.id).all()
        for Box in BOXS:
            Box.GetJSON()
        return ''

    def GetQuestions(self):
        return Question_Base.objects.filter(Parent_id=self.id).all()

    def GetJSON(self):
        Result = SerilizeObj(self, LIST_ATTRIBUTES=self.SRZ_LIST_FIELDS_ATTRIBUTE,
                             LIST_METHODS=self.SRZ_LIST_FIELDS_METHODS,
                             LIST_FORIENKEYS=self.SRZ_LIST_FIELDS_ATTRIBUTE_FORIENKEY,
                             LIST_MANY_TO_MANY=self.SRZ_LIST_FIELDS_ATTRIBUTE_MANYTOMANY)
        return json.dumps(Result)

    def delete(self, *args, **kwargs):

        for ELement in self.ElementsCLASS_Title.all():
            ELement.delete()

        for ELement in self.ElementsCLASS_Text.all():
            ELement.delete()

        for ELement in self.ElementsCLASS_Alert.all():
            ELement.delete()

        for Element in self.ElementsCLASS.all():
            Element.delete()

        super(CONFIG_BASE, self.Config).delete(*args, **kwargs)
        super(STYLE_BASE, self.Style).delete(*args, **kwargs)
        super(BASE_ELEMENT, self).delete(*args, **kwargs)


class BOX_ELEMENT(BASE_ELEMENT):
    Page = models.ForeignKey(to='FormSaz.PAGE_ELEMENT', on_delete=models.CASCADE)
    ElementsCLASS = models.ManyToManyField(to='FormSaz.BASE_ELEMENT', related_name='Elements_CLASS_Box', null=True,
                                           blank=True)

    SRZ_LIST_FIELDS_METHODS = ['GetElementsCLASS_JSON']

    def __str__(self):
        return f'{self.Type}_{self.Page.__str__()}'

    def GetElementsCLASS_JSON(self):
        List = []
        Childs = GetRealChilds(self.ElementsCLASS.all(), self)
        for Child in Childs:
            List.append(Child.GetJSON())
        return List

    def delete(self, *args, **kwargs):
        for ELement in self.ElementsCLASS_Title.all():
            ELement.delete()

        for ELement in self.ElementsCLASS_Text.all():
            ELement.delete()

        for ELement in self.ElementsCLASS_Alert.all():
            ELement.delete()

        for Element in self.ElementsCLASS.all():
            Element.delete()

        if self.Config:
            super(CONFIG_BASE, self.Config).delete(*args, **kwargs)
        if self.Style:
            super(STYLE_BASE, self.Style).delete(*args, **kwargs)
        super(BASE_ELEMENT, self).delete(*args, **kwargs)


class INPUT_BASE(BASE_ELEMENT):
    Validation = models.ForeignKey(to='FormSaz.VALIDATION_BASE', on_delete=models.CASCADE)

    SRZ_LIST_FIELDS_ATTRIBUTE_FORIENKEY = ['Style', 'Config', 'Validation']

    def __str__(self):
        return f'{self.Type}_{self.Parent.__str__()}'

    def delete(self, *args, **kwargs):

        for ELement in self.ElementsCLASS_Title.all():
            ELement.delete()

        for ELement in self.ElementsCLASS_Text.all():
            ELement.delete()

        for ELement in self.ElementsCLASS_Alert.all():
            ELement.delete()

        if self.Config:
            super(CONFIG_BASE, self.Config).delete(*args, **kwargs)
        if self.Style:
            super(STYLE_BASE, self.Style).delete(*args, **kwargs)
        if self.Validation:
            super(VALIDATION_BASE, self.Validation).delete(*args, **kwargs)
        super(BASE_ELEMENT, self).delete(*args, **kwargs)


class INPUT_CHAR(INPUT_BASE):
    pass


class INPUT_TEXTAREA(INPUT_BASE):
    pass


class INPUT_NUMBER(INPUT_BASE):
    pass


class INPUT_EMAIL(INPUT_BASE):
    pass


class INPUT_PASSWORD(INPUT_BASE):
    pass


class INPUT_TIME(INPUT_BASE):
    pass


class INPUT_DATE(INPUT_BASE):
    pass


class INPUT_CHECKBOX(INPUT_BASE):
    pass


class INPUT_RADIO(INPUT_BASE):
    pass


class INPUT_IMAGE(INPUT_BASE):
    # INPUT_MEDIA
    # Image = models.ImageField(upload_to=UploadInputImageSrc)
    pass


class INPUT_FILE(INPUT_BASE):
    # INPUT_MEDIA
    # File = models.FileField(upload_to=UploadInputFileSrc)
    pass


class TAG_H1(BASE_ELEMENT):
    pass


class TAG_H3(BASE_ELEMENT):
    pass


class TAG_H6(BASE_ELEMENT):
    pass


class TAG_P(BASE_ELEMENT):
    pass


def UploadElementImageSrc(instance, path):
    return Upload_Src(instance, path, 'Node', 'Image')


class IMAGE_BASE(BASE_ELEMENT):
    Image = models.ImageField(upload_to=UploadElementImageSrc, null=True)
    Image_Url = models.SlugField(null=True, blank=True)
    STATE = models.CharField(max_length=7, default='__Init__')


def UploadElementVideoSrc(instance, path):
    return Upload_Src(instance, path, 'Node', 'Video')


class VIDEO_BASE(BASE_ELEMENT):
    Video = models.FileField(upload_to=UploadElementVideoSrc, null=True)
    Video_Url = models.SlugField(null=True, blank=True)
    STATE = models.CharField(max_length=7, default='__Init__')

    def GrtSrcFile(self):
        return self.Video.url


def UploadElementAudioSrc(instance, path):
    return Upload_Src(instance, path, 'Node', 'Audio')


class AUDIO_BASE(BASE_ELEMENT):
    Audio = models.FileField(upload_to=UploadElementAudioSrc, null=True)
    Audio_Url = models.SlugField(null=True, blank=True)
    STATE = models.CharField(max_length=7, default='__Init__')


# Models Quiz

class CONFIG_BASE_QUIZ(models.Model):
    DICT_CONFIG_QUIZ = jsonfield.JSONField(null=True, blank=True)

    def GetJSON(self):
        # return json.dumps(self.DICT_CONFIG_QUIZ)
        return self.DICT_CONFIG_QUIZ


class Question_Base(BOX_ELEMENT):
    ConfigQuiz = models.ForeignKey('FormSaz.CONFIG_BASE_QUIZ', on_delete=models.CASCADE)
    SRZ_LIST_FIELDS_ATTRIBUTE_FORIENKEY = ['Style', 'Config', 'ConfigQuiz']

    def delete(self, *args, **kwargs):

        for ELement in self.ElementsCLASS_Title.all():
            ELement.delete()

        for ELement in self.ElementsCLASS_Text.all():
            ELement.delete()

        for ELement in self.ElementsCLASS_Alert.all():
            ELement.delete()

        if self.Config:
            super(CONFIG_BASE, self.Config).delete(*args, **kwargs)
        if self.ConfigQuiz:
            super(CONFIG_BASE_QUIZ, self.Config).delete(*args, **kwargs)
        if self.Style:
            super(STYLE_BASE, self.Style).delete(*args, **kwargs)
        super(BASE_ELEMENT, self).delete(*args, **kwargs)


class QUESTION_DESCRIPTIVE(Question_Base):
    pass


class QUESTION_TEST(Question_Base):
    pass


class FIELD_NAMEANDFAMILY(BOX_ELEMENT):
    pass


class FIELD_NATIONALCODE(BOX_ELEMENT):
    pass


class FIELD_PHONENUMBER(BOX_ELEMENT):
    pass


class FIELD_EMAIL(BOX_ELEMENT):
    pass


def UploadInputImageSrc(instance, path):
    Path = str(path).split('.')[-1]
    _ = f"Form_{instance.Form.Title}/Record/Image/{RandomString(8)}.{Path}"
    return _


def UploadInputFileSrc(instance, path):
    Path = str(path).split('.')[-1]
    _ = f"Form_{instance.Form.Title}/Record/File/{RandomString(8)}.{Path}"
    return _


class ImageRecord(models.Model):
    Title = models.CharField(max_length=100, null=True, blank=True)
    Form = models.ForeignKey('FORM', on_delete=models.CASCADE)
    Image = models.ImageField(upload_to=UploadInputImageSrc, null=True, blank=True)


class FileRecord(models.Model):
    Title = models.CharField(max_length=100, null=True, blank=True)
    Form = models.ForeignKey('FORM', on_delete=models.CASCADE)
    File = models.FileField(upload_to=UploadInputFileSrc, null=True, blank=True)


class Record(models.Model):
    UserCode = models.CharField(max_length=30)
    TrackingCode = models.CharField(max_length=30)
    Form = models.ForeignKey('FORM', on_delete=models.CASCADE)
    IP = models.CharField(max_length=100)
    InfoDevice = models.TextField()
    DICT_DATA = jsonfield.JSONField()
    INPUT_FILES = models.ManyToManyField(FileRecord)
    INPUT_IMAGES = models.ManyToManyField(ImageRecord)
    DateTimeSubmit = models.DateTimeField(auto_now_add=True)
    IsChecked = models.BooleanField(default=False)
    # For Manager
    Message = models.TextField(null=True, blank=True)
    DateTimeSubmitMessage = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return 'User {s}'.format(s=self.UserCode)

    def GetData(self):
        return json.dumps(self.DICT_DATA)

    def GetTimePast(self):
        return GetDifferenceTime(self.DateTimeSubmit)

    def GetTimePastMessage(self):
        return GetDifferenceTime(self.DateTimeSubmitMessage)



class ViewRecord(models.Model):
    UserCode = models.CharField(max_length=30)
    Form = models.ForeignKey('FORM', on_delete=models.CASCADE)
    IP = models.CharField(max_length=100)
    InfoDevice = models.TextField()
    DateTimeSubmit = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return 'User {s}'.format(s=self.UserCode)

    def GetTimePast(self):
        return GetDifferenceTime(self.DateTimeSubmit)

# When Object "VIDEO_BASE" or "IMAGE_BASE" or "AUDIO_BASE" Deleted Their Files Must also be Deleted So We Use Signals

# Video
# @receiver(signal=signals.post_delete, sender=VIDEO_BASE)
# def DeleteFileVideo_VIDEO_BASE(sender, instance, **kwargs):
#     if instance.STATE == 'Create':
#         if instance.Video:
#             if os.path.isfile(instance.Video.path):
#                 os.remove(instance.Video.path)


# Image
# @receiver(signal=signals.post_delete, sender=IMAGE_BASE)
# def DeleteFileImage_IMAGE_BASE(sender, instance, **kwargs):
#     if instance.STATE == 'Create':
#         if instance.Image:
#             if os.path.isfile(instance.Image.path):
#                 os.remove(instance.Image.path)


# Audio
# @receiver(signal=signals.post_delete, sender=AUDIO_BASE)
# def DeleteFileAudio_AUDIO_BASE(sender, instance, **kwargs):
#     if instance.STATE == 'Create':
#         if instance.Audio:
#             if os.path.isfile(instance.Audio.path):
#                 os.remove(instance.Audio.path)
