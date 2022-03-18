let BtnNext = document.getElementById('BtnNext')
let BtnPreVious = document.getElementById('BtnPreVious')
let BtnSubmit = document.getElementById('BtnSubmit')


// Quiz
let COUNTER_ACTIVE_QUESTION = 0
let CounterPaginationQuestion = document.getElementById('CounterPaginationQuestion')
let AllCountPaginationQuestion = document.getElementById('AllCountPaginationQuestion')
let STATE_SUBMIT_FORM = false
//Customize
let COUNTER_ACTIVE_PAGE = 0
let AllCountPaginationPage = document.getElementById('AllCountPaginationPage')
let CounterPaginationPage = document.getElementById('CounterPaginationPage')

if (_TypeForm == 'Customize') {
    // Customize
    AllCountPaginationPage.innerText = LIST_PAGES.length

    if (_ConfigForm.ShowAllPage == 'false') {
        HideAllPage()
        ActivePage()
    }
    if (_ConfigForm.CanBackPreviousPage == 'true') {
        if (BtnPreVious) {
            BtnPreVious.addEventListener('click', function () {
                ActivePagePast()
            })
        }
        if (BtnNext) {
            BtnNext.addEventListener('click', function () {
                ActivePage()
            })
        }
    } else {
        BtnPreVious.classList.add('Disabled')
        let STATE_SHOW_MESSAGE_CANT_BACK_PAGE = false
        BtnNext.addEventListener('click', function () {
            if (STATE_SHOW_MESSAGE_CANT_BACK_PAGE) {
                ActivePage()
            }
            if (STATE_SHOW_MESSAGE_CANT_BACK_PAGE == false) {
                $('#ModalMessageFormPage').modal()
                STATE_SHOW_MESSAGE_CANT_BACK_PAGE = true
            }
        })
    }

} else if (_TypeForm == 'Quiz') {
    // Quiz
    AllCountPaginationQuestion.innerText = LIST_INSTANCE_QUIESTION.length
    if (_ConfigForm.RandomQuestions == 'true') {
        RandomQuestion()
    }
    if (_ConfigForm.ShowAllQuestions == 'false') {
        HideAllQuestion()
        ActiveQuestion()
    }
    if (_ConfigForm.CanBackPreviousQuestion == 'true') {
        if (BtnPreVious) {
            BtnPreVious.addEventListener('click', function () {
                ActiveQuestionPast()
            })
        }
    } else {
        BtnPreVious.classList.add('Disabled')
    }
    let STATE_SHOW_MESSAGE_CANT_BACK_QUIESTION = false
    if (_ConfigForm.CanBackPreviousQuestion == 'false') {
        BtnNext.addEventListener('click', function () {
            if (STATE_SHOW_MESSAGE_CANT_BACK_QUIESTION) {
                ActiveQuestion()
            }
            //if (_ConfigForm.CanBackPreviousQuestion == 'false') {
            if (STATE_SHOW_MESSAGE_CANT_BACK_QUIESTION == false) {
                $('#ModalMessageFormQuiestion').modal()
                STATE_SHOW_MESSAGE_CANT_BACK_QUIESTION = true
            }
            //}
        })
    } else {
        if (BtnNext) {
            BtnNext.addEventListener('click', ActiveQuestion)
        }
    }
}

for (let Instance of INSTANCES_ELEMENTS) {
    delete Instance.Config
}


function HideAllPage() {
    for (let Page of LIST_PAGES_CLASS) {
        Page.Node.classList.add('d-none')
    }
}

function ActivePage() {
    try {
        let Page = LIST_PAGES_CLASS[COUNTER_ACTIVE_PAGE]
        COUNTER_ACTIVE_PAGE++
        HideAllPage()
        Page.Node.classList.remove('d-none')
        CounterPaginationPage.innerText = COUNTER_ACTIVE_PAGE
        if (COUNTER_ACTIVE_PAGE == LIST_PAGES_CLASS.length) {
            STATE_SUBMIT_FORM = true
        }
        if (STATE_SUBMIT_FORM) {
            BtnNext.classList.add('d-none')
            BtnSubmit.classList.remove('d-none')
        }

    } catch (e) {
        COUNTER_ACTIVE_PAGE = LIST_PAGES_CLASS.length - 1
        let Page = LIST_PAGES_CLASS[COUNTER_ACTIVE_PAGE]
        Page.Node.classList.remove('d-none')
    }

}

