from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.user_login, name='login'),
    path('add_todo/', views.add_todo, name='add_todo'),
    path('update_todo/<int:todo_id>/', views.update_todo, name='update_todo'),
    path('delete_todo/<int:todo_id>/', views.delete_todo, name='delete_todo'),
    path('todos/', views.list_todos, name='todos'),
]
