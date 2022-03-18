let INSTANCES_ELEMENTS = []
let LIST_ELEMENTS_FORM = []
let LIST_PAGES = []
let LIST_PAGES_CLASS = []
let LIST_INSTANCE_MEDIA = [] // Image  , Video  , Audio
let LIST_INSTANCE_INPUT_MEDIA = [] // Input File , Input Image


let ContainerBox = document.querySelector('#ContainerBox')
let ContainerForm = document.querySelector('#ContainerForm')
let Slider_Pages_Items = document.querySelector('#Slider_Pages_Items')
let ContainerItemsSettings = document.querySelector('#ContainerItemsSettings')
let TitleInfoForm = document.querySelector('#TitleInfoForm')
let ContainerPage


let COUNTER_VAR_UNIQUE_ID = 0

function CreateID_UNIQUE() {
    COUNTER_VAR_UNIQUE_ID += 1
    let RandomSTR = CreateRandomSTR(14)
    RandomSTR = RandomSTR += `_${COUNTER_VAR_UNIQUE_ID}`
    return RandomSTR
}


function CreateTitleSectionStylesSettings(Title, IconClass) {
    let Container = document.createElement('div')
    Container.classList.add('TitleLabelSettings')
    let Node = `
            <p>${Title}</p>
            <i class="${IconClass}"></i>  
        `
    Container.innerHTML = Node
    ContainerItemsSettings.append(Container)
}

function CreateNoteItemSettings(Text, Container) {
    let C = document.createElement('div')
    C.classList.add('ContainerNoteItemSettings')
    let Node = `
            <i class="fa fa-exclamation-circle"></i>
            <p>${Text}</p>
    `
    C.innerHTML = Node
    Container.append(C)
}

function CreateInputItemSettings(Title, Input, Unit = false, UseNode = true) {
    <!-- Value Attr Input ActionInputSettings Is Index Instance-Class In List "INSTANCES_ELEMENTS" -->
    let Node_Input_Settings
    let Container
    if (UseNode) {
        if (Unit) {
            Node_Input_Settings = `
                    <p class="LabelItemSettings"> ${Title}</p>
                    <div>    
                            ${Unit}
                            ${Input}
                    </div>
                `
        } else {
            Node_Input_Settings = `
                    <p class="LabelItemSettings"> ${Title}</p>
                    <div>           
                        ${Input} 
                    </div>
        `
        }
        Container = document.createElement('div')
        Container.classList.add('ItemSettings')
        Container.innerHTML = Node_Input_Settings
    } else {
        let Title_ = document.createElement('p')
        let ContainerInput = document.createElement('div')
        Container = document.createElement('div')
        Title_.innerHTML = Title
        Title_.classList.add('LabelItemSettings')
        ContainerInput.appendChild(Input)
        Container.classList.add('ItemSettings')
        Container.appendChild(Title_)
        Container.appendChild(ContainerInput)
    }
    ContainerItemsSettings.append(Container)
    return Container
}

function InputFile_IsEmpty(Input) {
    let State = true
    if (Input.files.length == 1) {
        State = false
    }
    return State
}

function GetSizeFile(Input) {
    let Size = 0
    if (!InputFile_IsEmpty(Input)) {
        Size = Input.files[0].size
    }
    return Size
}

function GetTypeFile(Input) {
    let Type = null
    if (!InputFile_IsEmpty(Input)) {
        Type = Input.files[0].type
    }
    return Type
}

class CheckValidationBase {
    constructor(Instance, Input) {
        this.Instance = Instance
        this.Input = Instance._INPUT
        this.Validations = Instance.Validation.ValidationSettings
        this.DICT_VALDATIONS_STATE = {
            'LanguageChar': true,
            'LenChar_Less': true,
            'LenChar_Bigger': true,
            'LenNumber_Bigger': true,
            'LenNumber_Less': true,
            'TimeSpan_Bigger': true,
            'TimeSpan_Less': true,
            'DateSpan_Bigger': true,
            'DateSpan_Less': true,
            'SizeFile': true,
            'TypeFile': true,
            'STATE': true
        }
    }

    SizeFile(Input) {
        let Type = this.Instance.Type
        let SizeFile = GetSizeFile(Input)
        let STATE = false
        if (Type == 'INPUT_IMAGE') {
            if (SizeFile < LIMIT_SIZE_INPUT_IMAGE) {
                this.RemoveAlert(Input, 'SizeFile')
                this.DICT_VALDATIONS_STATE.SizeFile = true
                STATE = true
            } else {
                this.CreateAlert(Input, 'SizeFile', 'حجم تصویر شما بیشتر از حد مجاز است')
                Input.value = ''
                this.DICT_VALDATIONS_STATE.SizeFile = false
                this.DICT_VALDATIONS_STATE.STATE = false
                STATE = false
            }
        } else if (Type == 'INPUT_FILE') {
            if (SizeFile < LIMIT_SIZE_INPUT_FILE) {
                this.RemoveAlert(Input, 'SizeFile')
                this.DICT_VALDATIONS_STATE.SizeFile = true
                STATE = true
            } else {
                this.CreateAlert(Input, 'SizeFile', 'حجم فایل شما بیشتر از حد مجاز است')
                Input.value = ''
                this.DICT_VALDATIONS_STATE.SizeFile = false
                this.DICT_VALDATIONS_STATE.STATE = false
                STATE = false
            }
        }
        return STATE
    }

    TypeFile(Input) {
        let Type = this.Instance.Type
        let TypeFile = GetTypeFile(Input)
        let STATE = false
        if (!InputFile_IsEmpty(Input)) {
            if (Type == 'INPUT_IMAGE') {
                let State = false
                for (let i of LIST_TYPE_INPUT_IMAGE) {
                    if (i == TypeFile) {
                        State = true
                        break
                    }
                }
                if (State) {
                    this.RemoveAlert(Input, 'TypeFile')
                    this.DICT_VALDATIONS_STATE.TypeFile = true
                    STATE = true
                } else {
                    this.CreateAlert(Input, 'TypeFile', 'فرمت عکس انتخاب شده مجاز نیست')
                    Input.value = ''
                    this.DICT_VALDATIONS_STATE.TypeFile = false
                    this.DICT_VALDATIONS_STATE.STATE = false
                    STATE = false
                }
            } else if (Type == 'INPUT_FILE') {
                let State = false
                for (let i of LIST_TYPE_INPUT_FILE) {
                    if (i == TypeFile) {
                        State = true
                        break
                    }
                }
                if (State) {
                    this.RemoveAlert(Input, 'TypeFile')
                    this.DICT_VALDATIONS_STATE.TypeFile = true
                    STATE = true
                } else {
                    this.CreateAlert(Input, 'TypeFile', 'فرمت فایل انتخاب شده مجاز نیست')
                    Input.value = ''
                    this.DICT_VALDATIONS_STATE.TypeFile = false
                    this.DICT_VALDATIONS_STATE.STATE = false
                    STATE = false
                }
            }
        }
        return STATE
    }

    LenChar_Less(Input) {
        let USE_LENCHAR = this.Validations.USE_LENCHAR
        let STATE = false
        if (USE_LENCHAR == 'Active') {
            let Value = Input.value
            if (!IsBlank(Value)) {
                let Len_Less = this.Validations.LenChar_Less
                if (Value.length < Len_Less) {
                    this.DICT_VALDATIONS_STATE.LenChar_Less = true
                    this.RemoveAlert(Input, 'LenChar_Less')
                    STATE = true
                } else {
                    this.CreateAlert(Input, 'LenChar_Less', `تعداد کاراکتر های متن شما باید کمتر از ${Len_Less} رقم باشد `)
                    this.DICT_VALDATIONS_STATE.LenChar_Less = false
                    this.DICT_VALDATIONS_STATE.STATE = false
                    STATE = false
                }
            } else {
                this.DICT_VALDATIONS_STATE.LenChar_Less = true
                this.RemoveAlert(Input, 'LenChar_Less')
                STATE = true
            }
        } else {
            STATE = 'Disabled'
        }
        return STATE
    }

    LenChar_Bigger(Input) {
        let USE_LENCHAR = this.Validations.USE_LENCHAR
        let STATE = false
        if (USE_LENCHAR == 'Active') {
            let Value = Input.value
            if (!IsBlank(Value)) {
                let Len_Bigger = this.Validations.LenChar_Bigger
                if (Value.length > Len_Bigger) {
                    this.DICT_VALDATIONS_STATE.LenChar_Bigger = true
                    this.RemoveAlert(Input, 'LenChar_Bigger')
                    STATE = true
                } else {
                    this.CreateAlert(Input, 'LenChar_Bigger', `تعداد کاراکتر های متن شما باید بیشتر از ${Len_Bigger} رقم باشد `)
                    this.DICT_VALDATIONS_STATE.LenChar_Bigger = false
                    this.DICT_VALDATIONS_STATE.STATE = false
                    STATE = false
                }
            } else {
                this.DICT_VALDATIONS_STATE.LenChar_Bigger = true
                this.RemoveAlert(Input, 'LenChar_Bigger')
                STATE = true
            }
        } else {
            STATE = 'Disabled'
        }
        return STATE
    }

    LenNumber_Bigger(Input) {
        let USE_LENNUMBER = this.Validations.USE_LENNUMBER
        let STATE = false
        if (USE_LENNUMBER == 'Active') {
            let Value = Input.value
            if (!IsBlank(Value)) {
                let Number_Bigger = this.Validations.LenNumber_Bigger
                if (parseInt(Value) > Number_Bigger) {
                    this.DICT_VALDATIONS_STATE.LenNumber_Bigger = true
                    this.RemoveAlert(Input, 'LenNumber_Bigger')
                    STATE = true
                } else {
                    this.CreateAlert(Input, 'LenNumber_Bigger', `عدد شما باید بزرگتر از ${Number_Bigger} باشد `)
                    this.DICT_VALDATIONS_STATE.LenNumber_Bigger = false
                    this.DICT_VALDATIONS_STATE.STATE = false
                    STATE = false
                }
            } else {
                this.DICT_VALDATIONS_STATE.LenNumber_Bigger = true
                this.RemoveAlert(Input, 'LenNumber_Bigger')
                STATE = true
            }
        } else {
            STATE = 'Disabled'
        }
        return STATE
    }

    LenNumber_Less(Input) {
        let USE_LENNUMBER = this.Validations.USE_LENNUMBER
        let STATE = false
        if (USE_LENNUMBER == 'Active') {
            let Value = Input.value
            if (!IsBlank(Value)) {
                let Number_Less = this.Validations.LenNumber_Less
                if (parseInt(Value) < Number_Less) {
                    this.DICT_VALDATIONS_STATE.LenNumber_Less = true
                    this.RemoveAlert(Input, 'LenNumber_Less')
                    STATE = true
                } else {
                    this.CreateAlert(Input, 'LenNumber_Less', `عدد شما باید کمتر از ${Number_Less} باشد `)
                    this.DICT_VALDATIONS_STATE.LenNumber_Less = false
                    this.DICT_VALDATIONS_STATE.STATE = false
                    STATE = false
                }
            } else {
                this.DICT_VALDATIONS_STATE.LenNumber_Less = true
                this.RemoveAlert(Input, 'LenNumber_Less')
                STATE = true
            }
        } else {
            STATE = 'Disabled'
        }
        return STATE
    }

    LanguageChar(Input) {
        let TypeChar = this.Validations.LanguageChar
        let STATE = false
        if (!IsBlank(Input.value)) {
            if (TypeChar == 'Both') {
                this.DICT_VALDATIONS_STATE.LanguageChar = true
                STATE = true
            } else if (TypeChar == 'Persian') {
                let State = ValidationAllCharIsPersian(Input.value)
                if (State) {
                    this.DICT_VALDATIONS_STATE.LanguageChar = true
                    this.RemoveAlert(Input, 'LanguageChar')
                    STATE = true
                } else {
                    this.DICT_VALDATIONS_STATE.STATE = false
                    let TextAlert = "شما باید از حروف و اعداد فارسی استفاده کنید"
                    this.CreateAlert(Input, 'LanguageChar', TextAlert)
                    STATE = false
                }
            } else if (TypeChar == 'English') {
                let State = ValidationAllCharIsEnglish(Input, Input.value, '')
                if (State) {
                    this.DICT_VALDATIONS_STATE.LanguageChar = true
                    this.RemoveAlert(Input, 'LanguageChar')
                    STATE = true
                } else {
                    this.DICT_VALDATIONS_STATE.STATE = false
                    let TextAlert = "شما باید از حروف و اعداد انگلیسی استفاده کنید"
                    this.CreateAlert(Input, 'LanguageChar', TextAlert)
                    STATE = false
                }
            }
        } else {
            this.DICT_VALDATIONS_STATE.LanguageChar = true
            this.RemoveAlert(Input, 'LanguageChar')
            STATE = true
        }
        return STATE
    }

    TimeSpan_Bigger(Input) {
        let USE_TIMESPAN = this.Validations.USE_TIMESPAN
        let STATE = false
        if (USE_TIMESPAN == 'Active') {
            let Value = Input.value
            let Time_Bigger = this.Validations.TimeSpan_Bigger
            if (!IsBlank(Value)) {
                if (Value > Time_Bigger) {
                    this.RemoveAlert(Input, 'TimeSpan_Bigger')
                    this.DICT_VALDATIONS_STATE.TimeSpan_Bigger = true
                    STATE = true
                } else {
                    this.CreateAlert(Input, 'TimeSpan_Bigger', ` زمان انتخابی شما باید بیشتر از زمان ${Time_Bigger} باشد`)
                    this.DICT_VALDATIONS_STATE.TimeSpan_Bigger = false
                    this.DICT_VALDATIONS_STATE.STATE = false
                    STATE = false
                }
            } else {
                this.DICT_VALDATIONS_STATE.TimeSpan_Bigger = true
                this.RemoveAlert(Input, 'TimeSpan_Bigger')
                STATE = true
            }
        } else {
            STATE = 'Disabled'
        }
        return STATE
    }

    TimeSpan_Less(Input) {
        let USE_TIMESPAN = this.Validations.USE_TIMESPAN
        let STATE = false
        if (USE_TIMESPAN == 'Active') {
            let Value = Input.value
            let TimeSpan_Less = this.Validations.TimeSpan_Less
            if (!IsBlank(Value)) {
                if (Value < TimeSpan_Less) {
                    this.RemoveAlert(Input, 'TimeSpan_Less')
                    this.DICT_VALDATIONS_STATE.TimeSpan_Less = true
                    STATE = true
                } else {
                    this.CreateAlert(Input, 'TimeSpan_Less', ` زمان انتخابی شما باید کمتر از زمان ${TimeSpan_Less} باشد`)
                    this.DICT_VALDATIONS_STATE.TimeSpan_Less = false
                    this.DICT_VALDATIONS_STATE.STATE = false
                    STATE = false
                }
            } else {
                this.DICT_VALDATIONS_STATE.TimeSpan_Less = true
                this.RemoveAlert(Input, 'TimeSpan_Less')
                STATE = true
            }
        } else {
            STATE = 'Disabled'
        }
        return STATE
    }

    DateSpan_Bigger(Input) {
        let USE_DATESPAN = this.Validations.USE_DATESPAN
        let STATE = false
        if (USE_DATESPAN == 'Active') {
            let Value = Input.value
            let DateSpan_Bigger = this.Validations.DateSpan_Bigger
            if (!IsBlank(Value)) {
                if (Value > DateSpan_Bigger) {
                    this.RemoveAlert(Input, 'DateSpan_Bigger')
                    this.DICT_VALDATIONS_STATE.DateSpan_Bigger = true
                    STATE = true
                } else {
                    this.CreateAlert(Input, 'DateSpan_Bigger', ` تاریخ انتخابی شما باید بیشتر از تاریخ ${DateSpan_Bigger} باشد`)
                    this.DICT_VALDATIONS_STATE.DateSpan_Bigger = false
                    this.DICT_VALDATIONS_STATE.STATE = false
                    STATE = false
                }
            } else {
                this.DICT_VALDATIONS_STATE.DateSpan_Bigger = true
                this.RemoveAlert(Input, 'DateSpan_Bigger')
                STATE = true
            }
        } else {
            STATE = 'Disabled'
        }
        return STATE
    }

    DateSpan_Less(Input) {
        let USE_DATESPAN = this.Validations.USE_DATESPAN
        let STATE = false
        if (USE_DATESPAN == 'Active') {
            let Value = Input.value
            let DateSpan_Less = this.Validations.DateSpan_Less
            if (!IsBlank(Value)) {
                if (Value < DateSpan_Less) {
                    this.RemoveAlert(Input, 'DateSpan_Less')
                    this.DICT_VALDATIONS_STATE.DateSpan_Less = true
                    STATE = true
                } else {
                    this.CreateAlert(Input, 'DateSpan_Less', ` تاریخ انتخابی شما باید کمتر از تاریخ ${DateSpan_Less} باشد`)
                    this.DICT_VALDATIONS_STATE.DateSpan_Less = false
                    this.DICT_VALDATIONS_STATE.STATE = false
                    STATE = false
                }
            } else {
                this.DICT_VALDATIONS_STATE.DateSpan_Less = true
                this.RemoveAlert(Input, 'DateSpan_Less')
                STATE = true
            }
        } else {
            STATE = 'Disabled'
        }
        return STATE
    }

    CreateAlert(Input, Name, Text) {
        if (this[`Alert_${Name}`] === undefined) {
            this[`Alert_${Name}`] = document.createElement('p')
            let Alert = this[`Alert_${Name}`]
            Alert.classList.add('ALERT_INPUT_FORM')
            Alert.innerText = Text
            Input.parentNode.append(Alert)
            // let TypeInput = Input.type || 'text'
            // if (TypeInput == 'radio') {
            //     Input.parentNode.classList.add('INPUT_FORM_INVALID')
            // } else {
            Input.classList.add(`INPUT_FORM_INVALID_VALIDATION_${Name}`)
            // }
        }
    }

    RemoveAlert(Input, Name) {
        // let TypeInput = Input.type || 'text'
        // if (TypeInput == 'radio') {
        //     Input.parentNode.classList.remove('INPUT_FORM_INVALID')
        // } else {
        Input.classList.remove(`INPUT_FORM_INVALID_VALIDATION_${Name}`)
        // }
        let Alert = this[`Alert_${Name}`]
        if (Alert) {
            Alert.remove()
        }
        delete this[`Alert_${Name}`]
    }


}

class ValidationBase {
    constructor(Instance) {
        this.Instance = Instance
        this.ValidationSettings = {
            'USE_LENCHAR': 'Disabled',
            'USE_LENNUMBER': 'Disabled',
            'USE_TIMESPAN': 'Disabled',
            'USE_DATESPAN': 'Disabled',
            'LenChar_Less': '',
            'LenChar_Bigger': '',
            'LenNumber_Less': '',
            'LenNumber_Bigger': '',
            'TimeSpan_Less': '',
            'TimeSpan_Bigger': '',
            'DateSpan_Less': '',
            'DateSpan_Bigger': '',
            'LanguageChar': 'Both'
        }
    }

    LenChar_Less(Val) {
        this.ApppendValidation('LenChar_Less', Val)
        this.ValidationSettings.LenChar_Less = Val
    }

    LenChar_Bigger(Val) {
        this.ApppendValidation('LenChar_Bigger', Val)
        this.ValidationSettings.LenChar_Bigger = Val
    }

    USE_LENCHAR(Val, Input, Instance) {
        let State_Use = Val
        if (State_Use == 'Active') {
            Instance.Validation.Container_Input_BiggerChar.classList.remove('d-none')
            Instance.Validation.Container_Input_LessChar.classList.remove('d-none')
        } else {
            Instance.Validation.Container_Input_BiggerChar.classList.add('d-none')
            Instance.Validation.Container_Input_LessChar.classList.add('d-none')
        }
        this.ApppendValidation('USE_LENCHAR', Val)
        this.ValidationSettings.USE_LENCHAR = State_Use
    }

    LENCHAR_Initial() {
        let Inputs = `
        <div class="justify-content-around col-12 text-center">
            <div class="CONTAINER_INPUT_RADIO">
                <input type="radio" name="InputRadioValidationLenChar" value="Disabled" class="m-auto" ${(this.ValidationSettings.USE_LENCHAR == 'Disabled' ? 'checked' : '')} ActionInputSettings_OnInput_Type="USE_LENCHAR" ActionInputSettings_OnInput_TypeBase="Validation" ActionInputSettings_OnInput="${this.Instance.IndexInInstance}">         
                <p>غیر فعال</p>
            </div>
            <div class="CONTAINER_INPUT_RADIO">
                <input type="radio" name="InputRadioValidationLenChar" value="Active" class="m-auto" ${(this.ValidationSettings.USE_LENCHAR == 'Active' ? 'checked' : '')} ActionInputSettings_OnInput_Type="USE_LENCHAR" ActionInputSettings_OnInput_TypeBase="Validation" ActionInputSettings_OnInput="${this.Instance.IndexInInstance}">
                <p>فعال</p>
            </div>
        </div>
`
        let Input_Bigger_Settings = `<input type="number" class="m-auto" value="${this.ValidationSettings.LenChar_Bigger}" ActionInputSettings_OnInput_Type="LenChar_Bigger" ActionInputSettings_OnInput_TypeBase="Validation" ActionInputSettings_OnInput="${this.Instance.IndexInInstance}">`
        let Input_Less_Settings = `<input type="number" class="m-auto"  value="${this.ValidationSettings.LenChar_Less}" ActionInputSettings_OnInput_Type="LenChar_Less" ActionInputSettings_OnInput_TypeBase="Validation" ActionInputSettings_OnInput="${this.Instance.IndexInInstance}">`
        CreateInputItemSettings(' محدودیت تعداد حروف :', Inputs)
        this.Container_Input_BiggerChar = CreateInputItemSettings('تعداد حروف بیشتر از :', Input_Bigger_Settings)
        this.Container_Input_LessChar = CreateInputItemSettings('تعداد حروف کمتر از :', Input_Less_Settings)
        if (this.ValidationSettings.USE_LENCHAR == 'Disabled') {
            this.Container_Input_BiggerChar.classList.add('d-none')
            this.Container_Input_LessChar.classList.add('d-none')
        }
    }

    LenNumber_Bigger(Val) {
        this.ApppendValidation('LenNumber_Bigger', Val)
        this.ValidationSettings.LenNumber_Bigger = Val
    }

    LenNumber_Less(Val) {
        this.ApppendValidation('LenNumber_Less', Val)
        this.ValidationSettings.LenNumber_Less = Val
    }

    USE_LENNUMBER(Val, Input, Instance) {
        let State_Use = Input.value
        if (State_Use == 'Active') {
            Instance.Validation.Container_Input_BiggerNumber.classList.remove('d-none')
            Instance.Validation.Container_Input_LessNumber.classList.remove('d-none')
        } else {
            Instance.Validation.Container_Input_BiggerNumber.classList.add('d-none')
            Instance.Validation.Container_Input_LessNumber.classList.add('d-none')
        }
        this.ValidationSettings.USE_LENNUMBER = State_Use
        this.ApppendValidation('USE_LENNUMBER', Val)
    }

    LENNUMBER_Initial() {
        let Inputs = `
        <div class="justify-content-around col-12 text-center">
            <div class="CONTAINER_INPUT_RADIO">
                <input type="radio" name="InputRadioValidationLenNumber" value="Disabled" class="m-auto" ${(this.ValidationSettings.USE_LENNUMBER == 'Disabled' ? 'checked' : '')} ActionInputSettings_OnInput_Type="USE_LENNUMBER" ActionInputSettings_OnInput_TypeBase="Validation" ActionInputSettings_OnInput="${this.Instance.IndexInInstance}">         
                <p>غیر فعال</p>
            </div>
            <div class="CONTAINER_INPUT_RADIO">
                <input type="radio" name="InputRadioValidationLenNumber" value="Active" class="m-auto" ${(this.ValidationSettings.USE_LENNUMBER == 'Active' ? 'checked' : '')} ActionInputSettings_OnInput_Type="USE_LENNUMBER" ActionInputSettings_OnInput_TypeBase="Validation" ActionInputSettings_OnInput="${this.Instance.IndexInInstance}">
                <p>فعال</p>
            </div>
        </div>
    `
        let Input_Bigger_Settings = `<input type="number" class="m-auto" value="${this.ValidationSettings.LenNumber_Bigger}" ActionInputSettings_OnInput_Type="LenNumber_Bigger" ActionInputSettings_OnInput_TypeBase="Validation" ActionInputSettings_OnInput="${this.Instance.IndexInInstance}">`
        let Input_Less_Settings = `<input type="number" class="m-auto"  value="${this.ValidationSettings.LenNumber_Less}" ActionInputSettings_OnInput_Type="LenNumber_Less" ActionInputSettings_OnInput_TypeBase="Validation" ActionInputSettings_OnInput="${this.Instance.IndexInInstance}">`
        CreateInputItemSettings(' محدودیت عدد :', Inputs)
        this.Container_Input_BiggerNumber = CreateInputItemSettings('عدد بیشتر از :', Input_Bigger_Settings)
        this.Container_Input_LessNumber = CreateInputItemSettings('عدد کمتر از :', Input_Less_Settings)
        if (this.ValidationSettings.USE_LENNUMBER == 'Disabled') {
            this.Container_Input_BiggerNumber.classList.add('d-none')
            this.Container_Input_LessNumber.classList.add('d-none')
        }
    }

    LanguageChar(Val) {
        this.ApppendValidation('LanguageChar', Val)
        this.ValidationSettings.LanguageChar = Val
    }

    LANGUAGECHAR_Initial() {

        let Inputs = `
                    <div class="text-center w-100">
                                <div class="CONTAINER_INPUT_RADIO">
                            <input type="radio" name="InputRadioValidationLanguage" ${this.ValidationSettings.LanguageChar == 'Both' ? 'checked' : ''} value="Both" ActionInputSettings_OnInput_Type="LanguageChar" ActionInputSettings_OnInput_TypeBase="Validation" ActionInputSettings_OnInput="${this.Instance.IndexInInstance}">
                            <p>هردو</p>
                        </div>
                        <div class="CONTAINER_INPUT_RADIO">
                            <input type="radio" name="InputRadioValidationLanguage" ${this.ValidationSettings.LanguageChar == 'Persian' ? 'checked' : ''}  value="Persian"  ActionInputSettings_OnInput_Type="LanguageChar" ActionInputSettings_OnInput_TypeBase="Validation" ActionInputSettings_OnInput="${this.Instance.IndexInInstance}">
                            <p>فارسی</p>
                        </div>
                        <div class="CONTAINER_INPUT_RADIO">
                            <input type="radio" name="InputRadioValidationLanguage" ${this.ValidationSettings.LanguageChar == 'English' ? 'checked' : ''} value="English" ActionInputSettings_OnInput_Type="LanguageChar" ActionInputSettings_OnInput_TypeBase="Validation" ActionInputSettings_OnInput="${this.Instance.IndexInInstance}">
                            <p>انگلیسی</p>
                        </div>                    
                    </div>
        `
        CreateInputItemSettings('زبان مجاز :', Inputs)
    }

