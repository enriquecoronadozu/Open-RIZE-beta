#!/usr/bin/env python
# -*- encoding: UTF-8 -*-

# Luis Enrique Coronado Zuniga

# You are free to use, change, or redistribute the code in any way you wish
# but please maintain the name of the original author.
# This code comes with no warranty of any kind.
import nep
import time
import threading
from rize import*


robot_name = "ROS"


# Define robot actions
robot = ActionEngine(robot_name, "listen")

import pyttsx

def speech2text(x,y):
    time.sleep(1)

def walk(x,y):
    time.sleep(1)

def wait(x,y):
    time.sleep(1)

def animation(x,y):
    time.sleep(1)

def track(x,y):
    time.sleep(1)

def turn(x,y):
    time.sleep(1)



# Define actions 
robot_actions = {
                'say':speech2text,
                'walk':walk,
                "wait":wait,
                "animation":animation,
                "track_redball_with":track,
                "turn":turn,
                
                
                }

# Set robot actions
robot.setRobotActions(robot_actions)

robot.spin()


     
