from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import DonationViewSet, DonorListView

router = DefaultRouter()
router.register(r'donations', DonationViewSet, basename='donation')


urlpatterns = [
    path('', include(router.urls)),
    path('donors/', DonorListView.as_view(), name='donor-list'),
    # outras rotas do donations…
]