from rest_framework import serializers
from .models import CustomUser
from django.contrib.auth import authenticate
from .models import CustomUser as User
from django.contrib.auth.password_validation import validate_password

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ['email', 'username', 'password', 'first_name', 'last_name']
        
    def create(self, validated_data):
        password = validated_data.pop('password')
        user = CustomUser(**validated_data)
        user.set_password(password)
        user.save()
        return user

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(email=data['email'], password=data['password'])
        if user is None:
            raise serializers.ValidationError("Credenciais inválidas")
        return {'user': user}


class UserSerializer(serializers.ModelSerializer):
    """
    Para GET/PUT/PATCH/DELETE em /api/users/me/
    """
    class Meta:
        model  = User
        fields = ('id', 'email', 'first_name', 'last_name')


class PasswordChangeSerializer(serializers.Serializer):
    old_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(
        write_only=True,
        validators=[validate_password]
    )
    