    TimeSpan_Bigger(Val) {
        this.ApppendValidation('TimeSpan_Bigger', Val)
        this.ValidationSettings.TimeSpan_Bigger = Val
    }

    TimeSpan_Less(Val) {
        this.ApppendValidation('TimeSpan_Less', Val)
        this.ValidationSettings.TimeSpan_Less = Val
    }

    USE_TIMESPAN(Val, Input, Instance) {
        let State_Use = Input.value
        if (State_Use == 'Active') {
            Instance.Validation.Container_Input_TimeSpanBigger.classList.remove('d-none')
            Instance.Validation.Container_Input_TimeSpanLess.classList.remove('d-none')
        } else {
            Instance.Validation.Container_Input_TimeSpanBigger.classList.add('d-none')
            Instance.Validation.Container_Input_TimeSpanLess.classList.add('d-none')
        }
        this.ValidationSettings.USE_TIMESPAN = State_Use

        this.ApppendValidation('USE_TIMESPAN', Val)
    }

    TIMESPAN_Initial() {
        let Inputs = `
            <div class="justify-content-around col-12 text-center">
            <div class="CONTAINER_INPUT_RADIO">
                <input type="radio" name="InputRadioValidationTimeSpan" value="Disabled" class="m-auto" ${(this.ValidationSettings.USE_TIMESPAN == 'Disabled' ? 'checked' : '')} ActionInputSettings_OnInput_Type="USE_TIMESPAN" ActionInputSettings_OnInput_TypeBase="Validation" ActionInputSettings_OnInput="${this.Instance.IndexInInstance}">         
                <p>غیر فعال</p>
            </div>
            <div class="CONTAINER_INPUT_RADIO">
                <input type="radio" name="InputRadioValidationTimeSpan" value="Active" class="m-auto" ${(this.ValidationSettings.USE_TIMESPAN == 'Active' ? 'checked' : '')} ActionInputSettings_OnInput_Type="USE_TIMESPAN" ActionInputSettings_OnInput_TypeBase="Validation" ActionInputSettings_OnInput="${this.Instance.IndexInInstance}">
                <p>فعال</p>
            </div>
        </div>
        `
        let Input_TimeBigger_Settings = `<input type="time" class="m-auto" value="${this.ValidationSettings.TimeSpan_Bigger}" ActionInputSettings_OnInput_Type="TimeSpan_Bigger" ActionInputSettings_OnInput_TypeBase="Validation" ActionInputSettings_OnInput="${this.Instance.IndexInInstance}">`
        let Input_TimeLess_Settings = `<input type="time" class="m-auto"  value="${this.ValidationSettings.TimeSpan_Less}" ActionInputSettings_OnInput_Type="TimeSpan_Less" ActionInputSettings_OnInput_TypeBase="Validation" ActionInputSettings_OnInput="${this.Instance.IndexInInstance}">`
        CreateInputItemSettings(' محدودیت زمان :', Inputs)
        this.Container_Input_TimeSpanBigger = CreateInputItemSettings('زمان بیشتر از :', Input_TimeBigger_Settings)
        this.Container_Input_TimeSpanLess = CreateInputItemSettings('زمان کمتر از :', Input_TimeLess_Settings)
        if (this.ValidationSettings.USE_TIMESPAN == 'Disabled') {
            this.Container_Input_TimeSpanBigger.classList.add('d-none')
            this.Container_Input_TimeSpanLess.classList.add('d-none')
        }
    }

    DateSpan_Bigger(Val) {
        this.ApppendValidation('DateSpan_Bigger', Val)
        this.ValidationSettings.DateSpan_Bigger = Val
    }

    DateSpan_Less(Val) {
        this.ApppendValidation('DateSpan_Less', Val)
        this.ValidationSettings.DateSpan_Less = Val
    }

    USE_DATESPAN(Val, Input, Instance) {
        let State_Use = Input.value
        if (State_Use == 'Active') {
            Instance.Validation.Container_Input_DateSpanBigger.classList.remove('d-none')
            Instance.Validation.Container_Input_DateSpanLess.classList.remove('d-none')
        } else {
            Instance.Validation.Container_Input_DateSpanBigger.classList.add('d-none')
            Instance.Validation.Container_Input_DateSpanLess.classList.add('d-none')
        }
        this.ValidationSettings.USE_DATESPAN = State_Use
        this.ApppendValidation('USE_DATESPAN', Val)
    }

    DATESPAN_Initial() {
        let Inputs = `
            <div class="justify-content-around col-12 text-center">
            <div class="CONTAINER_INPUT_RADIO">
                <input type="radio" name="InputRadioValidationDateSpan" value="Disabled" class="m-auto" ${(this.ValidationSettings.USE_DATESPAN == 'Disabled' ? 'checked' : '')} ActionInputSettings_OnInput_Type="USE_DATESPAN" ActionInputSettings_OnInput_TypeBase="Validation" ActionInputSettings_OnInput="${this.Instance.IndexInInstance}">         
                <p>غیر فعال</p>
            </div>
            <div class="CONTAINER_INPUT_RADIO">
                <input type="radio" name="InputRadioValidationDateSpan" value="Active" class="m-auto" ${(this.ValidationSettings.USE_DATESPAN == 'Active' ? 'checked' : '')} ActionInputSettings_OnInput_Type="USE_DATESPAN" ActionInputSettings_OnInput_TypeBase="Validation" ActionInputSettings_OnInput="${this.Instance.IndexInInstance}">
                <p>فعال</p>
            </div>
        </div>
        `
        let Input_DateBigger_Settings = `<input type="date" class="m-auto" value="${this.ValidationSettings.DateSpan_Bigger}" ActionInputSettings_OnInput_Type="DateSpan_Bigger" ActionInputSettings_OnInput_TypeBase="Validation" ActionInputSettings_OnInput="${this.Instance.IndexInInstance}">`
        let Input_DateLess_Settings = `<input type="date" class="m-auto"  value="${this.ValidationSettings.DateSpan_Less}" ActionInputSettings_OnInput_Type="DateSpan_Less" ActionInputSettings_OnInput_TypeBase="Validation" ActionInputSettings_OnInput="${this.Instance.IndexInInstance}">`
        CreateInputItemSettings(' محدودیت تاریخ :', Inputs)
        this.Container_Input_DateSpanBigger = CreateInputItemSettings('تاریخ بیشتر از :', Input_DateBigger_Settings)
        this.Container_Input_DateSpanLess = CreateInputItemSettings('تاریخ کمتر از :', Input_DateLess_Settings)
        if (this.ValidationSettings.USE_DATESPAN == 'Disabled') {
            this.Container_Input_DateSpanBigger.classList.add('d-none')
            this.Container_Input_DateSpanLess.classList.add('d-none')
        }
    }


    ApppendValidation(TypeValidation, Value) {
        this.Instance.DICT_VALIDATION[TypeValidation] = Value
    }

}

class StyleBase {
    constructor(Instance) {
        this.Instance = Instance
        this.StyleSettings = {
            // Defaults Styles
            'Display': 'Inline-Block',
            'Width': '300',
            'Height': '40',
            'FontSize': '17',
            'Color': '#111111',
            'Background': '#ffffff',
            'MarginTop': '1',
            'MarginBottom': '1',
            'MarginRight': '1',
            'MarginLeft': '1',
            'TextAlign': 'Right',
            'TranslateY': '0',
            'TranslateX': '0',
            // Units
            'Width_Unit': 'auto',
            'Height_Unit': 'auto',
            'FontSize_Unit': 'px',
            'MarginTop_Unit': 'px',
            'MarginBottom_Unit': 'px',
            'MarginLeft_Unit': 'px',
            'MarginRight_Unit': 'px',
            'TranslateY_Unit': 'px',
            'TranslateX_Unit': 'px',
            // Style Advance
            'ClassName': '',
            'ClassNameParent': '',
            'StyleAdvance': ''
        }
    }

    Display(Val) {
        this.Instance.Node.style.display = Val
        this.StyleSettings.Display = Val
        this.ApppendStyle('Display', Val)
    }

    DISPLAY_Initial() {
        let Inputs = `
           <div class="text-center w-100">
               <div class="CONTAINER_INPUT_RADIO">
                    <input type="radio" name="InputRadioDisplaySettings" value="Inline-Block" class="m-auto" ${this.StyleSettings.Display == 'Inline-Block' ? 'checked' : ''} ActionInputSettings_OnInput_Type="Display" ActionInputSettings_OnInput="${this.Instance.IndexInInstance}">
                    <p>غیر فعال</p>
               </div>
               <div class="CONTAINER_INPUT_RADIO">
                    <input type="radio" name="InputRadioDisplaySettings" value="Block" class="m-auto" ${this.StyleSettings.Display == 'Block' ? 'checked' : ''} ActionInputSettings_OnInput_Type="Display" ActionInputSettings_OnInput="${this.Instance.IndexInInstance}">
                    <p>فعال</p>
               </div>
            </div>
        `
        CreateInputItemSettings(' بلاک کامل :', Inputs)
    }

    Width(Size) {
        let Unit = this.StyleSettings.Width_Unit
        if (Unit == 'px') {
            this.Instance.Node.style.width = 'auto'
            this.Instance.ELEMENT.style.width = Size + Unit
            this.StyleSettings.Width = Size
            this.ApppendStyle('Width', Size)
        } else if (Unit == '%') {
            this.Instance.ELEMENT.style.width = '100%'
            this.Instance.Node.style.width = Size + Unit
            this.StyleSettings.Width = Size
            this.ApppendStyle('Width', Size)
        } else if (Unit == 'auto') {
            this.Instance.ELEMENT.style.width = '100%'
            this.Instance.Node.style.width = 'auto'
            // this.StyleSettings.Height = 'auto'
            this.ApppendStyle('width', 'auto')
        }
    }

    Width_Unit(Val) {
        this.StyleSettings.Width_Unit = Val
        this.Width(this.StyleSettings.Width)
    }

    WIDTH_Initial() {
        let Input = `<input type="number" class="m-auto" value="${this.StyleSettings.Width}" ActionInputSettings_OnInput_Type="Width" ActionInputSettings_OnInput="${this.Instance.IndexInInstance}">`
        let Node_Unit = `
            <select class="UnitItemSettings" ActionInputSettings_OnInput_Type="Width_Unit" ActionInputSettings_OnInput="${this.Instance.IndexInInstance}">
                <option value="px" ${this.StyleSettings.Width_Unit == 'px' && 'selected'} >پیکسل</option>
                <option value="%" ${this.StyleSettings.Width_Unit == '%' && 'selected'}>درصد</option>
                <option value="auto" ${this.StyleSettings.Width_Unit == 'auto' && 'selected'}>خودکار</option>
            </select>
        `
        CreateInputItemSettings('عرض :', Input, Node_Unit)
    }

    Height(Size) {
        let Unit = this.StyleSettings.Height_Unit
        if (Unit == 'px') {
            this.Instance.Node.style.height = 'auto'
            this.Instance.ELEMENT.style.height = Size + Unit
            this.StyleSettings.Height = Size
            this.ApppendStyle('Height', Size)
        } else if (Unit == '%') {
            this.Instance.ELEMENT.style.height = '100%'
            this.Instance.Node.style.height = Size + Unit
            this.StyleSettings.Height = Size
            this.ApppendStyle('Height', Size)
        } else if (Unit == 'auto') {
            this.Instance.ELEMENT.style.height = '100%'
            this.Instance.Node.style.height = 'auto'
            // this.StyleSettings.Height = 'auto'
            this.ApppendStyle('Height', 'auto')
        }
    }

    Height_Unit(Val) {
        this.StyleSettings.Height_Unit = Val
        this.Height(this.StyleSettings.Height)
    }

    Height_Initial() {
        let Input = `<input type="number" class="m-auto" value="${this.StyleSettings.Height}" ActionInputSettings_OnInput_Type="Height" ActionInputSettings_OnInput="${this.Instance.IndexInInstance}">`
        let Node_Unit = `
            <select class="UnitItemSettings" ActionInputSettings_OnInput_Type="Height_Unit" ActionInputSettings_OnInput="${this.Instance.IndexInInstance}">
                <option value="px" ${this.StyleSettings.Height_Unit == 'px' && 'selected'} >پیکسل</option>
                <option value="%" ${this.StyleSettings.Height_Unit == '%' && 'selected'}>درصد</option>
                <option value="auto" ${this.StyleSettings.Height_Unit == 'auto' && 'selected'}>خودکار</option>
            </select>
        `
        CreateInputItemSettings('ارتفاع :', Input, Node_Unit)
    }

    Color(Color) {
        this.Instance.ELEMENT.style.color = Color
        this.StyleSettings.Color = Color
        this.ApppendStyle('Color', Color)
    }

    COLOR_Initial() {
        let Input = `  <input type="color" class="w-50 m-auto" value="${this.StyleSettings.Color}" ActionInputSettings_OnInput_Type="Color" ActionInputSettings_OnInput="${this.Instance.IndexInInstance}">`
        CreateInputItemSettings('رنگ متن : ', Input, false)
    }

    Background(Color) {
        this.Instance.ELEMENT.style.background = Color
        this.StyleSettings.Background = Color
        this.ApppendStyle('Background', Color)
    }

    BACKGROUND_Initial() {
        let Input = `  <input type="color" class="w-50 m-auto" value="${this.StyleSettings.Background}" ActionInputSettings_OnInput_Type="Background" ActionInputSettings_OnInput="${this.Instance.IndexInInstance}">`
        CreateInputItemSettings('رنگ پس زمینه : ', Input)
    }

    FontSize(Size) {
        let Unit = this.StyleSettings.FontSize_Unit
        this.Instance.ELEMENT.style.fontSize = Size + Unit
        this.StyleSettings.FontSize = Size
        this.ApppendStyle('FontSize', Size)
    }

    FontSize_Unit(Val) {
        this.StyleSettings.FontSize_Unit = Val
        this.FontSize(this.StyleSettings.FontSize)
    }

    FONTSIZE_Initial() {
        let Input = `<input type="number" class="m-auto" value="${this.StyleSettings.FontSize}" ActionInputSettings_OnInput_Type="FontSize" ActionInputSettings_OnInput="${this.Instance.IndexInInstance}">`
        let Node_Unit = `
            <select class="UnitItemSettings" ActionInputSettings_OnInput_Type="FontSize_Unit" ActionInputSettings_OnInput="${this.Instance.IndexInInstance}">
                <option value="px" ${this.StyleSettings.FontSize_Unit == 'px' && 'selected'} >پیکسل</option>
                <option value="%" ${this.StyleSettings.FontSize_Unit == '%' && 'selected'}>درصد</option>  
            </select>
        `
        CreateInputItemSettings('سایز فونت :', Input, Node_Unit)
    }

    MarginTop(Size) {
        let Unit = this.StyleSettings.MarginTop_Unit
        if (Unit == 'auto') {
            this.Instance.Node.style.marginTop = 'auto'
            // this.StyleSettings.MarginTop = 'auto'
            this.ApppendStyle('MarginTop', 'auto')
        } else {
            this.Instance.Node.style.marginTop = Size + Unit
            this.StyleSettings.MarginTop = Size
            this.ApppendStyle('MarginTop', Size)
        }
    }

    MarginTop_Unit(Val) {
        this.StyleSettings.MarginTop_Unit = Val
        this.MarginTop(this.StyleSettings.MarginTop)
    }

    MARGINTOP_Initial() {
        let Input = `<input type="number" class="m-auto" value="${this.StyleSettings.MarginTop}" ActionInputSettings_OnInput_Type="MarginTop" ActionInputSettings_OnInput="${this.Instance.IndexInInstance}">`
        let Node_Unit = `
            <select class="UnitItemSettings" ActionInputSettings_OnInput_Type="MarginTop_Unit" ActionInputSettings_OnInput="${this.Instance.IndexInInstance}">
                <option value="px" ${this.StyleSettings.MarginTop_Unit == 'px' && 'selected'} >پیکسل</option>
                <option value="%" ${this.StyleSettings.MarginTop_Unit == '%' && 'selected'}>درصد</option>
                <option value="auto" ${this.StyleSettings.MarginTop_Unit == 'auto' && 'selected'}>خودکار</option>
            </select>
        `
        CreateInputItemSettings('فاصله از بالا :', Input, Node_Unit)
    }

    MarginBottom(Size) {
        let Unit = this.StyleSettings.MarginTop_Unit
        this.ApppendStyle('MarginBottom', Size)
        if (Unit == 'auto') {
            this.Instance.Node.style.marginBottom = 'auto'
            // this.StyleSettings.MarginBottom = 'auto'
            this.ApppendStyle('MarginBottom', 'auto')
        } else {
            this.Instance.Node.style.marginBottom = Size + Unit
            this.StyleSettings.MarginBottom = Size
            this.ApppendStyle('MarginBottom', Size)
        }
    }

    MarginBottom_Unit(Val) {
        this.StyleSettings.MarginBottom_Unit = Val
        this.MarginBottom(this.StyleSettings.MarginBottom)
    }

    MARGINBOTTOM_Initial() {
        let Input = `<input type="number" class="m-auto" value="${this.StyleSettings.MarginBottom}" ActionInputSettings_OnInput_Type="MarginBottom" ActionInputSettings_OnInput="${this.Instance.IndexInInstance}">`
        let Node_Unit = `
            <select class="UnitItemSettings" ActionInputSettings_OnInput_Type="MarginBottom_Unit" ActionInputSettings_OnInput="${this.Instance.IndexInInstance}">
                <option value="px" ${this.StyleSettings.MarginBottom_Unit == 'px' && 'selected'} >پیکسل</option>
                <option value="%" ${this.StyleSettings.MarginBottom_Unit == '%' && 'selected'}>درصد</option>
                <option value="auto" ${this.StyleSettings.MarginBottom_Unit == 'auto' && 'selected'}>خودکار</option>
            </select>
        `
        CreateInputItemSettings('فاصله از پایین :', Input, Node_Unit)
    }

    MarginRight(Size) {
        let Unit = this.StyleSettings.MarginRight_Unit
        if (Unit == 'auto') {
            this.Instance.Node.style.marginRight = 'auto'
            // this.StyleSettings.MarginRight = 'auto'
            this.ApppendStyle('MarginRight', 'auto')
        } else {
            this.Instance.Node.style.marginRight = Size + Unit
            this.StyleSettings.MarginRight = Size
            this.ApppendStyle('MarginRight', Size)
        }
    }

    MarginRight_Unit(Val) {
        this.StyleSettings.MarginRight_Unit = Val
        this.MarginRight(this.StyleSettings.MarginRight)
    }

    MARGINRIGHT_Initial() {
        let Input = `<input type="number" class="m-auto" value="${this.StyleSettings.MarginRight}" ActionInputSettings_OnInput_Type="MarginRight" ActionInputSettings_OnInput="${this.Instance.IndexInInstance}">`
        let Node_Unit = `
            <select class="UnitItemSettings" ActionInputSettings_OnInput_Type="MarginRight_Unit" ActionInputSettings_OnInput="${this.Instance.IndexInInstance}">
                <option value="px" ${this.StyleSettings.MarginRight_Unit == 'px' && 'selected'} >پیکسل</option>
                <option value="%" ${this.StyleSettings.MarginRight_Unit == '%' && 'selected'}>درصد</option>
                <option value="auto" ${this.StyleSettings.MarginRight_Unit == 'auto' && 'selected'}>خودکار</option>
            </select>
        `
        CreateInputItemSettings('فاصله از راست :', Input, Node_Unit)
    }

    MarginLeft(Size) {
        let Unit = this.StyleSettings.MarginLeft_Unit
        if (Unit == 'auto') {
            this.Instance.Node.style.marginLeft = 'auto'
            // this.StyleSettings.MarginLeft = Size
            this.ApppendStyle('MarginLeft', 'auto')
        } else {
            this.Instance.Node.style.marginLeft = Size + Unit
            this.StyleSettings.MarginLeft = Size
            this.ApppendStyle('MarginLeft', Size)
        }
    }

    MarginLeft_Unit(Val) {
        this.StyleSettings.MarginLeft_Unit = Val
        this.MarginLeft(this.StyleSettings.MarginLeft)
    }

    MARGINLEFT_Initial() {
        let Input = `<input type="number" class="m-auto" value="${this.StyleSettings.MarginLeft}" ActionInputSettings_OnInput_Type="MarginLeft" ActionInputSettings_OnInput="${this.Instance.IndexInInstance}">`
        let Node_Unit = `
            <select class="UnitItemSettings" ActionInputSettings_OnInput_Type="MarginLeft_Unit" ActionInputSettings_OnInput="${this.Instance.IndexInInstance}">
                <option value="px" ${this.StyleSettings.MarginLeft_Unit == 'px' && 'selected'} >پیکسل</option>
                <option value="%" ${this.StyleSettings.MarginLeft_Unit == '%' && 'selected'}>درصد</option>
                <option value="auto" ${this.StyleSettings.MarginLeft_Unit == 'auto' && 'selected'}>خودکار</option>
            </select>
        `
        CreateInputItemSettings('فاصله از چپ :', Input, Node_Unit)
    }

    TextAlign(Side) {
        this.Instance.Node.style.textAlign = Side
        this.StyleSettings.TextAlign = Side
        this.ApppendStyle('TextAlign', Side)
    }

    TEXTALIGN_Initial(Note = true) {
        let Inputs = `
                    <div class="text-center w-100">
                        <div class="CONTAINER_INPUT_RADIO">
                            <input type="radio" name="InputRadioTextAlignSettings" ${this.StyleSettings.TextAlign == 'Right' && 'checked'}  value="Right"  ActionInputSettings_OnInput_Type="TextAlign" ActionInputSettings_OnInput="${this.Instance.IndexInInstance}">
                            <p>راست</p>
                        </div>
                        <div class="CONTAINER_INPUT_RADIO">
                            <input type="radio" name="InputRadioTextAlignSettings" ${this.StyleSettings.TextAlign == 'Center' && 'checked'} value="Center" ActionInputSettings_OnInput_Type="TextAlign" ActionInputSettings_OnInput="${this.Instance.IndexInInstance}">
                            <p>وسط</p>
                        </div>
                        <div class="CONTAINER_INPUT_RADIO ">
                            <input type="radio" name="InputRadioTextAlignSettings" ${this.StyleSettings.TextAlign == 'Left' && 'checked'} value="Left" ActionInputSettings_OnInput_Type="TextAlign" ActionInputSettings_OnInput="${this.Instance.IndexInInstance}">
                            <p>چپ</p>
                        </div>
                    </div>
        `
        let Container = CreateInputItemSettings('چیدمان المان : ', Inputs)
        if (Note) {
            CreateNoteItemSettings('توجه کنید , شما تنها در زمانی میتوانید از تنظیمات چیدمان المان استفاده کنید که المان دارای بلاک کامل و واحد عرض ان پیکسل باشد !', Container)
        }
    }

    TranslateY(Size) {
        let Unit = this.StyleSettings.TranslateY_Unit
        this.Instance.Node.style.transform = `translateY(${Size}${Unit}) translateX(${this.StyleSettings.TranslateX}${this.StyleSettings.TranslateX_Unit})`
        this.StyleSettings.TranslateY = Size
        this.ApppendStyle('TranslateY', Size)
    }

    TranslateY_Unit(Val) {
        this.StyleSettings.TranslateY_Unit = Val
        this.TranslateY(this.StyleSettings.TranslateY)
    }

    TRANSLATEY_Initial() {
        let Input = `<input type="number" class="m-auto" value="${this.StyleSettings.TranslateY}" ActionInputSettings_OnInput_Type="TranslateY" ActionInputSettings_OnInput="${this.Instance.IndexInInstance}">`
        let Node_Unit = `
            <select class="UnitItemSettings" ActionInputSettings_OnInput_Type="TranslateY_Unit" ActionInputSettings_OnInput="${this.Instance.IndexInInstance}">
                <option value="px" ${this.StyleSettings.TranslateY_Unit == 'px' && 'selected'} >پیکسل</option>
                <option value="%" ${this.StyleSettings.TranslateY_Unit == '%' && 'selected'}>درصد</option>
            </select>
        `
        CreateInputItemSettings('قرار گیری بر اساس موقعیت Y :', Input, Node_Unit)
    }

    TranslateX(Size) {
        let Unit = this.StyleSettings.TranslateX_Unit
        this.Instance.Node.style.transform = `translateX(${Size}${Unit}) translateY(${this.StyleSettings.TranslateY}${this.StyleSettings.TranslateY_Unit}) `
        this.StyleSettings.TranslateX = Size
        this.ApppendStyle('TranslateX', Size)
    }

    TranslateX_Unit(Val) {
        this.StyleSettings.TranslateX_Unit = Val
        this.TranslateX(this.StyleSettings.TranslateX)
    }

    TRANSLATEX_Initial() {
        let Input = `<input type="number" class="m-auto" value="${this.StyleSettings.TranslateX}" ActionInputSettings_OnInput_Type="TranslateX" ActionInputSettings_OnInput="${this.Instance.IndexInInstance}">`
        let Node_Unit = `
            <select class="UnitItemSettings" ActionInputSettings_OnInput_Type="TranslateX_Unit" ActionInputSettings_OnInput="${this.Instance.IndexInInstance}">
                <option value="px" ${this.StyleSettings.TranslateX_Unit == 'px' && 'selected'} >پیکسل</option>
                <option value="%" ${this.StyleSettings.TranslateX_Unit == '%' && 'selected'}>درصد</option>
            </select>
        `
        CreateInputItemSettings('قرار گیری بر اساس موقعیت X :', Input, Node_Unit)
    }

    ClassName(Val) {
        Val = Val.replace(/ /g, '')
        let ValPast = this.StyleSettings.ClassName
        if (!IsBlank(ValPast)) {
            this.Instance.ELEMENT.classList.remove(ValPast)
        }
        if (!IsBlank(Val)) {
            this.Instance.ELEMENT.classList.add(Val)
        }
        this.StyleSettings.ClassName = Val
        this.ApppendStyle('ClassName', Val)
    }

    CLASSNAME_Initial() {
        let Input = `<input type="text" class="m-auto" value="${this.StyleSettings.ClassName}" ActionInputSettings_OnInput_Type="ClassName" ActionInputSettings_OnInput="${this.Instance.IndexInInstance}">`
        CreateInputItemSettings('نام کلاس :', Input)
    }

