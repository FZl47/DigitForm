GetCookieFunctionality_ShowNotification()

// ------------ Important ------------
let TYPECREATEMODELS = 'Config'
// ------------  ------------  ------------


document.addEventListener('keyup', function (e) {
    if (e.key == 'Delete') {
        if (InstanceActiveInSetttings) {
            if (InstanceActiveInSetttings.CAN_DELETE == true) {
                let IndexInstance = InstanceActiveInSetttings.IndexInInstance
                if (IndexInstance != null && IndexInstance != undefined) {
                    DELETE_ELEMENT(IndexInstance)
                }
            }
        }
    }
})

function GetAttr(Element, Attr) {
    return Element.getAttribute(Attr) || undefined
}

function SetAttr(Element, Attr, Value = null) {
    Element.setAttribute(Attr, Value)
}

function RemoveAttr(Element, Attr) {
    Element.removeAttribute(Attr)
}

function Initil_OnInputAction() {
    let Inputs_ActionInputSettings__ONINPUT = document.querySelectorAll('[ActionInputSettings_OnInput]')
    for (let Input of Inputs_ActionInputSettings__ONINPUT) {
        Input.addEventListener('input', function (e) {
            let Input_Element = e.currentTarget
            let Value = Input_Element.value
            let Index = GetAttr(Input_Element, 'ActionInputSettings_OnInput')
            let TypeBase = GetAttr(Input_Element, 'ActionInputSettings_OnInput_TypeBase') || 'Style'
            ActionInputSettings_ONINPUT(e.currentTarget, TypeBase, INSTANCES_ELEMENTS[Index], Value)
        })
    }
}

function ActionInputSettings_ONINPUT(Input, TypeBase, Instance, Value) {
    let TypeAction = GetAttr(Input, 'ActionInputSettings_OnInput_Type')
    try {
        if (TypeBase == 'Config') {
            Instance.Config[TypeAction](Value, Instance, Input)
        } else if (TypeBase == 'ConfigQuiz') {
            Instance.ConfigQuiz[TypeAction](Value, Instance, Input)
        } else if (TypeBase == 'Style') {
            Instance.Style[TypeAction](Value, Input)
        } else if (TypeBase == 'Validation') {
            Instance.Validation[TypeAction](Value, Input, Instance)
        }
    } catch (e) {
        throw 'Method is not Defiend or Problems in Method'
    }
}

function Initial_OnClickAction() {
    let Inputs_ActionInputSettings__ONCLICK = document.querySelectorAll('[ActionInputSettings_OnClick]')
    for (let Input of Inputs_ActionInputSettings__ONCLICK) {
        Input.addEventListener('click', function (e) {
            let Input_Element = e.currentTarget
            let Value = Input_Element.value
            let Index = GetAttr(Input_Element, 'ActionInputSettings_OnClick')
            let TypeBase = GetAttr(Input_Element, 'ActionInputSettings_OnClick_TypeBase') || 'Style'
            ActionInputSettings_ONCLICK(e.currentTarget, TypeBase, INSTANCES_ELEMENTS[Index], Value)
        })
    }
}

function ActionInputSettings_ONCLICK(Input, TypeBase, Instance, Value) {
    let TypeAction = GetAttr(Input, 'ActionInputSettings_OnClick_Type')
    try {
        if (TypeBase == 'Config') {
            Instance.Config[TypeAction](Value, Instance, Input)
        } else if (TypeBase == 'ConfigQuiz') {
            Instance.ConfigQuiz[TypeAction](Value, Instance, Input)
        } else if (TypeBase == 'Style') {
            Instance.Style[TypeAction](Value, Input)
        } else if (TypeBase == 'Validation') {
            Instance.Validation[TypeAction](Value, Input, Instance)
        }

    } catch (e) {
        throw 'Method is not Defiend or Problems in Method'
    }
}


let InstanceActiveInSetttings
let ElementActiveInSetttings

