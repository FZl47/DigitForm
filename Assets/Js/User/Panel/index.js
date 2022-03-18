$('[data-toggle="tooltip"]').tooltip()
SplitPrice()
GetCookieFunctionality_ShowNotification()

function SetClickBtnMenu() {
    let All_BtnClickActivePage = document.querySelectorAll('[BtnClickActivePage]')
    for (let Btn of All_BtnClickActivePage) {
        Btn.addEventListener('click', function (e) {
            let Type = this.getAttribute('BtnClickActivePage')
            ActivePage(Type)
        })
    }
}

SetClickBtnMenu()

function ActivePage(Type) {
    DisableAllPage()
    setTimeout(function () {
        CloseMenuHamburgerID('ContainerMenuHamburger')
    })
    try {
        document.querySelector(`[BtnClickActivePage=${Type}]`).classList.add('ActiveBtnMenu')
        let Container = document.querySelector(`#Container_${Type}`)
        Container.classList.remove('d-none')
    } catch (e) {
        ControllImageContentDoesNotExists('Show')
    }
}

function DisableAllPage() {
    ControllImageContentDoesNotExists('Hide')
    let BtnsMenu = document.querySelectorAll('.ActiveBtnMenu')
    for (let Btn of BtnsMenu) {
        Btn.classList.remove('ActiveBtnMenu')
    }
    let Containers = document.querySelectorAll('[ContainerPage]')
    for (let Container of Containers) {
        Container.classList.add('d-none')
    }
}

let ContainerContentDoesNotExists = document.querySelector('#ContainerContentDoesNotExists')

function ControllImageContentDoesNotExists(Type) {
    if (Type == 'Show') {
        ContainerContentDoesNotExists.classList.remove('d-none')
    } else {
        ContainerContentDoesNotExists.classList.add('d-none')
    }
}

ActivePage('FormsCreated') // Show Page Forms Created By Default
let FuncSetActiveContainer = ActivePage
let UrlContainer = window.location.href
let ValueForItemMenu = UrlContainer.split('?')[1]
if (ValueForItemMenu != undefined && ValueForItemMenu != '' && ValueForItemMenu != ' ') {
    if (ValueForItemMenu == 'Home') {
        GoToUrl('/')
    }
    FuncSetActiveContainer(ValueForItemMenu)
}

let FormCreate_Form = document.querySelector('#FormCreate_Form')
let All_Input_FormCreate_Form = FormCreate_Form.querySelectorAll('[InputForm]')
let BtnSubmitFormCreate_Form = FormCreate_Form.querySelector('#BtnSubmitFormCreate_Form')
let Dict_Validation_FormCreate = {
    'Title': {
        'Less': '150',
        'Bigger': '2'
    },
    'Description': {
        'Less': '3000',
        'Bigger': '-1'
    }
}

FormCreate_Form.addEventListener('input', function () {
    let StateValid = true
    for (let Input of All_Input_FormCreate_Form) {
        let Valid_Dict = Dict_Validation_FormCreate[Input.name]
        if (Valid_Dict != undefined) {
            let State = CheckInputValidations(Input, Valid_Dict['Bigger'], Valid_Dict['Less'], 'Icon')
            if (State == false) {
                StateValid = false
            }
        }
    }
    if (StateValid) {
        BtnSubmitFormCreate_Form.type = 'submit'
    } else {
        BtnSubmitFormCreate_Form.type = 'button'
    }
})

function DeleteForm(ID) {
    let ElementForm = document.querySelector(`#Form_${ID}`)
    let TitleForm = ElementForm.getAttribute('TitleForm')
    CreateMessage_Alert(` ایا از حذف فرم <b> ${TitleForm}</b> اطمینان دارید ؟ `, function () {
        SendAjax('/FormSaz/DeleteForm', {'ID': ID}, 'POST', function (Response) {
            let Status = Response.Status
            if (Status == '200') {
                ShowNotificationMessage(Response.Status_Text, 'Success')
                ElementForm.remove()
            } else {
                ShowNotificationMessage(Response.Status_Text, 'Error')
            }
        })
    })
}

let InputSearchFrom = document.querySelector('#InputSearchFrom')
let All_FormCreated = document.querySelectorAll('.FormCreated')
let ResultSearchForm = document.querySelector('#ResultSearchForm')
let ContainerTitleSearchFormCreated = document.querySelector('#ContainerTitleSearchFormCreated')
let ContainerImageNoFormSearchResult = document.querySelector('#ContainerImageNoFormSearchResult')
let ContainerImageDesignFormsCreated = document.querySelector('#ContainerImageDesignFormsCreated')
InputSearchFrom.addEventListener('input', function () {
    ActivePage('FormsCreated')
    if (ListIsNone(List_Forms) == false) {
        let ResultIsAvailable = false
        let ValueSearch = this.value
        ContainerTitleSearchFormCreated.classList.remove('d-none')
        for (let Form of All_FormCreated) {
            Form.classList.add('d-none')
        }
        if (!IsBlank(ValueSearch)) {

            ResultSearchForm.innerText = ValueSearch
            for (let Form of LIST_INSTANCE_FORMS) {
                if (String(Form.Title).includes(ValueSearch)) {
                    document.querySelector(`#Form_${Form.ID}`).classList.remove('d-none')
                    ResultIsAvailable = true
                }
            }
            if (!ResultIsAvailable) {
                ContainerImageNoFormSearchResult.classList.remove('d-none')
                ContainerImageDesignFormsCreated.classList.add('d-none')
            } else {
                ContainerImageNoFormSearchResult.classList.add('d-none')
                ContainerImageDesignFormsCreated.classList.remove('d-none')
            }
        } else {
            ContainerTitleSearchFormCreated.classList.add('d-none')
            ContainerImageNoFormSearchResult.classList.add('d-none')
            ContainerImageDesignFormsCreated.classList.remove('d-none')
            for (let Form of All_FormCreated) {
                Form.classList.remove('d-none')
            }
        }
    }
})


let FormSubmitInfo = document.querySelector('#FormSubmitInfo')
let BtnSubmitInfo = document.querySelector('#BtnSubmitInfo')
let All_Input_FormSubmitInfo = FormSubmitInfo.querySelectorAll('[InputForm]')
FormSubmitInfo.addEventListener('input', function () {
    let State = true
    for (let Input of All_Input_FormSubmitInfo) {
        let Valid = Input.getAttribute('Valid') || 'false'
        if (Valid == 'false') {
            State = false
        }
    }
    if (State) {
        BtnSubmitInfo.classList.remove('Disabled')
        BtnSubmitInfo.type = 'submit'
    } else {
        BtnSubmitInfo.classList.add('Disabled')
        BtnSubmitInfo.type = 'button'
    }
})

let LIST_INSTANCE_FORMS = []

class FORM {
    constructor(Form) {
        LIST_INSTANCE_FORMS.push(this)
        this.Form_Info = Form
        this.ID = Form.id
        this.Title = Form.Title
        this.Description = Form.Description
    }
}

for (let Form of List_Forms) {
    new FORM(Form)
}

let BtnHamburgerMenu = document.getElementById('BtnHamburgerMenu')
//let ContainerMenuHamburger = document.getElementById('ContainerMenuHamburger') Define before in BaseTemplate
BtnHamburgerMenu.addEventListener('click', function () {
    OpenMenuHamburger(ContainerMenuHamburger, BtnHamburgerMenu)
})


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
    let SrcFileStyleDark = '/Assets/Css/User/Panel/index-dark.css'
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

