from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend

from api.models import Person, UserCloneGroup
from api.serializers import PersonSerializer, UserCloneGroupSerializer


class PersonView(viewsets.ModelViewSet):
    queryset = Person.objects.all()
    serializer_class = PersonSerializer


class ClientView(viewsets.ModelViewSet):
    queryset = UserCloneGroup.objects.all()
    serializer_class = UserCloneGroupSerializer

    filter_backends = (
        DjangoFilterBackend,
        filters.OrderingFilter,
    )
    filter_fields = (
        'parent_id',
    )
    ordering_fields = (
        'id', 'name'
    )
