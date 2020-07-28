goog.provide('Blockly.Blocks.behaviors');
goog.require('Blockly.Blocks');



Blockly.Blocks['reaction'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("REACTION")
            .appendField(new Blockly.FieldTextInput("edit"), "module_name");
        this.appendValueInput("activated")
            .setCheck(null)
            .appendField("When detected:")
        this.appendDummyInput()
            .appendField("Do:");
        this.appendStatementInput("behavior")
            .setCheck(null)
        this.appendDummyInput()
            .appendField("Options:")
        this.appendDummyInput()
            //.setAlign(Blockly.ALIGN_RIGHT)
            //.appendField("Interval")
            //.appendField(new Blockly.FieldNumber(0, 0, 1000), "delay")
            .setAlign(Blockly.ALIGN_RIGHT)
            .appendField(" Priority:")
            .appendField(new Blockly.FieldDropdown([["normal", "normal"], ["high", "high"], ["low", "low"]]), "priority");
        this.setInputsInline(false);
        this.setColour("#00675b");
        this.setTooltip("Define a reaction");
        this.setHelpUrl("");
    }
};


// Simple goal behaviors 
Blockly.Blocks['goal'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("GOAL")
            .appendField(new Blockly.FieldTextInput("edit"), "module_name");
        this.appendValueInput("activated")
            .setCheck(null)
            .appendField("When detected:  ");
        this.appendDummyInput()
            .appendField("Do:");
        this.appendStatementInput("behavior")
            .setCheck(null);
        this.appendValueInput("canceled")
            .setCheck(null)
            .appendField("Stop goal if detected:");
        this.appendDummyInput()
            .appendField("Options:")
        this.appendDummyInput()
            //.setAlign(Blockly.ALIGN_RIGHT)
            //.appendField("Interval")
            //.appendField(new Blockly.FieldNumber(0, 0, 1000), "delay")
            .setAlign(Blockly.ALIGN_RIGHT)
            .appendField("  Priority:")
            .appendField(new Blockly.FieldDropdown([["normal", "normal"], ["high", "high"], ["low", "low"]]), "priority");
        this.setInputsInline(false);
        this.setColour("#00675b");
        this.setTooltip("Define a goal");
        this.setHelpUrl("");
    }
};


// Advanced goal behaviors 
Blockly.Blocks['goal_advanced'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("ADVANCED GOAL")
            .appendField(new Blockly.FieldTextInput("edit"), "module_name");
        this.appendValueInput("activated")
            .setCheck(null)
            .appendField("When detected:  ");
        this.appendDummyInput()
            .appendField("do:");
        this.appendStatementInput("behavior")
            .setCheck(null);
        this.appendValueInput("canceled")
            .setCheck(null)
            .appendField("Cancel goal if detected:");
        this.appendDummyInput()
            .appendField("If goal canceled do:");
        this.appendStatementInput("stop_behavior")
            .setCheck(null);
        this.appendDummyInput()
            .appendField("Return to the goal doing:");
        this.appendStatementInput("return_behavior")
            .setCheck(null);
        this.appendDummyInput()
            .appendField("Options:")
        this.appendDummyInput()
            //.setAlign(Blockly.ALIGN_RIGHT)
            //.appendField("Interval")
            //.appendField(new Blockly.FieldNumber(0, 0, 1000), "delay")
            .setAlign(Blockly.ALIGN_RIGHT)
            .appendField("(s), Priority:")
            .appendField(new Blockly.FieldDropdown([["normal", "normal"], ["high", "high"], ["low", "low"]]), "priority");
        this.setInputsInline(false);
        this.setColour("#00675b");
        this.setTooltip("Define a goal");
        this.setHelpUrl("");
    }
};



Blockly.Blocks['module'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Module")
            .appendField(new Blockly.FieldTextInput("edit"), "module_name")
        this.appendStatementInput("input")
            .setCheck(null);
        this.setColour('#AD1457');
        this.appendDummyInput()
            .appendField("execute:")
            .setAlign(Blockly.ALIGN_RIGHT)
            .appendField(new Blockly.FieldDropdown([["all in order", "sequence"], ["one randomly", "random"]]), "mode");
        this.setTooltip("");
        this.setHelpUrl("");
    }
};