    ClassNameParent(Val) {
        Val = Val.replace(/ /g, '')
        let ValPast = this.StyleSettings.ClassNameParent
        if (!IsBlank(ValPast)) {
            this.Instance.Node.classList.remove(ValPast)
        }
        if (!IsBlank(Val)) {
            this.Instance.Node.classList.add(Val)
        }
        this.StyleSettings.ClassNameParent = Val
        this.ApppendStyle('ClassNameParent', Val)
    }

    CLASSNAMEPARENT_Initial() {
        let Input = `<input type="text" class="m-auto" value="${this.StyleSettings.ClassNameParent}" ActionInputSettings_OnInput_Type="ClassNameParent" ActionInputSettings_OnInput="${this.Instance.IndexInInstance}">`
        CreateInputItemSettings('نام کلاس پدر :', Input)
    }

    StyleAdvance(Val) {
        try {
            let Tag_Style = document.getElementById(`STYLE_${this.Instance.id}`)
            Tag_Style.innerHTML = Val
        } catch (e) {
            let Tag_Style = document.createElement('style')
            Tag_Style.id = `STYLE_${this.Instance.id}`
            Tag_Style.innerHTML = Val
            document.body.append(Tag_Style)
        }
        if (IsBlank(Val)) {
            try {
                document.getElementById(`STYLE_${this.Instance.id}`).remove()
            } catch (e) {
            }
        }
        this.StyleSettings.StyleAdvance = Val
        this.ApppendStyle('StyleAdvance', Val)
    }

    STYLEADVANCE_Initial(Note = true) {
        let Input = `<textarea class="m-auto" rows="6" ActionInputSettings_OnInput_Type="StyleAdvance" ActionInputSettings_OnInput="${this.Instance.IndexInInstance}">${this.StyleSettings.StyleAdvance}</textarea>`
        let Container = CreateInputItemSettings('استایل (Css) :', Input)
        if (Note) {
            CreateNoteItemSettings('توجه کنید ممکن است بعضی از استایل های تنظیم شده شما به درستی کار نکنند برای حل این موضوع از دستور "important" استفاده نمایید', Container)
        }
    }

    __Load_Styles() {
        let LIST_STYLES_UNIT = this.Instance.LIST_STYLES_UNIT || []
        for (let Style_Unit of LIST_STYLES_UNIT) {
            this[Style_Unit](this.StyleSettings[Style_Unit])
        }
        let LIST_STYLES = this.Instance.LIST_STYLES || []
        for (let Style of LIST_STYLES) {
            this[Style](this.StyleSettings[Style])
        }
    }

    ApppendStyle(TypeStyle, Value) {
        this.Instance.DICT_STYLE[TypeStyle] = Value
    }
}

class ConfigBase {
    constructor(Instance) {
        this.Instance = Instance
        this.ConfigSettings = {
            'Value': '',
            'ValueTime': '',
            'ValueDate': '',
            'ValueCheckBox': 'false',
            'ValueRadio': 'false',
            'ValueImage': '',
            'ValueVideo': '',
            'ValueAudio': '',
            'Placeholder': '',
            'InnerHTML': 'متن تستی',
        }
    }

    // Settings Input

    __INFOELEMENT_Initial(Can_DELETE = true) {
        if (TYPECREATEMODELS == 'Config') {
            if (this.Instance.CAN_DELETE == undefined) {
                this.Instance.CAN_DELETE = Can_DELETE
            }
            let INDEX_INSTANCE = this.Instance.IndexInInstance
            let Type_Text = this.Instance.Type_Text
            let BtnDelete = `<i class="fa fa-trash BtnDeleteElementSettings" onclick="DELETE_ELEMENT('${INDEX_INSTANCE}')"></i>`
            let Node = `
            <div class="d-flex justify-content-between">
                ${this.Instance.CAN_DELETE == true ? BtnDelete : ''}  
                <p>${Type_Text}</p>
            </div>
            <div class="text-center">
                <p>آیدی : <span>${this.Instance.id}</span></p> 
            </div>
        `
            let Container = document.createElement('div')
            Container.className = 'ContainerInfoElementSettings'
            Container.innerHTML = Node
            ContainerItemsSettings.append(Container)
        }
    }

    Btns_Element_Initial() {
        let Btns = `
            <div class="d-flex justify-content-between text-center">
                <button class="BtnAddDesSettings" ActionInputSettings_OnClick_Type="Create_TitleElement" ActionInputSettings_OnClick_TypeBase="Config" ActionInputSettings_OnClick="${this.Instance.IndexInInstance}">
                    <p>افزودن عنوان</p>
                    <i class="far fa-plus"></i>
                </button>
                <button class="BtnAddDesSettings" ActionInputSettings_OnClick_Type="Create_TextElement" ActionInputSettings_OnClick_TypeBase="Config" ActionInputSettings_OnClick="${this.Instance.IndexInInstance}">
                    <p>افزودن متن</p>
                    <i class="far fa-plus"></i>
                </button>
                <button class="BtnAddDesSettings" ActionInputSettings_OnClick_Type="Create_AlertElement" ActionInputSettings_OnClick_TypeBase="Config" ActionInputSettings_OnClick="${this.Instance.IndexInInstance}">
                    <p>افزودن هشدار</p>
                    <i class="far fa-plus"></i>
                </button>
            </div>
        `
        CreateInputItemSettings('', Btns)
    }

    Create_TitleElement(Val = 'عنوان', Instance, OpenSettings = true) {
        let Title = new TAG_H3(null, true)
        Instance.ELementsCLASS_Title.push(Title)
        Instance.ElementsCLASS_Secondary.push(Title)
        Instance.Node.insertBefore(Title.Node, Instance.Node.firstElementChild)
        Instance.Style.StyleSettings.MarginTop = '0'
        Title.Style.StyleSettings.MarginBottom = '0'
        Title.Style.StyleSettings.TranslateY = '0'
        Title.Config.ConfigSettings.InnerHTML = (Val == '' ? 'عنوان' : Val)
        Title.Config.ConfigSettings.TypeTag = 'Tag_H3_Title'
        Instance.Style.__Load_Styles()
        Title.Style.__Load_Styles()
        Title.Config.__Load_Config()
        if (OpenSettings == true) {
            ControlSettingsMenu_For_Element('Close')
            Instance.Initial_Settings()
            ControlSettingsMenu_For_Element('Open', Instance.ELEMENT, Instance)
        } else {
            Instance.Initial_Settings()
        }
        return Title
    }

    Create_TextElement(Val = 'متن', Instance, OpenSettings = true) {
        let Text = new TAG_P(null, true)
        Val = Val == '' ? 'متن' : Val
        Instance.ELementsCLASS_Text.push(Text)
        Instance.ElementsCLASS_Secondary.push(Text)
        Instance.Node.append(Text.Node)
        Instance.Style.StyleSettings.MarginBottom = '0'
        Text.Style.StyleSettings.MarginTop = '0'
        Text.Style.StyleSettings.FontSize = '14'
        Text.Style.StyleSettings.TranslateY = '-1'
        Text.Config.ConfigSettings.InnerHTML = Val
        Text.innerHTML = Val
        Text.Config.ConfigSettings.TypeTag = 'Tag_P_Text'
        Instance.Style.__Load_Styles()
        Text.Style.__Load_Styles()
        Text.Config.__Load_Config()
        if (OpenSettings == true) {
            ControlSettingsMenu_For_Element('Close')
            Instance.Initial_Settings()
            ControlSettingsMenu_For_Element('Open', Instance.ELEMENT, Instance)
        } else {
            Instance.Initial_Settings()
        }
        return Text
    }

    Create_AlertElement(Val = 'متن هشدار', Instance, OpenSettings = true) {
        let Alert = new TAG_P(null, true)
        Instance.ELementsCLASS_Alert.push(Alert)
        Instance.ElementsCLASS_Secondary.push(Alert)
        Instance.Node.append(Alert.Node)
        Instance.Style.StyleSettings.MarginBottom = '0'
        Alert.Style.StyleSettings.MarginTop = '0'
        Alert.Style.StyleSettings.Color = 'rgb(255,79,87)'
        Alert.Style.StyleSettings.FontSize = '12'
        Alert.Style.StyleSettings.TranslateY = '-5'
        Alert.Config.ConfigSettings.InnerHTML = (Val == '' ? 'متن هشدار' : Val)
        Alert.Config.ConfigSettings.TypeTag = 'Tag_P_Alert'
        Instance.Style.__Load_Styles()
        Alert.Style.__Load_Styles()
        Alert.Config.__Load_Config()
        if (OpenSettings == true) {
            ControlSettingsMenu_For_Element('Close')
            Instance.Initial_Settings()
            ControlSettingsMenu_For_Element('Open', Instance.ELEMENT, Instance)
        } else {
            Instance.Initial_Settings()
        }
        return Alert
    }

    Btn_InsertElement_Initial() {
        let InsertElement_Initial = this.InsertElement_Initial
        let Instance = this.Instance
        let Node = `
            <div class="m-auto text-center">
                <button class="BtnAddDesSettings">
                    <p>افزودن المان</p>
                    <i class="far fa-plus"></i>
                </button>   
            </div>
        `
        let Container = CreateInputItemSettings('', Node)
        Container.querySelector('button').addEventListener('click', function () {
            InsertElement_Initial(Instance)
        })
    }

    InsertElement_Initial(Instance) {
        LockAllElements()
        let Container = CreateContainerBlur('7', 'ContainerInsertElementBox') // 7 => 7% margin top
        ClickOutSideContainer(Container, function () {
            DeleteContainerBlur()
            UnlockAllElements()
        })
        let Node = `
            <div class="TitleContainerInsertElement">
               <p>افزودن المان</p>
               <i class="fa fa-plus"></i>
             </div>
            <div class="row m-0">
                <div class="col-12 col-md-6">
                    <div class="TitleContainerSectionInsertElements">
                      <p>رسانه و متن ها</p>
                    </div>
<!--                        <button class="InputItemContainerInsertElement" ClickMode="TAG_DIV"> باکس</button>-->
                        <button class="InputItemContainerInsertElement" ClickMode="TAG_H1"> عنوان بزرگ</button>
                        <button class="InputItemContainerInsertElement" ClickMode="TAG_H3"> عنوان متوسط</button>
                        <button class="InputItemContainerInsertElement" ClickMode="TAG_H6"> عنوان کوچک</button>
                        <button class="InputItemContainerInsertElement" ClickMode="TAG_P"> متن</button>
                        <button class="InputItemContainerInsertElement" ClickMode="TAG_VIDEO">ویدئو</button>
                        <div class="NoteInputItemAside">
                            <p>توجه کنید حجم ویدئو باید کمتر از 1مگابایت باشد .</p>
                            <i class="fa fa-exclamation-triangle"></i>
                        </div>
                        <button class="InputItemContainerInsertElement" ClickMode="TAG_IMAGE">عکس</button>
                        <div class="NoteInputItemAside">
                            <p>توجه کنید حجم عکس باید کمتر از 1مگابایت باشد .</p>
                            <i class="fa fa-exclamation-triangle"></i>
                        </div>
                        <button class="InputItemContainerInsertElement" ClickMode="TAG_AUDIO">صدا</button>
                        <div class="NoteInputItemAside">
                            <p>توجه کنید حجم صدا باید کمتر از 1مگابایت باشد .</p>
                            <i class="fa fa-exclamation-triangle"></i>
                        </div>
                </div>
                <div class="col-12 col-md-6">
                    <div class="TitleContainerSectionInsertElements">
                      <p>اینپوت ها</p>
                    </div>           
                    <button class="InputItemContainerInsertElement" ClickMode="CHAR"> متن کوتاه</button>
                    <button class="InputItemContainerInsertElement" ClickMode="TEXT">متن بزرگ</button>
                    <button class="InputItemContainerInsertElement" ClickMode="NUMBER">عدد</button>
                    <button class="InputItemContainerInsertElement" ClickMode="EMAIL">ایمیل</button>
                    <button class="InputItemContainerInsertElement" ClickMode="PASSWORD">رمز</button>
                    <button class="InputItemContainerInsertElement" ClickMode="TIME">زمان</button>
                    <button class="InputItemContainerInsertElement" ClickMode="DATE">تاریخ</button>
                    <button class="InputItemContainerInsertElement" ClickMode="CHECKBOX">چک باکس</button>
                    <button class="InputItemContainerInsertElement" ClickMode="RADIO">رادیو</button>
                    <button class="InputItemContainerInsertElement" ClickMode="IMAGE">عکس</button>
                    <button class="InputItemContainerInsertElement" ClickMode="FILE">فایل</button>
                </div>    
            </div>
        `
        Container.innerHTML = Node
        let All_InputItemContainerInsertElement = document.querySelectorAll('.InputItemContainerInsertElement')
        for (let Item of All_InputItemContainerInsertElement) {
            Item.addEventListener('click', function () {
                let Type = this.getAttribute('ClickMode')
                switch (Type) {
                    // Inputs
                    case 'CHAR':
                        new INPUT_CHAR(Instance)
                        break
                    case 'TEXT':
                        new INPUT_TEXTAREA(Instance)
                        break
                    case 'NUMBER':
                        new INPUT_NUMBER(Instance)
                        break
                    case 'EMAIL':
                        new INPUT_EMAIL(Instance)
                        break
                    case 'PASSWORD':
                        new INPUT_PASSWORD(Instance)
                        break
                    case 'TIME':
                        new INPUT_TIME(Instance)
                        break
                    case 'DATE':
                        new INPUT_DATE(Instance)
                        break
                    case 'CHECKBOX':
                        let ElementInputCheckbox = new INPUT_CHECKBOX(Instance)
                        ElementInputCheckbox.Config.Create_TextElement('', ElementInputCheckbox)
                        break
                    case 'RADIO':
                        let ElementInputRadiobox = new INPUT_RADIO(Instance)
                        ElementInputRadiobox.Config.Create_TextElement('', ElementInputRadiobox)
                        break
                    case 'IMAGE':
                        new INPUT_IMAGE(Instance)
                        break
                    case 'FILE':
                        new INPUT_FILE(Instance)
                        break
                    // Text & Media
                    // case 'TAG_DIV':
                    //     new BOX_BASE(Instance)       // Useless
                    //     break
                    case 'TAG_H1':
                        new TAG_H1(Instance)
                        break
                    case 'TAG_H3':
                        new TAG_H3(Instance)
                        break
                    case 'TAG_H6':
                        new TAG_H6(Instance)
                        break
                    case 'TAG_P':
                        new TAG_P(Instance)
                        break
                    case 'TAG_VIDEO':
                        new VIDEO_BASE(Instance)
                        break
                    case 'TAG_IMAGE':
                        new IMAGE_BASE(Instance)
                        break
                    case 'TAG_AUDIO':
                        new AUDIO_BASE(Instance)
                        break

                }
                document.body.click() // Remove Container Insert Elements
            })
        }
    }

    Value(Val) {
        this.Instance.ELEMENT.value = Val
        this.ConfigSettings.Value = Val
        this.AppendConfig('Value', Val)
    }

    VALUE_Initial(Type = 'text') {
        let Input = `<input type="${Type}" class="m-auto" value="${this.ConfigSettings.Value}" ActionInputSettings_OnInput_Type="Value" ActionInputSettings_OnInput_TypeBase="Config" ActionInputSettings_OnInput="${this.Instance.IndexInInstance}">`
        CreateInputItemSettings('مقدار پیشفرض :', Input)
    }

    ValueTime(Val) {
        this.Instance.ELEMENT.value = Val
        this.ConfigSettings.ValueTime = Val
        this.AppendConfig('ValueTime', Val)
    }

    VALUETIME_Initial() {
        let Input = `<input type="time" class="m-auto" value="${this.ConfigSettings.ValueTime}" ActionInputSettings_OnInput_Type="ValueTime" ActionInputSettings_OnInput_TypeBase="Config" ActionInputSettings_OnInput="${this.Instance.IndexInInstance}">`
        CreateInputItemSettings('مقدار پیشفرض :', Input)
    }

    ValueDate(Val) {
        this.Instance.ELEMENT.value = Val
        this.ConfigSettings.ValueDate = Val
        this.AppendConfig('ValueDate', Val)
    }

    VALUEDATE_Initial() {
        let Input = `<input type="date" class="m-auto" value="${this.ConfigSettings.ValueDate}" ActionInputSettings_OnInput_Type="ValueDate" ActionInputSettings_OnInput_TypeBase="Config" ActionInputSettings_OnInput="${this.Instance.IndexInInstance}">`
        CreateInputItemSettings('مقدار پیشفرض :', Input)
    }

    ValueCheckBox(Val) {
        if (Val == 'true') {
            this.Instance.InputCheckBox.setAttribute('checked', '')
        } else {
            this.Instance.InputCheckBox.removeAttribute('checked')
        }
        this.ConfigSettings.ValueCheckBox = Val
        this.AppendConfig('ValueCheckBox', Val)
    }

    VALUECHECKBOX_Initial() {
        let Inputs = `
           <div class="text-center w-100">
               <div class="CONTAINER_INPUT_RADIO">
                    <input type="radio" name="InputRadioValueCheckboxSettings" value="false" class="m-auto" ${this.ConfigSettings.ValueCheckBox == 'false' ? 'checked' : ''} ActionInputSettings_OnInput_Type="ValueCheckBox" ActionInputSettings_OnInput_TypeBase="Config" ActionInputSettings_OnInput="${this.Instance.IndexInInstance}">
                    <p>غیر فعال</p>
               </div>
               <div class="CONTAINER_INPUT_RADIO">
                    <input type="radio" name="InputRadioValueCheckboxSettings" value="true" class="m-auto" ${this.ConfigSettings.ValueCheckBox == 'true' ? 'checked' : ''} ActionInputSettings_OnInput_Type="ValueCheckBox" ActionInputSettings_OnInput_TypeBase="Config" ActionInputSettings_OnInput="${this.Instance.IndexInInstance}">
                    <p>فعال</p>
               </div>
            </div>
        `
        CreateInputItemSettings('مقدار پیشفرض :', Inputs)
    }

    ValueRadio(Val) {
        let ALL_RADIO_IN_BOX = this.Instance.ClassContainer_SET.ElementsCLASS.filter(function (Instance) {
            if (Instance.Type == 'INPUT_RADIO') {
                return Instance
            }
        })
        for (let Radio of ALL_RADIO_IN_BOX) {
            let InputRadio = Radio.InputRadio
            InputRadio.checked = false
            Radio.Config.ConfigSettings.ValueRadio = 'false'
            Radio.Config.AppendConfig('ValueRadio', 'false')
        }
        if (Val == 'true') {
            this.Instance.InputRadio.checked = true
        } else {
            this.Instance.InputRadio.checked = false
        }
        this.ConfigSettings.ValueRadio = Val
        this.AppendConfig('ValueRadio', Val)
    }

    VALUERADIO_Initial() {
        let Inputs = `
           <div class="text-center w-100">
               <div class="CONTAINER_INPUT_RADIO">
                    <input type="radio" name="InputRadioValueRadioSettings" value="false" class="m-auto" ${this.ConfigSettings.ValueRadio == 'false' ? 'checked' : ''} ActionInputSettings_OnInput_Type="ValueRadio" ActionInputSettings_OnInput_TypeBase="Config" ActionInputSettings_OnInput="${this.Instance.IndexInInstance}">
                    <p>غیر فعال</p>
               </div>
               <div class="CONTAINER_INPUT_RADIO">
                    <input type="radio" name="InputRadioValueRadioSettings" value="true" class="m-auto" ${this.ConfigSettings.ValueRadio == 'true' ? 'checked' : ''} ActionInputSettings_OnInput_Type="ValueRadio" ActionInputSettings_OnInput_TypeBase="Config" ActionInputSettings_OnInput="${this.Instance.IndexInInstance}">
                    <p>فعال</p>
               </div>
            </div>
        `
        CreateInputItemSettings('مقدار پیشفرض :', Inputs)
    }

    ValueImage(Val, Instance, Input) {
        if (!InputFile_IsEmpty(Input)) {
            if (this.Instance.Validation_InputFile(Input)) {
                this.Instance.SetInputMedia($(Input).clone())
                this.ConfigSettings.ValueImage = Val
                this.AppendConfig('ValueImage', Val)
            } else {
                this.Instance.ELEMENT.src = ''
                this.Instance.INPUT_MEDIA = null
            }
        }
    }

    VALUEIMAGE_Initial() {
        let INPUT_MEDIA = this.Instance.INPUT_MEDIA
        if (INPUT_MEDIA) {
            CreateInputItemSettings('عکس :', INPUT_MEDIA, false, false)
        } else {
            let Input = `
              <input type="file" class="m-auto" accept=".jpg , .png , .gif"  ActionInputSettings_OnInput_Type="ValueImage" ActionInputSettings_OnInput_TypeBase="Config" ActionInputSettings_OnInput="${this.Instance.IndexInInstance}">
            `
            CreateInputItemSettings('انتخاب عکس :', Input)
        }
    }

    ValueVideo(Val, Instance, Input) {
        if (!InputFile_IsEmpty(Input)) {
            if (this.Instance.Validation_InputFile(Input)) {
                this.Instance.SetInputMedia($(Input).clone())
                this.ConfigSettings.ValueVideo = Val
                this.AppendConfig('ValueVideo', Val)
            } else {
                this.Instance.ELEMENT.src = ''
                this.Instance.INPUT_MEDIA = null
            }
        }
    }

    VALUEVIDEO_Initial() {
        let INPUT_MEDIA = this.Instance.INPUT_MEDIA
        if (INPUT_MEDIA) {
            CreateInputItemSettings('ویدئو :', INPUT_MEDIA, false, false)
        } else {
            let Input = `
              <input type="file" class="m-auto" accept=".mp4"  ActionInputSettings_OnInput_Type="ValueVideo" ActionInputSettings_OnInput_TypeBase="Config" ActionInputSettings_OnInput="${this.Instance.IndexInInstance}">
            `
            CreateInputItemSettings('انتخاب ویدئو :', Input)
        }
    }

    ValueAudio(Val, Instance, Input) {
        if (!InputFile_IsEmpty(Input)) {
            if (this.Instance.Validation_InputFile(Input)) {
                this.Instance.SetInputMedia($(Input).clone())
                this.ConfigSettings.ValueAudio = Val
                this.AppendConfig('ValueAudio', Val)
            } else {
                this.Instance.ELEMENT.src = ''
                this.Instance.INPUT_MEDIA = null
            }
        }
    }

    VALUEAUDIO_Initial() {
        let INPUT_MEDIA = this.Instance.INPUT_MEDIA
        if (INPUT_MEDIA) {
            CreateInputItemSettings('صدا :', INPUT_MEDIA, false, false)
        } else {
            let Input = `
              <input type="file" class="m-auto" accept=".mp3"  ActionInputSettings_OnInput_Type="ValueAudio" ActionInputSettings_OnInput_TypeBase="Config" ActionInputSettings_OnInput="${this.Instance.IndexInInstance}">
            `
            CreateInputItemSettings('انتخاب صدا :', Input)
        }
    }

    Placeholder(Val) {
        this.Instance.ELEMENT.placeholder = Val
        this.ConfigSettings.Placeholder = Val
        this.AppendConfig('Placeholder', Val)
    }

    PLACEHOLDER_Initial() {
        let Input = `<input type="text" class="m-auto" value="${this.ConfigSettings.Placeholder}" ActionInputSettings_OnInput_Type="Placeholder" ActionInputSettings_OnInput_TypeBase="Config" ActionInputSettings_OnInput="${this.Instance.IndexInInstance}">`
        CreateInputItemSettings('مقدار راهنما :', Input)
    }

    InnerHTML(Val) {
        this.Instance.ELEMENT.innerHTML = Val
        this.ConfigSettings.InnerHTML = Val
        this.AppendConfig('InnerHTML', Val)
    }

    INNERHTML_Initial() {
        let Input = `<input type="text" class="m-auto" value="${this.ConfigSettings.InnerHTML}" ActionInputSettings_OnInput_Type="InnerHTML" ActionInputSettings_OnInput_TypeBase="Config" ActionInputSettings_OnInput="${this.Instance.IndexInInstance}">`
        CreateInputItemSettings('مقدار پیشفرض :', Input)
    }

    __Load_Config() {
        let LIST_CONFIG = this.Instance.LIST_CONFIGS || []
        for (let Config of LIST_CONFIG) {
            this[Config](this.ConfigSettings[Config])
        }
    }

    AppendConfig(TypeConfig, Value) {
        this.Instance.DICT_CONFIG[TypeConfig] = Value
    }
}

// TypeCreate : If the value is TYPECREATEMODELS config, it means it is made to edit the form, and if its value is Record, it is made to use the form
class ElementBase {
    constructor(Type, ClassContainer_SET, OnlyCreate = false) {
        this.id = CreateID_UNIQUE()
        this.Type = Type
        this.TypeCreate = (TYPECREATEMODELS == undefined && 'Config')
        this.Type_Base = 'ELEMENT_BASE_CUSTOMIZE'
        this.ClassContainer_SET = ClassContainer_SET
        this.OnlyCreate = OnlyCreate
        this.AddINSTANCE()
        this.Style = new StyleBase(this)
        this.Config = new ConfigBase(this)
        this.DICT_STYLE = {}
        this.DICT_CONFIG = {}
        this.ELementsCLASS_Title = []
        this.ELementsCLASS_Text = []
        this.ELementsCLASS_Alert = []
        this.ElementsCLASS_Secondary = [] // ELementsCLASS_Title + ELementsCLASS_Text + ELementsCLASS_Alert
        this.STATUS = 'OK'
        this.STATE = 'Create'
    }

    ControllMenuSettings_Open_Close(Instance, Element, Event = 'click') {
        if (this.TypeCreate = 'Config') {
            Element.addEventListener(Event.toLowerCase(), function (e) {
                if (e.target == Element) {
                    ControlSettingsMenu_For_Element('Open', Element, Instance)
                }
            })
            Element.addEventListener('focus', function (e) {
                if (e.target == Element) {
                    ControlSettingsMenu_For_Element('Open', Element, Instance)
                }
            })
        }
    }

    FocusElement(Element) {
        Element.classList.add('InputPageIsFouced')
    }

    FocousOutElement(Element) {
        Element.classList.remove('InputPageIsFouced')
    }

    AddINSTANCE() {
        INSTANCES_ELEMENTS.push(this)
        this.IndexInInstance = INSTANCES_ELEMENTS.length - 1
    }

    RemoveINSTANCE() {
        this.STATUS = 'DELETED'
        this.Node.remove()
        for (let Class of this.ELementsCLASS_Title) {
            Class.STATUS = 'DELETED'
        }
        for (let Class of this.ELementsCLASS_Text) {
            Class.STATUS = 'DELETED'
        }
        for (let Class of this.ELementsCLASS_Alert) {
            Class.STATUS = 'DELETED'
        }
    }