function ActivePagePast() {
    if (_ConfigForm.CanBackPreviousPage == 'true') {
        try {
            COUNTER_ACTIVE_PAGE--
            let Page = LIST_PAGES_CLASS[COUNTER_ACTIVE_PAGE - 1]
            HideAllPage()
            Page.Node.classList.remove('d-none')
            CounterPaginationPage.innerText = COUNTER_ACTIVE_PAGE

            STATE_SUBMIT_FORM = false
            BtnNext.classList.remove('d-none')
            BtnSubmit.classList.add('d-none')

        } catch (e) {
            COUNTER_ACTIVE_PAGE = 1
            let Page = LIST_PAGES_CLASS[COUNTER_ACTIVE_PAGE - 1]
            Page.Node.classList.remove('d-none')
        }
    }
}


function HideAllQuestion() {
    for (let Element of LIST_INSTANCE_QUIESTION) {
        Element.Node.classList.add('d-none')
    }
}

function ActiveQuestion() {
    try {
        let Element = LIST_INSTANCE_QUIESTION[COUNTER_ACTIVE_QUESTION]
        COUNTER_ACTIVE_QUESTION++
        HideAllQuestion()
        Element.Node.classList.remove('d-none')
        CounterPaginationQuestion.innerText = COUNTER_ACTIVE_QUESTION
        if (COUNTER_ACTIVE_QUESTION == LIST_INSTANCE_QUIESTION.length) {
            STATE_SUBMIT_FORM = true
        }
        if (STATE_SUBMIT_FORM) {
            BtnNext.classList.add('d-none')
            BtnSubmit.classList.remove('d-none')
        }

    } catch (e) {
        COUNTER_ACTIVE_QUESTION = LIST_INSTANCE_QUIESTION.length - 1
        let Element = LIST_INSTANCE_QUIESTION[COUNTER_ACTIVE_QUESTION]
        Element.Node.classList.remove('d-none')
    }
}

function ActiveQuestionPast() {
    if (_ConfigForm.CanBackPreviousQuestion == 'true') {
        try {
            COUNTER_ACTIVE_QUESTION--
            let Element = LIST_INSTANCE_QUIESTION[COUNTER_ACTIVE_QUESTION - 1]
            HideAllQuestion()
            Element.Node.classList.remove('d-none')
            CounterPaginationQuestion.innerText = COUNTER_ACTIVE_QUESTION

            STATE_SUBMIT_FORM = false
            BtnNext.classList.remove('d-none')
            BtnSubmit.classList.add('d-none')

        } catch (e) {
            COUNTER_ACTIVE_QUESTION = 1
            let Element = LIST_INSTANCE_QUIESTION[COUNTER_ACTIVE_QUESTION - 1]
            Element.Node.classList.remove('d-none')
        }
    }
}

function RandomQuestion() {
    LIST_INSTANCE_QUIESTION = ShuffleList(LIST_INSTANCE_QUIESTION)
}


let DICT_VALUE_RESULTS = {
    'INPUT_RADIOS': {},
    'INPUT_FILES': {},
    'LIST_INSTANCE_INPUT_MEDIA': {}
}


setInterval(function () {
    let Timer = TimerCountDownObject(ToTimeEndForm)
    let Sec = Timer.Seconds
    let Min = Timer.Minutes
    let Hour = Timer.Hours
    let Day = Timer.Days
    if (Sec < 3 && Min < 0 && Hour < 0 && Day < 0) {
        BtnSubmit.click()
    }
}, 1000)

