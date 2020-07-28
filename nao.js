

var session = "";
var tts;
var timerPerception;
var touchEvent;

var people_list = [];
var shirt_color;
var face_detected;
var people_visible;
var people_distance;
var people_emotions;
var current_emotion;
var robot_connected = false;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// -----------------------  Text2Speech  -----------------------
async function say(text) {
  tts.say(text)
  console.log("say")
}

function language(text) {
  tts.setLanguage(text)
}

function animated_say(value) {
  session.service("ALAnimatedSpeech").done(function (proxy) {
    proxy.say(value, { "bodyLanguageMode": "contextual" })
    // tts is a proxy to the ALTextToSpeech service
  }).fail(function (error) {
    console.log("An error occurred:", error);
  });
}

function speed(value) {
  value = parseInt(value);
  if (value > 350) {
    value = 350
  }
  if (value < 0) {
    value = 0
  }
  var mapped_value = 50 + value
  tts.setParameter("speed", mapped_value)
  // tts is a proxy to the ALTextToSpeech service
}

function volume(value) {
  value = parseInt(value);
  if (value > 100) {
    value = 100
  }
  if (value < 0) {
    value = 0
  }
  var mapped_value = value
  audio_proxy.setOutputVolume(mapped_value)
  console.log("volume")
}


function pitch(value) {

  value = parseInt(value);
  if (value > 100) {
    value = 100
  }
  if (value < 40) {
    value = 40
  }
  var mapped_value = .5 + value * 1.26 / 100.0  //default = 1.3
  console.log(mapped_value)
  tts.setParameter("pitchShift", mapped_value)
  // tts is a proxy to the ALTextToSpeech service
}

function stopSay(value) {
  session.service("ALTextToSpeech").done(function (tts) {
    tts.stopAll()
    // tts is a proxy to the ALTextToSpeech service
  }).fail(function (error) {
    console.log("An error occurred:", error);
  });
}

// -----------------------  Behaviors  -----------------------

function stopAutonomusLife(value) {
  session.service("ALAutonomousLife").done(function (proxy) {
    proxy.setState("disabled")
    // tts is a proxy to the ALTextToSpeech service
  }).fail(function (error) {
    console.log("An error occurred:", error);
  });
}

function stopAllBehaviors(value) {
  session.service("ALBehaviorManager").done(function (proxy) {
    proxy.stopAllBehaviors()
    // tts is a proxy to the ALTextToSpeech service
  }).fail(function (error) {
    console.log("An error occurred:", error);
  });
}

// -----------------------  Leds  -----------------------


async function leds(ledsg, r, g, b, time_to_change) {
  session.service("ALLeds").done(function (leds) {
    led_g = ledsg
    leds.fadeRGB(led_g, r * .1, g * .1, b * .1, time_to_change)
    // FaceLeds, AllLeds, BrainLeds, EarLeds
    // tts is a proxy to the ALTextToSpeech service
  }).fail(function (error) {
    console.log("An error occurred:", error);
  });
  await sleep(2000);
}

function rasta(timeDuration) {
  session.service("ALLeds").done(function (leds) {
    leds.rasta(timeDuration)
    // tts is a proxy to the ALTextToSpeech service
  }).fail(function (error) {
    console.log("An error occurred:", error);
  });
}

function rotateEyes(color, time_to_change, timeDuration) {
  session.service("ALLeds").done(function (leds) {
    var value = 0x001a1aff
    if (color === "blue") {
      value = 0x001a1aff
    }
    if (color === "red") {
      value = 0x00ff0000
    }
    if (color === "green") {
      value = 0x00009933
    }
    if (color === "yellow") {
      value = 0x00ffff00
    }
    if (color === "pink") {
      value = 0x00ff3399
    }
    if (color === "white") {
      value = 0x00ffffff
    }

    leds.rotateEyes(value, time_to_change, timeDuration)
    // tts is a proxy to the ALTextToSpeech service
  }).fail(function (error) {
    console.log("An error occurred:", error);
  });
}

function randomEyes(timeDuration) {
  session.service("ALLeds").done(function (leds) {
    leds.randomEyes(timeDuration)
    // tts is a proxy to the ALTextToSpeech service
  }).fail(function (error) {
    console.log("An error occurred:", error);
  });
}

// -----------------------  Mode  -----------------------

function mode(value) {
  session.service("ALMotion").done(function (motion) {
    if (value === "rest") {
      motion.rest()
    }
    else {
      motion.wakeUp()
    }
    // tts is a proxy to the ALTextToSpeech service
  }).fail(function (error) {
    console.log("An error occurred:", error);
  });
}

// ------------------------- Tablet ---------------------------

function showWeb(url) {
  session.service("ALTabletService").done(function (proxy) {
    proxy.hideImage()
    proxy.stopVideo()
    proxy.loadUrl(url)
    proxy.showWebview()
    // tts is a proxy to the ALTextToSpeech service
  }).fail(function (error) {
    console.log("An error occurred:", error);
  });
}


