from api import app, db
from flask_cors import CORS



if __name__ == '__main__':
    CORS(app)
    db.create_all()
    app.run(debug=True)
