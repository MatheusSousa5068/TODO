from flask import request
from flask_restful import abort, Resource
import api

class TasksRoutes(Resource):
    def post(self, text):
        task = api.Task(task_text=text)
        api.db.session.add(task)
        api.db.session.commit()

        return task.json()


    def put(self, text):
        task = api.Task.query.filter_by(task_text=text).first()

        if task:
            if 'new_text' in request.json:
                task.task_text = request.json['new_text']
                
            if 'status' in request.json:
                task.is_done = not task.is_done

            api.db.session.commit()
            return task.json()
        
        abort(404, message="Task not found.")
    

    def delete(self, text):
        task = api.Task.query.filter_by(task_text=text).first()

        if task:
            api.db.session.delete(task)
            api.db.session.commit()

            return {'note': 'deleted'}
    
        abort(404, message="Task not found.")


class AllTasks(Resource):
    def get(self):
        return [task.json() for task in api.Task.query.all()]
    
    def delete(self):
        api.Task.query.delete()
        api.db.session.commit()

        return {'note': 'deleted all tasks'}