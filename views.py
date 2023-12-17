from django.http import JsonResponse, HttpResponse
from django.views.decorators.http import require_http_methods
from django.contrib.auth import authenticate, login, logout
from .models import ToDoItem
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt
import json

@csrf_exempt
def user_login(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return JsonResponse({'message': 'Login successful'}, status=200)
        else:
            return JsonResponse({'message': 'Invalid credentials'}, status=400)
    return JsonResponse({'message': 'Only POST method allowed'}, status=405)

@csrf_exempt
@require_http_methods(["POST"])
def add_todo(request):
    if request.user.is_authenticated:
        data = json.loads(request.body)
        todo = ToDoItem(text=data.get('text'), user=request.user)
        todo.save()
        return JsonResponse({'message': 'Todo added successfully'}, status=201)
    return JsonResponse({'message': 'Unauthorized'}, status=401)

@csrf_exempt
@require_http_methods(["POST"])
def update_todo(request, todo_id):
    if request.user.is_authenticated:
        try:
            todo = ToDoItem.objects.get(id=todo_id, user=request.user)
            data = json.loads(request.body)
            todo.text = data.get('text', todo.text)
            todo.completed = data.get('completed', todo.completed)
            todo.save()
            return JsonResponse({'message': 'Todo updated successfully'}, status=200)
        except ToDoItem.DoesNotExist:
            return JsonResponse({'message': 'Todo not found'}, status=404)
    return JsonResponse({'message': 'Unauthorized'}, status=401)

@csrf_exempt
@require_http_methods(["DELETE"])
def delete_todo(request, todo_id):
    if request.user.is_authenticated:
        try:
            todo = ToDoItem.objects.get(id=todo_id, user=request.user)
            todo.delete()
            return JsonResponse({'message': 'Todo deleted successfully'}, status=200)
        except ToDoItem.DoesNotExist:
            return JsonResponse({'message': 'Todo not found'}, status=404)
    return JsonResponse({'message': 'Unauthorized'}, status=401)

@csrf_exempt
@require_http_methods(["GET"])
def list_todos(request):
    if request.user.is_authenticated:
        todos = ToDoItem.objects.filter(user=request.user).values()
        return JsonResponse(list(todos), safe=False, status=200)
    return JsonResponse({'message': 'Unauthorized'}, status=401)
