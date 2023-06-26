import os
import datetime
from dotenv import load_dotenv

from flask import Flask, request
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from flask_restful import Api, Resource, abort



app = Flask(__name__)
app.app_context().push()

basedir = os.getcwd() # get path to current directory
dotenv_path = os.path.join(basedir, '.env')
load_dotenv(dotenv_path) # loads .env

app.config['SECRET_KEY'] = os.environ.get('SECRET')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'server', 'data.sqlite')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False


db = SQLAlchemy(app)
Migrate(app, db)


class Task(db.Model):
    __tablename__ = 'tasks'

    id = db.Column(db.Integer, primary_key=True)
    task_text = db.Column(db.String(64))
    date = db.Column(db.DateTime, nullable=False, default=datetime.datetime.now(datetime.timezone.utc))
    is_done = db.Column(db.Boolean, default=False)

    def __init__(self, task_text):
        self.task_text = task_text

    def json(self):
        return {'Task': (self.task_text, self.is_done)}
    

    def __repr__(self):
        return f'{self.id}: {self.task_text}'
    


### ROUTES
class TasksRoutes(Resource):
    def post(self, text):
        task = Task(task_text=text)
        db.session.add(task)
        db.session.commit()

        return task.json()


    def put(self, text):
        task = Task.query.filter_by(task_text=text).first()

        if task:
            if 'new_text' in request.json:
                task.task_text = request.json['new_text']
                
            if 'status' in request.json:
                task.is_done = not task.is_done

            db.session.commit()
            return task.json()
        
        abort(404, message="Task not found.")
    

    def delete(self, text):
        task = Task.query.filter_by(task_text=text).first()

        if task:
            db.session.delete(task)
            db.session.commit()

            return {'note': 'deleted'}
    
        abort(404, message="Task not found.")

    
class AllTasks(Resource):
    def get(self):
        return [task.json() for task in Task.query.all()]
    


api_app = Api(app)
api_app.add_resource(TasksRoutes, '/task/<string:text>')
api_app.add_resource(AllTasks, '/task')