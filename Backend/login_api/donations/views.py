from rest_framework import viewsets, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Sum

from rest_framework.permissions import IsAuthenticated
from drf_yasg.utils import swagger_auto_schema

from .models import Donation
from .serializers import DonationSerializer, DonorSerializer

class DonationViewSet(viewsets.ModelViewSet):
    # swagger_schema = None           # ← aqui! ignora TODO esse viewset no Swagger
    permission_classes = [IsAuthenticated]
    serializer_class   = DonationSerializer

    def get_queryset(self):
        if getattr(self, 'swagger_fake_view', False):
            return Donation.objects.none()
        return Donation.objects.filter(user=self.request.user).order_by('-date')

    def perform_create(self, serializer):

    @swagger_auto_schema(auto_schema=None)
    @action(detail=False, methods=['get'])
    def last(self, request):
        last = self.get_queryset().first()
        if not last:
            return Response({'detail': 'Sem doações ainda.'}, status=204)
        return Response(DonationSerializer(last).data)

    @swagger_auto_schema(auto_schema=None)
    @action(detail=False, methods=['get'])
    def total(self, request):
        agg = self.get_queryset().aggregate(total=Sum('amount'))
        return Response(agg)


class DonorListView(generics.ListAPIView):
    # swagger_schema = None           # ← se preferir também ocultar esse endpoint
    permission_classes = [IsAuthenticated]
    serializer_class   = DonorSerializer

    def get_queryset(self):
        return (
            Donation.objects
            .values(
                'user__id',
                'user__first_name',
                'user__last_name',
            )
            .annotate(total=Sum('amount'))
            .order_by('-total')
        )
