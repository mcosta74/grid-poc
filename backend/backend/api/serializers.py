from rest_framework import serializers
from .models import Person, UserCloneGroup


class PersonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Person
        fields = '__all__'


class UserCloneGroupSerializer(serializers.ModelSerializer):

    is_group = serializers.BooleanField()

    class Meta:
        model = UserCloneGroup
        fields = '__all__'

    def create(self, validated_data):
        validated_data['parent_id'] = validated_data.get('parent_id', UserCloneGroup.ROOT_ID)
        instance = UserCloneGroup.objects.create(
            **validated_data
        )
        return instance