for (let Element of LIST_INSTANCE_INPUT) {
    DICT_VALUE_RESULTS[Element.id] = ''
    let Input = Element._INPUT
    Input.removeAttribute('disabled')
    Input.removeAttribute('readonly')
    Element.CheckValidation = new CheckValidationBase(Element)
    Input.onchange = function () {
        EVENT_CHANGE_INPUT(this)
    }
}

for (let Element of LIST_INSTANCE_INPUT_MEDIA) {
    let Input = Element._INPUT
    Element.NOTE_INPUT_MEDIA.classList.remove('d-none')
    Input.onchange = function () {
        let Instance = LIST_INSTANCE_INPUT[this.getAttribute('IndexElementInListInput')]
        EVENT_CHANGE_INPUT_MEDIA(Instance, this)
    }
}

function EVENT_CHANGE_INPUT_MEDIA(Instance, Input) {
    let State_SizeFile = Instance.CheckValidation.SizeFile(Input)
    let Statae_TypeFile = Instance.CheckValidation.TypeFile(Input)
    if (State_SizeFile == true && Statae_TypeFile == true) {
        DICT_VALUE_RESULTS['INPUT_FILES'][Instance.id] = Input
        DICT_VALUE_RESULTS['LIST_INSTANCE_INPUT_MEDIA'][Instance.id] = Instance.Type
        Input.classList.add('INPUT_VALID')
    } else {
        DICT_VALUE_RESULTS['INPUT_FILES'][Instance.id] = null
        delete DICT_VALUE_RESULTS['LIST_INSTANCE_INPUT_MEDIA'][Instance.id]
        Input.classList.remove('INPUT_VALID')
    }
}

function EVENT_CHANGE_INPUT(Input) {
    let Instance = LIST_INSTANCE_INPUT[Input.getAttribute('IndexElementInListInput')]
    let List_Validations = Instance.LIST_VALIDATIONS || []
    let STATE = true
    for (let Validation of List_Validations) {
        let State = Instance.CheckValidation[Validation](Input)
        if (State == false) {
            STATE = false
        }
    }
    if (Instance.Type == 'INPUT_RADIO') {
        DICT_VALUE_RESULTS['INPUT_RADIOS'][Instance.ClassContainer_SET.id] = Instance.id
        Instance.ClassContainer_SET.Node.classList.add('INPUT_VALID')
    } else {
        if (STATE == true) {
            DICT_VALUE_RESULTS[Instance.id] = Input.value || Input.checked
            Input.classList.add('INPUT_VALID')
        } else {
            DICT_VALUE_RESULTS[Instance.id] = null
            Input.classList.remove('INPUT_VALID')
        }
    }
}


BtnSubmit.addEventListener('click', SubmitRecordForm)
let StateSubmit = false

function SubmitRecordForm() {
    if (StateSubmit == false) {
        StateSubmit = true
        let FormElement = document.createElement('form')
        for (let Key of Object.keys(DICT_VALUE_RESULTS['INPUT_FILES'])) {
            let InputFile = DICT_VALUE_RESULTS['INPUT_FILES'][Key]
            if (InputFile) {
                FormElement.appendChild(InputFile)
            }
            delete DICT_VALUE_RESULTS['INPUT_FILES'][Key]
        }
        let Form = new FormData(FormElement)
        Form.append('Data', JSON.stringify(DICT_VALUE_RESULTS))
        $.ajax({
            url: `/FormSaz/SubmitRecord/${_ID_FORM}`,
            headers: {"X-CSRFToken": window.CSRF_TOKEN},
            type: 'POST',
            enctype: 'multipart/form-data',
            processData: false,
            contentType: false,
            dataType: 'json',
            data: Form,
            success: function (Response) {
                let Status = Response.Status
                let Status_Text = Response.Status_Text
                if (Status == '200') {
                    window.location.href = `/FormSaz/Trc/Show/${_ID_FORM}/${Response.TrackingCode}`
                } else {
                    ShowNotificationMessage(Status_Text, 'Error')
                }
            }
        });
    }
}