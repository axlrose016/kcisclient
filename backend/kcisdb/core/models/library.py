import uuid
from django.db import models
from .audit_trail import AuditTrail

class module(AuditTrail):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, db_index=True)
    module_description = models.CharField(max_length=250, blank=False)
    
    def __str__(self):
        return self.module_description

class role(AuditTrail):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, db_index=True)
    role_description = models.CharField(max_length=100, blank=False)

    def __str__(self):
        return self.role_description

class permission(AuditTrail):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, db_index=True)
    permission_description = models.CharField(max_length=250, blank=False)

    def __str__(self):
            return self.permission_description

class lib_region(AuditTrail):
    region_code = models.CharField(max_length=12, primary_key=True, editable=False, db_index=True)
    region_name = models.CharField(max_length=250, blank=False)
    region_nick = models.CharField(max_length=120, blank=False)
    sort_order = models.IntegerField(blank=False, default=0)
    
    def __str__(self):
        return self.region_name

class lib_province(AuditTrail):
    province_code = models.CharField(max_length=12, primary_key=True, editable=False, db_index=True)
    province_name = models.CharField(max_length=250, blank=False)
    province_nick = models.CharField(max_length=120, blank=False)
    region_code = models.ForeignKey(lib_region, on_delete=models.CASCADE)
    sort_order = models.IntegerField(blank=False, default=0)

    def __str__(self):
        return self.province_name

class lib_city(AuditTrail):
    city_code = models.CharField(max_length=12, primary_key=True, editable=False, db_index=True)
    city_name = models.CharField(max_length=250, blank=False)
    city_nick = models.CharField(max_length=120, blank=False)
    province_code = models.ForeignKey(lib_province, on_delete=models.CASCADE)
    sort_order = models.IntegerField(blank=False, default=0)

    def __str__(self):
        return self.city_name

class lib_brgy(AuditTrail):
    brgy_code = models.CharField(max_length=12, primary_key=True, editable=False, db_index=True)
    brgy_name = models.CharField(max_length=250, blank=False)
    brgy_nick = models.CharField(max_length=120, blank=False)
    city_code = models.ForeignKey(lib_city, on_delete=models.CASCADE)
    sort_order = models.IntegerField(blank=False, default=0)
    
    def __str__(self):
        return self.brgy_name

class lib_fund_source(AuditTrail):
    id = models.AutoField(primary_key=True, db_index=True)
    fund_source_description = models.CharField(max_length=128, blank=False)

    def __str__(self):
        return self.fund_source_description

class lib_cycle(AuditTrail):
    id = models.AutoField(primary_key=True, db_index=True)
    cycle_description = models.CharField(max_length=128, blank=False)
    fund_source_id = models.ForeignKey(lib_fund_source, on_delete=models.CASCADE)

    def __str__(self):
        return self.cycle_description

class lib_ancestral_domain(AuditTrail):
    id = models.AutoField(primary_key=True, db_index=True)
    ancestral_domain_description = models.CharField(max_length=250, blank=False)

    def __str__(self):
        return self.ancestral_domain_description

class lib_ancestral_domain_coverage(AuditTrail):
    id = models.AutoField(primary_key=True, db_index=True)
    ancestral_domain_id = models.ForeignKey(lib_ancestral_domain, on_delete=models.CASCADE)
    region_code = models.CharField(max_length=12, blank=False)
    prov_code = models.CharField(max_length=12, blank=False)
    city_code = models.CharField(max_length=12, blank=False)
    brgy_code = models.CharField(max_length=12, blank=False)
    ancestral_domain_coverage_description = models.CharField(max_length=250, blank=False)

    def __str__(self):
        return self.ancestral_domain_coverage_description

class lib_sex(AuditTrail):
    id = models.AutoField(primary_key=True,blank=False, default=0)
    sex_description = models.CharField(max_length=12, blank=False)

    def __str__(self):
        return self.sex_description

class lib_civil_status(AuditTrail):
    id = models.AutoField(primary_key=True, db_index=True)
    civil_status_description = models.CharField(max_length=128, blank=False)

    def __str__(self):
        return self.civil_status_description

class lib_educational_attainment(AuditTrail):
    id = models.AutoField(primary_key=True, db_index=True)
    educational_attainment_description = models.CharField(max_length=250, blank=False)

    def __str__(self):
        return self.educational_attainment_description

class lib_occupation(AuditTrail):
    id = models.AutoField(primary_key=True, db_index=True)
    occupation_description = models.CharField(max_length=250, blank=False)
    
    def __str__(self):
        return self.occupation_description

class lib_lgu_level(AuditTrail):
    id = models.AutoField(primary_key=True, db_index=True)
    lgu_level_description = models.CharField(max_length=250, blank=False)

    def __str__(self):
        return self.lgu_level_description

class lib_lgu_position(AuditTrail):
    id = models.AutoField(primary_key=True, db_index=True)
    lgu_position_description = models.CharField(max_length=250, blank=False)

    def __str__(self):
        return self.lgu_position_description

class lib_mode(AuditTrail):
    id = models.AutoField(primary_key=True,blank=False, default=0)
    mode_description = models.CharField(max_length=128, blank=False)

    def __str__(self):
        return self.mode_description
    