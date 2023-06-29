import os
import datetime
from dotenv import load_dotenv

from flask import Flask, request, render_template, url_for, redirect, session
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from flask_restful import Api, Resource, abort

import api.routes.routes as routes

from flask_dance.contrib.google import google, make_google_blueprint
os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = '1'
os.environ["OAUTHLIB_RELAX_TOKEN_SCOPE"] = '1'

app = Flask(__name__)
app.app_context().push()

basedir = os.getcwd() # get path to current directory
dotenv_path = os.path.join(basedir, '.env')
load_dotenv(dotenv_path) # loads .env

app.config['SECRET_KEY'] = os.environ.get('SECRET')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'data.sqlite')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['PREFERRED_URL_SCHEME'] = 'https'



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
        return {'Task': (self.id, self.task_text, self.is_done)}
    

    def __repr__(self):
        return f'{self.id}: {self.task_text}'
    


### ROUTES
blueprint = make_google_blueprint(
    client_id=os.environ.get('client_id'),
    client_secret=os.environ.get('client_secret'),
    scope=["profile", "email"],
    offline=True,
    redirect_url="/"  # Rota personalizada para redirecionamento após a autenticação do Google
)

app.register_blueprint(blueprint, url_prefix="/login")


@app.route("/")
def home():
    if google.authorized:
        resp = google.get("/oauth2/v2/userinfo")
        assert resp.ok, resp.text
        email = resp.json()["email"]
        return f"Logged in as: {email}"
    return "Not logged in"


@app.route("/login/")
def google_login():
    if not google.authorized:
        return redirect(url_for("google.login"))  # Redireciona para a rota de login do Google
    return redirect(url_for("home"))  # Redireciona para a página inicial após a autenticação


@app.route("/logout/")
def logout():
    if google.authorized:
        # Revoga o token de acesso do Google
        token = blueprint.token["access_token"]
        resp = google.post(
            "https://accounts.google.com/o/oauth2/revoke",
            params={"token": token},
            headers={"Content-Type": "application/x-www-form-urlencoded"},
        )
        if resp.ok:
            # Remove as informações de autenticação da sessão
            del blueprint.token
            session.clear()
    return redirect(url_for("home"))


api_app = Api(app)
api_app.add_resource(routes.TasksRoutes, '/task/<string:text>')
api_app.add_resource(routes.AllTasks, '/task')