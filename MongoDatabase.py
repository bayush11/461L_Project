from pymongo import MongoClient
import Encryption
import hardwareSet

class MongoVars:
    def __init__(self):
        self.__client = MongoClient("mongodb+srv://username:utguest@cluster0.ezuijhw.mongodb.net/test")
        self.__database = self.__client['HaaS-App']
        self.__userCollection = self.__database.get_collection("Users")
        self.__hardwareCollection = self.__database.get_collection("HWSets")
        self.__projectCollection = self.__database.get_collection("Projects")

    def userExists(self, userid):
        return self.__userCollection.find_one({'_id': userid}) is not None

    def addUser(self, name, userid, password):
        if self.userExists(userid):
            return False

        userDoc = {
            '_id': userid,
            'Name': name,
            'EncryptedPass': Encryption.customEncrypt(password, 3, 1),
            'AdminProjs': [],
            'UserProjs': []
        }

        self.__userCollection.insert_one(userDoc)
        return True


    def createProject(self, projName, projid, description, admin, members):
        idTaken = self.__projectCollection.find_one({'_id': projid}) is not None
        if idTaken:
            return False

        memberList = members.split()

        for member in memberList:
            user = self.__userCollection.find_one({'_id': member})
            userProjs = user['UserProjs']
            userProjs.append(projid)
            self.__userCollection.update_one({'_id': member}, {'$set': {'UserProjs': userProjs}})

        user = self.__userCollection.find_one({'_id': admin})
        adminProjs = user['AdminProjs']
        adminProjs.append(projid)
        self.__userCollection.update_one({'_id': admin}, {'$set': {'AdminProjs': adminProjs}})

        projDoc = {
            '_id': projid,
            'Name': projName,
            'Description': description,
            'Admin': admin,
            'Members': memberList,
            'HW1Out': 0,
            'HW2Out': 0
        }

        self.__projectCollection.insert_one(projDoc)
        return True


    def checkInHW(self, projid, setNum, qty):
        idInvalid = self.__projectCollection.find_one({'_id': projid}) is None
        if idInvalid:
            return None

        project = self.__projectCollection.find_one({'_id': projid})
        hwset = self.__hardwareCollection.find_one({'_id': str(setNum)})

        HWset = hardwareSet.HWSet(hwset.TotalAvailability, hwset.TotalCapacity)

        availableBefore = hwset.TotalAvailability
        
        if setNum == 1 and project.HW1Out < qty:
            qty = project.HW1Out
        elif setNum == 2 and project.HW2Out < qty:
            qty = project.HW2Out

        HWset.check_in(qty)
        totalOut = availableBefore - HWset.get_availability()
        if setNum == 1:
            totalOut += project.HW1Out
        else:
            totalOut += project.HW2Out

        # update hwdoc, update projectdoc
        self.__hardwareCollection.update_one({'_id': str(setNum)}, {'$set': {'TotalAvailability': HWset.get_availability()}})
        if setNum == 1:
            self.__projectCollection.update_one({'_id': projid}, {'$set': {'HW1Out': totalOut}})
        else:
            self.__projectCollection.update_one({'_id': projid}, {'$set': {'HW2Out': totalOut}})

        return {
            'Available': HWset.get_availability(),
            'CheckedIn': HWset.get_availability() - availableBefore,
            'TotalOut': totalOut
        }


    def checkOutHW(self, projid, setNum, qty):
        idInvalid = self.__projectCollection.find_one({'_id': projid}) is None
        if idInvalid:
            return None

        project = self.__projectCollection.find_one({'_id': projid})
        hwset = self.__hardwareCollection.find_one({'_id': str(setNum)})

        HWset = hardwareSet.HWSet(hwset.TotalAvailability, hwset.TotalCapacity)

        availableBefore = hwset.TotalAvailability
        
        HWset.check_out(qty)
        totalOut = availableBefore - HWset.get_availability()
        if setNum == 1:
            totalOut += project.HW1Out
        else:
            totalOut += project.HW2Out

        # update hwdoc, update projectdoc
        self.__hardwareCollection.update_one({'_id': str(setNum)}, {'$set': {'TotalAvailability': HWset.get_availability()}})
        if setNum == 1:
            self.__projectCollection.update_one({'_id': projid}, {'$set': {'HW1Out': totalOut}})
        else:
            self.__projectCollection.update_one({'_id': projid}, {'$set': {'HW2Out': totalOut}})

        return {
            'Available': HWset.get_availability(),
            'CheckedOut': availableBefore - HWset.get_availability,
            'TotalOut': totalOut
        }


    def getUserProjects(self, userid):
        usr = self.__userCollection.find_one({'_id': userid})

        return {'AdminProjs': usr['AdminProjs'],
                'UserProjs': usr['UserProjs']}


    def getProject(self, projid):
        project = self.__projectCollection.find_one({'_id': projid})
        return project

    def validUser(self, userid, password):
        user = self.__userCollection.find_one({'_id': userid})
        if user is None:
            return False

        return Encryption.customEncrypt(password, 3, 1) == user['EncryptedPass']


    def getHWAvailable(self, setNum):
        hwset = self.__hardwareCollection.find_one({'_id': str(setNum)})
        return hwset.TotalAvailability

# client.close()

# Project Hierarchy (Maybe)
# cluster
#   -database: HaaS App
#       -Users (collection)
#           - document for each user: contains encrypted pass, username, userID, list of admin projs, list of included projs for redundancy
#       -Projects (collection)
#           - doc for each proj: contains proj name, projID, list of users with access, admin user, amount checked out from HW1, HW2
#       -HardwareSets (collection)
#           - doc for each HWset: contains setnum as id, capacity, availability, array of amounts with users