function ControlSettingsMenu_For_Element(State, Element = null, Instance = null) {
    if (State == 'Open') {
        ControlSettingsMenu_For_Element('Close') // In First Clear Container Settings
        SetAttr(ContainerItemsSettings.parentNode, 'State', 'Open')
        SetAttr(ContainerBox, 'FullSize', 'false')
        Instance.Initial_Settings()
        Initil_OnInputAction()
        Initial_OnClickAction()
        InstanceActiveInSetttings = Instance
        ElementActiveInSetttings = Element
        InstanceActiveInSetttings.FocusElement(Element)
        document.body.classList.add('ControlSettingsMenu_Body_Open')
        window.scrollTo(0, 0)
    } else {
        ContainerItemsSettings.innerHTML = ''
        SetAttr(ContainerItemsSettings.parentNode, 'State', 'Close')
        SetAttr(ContainerBox, 'FullSize', 'true')
        if (InstanceActiveInSetttings != undefined && InstanceActiveInSetttings != null) {
            InstanceActiveInSetttings.FocousOutElement(ElementActiveInSetttings)
            ElementActiveInSetttings = null
            InstanceActiveInSetttings = null
        }
        document.body.classList.remove('ControlSettingsMenu_Body_Open')
    }
}


let ButtonCreateNewPage = document.querySelector('#ButtonCreateNewPage')
let Button_Input_CHAR = document.querySelector('[ClickModeInput=CHAR]')
let Button_Input_TEXT = document.querySelector('[ClickModeInput=TEXT]')
let Button_Input_NUMBER = document.querySelector('[ClickModeInput=NUMBER]')
let Button_Input_EMAIL = document.querySelector('[ClickModeInput=EMAIL]')
let Button_Input_PASSWORD = document.querySelector('[ClickModeInput=PASSWORD]')
let Button_Input_TIME = document.querySelector('[ClickModeInput=TIME]')
let Button_Input_DATE = document.querySelector('[ClickModeInput=DATE]')
let Button_Input_CHECKBOX = document.querySelector('[ClickModeInput=CHECKBOX]')
let Button_Input_RADIO = document.querySelector('[ClickModeInput=RADIO]')
let Button_Input_IMAGE = document.querySelector('[ClickModeInput=IMAGE]')
let Button_Input_FILE = document.querySelector('[ClickModeInput=FILE]')


let Button_ELEMENT_BOX = document.querySelector('[ClickModeTag=ELEMENT_BOX]')
let Button_ELEMENT_H1 = document.querySelector('[ClickModeTag=ELEMENT_LARGE_TITLE]')
let Button_ELEMENT_H3 = document.querySelector('[ClickModeTag=ELEMENT_MEDIUM_TITLE]')
let Button_ELEMENT_H6 = document.querySelector('[ClickModeTag=ELEMENT_SMALL_TITLE]')
let Button_ELEMENT_P = document.querySelector('[ClickModeTag=ELEMENT_TEXT]')
let Button_ELEMENT_IMAGE = document.querySelector('[ClickModeTag=ELEMENT_IMAGE]')
let Button_ELEMENT_VIDEO = document.querySelector('[ClickModeTag=ELEMENT_VIDEO]')
let Button_ELEMENT_AUDIO = document.querySelector('[ClickModeTag=ELEMENT_AUDIO]')


// Event Click


if (ButtonCreateNewPage) {
    ButtonCreateNewPage.addEventListener('click', function () {
        new PAGE_ELEMENT()
    })
}
if (Button_Input_CHAR) {
    Button_Input_CHAR.addEventListener('click', function () {
        new INPUT_CHAR()
    })
}
if (Button_Input_TEXT) {
    Button_Input_TEXT.addEventListener('click', function () {
        new INPUT_TEXTAREA()
    })
}
if (Button_Input_NUMBER) {
    Button_Input_NUMBER.addEventListener('click', function () {
        new INPUT_NUMBER()
    })
}
if (Button_Input_EMAIL) {
    Button_Input_EMAIL.addEventListener('click', function () {
        new INPUT_EMAIL()
    })
}
if (Button_Input_PASSWORD) {
    Button_Input_PASSWORD.addEventListener('click', function () {
        new INPUT_PASSWORD()
    })
}
if (Button_Input_TIME) {
    Button_Input_TIME.addEventListener('click', function () {
        new INPUT_TIME()
    })
}
if (Button_Input_DATE) {
    Button_Input_DATE.addEventListener('click', function () {
        new INPUT_DATE()
    })
}

