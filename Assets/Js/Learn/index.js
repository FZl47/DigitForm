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
    let SrcFileStyleDark = '/Assets/Css/Learn/index-dark.css'
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