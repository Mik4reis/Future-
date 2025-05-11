from django.db import models
from django.conf import settings

class Donation(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='donations'
    )
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateTimeField(auto_now_add=True)
    
    pos_x      = models.FloatField(null=True, blank=True)
    pos_y      = models.FloatField(null=True, blank=True)
    pos_z      = models.FloatField(null=True, blank=True)

    def __str__(self):
        return f"{self.user.email}: {self.amount} em {self.date.strftime('%Y-%m-%d')}"