if (Button_Input_CHECKBOX) {
    Button_Input_CHECKBOX.addEventListener('click', function () {
        let Element = new INPUT_CHECKBOX(new BOX_BASE())
        Element.Config.Create_TextElement('', Element)
    })
}
if (Button_Input_RADIO) {
    Button_Input_RADIO.addEventListener('click', function () {
        let Element = new INPUT_RADIO(new BOX_BASE())
        Element.Config.Create_TextElement('', Element)
    })
}

if (Button_Input_IMAGE) {
    Button_Input_IMAGE.addEventListener('click', function () {
        new INPUT_IMAGE()
    })
}

if (Button_Input_FILE) {
    Button_Input_FILE.addEventListener('click', function () {
        new INPUT_FILE()
    })
}

if (Button_ELEMENT_H1) {
    Button_ELEMENT_H1.addEventListener('click', function () {
        new TAG_H1()
    })
}

if (Button_ELEMENT_H3) {
    Button_ELEMENT_H3.addEventListener('click', function () {
        new TAG_H3()
    })
}

if (Button_ELEMENT_H6) {
    Button_ELEMENT_H6.addEventListener('click', function () {
        new TAG_H6()
    })
}

if (Button_ELEMENT_P) {
    Button_ELEMENT_P.addEventListener('click', function () {
        new TAG_P()
    })
}

if (Button_ELEMENT_BOX) {
    Button_ELEMENT_BOX.addEventListener('click', function () {
        new BOX_BASE()
    })
}
if (Button_ELEMENT_IMAGE) {
    Button_ELEMENT_IMAGE.addEventListener('click', function () {
        new IMAGE_BASE()
    })
}
if (Button_ELEMENT_VIDEO) {
    Button_ELEMENT_VIDEO.addEventListener('click', function () {
        new VIDEO_BASE()
    })
}
if (Button_ELEMENT_AUDIO) {
    Button_ELEMENT_AUDIO.addEventListener('click', function () {
        new AUDIO_BASE()
    })
}

document.querySelector('#BtnSubmitForm').addEventListener('click', function () {
    SubmitForm()
})

let ContainerCreator = document.querySelector('#Container')
let ContainerCreatingForm = document.querySelector('#ContainerCreatingForm')
let ContainerDescriptionCreatingForm = document.querySelector('#ContainerDescriptionCreatingForm')
let ContainerDescriptionCreatedForm = document.querySelector('#ContainerDescriptionCreatedForm')
let Link_Go_To_Panel_User = document.querySelector('#Link_Go_To_Panel_User')
let Link_Show_Form = document.querySelector('#Link_Show_Form')
let Link_Go_To_Home = document.querySelector('#Link_Go_To_Home')
let Link_Go_Back_To_Edit = document.querySelector('#Link_Go_Back_To_Edit')