Blockly.Blocks['do_module'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Do module")
            .appendField(new Blockly.FieldTextInput("edit"), "module_name")
            .appendField(new Blockly.FieldImage(play_edit, 20, 20, "*", edit_module));
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour('#C2185B');
        this.setTooltip("Definition of a robot behavior");
        this.setHelpUrl("");
    }
};


Blockly.Blocks['do_action_robot'] = {
    init: function () {
        this.appendValueInput("input")
            .setCheck(null)
            .appendField("action");
        this.appendDummyInput()
            .appendField("with robot(s)");
        this.appendValueInput("robots")
            .setCheck(null)
        this.appendDummyInput()
            .appendField(new Blockly.FieldImage(play_image, 20, 20, "*", play_event));
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour("#0069c0");
        this.setTooltip("Block used to indicate which human action is used to finish the robot behavior");
        this.setHelpUrl("");
    }
};


Blockly.Blocks['do_action'] = {
    init: function () {
        this.appendValueInput("input")
            .setCheck(null)
            .appendField("action");
        this.appendDummyInput()
            .appendField(new Blockly.FieldImage(play_image, 20, 20, "*", play_event));
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour("#0069c0");
        this.setTooltip("Block used to indicate which human action is used to finish the robot behavior");
        this.setHelpUrl("");
    }
};


Blockly.Blocks['add_robot'] = {
    init: function () {
        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdown(input_robots["options"]), "robot");
        this.setOutput(true, null);
        this.setColour("#2196f3");
        this.setTooltip("");
        this.setHelpUrl("");
    }
};


Blockly.Blocks['do_behavior'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Execute pattern")
            .appendField(new Blockly.FieldTextInput("edit"), "module_name")
            .appendField(new Blockly.FieldImage(play_edit, 20, 20, "*", edit_pattern));
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour("#6A1B9A");
        this.setTooltip("");
        this.setHelpUrl("");
    }
};




Blockly.Blocks['two_options_question_wait_answer'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Pattern name:")
            .appendField(new Blockly.FieldTextInput("select"), "module_name")
            .setAlign(Blockly.ALIGN_RIGHT)
        //.appendField(new Blockly.FieldImage(configuration_image, 16, 16, "*", edit_primitive))
        this.appendDummyInput()
            .appendField("Robot ask:");
        this.appendStatementInput("ask")
            .setCheck(null);
        this.appendDummyInput()
            .appendField("Robot wait for response")
            .appendField(new Blockly.FieldNumber(3, 0, Infinity, 1), "time")
            .appendField("seconds");
        this.appendDummyInput()
            .appendField("If human said ")
            .appendField(new Blockly.FieldTextInput("yes"), "option1")
            .appendField("robot do:");
        this.appendStatementInput("yes")
            .setCheck(null);
        this.appendDummyInput()
            .appendField("If human said")
            .appendField(new Blockly.FieldTextInput("no"), "option2")
            .appendField("robot do:");
        this.appendStatementInput("no")
            .setCheck(null);
        this.appendDummyInput()
            .appendField("If robot do not understand then do:");
        this.appendStatementInput("other")
            .setCheck(null);
        this.setColour("#4A148C");
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['selector'] = {
    init: function() {
      this.appendDummyInput()
          .setAlign(Blockly.ALIGN_RIGHT)
          .appendField("Selector");
      this.appendStatementInput("seq1")
          .setCheck(null)
          .setAlign(Blockly.ALIGN_CENTRE);
      this.setInputsInline(false);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour("#004D40");
   this.setTooltip("");
   this.setHelpUrl("");
    }
  };


Blockly.Blocks['check_perception'] = {
    init: function() {
      this.appendValueInput("option1")
          .setCheck(null)
          .appendField("IF detected");
      this.appendStatementInput("seq2")
          .setCheck(null)
          .setAlign(Blockly.ALIGN_CENTRE)
          .appendField("DO:");
      this.setInputsInline(false);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour("#006064");
   this.setTooltip("");
   this.setHelpUrl("");
    }
  };






