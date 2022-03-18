let BtnChangeTheme = document.getElementById('BtnChangeTheme')
let BtnChangeThemeMenu = document.getElementById('BtnChangeThemeMenu')

BtnChangeThemeMenu.addEventListener('click', function () {
    EventSethThemeColor(this)
})

BtnChangeTheme.addEventListener('click', function () {
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
    let SrcFileStyleDark = '/Assets/Css/Home/index-dark.css'
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

let AllBtnFaq = document.querySelectorAll('[BtnFaq]')
for (let Btn of AllBtnFaq) {
    Btn.addEventListener('click', function () {
        let State = this.getAttribute('State') || 'Open'
        if (State == 'Open') {
            this.setAttribute('State', 'Close')
            this.classList.add('BtnFaq_State_Open')
        } else {
            this.setAttribute('State', 'Open')
            this.classList.remove('BtnFaq_State_Open')
        }
    })
}