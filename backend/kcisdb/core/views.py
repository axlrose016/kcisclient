from django.http import JsonResponse
from core.models.library import (role, module, permission, lib_ancestral_domain, lib_city, lib_civil_status, lib_educational_attainment,
lib_fund_source, lib_lgu_level, lib_lgu_position, lib_mode, lib_occupation, lib_province, lib_region, lib_sex,
lib_ancestral_domain_coverage, lib_brgy, lib_cycle)


# Create your views here.

# Settings Views
def get_roles(request):
    roles = role.objects.values() 
    return JsonResponse(list(roles), safe=False)  

def get_modules(request):
    modules = module.objects.values()
    return JsonResponse(list(modules), safe=False)

def get_permissions(request):
    permissions = permission.objects.values() 
    return JsonResponse(list(permissions), safe=False)

def get_lib_ancestral_domain(request):
    lib_ancestral_domain = lib_ancestral_domain.objects.values()
    return JsonResponse(list(lib_ancestral_domain), safe=False)

def get_lib_city(request):
    lib_city = lib_city.objects.values()
    return JsonResponse(list(lib_city), safe=False)

def get_lib_civil_status(request):
    lib_civil_status = lib_civil_status.objects.values()
    return JsonResponse(list(lib_civil_status), safe=False)

def get_lib_educational_attainment(request):
    lib_educational_attainment = lib_educational_attainment.objects.values()
    return JsonResponse(list(lib_educational_attainment), safe=False)

def get_lib_fund_source(request):
    lib_fund_source = LibFundSourlib_fund_sourcece.objects.values()
    return JsonResponse(list(lib_fund_source), safe=False)

def get_lib_lgu_level(request):
    lib_lgu_level = lib_lgu_level.objects.values()
    return JsonResponse(list(lib_lgu_level), safe=False)

def get_lib_lgu_position(request):
    lib_lgu_position = lib_lgu_position.objects.values()
    return JsonResponse(list(lib_lgu_position), safe=False)

def get_lib_mode(request):
    lib_mode = lib_mode.objects.values()
    return JsonResponse(list(lib_mode),safe=False)

def get_lib_occupation(request):
    lib_occupation = lib_occupation.objects.values()
    return JsonResponse(list(lib_occupation),safe=False)

def get_lib_province(request):
    lib_province = lib_province.objects.values()
    return JsonResponse(list(lib_province),safe=False)

def get_lib_region(request):
    lib_region = lib_region.objects.values()
    return JsonResponse(list(lib_region),safe=False)

def get_lib_sex(request):
    lib_sex = lib_sex.objects.values()
    return JsonResponse(list(lib_sex),safe=False)

def get_lib_ancestral_domain_coverage(request):
    lib_ancestral_domain_coverage = lib_ancestral_domain_coverage.objects.values()
    return JsonResponse(list(lib_ancestral_domain_coverage),safe=False)

def get_lib_brgy(request):
    lib_brgy = lib_brgy.objects.values()
    return JsonResponse(list(lib_brgy),safe=False)

def get_lib_cycle(request):
    lib_cycle = lib_cycle.objects.values()
    return JsonResponse(list(lib_cycle),safe=False)