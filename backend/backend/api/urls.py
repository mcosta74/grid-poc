from rest_framework import routers

from . import views

router = routers.SimpleRouter()
router.register(r'persons', views.PersonView)
router.register(r'clients', views.ClientView)

urlpatterns = [

] + router.urls
