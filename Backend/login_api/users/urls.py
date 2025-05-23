from django.urls import path
from .views import RegisterView, LoginView, UserDetailView, PasswordChangeView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/',    LoginView.as_view(),    name='login'),
    path('me/',       UserDetailView.as_view(),      name='user-detail'),
    path('me/password/', PasswordChangeView.as_view(), name='password-change'),
]
