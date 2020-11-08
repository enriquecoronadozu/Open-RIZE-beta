#!/usr/bin/env python
# -*- encoding: UTF-8 -*-

# Luis Enrique Coronado Zuniga

# You are free to use, change, or redistribute the code in any way you wish
# but please maintain the name of the original author.
# This code comes with no warranty of any kind.


import nep
import rize
import threading
import time
import sys, os 
import nep_aldebaran   # NEP-RIZE library of NAO and Pepper robots

robot_port = "9559"
robot_name = "Pepper"
robot_ip = '192.168.11.38'
middleware = "ZMQ"
robot_info = {}
type_robot = "pepper"
path_animations = "C:/Rize/animations/animations_"+type_robot+".json"

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

# Define robot actions
robot = rize.ActionEngine(robot_name, "listen")
robot.multiple = True
connected = False


def wait(value, options):
    try:
        time.sleep(float(value))
        return "success"
    except  Exception as e:
        return "failure"
    
# Try connecting robot
try: 

    # Define robot sensors
    sensors = nep_aldebaran.SensorEvents(robot_ip, int(robot_port))
    memoryProxy = sensors.getMemory()
    broker = sensors.getBroker()
    

    say = nep_aldebaran.SayText(robot_ip, robot_port)
    say.onRun("Please wait, I am starting my components")
    move = nep_aldebaran.BodyMove(robot_ip, robot_port, type_robot, path_animations)
    robot_volume = nep_aldebaran.Volume(robot_ip, robot_port)
    leds = nep_aldebaran.Leds(robot_ip, robot_port)
    
    if robot_ip != "127.0.0.1":
        audio = nep_aldebaran.Audio(robot_ip, robot_port)
        track = nep_aldebaran.Tracking(robot_ip, robot_port)
    else:
        print("Audio and tracking not avalianle for simulation")
    


    if type_robot == "pepper":
        tablet = nep_aldebaran.Tablet(robot_ip, robot_port) # Connecting the tablet will take some seconds

        say.onRun("I am ready")
        connected = True
        
        try:
            tablet.showWebImage("http://web.tuat.ac.jp/~gvlab/images/GVLAB.gif")
        except:
            say.onRun("But the is an error in the Tablet, don't be scary, this sometimes happens")
            say.onRun("If you want to use the tablet, you need to turn me off")

    else:
        say.onRun("I am ready")
        connected = True
        
except Exception as e:
    exc_type, exc_obj, exc_tb = sys.exc_info()
    fname = os.path.split(exc_tb.tb_frame.f_code.co_filename)[1]
    print(exc_type, fname, exc_tb.tb_lineno)
    robot.onConnectError()


if connected:
    try:

        # Avaliable for simuation
        if robot_ip != "127.0.0.1":
                    
            # Define actions 
            robot_actions = {
                            'say':say.onRun,
                            'close_hand':move.onCloseHand,
                            'open_hand':move.onOpenHand,
                            'language':say.onSetLanguage,
                            'animation':move.onRunAnimation,
                            'posture':move.onPosture,
                            'walk':move.onWalk,
                            'turn':move.onTurn,
                            'wait':wait,
                            'mode':move.onRunMode,
                            'volume':robot_volume.onSet,
                            'sound':audio.onPlaySound,
                            'leds':leds.onSetColor,
                            'breathing':move.onBreathe,
                            'track_people_with':track.onTrackPeople,
                            'track_redball_with':track.onTrackRedBall,
                            'track_sound_with':track.onTrackSound,
                            'walk_toward':track.onWalkTowards,
                            }

        else:

            # Define actions 
            robot_actions = {
                            'say':say.onRun,
                            'close_hand':move.onCloseHand,
                            'open_hand':move.onOpenHand,
                            'language':say.onSetLanguage,
                            'animation':move.onRunAnimation,
                            'posture':move.onPosture,
                            'walk':move.onWalk,
                            'turn':move.onTurn,
                            'wait':wait,
                            'mode':move.onRunMode,
                            'volume':robot_volume.onSet,
                            'leds':leds.onSetColor,
                            'breathing':move.onBreathe,
                            }

                
        
        if type_robot == "pepper":
            robot_actions['show_video'] = tablet.showVideo
            robot_actions['show_url'] = tablet.showWeb
            robot_actions['show_image'] = tablet.showImage
            robot_actions['take_photo'] = tablet.takeNewImageShow
            

        # Define actions that can be canceled
        #robot_cancel_actions = {'say':say.onStop,
        #                        'animation':move.onStopAnimation,
        #                        'sound':audio.onStop,
        #                        }
                
        # Set robot actions
        robot.setRobotActions(robot_actions)
        #robot.setCancelActions(robot_cancel_actions)


        print ("Robot ready")
        robot.onConnectSuccess()

        name_ = robot_name + "_sensors"
        node = nep.node(name_)  
        sharo = node.new_pub("/blackboard","json")
        
        people = nep_aldebaran.PeoplePerception(robot_ip, robot_port, memoryProxy, sharo, robot_name)

        ppeople = threading.Thread(target = people.onRun)
        ppeople.daemon = True
        ppeople.start()

        # Start action making thread
        robot.spin()


    except:
        robot.onExecutionError()
        pass





    
