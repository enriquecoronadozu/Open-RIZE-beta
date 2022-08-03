#!/usr/bin/env python
# -*- encoding: UTF-8 -*-

# Luis Enrique Coronado Zuniga

# You are free to use, change, or redistribute the code in any way you wish
# but please maintain the name of the original author.
# This code comes with no warranty of any kind.


import nep
import threading
import time
import sys
import nep_aldebaran
from naoqi import ALProxy
from naoqi import ALBroker
from naoqi import ALModule

robot_port = "9559"
robot_name = "Pepper"
robot_ip = '192.168.11.48'
middleware = "ZMQ"
robot_info = {}

try:
    robot_info = nep.json2dict(sys.argv[1])
    robot_name = robot_info["name"]
    robot_ip = robot_info["ip"]
    robot_port = robot_info["port"]
    middleware = robot_info["middleware"]

    print ("Robot name:" + str(robot_name))
    print ("Robot IP to connect:" + str(robot_ip))
    print ("Robot PORT to connect:" + str(robot_port))
    print ("Middleware:" + str(middleware))

except:
    pass


behavior = nep_aldebaran.BehaviorManager(robot_ip, robot_port)
behavior.onStop()
autonomus = nep_aldebaran.AutonomusLife(robot_ip, robot_port)
autonomus.onStop()
print ("Robot ready")

name_ = "reset_robot"
node = nep.node(name_)  
pub = node.new_pub("/set_speech","json")
time.sleep(1)

pub.publish({"action":"stop"})
track = nep_aldebaran.Tracking(robot_ip,robot_port)
track.onStop() 
time.sleep(1)

print ("Robot reset complete")
        
