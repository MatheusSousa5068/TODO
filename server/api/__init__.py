import os
import datetime
from dotenv import load_dotenv

from flask import Flask, request
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from flask_restful import Api, Resource, abort

import api.routes.routes as routes


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

    

    


api_app = Api(app)
api_app.add_resource(routes.TasksRoutes, '/task/<string:text>')
api_app.add_resource(routes.AllTasks, '/task')