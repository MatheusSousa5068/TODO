import os
os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = '1'
os.environ["OAUTHLIB_RELAX_TOKEN_SCOPE"] = '1'

from flask import render_template, url_for, redirect

from dotenv import load_dotenv
basedir = os.getcwd() # get path to current directory
dotenv_path = os.path.join(basedir, '.env')
load_dotenv(dotenv_path) # loads .env

from flask_dance.contrib.google import make_google_blueprint, google