function showWebImage(url) {
  session.service("ALTabletService").done(function (proxy) {
    proxy.showImageNoCache(url)
    // tts is a proxy to the ALTextToSpeech service
  }).fail(function (error) {
    console.log("An error occurred:", error);
  });
}

function showImage(input_) {
  session.service("ALTabletService").done(function (proxy) {
    proxy.showImage("http://198.18.0.1/apps/images/" + input_ + ".jpg")
    // tts is a proxy to the ALTextToSpeech service
  }).fail(function (error) {
    console.log("An error occurred:", error);
  });
}


function resetTablet(input_) {
  session.service("ALTabletService").done(function (proxy) {
    proxy.resetTablet()
    // tts is a proxy to the ALTextToSpeech service
  }).fail(function (error) {
    console.log("An error occurred:", error);
  });
}


function hideImage(input_) {
  session.service("ALTabletService").done(function (proxy) {
    proxy.hideImage()
    // tts is a proxy to the ALTextToSpeech service
  }).fail(function (error) {
    console.log("An error occurred:", error);
  });
}


// -------------------------- Events ---------------------------
var head_touched_front = false
var head_touched_middle = false
var head_touched_rear = false

var right_touched_back = false
var right_touched_r = false
var right_touched_l = false

var left_touched_back = false
var left_touched_r = false
var left_touched_l = false

var head_touched = false
var rigth_hand_touched = false
var left_hand_touched = false



function UpdateTouched() {
  if (head_touched_front === true || head_touched_middle === true || head_touched_rear === true) {
    if (head_touched == false) {
      head_touched = true
      var data = { "primitive": "touched", "input": { "head": 1 }, "robot": rize_robot }
      console.log(data)
      sharo.setInput(data)
    }

  }
  else {
    if (head_touched == true) {
      head_touched = false

    }
  }

  if (right_touched_back === true || right_touched_r === true || right_touched_l === true) {
    if (rigth_hand_touched == false) {
      rigth_hand_touched = true
      var data = { "primitive": "touched", "input": { "right_hand": 1 }, "robot": rize_robot }
      console.log(data)
      sharo.setInput(data)
    }
  }
  else {
    if (rigth_hand_touched == true) {
      rigth_hand_touched = false

    }
  }

  if (left_touched_back === true || left_touched_r === true || left_touched_l === true) {
    if (left_hand_touched == false) {
      left_hand_touched = true
      var data = { "primitive": "touched", "input": { "left_hand": 1 }, "robot": rize_robot }
      console.log(data)
      sharo.setInput(data)
    }
  }
  else {
    if (left_hand_touched == true) {
      left_hand_touched = false

    }
  }

}


function startTouched(text) {
  session.service("ALMemory").then(function (ALMemory) {
    ALMemory.subscriber("FrontTactilTouched").then(function (subscriber) {
      // subscriber.signal is a signal associated to "FrontTactilTouched"
      subscriber.signal.connect(function (state) {
        state == 1 ? head_touched_front = true : head_touched_front = false
      });
    });

    ALMemory.subscriber("MiddleTactilTouched").then(function (subscriber) {
      // subscriber.signal is a signal associated to "MiddleTactilTouched"
      subscriber.signal.connect(function (state) {
        state == 1 ? head_touched_middle = true : head_touched_middle = false
      });
    });
    ALMemory.subscriber("RearTactilTouched").then(function (subscriber) {
      // subscriber.signal is a signal associated to "RearTactilTouched"
      subscriber.signal.connect(function (state) {
        state == 1 ? head_touched_rear = true : head_touched_rear = false
      });
    });


    ALMemory.subscriber("HandRightBackTouched").then(function (subscriber) {
      // subscriber.signal is a signal associated to "RearTactilTouched"
      subscriber.signal.connect(function (state) {
        state == 1 ? right_touched_back = true : right_touched_back = false
      });
    });
    ALMemory.subscriber("HandRightRightTouched").then(function (subscriber) {
      // subscriber.signal is a signal associated to "HandRightRightTouched"
      subscriber.signal.connect(function (state) {
        state == 1 ? right_touched_r = true : right_touched_r = false
      });
    });
    ALMemory.subscriber("HandRightLeftTouched").then(function (subscriber) {
      // subscriber.signal is a signal associated to "HandRightLeftTouched"
      subscriber.signal.connect(function (state) {
        state == 1 ? right_touched_l = true : right_touched_l = false
      });
    });

    ALMemory.subscriber("HandLeftBackTouched").then(function (subscriber) {
      // subscriber.signal is a signal associated to "HandLeftBackTouched"
      subscriber.signal.connect(function (state) {
        state == 1 ? left_touched_back = true : left_touched_back = false
      });
    });
    ALMemory.subscriber("HandLeftRightTouched").then(function (subscriber) {
      // subscriber.signal is a signal associated to "HandLeftRightTouched"
      subscriber.signal.connect(function (state) {
        state == 1 ? left_touched_r = true : left_touched_r = false
      });
    });
    ALMemory.subscriber("HandLeftLeftTouched").then(function (subscriber) {
      // subscriber.signal is a signal associated to "HandLeftLeftTouched"
      subscriber.signal.connect(function (state) {
        state == 1 ? left_touched_l = true : left_touched_l = false
      });
    });

  });
}


