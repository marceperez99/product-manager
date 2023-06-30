from django.contrib import admin
from .models import Product, ProductPicture, Category
# Register your models here.
admin.site.register(Product)
admin.site.register(ProductPicture)
admin.site.register(Category)
