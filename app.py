from flask import Flask, redirect, request, session
import MongoDatabase

app = Flask(__name__, static_url_path='', static_folder='ui/build/')
database = MongoDatabase.MongoVars()

# TODO: after adding login methods add login verification to each page


@app.route('/projects')
def projects():
    if 'userid' in session:
        return app.send_static_file('index.html')
    else:
        return redirect('/login')

@app.route('/newUser')
def newUser():
    return app.send_static_file('index.html')

@app.route('/logout')
def logout():
    session.pop('userid', None)
    return redirect('/')

@app.route('/')
def home():
    if 'userid' in session:
        return redirect('/projects')
    else:
        return redirect('/login')

@app.route('/newUser/create', methods = ['POST'])
def createUser():
    # TODO: integrate with mongodb functionality
    if request.method == 'POST':
        if database.addUser(str(request.form['nm']), str(request.form['userid']), str(request.form['password'])):
            session['userid'] = request.form['nm']
            return redirect('/projects')
        else:
            return {"message": "UserID already taken"}

@app.route('/projects/newProject/create', methods = ['POST'])
def createProject():
    # TODO: integrate with mongodb functionality
    if request.method == 'POST':
        if database.createProject(request.form['projnm'], request.form['projid'], request.form['description'], 'vjliew', request.form['members']):
            return redirect('/projects')
        else:
            return {"message": "ProjectID already taken"}

@app.route('/projects/newProject')
def newProject():
    return app.send_static_file('index.html')

@app.route('/projects/checkIn/<projectid>/<int:qty>')
def checkOut_hardware(projectid, qty):
    message = str(qty) + " hardware units checked in from project: " + projectid
    return {"message": message}


@app.route('/projects/checkOut/<projectid>/<int:qty>')
def checkIn_hardware(projectid, qty):
    message = str(qty) + " hardware units checked out from project: " + projectid
    return {"message": message}


@app.route('/projects/join/<projectid>')
def joinProject(projectid):
    message = "joined project: " + projectid
    return {"message": message}


@app.route('/projects/leave/<projectid>')
def leaveProject(projectid):
    message = "left project: " + projectid
    return {"message": message}

@app.errorhandler(404)
def not_found(e):
    return app.send_static_file('index.html')

if __name__ == '__main__':
    # instantiate db object
    flask_app.run(host='0.0.0.0', debug=False, port=os.environ.get('PORT', 80))