    AppendELEMENT() {
        if (!this.OnlyCreate) {
            if (this.ClassContainer_SET) {
                let ClassContainer = this.ClassContainer_SET
                let Container = ClassContainer.ELEMENT
                Container.append(this.Node)
                ClassContainer.Elements.push(this.Node)
                ClassContainer.ElementsCLASS.push(this)
            } else {
                let IndexContainerPage = ContainerPage.getAttribute('IndexPage')
                this.ContainerPage = LIST_PAGES_CLASS[IndexContainerPage] // Class Element
                ContainerPage.appendChild(this.Node) // Node Element
                this.ContainerPage.Elements.push(this.Node)
                this.ContainerPage.ElementsCLASS.push(this)
                this.IndexInElementsPage = this.ContainerPage.Elements.length - 1
            }
        }
        LIST_ELEMENTS_FORM.push(this.Node)
        return LIST_ELEMENTS_FORM.length - 1
    }
}

let COUNTER_ID_PAGE = 0
let LEN_PAGES = 0
let LIST_INSTANCE_INPUT = []


class PAGE_ELEMENT extends ElementBase {
    constructor(TypeCreate = 'Config') {
        super('PAGE_ELEMENT')
        this.TypeCreate = TypeCreate
        this.COUNTER_ID_PAGE = COUNTER_ID_PAGE += 1
        this.Type_Text = ` صفحه شماره ${this.COUNTER_ID_PAGE}`
        LEN_PAGES += 1
        this.Node = this.NodeElement()
        this.ELEMENT = this.Node
        this.IndexInPages = this.AppendPage()
        this.SetCounterNumberPage()
        this.Elements = []
        this.ElementsCLASS = []

        this.Customize_Styles()
        //  you do not define : "LIST_CONFIGS" or "LIST_STYLES_UNIT" or "LIST_STYLES" or "LIST_Validations" , an empty list will be registered by default
        // this.LIST_CONFIGS = []
        // this.LIST_STYLES_UNIT = []
        this.LIST_STYLES = ['FontSize', 'Color', 'Background', 'TextAlign'] // For Loading Styles
        this.Style.__Load_Styles()
        if (TypeCreate == 'Config') {
            this.ControllMenuSettings_Open_Close(this, this.Node, 'Click')
            this.ActivePage(this)
            this.AppendItemSliderPage()
            this.RemoveINSTANCE = function () {
                LEN_PAGES -= 1
                this.STATUS = 'DELETED'
                this.Node.remove()
                this.ItemSliderPage.remove()

                // Remove All Child
                for (let Class of this.ElementsCLASS) {
                    Class.STATUS = 'DELETED'
                }

                // Active Other Page
                function SetActiveLastPage() {
                    let INSTANCE = undefined
                    let List_Pages = [...LIST_PAGES_CLASS].reverse()
                    for (let Page of List_Pages) {
                        if (Page.STATUS == 'OK') {
                            INSTANCE = Page
                            break
                        }
                    }
                    if (INSTANCE) {
                        INSTANCE.ActivePage(INSTANCE)
                    }
                }

                SetActiveLastPage()
            }
        } else if (TypeCreate == 'Record') {
            ContainerPage = this.Node
        }
    }

    Customize_Styles() {
        this.Style.StyleSettings.Background = '#ffffff'
    }

    Styles_Initial() {
        this.Config.__INFOELEMENT_Initial()
        CreateTitleSectionStylesSettings('تنظمیات ظاهری', 'far fa-pen-nib')
        this.Style.FONTSIZE_Initial()
        this.Style.COLOR_Initial()
        this.Style.BACKGROUND_Initial()
        CreateTitleSectionStylesSettings('تنظیمات مکانی', 'far fa-arrows')
        this.Style.TEXTALIGN_Initial(false)
        CreateTitleSectionStylesSettings('تنظیمات پیشرفته :', 'far fa-files-medical')
        this.Style.CLASSNAME_Initial()
        this.Style.CLASSNAMEPARENT_Initial()
        this.Style.STYLEADVANCE_Initial()
    }

    Initial_Settings() {
        if (TYPECREATEMODELS == 'Config') {
            this.Styles_Initial()
        }
    }

    NodeElement() {
        let Container = document.createElement('div')
        Container.setAttribute('IndexPage', LIST_PAGES.length) // Set Index Page in List Pages Instead Attribute
        Container.id = `PageForm_${this.COUNTER_ID_PAGE}`
        Container.classList.add('PAGE_FORM')
        Container.classList.add('carousel-item')
        ContainerForm.append(Container)
        return Container
    }

    SetCounterNumberPage() {
        let Node = `
            <p class="CounterNumberPage">${this.COUNTER_ID_PAGE}</p>
        `
        this.Node.innerHTML = Node
    }

    DisabledAllPageInSlider() {
        let Pages = document.querySelectorAll('.PAGE_FORM')
        for (let Page of Pages) {
            Page.classList.remove('active')
        }
        let ItemsSliderPage = document.querySelectorAll('[ItemsSliderPage]')
        for (let Item of ItemsSliderPage) {
            Item.classList.remove('active')
        }
    }

    AppendPage() {
        LIST_PAGES.push(this.Node)
        LIST_PAGES_CLASS.push(this)
        return LIST_PAGES.length - 1
    }

    ActivePage(This) {
        // 'This' is 'this' or Instance Class : 'this' Refrenced To Function Event So We Use 'This' be Refrenced Instance
        setTimeout(function () {
            This.DisabledAllPageInSlider()
            This.Node.classList.add('active')
            if (This.ItemSliderPage) {
                This.ItemSliderPage.classList.add('active')
            }
        })
        ContainerPage = This.Node
        ControlSettingsMenu_For_Element('Close')
    }

    AppendItemSliderPage() {
        let Li = document.createElement('li')
        Li.setAttribute('data-target', '#ContainerBox')
        Li.setAttribute('ItemsSliderPage', '')
        Li.setAttribute('data-slide-to', this.COUNTER_ID_PAGE - 1)
        Li.classList.add('active')
        let ActivePage = this.ActivePage
        let This = this
        Li.addEventListener('click', function () {
            ActivePage(This)
        })
        Slider_Pages_Items.append(Li)
        this.ItemSliderPage = Li
    }

}

class InputBase extends ElementBase {
    constructor(Type, ClassContainer_SET, OnlyCreate) {
        super(Type)
        LIST_INSTANCE_INPUT.push(this)
        this.ClassContainer_SET = ClassContainer_SET // if ClassContainer_SET is null , Element Append To Container Page Active
        this.Validation = new ValidationBase(this)
        this.DICT_VALIDATION = {}
    }

    NodeElement() {
        let Container = document.createElement('div')
        Container.setAttribute('IndexElement', INSTANCES_ELEMENTS.length)
        Container.id = `CONTAINER_INPUT_${this.id}`
        Container.className = 'CONTAINER_INPUT_BASE'
        Container.appendChild(this.ELEMENT)
        this.ELEMENT.setAttribute('IndexElementInListInput', LIST_INSTANCE_INPUT.length - 1)
        this.CONTAINER_INPUT = Container
        return Container
    }

}

class INPUT_CHAR extends InputBase {
    constructor(ClassContainer_SET = null, OnlyCreate) {
        super('INPUT_CHAR', ClassContainer_SET, OnlyCreate);
        this.Type_Text = 'اینپوت متن کوتاه'
        this.ELEMENT = this.NodeInput()
        this.Node = this.NodeElement()
        this.IndexInForm = this.AppendELEMENT()

        this.LIST_CONFIGS = ['Value', 'Placeholder'] // For Loading Configs
        this.LIST_VALIDATIONS = ['LanguageChar', 'LenChar_Bigger', 'LenChar_Less'] // For Loading Validations
        this.LIST_STYLES_UNIT = ['Width_Unit', 'Height_Unit', 'MarginTop_Unit', 'MarginBottom_Unit', 'MarginLeft_Unit', 'MarginRight_Unit'] // For Loading Unit Styles
        this.LIST_STYLES = ['Width', 'Height', 'FontSize', 'Color', 'Background', 'Display', 'TextAlign', 'TranslateY', 'TranslateX', 'MarginTop', 'MarginBottom', 'MarginLeft', 'MarginRight',
            'ClassName', 'ClassNameParent', 'StyleAdvance'
        ] // For Loading Styles
        this.Style.__Load_Styles()
        this.Config.__Load_Config()
        this.ControllMenuSettings_Open_Close(this, this.ELEMENT, 'Click')
    }

    Config_Initial() {
        this.Config.__INFOELEMENT_Initial()
        CreateTitleSectionStylesSettings('تنظمیات کلی', 'far fa-wrench')
        this.Config.Btns_Element_Initial()
        this.Config.VALUE_Initial()
        this.Config.PLACEHOLDER_Initial()
    }

    Validation_Initial() {
        CreateTitleSectionStylesSettings('اعتبار سنجی', 'far fa-check')
        this.Validation.LANGUAGECHAR_Initial()
        this.Validation.LENCHAR_Initial()
    }

    Styles_Initial() {
        CreateTitleSectionStylesSettings('تنظمیات ظاهری', 'far fa-pen-nib')
        this.Style.WIDTH_Initial()
        this.Style.Height_Initial()
        this.Style.FONTSIZE_Initial()
        this.Style.COLOR_Initial()
        this.Style.BACKGROUND_Initial()
        CreateTitleSectionStylesSettings('تنظیمات مکانی', 'far fa-arrows')
        this.Style.DISPLAY_Initial()
        this.Style.TEXTALIGN_Initial()
        this.Style.TRANSLATEY_Initial()
        this.Style.TRANSLATEX_Initial()
        this.Style.MARGINTOP_Initial()
        this.Style.MARGINBOTTOM_Initial()
        this.Style.MARGINRIGHT_Initial()
        this.Style.MARGINLEFT_Initial()
        CreateTitleSectionStylesSettings('تنظیمات پیشرفته :', 'far fa-files-medical')
        this.Style.CLASSNAME_Initial()
        this.Style.CLASSNAMEPARENT_Initial()
        this.Style.STYLEADVANCE_Initial()
    }

    Initial_Settings() {
        if (TYPECREATEMODELS == 'Config') {
            this.Config_Initial()
            this.Validation_Initial()
            this.Styles_Initial()
        }
    }

    NodeInput() {
        let __INPUT = document.createElement('input')
        __INPUT.readOnly = true
        __INPUT.id = `INPUT_${this.id}`
        __INPUT.type = 'text'
        __INPUT.classList.add('INPUT_BASE')
        __INPUT.classList.add('INPUT_CHAR')
        this._INPUT = __INPUT
        return __INPUT
    }
}

class INPUT_TEXTAREA extends InputBase {
    constructor(ClassContainer_SET = null, OnlyCreate) {
        super('INPUT_TEXTAREA', ClassContainer_SET, OnlyCreate);
        this.Type_Text = 'اینپوت متن بزرگ'
        this.ELEMENT = this.NodeInput()
        this.Node = this.NodeElement()
        this.IndexInForm = this.AppendELEMENT()
        this.ControllMenuSettings_Open_Close(this, this.ELEMENT, 'Click')
        // Customize Styles
        this.Customize_Styles()

        this.LIST_CONFIGS = ['Value', 'Placeholder'] // For Loading Configs
        this.LIST_VALIDATIONS = ['LanguageChar', 'LenChar_Bigger', 'LenChar_Less'] // For Loading Validations
        this.LIST_STYLES_UNIT = ['Width_Unit', 'Height_Unit', 'MarginTop_Unit', 'MarginBottom_Unit', 'MarginLeft_Unit', 'MarginRight_Unit'] // For Loading Unit Styles
        this.LIST_STYLES = ['Width', 'Height', 'FontSize', 'Color', 'Background', 'Display', 'TextAlign', 'TranslateY', 'TranslateX', 'MarginTop', 'MarginBottom', 'MarginLeft', 'MarginRight',
            'ClassName', 'ClassNameParent', 'StyleAdvance'
        ] // For Loading Styles
        this.Style.__Load_Styles()
        this.Config.__Load_Config()
    }

    Config_Initial() {
        this.Config.__INFOELEMENT_Initial()
        CreateTitleSectionStylesSettings('تنظمیات کلی', 'far fa-wrench')
        this.Config.Btns_Element_Initial()
        this.Config.VALUE_Initial()
        this.Config.PLACEHOLDER_Initial()
    }

    Validation_Initial() {
        CreateTitleSectionStylesSettings('اعتبار سنجی', 'far fa-check')
        this.Validation.LANGUAGECHAR_Initial()
        this.Validation.LENCHAR_Initial()
    }

    Customize_Styles() {
        this.Style.StyleSettings.Width = '400'
        this.Style.StyleSettings.Height = '100'
    }

    Styles_Initial() {
        CreateTitleSectionStylesSettings('تنظمیات ظاهری', 'far fa-pen-nib')
        this.Style.WIDTH_Initial()
        this.Style.Height_Initial()
        this.Style.FONTSIZE_Initial()
        this.Style.COLOR_Initial()
        this.Style.BACKGROUND_Initial()
        CreateTitleSectionStylesSettings('تنظیمات مکانی', 'far fa-arrows')
        this.Style.DISPLAY_Initial()
        this.Style.TEXTALIGN_Initial()
        this.Style.TRANSLATEY_Initial()
        this.Style.TRANSLATEX_Initial()
        this.Style.MARGINTOP_Initial()
        this.Style.MARGINBOTTOM_Initial()
        this.Style.MARGINRIGHT_Initial()
        this.Style.MARGINLEFT_Initial()
        CreateTitleSectionStylesSettings('تنظیمات پیشرفته :', 'far fa-files-medical')
        this.Style.CLASSNAME_Initial()
        this.Style.CLASSNAMEPARENT_Initial()
        this.Style.STYLEADVANCE_Initial()
    }

    Initial_Settings() {
        if (TYPECREATEMODELS == 'Config') {
            this.Config_Initial()
            this.Validation_Initial()
            this.Styles_Initial()
        }
    }

    NodeInput() {
        let __INPUT = document.createElement('textarea')
        __INPUT.readOnly = true
        __INPUT.id = `INPUT_${this.id}`
        __INPUT.classList.add('INPUT_BASE')
        __INPUT.classList.add('INPUT_TEXTAREA')
        this._INPUT = __INPUT
        return __INPUT
    }
}

class INPUT_NUMBER extends InputBase {
    constructor(ClassContainer_SET = null, OnlyCreate) {
        super('INPUT_NUMBER', ClassContainer_SET, OnlyCreate);
        this.Type_Text = 'اینپوت عدد'
        this.ELEMENT = this.NodeInput()
        this.Node = this.NodeElement()
        this.IndexInForm = this.AppendELEMENT()
        this.ControllMenuSettings_Open_Close(this, this.ELEMENT, 'Click')

        this.LIST_CONFIGS = ['Value', 'Placeholder'] // For Loading Configs
        this.LIST_VALIDATIONS = ['LenNumber_Bigger', 'LenNumber_Less', 'LenChar_Bigger', 'LenChar_Less'] // For Loading Validations
        this.LIST_STYLES_UNIT = ['Width_Unit', 'Height_Unit', 'MarginTop_Unit', 'MarginBottom_Unit', 'MarginLeft_Unit', 'MarginRight_Unit'] // For Loading Unit Styles
        this.LIST_STYLES = ['Width', 'Height', 'FontSize', 'Color', 'Background', 'Display', 'TextAlign', 'TranslateY', 'TranslateX', 'MarginTop', 'MarginBottom', 'MarginLeft', 'MarginRight',
            'ClassName', 'ClassNameParent', 'StyleAdvance'
        ] // For Loading Styles
        this.Style.__Load_Styles()
        this.Config.__Load_Config()
    }


    Config_Initial() {
        this.Config.__INFOELEMENT_Initial()
        CreateTitleSectionStylesSettings('تنظمیات کلی', 'far fa-wrench')
        this.Config.Btns_Element_Initial()
        this.Config.VALUE_Initial('number')
        this.Config.PLACEHOLDER_Initial()
    }

    Validation_Initial() {
        CreateTitleSectionStylesSettings('اعتبار سنجی', 'far fa-check')
        this.Validation.LENNUMBER_Initial()
        this.Validation.LENCHAR_Initial()
    }

    Styles_Initial() {
        CreateTitleSectionStylesSettings('تنظمیات ظاهری', 'far fa-pen-nib')
        this.Style.WIDTH_Initial()
        this.Style.Height_Initial()
        this.Style.FONTSIZE_Initial()
        this.Style.COLOR_Initial()
        this.Style.BACKGROUND_Initial()
        CreateTitleSectionStylesSettings('تنظیمات مکانی', 'far fa-arrows')
        this.Style.DISPLAY_Initial()
        this.Style.TEXTALIGN_Initial()
        this.Style.TRANSLATEY_Initial()
        this.Style.TRANSLATEX_Initial()
        this.Style.MARGINTOP_Initial()
        this.Style.MARGINBOTTOM_Initial()
        this.Style.MARGINRIGHT_Initial()
        this.Style.MARGINLEFT_Initial()
        CreateTitleSectionStylesSettings('تنظیمات پیشرفته :', 'far fa-files-medical')
        this.Style.CLASSNAME_Initial()
        this.Style.CLASSNAMEPARENT_Initial()
        this.Style.STYLEADVANCE_Initial()
    }

    Initial_Settings() {
        if (TYPECREATEMODELS == 'Config') {
            this.Config_Initial()
            this.Validation_Initial()
            this.Styles_Initial()
        }
    }

    NodeInput() {
        let __INPUT = document.createElement('input')
        __INPUT.readOnly = true
        __INPUT.id = `INPUT_${this.id}`
        __INPUT.type = 'number'
        __INPUT.classList.add('INPUT_BASE')
        __INPUT.classList.add('INPUT_NUMBER')
        this._INPUT = __INPUT
        return __INPUT
    }
}

class INPUT_EMAIL extends InputBase {
    constructor(ClassContainer_SET = null, OnlyCreate) {
        super('INPUT_EMAIL', ClassContainer_SET, OnlyCreate);
        this.Type_Text = 'اینپوت ایمیل'
        this.ELEMENT = this.NodeInput()
        this.Node = this.NodeElement()
        this.IndexInForm = this.AppendELEMENT()
        this.ControllMenuSettings_Open_Close(this, this.ELEMENT, 'Click')

        this.LIST_CONFIGS = ['Value', 'Placeholder'] // For Loading Configs
        this.LIST_VALIDATIONS = ['LenChar_Bigger', 'LenChar_Less'] // For Loading Validations
        this.LIST_STYLES_UNIT = ['Width_Unit', 'Height_Unit', 'MarginTop_Unit', 'MarginBottom_Unit', 'MarginLeft_Unit', 'MarginRight_Unit'] // For Loading Unit Styles
        this.LIST_STYLES = ['Width', 'Height', 'FontSize', 'Color', 'Background', 'Display', 'TextAlign', 'TranslateY', 'TranslateX', 'MarginTop', 'MarginBottom', 'MarginLeft', 'MarginRight',
            'ClassName', 'ClassNameParent', 'StyleAdvance'
        ] // For Loading Styles
        this.Style.__Load_Styles()
        this.Config.__Load_Config()
    }

    Config_Initial() {
        this.Config.__INFOELEMENT_Initial()
        CreateTitleSectionStylesSettings('تنظمیات کلی', 'far fa-wrench')
        this.Config.Btns_Element_Initial()
        this.Config.VALUE_Initial('email')
        this.Config.PLACEHOLDER_Initial()
    }

    Validation_Initial() {
        CreateTitleSectionStylesSettings('اعتبار سنجی', 'far fa-check')
        this.Validation.LENCHAR_Initial()
    }

    Styles_Initial() {
        CreateTitleSectionStylesSettings('تنظمیات ظاهری', 'far fa-pen-nib')
        this.Style.WIDTH_Initial()
        this.Style.Height_Initial()
        this.Style.FONTSIZE_Initial()
        this.Style.COLOR_Initial()
        this.Style.BACKGROUND_Initial()
        CreateTitleSectionStylesSettings('تنظیمات مکانی', 'far fa-arrows')
        this.Style.DISPLAY_Initial()
        this.Style.TEXTALIGN_Initial()
        this.Style.TRANSLATEY_Initial()
        this.Style.TRANSLATEX_Initial()
        this.Style.MARGINTOP_Initial()
        this.Style.MARGINBOTTOM_Initial()
        this.Style.MARGINRIGHT_Initial()
        this.Style.MARGINLEFT_Initial()
        CreateTitleSectionStylesSettings('تنظیمات پیشرفته :', 'far fa-files-medical')
        this.Style.CLASSNAME_Initial()
        this.Style.CLASSNAMEPARENT_Initial()
        this.Style.STYLEADVANCE_Initial()
    }

    Initial_Settings() {
        if (TYPECREATEMODELS == 'Config') {
            this.Config_Initial()
            this.Validation_Initial()
            this.Styles_Initial()
        }
    }

    NodeInput() {
        let __INPUT = document.createElement('input')
        __INPUT.readOnly = true
        __INPUT.id = `INPUT_${this.id}`
        __INPUT.type = 'email'
        __INPUT.classList.add('INPUT_BASE')
        __INPUT.classList.add('INPUT_EMAIL')
        this._INPUT = __INPUT
        return __INPUT
    }
}

class INPUT_PASSWORD extends InputBase {
    constructor(ClassContainer_SET = null, OnlyCreate) {
        super('INPUT_PASSWORD', ClassContainer_SET, OnlyCreate);
        this.Type_Text = 'اینپوت رمز'
        this.ELEMENT = this.NodeInput()
        this.Node = this.NodeElement()
        this.IndexInForm = this.AppendELEMENT()
        this.ControllMenuSettings_Open_Close(this, this.ELEMENT, 'Click')

        this.LIST_CONFIGS = ['Value', 'Placeholder'] // For Loading Configs
        this.LIST_VALIDATIONS = ['LanguageChar', 'LenChar_Bigger', 'LenChar_Less'] // For Loading Validations
        this.LIST_STYLES_UNIT = ['Width_Unit', 'Height_Unit', 'MarginTop_Unit', 'MarginBottom_Unit', 'MarginLeft_Unit', 'MarginRight_Unit'] // For Loading Unit Styles
        this.LIST_STYLES = ['Width', 'Height', 'FontSize', 'Color', 'Background', 'Display', 'TextAlign', 'TranslateY', 'TranslateX', 'MarginTop', 'MarginBottom', 'MarginLeft', 'MarginRight',
            'ClassName', 'ClassNameParent', 'StyleAdvance'
        ] // For Loading Styles
        this.Style.__Load_Styles()
        this.Config.__Load_Config()
    }


    Config_Initial() {
        this.Config.__INFOELEMENT_Initial()
        CreateTitleSectionStylesSettings('تنظمیات کلی', 'far fa-wrench')
        this.Config.Btns_Element_Initial()
        this.Config.VALUE_Initial()
        this.Config.PLACEHOLDER_Initial()
    }

    Validation_Initial() {
        CreateTitleSectionStylesSettings('اعتبار سنجی', 'far fa-check')
        this.Validation.LANGUAGECHAR_Initial()
        this.Validation.LENCHAR_Initial()
    }

    Styles_Initial() {
        CreateTitleSectionStylesSettings('تنظمیات ظاهری', 'far fa-pen-nib')
        this.Style.WIDTH_Initial()
        this.Style.Height_Initial()
        this.Style.FONTSIZE_Initial()
        this.Style.COLOR_Initial()
        this.Style.BACKGROUND_Initial()
        CreateTitleSectionStylesSettings('تنظیمات مکانی', 'far fa-arrows')
        this.Style.DISPLAY_Initial()
        this.Style.TEXTALIGN_Initial()
        this.Style.TRANSLATEY_Initial()
        this.Style.TRANSLATEX_Initial()
        this.Style.MARGINTOP_Initial()
        this.Style.MARGINBOTTOM_Initial()
        this.Style.MARGINRIGHT_Initial()
        this.Style.MARGINLEFT_Initial()
        CreateTitleSectionStylesSettings('تنظیمات پیشرفته :', 'far fa-files-medical')
        this.Style.CLASSNAME_Initial()
        this.Style.CLASSNAMEPARENT_Initial()
        this.Style.STYLEADVANCE_Initial()
    }

    Initial_Settings() {
        if (TYPECREATEMODELS == 'Config') {
            this.Config_Initial()
            this.Validation_Initial()
            this.Styles_Initial()
        }
    }

    NodeInput() {
        let __INPUT = document.createElement('input')
        __INPUT.readOnly = true
        __INPUT.id = `INPUT_${this.id}`
        __INPUT.type = 'password'
        __INPUT.classList.add('INPUT_BASE')
        __INPUT.classList.add('INPUT_PASSWORD')
        this._INPUT = __INPUT
        return __INPUT
    }
}

class INPUT_TIME extends InputBase {
    constructor(ClassContainer_SET = null, OnlyCreate) {
        super('INPUT_TIME', ClassContainer_SET, OnlyCreate);
        this.Type_Text = 'اینپوت زمان'
        this.ELEMENT = this.NodeInput()
        this.Node = this.NodeElement()
        this.IndexInForm = this.AppendELEMENT()
        this.ControllMenuSettings_Open_Close(this, this.ELEMENT, 'Click')

        this.LIST_CONFIGS = ['ValueTime'] // For Loading Configs
        this.LIST_VALIDATIONS = ['TimeSpan_Bigger', 'TimeSpan_Less'] // For Loading Validations
        this.LIST_STYLES_UNIT = ['Width_Unit', 'Height_Unit', 'MarginTop_Unit', 'MarginBottom_Unit', 'MarginLeft_Unit', 'MarginRight_Unit'] // For Loading Unit Styles
        this.LIST_STYLES = ['Width', 'Height', 'FontSize', 'Color', 'Background', 'Display', 'TextAlign', 'TranslateY', 'TranslateX', 'MarginTop', 'MarginBottom', 'MarginLeft', 'MarginRight',
            'ClassName', 'ClassNameParent', 'StyleAdvance'
        ] // For Loading Styles
        this.Style.__Load_Styles()
        this.Config.__Load_Config()
    }

    Config_Initial() {
        this.Config.__INFOELEMENT_Initial()
        CreateTitleSectionStylesSettings('تنظمیات کلی', 'far fa-wrench')
        this.Config.Btns_Element_Initial()
        this.Config.VALUETIME_Initial()
    }

    Validation_Initial() {
        CreateTitleSectionStylesSettings('اعتبار سنجی', 'far fa-check')
        this.Validation.TIMESPAN_Initial()
    }

