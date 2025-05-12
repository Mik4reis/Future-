from rest_framework import serializers
from .models import Donation

class DonationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Donation
        fields = ['id', 'amount', 'date', 'positions']
        read_only_fields = ['id', 'date']

class DonorSerializer(serializers.Serializer):
    user_id       = serializers.IntegerField(source='user__id')
    first_name    = serializers.CharField(source='user__first_name')
    last_name     = serializers.CharField(source='user__last_name')
    total_donated = serializers.DecimalField(source='total', max_digits=12, decimal_places=2)
    
class TreePositionSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Donation
        fields = ['positions']

