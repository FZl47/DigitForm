$(document).ready(function () {
    $('[data-toggle="tooltip"]').tooltip();
});
GetCookieFunctionality_ShowNotification()


let FORM = new FORM_BASE(_Form)
if (StateEditedForm == 'True') {
    let _ConfigForm = JSON.parse(_Form.GetConfig)
    FORM.Config.ConfigSettings = _ConfigForm
}
let ContainerInfoForm = document.querySelector('#ContainerInfoForm')
let FormInfo = document.querySelector('#FormInfo')
let BtnSubmitInfoForm = document.querySelector('#BtnSubmitInfoForm')

FormInfo.innerHTML = FORM.SettingsForm(true)
FormInfo.addEventListener('input', function () {
    BtnSubmitInfoForm.classList.remove('Disabled')
    BtnSubmitInfoForm.onclick = function () {
        SubmitInfoForm()
    }
    for (let Field of FORM.LIST_VALIDATION_CONFIG) {
        let Valid = FORM.Config.ConfigSettings[`${Field}_Valid`]
        if (Valid == 'false') {
            BtnSubmitInfoForm.classList.add('Disabled')
            BtnSubmitInfoForm.onclick = function () {
            }
        }
    }
})

function SubmitInfoForm() {
    let Form_Object = {...FORM.Config.ConfigSettings}
    Form_Object['ID_FORM'] = _ID_FORM
    SendAjax('/FormSaz/ChangeInfoForm', {'Form_Object': Form_Object}, 'POST', function (Response) {
        let Status = Response.Status
        if (Status == '200') {
            ShowNotificationMessage(Response.Status_Text, 'Success')
        } else {
            ShowNotificationMessage(Response.Status_Text, 'Error', 6500)
        }
    })
}


function DeleteForm(ID) {
    let StateDeleted = false
    CreateMessage_Alert(` ایا از حذف فرم <b> ${FORM.Title}</b> اطمینان دارید ؟ `, function () {
        SendAjax('/FormSaz/DeleteForm', {'ID': ID}, 'POST', function (Response) {
            let Status = Response.Status
            if (Status == '200') {
                StateDeleted = true
                ShowNotificationMessage(Response.Status_Text, 'Success')
                location.href = '/User/Panel'
            } else {
                StateDeleted = false
                ShowNotificationMessage(Response.Status_Text, 'Error')
            }
        })
    })
}


let BtnChangeTheme = document.getElementById('BtnChangeTheme')
let BtnChangeThemeMenu = document.getElementById('BtnChangeThemeMenu')

BtnChangeTheme.addEventListener('click', function () {
    EventSethThemeColor(this)
})

BtnChangeThemeMenu.addEventListener('click', function () {
    EventSethThemeColor(this)
})

function EventSethThemeColor(Btn) {
    let StateStyle = Btn.getAttribute('ThemeColorMostActive') || 'Light'
    if (StateStyle == 'Dark') {
        BtnChangeTheme.setAttribute('ThemeColorMostActive', 'Light')
        BtnChangeThemeMenu.setAttribute('ThemeColorMostActive', 'Light')
    } else {
        BtnChangeTheme.setAttribute('ThemeColorMostActive', 'Dark')
        BtnChangeThemeMenu.setAttribute('ThemeColorMostActive', 'Dark')
    }
    SetCookie('ThemeColor', StateStyle, 365,)
    SetThemeColor()
}

function SetThemeColor() {
    let Theme = GetCookieByName('ThemeColor') || 'Light'
    let SrcFileStyleDark = '/Assets/FormSaz/Css/View/index-dark.css'
    ControllThemeAndBtn(Theme, SrcFileStyleDark, function () {
    }, function () {
    })
    if (Theme == 'Dark') {
        BtnChangeTheme.className = 'fa fa-sun'
        BtnChangeThemeMenu.className = 'fa fa-sun'
    } else {
        BtnChangeTheme.className = 'fa fa-moon'
        BtnChangeThemeMenu.className = 'fa fa-moon'
    }
}

SetThemeColor()