function SubmitForm() {

    let State_Title_Valid, State_Description_Valid, State_TimeStart_Valid, State_TimeEnd_Valid,
        State_DateStart_Valid, State_DateEnd_Valid = false

    if (FORM.Config.ConfigSettings.Title_Valid == 'false') {
        ShowNotificationMessage('لطفا فیلد عنوان فرم در تنظیمات را به درستی وارد نمایید', 'Error')
    } else {
        State_Title_Valid = true
    }
    if (FORM.Config.ConfigSettings.Description_Valid == 'false') {
        ShowNotificationMessage('لطفا فیلد توضیحات فرم در تنظیمات را به درستی وارد نمایید', 'Error')
    } else {
        State_Description_Valid = true
    }
    if (FORM.Config.ConfigSettings.TimeStart_Valid == 'false') {
        ShowNotificationMessage('لطفا فیلد زمان شروع فرم در تنظیمات را به درستی وارد نمایید', 'Error')
    } else {
        State_TimeStart_Valid = true
    }
    if (FORM.Config.ConfigSettings.TimeEnd_Valid == 'false') {
        ShowNotificationMessage('لطفا فیلد زمان پایان فرم در تنظیمات را به درستی وارد نمایید', 'Error')
    } else {
        State_TimeEnd_Valid = true
    }
    if (FORM.Config.ConfigSettings.DateStart_Valid == 'false') {
        ShowNotificationMessage('لطفا فیلد تاریخ شروع فرم در تنظیمات را به درستی وارد نمایید', 'Error')
    } else {
        State_DateStart_Valid = true
    }
    if (FORM.Config.ConfigSettings.DateEnd_Valid == 'false') {
        ShowNotificationMessage('لطفا فیلد تاریخ پایان فرم در تنظیمات را به درستی وارد نمایید', 'Error')
    } else {
        State_DateEnd_Valid = true
    }


    // Submit Settings Form
    let Status_Submit_Info_Form = false
    if (State_Title_Valid && State_Description_Valid && State_TimeStart_Valid && State_TimeEnd_Valid && State_DateStart_Valid && State_DateEnd_Valid) {
        ShowCreatingForm()
        let Form_Object = {...FORM.Config.ConfigSettings}
        Form_Object['ID_FORM'] = _ID_FORM
        SendAjax('/FormSaz/ChangeInfoForm', {'Form_Object': Form_Object}, 'POST', function (Response) {
            let Status = Response.Status
            if (Status == '200') {
                Status_Submit_Info_Form = true
                SendAndCreateElementsForm()
            } else {
                Status_Submit_Info_Form = false
                ShowNotificationMessage(Response.Status_Text, 'Error', 6500)
                GoBackToEditForm()
            }
        })
    } else {
        GoBackToEditForm()
    }


    // Create Elements

    function RefactorElement(Element) {
        let Elements_Class_Alert = Element.ELementsCLASS_Alert || []
        let Elements_Class_Text = Element.ELementsCLASS_Text || []
        let Elements_Class_Title = Element.ELementsCLASS_Title || []
        let ElementsCLASS_Secondary = Element.ElementsCLASS_Secondary || []
        // Element.ELementsCLASS_Alert = RemoveUndefineValInList(Elements_Class_Alert.map(function (Object) {
        //     if (Object.STATUS != 'DELETED') {
        //         let New_Object = DeleteSomeVals(Object)
        //         return New_Object
        //     }
        // }))
        // Element.ELementsCLASS_Text = RemoveUndefineValInList(Elements_Class_Text.map(function (Object) {
        //     if (Object.STATUS != 'DELETED') {
        //         let New_Object = DeleteSomeVals(Object)
        //         return New_Object
        //     }
        // }))
        // Element.ELementsCLASS_Title = RemoveUndefineValInList(Elements_Class_Title.map(function (Object) {
        //     if (Object.STATUS != 'DELETED') {
        //         let New_Object = DeleteSomeVals(Object)
        //         return New_Object
        //     }
        // }))

        Element.ElementsCLASS_Secondary = RemoveUndefineValInList(ElementsCLASS_Secondary.map(function (Object) {
            if (Object.STATUS != 'DELETED') {
                let New_Object = DeleteSomeVals(Object)
                return New_Object
            }
        }))
        Element.ELementsCLASS_Alert = []
        Element.ELementsCLASS_Text = []
        Element.ELementsCLASS_Title = []
    }

    function RemoveUndefineValInList(List) {
        let List_ = []
        for (let Val of List) {
            if (Val != undefined) {
                List_.push(Val)
            }
        }
        return List_
    }

    function DeleteSomeVals(Obj) {

        let New_Object = {...Obj} // Get a Copy on Instance
        if (Obj.Config != undefined) {
            New_Object.DICT_CONFIG = Obj.Config.ConfigSettings
        }
        if (Obj.Style != undefined) {
            New_Object.DICT_STYLE = Obj.Style.StyleSettings
        }
        if (Obj.Validation != undefined) {
            New_Object.DICT_VALIDATION = Obj.Validation.ValidationSettings
        }

        delete New_Object.Style
        delete New_Object.Config
        delete New_Object.ConfigQuiz
        delete New_Object.Validation
        delete New_Object.Elements
        delete New_Object.ELEMENT
        delete New_Object.INPUT_ANSWER
        delete New_Object.TITLE_FIELD
        delete New_Object.ContainerPage
        delete New_Object.ClassContainer_SET


        if (_TypeForm == 'Quiz') {
            if (New_Object.Type_Base == 'ELEMENT_BASE_QUIZ') {
                if (Obj.ConfigQuiz != undefined) {
                    New_Object.DICT_CONFIG_QUIZ = Obj.ConfigQuiz.ConfigSettings
                    delete New_Object.ConfigQuiz
                    delete New_Object.TITLE_QUESTION
                    delete New_Object.INPUT_ANSWER
                    let LIST_INPUT_ANSWER = New_Object.LIST_INPUT_ANSWER || []
                    for (let i = 1; i < LIST_INPUT_ANSWER.length + 1; i++) {
                        delete New_Object[`INPUT_ANSWER_${i}`]
                    }
                    delete New_Object.LIST_INPUT_ANSWER
                }
            }
        }
        return New_Object
    }

    let RESULTS = []

    function SendAndCreateElementsForm() {
        for (let ClassPage of LIST_PAGES_CLASS) {
            if (ClassPage.STATUS != 'DELETED') {
                ClassPage = DeleteSomeVals(ClassPage)
                let Elements_Class = ClassPage.ElementsCLASS
                let Elements_Class_Alert = ClassPage.ELementsCLASS_Alert || []
                let Elements_Class_Text = ClassPage.ELementsCLASS_Text || []
                let Elements_Class_Title = ClassPage.ELementsCLASS_Title || []
                let ElementsCLASS_Secondary = ClassPage.ElementsCLASS_Secondary || []

                ClassPage.ElementsCLASS = RemoveUndefineValInList(Elements_Class.map(function (Object) {
                    if (Object.STATUS != 'DELETED') {
                        let New_Object = DeleteSomeVals(Object)
                        return New_Object
                    }
                }))
                RefactorElement(ClassPage)
                for (let Element of ClassPage.ElementsCLASS) {
                    RefactorElement(Element)
                }
                for (let Element of ClassPage.ElementsCLASS) {
                    if (Element.Type == 'BOX_ELEMENT' || Element.Type == 'QUESTION_DESCRIPTIVE' || Element.Type == 'QUESTION_TEST' || Element.Type == 'FIELD_NAMEANDFAMILY' || Element.Type == 'FIELD_NATIONALCODE' || Element.Type == 'FIELD_PHONENUMBER' || Element.Type == 'FIELD_EMAIL') {
                        let Box = Element
                        let ElementsCLASS = Box.ElementsCLASS
                        Box.ElementsCLASS = RemoveUndefineValInList(ElementsCLASS.map(function (Object) {
                            if (Object.STATUS != 'DELETED') {
                                let New_Object = DeleteSomeVals(Object)
                                return New_Object
                            }
                        }))
                        for (let Element of Box.ElementsCLASS) {
                            RefactorElement(Element)
                        }
                    }
                }
                RESULTS.push(ClassPage)
            }
        }
        let FormElement = document.createElement('form')
        let Status_Files_Media = true
        for (let Class_Meida of LIST_INSTANCE_MEDIA) {
            if (Class_Meida.STATUS != 'DELETED') {
                let INPUT_MEDIA = Class_Meida.INPUT_MEDIA
                if (INPUT_MEDIA || Class_Meida.STATE == 'Edit') {
                    if (INPUT_MEDIA) {
                        FormElement.appendChild(INPUT_MEDIA)
                    }
                } else {
                    Status_Files_Media = false
                    ShowNotificationMessage(` فایل ${Class_Meida.Type_Text} انتخاب نشده است `, 'Error', 6500)
                }
            }
        }
        if (Status_Files_Media == true && Status_Submit_Info_Form == true) {
            let FORM_DATA = new FormData(FormElement)
            try {
                FORM_DATA.append('Data', JSON.stringify(RESULTS))
            } catch (e) {
                GoBackToEditForm()
                ShowNotificationMessage('مشکلی در تحلیل دیتا وجود دارد لطفا به پشتیبانی اطلاع دهید', 'Error')
                throw e
            }
            FORM_DATA.append('ID_FORM', _ID_FORM)
            $.ajax({
                type: 'POST',
                url: `/FormSaz/CreateElementsForm`,
                enctype: 'multipart/form-data',
                processData: false,
                contentType: false,
                dataType: 'json',
                data: FORM_DATA,
                success: function (Response) {
                    let Status = Response.Status
                    if (Status == '200') {
                        ShowCreatedForm()

                        let Url_View_Form = `/View/${_ID_FORM}`
                        Link_Go_To_Home.classList.remove('Disabled')
                        Link_Go_To_Panel_User.classList.remove('Disabled')
                        Link_Show_Form.classList.remove('Disabled')
                        Link_Go_Back_To_Edit.classList.remove('Disabled')
                        Link_Show_Form.href = Url_View_Form
                        Link_Go_To_Panel_User.href = '/User/Panel'
                        Link_Go_To_Home.href = '/'
                        Link_Go_Back_To_Edit.setAttribute('onclick', 'GoBackToEditForm()')

                    } else if (Status == '404') {
                        for (let Message of Response.LIST_STAUTS_CREATE) {
                            if (Message.Status != 'OK') {
                                ShowNotificationMessage(Message.Status_Text, 'Error', 6500)
                            }
                        }
                        ShowNotificationMessage(Response.Status_Text, 'Error', 6500)
                        GoBackToEditForm()
                    } else if (Status == '500') {
                        for (let Message of Response.LIST_STAUTS_CREATE) {
                            if (Message.Status != 'OK') {
                                ShowNotificationMessage(Message.Status_Text, 'Error', 6500)
                            }
                        }
                        ShowNotificationMessage(Response.Status_Text, 'Error', 6500)
                        GoBackToEditForm()
                    }
                },
                failed: function () {
                    ShowNotificationMessage('مشکلی در ثبت دیتا وجود دارد', 'Error', 6500)
                    GoBackToEditForm()
                }
            })
        } else {
            GoBackToEditForm()
        }
    }
}

