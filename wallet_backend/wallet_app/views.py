from django.http import HttpResponse
from rest_framework import viewsets, status, generics, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Sum, Count, Q
from django.db.models.functions import TruncMonth, TruncDay
from datetime import datetime
from django_filters import rest_framework as filters
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from .models import Account, Category, Transaction, Budget, BudgetNotification
from .serializers import (
    AccountSerializer,
    CategorySerializer,
    TransactionSerializer,
    BudgetSerializer,
    BudgetNotificationSerializer,
    TransactionReportSerializer,
    UserRegistrationSerializer,
)


# Landing page view
def landing_page(request):
    """Landing page view that provides a welcome message and link to API documentation."""
    return HttpResponse(
        "Welcome to the My WalletApp API! Visit <a href='/swagger/'>Swagger UI</a> for documentation."
    )


class UserRegistrationView(generics.CreateAPIView):
    serializer_class = UserRegistrationSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response(
                {
                    "user": {
                        "id": user.id,
                        "username": user.username,
                        "email": user.email,
                    },
                    "message": "User registered successfully",
                }
            )
        return Response(serializer.errors, status=400)


class TransactionFilter(filters.FilterSet):
    """Filter set for Transaction model with various filtering options."""

    min_amount = filters.NumberFilter(field_name="amount", lookup_expr="gte")
    max_amount = filters.NumberFilter(field_name="amount", lookup_expr="lte")
    start_date = filters.DateFilter(field_name="date", lookup_expr="gte")
    end_date = filters.DateFilter(field_name="date", lookup_expr="lte")
    type = filters.ChoiceFilter(choices=Transaction.TRANSACTION_TYPE)

    class Meta:
        model = Transaction
        fields = [
            "account",
            "category",
            "type",
            "min_amount",
            "max_amount",
            "start_date",
            "end_date",
        ]


class AccountViewSet(viewsets.ModelViewSet):
    """ViewSet for managing Account model."""

    permission_classes = [IsAuthenticated]
    serializer_class = AccountSerializer
    queryset = Account.objects.all()

    @swagger_auto_schema(
        operation_description="List all accounts for the authenticated user.",
        responses={200: AccountSerializer(many=True)},
    )
    def list(self, request):
        return super().list(request)

    def get_queryset(self):
        """Filter queryset to return only user's accounts."""
        return self.queryset.filter(user=self.request.user)

    def perform_create(self, serializer):
        """Save the account with the authenticated user."""
        serializer.save(user=self.request.user)

    @swagger_auto_schema(
        operation_description="Get all transactions for a specific account.",
        responses={200: TransactionSerializer(many=True)},
    )
    @action(detail=True, methods=["get"])
    def transactions(self, request, pk=None):
        """Get all transactions for a specific account."""
        account = self.get_object()
        transactions = Transaction.objects.filter(account=account)
        serializer = TransactionSerializer(transactions, many=True)
        return Response(serializer.data)


class CategoryViewSet(viewsets.ModelViewSet):
    """ViewSet for managing Category model."""

    permission_classes = [IsAuthenticated]
    serializer_class = CategorySerializer
    queryset = Category.objects.all()

    @swagger_auto_schema(
        operation_description="List all categories for the authenticated user.",
        responses={200: CategorySerializer(many=True)},
    )
    def list(self, request):
        return super().list(request)

    def get_queryset(self):
        """Filter queryset to return only user's categories."""
        return self.queryset.filter(user=self.request.user)

    def perform_create(self, serializer):
        """Save the category with the authenticated user."""
        serializer.save(user=self.request.user)

    @swagger_auto_schema(
        operation_description="Get all subcategories for a specific category.",
        responses={200: CategorySerializer(many=True)},
    )
    @action(detail=True, methods=["get"])
    def subcategories(self, request, pk=None):
        """Get all subcategories for a specific category."""
        category = self.get_object()
        subcategories = Category.objects.filter(parent=category)
        serializer = CategorySerializer(subcategories, many=True)
        return Response(serializer.data)


