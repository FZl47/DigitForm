let COUNTER_QUESTION = 0
let LIST_INSTANCE_QUIESTION = []

class ConfigBaseQuiz {
    constructor(Instance) {
        this.Instance = Instance
        this.ConfigSettings = {
            'USE_SCORE': 'true',
            'USE_ANSWER': 'true',
            'NumberQuestion': '',
            'Score': '0',
            'Answer': '',
            'Answer_Input': '', // ID Input
            'List_Input_Answer': [] // ID Input
        }
    }

    Create_ImageElement() {
        let Image = new IMAGE_BASE(this.Instance, true)
        Image.Style.Width_Unit('auto')
        Image.Style.Height_Unit('auto')
        Image.Style.TextAlign('Center')
        Image.Config.ConfigSettings.TypeTag = 'Tag_IMAGE_Title'
        this.Instance.Node.insertBefore(Image.Node, this.Instance.Node.firstElementChild)
        this.Instance.ElementsCLASS_Secondary = [Image, ...this.Instance.ElementsCLASS_Secondary]
        //this.Instance.ElementsCLASS.unshift(Image)
        return Image

    }

    Create_VideoElement() {
        let Video = new VIDEO_BASE(this.Instance, true)
        Video.Style.TextAlign('Center')
        Video.Config.ConfigSettings.TypeTag = 'Tag_VIDEO_Title'
        this.Instance.Node.insertBefore(Video.Node, this.Instance.Node.firstElementChild)
        this.Instance.ElementsCLASS_Secondary = [Video, ...this.Instance.ElementsCLASS_Secondary]
        //this.Instance.ElementsCLASS.unshift(Video)
        return Video
    }

    Create_AudioElement() {
        let Audio = new AUDIO_BASE(this.Instance, true)
        Audio.Style.TextAlign('Center')
        Audio.Config.ConfigSettings.TypeTag = 'Tag_AUDIO_Title'
        this.Instance.Node.insertBefore(Audio.Node, this.Instance.Node.firstElementChild)
        this.Instance.ElementsCLASS_Secondary = [Audio, ...this.Instance.ElementsCLASS_Secondary]
        //this.Instance.ElementsCLASS.unshift(Audio)
        return Audio
    }