    Styles_Initial() {
        CreateTitleSectionStylesSettings('تنظمیات ظاهری', 'far fa-pen-nib')
        this.Style.WIDTH_Initial()
        this.Style.Height_Initial()
        this.Style.FONTSIZE_Initial()
        this.Style.COLOR_Initial()
        this.Style.BACKGROUND_Initial()
        CreateTitleSectionStylesSettings('تنظیمات مکانی', 'far fa-arrows')
        this.Style.DISPLAY_Initial()
        this.Style.TEXTALIGN_Initial()
        this.Style.TRANSLATEY_Initial()
        this.Style.TRANSLATEX_Initial()
        this.Style.MARGINTOP_Initial()
        this.Style.MARGINBOTTOM_Initial()
        this.Style.MARGINRIGHT_Initial()
        this.Style.MARGINLEFT_Initial()
        CreateTitleSectionStylesSettings('تنظیمات پیشرفته :', 'far fa-files-medical')
        this.Style.CLASSNAME_Initial()
        this.Style.CLASSNAMEPARENT_Initial()
        this.Style.STYLEADVANCE_Initial()
    }

    Initial_Settings() {
        if (TYPECREATEMODELS == 'Config') {
            this.Config_Initial()
            this.Validation_Initial()
            this.Styles_Initial()
        }
    }

    NodeInput() {
        let __INPUT = document.createElement('input')
        __INPUT.readOnly = true
        __INPUT.id = `INPUT_${this.id}`
        __INPUT.type = 'time'
        __INPUT.classList.add('INPUT_BASE')
        __INPUT.classList.add('INPUT_TIME')
        this._INPUT = __INPUT
        return __INPUT
    }
}

class INPUT_DATE extends InputBase {
    constructor(ClassContainer_SET = null, OnlyCreate) {
        super('INPUT_DATE', ClassContainer_SET, OnlyCreate);
        this.Type_Text = 'اینپوت تاریخ'
        this.ELEMENT = this.NodeInput()
        this.Node = this.NodeElement()
        this.IndexInForm = this.AppendELEMENT()
        this.ControllMenuSettings_Open_Close(this, this.ELEMENT, 'Click')

        this.LIST_CONFIGS = ['ValueDate'] // For Loading Configs
        this.LIST_VALIDATIONS = ['DateSpan_Bigger', 'DateSpan_Less'] // For Loading Validations
        this.LIST_STYLES_UNIT = ['Width_Unit', 'Height_Unit', 'MarginTop_Unit', 'MarginBottom_Unit', 'MarginLeft_Unit', 'MarginRight_Unit'] // For Loading Unit Styles
        this.LIST_STYLES = ['Width', 'Height', 'FontSize', 'Color', 'Background', 'Display', 'TextAlign', 'TranslateY', 'TranslateX', 'MarginTop', 'MarginBottom', 'MarginLeft', 'MarginRight',
            'ClassName', 'ClassNameParent', 'StyleAdvance'
        ] // For Loading Styles
        this.Style.__Load_Styles()
        this.Config.__Load_Config()
    }

    Config_Initial() {
        this.Config.__INFOELEMENT_Initial()
        CreateTitleSectionStylesSettings('تنظمیات کلی', 'far fa-wrench')
        this.Config.Btns_Element_Initial()
        this.Config.VALUEDATE_Initial()
    }

    Validation_Initial() {
        CreateTitleSectionStylesSettings('اعتبار سنجی', 'far fa-check')
        this.Validation.DATESPAN_Initial()
    }

    Styles_Initial() {
        CreateTitleSectionStylesSettings('تنظمیات ظاهری', 'far fa-pen-nib')
        this.Style.WIDTH_Initial()
        this.Style.Height_Initial()
        this.Style.FONTSIZE_Initial()
        this.Style.COLOR_Initial()
        this.Style.BACKGROUND_Initial()
        CreateTitleSectionStylesSettings('تنظیمات مکانی', 'far fa-arrows')
        this.Style.DISPLAY_Initial()
        this.Style.TEXTALIGN_Initial()
        this.Style.TRANSLATEY_Initial()
        this.Style.TRANSLATEX_Initial()
        this.Style.MARGINTOP_Initial()
        this.Style.MARGINBOTTOM_Initial()
        this.Style.MARGINRIGHT_Initial()
        this.Style.MARGINLEFT_Initial()
        CreateTitleSectionStylesSettings('تنظیمات پیشرفته :', 'far fa-files-medical')
        this.Style.CLASSNAME_Initial()
        this.Style.CLASSNAMEPARENT_Initial()
        this.Style.STYLEADVANCE_Initial()
    }

    Initial_Settings() {
        if (TYPECREATEMODELS == 'Config') {
            this.Config_Initial()
            this.Validation_Initial()
            this.Styles_Initial()
        }
    }

    NodeInput() {
        let __INPUT = document.createElement('input')
        __INPUT.readOnly = true
        __INPUT.id = `INPUT_${this.id}`
        __INPUT.type = 'date'
        __INPUT.classList.add('INPUT_BASE')
        __INPUT.classList.add('INPUT_DATE')
        this._INPUT = __INPUT
        return __INPUT
    }
}

class INPUT_CHECKBOX extends InputBase {
    constructor(ClassContainer_SET = null, OnlyCreate) {
        super('INPUT_CHECKBOX', ClassContainer_SET, OnlyCreate);
        this.Type_Text = 'اینپوت چک باکس'
        this.ELEMENT = this.NodeInput()
        this.Node = this.NodeElement()
        this.InputCheckBox = this.ELEMENT
        this.ELEMENT = this.Node
        this.IndexInForm = this.AppendELEMENT()
        this.ControllMenuSettings_Open_Close(this, this.ELEMENT, 'Click')


        this.LIST_CONFIGS = ['ValueCheckBox'] // For Loading Configs
        this.LIST_VALIDATIONS = [] // For Loading Validations
        this.LIST_STYLES_UNIT = ['Width_Unit', 'Height_Unit', 'MarginTop_Unit', 'MarginBottom_Unit', 'MarginLeft_Unit', 'MarginRight_Unit'] // For Loading Unit Styles
        this.LIST_STYLES = ['Width', 'Height', 'FontSize', 'Color', 'Background', 'Display', 'TextAlign', 'TranslateY', 'TranslateX', 'MarginTop', 'MarginBottom', 'MarginLeft', 'MarginRight',
            'ClassName', 'ClassNameParent', 'StyleAdvance'
        ] // For Loading Styles
        this.Style.__Load_Styles()
        this.Config.__Load_Config()

        this.Config.Create_TextElement = function (Val, Instance) {
            let Text = new TAG_P(null, true)
            Val = Val == '' ? 'متن' : Val
            Text.Config.ConfigSettings.TypeTag = 'Tag_P_Text'
            Instance.ELementsCLASS_Text.push(Text)
            Instance.ElementsCLASS_Secondary.push(Text)
            Text.Style.StyleSettings.Display = 'Inline-Block'
            Text.Style.StyleSettings.Background = '#ffffff'
            Text.innerHTML = Val
            Text.Config.ConfigSettings.InnerHTML = Val
            Text.Style.__Load_Styles()
            Text.Config.__Load_Config()
            Text.Initial_Settings()
            Instance.CONTAINER_INPUT.append(Text.ELEMENT)
            Instance.Style.__Load_Styles()
            return Text
        }
    }

    Config_Initial() {
        this.Config.__INFOELEMENT_Initial()
        CreateTitleSectionStylesSettings('تنظمیات کلی', 'far fa-wrench')
        this.Config.Btns_Element_Initial()
        this.Config.VALUECHECKBOX_Initial()
    }

    Styles_Initial() {
        CreateTitleSectionStylesSettings('تنظمیات ظاهری', 'far fa-pen-nib')
        this.Style.WIDTH_Initial()
        this.Style.Height_Initial()
        this.Style.FONTSIZE_Initial()
        this.Style.COLOR_Initial()
        this.Style.BACKGROUND_Initial()
        CreateTitleSectionStylesSettings('تنظیمات مکانی', 'far fa-arrows')
        this.Style.DISPLAY_Initial()
        this.Style.TEXTALIGN_Initial()
        this.Style.TRANSLATEY_Initial()
        this.Style.TRANSLATEX_Initial()
        this.Style.MARGINTOP_Initial()
        this.Style.MARGINBOTTOM_Initial()
        this.Style.MARGINRIGHT_Initial()
        this.Style.MARGINLEFT_Initial()
        CreateTitleSectionStylesSettings('تنظیمات پیشرفته :', 'far fa-files-medical')
        this.Style.CLASSNAME_Initial()
        this.Style.CLASSNAMEPARENT_Initial()
        this.Style.STYLEADVANCE_Initial()
    }

    Initial_Settings() {
        if (TYPECREATEMODELS == 'Config') {
            this.Config_Initial()
            this.Styles_Initial()
        }
    }

    NodeInput() {
        let __INPUT = document.createElement('input')
        __INPUT.readOnly = true
        __INPUT.disabled = true
        __INPUT.id = `INPUT_${this.id}`
        __INPUT.type = 'checkbox'
        __INPUT.classList.add('INPUT_BASE')
        __INPUT.classList.add('INPUT_CHECKBOX')
        this._INPUT = __INPUT
        return __INPUT
    }

    NodeElement() {
        let Container = document.createElement('div')
        Container.setAttribute('IndexElement', INSTANCES_ELEMENTS.length)
        Container.id = `CONTAINER_INPUT_${this.id}`
        Container.className = 'CONTAINER_INPUT_BASE CONTAINER_INPUT_CHECKBOX'
        Container.appendChild(this.ELEMENT)
        this.ELEMENT.setAttribute('IndexElementInListInput', LIST_INSTANCE_INPUT.length - 1)
        this.CONTAINER_INPUT = Container
        return Container
    }

    AppendELEMENT() {
        if (!this.OnlyCreate) {
            if (this.ClassContainer_SET) {
                let ClassContainer = this.ClassContainer_SET
                let Container = ClassContainer.ELEMENT
                this.InputCheckBox.name = `INPUT_CHECKBOX_${ClassContainer.id}`
                Container.append(this.Node)
                ClassContainer.Elements.push(this.Node)
                ClassContainer.ElementsCLASS.push(this)
            } else {
                let IndexContainerPage = ContainerPage.getAttribute('IndexPage')
                this.ContainerPage = LIST_PAGES_CLASS[IndexContainerPage] // Class Element
                ContainerPage.appendChild(this.Node) // Node Element
                this.ContainerPage.Elements.push(this.Node)
                this.ContainerPage.ElementsCLASS.push(this)
                this.IndexInElementsPage = this.ContainerPage.Elements.length - 1
            }
        }
        LIST_ELEMENTS_FORM.push(this.Node)
        return LIST_ELEMENTS_FORM.length - 1
    }
}

class INPUT_RADIO extends InputBase {
    constructor(ClassContainer_SET = null, OnlyCreate) {
        super('INPUT_RADIO', ClassContainer_SET, OnlyCreate);
        this.Type_Text = 'اینپوت رادیویی'
        this.ELEMENT = this.NodeInput()
        this.Node = this.NodeElement()
        this.InputRadio = this.ELEMENT
        this.ELEMENT = this.Node
        this.IndexInForm = this.AppendELEMENT()
        this.ControllMenuSettings_Open_Close(this, this.ELEMENT, 'Click')

        this.LIST_CONFIGS = ['ValueRadio'] // For Loading Configs
        this.LIST_VALIDATIONS = [] // For Loading Validations
        this.LIST_STYLES_UNIT = ['Width_Unit', 'Height_Unit', 'MarginTop_Unit', 'MarginBottom_Unit', 'MarginLeft_Unit', 'MarginRight_Unit'] // For Loading Unit Styles
        this.LIST_STYLES = ['Width', 'Height', 'FontSize', 'Color', 'Background', 'Display', 'TextAlign', 'TranslateY', 'TranslateX', 'MarginTop', 'MarginBottom', 'MarginLeft', 'MarginRight',
            'ClassName', 'ClassNameParent', 'StyleAdvance'
        ] // For Loading Styles
        this.Style.__Load_Styles()
        this.Config.__Load_Config()

        this.Config.Create_TextElement = function (Val, Instance, OpenSettings) {
            let Text = new TAG_P(null, true)
            Val = Val == '' ? 'متن' : Val
            Instance.ELementsCLASS_Text.push(Text)
            Text.Config.ConfigSettings.TypeTag = 'Tag_P_Text'
            Instance.ElementsCLASS_Secondary.push(Text)
            Text.Style.StyleSettings.Display = 'Inline-Block'
            Text.Style.StyleSettings.Background = '#ffffff'
            Text.innerHTML = Val
            Text.Config.ConfigSettings.InnerHTML = Val
            Text.Style.__Load_Styles()
            Text.Config.__Load_Config()
            Text.Initial_Settings()
            Instance.CONTAINER_INPUT.append(Text.ELEMENT)
            Instance.Style.__Load_Styles()
            return Text
        }

    }

    Config_Initial() {
        this.Config.__INFOELEMENT_Initial()
        CreateTitleSectionStylesSettings('تنظمیات کلی', 'far fa-wrench')
        this.Config.Btns_Element_Initial()
        this.Config.VALUERADIO_Initial()
    }

    Styles_Initial() {
        CreateTitleSectionStylesSettings('تنظمیات ظاهری', 'far fa-pen-nib')
        this.Style.WIDTH_Initial()
        this.Style.Height_Initial()
        this.Style.FONTSIZE_Initial()
        this.Style.COLOR_Initial()
        this.Style.BACKGROUND_Initial()
        CreateTitleSectionStylesSettings('تنظیمات مکانی', 'far fa-arrows')
        this.Style.DISPLAY_Initial()
        this.Style.TEXTALIGN_Initial()
        this.Style.TRANSLATEY_Initial()
        this.Style.TRANSLATEX_Initial()
        this.Style.MARGINTOP_Initial()
        this.Style.MARGINBOTTOM_Initial()
        this.Style.MARGINRIGHT_Initial()
        this.Style.MARGINLEFT_Initial()
        CreateTitleSectionStylesSettings('تنظیمات پیشرفته :', 'far fa-files-medical')
        this.Style.CLASSNAME_Initial()
        this.Style.CLASSNAMEPARENT_Initial()
        this.Style.STYLEADVANCE_Initial()
    }

    Initial_Settings() {
        if (TYPECREATEMODELS == 'Config') {
            this.Config_Initial()
            this.Styles_Initial()
        }
    }

    NodeInput() {
        let __INPUT = document.createElement('input')
        __INPUT.readOnly = true
        __INPUT.disabled = true
        __INPUT.id = `INPUT_${this.id}`
        __INPUT.type = 'radio'
        __INPUT.classList.add('INPUT_BASE')
        __INPUT.classList.add('INPUT_RADIO')
        this._INPUT = __INPUT
        return __INPUT
    }

    NodeElement() {
        let Container = document.createElement('div')
        Container.setAttribute('IndexElement', INSTANCES_ELEMENTS.length)
        Container.id = `CONTAINER_INPUT_${this.id}`
        Container.className = 'CONTAINER_INPUT_BASE CONTAINER_INPUT_CHECKBOX' // "CONTAINER_INPUT_CHECKBOX" Also For Input Radio
        Container.appendChild(this.ELEMENT)
        this.ELEMENT.setAttribute('IndexElementInListInput', LIST_INSTANCE_INPUT.length - 1)
        this.CONTAINER_INPUT = Container
        return Container
    }

    AppendELEMENT() {
        if (!this.OnlyCreate) {
            if (this.ClassContainer_SET) {
                let ClassContainer = this.ClassContainer_SET
                let Container = ClassContainer.ELEMENT
                this.InputRadio.name = `INPUT_RADIO_${ClassContainer.id}`
                Container.append(this.Node)
                ClassContainer.Elements.push(this.Node)
                ClassContainer.ElementsCLASS.push(this)
            } else {
                let IndexContainerPage = ContainerPage.getAttribute('IndexPage')
                this.ContainerPage = LIST_PAGES_CLASS[IndexContainerPage] // Class Element
                ContainerPage.appendChild(this.Node) // Node Element
                this.ContainerPage.Elements.push(this.Node)
                this.ContainerPage.ElementsCLASS.push(this)
                this.IndexInElementsPage = this.ContainerPage.Elements.length - 1
            }
        }
        LIST_ELEMENTS_FORM.push(this.Node)
        return LIST_ELEMENTS_FORM.length - 1
    }
}

class INPUT_IMAGE extends InputBase {
    constructor(ClassContainer_SET = null, OnlyCreate) {
        super('INPUT_IMAGE', ClassContainer_SET, OnlyCreate);
        LIST_INSTANCE_INPUT_MEDIA.push(this)
        this.Type_Text = 'اینپوت عکس'
        this.ELEMENT = this.NodeInput()
        this.Node = this.NodeElement()
        this.INPUT_MEDIA = this.ELEMENT
        this.ELEMENT = this.Node
        this.IndexInForm = this.AppendELEMENT()
        this.ControllMenuSettings_Open_Close(this, this.ELEMENT, 'Click')

        this.Style.MarginRight(20)
        this.Style.MarginLeft(20)

        this.LIST_CONFIGS = [] // For Loading Configs
        this.LIST_VALIDATIONS = [] // For Loading Validations
        this.LIST_STYLES_UNIT = ['Width_Unit', 'Height_Unit', 'MarginTop_Unit', 'MarginBottom_Unit', 'MarginLeft_Unit', 'MarginRight_Unit'] // For Loading Unit Styles
        this.LIST_STYLES = ['Width', 'Height', 'FontSize', 'Color', 'Background', 'Display', 'TextAlign', 'TranslateY', 'TranslateX', 'MarginTop', 'MarginBottom', 'MarginLeft', 'MarginRight',
            'ClassName', 'ClassNameParent', 'StyleAdvance'
        ] // For Loading Styles


        this.Style.Width = function (Size) {
            let Unit = this.StyleSettings.Width_Unit
            if (Unit == 'px') {
                this.Instance.Node.style.width = 'auto'
                this.Instance.INPUT_MEDIA.style.width = Size + Unit
                this.StyleSettings.Width = Size
                this.ApppendStyle('Width', Size)
            } else if (Unit == '%') {
                //this.Instance.ELEMENT.style.width = '100%'
                this.Instance.INPUT_MEDIA.style.width = '95%'
                this.Instance.Node.style.width = Size + Unit
                this.StyleSettings.Width = Size
                this.ApppendStyle('Width', Size)
            } else if (Unit == 'auto') {
                //this.Instance.ELEMENT.style.width = '100%'
                this.Instance.INPUT_MEDIA.style.width = '95%'
                this.Instance.Node.style.width = 'auto'
                // this.StyleSettings.Height = 'auto'
                this.ApppendStyle('width', 'auto')
            }
        }


        this.Style.__Load_Styles()
        this.Config.__Load_Config()
    }


    Config_Initial() {
        this.Config.__INFOELEMENT_Initial()
        CreateTitleSectionStylesSettings('تنظمیات کلی', 'far fa-wrench')
        this.Config.Btns_Element_Initial()
    }

    Styles_Initial() {
        CreateTitleSectionStylesSettings('تنظمیات ظاهری', 'far fa-pen-nib')
        this.Style.WIDTH_Initial()
        this.Style.Height_Initial()
        this.Style.FONTSIZE_Initial()
        this.Style.COLOR_Initial()
        this.Style.BACKGROUND_Initial()
        CreateTitleSectionStylesSettings('تنظیمات مکانی', 'far fa-arrows')
        this.Style.DISPLAY_Initial()
        this.Style.TEXTALIGN_Initial()
        this.Style.TRANSLATEY_Initial()
        this.Style.TRANSLATEX_Initial()
        this.Style.MARGINTOP_Initial()
        this.Style.MARGINBOTTOM_Initial()
        this.Style.MARGINRIGHT_Initial()
        this.Style.MARGINLEFT_Initial()
        CreateTitleSectionStylesSettings('تنظیمات پیشرفته :', 'far fa-files-medical')
        this.Style.CLASSNAME_Initial()
        this.Style.CLASSNAMEPARENT_Initial()
        this.Style.STYLEADVANCE_Initial()
    }

    Initial_Settings() {
        if (TYPECREATEMODELS == 'Config') {
            this.Config_Initial()
            this.Styles_Initial()
        }
    }

    NodeInput() {
        let __INPUT = document.createElement('input')
        __INPUT.readOnly = true
        __INPUT.disabled = true
        __INPUT.id = `INPUT_${this.id}`
        __INPUT.type = 'file'
        __INPUT.accept = '.jpg , .png , .gif'
        __INPUT.classList.add('INPUT_BASE')
        __INPUT.classList.add('INPUT_FILE')
        this._INPUT = __INPUT
        return __INPUT
    }

    NodeElement() {
        let Container = document.createElement('div')
        Container.setAttribute('IndexElement', INSTANCES_ELEMENTS.length)
        Container.id = `CONTAINER_INPUT_${this.id}`
        Container.className = 'CONTAINER_INPUT_BASE CONTAINER_INPUT_FILE'
        Container.appendChild(this.ELEMENT)

        let Note = document.createElement('div')
        Note.classList.add('NOTE_INPUT_MEDIA')
        Note.classList.add('d-none')
        Note.innerHTML = `
            <i class="fa fa-exclamation-circle"></i>
            <p>حجم تصویر شما باید کمتر از 1 مگابایت باشد</p>
        `
        Container.append(Note)

        this.ELEMENT.setAttribute('IndexElementInListInput', LIST_INSTANCE_INPUT.length - 1)
        this.CONTAINER_INPUT = Container
        this.NOTE_INPUT_MEDIA = Note
        return Container
    }

    AppendELEMENT() {
        this.INPUT_MEDIA.name = `INPUT_IMAGE_${this.id}`
        if (!this.OnlyCreate) {
            if (this.ClassContainer_SET) {
                let ClassContainer = this.ClassContainer_SET
                let Container = ClassContainer.ELEMENT
                Container.append(this.Node)
                ClassContainer.Elements.push(this.Node)
                ClassContainer.ElementsCLASS.push(this)
            } else {
                let IndexContainerPage = ContainerPage.getAttribute('IndexPage')
                this.ContainerPage = LIST_PAGES_CLASS[IndexContainerPage] // Class Element
                ContainerPage.appendChild(this.Node) // Node Element
                this.ContainerPage.Elements.push(this.Node)
                this.ContainerPage.ElementsCLASS.push(this)
                this.IndexInElementsPage = this.ContainerPage.Elements.length - 1
            }
        }
        LIST_ELEMENTS_FORM.push(this.Node)
        return LIST_ELEMENTS_FORM.length - 1
    }
}

class INPUT_FILE extends InputBase {
    constructor(ClassContainer_SET = null, OnlyCreate) {
        super('INPUT_FILE', ClassContainer_SET, OnlyCreate);
        LIST_INSTANCE_INPUT_MEDIA.push(this)
        this.Type_Text = 'اینپوت فایل'
        this.ELEMENT = this.NodeInput()
        this.Node = this.NodeElement()
        this.INPUT_MEDIA = this.ELEMENT
        this.ELEMENT = this.Node
        this.IndexInForm = this.AppendELEMENT()
        this.ControllMenuSettings_Open_Close(this, this.ELEMENT, 'Click')

        this.Style.MarginRight(20)
        this.Style.MarginLeft(20)

        this.LIST_CONFIGS = [] // For Loading Configs
        this.LIST_VALIDATIONS = [] // For Loading Validations
        this.LIST_STYLES_UNIT = ['Width_Unit', 'Height_Unit', 'MarginTop_Unit', 'MarginBottom_Unit', 'MarginLeft_Unit', 'MarginRight_Unit'] // For Loading Unit Styles
        this.LIST_STYLES = ['Width', 'Height', 'FontSize', 'Color', 'Background', 'Display', 'TextAlign', 'TranslateY', 'TranslateX', 'MarginTop', 'MarginBottom', 'MarginLeft', 'MarginRight',
            'ClassName', 'ClassNameParent', 'StyleAdvance'
        ] // For Loading Styles

        this.Style.Width = function (Size) {
            let Unit = this.StyleSettings.Width_Unit
            if (Unit == 'px') {
                this.Instance.Node.style.width = 'auto'
                this.Instance.INPUT_MEDIA.style.width = Size + Unit
                this.StyleSettings.Width = Size
                this.ApppendStyle('Width', Size)
            } else if (Unit == '%') {
                //this.Instance.ELEMENT.style.width = '100%'
                this.Instance.INPUT_MEDIA.style.width = '95%'
                this.Instance.Node.style.width = Size + Unit
                this.StyleSettings.Width = Size
                this.ApppendStyle('Width', Size)
            } else if (Unit == 'auto') {
                //this.Instance.ELEMENT.style.width = '100%'
                this.Instance.INPUT_MEDIA.style.width = '95%'
                this.Instance.Node.style.width = 'auto'
                // this.StyleSettings.Height = 'auto'
                this.ApppendStyle('width', 'auto')
            }
        }

        this.Style.__Load_Styles()
        this.Config.__Load_Config()
    }

    Config_Initial() {
        this.Config.__INFOELEMENT_Initial()
        CreateTitleSectionStylesSettings('تنظمیات کلی', 'far fa-wrench')
        this.Config.Btns_Element_Initial()
    }

    Styles_Initial() {
        CreateTitleSectionStylesSettings('تنظمیات ظاهری', 'far fa-pen-nib')
        this.Style.WIDTH_Initial()
        this.Style.Height_Initial()
        this.Style.FONTSIZE_Initial()
        this.Style.COLOR_Initial()
        this.Style.BACKGROUND_Initial()
        CreateTitleSectionStylesSettings('تنظیمات مکانی', 'far fa-arrows')
        this.Style.DISPLAY_Initial()
        this.Style.TEXTALIGN_Initial()
        this.Style.TRANSLATEY_Initial()
        this.Style.TRANSLATEX_Initial()
        this.Style.MARGINTOP_Initial()
        this.Style.MARGINBOTTOM_Initial()
        this.Style.MARGINRIGHT_Initial()
        this.Style.MARGINLEFT_Initial()
        CreateTitleSectionStylesSettings('تنظیمات پیشرفته :', 'far fa-files-medical')
        this.Style.CLASSNAME_Initial()
        this.Style.CLASSNAMEPARENT_Initial()
        this.Style.STYLEADVANCE_Initial()
    }

    Initial_Settings() {
        if (TYPECREATEMODELS == 'Config') {
            this.Config_Initial()
            this.Styles_Initial()
        }
    }