// ----------------------- Speech --------------------------------
var speech_proxy;
var speech_event_active = false

function speechStart(vocabulary, visual, audio) {
  session.service("ALSpeechRecognition").done(function (proxy) {
    speech_proxy = proxy

    var visualExpression = visual
    var audioExpression = audio
    var wordSpotting = true
    var sensitivity = 0.45

    speech_proxy.setAudioExpression(visualExpression)
    speech_proxy.setVisualExpression(audioExpression)
    speech_proxy.pushContexts()
    speech_proxy.setVocabulary(vocabulary, wordSpotting)


    speech_proxy.subscribe("Test_ASR")


    if (speech_event_active === false) {
      speech_event_active = true
      session.service("ALMemory").then(function (ALMemory) {
        ALMemory.subscriber("WordRecognized").then(function (subscriber) {
          // subscriber.signal is a signal associated to "FrontTactilTouched"
          subscriber.signal.connect(function (state) {
            console.log(state);
            if (state[1] > sensitivity) {
              if (wordSpotting) {
                var values_rest = state[0].split("<...> ")
                var values_final = values_rest[1].split(" <...>")
                var word = values_final[0]
                console.log("Recognized " + word)
                data = { "primitive": "word", "input": {}, "robot": rize_robot }
                data.input[word] = 1

                sharo_pub.publish(data);
                console.log(data)
              }
            }
          });
        });
      });
    }
    //speech_proxy.setLanguage("English")
    // tts is a proxy to the ALTextToSpeech service
  }).fail(function (error) {
    console.log("An error occurred:", error);
  });
}

function stopSpeech() {
  try {
    speech_proxy.unsubscribe("Test_ASR")
  } catch (error) {

  }
}



function ReadMemory(text) {
  session.service("ALMemory").then(function (ALMemory) {
    ALMemory.getData("PeoplePerception/PeopleList").then(function (value) {
      people_list = value
    });
  });
}


function getPeopleInfo() {
  if (people_list.length > 0) {

    session.service("ALMemory").then(function (ALMemory) {
      ALMemory.getData("PeoplePerception/Person/" + String(people_list[0]) + "/ShirtColor").then(function (value) {
        shirt_color = value
      });
      ALMemory.getData("PeoplePerception/Person/" + String(people_list[0]) + "/NotSeenSince").then(function (value) {
        time_not_seen = value
      });
      ALMemory.getData("PeoplePerception/Person/" + String(people_list[0]) + "/IsFaceDetected").then(function (value) {
        face_detected = value
      });
      ALMemory.getData("PeoplePerception/Person/" + String(people_list[0]) + "/IsVisible").then(function (value) {
        people_visible = value
      });
      ALMemory.getData("PeoplePerception/Person/" + String(people_list[0]) + "/Distance").then(function (value) {
        people_distance = value
      });
      ALMemory.getData("PeoplePerception/Person/" + String(people_list[0]) + "/ExpressionProperties").then(function (value) {
        people_emotions = value
        var index = indexOfMax(people_emotions)
        if (index === 0) {
          current_emotion = "neutral"
        }
        else if (index === 1) {
          current_emotion = "happy"
        }
        else if (index === 2) {
          current_emotion = "surprised"
        }
        else if (index === 3) {
          current_emotion = "angry"
        }
        else if (index === 4) {
          current_emotion = "sad"
        }
        console.log(current_emotion)
      });

    });
  }
}


function indexOfMax(arr) {
  if (arr.length === 0) {
    return -1;
  }
  var max = arr[0];
  var maxIndex = 0;

  for (var i = 1; i < arr.length; i++) {
    if (arr[i] > max) {
      maxIndex = i;
      max = arr[i];
    }
  }
  return maxIndex;
}



function readXML() {
  const fileSelector = document.getElementById('file-selector');
  fileSelector.addEventListener('change', (event) => {
    const fileList = event.target.files;
    console.log(fileList);
  });
}


function connectRobot(host) {

  function connected() {
    console.log("NAO SDK connected");
    robot_connected = true
    session.service("ALTextToSpeech").done(function (proxy) {
      tts = proxy
      // tts is a proxy to the ALTextToSpeech service
    }).fail(function (error) {
      console.log("An error occurred:", error);
    });
    session.service("ALAudioDevice").done(function (proxy) {
      audio_proxy = proxy
    }).fail(function (error) {
      console.log("An error occurred:", error);
    });


    startTouched();
    console.log("Touched started")

    timerPerception = setInterval(PerceptionTimer, 300);
    touchEvent = setInterval(UpdateTouched, 100);
    console.log("Percpetion started")

    function PerceptionTimer() {
      ReadMemory();
      getPeopleInfo();
    }
  }

  function disconnected() {
    console.log("disconnected");
    stopSpeech();
    robot_connected = false
  }

  if (robot_connected === false) {
    session = new QiSession(host);
    session.socket().on("connect", connected);
    session.socket().on("disconnect", disconnected);
  }
};


