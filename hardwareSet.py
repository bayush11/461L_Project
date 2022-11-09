# Vincent Liew
# vjl387
# Homework 3 HWSet class file

class HWSet:

    # __init__: takes amount and sets capacity and availability
    def __init__(self, qty, capacity):
        self.__Capacity = capacity
        self.__availability = qty

    # get_availability: returns availability
    def get_availability(self):
        return self.__availability

    # get_capacity: returns capacity
    def get_capacity(self):
        return self.__Capacity

    # get_checkedout_qty: returns the amount checked out
    # amount checked out is capacity - availability
    def get_checkedout_qty(self):
        return self.__Capacity - self.__availability

    # check_out: checks out amount qty
    def check_out(self, qty):
        if qty > self.__availability:
            # requested more than available, checks out amount left
            self.__availability = 0
            return -1
        else:
            # checks out requested amount
            self.__availability -= qty
            return 0

    # check_in: checks in amount
    def check_in(self, qty):
        self.__availability += qty
        if (self.__availability > self.__Capacity):
            self.__availability = self.__Capacity

