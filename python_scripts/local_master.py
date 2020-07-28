#%%
import zmq
import time
import nep
import sys


if sys.version_info[0] == 3:
    import _thread as thread
else:
    import thread

try:
    if sys.argv[1] == "network":
        # Get IP of the PC
        ip = nep.getMyIP()
        print ("NEP MASTER in " + ip)
    else:
        print ("NEP MASTER in local-host")
        ip = "127.0.0.1"
except:
    print ("NEP MASTER in local-host")
    ip = "127.0.0.1"
    
 
print (sys.version) 
server = nep.master(ip)      
server.run()
    
