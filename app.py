from flask import Flask, send_from_directory, redirect, request

app = Flask(__name__, static_url_path='', static_folder='ui/build/')

# TODO: after adding login methods add login verification to each page


@app.route('/projects')
def projects():
    return app.send_static_file('index.html')

@app.route('/newUser')
def newUser():
    return app.send_static_file('index.html')

@app.route('/')
def home():
    return redirect('/projects')

@app.route('/newUser/create', methods = ['POST'])
def createUser():
    # TODO: integrate with mongodb functionality
    if request.method == 'POST':
        message = "Name: " + request.form['nm'] + ', UserID: ' + request.form['userid'] + ', Password: ' + request.form['password']
        return {"message": message}

@app.route('/projects/newProject/create', methods = ['POST'])
def createProject():
    # TODO: integrate with mongodb functionality
    if request.method == 'POST':
        message = "Name: " + request.form['projnm'] + ', ProjID: ' + request.form['projid'] + ', Description: ' + request.form['description'] + ', Members: ' + request.form['members']
        return {"message": message}

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
    flask_app.run(host='0.0.0.0', debug=False, port=os.environ.get('PORT', 80))