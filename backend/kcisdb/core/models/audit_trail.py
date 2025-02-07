import uuid
from django.db import models

class AuditTrail(models.Model):
    created_date = models.DateField(auto_now_add=True)
    created_by = models.UUIDField(default=uuid.uuid4, editable=False)
    last_modified_date = models.DateField(auto_now=True)
    last_modified_by = models.UUIDField(null=True, editable=False)
    deleted_date = models.DateField(null=True, blank=True)
    deleted_by = models.UUIDField(null=True, blank=True, editable=False),
    remarks = models.CharField(max_length=5000, blank=True)
    is_deleted = models.BooleanField(default=False)

    class Meta:
        abstract = True  # This makes it a base model for inheritance, not a database table
