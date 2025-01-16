from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import (
    AccountViewSet,
    CategoryViewSet,
    TransactionViewSet,
    BudgetViewSet,
    landing_page,
    UserRegistrationView,
)
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework import permissions

# Swagger schema view
schema_view = get_schema_view(
    openapi.Info(
        title="MyWallet API",
        default_version="v1",
        description="API documentation for the Task Force Pro Wallet application",
        contact=openapi.Contact(email="contact@Mywallet.info"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

# Router for API endpoints
router = DefaultRouter()
router.register(r"accounts", AccountViewSet, basename="account")
router.register(r"categories", CategoryViewSet, basename="category")
router.register(r"transactions", TransactionViewSet, basename="transaction")
router.register(r"budgets", BudgetViewSet, basename="budget")

# URL patterns
urlpatterns = [
    path("", landing_page, name="landing-page"),  # Landing page
    path("api/", include(router.urls)),  # API endpoints
    path(
        "auth/",
        include(
            [
                path("login/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
                path("refresh/", TokenRefreshView.as_view(), name="token_refresh"),
                path("register/", UserRegistrationView.as_view(), name="register"),
            ]
        ),
    ),
    path(
        "swagger/",
        schema_view.with_ui("swagger", cache_timeout=0),
        name="schema-swagger-ui",
    ),  # Swagger UI
    path(
        "redoc/", schema_view.with_ui("redoc", cache_timeout=0), name="schema-redoc"
    ),  # ReDoc UI
]
