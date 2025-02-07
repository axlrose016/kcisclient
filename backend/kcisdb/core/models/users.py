import uuid
from django.db import models
from .audit_trail import AuditTrail
from .library import module, role, permission

class user(AuditTrail):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, db_index=True)
    username = models.CharField(max_length=150, unique=True)
    email = models.EmailField(unique=True, blank=False)
    first_name = models.CharField(max_length=100, blank=False)
    middle_name = models.CharField(max_length=100, blank=True)
    last_name = models.CharField(max_length=100, blank=False)
    ext_name = models.CharField(max_length=10, blank=True)
    password = models.CharField(max_length=500, blank=True)
    region_code = models.CharField(max_length=12, blank=False, default="")
    prov_code = models.CharField(max_length=12, blank=False, default="")
    city_code = models.CharField(max_length=12, blank=False, default="")
    brgy_code = models.CharField(max_length=12, blank=False, default="")

    def __str__(self):
        return self.username

class user_access(AuditTrail):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, db_index=True)
    user = models.ForeignKey(user, on_delete=models.CASCADE)
    module = models.ForeignKey(module, on_delete=models.CASCADE)
    role = models.ForeignKey(role, on_delete=models.CASCADE)
    permission = models.ForeignKey(permission, on_delete=models.CASCADE)
    
    def _str_(self):
        return self.username