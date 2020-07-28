# coding = utf-8
#!/usr/bin/env python

# ------------------------ Build database  --------------------------------
# Description: Create a databes from a list of txt files in the "animations" folder
# --------------------------------------------------------------------------
# You are free to use, change, or redistribute the code in any way you wish
# but please maintain the name of the original author.
# This code comes with no warranty of any kind.
# Autor: Luis Enrique Coronado Zuniga


from tinydb import TinyDB, Query
from os import listdir
from os.path import isfile, join
import re
import ast
import simplejson

# Delete database
import os
import os.path


path = "animations"
robots = ["Pepper", "NAO"]

for robot in robots:

    from sys import platform
    if platform == "darwin":
        path = "animations"
    elif platform == "win32":
        path = "C:/Rize/animations/"

    path_animation = path + "animations_"+robot+".json"
    path_txt = path + robot + "/" 
    path_list = path  + "list_"+robot+".json"

    print ("---------------- " + path +" ---------------")
    #Restart the databases
    if (os.path.exists(path_animation)):
      os.remove(path_animation)
    print("***Database restarted!***")

    # Get a list of files inside the animations folder

    onlyfiles = [f for f in listdir(path_txt) if isfile(join(path_txt, f))]
    print ("Files to build database:" +  str(onlyfiles))

    # Build database
    print ("***Building database***")
    db = TinyDB(path_animation)

    animation_file = open(path_list,"w") 
    animations_options = {"values":[]}


    for file_ in onlyfiles:
      f = open(path_txt  +  file_,"r")
      try:
        movement_name = file_.split(".txt")
        animations_options["values"].append(movement_name[0])
        #animations_options[str(movement_name[0])] = movement_name[0]

        data =  f.read()
        names = list()
        times = list()
        keys = list()

        #Get animation elements from Choregraphe timeline/clipboard (simple mode)
        list_data =  data.split("\n\n")
        i = 0
        for parts in list_data:
          e = parts.split("\n")
          try:  
            result = re.search('names.append\("(.*)"\)', e[0])
            name = str(result.group(1))
            result = re.search('times.append\((.*)\)', e[1])
            time = ast.literal_eval(result.group(1))
            result = re.search('keys.append\((.*)\)', e[2])
            key = ast.literal_eval(result.group(1))

            names.append(name)
            times.append(time)
            keys.append(key)
            
            
          except:
            pass
       
        # Save animation in the database
        db.insert({'animation': movement_name[0], 'names': names, 'times':times, 'keys':keys})
        print (str(movement_name[0]) + " ---> added")
      except:
        print ("Error reading file: " + str(file_))
        pass
    # sort_keys = True is important
    animation_file.write(simplejson.dumps(animations_options, sort_keys = True))
    animation_file.close()


    
print("***database build finished!***")

"""
def json2dict(s, **kwargs):
    if str is unicode and isinstance(s, bytes):
        s = s.decode('utf8')
    
    return simplejson.loads(s, **kwargs)

def read_json(json_file):
    json_data = open (json_file).read()
    return json_data

json_data = read_json("animation.json")
data = json2dict(json_data)
print data['options']

"""


