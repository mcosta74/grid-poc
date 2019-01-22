from django.db import models


# Create your models here.
class Person(models.Model):

    first_name = models.TextField()
    last_name = models.TextField()
    date_of_birth = models.DateField()

    def __str__(self):
        return f'{self.first_name} {self.last_name} ({self.date_of_birth})'


class UserCloneGroup(models.Model):

    ROOT_ID = 99

    name = models.TextField()
    comment = models.TextField(blank=True)
    parent_id = models.IntegerField(default=ROOT_ID)

    @property
    def parent_name(self):
        if self.parent_id == self.ROOT_ID:
            return '<root>'

        try:
            return UserCloneGroup.objects.get(id=self.parent_id).name
        except UserCloneGroup.DoesNotExist:
            return '<N.A.>'

    @property
    def is_group(self):
        return UserCloneGroup.objects.filter(parent_id=self.id).exists()

    def __str__(self):
        return f'[{self.id}] {self.name} (parent={self.parent_name})'
