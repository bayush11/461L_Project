
# if you wish to encrpyt a password, please use customEncrypt()

def reverseString(x):
  return x[::-1]

def testCustomEncrypt():
  #handle user input
  userID = input('Enter UserID as test: ')
  while (validASCII(userID) == False):
    userID = input('Enter UserID as test: ')
  password = input('Enter password as text: ')
  while( validASCII(password) == False):
    password = input('Enter password as text: ')
  n = int(input('Enter value of n: '))
  if n < 1:
    n = int(input('Enter value of n: '))
  d = int(input('Enter value of d: '))
  if d not in [-1,1]:
    d = int(input('Enter value of d: '))
  #now convert inputs into encrypted inputs
  print('encrypted userid: ', customEncrypt(userID, n, d))
  print('encrypted password: ', customEncrypt(password, n, d))
  print('Original userid: ', userID)
  print('Original passwd: ', password)

def validASCII(input):
  for char in input:
    if char == '!':
      return False
    if char == ' ':
      return False

  return True

def withinAcceptedRange(value):
  #make sure that the ASCII range is between 34-126
  if value < 34:
    diff = 34 - value
    newValue = 127 - diff
  elif value > 126:
    diff = value - 126
    newValue = 33 + diff
  else:
    newValue = value
  return newValue


def customEncrypt( inputText, n, d):
  reversedString = reverseString(inputText)
  ascii_values = []
  for char in reversedString:
    ascii_values.append(ord(char))
  #print(ascii_values)
  for i in range(len(ascii_values)):
    ascii_values[i] += (d * n)
    if ascii_values[i] not in range(34, 126):
      ascii_values[i] = withinAcceptedRange( ascii_values[i])
  resultString = ''.join( chr(i) for i in ascii_values)
  return resultString