class TransactionViewSet(viewsets.ModelViewSet):
    """ViewSet for managing Transaction model."""

    permission_classes = [IsAuthenticated]
    serializer_class = TransactionSerializer
    queryset = Transaction.objects.all()
    filterset_class = TransactionFilter

    @swagger_auto_schema(
        operation_description="List all transactions for the authenticated user.",
        responses={200: TransactionSerializer(many=True)},
    )
    def list(self, request):
        return super().list(request)

    def get_queryset(self):
        """Filter queryset to return only user's transactions."""
        return self.queryset.filter(user=self.request.user)

    def perform_create(self, serializer):
        """Save the transaction with the authenticated user."""
        serializer.save(user=self.request.user)

    @swagger_auto_schema(
        operation_description="Generate a transaction report for a specific time period.",
        manual_parameters=[
            openapi.Parameter(
                "start_date",
                openapi.IN_QUERY,
                description="Start date for the report (YYYY-MM-DD)",
                type=openapi.TYPE_STRING,
                format=openapi.FORMAT_DATE,
                required=True,
            ),
            openapi.Parameter(
                "end_date",
                openapi.IN_QUERY,
                description="End date for the report (YYYY-MM-DD)",
                type=openapi.TYPE_STRING,
                format=openapi.FORMAT_DATE,
                required=True,
            ),
        ],
        responses={
            200: TransactionReportSerializer,
            400: "Bad Request - Invalid date format or missing parameters",
        },
    )
    @action(detail=False, methods=["GET"])
    def generate_report(self, request):
        """Generate a comprehensive transaction report for a specific time period."""
        start_date = request.query_params.get("start_date")
        end_date = request.query_params.get("end_date")

        if not start_date or not end_date:
            return Response(
                {"error": "start_date and end_date are required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        transactions = Transaction.objects.filter(
            user=request.user, date__range=[start_date, end_date]
        )

        report_data = {
            "period": {"start_date": start_date, "end_date": end_date},
            "summary": {
                "total_in": transactions.filter(type="IN").aggregate(Sum("amount"))[
                    "amount__sum"
                ]
                or 0,
                "total_out": transactions.filter(type="OUT").aggregate(Sum("amount"))[
                    "amount__sum"
                ]
                or 0,
                "net": transactions.filter(type="IN").aggregate(Sum("amount"))[
                    "amount__sum"
                ]
                or 0
                - transactions.filter(type="OUT").aggregate(Sum("amount"))[
                    "amount__sum"
                ]
                or 0,
            },
            "by_category": transactions.values("category__name").annotate(
                total=Sum("amount"), count=Count("id")
            ),
            "by_account": transactions.values("account__name").annotate(
                total=Sum("amount"), count=Count("id")
            ),
            "daily_totals": transactions.annotate(day=TruncDay("date"))
            .values("day")
            .annotate(total=Sum("amount"))
            .order_by("day"),
        }

        serializer = TransactionReportSerializer(report_data)
        return Response(serializer.data)

    @swagger_auto_schema(
        operation_description="Get visualization data for transactions.",
        manual_parameters=[
            openapi.Parameter(
                "period",
                openapi.IN_QUERY,
                description="Period for visualization (monthly/yearly)",
                type=openapi.TYPE_STRING,
                required=False,
            ),
            openapi.Parameter(
                "year",
                openapi.IN_QUERY,
                description="Year for visualization",
                type=openapi.TYPE_INTEGER,
                required=False,
            ),
        ],
    )
    @action(detail=False, methods=["GET"])
    def visualization_data(self, request):
        """Get data formatted for visualization purposes."""
        period = request.query_params.get("period", "monthly")
        year = request.query_params.get("year", datetime.now().year)

        transactions = Transaction.objects.filter(user=request.user, date__year=year)

        if period == "monthly":
            data = (
                transactions.annotate(month=TruncMonth("date"))
                .values("month")
                .annotate(
                    total_in=Sum("amount", filter=Q(type="IN")),
                    total_out=Sum("amount", filter=Q(type="OUT")),
                )
                .order_by("month")
            )

        category_data = (
            transactions.values("category__name")
            .annotate(total=Sum("amount"))
            .order_by("-total")[:5]
        )

        return Response({"time_series": data, "category_distribution": category_data})


class BudgetViewSet(viewsets.ModelViewSet):
    """ViewSet for managing Budget model."""

    permission_classes = [IsAuthenticated]
    serializer_class = BudgetSerializer
    queryset = Budget.objects.all()

    @swagger_auto_schema(
        operation_description="List all budgets for the authenticated user.",
        responses={200: BudgetSerializer(many=True)},
    )
    def list(self, request):
        return super().list(request)

    def get_queryset(self):
        """Filter queryset to return only user's budgets."""
        return self.queryset.filter(user=self.request.user)

    def perform_create(self, serializer):
        """Save the budget with the authenticated user."""
        serializer.save(user=self.request.user)

    @swagger_auto_schema(
        operation_description="Get progress information for a specific budget.",
        responses={200: "Budget progress information"},
    )
    @action(detail=True, methods=["get"])
    def progress(self, request, pk=None):
        """Get progress information for a specific budget."""
        budget = self.get_object()
        total_spent = (
            Transaction.objects.filter(
                category=budget.category,
                date__range=[budget.start_date, budget.end_date],
                type="OUT",
            ).aggregate(total=Sum("amount"))["total"]
            or 0
        )

        return Response(
            {
                "budget_limit": budget.limit,
                "total_spent": total_spent,
                "remaining": budget.limit - total_spent,
                "percentage_used": (total_spent / budget.limit) * 100,
            }
        )


class BudgetNotificationViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for managing BudgetNotification model."""

    permission_classes = [IsAuthenticated]
    serializer_class = BudgetNotificationSerializer
    queryset = BudgetNotification.objects.all()

    @swagger_auto_schema(
        operation_description="List all budget notifications for the authenticated user.",
        responses={200: BudgetNotificationSerializer(many=True)},
    )
    def list(self, request):
        return super().list(request)

    def get_queryset(self):
        """Filter queryset to return only user's notifications."""
        return self.queryset.filter(user=self.request.user)

    @swagger_auto_schema(
        operation_description="Mark a notification as read.",
        responses={200: "{'status': 'notification marked as read'}"},
    )
    @action(detail=True, methods=["post"])
    def mark_as_read(self, request, pk=None):
        """Mark a specific notification as read."""
        notification = self.get_object()
        notification.read = True
        notification.save()
        return Response({"status": "notification marked as read"})
