from django.contrib import admin
from core.models.library import module, role, permission, lib_ancestral_domain
from core.models.users import user

# Register your models here.

admin.site.register(module)
admin.site.register(role)
admin.site.register(permission)
admin.site.register(user)