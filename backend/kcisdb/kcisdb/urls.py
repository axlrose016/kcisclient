"""
URL configuration for kcisdb project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from core import views

urlpatterns = [
    path('admin/', admin.site.urls),

    #Settings API
    path('api/roles/', views.get_roles, name = "get_roles"),
    path('api/modules/', views.get_modules, name = "get_modules"),
    path('api/permissions/', views.get_permissions, name = "get_permissions"),
    path('api/lib_ancestral_domain/', views.get_lib_ancestral_domain, name ="get_lib_ancestral_domain"),
    path('api/lib_city/', views.get_lib_city, name ="get_lib_city"),
    path('api/lib_civil_status/', views.get_lib_civil_status, name="get_lib_civil_status"),
    path('api/lib_educational_attainment/', views.get_lib_educational_attainment, name="get_lib_educational_attainment"),
    path('api/lib_fund_source/', views.get_lib_fund_source, name="get_lib_fund_source"),
    path('api/lib_lgu_level/', views.get_lib_lgu_level, name="get_lib_lgu_level"),
    path('api/lib_lgu_position/', views.get_lib_lgu_position, name="get_lib_lgu_position"),
    path('api/lib_mode/', views.get_lib_mode, name="get_lib_mode"),
    path('api/lib_occupation/', views.get_lib_occupation, name="get_lib_occupation"),
    path('api/lib_province/', views.get_lib_province, name="get_lib_province"),
    path('api/lib_region/', views.get_lib_region, name="get_lib_region"),
    path('api/lib_sex/', views.get_lib_sex, name="get_lib_sex"),
    path('api/lib_ancestral_domain_coverage', views.get_lib_ancestral_domain_coverage, name="get_lib_ancestral_domain_coverage"),
    path('api/lib_brgy/', views.get_lib_brgy, name="get_lib_brgy"),
    path('api/lib_cycle/', views.get_lib_cycle, name="get_lib_cycle")
]
