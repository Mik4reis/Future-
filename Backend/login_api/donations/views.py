# donations/views.py
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Sum
from rest_framework.permissions import IsAuthenticated
from .models import Donation
from .serializers import DonationSerializer

class DonationViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = DonationSerializer

    def get_queryset(self):
        return Donation.objects.filter(user=self.request.user).order_by('-date')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['get'])
    def last(self, request):
        last = self.get_queryset().first()
        if not last:
            return Response({'detail': 'Sem doações ainda.'}, status=204)
        return Response(DonationSerializer(last).data)

    @action(detail=False, methods=['get'])
    def total(self, request):
        agg = self.get_queryset().aggregate(total=Sum('amount'))
        return Response(agg)