    Btns_Add_Element_Quiz() {
        let Btns = `
            <div class="d-flex justify-content-between text-center">
                <button class="BtnAddDesSettings" ActionInputSettings_OnClick_Type="Create_ImageElement" ActionInputSettings_OnClick_TypeBase="ConfigQuiz" ActionInputSettings_OnClick="${this.Instance.IndexInInstance}">
                    <p>افزودن عکس</p>
                    <i class="far fa-plus"></i>
                </button>
                <button class="BtnAddDesSettings" ActionInputSettings_OnClick_Type="Create_VideoElement" ActionInputSettings_OnClick_TypeBase="ConfigQuiz" ActionInputSettings_OnClick="${this.Instance.IndexInInstance}">
                    <p>افزودن ویدئو</p>
                    <i class="far fa-plus"></i>
                </button>
                <button class="BtnAddDesSettings" ActionInputSettings_OnClick_Type="Create_AudioElement" ActionInputSettings_OnClick_TypeBase="ConfigQuiz" ActionInputSettings_OnClick="${this.Instance.IndexInInstance}">
                    <p>افزودن صدا</p>
                    <i class="far fa-plus"></i>
                </button>
            </div>
        `
        CreateInputItemSettings('', Btns)
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

    Score(Val, Instance, Input) {
        this.Instance.NODE_SCORE_QUESTION.innerHTML = ` ${Val} نمره `
        this.ConfigSettings.Score = Val
        this.AppendConfig('Score', Val)
    }

    USE_SCORE(Val, Input, Instance) {
        if (Val == 'true') {
            this.Instance.NODE_SCORE_QUESTION.classList.remove('d-none')
            this.Container_Input_Score_Quiz.classList.remove('d-none')
        } else {
            this.Instance.NODE_SCORE_QUESTION.classList.add('d-none')
            this.Container_Input_Score_Quiz.classList.add('d-none')
        }
        this.Instance.ConfigQuiz.ConfigSettings['USE_SCORE'] = Val
        this.Instance.ConfigQuiz.AppendConfig('USE_SCORE', Val)
    }

    USESCORE_Initial() {
        let Node = `
            <div class="text-center w-100">
               <div class="CONTAINER_INPUT_RADIO">
                    <input type="radio" name="InputRadioSetScoreFormQiuz" value="false" class="m-auto" ${this.ConfigSettings.USE_SCORE == 'false' ? 'checked' : ''} ActionInputSettings_OnInput_Type="USE_SCORE" ActionInputSettings_OnInput_TypeBase="ConfigQuiz" ActionInputSettings_OnInput="${this.Instance.IndexInInstance}">
                    <p>غیر فعال</p>
               </div>
               <div class="CONTAINER_INPUT_RADIO">
                    <input type="radio" name="InputRadioSetScoreFormQiuz" value="true" class="m-auto" ${this.ConfigSettings.USE_SCORE == 'true' ? 'checked' : ''} ActionInputSettings_OnInput_Type="USE_SCORE" ActionInputSettings_OnInput_TypeBase="ConfigQuiz" ActionInputSettings_OnInput="${this.Instance.IndexInInstance}">
                    <p>فعال</p>
               </div>
            </div>
        `
        this.Container_Input_Score_Quiz = `<input type="number" class="m-auto"  value="${this.ConfigSettings.Score}" ActionInputSettings_OnInput_Type="Score" ActionInputSettings_OnInput_TypeBase="ConfigQuiz" ActionInputSettings_OnInput="${this.Instance.IndexInInstance}">`
        CreateInputItemSettings('درنظر گرفتن نمره :', Node)
        this.Container_Input_Score_Quiz = CreateInputItemSettings('نمره سوال :', this.Container_Input_Score_Quiz)
        this.USE_SCORE(this.ConfigSettings.USE_SCORE)
    }

    Answer(Val, Instance, Input) {
        this.ConfigSettings.Answer = Val
        this.AppendConfig('Answer', Val)
    }

    USE_ANSWER(Val, Input, Instance) {
        if (Val == 'true') {
            this.Container_Input_Answer_Quiz.classList.remove('d-none')
        } else {
            this.Container_Input_Answer_Quiz.classList.add('d-none')
        }
        this.Instance.ConfigQuiz.ConfigSettings['USE_ANSWER'] = Val
        this.Instance.ConfigQuiz.AppendConfig('USE_ANSWER', Val)
    }

    USEANSWER_Initial() {
        let Node = `
            <div class="text-center w-100">
               <div class="CONTAINER_INPUT_RADIO">
                    <input type="radio" name="InputRadioSetAnswerFormQiuz" value="false" class="m-auto" ${this.ConfigSettings.USE_ANSWER == 'false' ? 'checked' : ''} ActionInputSettings_OnInput_Type="USE_ANSWER" ActionInputSettings_OnInput_TypeBase="ConfigQuiz" ActionInputSettings_OnInput="${this.Instance.IndexInInstance}">
                    <p>غیر فعال</p>
               </div>
               <div class="CONTAINER_INPUT_RADIO">
                    <input type="radio" name="InputRadioSetAnswerFormQiuz" value="true" class="m-auto" ${this.ConfigSettings.USE_ANSWER == 'true' ? 'checked' : ''} ActionInputSettings_OnInput_Type="USE_ANSWER" ActionInputSettings_OnInput_TypeBase="ConfigQuiz" ActionInputSettings_OnInput="${this.Instance.IndexInInstance}">
                    <p>فعال</p>
               </div>
            </div>
        `
        this.Container_Input_Answer_Quiz = `<input type="text" class="m-auto"  value="${this.ConfigSettings.Answer}" ActionInputSettings_OnInput_Type="Answer" ActionInputSettings_OnInput_TypeBase="ConfigQuiz" ActionInputSettings_OnInput="${this.Instance.IndexInInstance}">`
        CreateInputItemSettings('در نظر گرفتن جواب صحیح :', Node)
        let ContainerNote = CreateInputItemSettings('جواب صحیح :', this.Container_Input_Answer_Quiz)
        this.Container_Input_Answer_Quiz = ContainerNote
        CreateNoteItemSettings('توجه کنید اگر میخواهید برای سوال جوابی درنظر بگیرید فیلد جواب صحیح را حتما پر نمایید در صورت خالی بودن این فیلد جوابی برای این سوال ثبت نخواهد شد', ContainerNote)
        CreateNoteItemSettings('همچنین شما میتوانید از چندین جواب صحیح استفاده نمایید برای این کار کافیست هر جواب را با استفاده از علامت "-" از یکدیگر جدا کنید', ContainerNote)
        this.USE_ANSWER(this.ConfigSettings.USE_ANSWER)
    }

    Answer_Input(Val, Instance, Input) {
        if (TYPECREATEMODELS == 'Config') {
            for (let InstanteElement of this.Instance.LIST_INPUT_ANSWER) {
                if (InstanteElement.STATUS != 'DELETED') {
                    InstanteElement.Node.classList.remove('INPUT_ANSWER_SETED')
                    if (InstanteElement.id == Val) {
                        InstanteElement.Node.classList.add('INPUT_ANSWER_SETED')
                    }
                }
            }

            this.ConfigSettings.Answer_Input = Val // ID Input Answer
            this.AppendConfig('Answer_Input', Val)
        }
    }

    USEANSWERINPUT_Initial() {
        let Node = `
            <div class="text-center w-100">
               <div class="CONTAINER_INPUT_RADIO">
                    <input type="radio" name="InputRadioSetAnswerFormQiuz" value="false" class="m-auto" ${this.ConfigSettings.USE_ANSWER == 'false' ? 'checked' : ''} ActionInputSettings_OnInput_Type="USE_ANSWER" ActionInputSettings_OnInput_TypeBase="ConfigQuiz" ActionInputSettings_OnInput="${this.Instance.IndexInInstance}">
                    <p>غیر فعال</p>
               </div>
               <div class="CONTAINER_INPUT_RADIO">
                    <input type="radio" name="InputRadioSetAnswerFormQiuz" value="true" class="m-auto" ${this.ConfigSettings.USE_ANSWER == 'true' ? 'checked' : ''} ActionInputSettings_OnInput_Type="USE_ANSWER" ActionInputSettings_OnInput_TypeBase="ConfigQuiz" ActionInputSettings_OnInput="${this.Instance.IndexInInstance}">
                    <p>فعال</p>
               </div>
            </div>
        `
        this.Container_Input_Answer_Quiz = ``
        for (let InputAnswer of this.Instance.LIST_INPUT_ANSWER) {
            if (InputAnswer.STATUS != 'DELETED') {
                this.Container_Input_Answer_Quiz += `  <div class="CONTAINER_INPUT_RADIO w-100 d-block text-center"><input type="radio" value="${InputAnswer.id}" class="m-auto" name="${this.Instance.id}" ${this.ConfigSettings.Answer_Input == InputAnswer.id ? 'checked' : ''} ActionInputSettings_OnInput_Type="Answer_Input" ActionInputSettings_OnInput_TypeBase="ConfigQuiz" ActionInputSettings_OnInput="${this.Instance.IndexInInstance}"><p>${InputAnswer.ELementsCLASS_Text[0].Config.ConfigSettings.InnerHTML || ''}</p></div>  `
            }
        }

        CreateInputItemSettings('در نظر گرفتن جواب صحیح :', Node)
        let ContainerNote = CreateInputItemSettings('جواب صحیح :', this.Container_Input_Answer_Quiz)
        ContainerNote.classList.add('CONTAINER_INPUT_ANSWER_QUESTION_TEST_SETTINGS')
        this.Container_Input_Answer_Quiz = ContainerNote
        CreateNoteItemSettings('توجه کنید اگر میخواهید برای سوال جوابی درنظر بگیرید فیلد جواب صحیح را حتما پر نمایید در صورت خالی بودن این فیلد جوابی برای این سوال ثبت نخواهد شد', ContainerNote)
        this.USE_ANSWER(this.ConfigSettings.USE_ANSWER)
    }

    __Load_Configs() {
        let LIST_CONFIGS = this.Instance.LIST_CONFIGS_QUIZ || []
        for (let Config of LIST_CONFIGS) {
            this[Config](this.ConfigSettings[Config])
        }
    }

    AppendConfig(TypeConfig, Value) {
        this.Instance.DICT_CONFIG_QUIZ[TypeConfig] = Value
    }

}

class Question_Base extends BOX_BASE {
    constructor(Type, TypeText) {
        super(false)
        COUNTER_QUESTION++
        LIST_INSTANCE_QUIESTION.push(this)
        let This = this
        this.Type = Type
        this.Type_Text = TypeText
        this.ConfigQuiz = new ConfigBaseQuiz(This)
        this.ConfigQuiz.ConfigSettings.NumberQuestion = COUNTER_QUESTION
        this.DICT_CONFIG_QUIZ = {}
        this.Type_Base = 'ELEMENT_BASE_QUIZ'
        this.TypeQuestion = Type
        this.TypeTextQuestion = TypeText
        this.Style.StyleSettings.Height_Unit = 'auto'
        this.Style.Display('Block')
        this.Node.classList.add('QUESTION_BOX')
        this.NODE_COUNTER_QUESTION = document.createElement('p')
        this.NODE_COUNTER_QUESTION.classList.add('COUNTER_QUESTION')
        this.NODE_COUNTER_QUESTION.setAttribute('COUNTER_QUESTION', '')
        this.NODE_COUNTER_QUESTION.innerHTML = ` سوال${COUNTER_QUESTION} `
        this.NODE_SCORE_QUESTION = document.createElement('p')
        this.NODE_SCORE_QUESTION.classList.add('SCORE_QUESTION')
        this.NODE_SCORE_QUESTION.setAttribute('SCORE_QUESTION', '')
        this.NODE_SCORE_QUESTION.innerHTML = `${this.ConfigQuiz.ConfigSettings.Score} نمره `
        this.ELEMENT.append(this.NODE_COUNTER_QUESTION)
        this.ELEMENT.append(document.createElement('br'))
        this.ELEMENT.append(this.NODE_SCORE_QUESTION)

        if (TYPECREATEMODELS == 'Config') {
            this.BTN_SELECT_QUESTION = document.createElement('button')
            this.BTN_SELECT_QUESTION.innerHTML = `
                تنظیمات سوال
                <i class="fa fa-cog"></i>
            `

            this.BTN_SELECT_QUESTION.classList.add('BTN_SELECT_QUESTION')
            this.Node.append(this.BTN_SELECT_QUESTION)
            this.BTN_SELECT_QUESTION.addEventListener('click', function () {
                ControlSettingsMenu_For_Element('Open', This.Node, This)
            })
        }


        // Customize Config
        this.Config_Initial = function () {
            this.Config.__INFOELEMENT_Initial()
            CreateTitleSectionStylesSettings('تنظمیات کلی', 'far fa-wrench')
            this.Config.Btns_Element_Initial()
            this.ConfigQuiz.Btns_Add_Element_Quiz()
            this.ConfigQuiz.USESCORE_Initial()
            this.ConfigQuiz.USEANSWER_Initial()
        }

        // Customize Style
        this.Style.StyleSettings.TextAlign = 'Center'
        this.Style.__Load_Styles()

        // List Configs When Load Configs
        this.LIST_CONFIGS_QUIZ = ['Score', 'Answer']

    }
}

class QUESTION_DESCRIPTIVE extends Question_Base {
    constructor() {
        super('QUESTION_DESCRIPTIVE', 'سوال تشریحی');
        this.INPUT_ANSWER = new INPUT_TEXTAREA(this)
        this.INPUT_ANSWER.Style.Width_Unit('%')
        this.INPUT_ANSWER.Style.Width(98)
        this.INPUT_ANSWER.Style.Height_Unit('px')
        this.INPUT_ANSWER.Config.ConfigSettings.Placeholder = 'جواب سوال'
        this.INPUT_ANSWER.Node.classList.add('CONTAINER_INPUT_ANSWER')

        this.INPUT_ANSWER.CAN_DELETE = false

        this.INPUT_ANSWER.Config.__Load_Config()
        this.INPUT_ANSWER.Style.__Load_Styles()
        this.ConfigQuiz.ConfigSettings.Answer_Input = this.INPUT_ANSWER.id


    }
}

class QUESTION_TEST extends Question_Base {
    constructor() {
        super('QUESTION_TEST', 'سوال تستی')
        let This = this
        this.LIST_INPUT_ANSWER = []
        if (TYPECREATEMODELS == 'Config') {
            this.BTN_ADD_INPUT_ANSWER = document.createElement('button')
            this.BTN_ADD_INPUT_ANSWER.classList.add('BTN_ADD_INPUT_ANSWER')
            this.BTN_ADD_INPUT_ANSWER.innerHTML = `
            افزودن گزینه 
            <i class="fa fa-plus"></i>
            `
            this.ELEMENT.append(this.BTN_ADD_INPUT_ANSWER)
            this.BTN_ADD_INPUT_ANSWER.addEventListener('click', function () {
                This.Add_Input_Answer(This)
                ControlSettingsMenu_For_Element('Open', This.Node, This)
            })
        }


        // Customize Config
        this.Config_Initial = function () {
            this.Config.__INFOELEMENT_Initial()
            CreateTitleSectionStylesSettings('تنظمیات کلی', 'far fa-wrench')
            this.Config.Btns_Element_Initial()
            this.ConfigQuiz.Btns_Add_Element_Quiz()
            this.ConfigQuiz.USESCORE_Initial()
            this.ConfigQuiz.USEANSWERINPUT_Initial()
        }
    }

