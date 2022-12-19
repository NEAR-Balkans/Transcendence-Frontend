python3 -c 'file=open("tell.txt", "r")
print(str(file.read()))
if file == "paused":
  print("True")
else:
  print("No")
'