    NodeInput() {
        let __INPUT = document.createElement('input')
        __INPUT.readOnly = true
        __INPUT.disabled = true
        __INPUT.id = `INPUT_${this.id}`
        __INPUT.type = 'file'
        __INPUT.accept = '.zip , .jpg , .png , .gif , .mp3 , .mp4'
        __INPUT.classList.add('INPUT_BASE')
        __INPUT.classList.add('INPUT_FILE')
        this._INPUT = __INPUT
        return __INPUT
    }

    NodeElement() {
        let Container = document.createElement('div')
        Container.setAttribute('IndexElement', INSTANCES_ELEMENTS.length)
        Container.id = `CONTAINER_INPUT_${this.id}`
        Container.className = 'CONTAINER_INPUT_BASE CONTAINER_INPUT_FILE'
        Container.appendChild(this.ELEMENT)


        let Note = document.createElement('div')
        Note.classList.add('NOTE_INPUT_MEDIA')
        Note.classList.add('d-none')
        Note.innerHTML = `
            <i class="fa fa-exclamation-circle"></i>
            <p>حجم فایل شما باید کمتر از 12 مگابایت باشد</p>
        `
        Container.append(Note)


        this.ELEMENT.setAttribute('IndexElementInListInput', LIST_INSTANCE_INPUT.length - 1)
        this.CONTAINER_INPUT = Container
        this.NOTE_INPUT_MEDIA = Note
        return Container
    }

    AppendELEMENT() {
        this.INPUT_MEDIA.name = `INPUT_FILE_${this.id}`
        if (!this.OnlyCreate) {
            if (this.ClassContainer_SET) {
                let ClassContainer = this.ClassContainer_SET
                let Container = ClassContainer.ELEMENT
                Container.append(this.Node)
                ClassContainer.Elements.push(this.Node)
                ClassContainer.ElementsCLASS.push(this)
            } else {
                let IndexContainerPage = ContainerPage.getAttribute('IndexPage')
                this.ContainerPage = LIST_PAGES_CLASS[IndexContainerPage] // Class Element
                ContainerPage.appendChild(this.Node) // Node Element
                this.ContainerPage.Elements.push(this.Node)
                this.ContainerPage.ElementsCLASS.push(this)
                this.IndexInElementsPage = this.ContainerPage.Elements.length - 1
            }
        }
        LIST_ELEMENTS_FORM.push(this.Node)
        return LIST_ELEMENTS_FORM.length - 1
    }
}

class BOX_BASE extends ElementBase {
    constructor(SetControllSettings = true) {
        super('BOX_ELEMENT');
        this.Type_Text = 'المان باکس'
        this.Elements = []
        this.ElementsCLASS = []
        this.NodeElement()
        if (SetControllSettings == true) {
            this.ControllMenuSettings_Open_Close(this, this.ELEMENT)
        }
        // Customize Styles
        this.CustomizeStyles()

        this.LIST_CONFIGS = [] // For Loading Configs
        this.LIST_VALIDATIONS = [] // For Loading Validations
        this.LIST_STYLES_UNIT = ['Width_Unit', 'Height_Unit', 'MarginTop_Unit', 'MarginBottom_Unit', 'MarginLeft_Unit', 'MarginRight_Unit'] // For Loading Unit Styles
        this.LIST_STYLES = ['Width', 'Height', 'FontSize', 'Color', 'Background', 'Display', 'TextAlign', 'TranslateY', 'TranslateX', 'MarginTop', 'MarginBottom', 'MarginLeft', 'MarginRight',
            'ClassName', 'ClassNameParent', 'StyleAdvance'
        ] // For Loading Styles
        this.Style.__Load_Styles()
        this.Config.__Load_Config()


        this.RemoveINSTANCE = function () {
            this.STATUS = 'DELETED'
            this.Node.remove()
            // Remove All Child
            for (let Class of this.ElementsCLASS) {
                Class.STATUS = 'DELETED'
            }
        }
    }

    Config_Initial() {
        this.Config.__INFOELEMENT_Initial()
        CreateTitleSectionStylesSettings('تنظمیات کلی', 'far fa-wrench')
        this.Config.Btns_Element_Initial()
        this.Config.Btn_InsertElement_Initial()
    }

    Styles_Initial() {
        CreateTitleSectionStylesSettings('تنظمیات ظاهری', 'far fa-pen-nib')
        this.Style.WIDTH_Initial()
        this.Style.Height_Initial()
        this.Style.FONTSIZE_Initial()
        this.Style.COLOR_Initial()
        this.Style.BACKGROUND_Initial()
        CreateTitleSectionStylesSettings('تنظیمات مکانی', 'far fa-arrows')
        this.Style.DISPLAY_Initial()
        this.Style.TEXTALIGN_Initial()
        this.Style.TRANSLATEY_Initial()
        this.Style.TRANSLATEX_Initial()
        this.Style.MARGINTOP_Initial()
        this.Style.MARGINBOTTOM_Initial()
        this.Style.MARGINRIGHT_Initial()
        this.Style.MARGINLEFT_Initial()
        CreateTitleSectionStylesSettings('تنظیمات پیشرفته :', 'far fa-files-medical')
        this.Style.CLASSNAME_Initial()
        this.Style.CLASSNAMEPARENT_Initial()
        this.Style.STYLEADVANCE_Initial()
    }

    CustomizeStyles() {
        this.Style.StyleSettings.Width = '350'
        this.Style.StyleSettings.Height = '210'
        this.Style.StyleSettings.Width_Unit = 'px'
        this.Style.StyleSettings.Height_Unit = 'px'
    }

    Initial_Settings() {
        if (TYPECREATEMODELS == 'Config') {
            this.Config_Initial()
            this.Styles_Initial()
        }
    }

    NodeElement() {
        let Node = document.createElement('div')
        Node.classList.add('CONTAINER_BOX_BASE')
        let Element = document.createElement('div')
        Element.classList.add('BOX_BASE')
        Node.append(Element)
        ContainerPage.appendChild(Node)
        this.ELEMENT = Element
        this.ELEMENT.id = `TAG_${this.id}`
        this.Node = Node
        let IndexContainerPage = ContainerPage.getAttribute('IndexPage')
        this.ContainerPage = LIST_PAGES_CLASS[IndexContainerPage]
        this.ContainerPage.Elements.push(Node)
        this.ContainerPage.ElementsCLASS.push(this)
    }
}

class TAG_P extends ElementBase {
    constructor(ClassContainer_SET = null, OnlyCreate) {
        super('TAG_P_ELEMENT', ClassContainer_SET, OnlyCreate);
        this.Type_Text = 'المان متن'
        this.ELEMENT = this.NodeElement()
        this.Node = this.ELEMENT
        this.IndexInForm = this.AppendELEMENT()
        this.ControllMenuSettings_Open_Close(this, this.ELEMENT, 'Click')

        // Customize Config
        this.CustomizeConfig()
        // Customize Styles
        this.CustomizeStyles()

        this.LIST_CONFIGS = ['InnerHTML'] // For Loading Configs
        this.LIST_VALIDATIONS = [] // For Loading Validations
        this.LIST_STYLES_UNIT = ['Width_Unit', 'Height_Unit', 'MarginTop_Unit', 'MarginBottom_Unit', 'MarginLeft_Unit', 'MarginRight_Unit'] // For Loading Unit Styles
        this.LIST_STYLES = ['Width', 'Height', 'FontSize', 'Color', 'Background', 'Display', 'TextAlign', 'TranslateY', 'TranslateX', 'MarginTop', 'MarginBottom', 'MarginLeft', 'MarginRight',
            'ClassName', 'ClassNameParent', 'StyleAdvance'
        ] // For Loading Styles
        this.Style.__Load_Styles()
        this.Config.__Load_Config()
    }

    CustomizeConfig() {
        this.Config.ConfigSettings.InnerHTML = 'متن'
    }

    CustomizeStyles() {
        this.Style.StyleSettings.Display = 'Block'
        this.Style.StyleSettings.Width = '75'
    }

    Config_Initial() {
        this.Config.__INFOELEMENT_Initial()
        CreateTitleSectionStylesSettings('تنظمیات کلی', 'far fa-wrench')
        this.Config.INNERHTML_Initial()
    }

    Styles_Initial() {
        CreateTitleSectionStylesSettings('تنظمیات ظاهری', 'far fa-pen-nib')
        this.Style.WIDTH_Initial()
        this.Style.Height_Initial()
        this.Style.FONTSIZE_Initial()
        this.Style.COLOR_Initial()
        this.Style.BACKGROUND_Initial()
        CreateTitleSectionStylesSettings('تنظیمات مکانی', 'far fa-arrows')
        this.Style.DISPLAY_Initial()
        this.Style.TEXTALIGN_Initial()
        this.Style.TRANSLATEY_Initial()
        this.Style.TRANSLATEX_Initial()
        this.Style.MARGINTOP_Initial()
        this.Style.MARGINBOTTOM_Initial()
        this.Style.MARGINRIGHT_Initial()
        this.Style.MARGINLEFT_Initial()
        CreateTitleSectionStylesSettings('تنظیمات پیشرفته :', 'far fa-files-medical')
        this.Style.CLASSNAME_Initial()
        this.Style.CLASSNAMEPARENT_Initial()
        this.Style.STYLEADVANCE_Initial()
    }


    Initial_Settings() {
        if (TYPECREATEMODELS == 'Config') {
            this.Config_Initial()
            this.Styles_Initial()
        }
    }

    NodeElement() {
        let __Tag = document.createElement('p')
        __Tag.innerHTML = this.Config.ConfigSettings.InnerHTML
        __Tag.id = `TAG_${this.id}`
        __Tag.classList.add('TAG_BASE')
        __Tag.classList.add('TAG_P_BASE')
        return __Tag
    }
}

class TAG_H1 extends ElementBase {
    constructor(ClassContainer_SET = null, OnlyCreate) {
        super('TAG_H1_ELEMENT', ClassContainer_SET, OnlyCreate);
        this.Type_Text = 'المان عنوان بزرگ'
        this.ELEMENT = this.NodeElement()
        this.Node = this.ELEMENT
        this.IndexInForm = this.AppendELEMENT()
        this.ControllMenuSettings_Open_Close(this, this.ELEMENT, 'Click')

        // Customize Config
        this.CustomizeConfig()
        // Customize Styles
        this.CustomizeStyles()

        this.LIST_CONFIGS = ['InnerHTML'] // For Loading Configs
        this.LIST_VALIDATIONS = [] // For Loading Validations
        this.LIST_STYLES_UNIT = ['Width_Unit', 'Height_Unit', 'MarginTop_Unit', 'MarginBottom_Unit', 'MarginLeft_Unit', 'MarginRight_Unit'] // For Loading Unit Styles
        this.LIST_STYLES = ['Width', 'Height', 'FontSize', 'Color', 'Background', 'Display', 'TextAlign', 'TranslateY', 'TranslateX', 'MarginTop', 'MarginBottom', 'MarginLeft', 'MarginRight',
            'ClassName', 'ClassNameParent', 'StyleAdvance'
        ] // For Loading Styles
        this.Style.__Load_Styles()
        this.Config.__Load_Config()
    }

    CustomizeConfig() {
        this.Config.ConfigSettings.InnerHTML = 'عنوان بزرگ'
    }

    CustomizeStyles() {
        this.Style.StyleSettings.Display = 'Block'
        this.Style.StyleSettings.FontSize = '40'
    }

    Config_Initial() {
        this.Config.__INFOELEMENT_Initial()
        CreateTitleSectionStylesSettings('تنظمیات کلی', 'far fa-wrench')
        this.Config.INNERHTML_Initial()
    }

    Styles_Initial() {
        CreateTitleSectionStylesSettings('تنظمیات ظاهری', 'far fa-pen-nib')
        this.Style.WIDTH_Initial()
        this.Style.Height_Initial()
        this.Style.FONTSIZE_Initial()
        this.Style.COLOR_Initial()
        this.Style.BACKGROUND_Initial()
        CreateTitleSectionStylesSettings('تنظیمات مکانی', 'far fa-arrows')
        this.Style.DISPLAY_Initial()
        this.Style.TEXTALIGN_Initial()
        this.Style.TRANSLATEY_Initial()
        this.Style.TRANSLATEX_Initial()
        this.Style.MARGINTOP_Initial()
        this.Style.MARGINBOTTOM_Initial()
        this.Style.MARGINRIGHT_Initial()
        this.Style.MARGINLEFT_Initial()
        CreateTitleSectionStylesSettings('تنظیمات پیشرفته :', 'far fa-files-medical')
        this.Style.CLASSNAME_Initial()
        this.Style.CLASSNAMEPARENT_Initial()
        this.Style.STYLEADVANCE_Initial()
    }


    Initial_Settings() {
        if (TYPECREATEMODELS == 'Config') {
            this.Config_Initial()
            this.Styles_Initial()
        }
    }

    NodeElement() {
        let __Tag = document.createElement('h1')
        __Tag.innerHTML = this.Config.ConfigSettings.InnerHTML
        __Tag.id = `TAG_${this.id}`
        __Tag.classList.add('TAG_BASE')
        __Tag.classList.add('TAG_H1_BASE')
        return __Tag
    }
}

class TAG_H3 extends ElementBase {
    constructor(ClassContainer_SET = null, OnlyCreate) {
        super('TAG_H3_ELEMENT', ClassContainer_SET, OnlyCreate);
        this.Type_Text = 'المان عنوان متوسط'
        this.ELEMENT = this.NodeElement()
        this.Node = this.ELEMENT
        this.IndexInForm = this.AppendELEMENT()
        this.ControllMenuSettings_Open_Close(this, this.ELEMENT, 'Click')

        // Customize Config
        this.CustomizeConfig()
        // Customize Styles
        this.CustomizeStyles()

        this.LIST_CONFIGS = ['InnerHTML'] // For Loading Configs
        this.LIST_VALIDATIONS = [] // For Loading Validations
        this.LIST_STYLES_UNIT = ['Width_Unit', 'Height_Unit', 'MarginTop_Unit', 'MarginBottom_Unit', 'MarginLeft_Unit', 'MarginRight_Unit'] // For Loading Unit Styles
        this.LIST_STYLES = ['Width', 'Height', 'FontSize', 'Color', 'Background', 'Display', 'TextAlign', 'TranslateY', 'TranslateX', 'MarginTop', 'MarginBottom', 'MarginLeft', 'MarginRight',
            'ClassName', 'ClassNameParent', 'StyleAdvance'
        ] // For Loading Styles
        this.Style.__Load_Styles()
        this.Config.__Load_Config()
    }

    CustomizeConfig() {
        this.Config.ConfigSettings.InnerHTML = 'عنوان متوسط'
    }

    CustomizeStyles() {
        this.Style.StyleSettings.Display = 'Block'
        this.Style.StyleSettings.FontSize = '28'
    }

    Config_Initial() {
        this.Config.__INFOELEMENT_Initial()
        CreateTitleSectionStylesSettings('تنظمیات کلی', 'far fa-wrench')
        this.Config.INNERHTML_Initial()
    }

    Styles_Initial() {
        CreateTitleSectionStylesSettings('تنظمیات ظاهری', 'far fa-pen-nib')
        this.Style.WIDTH_Initial()
        this.Style.Height_Initial()
        this.Style.FONTSIZE_Initial()
        this.Style.COLOR_Initial()
        this.Style.BACKGROUND_Initial()
        CreateTitleSectionStylesSettings('تنظیمات مکانی', 'far fa-arrows')
        this.Style.DISPLAY_Initial()
        this.Style.TEXTALIGN_Initial()
        this.Style.TRANSLATEY_Initial()
        this.Style.TRANSLATEX_Initial()
        this.Style.MARGINTOP_Initial()
        this.Style.MARGINBOTTOM_Initial()
        this.Style.MARGINRIGHT_Initial()
        this.Style.MARGINLEFT_Initial()
        CreateTitleSectionStylesSettings('تنظیمات پیشرفته :', 'far fa-files-medical')
        this.Style.CLASSNAME_Initial()
        this.Style.CLASSNAMEPARENT_Initial()
        this.Style.STYLEADVANCE_Initial()
    }


    Initial_Settings() {
        if (TYPECREATEMODELS == 'Config') {
            this.Config_Initial()
            this.Styles_Initial()
        }
    }

    NodeElement() {
        let __Tag = document.createElement('h3')
        __Tag.innerHTML = this.Config.ConfigSettings.InnerHTML
        __Tag.id = `TAG_${this.id}`
        __Tag.classList.add('TAG_BASE')
        __Tag.classList.add('TAG_H3_BASE')
        return __Tag
    }
}

class TAG_H6 extends ElementBase {
    constructor(ClassContainer_SET = null, OnlyCreate) {
        super('TAG_H6_ELEMENT', ClassContainer_SET, OnlyCreate);
        this.Type_Text = 'المان عنوان کوچک'
        this.ELEMENT = this.NodeElement()
        this.Node = this.ELEMENT
        this.IndexInForm = this.AppendELEMENT()
        this.ControllMenuSettings_Open_Close(this, this.ELEMENT, 'Click')

        // Customize Config
        this.CustomizeConfig()
        // Customize Styles
        this.CustomizeStyles()

        this.LIST_CONFIGS = ['InnerHTML'] // For Loading Configs
        this.LIST_VALIDATIONS = [] // For Loading Validations
        this.LIST_STYLES_UNIT = ['Width_Unit', 'Height_Unit', 'MarginTop_Unit', 'MarginBottom_Unit', 'MarginLeft_Unit', 'MarginRight_Unit'] // For Loading Unit Styles
        this.LIST_STYLES = ['Width', 'Height', 'FontSize', 'Color', 'Background', 'Display', 'TextAlign', 'TranslateY', 'TranslateX', 'MarginTop', 'MarginBottom', 'MarginLeft', 'MarginRight',
            'ClassName', 'ClassNameParent', 'StyleAdvance'
        ] // For Loading Styles
        this.Style.__Load_Styles()
        this.Config.__Load_Config()
    }

    CustomizeConfig() {
        this.Config.ConfigSettings.InnerHTML = 'عنوان کوچک'
    }

    CustomizeStyles() {
        this.Style.StyleSettings.Display = 'Block'
        this.Style.StyleSettings.FontSize = '19'
    }

    Config_Initial() {
        this.Config.__INFOELEMENT_Initial()
        CreateTitleSectionStylesSettings('تنظمیات کلی', 'far fa-wrench')
        this.Config.INNERHTML_Initial()
    }

    Styles_Initial() {
        CreateTitleSectionStylesSettings('تنظمیات ظاهری', 'far fa-pen-nib')
        this.Style.WIDTH_Initial()
        this.Style.Height_Initial()
        this.Style.FONTSIZE_Initial()
        this.Style.COLOR_Initial()
        this.Style.BACKGROUND_Initial()
        CreateTitleSectionStylesSettings('تنظیمات مکانی', 'far fa-arrows')
        this.Style.DISPLAY_Initial()
        this.Style.TEXTALIGN_Initial()
        this.Style.TRANSLATEY_Initial()
        this.Style.TRANSLATEX_Initial()
        this.Style.MARGINTOP_Initial()
        this.Style.MARGINBOTTOM_Initial()
        this.Style.MARGINRIGHT_Initial()
        this.Style.MARGINLEFT_Initial()
        CreateTitleSectionStylesSettings('تنظیمات پیشرفته :', 'far fa-files-medical')
        this.Style.CLASSNAME_Initial()
        this.Style.CLASSNAMEPARENT_Initial()
        this.Style.STYLEADVANCE_Initial()
    }


    Initial_Settings() {
        if (TYPECREATEMODELS == 'Config') {
            this.Config_Initial()
            this.Styles_Initial()
        }
    }

    NodeElement() {
        let __Tag = document.createElement('h6')
        __Tag.innerHTML = this.Config.ConfigSettings.InnerHTML
        __Tag.id = `TAG_${this.id}`
        __Tag.classList.add('TAG_BASE')
        __Tag.classList.add('TAG_H6_BASE')
        return __Tag
    }
}

class IMAGE_BASE extends ElementBase {
    constructor(ClassContainer_SET = null, OnlyCreate) {
        super('TAG_IMAGE_ELEMENT', ClassContainer_SET, OnlyCreate);
        this.Type_Text = 'المان عکس'
        LIST_INSTANCE_MEDIA.push(this)
        this.INPUT_MEDIA = null
        this.ELEMENT = this.NodeTag()
        this.Node = this.NodeElement()
        this.IndexInForm = this.AppendELEMENT()
        this.ControllMenuSettings_Open_Close(this, this.ELEMENT, 'Click')
        // Customize Styles
        this.CustomizeStyles()
        this.Style.Width = function (Size) {
            let Unit = this.StyleSettings.Width_Unit
            if (Unit == 'px') {
                this.Instance.Node.style.width = 'auto'
                this.Instance.ELEMENT.style.width = Size + Unit
                this.StyleSettings.Width = Size
                this.ApppendStyle('Width', Size)
            } else if (Unit == '%') {
                //this.Instance.ELEMENT.style.width = '100%'
                this.Instance.ELEMENT.style.width = Size + Unit
                this.StyleSettings.Width = Size
                this.ApppendStyle('Width', Size)
            } else if (Unit == 'auto') {
                this.Instance.ELEMENT.style.width = 'auto'
                this.Instance.Node.style.width = ''
                // this.StyleSettings.Height = 'auto'
                this.ApppendStyle('width', 'auto')
            }
        }
        this.Style.Height = function (Size) {
            let Unit = this.StyleSettings.Height_Unit
            if (Unit == 'px') {
                this.Instance.Node.style.height = 'auto'
                this.Instance.ELEMENT.style.height = Size + Unit
                this.StyleSettings.Height = Size
                this.ApppendStyle('Height', Size)
            } else if (Unit == '%') {
                this.Instance.ELEMENT.style.height = '100%'
                this.Instance.Node.style.height = Size + Unit
                this.StyleSettings.Height = Size
                this.ApppendStyle('Height', Size)
            } else if (Unit == 'auto') {
                this.Instance.ELEMENT.style.height = 'auto'
                this.Instance.Node.style.height = ''
                // this.StyleSettings.Height = 'auto'
                this.ApppendStyle('Height', 'auto')
            }
        }


        this.LIST_CONFIGS = [] // For Loading Configs
        this.LIST_VALIDATIONS = [] // For Loading Validations
        this.LIST_STYLES_UNIT = ['Width_Unit', 'Height_Unit', 'MarginTop_Unit', 'MarginBottom_Unit', 'MarginLeft_Unit', 'MarginRight_Unit'] // For Loading Unit Styles
        this.LIST_STYLES = ['Width', 'Height', 'Display', 'TextAlign', 'TranslateY', 'TranslateX', 'MarginTop', 'MarginBottom', 'MarginLeft', 'MarginRight',
            'ClassName', 'ClassNameParent', 'StyleAdvance'
        ] // For Loading Styles
        this.Style.__Load_Styles()
    }

    CustomizeStyles() {
        this.Style.StyleSettings.Display = 'Block'
        this.Style.StyleSettings.Width = '150'
        this.Style.StyleSettings.Height = '150'
        this.Style.StyleSettings.Height_Unit = 'px'
        this.Style.StyleSettings.Width_Unit = 'px'
    }

    Config_Initial() {
        this.Config.__INFOELEMENT_Initial()
        CreateTitleSectionStylesSettings('تنظمیات کلی', 'far fa-wrench')
        this.Config.VALUEIMAGE_Initial()
    }

    Styles_Initial() {
        CreateTitleSectionStylesSettings('تنظمیات ظاهری', 'far fa-pen-nib')
        this.Style.WIDTH_Initial()
        this.Style.Height_Initial()
        CreateTitleSectionStylesSettings('تنظیمات مکانی', 'far fa-arrows')
        this.Style.DISPLAY_Initial()
        this.Style.TEXTALIGN_Initial()
        this.Style.TRANSLATEY_Initial()
        this.Style.TRANSLATEX_Initial()
        this.Style.MARGINTOP_Initial()
        this.Style.MARGINBOTTOM_Initial()
        this.Style.MARGINRIGHT_Initial()
        this.Style.MARGINLEFT_Initial()
        CreateTitleSectionStylesSettings('تنظیمات پیشرفته :', 'far fa-files-medical')
        this.Style.CLASSNAME_Initial()
        this.Style.CLASSNAMEPARENT_Initial()
        this.Style.STYLEADVANCE_Initial()
    }

    Validation_InputFile(Input) {
        let State_Size = false
        let State_Type = false
        let SizeFile = GetSizeFile(Input) // Unit Size ==> Bytes
        let TypeFile = GetTypeFile(Input)
        // if Type File is an Image Does Check Size Image else Does not Check Size Image
        if (LIST_TYPE_IMAGE.includes(TypeFile)) {
            State_Type = true
        } else {
            ShowNotificationMessage(`نوع فایل انتخاب شده مجاز نیست`, 'Error')
        }
        if (State_Type) {
            if (SizeFile < LIMIT_SIZE_IMAGE) {
                State_Size = true
            } else {
                ShowNotificationMessage(`حجم عکس انتخاب شده بیشتر از حد مجاز است`, 'Error')
            }
        }
        return (State_Type && State_Size)
    }

    SetImagePreview(Input) {
        const [FileResult] = Input.files
        if (FileResult) {
            this.ELEMENT.src = URL.createObjectURL(FileResult)
        }
    }

    SetInputMedia(Input) {
        try {
            Input = Input[0]
            Input.name = `INPUT_MEDIA_${this.id}`
            this.INPUT_MEDIA = Input
            this.STATE = 'Create'
            this.SetImagePreview(Input)

        } catch (e) {
            ShowNotificationMessage('مشکلی در بارگیری عکس وجود دارد لطفا به پشتیبانی اطلاع دهید', 'Error')
        }
    }

    Initial_Settings() {
        if (TYPECREATEMODELS == 'Config') {
            this.Config_Initial()
            this.Styles_Initial()
        }
    }

    NodeTag() {
        let __Tag = document.createElement('img')
        __Tag.src = this.Config.ConfigSettings.ValueImage
        __Tag.alt = 'عکس'
        __Tag.id = `TAG_${this.id}`
        __Tag.classList.add('TAG_BASE')
        __Tag.classList.add('TAG_IMAGE_BASE')
        return __Tag
    }

    NodeElement() {
        let Container = document.createElement('div')
        Container.setAttribute('IndexElement', INSTANCES_ELEMENTS.length)
        Container.id = `CONTAINER_ELEMENT_${this.id}`
        Container.className = 'CONTAINER_ELEMENT_BASE'
        Container.appendChild(this.ELEMENT)
        this.CONTAINER_ELEMENT = Container
        return Container
    }

}

