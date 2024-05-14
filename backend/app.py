from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
import os

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///todo.db'
db = SQLAlchemy(app)

class ToDoItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    text = db.Column(db.String(200), nullable=False)
    completed = db.Column(db.Boolean, default=False)
    due_date = db.Column(db.DateTime)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(128))
    todos = db.relationship('ToDoItem', backref='user', lazy=True)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

@app.route('/add_todo', methods=['POST'])
def add_todo():
    # Get the data from the request
    data = request.get_json()
    text = data['text']
    due_date = data['due_date']
    user_id = data['user_id']
    # Create a new ToDoItem with the data
    new_todo = ToDoItem(text=text, due_date=due_date, user_id=user_id)
    # Add the new ToDoItem to the database
    db.session.add(new_todo)
    db.session.commit()
    return 'Todo created', 201

if __name__ == '__main__':
    db.create_all()
    app.run(debug=True)
