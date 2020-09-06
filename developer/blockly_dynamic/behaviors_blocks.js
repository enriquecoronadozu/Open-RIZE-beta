goog.provide('Blockly.Blocks.behaviors');
goog.require('Blockly.Blocks');



Blockly.Blocks['lists_create_with_item'] = {
    /**
     * Mutator block for adding items.
     * @this Blockly.Block
     */
    init: function() {
      this.setColour(Blockly.Blocks.lists.HUE);
      this.appendDummyInput()
          .appendField("item");         // TODO, kike
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setTooltip(Blockly.Msg.LISTS_CREATE_WITH_ITEM_TOOLTIP);
      this.contextMenu = false;
    }
  };
  
Blockly.Blocks['lists_and'] = {
    /**
     * Block for creating a list with any number of elements of any type.
     * @this Blockly.Block
     */
    init: function() {
      this.setHelpUrl(Blockly.Msg.LISTS_CREATE_WITH_HELPURL);
      this.setColour(Blockly.Blocks.lists.HUE);
      this.itemCount_ = 2;
      this.updateShape_();
      this.setOutput(true, 'Array');
      this.setMutator(new Blockly.Mutator(['lists_create_with_item']));
      this.setTooltip(Blockly.Msg.LISTS_CREATE_WITH_TOOLTIP);
    },
    /**
     * Create XML to represent list inputs.
     * @return {!Element} XML storage element.
     * @this Blockly.Block
     */
    mutationToDom: function() {
      var container = document.createElement('mutation');
      container.setAttribute('items', this.itemCount_);
      return container;
    },
    /**
     * Parse XML to restore the list inputs.
     * @param {!Element} xmlElement XML storage element.
     * @this Blockly.Block
     */
    domToMutation: function(xmlElement) {
      this.itemCount_ = parseInt(xmlElement.getAttribute('items'), 10);
      this.updateShape_();
    },
    /**
     * Populate the mutator's dialog with this block's components.
     * @param {!Blockly.Workspace} workspace Mutator's workspace.
     * @return {!Blockly.Block} Root block in mutator.
     * @this Blockly.Block
     */
    decompose: function(workspace) {
      var containerBlock = workspace.newBlock('lists_create_with_container');
      containerBlock.initSvg();
      var connection = containerBlock.getInput('STACK').connection;
      for (var i = 0; i < this.itemCount_; i++) {
        var itemBlock = workspace.newBlock('lists_create_with_item');
        itemBlock.initSvg();
        connection.connect(itemBlock.previousConnection);
        connection = itemBlock.nextConnection;
      }
      return containerBlock;
    },
    /**
     * Reconfigure this block based on the mutator dialog's components.
     * @param {!Blockly.Block} containerBlock Root block in mutator.
     * @this Blockly.Block
     */
    compose: function(containerBlock) {
      var itemBlock = containerBlock.getInputTargetBlock('STACK');
      // Count number of inputs.
      var connections = [];
      while (itemBlock) {
        connections.push(itemBlock.valueConnection_);
        itemBlock = itemBlock.nextConnection &&
            itemBlock.nextConnection.targetBlock();
      }
      // Disconnect any children that don't belong.
      for (var i = 0; i < this.itemCount_; i++) {
        var connection = this.getInput('ADD' + i).connection.targetConnection;
        if (connection && connections.indexOf(connection) == -1) {
          connection.disconnect();
        }
      }
      this.itemCount_ = connections.length;
      this.updateShape_();
      // Reconnect any child blocks.
      for (var i = 0; i < this.itemCount_; i++) {
        Blockly.Mutator.reconnect(connections[i], this, 'ADD' + i);
      }
    },
    /**
     * Store pointers to any connected child blocks.
     * @param {!Blockly.Block} containerBlock Root block in mutator.
     * @this Blockly.Block
     */
    saveConnections: function(containerBlock) {
      var itemBlock = containerBlock.getInputTargetBlock('STACK');
      var i = 0;
      while (itemBlock) {
        var input = this.getInput('ADD' + i);
        itemBlock.valueConnection_ = input && input.connection.targetConnection;
        i++;
        itemBlock = itemBlock.nextConnection &&
            itemBlock.nextConnection.targetBlock();
      }
    },
    /**
     * Modify this block to have the correct number of inputs.
     * @private
     * @this Blockly.Block
     */
    updateShape_: function() {
      if (this.itemCount_ && this.getInput('EMPTY')) {
        this.removeInput('EMPTY');
      } else if (!this.itemCount_ && !this.getInput('EMPTY')) {
        this.appendDummyInput('EMPTY')
            .appendField("and");
      }
      // Add new inputs.
      for (var i = 0; i < this.itemCount_; i++) {
        if (!this.getInput('ADD' + i)) {
          var input = this.appendValueInput('ADD' + i);
          if (i == 0) {
            input.appendField("and");
          }
        }
      }
      // Remove deleted inputs.
      while (this.getInput('ADD' + i)) {
        this.removeInput('ADD' + i);
        i++;
      }
    }
  };
  
  
  Blockly.Blocks['lists_or'] = {
    /**
     * Block for creating a list with any number of elements of any type.
     * @this Blockly.Block
     */
    init: function() {
      this.setHelpUrl(Blockly.Msg.LISTS_CREATE_WITH_HELPURL);
      this.setColour(Blockly.Blocks.lists.HUE);
      this.itemCount_ = 2;
      this.updateShape_();
      this.setOutput(true, 'Array');
      this.setMutator(new Blockly.Mutator(['lists_create_with_item']));
      this.setTooltip(Blockly.Msg.LISTS_CREATE_WITH_TOOLTIP);
    },
    /**
     * Create XML to represent list inputs.
     * @return {!Element} XML storage element.
     * @this Blockly.Block
     */
    mutationToDom: function() {
      var container = document.createElement('mutation');
      container.setAttribute('items', this.itemCount_);
      return container;
    },
    /**
     * Parse XML to restore the list inputs.
     * @param {!Element} xmlElement XML storage element.
     * @this Blockly.Block
     */
    domToMutation: function(xmlElement) {
      this.itemCount_ = parseInt(xmlElement.getAttribute('items'), 10);
      this.updateShape_();
    },
    /**
     * Populate the mutator's dialog with this block's components.
     * @param {!Blockly.Workspace} workspace Mutator's workspace.
     * @return {!Blockly.Block} Root block in mutator.
     * @this Blockly.Block
     */
    decompose: function(workspace) {
      var containerBlock = workspace.newBlock('lists_create_with_container');
      containerBlock.initSvg();
      var connection = containerBlock.getInput('STACK').connection;
      for (var i = 0; i < this.itemCount_; i++) {
        var itemBlock = workspace.newBlock('lists_create_with_item');
        itemBlock.initSvg();
        connection.connect(itemBlock.previousConnection);
        connection = itemBlock.nextConnection;
      }
      return containerBlock;
    },
    /**
     * Reconfigure this block based on the mutator dialog's components.
     * @param {!Blockly.Block} containerBlock Root block in mutator.
     * @this Blockly.Block
     */
    compose: function(containerBlock) {
      var itemBlock = containerBlock.getInputTargetBlock('STACK');
      // Count number of inputs.
      var connections = [];
      while (itemBlock) {
        connections.push(itemBlock.valueConnection_);
        itemBlock = itemBlock.nextConnection &&
            itemBlock.nextConnection.targetBlock();
      }
      // Disconnect any children that don't belong.
      for (var i = 0; i < this.itemCount_; i++) {
        var connection = this.getInput('ADD' + i).connection.targetConnection;
        if (connection && connections.indexOf(connection) == -1) {
          connection.disconnect();
        }
      }
      this.itemCount_ = connections.length;
      this.updateShape_();
      // Reconnect any child blocks.
      for (var i = 0; i < this.itemCount_; i++) {
        Blockly.Mutator.reconnect(connections[i], this, 'ADD' + i);
      }
    },
    /**
     * Store pointers to any connected child blocks.
     * @param {!Blockly.Block} containerBlock Root block in mutator.
     * @this Blockly.Block
     */
    saveConnections: function(containerBlock) {
      var itemBlock = containerBlock.getInputTargetBlock('STACK');
      var i = 0;
      while (itemBlock) {
        var input = this.getInput('ADD' + i);
        itemBlock.valueConnection_ = input && input.connection.targetConnection;
        i++;
        itemBlock = itemBlock.nextConnection &&
            itemBlock.nextConnection.targetBlock();
      }
    },
    /**
     * Modify this block to have the correct number of inputs.
     * @private
     * @this Blockly.Block
     */
    updateShape_: function() {
      if (this.itemCount_ && this.getInput('EMPTY')) {
        this.removeInput('EMPTY');
      } else if (!this.itemCount_ && !this.getInput('EMPTY')) {
        this.appendDummyInput('EMPTY')
            .appendField("or");
      }
      // Add new inputs.
      for (var i = 0; i < this.itemCount_; i++) {
        if (!this.getInput('ADD' + i)) {
          var input = this.appendValueInput('ADD' + i);
          if (i == 0) {
            input.appendField("or");
          }
        }
      }
      // Remove deleted inputs.
      while (this.getInput('ADD' + i)) {
        this.removeInput('ADD' + i);
        i++;
      }
    }
  };

Blockly.Blocks['or2'] = {
    init: function() {
      this.appendDummyInput();
      this.appendValueInput("OR1")
          .setCheck(null);
      this.appendDummyInput()
          .appendField("OR");
      this.appendValueInput("OR2")
          .setCheck(null);
      this.setInputsInline(true);
      this.setOutput(true, null);
      this.setColour(230);
   this.setTooltip("");
   this.setHelpUrl("");
    }
  };

  Blockly.Blocks['and2'] = {
    init: function() {
      this.appendDummyInput();
      this.appendValueInput("OR1")
          .setCheck(null);
      this.appendDummyInput()
          .appendField("OR");
      this.appendValueInput("OR2")
          .setCheck(null);
      this.setInputsInline(true);
      this.setOutput(true, null);
      this.setColour(230);
   this.setTooltip("");
   this.setHelpUrl("");
    }
  };




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






