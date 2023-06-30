from django.db import models

class Category(models.Model):
    name = models.CharField(verbose_name="Name", max_length=100)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Categories"
    def __str__(self) -> str:
        return self.name



class Product(models.Model):
    name = models.CharField(verbose_name="Name", max_length=200)
    available = models.BooleanField()
    categories = models.ManyToManyField(to=Category, related_name="products")
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Products"

    def __str__(self):
        return self.name


class ProductPicture(models.Model):
    image = models.ImageField(verbose_name="Image", upload_to="img/products")
    product = models.ForeignKey(
        to=Product,
        on_delete=models.CASCADE,
        related_name="images",
        verbose_name="Product",
    )    

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