    Add_Input_Answer(Instance) {
        Instance[`INPUT_ANSWER_${Instance.LIST_INPUT_ANSWER.length + 1}`] = new INPUT_RADIO(Instance)
        let INPUT_ANSWER = Instance[`INPUT_ANSWER_${Instance.LIST_INPUT_ANSWER.length + 1}`]
        let TitleInputAnswer = INPUT_ANSWER.Config.Create_TextElement(`گزینه ${Instance.LIST_INPUT_ANSWER.length + 1}`, INPUT_ANSWER)
        Instance.LIST_INPUT_ANSWER.push(INPUT_ANSWER)
        Instance.ConfigQuiz.ConfigSettings.List_Input_Answer.push(INPUT_ANSWER.id)
        // Instance.ConfigQuiz.ConfigSettings

        INPUT_ANSWER.RemoveINSTANCE = function () {
            if (Instance.ConfigQuiz.ConfigSettings.Answer_Input == INPUT_ANSWER.id) {
                Instance.ConfigQuiz.ConfigSettings.Answer_Input = ''
                Instance.ConfigQuiz.ConfigSettings.USE_ANSWER = 'false'
                Instance.ConfigQuiz.ConfigSettings.List_Input_Answer = Instance.ConfigQuiz.ConfigSettings.List_Input_Answer.filter(function (ID) {
                    if (ID == INPUT_ANSWER.id) {
                        return false
                    } else {
                        return true
                    }
                })
            }
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
        return INPUT_ANSWER , TitleInputAnswer
    }
}

class FIELD_NAMEANDFAMILY extends BOX_BASE {
    constructor(CreateFields = true) {
        super();
        LIST_INSTANCE_QUIESTION.push(this)
        this.Type = 'FIELD_NAMEANDFAMILY'
        this.Type_Text = 'فیلد نام و نام خانوادگی'
        this.Style.Height_Unit('auto')
        this.Style.TextAlign('Right')
        this.Style.Display('Block')
        this.Style.TextAlign('Center')
        if (CreateFields == true) {
            this.TITLE_FIELD = new TAG_P(this)
            this.TITLE_FIELD.Config.InnerHTML('نام و نام خانوادگی :')
            this.INPUT_ANSWER = new INPUT_CHAR(this)
            this.INPUT_ANSWER.Config.Placeholder('نام و نام خانوادگی خود را وارد نمایید')
            this.INPUT_ANSWER.Style.Width_Unit('%')
            this.INPUT_ANSWER.Style.Width('84')

            this.TITLE_FIELD.CAN_DELETE = false
            this.INPUT_ANSWER.CAN_DELETE = false
        }

    }

}

class FIELD_NATIONALCODE extends BOX_BASE {
    constructor(CreateFields = true) {
        super();
        LIST_INSTANCE_QUIESTION.push(this)
        this.Type = 'FIELD_NATIONALCODE'
        this.Type_Text = 'فیلد کد ملی'
        this.Style.Height_Unit('auto')
        this.Style.TextAlign('Right')
        this.Style.Display('Block')
        this.Style.TextAlign('Center')
        if (CreateFields == true) {
            this.TITLE_FIELD = new TAG_P(this)
            this.TITLE_FIELD.Config.InnerHTML('کد ملی :')
            this.INPUT_ANSWER = new INPUT_NUMBER(this)
            this.INPUT_ANSWER.Config.Placeholder('کد ملی خود را وارد نمایید')
            this.INPUT_ANSWER.Style.Width_Unit('%')
            this.INPUT_ANSWER.Style.Width('84')
            this.INPUT_ANSWER.Validation.ValidationSettings.USE_LENCHAR = 'Active'
            this.INPUT_ANSWER.Validation.LenChar_Bigger(9)
            this.INPUT_ANSWER.Validation.LenChar_Less(11)

            this.TITLE_FIELD.CAN_DELETE = false
            this.INPUT_ANSWER.CAN_DELETE = false
        }
    }
}

class FIELD_PHONENUMBER extends BOX_BASE {
    constructor(CreateFields = true) {
        super();
        LIST_INSTANCE_QUIESTION.push(this)
        this.Type = 'FIELD_PHONENUMBER'
        this.Type_Text = 'فیلد شماره موبایل'
        this.Style.Height_Unit('auto')
        this.Style.TextAlign('Right')
        this.Style.Display('Block')
        this.Style.TextAlign('Center')
        if (CreateFields == true) {
            this.TITLE_FIELD = new TAG_P(this)
            this.TITLE_FIELD.Config.InnerHTML('شماره موبایل :')
            this.INPUT_ANSWER = new INPUT_NUMBER(this)
            this.INPUT_ANSWER.Config.Placeholder('شماره موبایل خود را وارد نمایید')
            this.INPUT_ANSWER.Style.Width_Unit('%')
            this.INPUT_ANSWER.Style.Width('84')
            this.INPUT_ANSWER.Validation.ValidationSettings.USE_LENCHAR = 'Active'
            this.INPUT_ANSWER.Validation.LenChar_Bigger(9)
            this.INPUT_ANSWER.Validation.LenChar_Less(12)
            this.TITLE_FIELD.CAN_DELETE = false
            this.INPUT_ANSWER.CAN_DELETE = false
        }
    }
}

class FIELD_EMAIL extends BOX_BASE {
    constructor(CreateFields = true) {
        super();
        LIST_INSTANCE_QUIESTION.push(this)
        this.Type = 'FIELD_EMAIL'
        this.Type_Text = 'فیلد ایمیل'
        this.Style.Height_Unit('auto')
        this.Style.TextAlign('Right')
        this.Style.Display('Block')
        this.Style.TextAlign('Center')
        if (CreateFields == true) {
            this.TITLE_FIELD = new TAG_P(this)
            this.TITLE_FIELD.Config.InnerHTML('ایمیل :')
            this.INPUT_ANSWER = new INPUT_EMAIL(this)
            this.INPUT_ANSWER.Config.Placeholder('ایمیل خود را وارد نمایید')
            this.INPUT_ANSWER.Style.Width_Unit('%')
            this.INPUT_ANSWER.Style.Width('84')
            this.INPUT_ANSWER.Validation.ValidationSettings.USE_LENCHAR = 'Active'
            this.INPUT_ANSWER.Validation.LenChar_Bigger(4)
            this.INPUT_ANSWER.Validation.LenChar_Less(100)

            this.TITLE_FIELD.CAN_DELETE = false
            this.INPUT_ANSWER.CAN_DELETE = false
        }
    }
}


