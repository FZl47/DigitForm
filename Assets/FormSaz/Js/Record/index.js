//
for (let Input of LIST_INSTANCE_INPUT) {
    try {
        let Type = Input.Type
        if (Type == 'INPUT_RADIO') {
            let ID_Radio = RecordJSON['INPUT_RADIOS'][Input.ClassContainer_SET.id]
            if (IsBlank(ID_Radio) == false && ID_Radio != undefined) {
                if (ID_Radio == Input.id) {
                    Input.InputRadio.checked = true
                    Input.InputRadio.classList.add('INPUT_RADIO_SELECT')
                }
            }
        } else if (Type == 'INPUT_CHECKBOX') {
            let Value = RecordJSON[Input.id]
            if (Value == 'on') {
                Input.InputCheckBox.checked = true
                Input.InputCheckBox.classList.add('INPUT_CHECKBOX_SELECT')
            }

        } else if (Type == 'INPUT_FILE' || Type == 'INPUT_IMAGE') {
            let UrlMedia = RecordJSON['INPUT_FILES'][Input.id]
            if (UrlMedia != undefined) {
                let TagShowMedia = document.createElement('a')
                TagShowMedia.href = UrlMedia
                TagShowMedia.innerText = 'رسانه'
                TagShowMedia.target = '_blank'
                TagShowMedia.classList.add('TAG_SHOW_MEDIA')
                Input.Node.append(TagShowMedia)
            }
        } else {
            let Value = RecordJSON[Input.id]
            if (IsBlank(Value) == false && Value != undefined) {
                Input.ELEMENT.value = Value
            }
        }
    } catch (e) {
        // Nothing
    }
}

if (_TypeForm == 'Quiz') {
    for (let Field of LIST_INSTANCE_QUIESTION) {
        if (Field.Type_Base == 'ELEMENT_BASE_QUIZ') {
            // Questions
            if (Field.ConfigQuiz.ConfigSettings.USE_ANSWER == 'true') {
                if (Field.Type == 'QUESTION_DESCRIPTIVE') {
                    // Question Desciptive
                    let Answers = Field.ConfigQuiz.ConfigSettings.Answer.split('-')
                    for (let Answer of Answers) {
                        if (String(Field.INPUT_ANSWER.ELEMENT.value).trim() == Answer.trim()) {
                            Field.NODE_SCORE_QUESTION.classList.add('QUESTION_ANSWERED_CORRECTLY__SCORE')
                            Field.ELEMENT.classList.add('QUESTION_ANSWERED_CORRECTLY__INPUT')
                        }
                    }
                } else if (Field.Type == 'QUESTION_TEST') {
                    // Question Test
                    let Answer = Field.ConfigQuiz.ConfigSettings.Answer_Input
                    let Inputs = Field.ElementsCLASS
                    for (let Input of Inputs) {
                        let ID_Radio = RecordJSON['INPUT_RADIOS'][Input.ClassContainer_SET.id]
                        if (Answer == ID_Radio) {
                            Field.NODE_SCORE_QUESTION.classList.add('QUESTION_ANSWERED_CORRECTLY__SCORE')
                            Field.ELEMENT.classList.add('QUESTION_ANSWERED_CORRECTLY__INPUT')
                        }
                    }
                }
            }
        }
    }
}

let InputSendMessage = document.getElementById('InputSendMessage')
let BtnSendMessage = document.getElementById('BtnSendMessage')
InputSendMessage.addEventListener('input', function () {
    let Valid = this.getAttribute('Valid') || 'false'
    if (Valid == 'true') {
        BtnSendMessage.type = 'submit'
        BtnSendMessage.classList.remove('Disabled')
    } else {
        BtnSendMessage.type = 'button'
        BtnSendMessage.classList.add('Disabled')
    }
})

let FormDeleteRecord = document.getElementById('FormDeleteRecord')

function DeleteRecord() {
    CreateMessage_Alert('ایا از حذف شدن جواب مطمعن هستید ؟', function () {
        FormDeleteRecord.submit()
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
    let SrcFileStyleDark = '/Assets/FormSaz/Css/Record/index-dark.css'
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

// Must Be Empty
function ControlSettingsMenu_For_Element() {
}

function CreateTitleSectionStylesSettings() {
}