function GoBackToEditForm() {
    ContainerDescriptionCreatingForm.classList.add('d-none')
    ContainerDescriptionCreatedForm.classList.remove('d-none')
    ContainerCreator.classList.remove('d-none')
    ContainerCreatingForm.classList.add('d-none')


    Link_Go_To_Home.classList.add('Disabled')
    Link_Go_To_Panel_User.classList.add('Disabled')
    Link_Show_Form.classList.add('Disabled')
    Link_Go_Back_To_Edit.classList.add('Disabled')

    Link_Show_Form.removeAttribute('href')
    Link_Go_To_Panel_User.removeAttribute('href')
    Link_Go_To_Home.removeAttribute('href')

    Link_Go_Back_To_Edit.removeAttribute('onclick')
}

function ShowCreatingForm() {
    ContainerDescriptionCreatingForm.classList.remove('d-none')
    ContainerDescriptionCreatedForm.classList.add('d-none')
    ContainerCreator.classList.add('d-none')
    ContainerCreatingForm.classList.remove('d-none')
}

function ShowCreatedForm() {
    ContainerDescriptionCreatingForm.classList.add('d-none')
    ContainerDescriptionCreatedForm.classList.remove('d-none')
    ContainerCreator.classList.add('d-none')
    ContainerCreatingForm.classList.remove('d-none')
}