class VIDEO_BASE extends ElementBase {
    constructor(ClassContainer_SET = null, OnlyCreate) {
        super('TAG_VIDEO_ELEMENT', ClassContainer_SET, OnlyCreate);
        this.Type_Text = 'المان ویدئو'
        LIST_INSTANCE_MEDIA.push(this)
        this.INPUT_MEDIA = null
        this.ELEMENT = this.NodeTag()
        this.Node = this.NodeElement()
        this.IndexInForm = this.AppendELEMENT()
        this.ControllMenuSettings_Open_Close(this, this.ELEMENT, 'Click')
        // Customize Styles
        this.CustomizeStyles()
        this.Style.Width = function (Size) {
            let Unit = this.StyleSettings.Width_Unit
            if (Unit == 'px') {
                this.Instance.Node.style.width = 'auto'
                this.Instance.ELEMENT.style.width = Size + Unit
                this.StyleSettings.Width = Size
                this.ApppendStyle('Width', Size)
            } else if (Unit == '%') {
                //this.Instance.ELEMENT.style.width = '100%'
                this.Instance.ELEMENT.style.width = Size + Unit
                this.StyleSettings.Width = Size
                this.ApppendStyle('Width', Size)
            } else if (Unit == 'auto') {
                this.Instance.ELEMENT.style.width = 'auto'
                this.Instance.Node.style.width = ''
                // this.StyleSettings.Height = 'auto'
                this.ApppendStyle('width', 'auto')
            }
        }
        this.Style.Height = function (Size) {
            let Unit = this.StyleSettings.Height_Unit
            if (Unit == 'px') {
                this.Instance.Node.style.height = 'auto'
                this.Instance.ELEMENT.style.height = Size + Unit
                this.StyleSettings.Height = Size
                this.ApppendStyle('Height', Size)
            } else if (Unit == '%') {
                this.Instance.ELEMENT.style.height = '100%'
                this.Instance.Node.style.height = Size + Unit
                this.StyleSettings.Height = Size
                this.ApppendStyle('Height', Size)
            } else if (Unit == 'auto') {
                this.Instance.ELEMENT.style.height = 'auto'
                this.Instance.Node.style.height = ''
                // this.StyleSettings.Height = 'auto'
                this.ApppendStyle('Height', 'auto')
            }
        }

        this.LIST_CONFIGS = [] // For Loading Configs
        this.LIST_VALIDATIONS = [] // For Loading Validations
        this.LIST_STYLES_UNIT = ['Width_Unit', 'Height_Unit', 'MarginTop_Unit', 'MarginBottom_Unit', 'MarginLeft_Unit', 'MarginRight_Unit'] // For Loading Unit Styles
        this.LIST_STYLES = ['Width', 'Height', 'Display', 'TextAlign', 'TranslateY', 'TranslateX', 'MarginTop', 'MarginBottom', 'MarginLeft', 'MarginRight',
            'ClassName', 'ClassNameParent', 'StyleAdvance'
        ] // For Loading Styles
        this.Style.__Load_Styles()
    }

    CustomizeStyles() {
        this.Style.StyleSettings.Display = 'Block'
        this.Style.StyleSettings.Width = '300'
        this.Style.StyleSettings.Height = '300'
        this.Style.StyleSettings.Height_Unit = 'px'
        this.Style.StyleSettings.Width_Unit = 'px'
    }

    Config_Initial() {
        this.Config.__INFOELEMENT_Initial()
        CreateTitleSectionStylesSettings('تنظمیات کلی', 'far fa-wrench')
        this.Config.VALUEVIDEO_Initial()
    }

    Styles_Initial() {
        CreateTitleSectionStylesSettings('تنظمیات ظاهری', 'far fa-pen-nib')
        this.Style.WIDTH_Initial()
        this.Style.Height_Initial()
        CreateTitleSectionStylesSettings('تنظیمات مکانی', 'far fa-arrows')
        this.Style.DISPLAY_Initial()
        this.Style.TEXTALIGN_Initial()
        this.Style.TRANSLATEY_Initial()
        this.Style.TRANSLATEX_Initial()
        this.Style.MARGINTOP_Initial()
        this.Style.MARGINBOTTOM_Initial()
        this.Style.MARGINRIGHT_Initial()
        this.Style.MARGINLEFT_Initial()
        CreateTitleSectionStylesSettings('تنظیمات پیشرفته :', 'far fa-files-medical')
        this.Style.CLASSNAME_Initial()
        this.Style.CLASSNAMEPARENT_Initial()
        this.Style.STYLEADVANCE_Initial()
    }

    Validation_InputFile(Input) {
        let State_Size = false
        let State_Type = false
        let SizeFile = GetSizeFile(Input) // Unit Size ==> Bytes
        let TypeFile = GetTypeFile(Input)
        // if Type File is an Video Does Check Size Video else Does not Check Size Video
        if (LIST_TYPE_VIDEO.includes(TypeFile)) {
            State_Type = true
        } else {
            ShowNotificationMessage(`نوع فایل انتخاب شده مجاز نیست`, 'Error')
        }
        if (State_Type) {
            if (SizeFile < LIMIT_SIZE_VIDEO) {
                State_Size = true
            } else {
                ShowNotificationMessage(`حجم فیلم انتخاب شده بیشتر از حد مجاز است`, 'Error')
            }
        }
        return (State_Type && State_Size)
    }

    SetVideoPreview(Input) {
        const [FileResult] = Input.files
        if (FileResult) {
            this.ELEMENT.src = URL.createObjectURL(FileResult)
        }
    }

    SetInputMedia(Input) {
        try {
            Input = Input[0]
            Input.name = `INPUT_MEDIA_${this.id}`
            this.INPUT_MEDIA = Input
            this.STATE = 'Create'
            this.SetVideoPreview(Input)

        } catch (e) {
            ShowNotificationMessage('مشکلی در بارگیری ویدئو وجود دارد لطفا به پشتیبانی اطلاع دهید', 'Error')
        }
    }

    Initial_Settings() {
        if (TYPECREATEMODELS == 'Config') {
            this.Config_Initial()
            this.Styles_Initial()
        }
    }

    NodeTag() {
        let __Tag = document.createElement('video')
        __Tag.src = this.Config.ConfigSettings.ValueVideo
        __Tag.controls = true
        __Tag.id = `TAG_${this.id}`
        __Tag.classList.add('TAG_BASE')
        __Tag.classList.add('TAG_VIDEO_BASE')
        return __Tag
    }

    NodeElement() {
        let Container = document.createElement('div')
        Container.setAttribute('IndexElement', INSTANCES_ELEMENTS.length)
        Container.id = `CONTAINER_ELEMENT_${this.id}`
        Container.className = 'CONTAINER_ELEMENT_BASE'
        Container.appendChild(this.ELEMENT)
        this.CONTAINER_ELEMENT = Container
        return Container
    }

}

class AUDIO_BASE extends ElementBase {
    constructor(ClassContainer_SET = null, OnlyCreate) {
        super('TAG_AUDIO_ELEMENT', ClassContainer_SET, OnlyCreate);
        this.Type_Text = 'المان صدا'
        LIST_INSTANCE_MEDIA.push(this)
        this.INPUT_MEDIA = null
        this.ELEMENT = this.NodeTag()
        this.Node = this.NodeElement()
        this.IndexInForm = this.AppendELEMENT()
        this.ControllMenuSettings_Open_Close(this, this.ELEMENT, 'Click')
        // Customize Styles
        this.CustomizeStyles()

        this.LIST_CONFIGS = [] // For Loading Configs
        this.LIST_VALIDATIONS = [] // For Loading Validations
        this.LIST_STYLES_UNIT = ['Width_Unit', 'MarginTop_Unit', 'MarginBottom_Unit', 'MarginLeft_Unit', 'MarginRight_Unit'] // For Loading Unit Styles
        this.LIST_STYLES = ['Width', 'Background', 'Display', 'TextAlign', 'TranslateY', 'TranslateX', 'MarginTop', 'MarginBottom', 'MarginLeft', 'MarginRight',
            'ClassName', 'ClassNameParent', 'StyleAdvance'
        ] // For Loading Styles
        this.Style.__Load_Styles()
    }

    CustomizeStyles() {
        this.Style.StyleSettings.Display = 'Block'
        this.Style.StyleSettings.TextAlign = 'Center'
        this.Style.StyleSettings.Width_Unit = 'px'
    }

    Config_Initial() {
        this.Config.__INFOELEMENT_Initial()
        CreateTitleSectionStylesSettings('تنظمیات کلی', 'far fa-wrench')
        this.Config.VALUEAUDIO_Initial()
    }

    Styles_Initial() {
        CreateTitleSectionStylesSettings('تنظمیات ظاهری', 'far fa-pen-nib')
        this.Style.WIDTH_Initial()
        this.Style.BACKGROUND_Initial()
        CreateTitleSectionStylesSettings('تنظیمات مکانی', 'far fa-arrows')
        this.Style.DISPLAY_Initial()
        this.Style.TEXTALIGN_Initial()
        this.Style.TRANSLATEY_Initial()
        this.Style.TRANSLATEX_Initial()
        this.Style.MARGINTOP_Initial()
        this.Style.MARGINBOTTOM_Initial()
        this.Style.MARGINRIGHT_Initial()
        this.Style.MARGINLEFT_Initial()
        CreateTitleSectionStylesSettings('تنظیمات پیشرفته :', 'far fa-files-medical')
        this.Style.CLASSNAME_Initial()
        this.Style.CLASSNAMEPARENT_Initial()
        this.Style.STYLEADVANCE_Initial()
    }


    Validation_InputFile(Input) {
        let State_Size = false
        let State_Type = false
        let SizeFile = GetSizeFile(Input) // Unit Size ==> Bytes
        let TypeFile = GetTypeFile(Input)
        // if Type File is an Audio Does Check Size Audio else Does not Check Size Audio
        if (LIST_TYPE_AUDIO.includes(TypeFile)) {
            State_Type = true
        } else {
            ShowNotificationMessage(`نوع فایل انتخاب شده مجاز نیست`, 'Error')
        }
        if (State_Type) {
            if (SizeFile < LIMIT_SIZE_AUDIO) {
                State_Size = true
            } else {
                ShowNotificationMessage(`حجم فایل صوتی انتخاب شده بیشتر از حد مجاز است`, 'Error')
            }
        }
        return (State_Type && State_Size)
    }

    SetAudioPreview(Input) {
        const [FileResult] = Input.files
        if (FileResult) {
            this.ELEMENT.src = URL.createObjectURL(FileResult)
        }
    }

    SetInputMedia(Input) {
        try {
            Input = Input[0]
            Input.name = `INPUT_MEDIA_${this.id}`
            this.INPUT_MEDIA = Input
            this.STATE = 'Create'
            this.SetAudioPreview(Input)

        } catch (e) {
            ShowNotificationMessage('مشکلی در بارگیری فایل صوتی وجود دارد لطفا به پشتیبانی اطلاع دهید', 'Error')
        }
    }

    Initial_Settings() {
        if (TYPECREATEMODELS == 'Config') {
            this.Config_Initial()
            this.Styles_Initial()
        }
    }

    NodeTag() {
        let __Tag = document.createElement('audio')
        __Tag.src = this.Config.ConfigSettings.ValueAudio
        __Tag.controls = true
        __Tag.id = `TAG_${this.id}`
        __Tag.classList.add('TAG_BASE')
        __Tag.classList.add('TAG_AUDIO_BASE')
        return __Tag
    }

    NodeElement() {
        let Container = document.createElement('div')
        Container.setAttribute('IndexElement', INSTANCES_ELEMENTS.length)
        Container.id = `CONTAINER_ELEMENT_${this.id}`
        Container.className = 'CONTAINER_ELEMENT_BASE'
        Container.appendChild(this.ELEMENT)
        this.CONTAINER_ELEMENT = Container
        return Container
    }

}

class ConfigBaseForm {
    constructor(Form) {
        this.Instance = Form
        this.Form = Form
        let DateTime = new Date()
        let DateTimeExpiry = new Date(Form._Form.GetExpiryDate)
        this.ConfigSettings = {
            'Title': Form.Title,
            'Description': Form.Description,
            // 'DateStart': DateTime.getFullYear() + '-' + (DateTime.getMonth() + 1) + '-' + DateTime.getDate(),
            // 'DateEnd': DateTimeExpiry.getFullYear() + '-' + (DateTimeExpiry.getMonth() + 1) + '-' + DateTimeExpiry.getDate(),
            // 'DateMax': DateTimeExpiry.getFullYear() + '-' + (DateTimeExpiry.getMonth() + 1) + '-' + DateTimeExpiry.getDate(),
            'DateStart': DateTime.toISOString().slice(0, 10),
            'DateEnd': DateTimeExpiry.toISOString().slice(0, 10),
            'DateMax': DateTimeExpiry.toISOString().slice(0, 10),
            'TimeStart': '', // DateTime.getHours() + 1 + ":" + DateTime.getMinutes()
            'TimeEnd': '', // DateTime.getHours() + 2 + ":" + DateTime.getMinutes()
            'Responsive': 'true',
            'ShowAllPage': 'true',
            'CanBackPreviousPage': 'true',
            // State Validation
            'Title_Valid': 'true',
            'Description_Valid': 'true',
            'DateStart_Valid': 'true',
            'DateEnd_Valid': 'true',
            'TimeStart_Valid': 'false',
            'TimeEnd_Valid': 'false',
        }
    }

    Title(Val, Input) {
        let StateValid = CheckInputValidations(Input, 2, 150)
        if (StateValid) {
            try {
                TitleInfoForm.innerHTML = Val
            }catch (e) {}
            this.ConfigSettings.Title = Val
            this.ConfigSettings.Title_Valid = 'true'
            this.Instance.DICT_CONFIG['Title_Valid'] = 'true'
            this.Instance.DICT_CONFIG['TitleInfoForm'] = Val
        } else {
            this.ConfigSettings.Title_Valid = 'false'
            this.Instance.DICT_CONFIG['Title_Valid'] = 'false'
        }
    }

    Description(Val, Input) {
        let StateValid = CheckInputValidations(Input, -1, 3000)
        if (StateValid) {
            this.ConfigSettings.Description = Val
            this.ConfigSettings.Description_Valid = 'true'
            this.Instance.DICT_CONFIG['Description_Valid'] = 'true'
            this.Instance.DICT_CONFIG['Description'] = Val
        } else {
            this.ConfigSettings.Description_Valid = 'false'
            this.Instance.DICT_CONFIG['Description_Valid'] = 'false'
        }
    }

    DateStart(Val, Input) {
        let This = this
        Val = new Date(Val)
        Val = Val.toISOString().slice(0, 10)
        let Status_DateStart = false
        let Status_DateEnd = false
        let DateNow = new Date()
        DateNow = DateNow.toISOString().slice(0, 10)
        if (Val > This.ConfigSettings.DateEnd) {
            Input.value = This.ConfigSettings.DateStart
            ShowNotificationMessage('شما نمیتوانید تاریخ شروع را بیشتر از تاریخ پایان فرم قرار دهید', 'Error', 6500)
        } else {
            Status_DateEnd = true
        }
        if (Val < DateNow) {
            Input.value = This.ConfigSettings.DateStart
            ShowNotificationMessage('شما نمیتوانید تاریخ شروع را کمتر از تاریخ اکنون قرار دهید', 'Error', 6500)
        } else {
            Status_DateStart = true
        }
        if (Status_DateStart == true && Status_DateEnd == true) {
            This.ConfigSettings.DateStart = Val
            This.ConfigSettings.DateStart_Valid = 'true'
            This.Instance.DICT_CONFIG['DateStart_Valid'] = 'true'
            This.Instance.DICT_CONFIG['DateStart'] = Val
        } else {
            This.ConfigSettings.DateStart_Valid = 'false'
            This.Instance.DICT_CONFIG['DateStart_Valid'] = 'false'
        }

    }

    DateEnd(Val, Input) {
        let This = this
        Val = new Date(Val)
        Val = Val.toISOString().slice(0, 10)
        let Status_DateStart = false
        let Status_DateEnd = false
        let DateNow = new Date()
        DateNow = DateNow.toISOString().slice(0, 10)
        if (Val < This.ConfigSettings.DateStart) {
            Input.value = This.ConfigSettings.DateEnd
            ShowNotificationMessage('شما نمیتوانید تاریخ پایان را کمتر از تاریخ شروع فرم قرار دهید', 'Error', 6500)
        } else {
            Status_DateEnd = true
        }
        if (Val > This.ConfigSettings.DateMax) {
            Input.value = This.ConfigSettings.DateEnd
            ShowNotificationMessage('شما نمیتوانید تاریخ پایان را بیشتر از یک ماه قرار دهید زیرا مهلت فرم تمام میشود', 'Error', 6500)
        } else {
            Status_DateStart = true
        }
        if (Status_DateStart == true && Status_DateEnd == true) {
            This.ConfigSettings.DateEnd = Val
            This.ConfigSettings.DateEnd_Valid = 'true'
            This.Instance.DICT_CONFIG['DateEnd_Valid'] = 'true'
            This.Instance.DICT_CONFIG['DateEnd'] = Val
        } else {
            This.ConfigSettings.DateEnd_Valid = 'false'
            This.Instance.DICT_CONFIG['DateEnd_Valid'] = 'false'
        }

    }

    TimeStart(Val, Input) {
        let TimeNow = new Date()
        TimeNow = TimeNow.getHours() + ":" + TimeNow.getMinutes()
        let Status_TimeEnd = true
        let Status_TimeStart = true
        // if (Val > this.ConfigSettings.TimeEnd) {
        //     Input.value = this.ConfigSettings.TimeStart
        //     ShowNotificationMessage('شما نمیتوانید زمان شروع را بیشتر از زمان پایان فرم قرار دهید', 'Error', 6500)
        // } else {
        //     Status_TimeEnd = true
        // }
        // if (Val < TimeNow) {
        //     Input.value = this.ConfigSettings.TimeStart
        //     ShowNotificationMessage('شما نمیتوانید زمان شروع را کمتر از زمان اکنون قرار دهید', 'Error', 6500)
        // } else {
        //     Status_TimeStart = true
        // }

        if (Status_TimeStart == true && Status_TimeEnd == true) {
            this.ConfigSettings.TimeStart = Val
            this.ConfigSettings.TimeStart_Valid = 'true'
            this.Instance.DICT_CONFIG['TimeStart_Valid'] = 'true'
            this.Instance.DICT_CONFIG['TimeStart'] = Val
        } else {
            this.ConfigSettings.TimeStart_Valid = 'false'
            this.Instance.DICT_CONFIG['TimeStart_Valid'] = 'false'
        }
    }

    TimeEnd(Val, Input) {
        let TimeStart = this.ConfigSettings.TimeStart
        let Status = true
        // if (Val < this.ConfigSettings.TimeStart) {
        //     Input.value = this.ConfigSettings.TimeEnd
        //     ShowNotificationMessage('شما نمیتوانید زمان پایان را کمتر از زمان شروع  قرار دهید', 'Error', 6500)
        // } else {
        //     Status = true
        // }
        if (Status) {
            this.ConfigSettings.TimeEnd = Val
            this.Instance.DICT_CONFIG['TimeEnd'] = Val
            this.ConfigSettings.TimeEnd_Valid = 'true'
            this.Instance.DICT_CONFIG['TimeEnd_Valid'] = 'true'
        } else {
            this.ConfigSettings.TimeEnd_Valid = 'false'
            this.Instance.DICT_CONFIG['TimeEnd_Valid'] = 'false'
        }
    }

    Responsive(Val, Input) {
        this.ConfigSettings.Responsive = Val
        this.Instance.DICT_CONFIG['Responsive'] = Val
    }

    ShowAllPage(Val, Input) {
        this.ConfigSettings.ShowAllPage = Val
        this.Instance.DICT_CONFIG['ShowAllPage'] = Val
    }

    CanBackPreviousPage(Val, Input) {
        this.ConfigSettings.CanBackPreviousPage = Val
        this.Instance.DICT_CONFIG['CanBackPreviousPage'] = Val
    }

}

class ConfigBaseFormQuiz extends ConfigBaseForm {
    constructor(Form) {
        super(Form);
        this.Instance = Form
        this.Form = Form
        let DateTime = new Date()
        let DateTimeExpiry = new Date(Form._Form.GetExpiryDate)
        this.ConfigSettings = {
            'Title': Form.Title,
            'Description': Form.Description,
            // 'DateStart': DateTime.getFullYear() + '-' + (DateTime.getMonth() + 1) + '-' + DateTime.getDate(),
            // 'DateEnd': DateTimeExpiry.getFullYear() + '-' + (DateTimeExpiry.getMonth() + 1) + '-' + DateTimeExpiry.getDate(),
            // 'DateMax': DateTimeExpiry.getFullYear() + '-' + (DateTimeExpiry.getMonth() + 1) + '-' + DateTimeExpiry.getDate(),
            'DateStart': DateTime.toISOString().slice(0, 10),
            'DateEnd': DateTimeExpiry.toISOString().slice(0, 10),
            'DateMax': DateTimeExpiry.toISOString().slice(0, 10),
            'TimeStart': '', // DateTime.getHours() + 1 + ":" + DateTime.getMinutes()
            'TimeEnd': '', // DateTime.getHours() + 2 + ":" + DateTime.getMinutes()
            'Responsive': 'true',
            'ShowAllQuestions': 'true',
            'CanBackPreviousQuestion': 'true',
            'RandomQuestions': 'false',
            'ShowNumberQuestion': 'true',
            // State Validation
            'Title_Valid': 'true',
            'Description_Valid': 'true',
            'DateStart_Valid': 'true',
            'DateEnd_Valid': 'true',
            'TimeStart_Valid': 'false',
            'TimeEnd_Valid': 'false',
        }
    }

    ShowAllQuestions(Val, Input) {
        this.ConfigSettings.ShowAllQuestions = Val
        this.Instance.DICT_CONFIG['ShowAllQuestions'] = Val
    }

    CanBackPreviousQuestion(Val, Input) {
        this.ConfigSettings.CanBackPreviousQuestion = Val
        this.Instance.DICT_CONFIG['CanBackPreviousQuestion'] = Val
    }

    RandomQuestions(Val, Input) {
        this.ConfigSettings.RandomQuestions = Val
        this.Instance.DICT_CONFIG['RandomQuestions'] = Val
    }

    ShowNumberQuestion(Val, Input) {
        this.ConfigSettings.ShowNumberQuestion = Val
        this.Instance.DICT_CONFIG['ShowNumberQuestion'] = Val
    }


}

class FORM_BASE {
    constructor(Form) {
        this._Form = Form
        this.Type = Form.Type
        this.ID_Form = Form.ID_Form
        this.Title = Form.Title
        this.Description = Form.Description
        if (this.Type == 'Customize') {
            this.Config = new ConfigBaseForm(this)
        } else if (this.Type == 'Quiz') {
            this.Config = new ConfigBaseFormQuiz(this)
        }
        this.DICT_CONFIG = {}
        this.LIST_VALIDATION_CONFIG = ['Title', 'Description', 'TimeStart', 'TimeEnd', 'DateStart', 'DateEnd']
    }

