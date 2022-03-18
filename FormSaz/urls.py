from django.urls import path
from FormSaz import views

app_name = 'FormSaz'
urlpatterns = [
    path('View/<ID_FORM>',views.ViewFormSettings),
    path('Create/<ID_FORM>',views.CreateFormView),
    path('Edit/<ID_FORM>',views.EditFormView),
    path('CreateFormUrl',views.CreateFormUrl),
    path('DeleteForm', views.DeleteForm),
    path('CreateElementsForm',views.CreateElementsForm),
    path('ChangeInfoForm',views.ChangeInfoForm),
    path('SubmitRecord/<ID_FORM>',views.SubmitRecord),
    path('SubmitViewRecord/<ID_FORM>',views.SubmitViewRecord),
    path('Trc/Show/<ID_FORM>/<TrackingCode>',views.TrackingCodeShow),
    path('Trc/Check/<ID_FORM>/<TrackingCode>',views.TrackingCodeCheck),
    path('<ID_FORM>/Record/<Record_id>',views.ShowRecord),
    path('<ID_FORM>/Record/<Record_id>/SubmitMessage',views.SubmitMessageRecord),
    path('<ID_FORM>/Record/<Record_id>/Delete',views.DeleteRecord),
]