let BtnMenuElements = document.getElementById('BtnMenuElements')
if (BtnMenuElements) {
    let StateMenu = 'Open'
    let ContainerElementsAside = document.getElementById('ContainerElementsAside')
    BtnMenuElements.addEventListener('click', function () {
        if (StateMenu == 'Open') {
            StateMenu = 'Close'
            ContainerElementsAside.classList.add('ContainerElementsAside_Open')
            ClickOutSideContainer(ContainerElementsAside, function () {
                CloseMenu()
            })
            window.scrollTo(0, 0)
            document.body.classList.add('ContainerElementsAside_Body_Open')
        } else {
            CloseMenu()
        }
    })

    function CloseMenu() {
        StateMenu = 'Open'
        ContainerElementsAside.classList.remove('ContainerElementsAside_Open')
        document.body.classList.remove('ContainerElementsAside_Body_Open')
    }
}


Initial_DarkMode_Controll(document.querySelector('#BtnChangeTheme'), {
    'Src': '/Assets/FormSaz/Css/Creator/IndexCreatorDark.css'
}, function () {
    let Image = document.getElementById('Gif_Loading_CreateElements')
    // Image.src = '/Assets/FormSaz/Image/Create/Gif_Creating_Dark.gif'
    Image.classList.add('d-none')
}, function () {
    let Image = document.getElementById('Gif_Loading_CreateElements')
    // Image.src = '/Assets/FormSaz/Image/Create/Gif_Creating_Light.gif'
    Image.classList.remove('d-none')
})

