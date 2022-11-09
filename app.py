from flask import Flask, redirect, request, session
from flask_session import Session
import MongoDatabase
import json

app = Flask(__name__, static_url_path='', static_folder='ui/build/')
database = MongoDatabase.MongoVars()
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)


@app.route('/projects')
def projects():
    if 'userid' in session:
        return app.send_static_file('index.html')
    else:
        return redirect('/login')

@app.route('/newUser')
def newUser():
    if 'userid' in session:
        return redirect('/projects')
    else:
        return app.send_static_file('index.html')

@app.route('/logout')
def logout():
    session.pop('userid', None)
    return redirect('/')

@app.route('/login')
def login():
    if 'userid' in session:
        return redirect('/projects')
    else:
        return app.send_static_file('index.html')

@app.route('/login/start', methods = ['POST'])
def loginStart():
    if request.method == 'POST':
        if database.validUser(request.form['userid'], request.form['password']):
            session['userid'] = request.form['userid']
            return {"valid": True, "message": ""}
        else:
            return {"valid": False, "message": "Incorrect userID/password"}

@app.route('/')
def home():
    if 'userid' in session:
        return redirect('/projects')
    else:
        return redirect('/login')

@app.route('/newUser/create', methods = ['POST'])
def createUser():
    if request.method == 'POST':
        if database.addUser(str(request.form['nm']), str(request.form['userid']), str(request.form['password'])):
            session['userid'] = request.form['userid']
            return {"valid": True}
        else:
            return {"valid": False, "message": "UserID already taken"}

@app.route('/projects/newProject/create', methods = ['POST'])
def createProject():
    if request.method == 'POST':
        memberList = request.form['members'].split()
        for member in memberList:
            if not database.userExists(member):
                message = "UserID " + member + " does not exist"
                return {"valid": False, "message": message}
        if database.createProject(request.form['projnm'], request.form['projid'], request.form['description'], session['userid'], request.form['members']):
            return {"valid": True}
        else:
            return {"valid": False, "message": "ProjectID already taken"}

@app.route('/projects/list')
def projectList():
    result = json.dumps(database.getUserProjects(session['userid']))
    return result

@app.route('/projects/newProject')
def newProject():
    if 'userid' in session:
        return app.send_static_file('index.html')
    else:
        return redirect('/login')

@app.route('/projects/checkIn/<projectid>/<int:setNum>/<int:qty>')
def checkOut_hardware(projectid, setNum, qty):
     result = database.checkInHW(projectid, setNum, qty)
     return json.dumps(result)


@app.route('/projects/checkOut/<projectid>/<int:setNum>/<int:qty>')
def checkIn_hardware(projectid, setNum, qty):
    result = database.checkOutHW(projectid, setNum, qty)
    return json.dumps(result)


@app.route('/projects/join/<projectid>')
def joinProject(projectid):
    print("Trying to join project: ", projectid)
    project = database.getProject(projectid)
    hw1 = database.getHWAvailable(1)
    hw2 = database.getHWAvailable(2)
    
    return {
            'Name': project['Name'], 
            'Description': project['Description'],
            'Admin': project['Admin'],
            'Members': project['Members'],
            'HW1Out': project['HW1Out'],
            'HW2Out': project['HW2Out'],
            'HW1Available': hw1,
            'HW2Available': hw2
        }


# @app.route('/projects/leave/<projectid>')
# def leaveProject(projectid):
#     message = "left project: " + projectid
#     return {"message": message}

@app.errorhandler(404)
def not_found(e):
    return app.send_static_file('index.html')

if __name__ == '__main__':
    # instantiate db object
    flask_app.run(host='0.0.0.0', debug=False, port=os.environ.get('PORT', 80))