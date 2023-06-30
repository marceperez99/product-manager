from django.contrib.auth.models import User
from rest_framework import viewsets, mixins, status, permissions
from .serializers import UserSerializer, RegisterUserSerializer, ProductSerializer, CategorySerializer, ReadProductSerializer
from rest_framework.response import Response
from .models import Product, Category

class UserViewSet(mixins.CreateModelMixin, 
                   viewsets.GenericViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer
    permission_classes = []

    def create(self, request, *args, **kwargs):
        # Custom logic for the 'create' method
        # Implement your modifications or additional functionality

        # Call the parent 'create' method to perform the original behavior
        serializer = RegisterUserSerializer(data=request.data)
        if(serializer.is_valid()):
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        else:
            serializer.errors
            return Response(data= serializer.errors, status=status.HTTP_409_CONFLICT)
        # return super().create(request, *args, **kwargs)


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all().order_by('-created_at')
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticated]
    search_fields = ["name",]
    filterset_fields = ["available", "categories"]



    def get_serializer_class(self):    
        if self.action in ["retrieve", "list"]:
            return ReadProductSerializer
        return self.serializer_class



class CategoryViewSet(
                   mixins.RetrieveModelMixin, 
                   mixins.ListModelMixin,
                   viewsets.GenericViewSet):
    queryset = Category.objects.all().order_by('-created_at')
    serializer_class = CategorySerializer
    permission_classes = []