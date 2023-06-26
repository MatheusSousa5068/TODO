import os
from dotenv import load_dotenv

from flask import Flask

app = Flask(__name__)

basedir = os.getcwd() # get path to current directory
dotenv_path = os.path.join(basedir, '.env')
load_dotenv(dotenv_path) # loads .env

app.config['SECRET_KEY'] = os.environ.get('SECRET')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'server', 'data.sqlite')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
