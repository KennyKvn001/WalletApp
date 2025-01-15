from django.db import models
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from decimal import Decimal
from django.db.models import Sum
from django.utils import timezone


class Account(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    balance = models.DecimalField(max_digits=10, decimal_places=2)
    # Added for tracking creation and updates
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class Category(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    parent = models.ForeignKey("self", on_delete=models.CASCADE, null=True, blank=True)
    # Added for better category organization
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        verbose_name_plural = "Categories"

    def __str__(self):
        if self.parent:
            return f"{self.parent.name} > {self.name}"
        return self.name

    def get_children(self):
        return Category.objects.filter(parent=self)


class Transaction(models.Model):
    # transaction types
    TRANSACTION_TYPE = [("IN", "Income"), ("OUT", "Expense"), ("TRANSFER", "Transfer")]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    account = models.ForeignKey(Account, on_delete=models.CASCADE)
    category = models.ForeignKey(
        Category, on_delete=models.SET_NULL, null=True, blank=True
    )
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateField()
    description = models.TextField(blank=True)
    # New fields
    type = models.CharField(max_length=10, choices=TRANSACTION_TYPE)
    to_account = models.ForeignKey(
        Account,
        null=True,
        blank=True,
        related_name="incoming_transfers",
        on_delete=models.SET_NULL,
    )
    created_at = models.DateTimeField(default=timezone.now)

    def clean(self):
        if self.type == "TRANSFER" and not self.to_account:
            raise ValidationError("Transfer transactions require a destination account")

    def save(self, *args, **kwargs):
        # Update account balances based on transaction type
        if self.type == "IN":
            self.account.balance += self.amount
        elif self.type == "OUT":
            self.account.balance -= self.amount
        elif self.type == "TRANSFER":
            self.account.balance -= self.amount
            if self.to_account:
                self.to_account.balance += self.amount
                self.to_account.save()

        self.account.save()
        super().save(*args, **kwargs)

        # Check budget after transaction
        self._check_budget()

    def _check_budget(self):
        if self.category and self.type == "OUT":
            current_month_start = timezone.now().replace(
                day=1, hour=0, minute=0, second=0, microsecond=0
            )
            budget = Budget.objects.filter(
                category=self.category,
                start_date__lte=self.date,
                end_date__gte=self.date,
            ).first()

            if budget:
                month_total = Transaction.objects.filter(
                    category=self.category, date__gte=current_month_start, type="OUT"
                ).aggregate(Sum("amount"))["amount__sum"] or Decimal("0")

                if month_total > budget.limit:
                    # Create budget notification
                    BudgetNotification.objects.create(
                        user=self.user,
                        budget=budget,
                        message=f"Budget exceeded for {self.category.name}. Limit: {budget.limit}, Spent: {month_total}",
                    )

    def __str__(self):
        return f"{self.date} - {self.description}: ${self.amount}"


class Budget(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    limit = models.DecimalField(max_digits=10, decimal_places=2)
    start_date = models.DateField()
    end_date = models.DateField()
    # New fields
    notification_threshold = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=80,
        help_text="Percentage at which to notify (e.g., 80 for 80%)",
    )
    created_at = models.DateTimeField(default=timezone.now)

    def clean(self):
        if self.start_date > self.end_date:
            raise ValidationError("End date must be after start date")

        # Check for overlapping budgets
        overlapping = (
            Budget.objects.filter(
                category=self.category,
                start_date__lte=self.end_date,
                end_date__gte=self.start_date,
            )
            .exclude(pk=self.pk)
            .exists()
        )

        if overlapping:
            raise ValidationError("Overlapping budget exists for this category")

    def __str__(self):
        return f"{self.category.name} - ${self.limit}"


# New model for budget notifications
class BudgetNotification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    budget = models.ForeignKey(Budget, on_delete=models.CASCADE)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    read = models.BooleanField(default=False)

    def __str__(self):
        return (
            f"Notification for {self.budget.category.name} - {self.created_at.date()}"
        )
