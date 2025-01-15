from rest_framework import serializers
from django.db.models import Sum
from .models import Account, Category, Transaction, Budget, BudgetNotification


class AccountSerializer(serializers.ModelSerializer):
    total_balance = serializers.SerializerMethodField()

    class Meta:
        model = Account
        exclude = ["user"]

    def get_total_balance(self, obj):
        return obj.balance


class CategorySerializer(serializers.ModelSerializer):
    subcategories = serializers.SerializerMethodField()
    total_spending = serializers.SerializerMethodField()

    class Meta:
        model = Category
        exclude = ["user"]

    def get_subcategories(self, obj):
        return CategorySerializer(obj.get_children(), many=True).data

    def get_total_spending(self, obj):
        return (
            Transaction.objects.filter(category=obj, type="OUT").aggregate(
                total=Sum("amount")
            )["total"]
            or 0
        )


class TransactionSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source="category.name", read_only=True)
    account_name = serializers.CharField(source="account.name", read_only=True)

    class Meta:
        model = Transaction
        exclude = ["user"]
        read_only_fields = ["category_name", "account_name"]


class BudgetSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source="category.name", read_only=True)
    progress = serializers.SerializerMethodField()

    class Meta:
        model = Budget
        exclude = ["user"]
        read_only_fields = ["category_name"]

    def get_progress(self, obj):
        total_spent = (
            Transaction.objects.filter(
                category=obj.category,
                date__range=[obj.start_date, obj.end_date],
                type="OUT",
            ).aggregate(total=Sum("amount"))["total"]
            or 0
        )

        return {
            "total_spent": total_spent,
            "remaining": obj.limit - total_spent,
            "percentage_used": (total_spent / obj.limit * 100) if obj.limit > 0 else 0,
        }


class BudgetNotificationSerializer(serializers.ModelSerializer):
    budget_name = serializers.CharField(source="budget.category.name", read_only=True)

    class Meta:
        model = BudgetNotification
        exclude = ["user"]
        read_only_fields = ["budget_name"]


class TransactionReportSerializer(serializers.Serializer):
    period = serializers.DictField(child=serializers.DateField())
    summary = serializers.DictField(
        child=serializers.DecimalField(max_digits=10, decimal_places=2)
    )
    by_category = serializers.ListField(
        child=serializers.DictField(
            child=serializers.DecimalField(max_digits=10, decimal_places=2)
        )
    )
    by_account = serializers.ListField(
        child=serializers.DictField(
            child=serializers.DecimalField(max_digits=10, decimal_places=2)
        )
    )
    daily_totals = serializers.ListField(
        child=serializers.DictField(
            child=serializers.DecimalField(max_digits=10, decimal_places=2)
        )
    )

    def validate_period(self, value):
        if value["start_date"] > value["end_date"]:
            raise serializers.ValidationError("End date must be after start date")
        return value


class TransactionVisualizationSerializer(serializers.Serializer):
    time_series = serializers.ListField(
        child=serializers.DictField(
            child=serializers.DecimalField(max_digits=10, decimal_places=2)
        )
    )
    category_distribution = serializers.ListField(
        child=serializers.DictField(
            child=serializers.DecimalField(max_digits=10, decimal_places=2)
        )
    )