    SettingsForm(OnlyNode = false) {
        /* FORM == this */
        let Node = ``
        if (this.Type == 'Customize') {
            Node = `
               ${OnlyNode == false ? '<i class="fa fa-times" onclick="DeleteContainerBlur()"></i>' : ''}
               <h3 class="TitleCotnaienrSettingsForm">تنظیمات فرم</h3>
                <div class="ItemSettingsForm">
                    <h5> عنوان فرم :</h5>
                    <input type="text" value="${FORM.Config.ConfigSettings.Title}" oninput="FORM.Config.Title(this.value,this)">
                </div>
                <div class="ItemSettingsForm">
                    <h5>توضیحات فرم :</h5>
                    <textarea oninput="FORM.Config.Description(this.value,this)" >${FORM.Config.ConfigSettings.Description}</textarea>
                </div>
                <div class="ItemSettingsForm">
                    <h5>تاریخ و زمان شروع :</h5>
                    <p class="NoteSettingsForm">(توجه کنید فرم حداکثر تا یک ماه پس از ساخته شدن میتواند فعال بماند)</p>
                    <span>فرم از تاریخ</span> <input value="${FORM.Config.ConfigSettings.DateStart}" onfocusout="FORM.Config.DateStart(this.value,this)" type="date"> <span>تا</span> <input value="${FORM.Config.ConfigSettings.DateEnd}" onfocusout="FORM.Config.DateEnd(this.value,this)"  type="date"> <span>و از زمان</span> <input value="${FORM.Config.ConfigSettings.TimeStart}" onfocusout="FORM.Config.TimeStart(this.value,this)" type="time"> <span>تا</span> <input value="${FORM.Config.ConfigSettings.TimeEnd}" onfocusout="FORM.Config.TimeEnd(this.value,this)"  type="time">
                    <span>فعال باشد </span>
                </div>
                <div class="ItemSettingsForm">
                    <h5>واکنشگرا بودن فرم :</h5>
                    <p class="NoteSettingsForm">(نمایش درست در دستگاه ها با سایز کوچکتر مانند موبایل و تبلت بدون بهم ریختگی المان ها)</p>
                    <div class="CONTAINER_INPUT_RADIO text-center">
                        <input type="radio" value="false" oninput="FORM.Config.Responsive(this.value,this)" name="InputRadioSetResponsiveForm" ${FORM.Config.ConfigSettings.Responsive == 'false' && 'checked'}>
                        <p>غیر فعال</p>
                    </div>
                    <div class="CONTAINER_INPUT_RADIO text-center">
                        <input type="radio" value="true" oninput="FORM.Config.Responsive(this.value,this)" name="InputRadioSetResponsiveForm" ${FORM.Config.ConfigSettings.Responsive == 'true' && 'checked'}>
                        <p>فعال</p>
                    </div>
                </div>
                <div class="ItemSettingsForm">
                    <h5>نمایش تمامی صفحات به صورت یکجا :</h5>
                    <p class="NoteSettingsForm">(امکان نمایش تمامی برگه ها به صورت یکجا برای کاربر)</p>
                    <div class="CONTAINER_INPUT_RADIO text-center">
                        <input type="radio" value="false" oninput="FORM.Config.ShowAllPage(this.value,this)" name="InputRadioSetShowAllPage" ${FORM.Config.ConfigSettings.ShowAllPage == 'false' && 'checked'}>
                        <p>غیر فعال</p>
                    </div>
                    <div class="CONTAINER_INPUT_RADIO  text-center">
                        <input type="radio" value="true" oninput="FORM.Config.ShowAllPage(this.value,this)" name="InputRadioSetShowAllPage" ${FORM.Config.ConfigSettings.ShowAllPage == 'true' && 'checked'}>
                        <p>فعال</p>
                    </div>
                </div>
                <div class="ItemSettingsForm">
                    <h5>امکان برگشت به صفحات قبل :</h5>
                    <p class="NoteSettingsForm">(اگر این ایتم غیر فعال باشد کاربر نمیتواند به صفحات قبلی برگردد)</p>
                    <div class="CONTAINER_INPUT_RADIO  text-center">
                        <input type="radio" value="false" oninput="FORM.Config.CanBackPreviousPage(this.value,this)" name="InputRadioSetCanBackPreviousPage" ${FORM.Config.ConfigSettings.CanBackPreviousPage == 'false' && 'checked'}>
                        <p>غیر فعال</p>
                    </div>
                    <div class="CONTAINER_INPUT_RADIO text-center">
                        <input type="radio" value="true" oninput="FORM.Config.CanBackPreviousPage(this.value,this)" name="InputRadioSetCanBackPreviousPage" ${FORM.Config.ConfigSettings.CanBackPreviousPage == 'true' && 'checked'}>
                        <p>فعال</p>
                    </div>
                </div>
        `
            setTimeout(function () {
                if (OnlyNode == false) {
                    let Container = CreateContainerBlur('Default', 'ContaienrSettingsForm', null, 'Small')
                    ClickOutSideContainer(Container, function () {
                        DeleteContainerBlur()
                    }, 'OutSide')
                    Container.innerHTML = Node
                }
            })
        } else if (this.Type == 'Quiz') {
            Node = `
               ${OnlyNode == false ? '<i class="fa fa-times" onclick="DeleteContainerBlur()"></i>' : ''}
               <h3 class="TitleCotnaienrSettingsForm">تنظیمات فرم</h3>
                <div class="ItemSettingsForm">
                    <h5> عنوان فرم :</h5>
                    <input type="text" value="${FORM.Config.ConfigSettings.Title}" oninput="FORM.Config.Title(this.value,this)">
                </div>
                <div class="ItemSettingsForm">
                    <h5>توضیحات فرم :</h5>
                    <textarea oninput="FORM.Config.Description(this.value,this)" >${FORM.Config.ConfigSettings.Description}</textarea>
                </div>
                <div class="ItemSettingsForm">
                    <h5>تاریخ و زمان شروع :</h5>
                    <p class="NoteSettingsForm">(توجه کنید فرم حداکثر تا یک ماه پس از ساخته شدن میتواند فعال بماند)</p>
                    <span>فرم از تاریخ</span> <input value="${FORM.Config.ConfigSettings.DateStart}" onfocusout="FORM.Config.DateStart(this.value,this)" type="date"> <span>تا</span> <input value="${FORM.Config.ConfigSettings.DateEnd}" onfocusout="FORM.Config.DateEnd(this.value,this)"  type="date"> <span>و از زمان</span> <input value="${FORM.Config.ConfigSettings.TimeStart}" onfocusout="FORM.Config.TimeStart(this.value,this)" type="time"> <span>تا</span> <input value="${FORM.Config.ConfigSettings.TimeEnd}" onfocusout="FORM.Config.TimeEnd(this.value,this)"  type="time">
                    <span>فعال باشد </span>
                </div>
                <div class="ItemSettingsForm">
                    <h5>واکنشگرا بودن فرم :</h5>
                    <p class="NoteSettingsForm">(نمایش درست در دستگاه ها با سایز کوچکتر مانند موبایل و تبلت بدون بهم ریختگی المان ها)</p>
                    <div class="CONTAINER_INPUT_RADIO text-center">
                        <input type="radio" value="false" oninput="FORM.Config.Responsive(this.value,this)" name="InputRadioSetResponsiveForm" ${FORM.Config.ConfigSettings.Responsive == 'false' && 'checked'}>
                        <p>غیر فعال</p>
                    </div>
                    <div class="CONTAINER_INPUT_RADIO text-center">
                        <input type="radio" value="true" oninput="FORM.Config.Responsive(this.value,this)" name="InputRadioSetResponsiveForm" ${FORM.Config.ConfigSettings.Responsive == 'true' && 'checked'}>
                        <p>فعال</p>
                    </div>
                </div>
                <div class="ItemSettingsForm">
                    <h5>نمایش تمامی سوالات به صورت یکجا :</h5>
                    <p class="NoteSettingsForm">(امکان نمایش تمامی سوالات به صورت یکجا برای کاربر)</p>
                    <div class="CONTAINER_INPUT_RADIO text-center">
                        <input type="radio" value="false" oninput="FORM.Config.ShowAllQuestions(this.value,this)" name="InputRadioSetShowQuestionsPage" ${FORM.Config.ConfigSettings.ShowAllQuestions == 'false' && 'checked'}>
                        <p>غیر فعال</p>
                    </div>
                    <div class="CONTAINER_INPUT_RADIO  text-center">
                        <input type="radio" value="true" oninput="FORM.Config.ShowAllQuestions(this.value,this)" name="InputRadioSetShowQuestionsPage" ${FORM.Config.ConfigSettings.ShowAllQuestions == 'true' && 'checked'}>
                        <p>فعال</p>
                    </div>
                </div>
                <div class="ItemSettingsForm">
                    <h5>امکان برگشت به سوال قبل :</h5>
                    <p class="NoteSettingsForm">(اگر این ایتم غیر فعال باشد کاربر نمیتواند به سوال قبلی برگردد)</p>
                    <div class="CONTAINER_INPUT_RADIO  text-center">
                        <input type="radio" value="false" oninput="FORM.Config.CanBackPreviousQuestion(this.value,this)" name="InputRadioSetCanBackPreviousQuestion" ${FORM.Config.ConfigSettings.CanBackPreviousQuestion == 'false' && 'checked'}>
                        <p>غیر فعال</p>
                    </div>
                    <div class="CONTAINER_INPUT_RADIO text-center">
                        <input type="radio" value="true" oninput="FORM.Config.CanBackPreviousQuestion(this.value,this)" name="InputRadioSetCanBackPreviousQuestion" ${FORM.Config.ConfigSettings.CanBackPreviousQuestion == 'true' && 'checked'}>
                        <p>فعال</p>
                    </div>
                </div>
                <div class="ItemSettingsForm">
                    <h5>نمایش سوالات به صورت بهم ریخته و شانسی :</h5>
                    <p class="NoteSettingsForm">(اگر این ایتم فعال باشد سوالات به صورت شانسی برای کاربر به نمایش در می ایند)</p>
                    <div class="CONTAINER_INPUT_RADIO  text-center">
                        <input type="radio" value="false" oninput="FORM.Config.RandomQuestions(this.value,this)" name="InputRadioSetRandomQuestions" ${FORM.Config.ConfigSettings.RandomQuestions == 'false' && 'checked'}>
                        <p>غیر فعال</p>
                    </div>
                    <div class="CONTAINER_INPUT_RADIO text-center">
                        <input type="radio" value="true" oninput="FORM.Config.RandomQuestions(this.value,this)" name="InputRadioSetRandomQuestions" ${FORM.Config.ConfigSettings.RandomQuestions == 'true' && 'checked'}>
                        <p>فعال</p>
                    </div>
                </div>
                <div class="ItemSettingsForm">
                    <h5>نمایش شماره سوالات :</h5>
                    <p class="NoteSettingsForm">(اگر این ایتم غیر فعال باشد شماره سوالات به کاربر نمایش داده نمیشوند )</p>
                    <div class="CONTAINER_INPUT_RADIO  text-center">
                        <input type="radio" value="false" oninput="FORM.Config.ShowNumberQuestion(this.value,this)" name="InputRadioSetShowNumberQuestion" ${FORM.Config.ConfigSettings.ShowNumberQuestion == 'false' && 'checked'}>
                        <p>غیر فعال</p>
                    </div>
                    <div class="CONTAINER_INPUT_RADIO text-center">
                        <input type="radio" value="true" oninput="FORM.Config.ShowNumberQuestion(this.value,this)" name="InputRadioSetShowNumberQuestion" ${FORM.Config.ConfigSettings.ShowNumberQuestion == 'true' && 'checked'}>
                        <p>فعال</p>
                    </div>
                </div>
        `
            setTimeout(function () {
                if (OnlyNode == false) {
                    let Container = CreateContainerBlur('Default', 'ContaienrSettingsForm', null, 'Small')
                    ClickOutSideContainer(Container, function () {
                        DeleteContainerBlur()
                    }, 'OutSide')
                    Container.innerHTML = Node
                }
            })
        }


        return Node
    }

}

function DELETE_ELEMENT(INDEX_INSTANCE) {
    let Instance = INSTANCES_ELEMENTS[INDEX_INSTANCE]
    let Type_Text = Instance.Type_Text
    CreateMessage_Alert(` ایا از حذف کردن  ${Type_Text} مطمعن هستید ؟ `, function () {
        if (Instance.constructor.name == 'PAGE_ELEMENT') {
            Instance.RemoveINSTANCE()
            ControlSettingsMenu_For_Element('Close')
            if (LEN_PAGES == 0) {
                let PAGE = new PAGE_ELEMENT()
            }
        } else {
            Instance.RemoveINSTANCE()
            ControlSettingsMenu_For_Element('Close')
        }
    })
}


// ---------------- Create Elements ----------------

function CreateElements_Secondary(Instance, ElementParentJSON) {
    let List_Elements = ElementParentJSON.ElementsCLASS_Secondary
    for (let Element of List_Elements) {
        let Config = Element.Config
        let Style = Element.Style
        let TypeTag = Config.TypeTag
        let InstanceElement = null
        if (TypeTag == 'Tag_H3_Title') {
            InstanceElement = Instance.Config.Create_TitleElement(Config.InnerHTML, Instance, false)
        } else if (TypeTag == 'Tag_P_Text') {
            InstanceElement = Instance.Config.Create_TextElement(Config.InnerHTML, Instance, false)
        } else if (TypeTag == 'Tag_P_Alert') {
            InstanceElement = Instance.Config.Create_AlertElement(Config.InnerHTML, Instance, false)
        } else if (TypeTag == 'Tag_IMAGE_Title') {
            InstanceElement = Instance.ConfigQuiz.Create_ImageElement()
            InstanceElement.ELEMENT.src = Element.Config.ValueImage
        } else if (TypeTag == 'Tag_VIDEO_Title') {
            InstanceElement = Instance.ConfigQuiz.Create_VideoElement()
            InstanceElement.ELEMENT.src = Element.Config.ValueVideo
        } else if (TypeTag == 'Tag_AUDIO_Title') {
            InstanceElement = Instance.ConfigQuiz.Create_AudioElement()
            InstanceElement.ELEMENT.src = Element.Config.ValueAudio
        }
        if (InstanceElement) {
            InstanceElement.id = Element.ID_Element
            InstanceElement.STATE = 'Edit'
            InstanceElement.Config.ConfigSettings = Config
            InstanceElement.Style.StyleSettings = Style
            InstanceElement.Config.__Load_Config()
            InstanceElement.Style.__Load_Styles()
        }
    }
}


function CREATE_BOX_ELEMENT(ElementJSON, Parent) {
    let INSTANCE = new BOX_BASE(true)
    for (ElementJSON of ElementJSON.GetElementsCLASS_JSON) {
        CreateElement(ElementJSON, INSTANCE)
    }
    return INSTANCE
}

function CREATE_INPUT_CHAR(ElementJSON, Parent) {
    let INSTANCE = new INPUT_CHAR(Parent)
    INSTANCE.Validation.ValidationSettings = ElementJSON.Validation
    return INSTANCE
}

function CREATE_INPUT_TEXTAREA(ElementJSON, Parent) {
    let INSTANCE = new INPUT_TEXTAREA(Parent)
    INSTANCE.Validation.ValidationSettings = ElementJSON.Validation
    return INSTANCE
}

function CREATE_INPUT_NUMBER(ElementJSON, Parent) {
    let INSTANCE = new INPUT_NUMBER(Parent)
    INSTANCE.Validation.ValidationSettings = ElementJSON.Validation
    return INSTANCE
}

function CREATE_INPUT_EMAIL(ElementJSON, Parent) {
    let INSTANCE = new INPUT_EMAIL(Parent)
    INSTANCE.Validation.ValidationSettings = ElementJSON.Validation
    return INSTANCE
}

function CREATE_INPUT_PASSWORD(ElementJSON, Parent) {
    let INSTANCE = new INPUT_PASSWORD(Parent)
    INSTANCE.Validation.ValidationSettings = ElementJSON.Validation
    return INSTANCE
}


function CREATE_INPUT_TIME(ElementJSON, Parent) {
    let INSTANCE = new INPUT_TIME(Parent)
    INSTANCE.Validation.ValidationSettings = ElementJSON.Validation
    return INSTANCE
}


function CREATE_INPUT_DATE(ElementJSON, Parent) {
    let INSTANCE = new INPUT_DATE(Parent)
    INSTANCE.Validation.ValidationSettings = ElementJSON.Validation
    return INSTANCE
}


function CREATE_INPUT_CHECKBOX(ElementJSON, Parent) {
    let INSTANCE = new INPUT_CHECKBOX(Parent)
    INSTANCE.Validation.ValidationSettings = ElementJSON.Validation
    return INSTANCE
}


function CREATE_INPUT_RADIO(ElementJSON, Parent) {
    let INSTANCE = new INPUT_RADIO(Parent)
    INSTANCE.Validation.ValidationSettings = ElementJSON.Validation
    return INSTANCE
}


function CREATE_INPUT_IMAGE(ElementJSON, Parent) {
    let INSTANCE = new INPUT_IMAGE(Parent)
    INSTANCE.Validation.ValidationSettings = ElementJSON.Validation
    INSTANCE.INPUT_MEDIA.name = `INPUT_IMAGE_${ElementJSON.ID_Element}`
    INSTANCE.INPUT_MEDIA.id = `INPUT_${ElementJSON.ID_Element}`
    return INSTANCE
}


function CREATE_INPUT_FILE(ElementJSON, Parent) {
    let INSTANCE = new INPUT_FILE(Parent)
    INSTANCE.Validation.ValidationSettings = ElementJSON.Validation
    INSTANCE.INPUT_MEDIA.name = `INPUT_FILE_${ElementJSON.ID_Element}`
    INSTANCE.INPUT_MEDIA.id = `INPUT_${ElementJSON.ID_Element}`
    return INSTANCE
}

function CREATE_TAG_P(ElementJSON, Parent) {
    let INSTANCE = new TAG_P(Parent)
    return INSTANCE
}

function CREATE_TAG_H1(ElementJSON, Parent) {
    let INSTANCE = new TAG_H1(Parent)
    return INSTANCE
}


function CREATE_TAG_H3(ElementJSON, Parent) {
    let INSTANCE = new TAG_H3(Parent)
    return INSTANCE
}


function CREATE_TAG_H6(ElementJSON, Parent) {
    let INSTANCE = new TAG_H6(Parent)
    return INSTANCE
}


function CREATE_IMAGE_ELEMENT(ElementJSON, Parent) {
    let INSTANCE = new IMAGE_BASE(Parent)
    INSTANCE.ELEMENT.src = ElementJSON.Config.ValueImage
    return INSTANCE
}


function CREATE_VIDEO_ELEMENT(ElementJSON, Parent) {
    let INSTANCE = new VIDEO_BASE(Parent)
    INSTANCE.ELEMENT.src = ElementJSON.Config.ValueVideo
    return INSTANCE
}


function CREATE_AUDIO_ELEMENT(ElementJSON, Parent) {
    let INSTANCE = new AUDIO_BASE(Parent)
    INSTANCE.ELEMENT.src = ElementJSON.Config.ValueAudio
    return INSTANCE
}

// Create Models Quiz

function CREATE_QUESTION_DESCRIPTIVE(ElementJSON, Parent) {
    let INSTANCE = new QUESTION_DESCRIPTIVE()
    INSTANCE.ConfigQuiz.ConfigSettings = ElementJSON.ConfigQuiz
    let ElementInputTextArea = ElementJSON.GetElementsCLASS_JSON[0]
    INSTANCE.INPUT_ANSWER.id = ElementInputTextArea.ID_Element
    INSTANCE.INPUT_ANSWER.Config.ConfigSettings = ElementInputTextArea.Config
    INSTANCE.INPUT_ANSWER.Style.StyleSettings = ElementInputTextArea.Style
    INSTANCE.ConfigQuiz.ConfigSettings = ElementJSON.ConfigQuiz
    if (ElementInputTextArea.Validation) {
        INSTANCE.INPUT_ANSWER.Validation.ValidationSettings = ElementInputTextArea.Validation
    }
    INSTANCE.INPUT_ANSWER.Style.__Load_Styles()
    INSTANCE.INPUT_ANSWER.Config.__Load_Config()
    INSTANCE.ConfigQuiz.__Load_Configs()
    return INSTANCE
}

function CREATE_QUESTION_TEST(ElementJSON, Parent) {
    let INSTANCE = new QUESTION_TEST()
    INSTANCE.ConfigQuiz.ConfigSettings = ElementJSON.ConfigQuiz
    let List_Input_Answer = ElementJSON.GetElementsCLASS_JSON
    for (let InputJSON of List_Input_Answer) {
        if (InputJSON.Type == 'INPUT_RADIO') {
            INSTANCE[`INPUT_ANSWER_${INSTANCE.LIST_INPUT_ANSWER.length + 1}`] = new INPUT_RADIO(INSTANCE)
            let INPUT_ANSWER = INSTANCE[`INPUT_ANSWER_${INSTANCE.LIST_INPUT_ANSWER.length + 1}`]
            INPUT_ANSWER.STATE = 'Edit'
            INPUT_ANSWER.id = InputJSON.ID_Element
            INPUT_ANSWER.Config.ConfigSettings = InputJSON.Config
            INPUT_ANSWER.Style.StyleSettings = InputJSON.Style
            INPUT_ANSWER.Validation.ValidationSettings = InputJSON.Validation
            INPUT_ANSWER.Config.__Load_Config()
            INPUT_ANSWER.Style.__Load_Styles()
            INSTANCE.LIST_INPUT_ANSWER.push(INPUT_ANSWER)
            INSTANCE.ConfigQuiz.ConfigSettings.List_Input_Answer.push(INPUT_ANSWER.id)
            INPUT_ANSWER.RemoveINSTANCE = function () {
                if (INSTANCE.ConfigQuiz.ConfigSettings.Answer_Input == INPUT_ANSWER.id) {
                    INSTANCE.ConfigQuiz.ConfigSettings.Answer_Input = ''
                    INSTANCE.ConfigQuiz.ConfigSettings.USE_ANSWER = 'false'
                }
                INSTANCE.ConfigQuiz.ConfigSettings.List_Input_Answer.filter(function (Input_ID) {
                    if (Input_ID != INPUT_ANSWER.id) {
                        return Input_ID
                    }
                })
                this.STATUS = 'DELETED'
                this.Node.remove()
                for (let Class of this.ELementsCLASS_Title) {
                    Class.STATUS = 'DELETED'
                }
                for (let Class of this.ELementsCLASS_Text) {
                    Class.STATUS = 'DELETED'
                }
                for (let Class of this.ELementsCLASS_Alert) {
                    Class.STATUS = 'DELETED'
                }
            }
            if (ElementJSON.ConfigQuiz.Answer_Input == INPUT_ANSWER.id) {
                INSTANCE.ConfigQuiz.Answer_Input(INPUT_ANSWER.id)
            }
            CreateElements_Secondary(INPUT_ANSWER, InputJSON)
        }
    }
    INSTANCE.ConfigQuiz.__Load_Configs()
    return INSTANCE
}

function CREATE_FIELD_NAMEANDFAMILY(ElementJSON, Parent) {
    let INSTANCE = new FIELD_NAMEANDFAMILY(false)
    for (ElementJSON of ElementJSON.GetElementsCLASS_JSON) {
        CreateElement(ElementJSON, INSTANCE)
    }
    return INSTANCE
}

function CREATE_FIELD_NATIONALCODE(ElementJSON, Parent) {
    let INSTANCE = new FIELD_NATIONALCODE(false)
    for (ElementJSON of ElementJSON.GetElementsCLASS_JSON) {
        CreateElement(ElementJSON, INSTANCE)
    }
    return INSTANCE
}

function CREATE_FIELD_PHONENUMBER(ElementJSON, Parent) {
    let INSTANCE = new FIELD_PHONENUMBER(false)
    for (ElementJSON of ElementJSON.GetElementsCLASS_JSON) {
        CreateElement(ElementJSON, INSTANCE)
    }
    return INSTANCE
}

function CREATE_FIELD_EMAIL(ElementJSON, Parent) {
    let INSTANCE = new FIELD_EMAIL(false)
    for (ElementJSON of ElementJSON.GetElementsCLASS_JSON) {
        CreateElement(ElementJSON, INSTANCE)
    }
    return INSTANCE
}


let DICT_FUNCTION_CREATE_ELEMENTS = {
    'INPUT_CHAR': CREATE_INPUT_CHAR,
    'INPUT_TEXTAREA': CREATE_INPUT_TEXTAREA,
    'INPUT_NUMBER': CREATE_INPUT_NUMBER,
    'INPUT_EMAIL': CREATE_INPUT_EMAIL,
    'INPUT_PASSWORD': CREATE_INPUT_PASSWORD,
    'INPUT_TIME': CREATE_INPUT_TIME,
    'INPUT_DATE': CREATE_INPUT_DATE,
    'INPUT_CHECKBOX': CREATE_INPUT_CHECKBOX,
    'INPUT_RADIO': CREATE_INPUT_RADIO,
    'INPUT_IMAGE': CREATE_INPUT_IMAGE,
    'INPUT_FILE': CREATE_INPUT_FILE,
    'BOX_ELEMENT': CREATE_BOX_ELEMENT,
    'TAG_P_ELEMENT': CREATE_TAG_P,
    'TAG_H1_ELEMENT': CREATE_TAG_H1,
    'TAG_H3_ELEMENT': CREATE_TAG_H3,
    'TAG_H6_ELEMENT': CREATE_TAG_H6,
    'TAG_IMAGE_ELEMENT': CREATE_IMAGE_ELEMENT,
    'TAG_VIDEO_ELEMENT': CREATE_VIDEO_ELEMENT,
    'TAG_AUDIO_ELEMENT': CREATE_AUDIO_ELEMENT,

    // Models Quiz

    'QUESTION_DESCRIPTIVE': CREATE_QUESTION_DESCRIPTIVE,
    'QUESTION_TEST': CREATE_QUESTION_TEST,
    'FIELD_NAMEANDFAMILY': CREATE_FIELD_NAMEANDFAMILY,
    'FIELD_NATIONALCODE': CREATE_FIELD_NATIONALCODE,
    'FIELD_PHONENUMBER': CREATE_FIELD_PHONENUMBER,
    'FIELD_EMAIL': CREATE_FIELD_EMAIL,
}


function CreateElement(ElementJSON, Parent = null) {
    let Type = ElementJSON.Type
    let Func = DICT_FUNCTION_CREATE_ELEMENTS[Type] // Create Element
    if (Func) {
        let INSTANCE = Func(ElementJSON, Parent)
        if (INSTANCE) {
            let Config = ElementJSON.Config
            let Style = ElementJSON.Style
            INSTANCE.id = ElementJSON.ID_Element
            INSTANCE.STATE = 'Edit'
            INSTANCE.Config.ConfigSettings = Config
            INSTANCE.Style.StyleSettings = Style
            INSTANCE.Config.__Load_Config()
            INSTANCE.Style.__Load_Styles()
            CreateElements_Secondary(INSTANCE, ElementJSON)
        }
    }
}


let LIMIT_SIZE_IMAGE = (1024 * 1024) // 1Mb
let LIST_TYPE_IMAGE = ['image/png', 'image/jpeg', 'image/gif']
let LIMIT_SIZE_VIDEO = (1024 * 1024) * 12 // 12Mb
let LIST_TYPE_VIDEO = ['video/mp4']
let LIMIT_SIZE_AUDIO = (1024 * 1024) * 5 // 5Mb
let LIST_TYPE_AUDIO = ['audio/mpeg']

let LIMIT_SIZE_INPUT_IMAGE = (1024 * 1024) // 1Mb
let LIMIT_SIZE_INPUT_FILE = (12 * (1024 * 1024)) // 12Mb
let LIST_TYPE_INPUT_IMAGE = ['image/png', 'image/jpeg', 'image/gif']
let LIST_TYPE_INPUT_FILE = ['image/png', 'image/jpeg', 'image/gif', 'application/x-zip-compressed', 'video/mp4', 'audio/mpeg']


function GetModelByType(Type) {
    let Model = null
    if (Type == 'BOX_ELEMENT') {
        Model = BOX_BASE
    } else if (Type == 'TAG_H1_ELEMENT') {
        Model = TAG_H1
    } else if (Type == 'TAG_H3_ELEMENT') {
        Model = TAG_H3
    } else if (Type == 'TAG_H6_ELEMENT') {
        Model = TAG_H6
    } else if (Type == 'TAG_P_ELEMENT') {
        Model = TAG_P
    } else if (Type == 'TAG_IMAGE_ELEMENT') {
        Model = IMAGE_BASE
    } else if (Type == 'TAG_VIDEO_ELEMENT') {
        Model = VIDEO_BASE
    } else if (Type == 'TAG_AUDIO_ELEMENT') {
        Model = AUDIO_BASE
    } else if (Type == 'INPUT_CHAR') {
        Model = INPUT_CHAR
    } else if (Type == 'INPUT_TEXTAREA') {
        Model = INPUT_TEXTAREA
    } else if (Type == 'INPUT_NUMBER') {
        Model = INPUT_NUMBER
    } else if (Type == 'INPUT_EMAIL') {
        Model = INPUT_EMAIL
    } else if (Type == 'INPUT_PASSWORD') {
        Model = INPUT_PASSWORD
    } else if (Type == 'INPUT_TIME') {
        Model = INPUT_TIME
    } else if (Type == 'INPUT_DATE') {
        Model = INPUT_DATE
    } else if (Type == 'INPUT_CHECKBOX') {
        Model = INPUT_CHECKBOX
    } else if (Type == 'INPUT_RADIO') {
        Model = INPUT_RADIO
    } else if (Type == 'INPUT_IMAGE') {
        Model = INPUT_IMAGE
    } else if (Type == 'INPUT_FILE') {
        Model = INPUT_FILE
    } else if (Type == 'QUESTION_DESCRIPTIVE') {
        Model = QUESTION_DESCRIPTIVE
    } else if (Type == 'QUESTION_TEST') {
        Model = QUESTION_TEST
    } else if (Type == 'FIELD_NAMEANDFAMILY') {
        Model = FIELD_NAMEANDFAMILY
    } else if (Type == 'FIELD_NATIONALCODE') {
        Model = FIELD_NATIONALCODE
    } else if (Type == 'FIELD_PHONENUMBER') {
        Model = FIELD_PHONENUMBER
    } else if (Type == 'FIELD_EMAIL') {
        Model = FIELD_EMAIL
    }
    return Model
}
