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



    def addUser(self, name, userid, password):
        # validation
        idTaken = self.__userCollection.find_one({'_id': userid}) is not None
        if idTaken:
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

        # make sure users in memberlist exist
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
            'HW1': {
                'Capacity': 500,
                'Availability': 500
            },
            'HW2': {
                'Capacity': 500,
                'Availability': 500
            }
        }

        self.__projectCollection.insert_one(projDoc)
        return True

        # inputs user and gets list of Admin and User projects that the user is in
        def getUserProjects(self, userid):
            usr = self.__userCollection.find_one({'_id': userid})

            return {'AdminProjs': usr['AdminProjs'],
                    'UserProjs': usr['UserProjs']}


    def checkInHW(self, projid, setNum, qty):
        idTaken = self.__projectCollection.find_one({'_id': projid}) is not None
        if idTaken:
            return False

        project = self.__projectCollection.find_one({'_id': projid})
        HWset = hardwareSet()
        if setNum == 0:
            HWset = hardwareSet(500, project['HW1']['Availability'])
        else:
            HWset = hardwareSet(500, project['HW2']['Availability'])
        
        HWset.check_in(qty)

        if setNum == 0:
            self.__projectCollection.update_one({'_id': projid}, {'$set': {'HW1': {'Capacity': 500, 'Availability': HWset.get_availability()}}})
        else:
            self.__projectCollection.update_one({'_id': projid}, {'$set': {'HW2': {'Capacity': 500, 'Availability': HWset.get_availability()}}})

        return True
        # TODO: reflect amount checked in

    def getUserProjects(self, userid):
        usr = self.__userCollection.find_one({'_id': userid})

        return {'AdminProjs': usr['AdminProjs'],
                'UserProjs': usr['UserProjs']}


    def checkOutHW(self, projid, setNum, qty):
        idTaken = self.__projectCollection.find_one({'_id': projid}) is not None
        if idTaken:
            return False

        project = self.__projectCollection.find_one({'_id': projid})
        HWset = hardwareSet()
        if setNum == 0:
            HWset = hardwareSet(500, project['HW1']['Availability'])
        else:
            HWset = hardwareSet(500, project['HW2']['Availability'])
        
        HWset.check_out(qty)

        if setNum == 0:
            self.__projectCollection.update_one({'_id': projid}, {'$set': {'HW1': {'Capacity': 500, 'Availability': HWset.get_availability()}}})
        else:
            self.__projectCollection.update_one({'_id': projid}, {'$set': {'HW2': {'Capacity': 500, 'Availability': HWset.get_availability()}}})

        return True
        # TODO: reflect amount checked out

    def getProject(self, projid):
        project = self.__projectCollection.find_one({'_id': projid})
        return project

    def validUser(self, userid, password):
        user = self.__userCollection.find_one({'_id': userid})
        if user is None:
            return False

        return Encryption.customEncrypt(password, 3, 1) == user['EncryptedPass']

# client.close()

# Project Hierarchy (Maybe)
# cluster
#   -database: HaaS App
#       -Users (collection)
#           - document for each user: contains encrypted pass, username, userID, list of admin projs, list of included projs for redundancy
#       -Projects (collection)
#           - doc for each proj: contains proj name, projID, list of hwsets in proj (HWset ID), list of users with access, admin user