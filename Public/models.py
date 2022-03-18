from django.db import models


class INFO_DIGITFORM(models.Model):
    PhoneNumber = models.CharField(max_length=100,null=True,blank=True)
    Email = models.CharField(max_length=100,null=True,blank=True)
    Address = models.TextField(null=True,blank=True)
    ID_Telegram = models.CharField(max_length=100,null=True,blank=True)
    ID_Instagram = models.CharField(max_length=100,null=True,blank=True)

    # Contact Us
    ContactUs_Description = models.TextField(null=True,blank=True)

    # About Us
    AboutUs_Description = models.TextField(null=True,blank=True)


    def __str__(self):
        return 'دیجیت فرم'



class Comment(models.Model):
    NameAndFamily = models.CharField(max_length=100)
    Email = models.CharField(max_length=100)
    Text = models.TextField()
    DateTimeSubmit = models.DateTimeField(auto_now_add=True)
    Show = models.BooleanField(default=False)

    def __str__(self):
        return self.NameAndFamily


class FAQ(models.Model):
    Question = models.TextField()
    Answer = models.TextField()
    DateTimeSubmit = models.DateTimeField(auto_now_add=True)
    Show = models.BooleanField(default=False)

    def __str__(self):
        return f'{self.Question[:30]} . . .'
