import hardware
import projects
def login(username, password):
    pass
def promptCreateUser():
    pass
def addUser(username, password):
    pass
def createProject(project, pID):
    pass
def checkoutHardware1(pID, amt):
    pass
def checkoutHardware2(pID, amt):
    pass
def checkinHardware1(project1ID, amt):
    pass
def checkinHardware2(project1ID, amt):
    pass

# ProtoType Functions to resolve errors #

def testUserLogin():
    username1 = "name1"
    password1 = "password1"
    addUser(username1, password1)

    assert login(username1, password1) == True

    username2 = "name2"
    assert login(username2, password1) == False
    promptCreateUser()

    username1 = "name1"
    password2 = "password2"
    assert login(username1, password2) == False


def testProjects():
    project1 = "project1"
    project1ID = "pid1"
    createProject(project1, project1ID)

    assert createProject("p2", "pid1") == False


def testCheckout():
    amt = 10
    project1 = "project1"
    project1ID = "pid1"
    h1quan = hardware.h1.Quantity
    if(hardware.h1.Quantity >= amt):
        assert checkoutHardware1(project1ID, amt) == True
    else:
        assert checkoutHardware1(project1ID, amt) == False

    h2quan = hardware.h2.Quantity
    if (hardware.h2.Quantity >= amt):
        assert checkoutHardware2(project1ID, amt) == True
    else:
        assert checkoutHardware2(project1ID, amt) == False

    assert ((hardware.h1.Quantity < h1quan) & (hardware.h2.Quantity < h2quan)) == True

def testCheckin():
    amt = 10
    project1ID = "pid1"
    h1quan = hardware.h1.Quantity
    if (projects.h1.getQuantity(project1ID) >= amt):
        assert checkinHardware1(project1ID, amt) == True
    else:
        assert checkinHardware1(project1ID, amt) == False

    h2quan = hardware.h2.Quantity
    if (projects.h2.getQuantity(project1ID) >= amt):
        assert checkinHardware2(project1ID, amt) == True
    else:
        assert checkinHardware2(project1ID, amt) == False

    assert ((hardware.h1.Quantity > h1quan) & (hardware.h2.Quantity > h2quan)) == True