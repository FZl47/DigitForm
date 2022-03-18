from django.shortcuts import render


def Handler_500(request,exception=None):
    return render(request,'Erros/500.html')

def Handler_404(request,exception):
    return render(request,'Erros/404.html')

def Handler_403(request,exception=None):
    return render(request,'Erros/403.html')