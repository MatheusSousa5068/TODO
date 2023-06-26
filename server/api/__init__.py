import os
import datetime
from dotenv import load_dotenv

from flask import Flask, request
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from flask_restful import Api
from flask_restful import Api, Resource



app = Flask(__name__)
app.app_context().push()

basedir = os.getcwd() # get path to current directory
dotenv_path = os.path.join(basedir, '.env')
load_dotenv(dotenv_path) # loads .env

app.config['SECRET_KEY'] = os.environ.get('SECRET')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'data.sqlite')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False


db = SQLAlchemy(app)
Migrate(app, db)


class Task(db.Model):
    __tablename__ = 'tasks'

    id = db.Column(db.Integer, primary_key=True)
    task_text = db.Column(db.String(64))
    date = db.Column(db.DateTime, nullable=False, default=datetime.datetime.now(datetime.timezone.utc))

    def __init__(self, task_text):
        self.task_text = task_text

    def json(self):
        return {'Task': self.task_text}
    

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
        task.task_text = request.json['new_text']
        db.session.commit()

        return task.json()

    
class AllTasks(Resource):
    def get(self):
        return [task.json() for task in Task.query.all()]
    


api_app = Api(app)
api_app.add_resource(TasksRoutes, '/task/<string:text>')
api_app.add_resource(AllTasks, '/task')

    



