
from collections import OrderedDict
from django.contrib.auth.models import User, Group
from rest_framework import serializers
from .models import Product, Category, ProductPicture
from drf_extra_fields.fields import Base64ImageField

class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'is_staff']
     
class RegisterUserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'password']


    def create(self, validated_data):
        user =  User(**validated_data)
        user.set_password(validated_data['password'])
        user.is_active = False
        user.save()        
        return user

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name'] 

class ProductPictureSerializer(serializers.ModelSerializer):
    image = Base64ImageField(required=False)
    class Meta:
        model = ProductPicture
        fields = ['id', 'image']

    
    def to_internal_value(self, data):
        if data.get('id'):
            values = OrderedDict()
            values['id'] = data.get('id')
            return values
        else: 
            return super(ProductPictureSerializer, self).to_internal_value(data)

class ProductSerializer(serializers.ModelSerializer):
    
    images = ProductPictureSerializer(many=True, required=False)

    class Meta:
        model = Product
        fields = ["id",'categories', 'name', 'images', 'available']

    def create(self, validated_data):
        
        pictures_data = validated_data.pop('images', [])
        
        product = Product.objects.create(**validated_data)
        for picture in pictures_data:
            ProductPicture.objects.create(product=product, **picture)
        
        return product

    def update(self, instance, validated_data):
        
        pictures_data = validated_data.pop('images', [])
        ids = set([pic.get('id', None) for pic in pictures_data])
        
        ProductPicture.objects.filter(product=instance).exclude(id__in=ids).delete()   
        for picture in pictures_data:
            if not picture.get('id', None):
                print(picture)
                ProductPicture.objects.create(product=instance, **picture)

        return super().update(instance, validated_data)
    

class ReadProductSerializer(ProductSerializer):
    categories = CategorySerializer(many=True, read_only=True)