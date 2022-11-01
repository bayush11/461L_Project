from pymongo import MongoClient

client = MongoClient("mongodb+srv://username:utguest@cluster0.ezuijhw.mongodb.net/test")

database = client['HaaS-App']

print(database.list_collection_names())
user_collection = database.get_collection("Users")


import datetime
user_doc = {
    "Name" : "username2",
    "Password" : "password1",
}

user_collection.insert_one(user_doc)


def addUser(json):
    user_collection.insert_one(json)

client.close()
