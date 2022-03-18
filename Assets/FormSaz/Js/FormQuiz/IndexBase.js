let Btn_Question_Desciptive = document.querySelector('[ClickModeTag="QUESTION_DESCRIPTIVE"]')
if (Btn_Question_Desciptive) {
    Btn_Question_Desciptive.addEventListener('click', function () {
        let Question = new QUESTION_DESCRIPTIVE()
        Question.TITLE_QUESTION = Question.Config.Create_TitleElement(Question.TypeTextQuestion, Question, false)
        Question.TITLE_QUESTION.Style.Width_Unit('%')
        Question.TITLE_QUESTION.Style.Width(85)
    })
}

let Btn_Question_Test = document.querySelector('[ClickModeTag="QUESTION_TEST"]')
if (Btn_Question_Test) {
    Btn_Question_Test.addEventListener('click', function () {
        let Question = new QUESTION_TEST()
        Question.Add_Input_Answer(Question)
        Question.Add_Input_Answer(Question)
        Question.TITLE_QUESTION = Question.Config.Create_TitleElement(Question.TypeTextQuestion, Question, false)
        Question.TITLE_QUESTION.Style.Width_Unit('%')
        Question.TITLE_QUESTION.Style.Width(85)
    })
}

let Btn_Field_NameAndFamily = document.querySelector('[ClickModeTag="FIELD_NAMEANDFAMILY"]')
if (Btn_Field_NameAndFamily) {
    Btn_Field_NameAndFamily.addEventListener('click', function () {
        new FIELD_NAMEANDFAMILY()
    })
}

let Btn_Field_NationalCode = document.querySelector('[ClickModeTag="FIELD_NATIONALCODE"]')
if (Btn_Field_NationalCode) {
    Btn_Field_NationalCode.addEventListener('click', function () {
        new FIELD_NATIONALCODE()
    })
}

let Btn_Field_PhoneNumber = document.querySelector('[ClickModeTag="FIELD_PHONENUMBER"]')
if (Btn_Field_PhoneNumber) {
    Btn_Field_PhoneNumber.addEventListener('click', function () {
        new FIELD_PHONENUMBER()
    })
}

let Btn_Field_Email = document.querySelector('[ClickModeTag="FIELD_EMAIL"]')
if (Btn_Field_Email) {
    Btn_Field_Email.addEventListener('click', function () {
        new FIELD_EMAIL()
    })
}


let BtnShowMoreBtnsCreateElementCustomize = document.getElementById('BtnShowMoreBtnsCreateElementCustomize')
BtnShowMoreBtnsCreateElementCustomize.addEventListener('click', function () {
    let TypeBtn = this.getAttribute('TypeBtn')
    if (TypeBtn == 'Less') {
        this.setAttribute('TypeBtn', 'More')
        BtnShowMoreBtnsCreateElementCustomize.innerHTML = `
            کمتر
            <i class="fa fa-minus-circle"></i>
        `
    } else {
        this.setAttribute('TypeBtn', 'Less')
        BtnShowMoreBtnsCreateElementCustomize.innerHTML = `
            بیشتر
            <i class="fa fa-plus-circle"></i>
        `
    }
})