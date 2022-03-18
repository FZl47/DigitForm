let FormLogin = document.querySelector('#FormLogin')
let All_Input_FormLogin = FormLogin.querySelectorAll('[InputForm]')
let BtnLogin = document.querySelector('#BtnLogin')
let TextStatusFormLogin = document.getElementById('TextStatusFormLogin')
FormLogin.addEventListener('input', function () {
    let State = true
    for (let Input of All_Input_FormLogin) {
        let Valid = Input.getAttribute('Valid') || 'false'
        if (Valid == 'false') {
            State = false
        }
    }
    if (State) {
        BtnLogin.classList.remove('Disabled')
        BtnLogin.onclick = function () {
            let InputEmailLogin = document.querySelector('#InputEmailLogin').value
            let InputPasswordLogin = document.querySelector('#InputPasswordLogin').value
            TextStatusFormLogin.classList.add('d-none')
            let Data = {
                'TypeForm': 'Login',
                'Email': InputEmailLogin,
                'Password': InputPasswordLogin
            }
            SendAjax('/User/CheckLoginRegister', Data, 'POST', function (Response) {
                let Status = Response.Status
                if (Status == '200') {
                    ShowNotificationMessage(Response.Status_Text, 'Success')
                    let InputRememberMeLogin = document.querySelector('#InputRememberMeLogin')
                    let DayExpire = InputRememberMeLogin.checked == true ? '365' : 'Session'
                    SetCookie('QlYSqVS_', Response.QlYSqVS_, DayExpire)
                    SetCookie('YPtIeRC_', Response.YPtIeRC_, DayExpire)
                    GoToUrl('/User/Panel')
                } else if (Status == '404') {
                    TextStatusFormLogin.classList.remove('d-none')
                    TextStatusFormLogin.innerText = Response.Status_Text
                } else {
                    ShowNotificationMessage(Response.Status_Text, 'Error')
                }
            })
        }
    } else {
        BtnLogin.onclick = function () {
        }
        BtnLogin.classList.add('Disabled')
    }
})


let FormRegister = document.querySelector('#FormRegister')
let All_Input_FormRegister = FormRegister.querySelectorAll('[InputForm]')
let BtnRegister = document.querySelector('#BtnRegister')
let TextStatusFormRegister = document.querySelector('#TextStatusFormRegister')
let InputEmailRegister = document.querySelector('#InputEmailRegister')
let InputPasswordRegister = document.querySelector('#InputPasswordRegister')
let InputPassword2Register = document.querySelector('#InputPassword2Register')
let InputIntroductionCodeRegister = document.querySelector('#InputIntroductionCodeRegister')

FormRegister.addEventListener('change', function () {
    let State = true
    TextStatusFormRegister.classList.add('d-none')
    TextStatusFormRegister.innerText = ''
    for (let Input of All_Input_FormRegister) {
        let Valid = Input.getAttribute('Valid') || 'false'
        if (Valid == 'false') {
            State = false
        }
    }
    if (InputPasswordRegister.value != InputPassword2Register.value) {
        State = false
        TextStatusFormRegister.classList.remove('d-none')
        TextStatusFormRegister.innerText = 'رمز های وارد شده مغایرت دارند'
        InputPassword2Register.setAttribute('Valid', 'false')
    }
    if (State) {
        BtnRegister.classList.remove('Disabled')
        BtnRegister.onclick = function () {
            TextStatusFormRegister.classList.add('d-none')
            TextStatusFormRegister.innerText = ''
            let Data = {
                'TypeForm': 'Register',
                'Email': InputEmailRegister.value,
                'Password': InputPasswordRegister.value,
                'Password2': InputPassword2Register.value,
                'IntroductionCode': InputIntroductionCodeRegister.value,
            }
            SendAjax('/User/CheckLoginRegister', Data, 'POST', function (Response) {
                let Status = Response.Status
                if (Status == '200') {
                    ShowNotificationMessage(Response.Status_Text, 'Success')
                    SetCookie('QlYSqVS_', Response.QlYSqVS_, 365)
                    SetCookie('YPtIeRC_', Response.YPtIeRC_, 365)
                    GoToUrl('/User/Panel?CreateForm')
                } else if (Status == '409') {
                    TextStatusFormRegister.classList.remove('d-none')
                    TextStatusFormRegister.innerText = Response.Status_Text
                } else {
                    ShowNotificationMessage(Response.Status_Text, 'Error')
                }
            })
        }
    } else {
        BtnRegister.classList.add('Disabled')
        BtnRegister.onclick = function () {
        }
    }
})


let BtnSwitchForms = document.querySelector('#BtnSwitchForms')
BtnSwitchForms.addEventListener('click', function () {
    let TypeFormMostActive = this.getAttribute('TypeFormMostActive')
    ActiveForm(this, TypeFormMostActive)
})

function ActiveForm(Btn, Type) {
    if (Type == 'Login') {
        Btn.setAttribute('TypeFormMostActive', 'Register')
        Btn.innerHTML = `
                        ایجاد حساب کاربری
                        <i class="fa fa-user-plus"></i>
                `
        FormRegister.classList.remove('FormRegisterActive')
        FormRegister.classList.add('FormRegisterDisabled')
        FormLogin.classList.remove('FormLoginDisabled')
        FormLogin.classList.add('FormLoginActive')

    } else if (Type == 'Register') {
        Btn.setAttribute('TypeFormMostActive', 'Login')
        Btn.innerHTML = `
                        ورود حساب کاربری
                        <i class="fa fa-sign-in-alt"></i>
                `
        FormRegister.classList.add('FormRegisterActive')
        FormRegister.classList.remove('FormRegisterDisabled')
        FormLogin.classList.add('FormLoginDisabled')
        FormLogin.classList.remove('FormLoginActive')
    }
}


let BtnChangeTheeme = document.querySelector('#BtnChangeTheme')
Initial_DarkMode_Controll(BtnChangeTheeme, {
    'Src': '/Assets/Css/User/Login/index-dark.css'
})

