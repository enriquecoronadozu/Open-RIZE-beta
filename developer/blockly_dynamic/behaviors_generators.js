'use strict'
goog.provide('Blockly.Python.behaviors');
goog.require('Blockly.Python');


Blockly.Python['lists_and'] = function (block) {
  // Create a list with any number of elements of any type.
  var elements = new Array(block.itemCount_);
  for (var i = 0; i < block.itemCount_; i++) {
    elements[i] = Blockly.Python.valueToCode(block, 'ADD' + i,
      Blockly.Python.ORDER_NONE) || 'None';
  }
  var code = '[' + elements.join(', ') + ']';

  var value_json = JSON.parse(code)
  console.log(value_json)
  var module = bt_blocks.sequence(value_json)
  console.log(module)
  return [JSON.stringify(module), Blockly.Python.ORDER_NONE]; 
};

Blockly.Python['lists_or'] = function (block) {
  // Create a list with any number of elements of any type.
  var elements = new Array(block.itemCount_);
  for (var i = 0; i < block.itemCount_; i++) {
    elements[i] = Blockly.Python.valueToCode(block, 'ADD' + i,
      Blockly.Python.ORDER_NONE) || 'None';
  }
  var code = '[' + elements.join(', ') + ']';

  var value_json = JSON.parse(code)
  console.log(value_json)
  var module = bt_blocks.selector(value_json)
  console.log(module)
  return [JSON.stringify(module), Blockly.Python.ORDER_NONE]; 
};


Blockly.Python['reaction'] = function (block) {
  var text_goal_name = block.getFieldValue('module_name');
  var value_activated = Blockly.Python.valueToCode(block, 'activated', Blockly.Python.ORDER_NONE);
  console.log(value_activated)
  var statements_behavior = Blockly.Python.statementToCode(block, 'behavior');
  var dropdown_priority = block.getFieldValue('priority');
  var code = rizeBlocks.reaction(text_goal_name, value_activated, statements_behavior, dropdown_priority)
  return code;
};


Blockly.Python['goal'] = function (block) {
  var text_goal_name = block.getFieldValue('module_name');
  var value_activated = Blockly.Python.valueToCode(block, 'activated', Blockly.Python.ORDER_NONE);
  var statements_behavior = Blockly.Python.statementToCode(block, 'behavior');
  var value_canceled = Blockly.Python.valueToCode(block, 'canceled', Blockly.Python.ORDER_NONE);
  var dropdown_priority = block.getFieldValue('priority');
  var number_delay = block.getFieldValue('delay');
  var code = rizeBlocks.goal(text_goal_name, value_activated, statements_behavior, value_canceled, dropdown_priority, number_delay)
  return code;
};

Blockly.Python['goal_advanced'] = function (block) {
  var text_goal_name = block.getFieldValue('module_name');
  var value_activated = Blockly.Python.valueToCode(block, 'activated', Blockly.Python.ORDER_NONE);
  var statements_behavior = Blockly.Python.statementToCode(block, 'behavior');
  var statements_stop_behavior = Blockly.Python.statementToCode(block, 'stop_behavior');
  var statements_return_behavior = Blockly.Python.statementToCode(block, 'return_behavior');
  var value_canceled = Blockly.Python.valueToCode(block, 'canceled', Blockly.Python.ORDER_NONE);
  var value_options = Blockly.Python.valueToCode(block, 'options', Blockly.Python.ORDER_NONE);
  var dropdown_priority = block.getFieldValue('priority');
  var code = rizeBlocks.goal_advanced(text_goal_name, value_activated, statements_behavior, statements_stop_behavior, statements_return_behavior, value_canceled, dropdown_priority, value_options)
  return code;
};


Blockly.Python['module'] = function (block) {
  var text_module_name = block.getFieldValue('module_name');
  var statements_input = Blockly.Python.statementToCode(block, 'input');
  var dropdown_mode = block.getFieldValue('mode');
  var code = rizeBlocks.module(text_module_name, statements_input, dropdown_mode)
  return code;
};


Blockly.Python['do_module'] = function (block) {
  var text_name = block.getFieldValue('module_name');
  var code = rizeBlocks.do_module(text_name)
  return code;
};

Blockly.Python['do_random_module'] = function (block) {
  var text_name = block.getFieldValue('module_name');
  var code = rizeBlocks.do_random_module(text_name)
  return code;
};

Blockly.Python['do_action_robot'] = function (block) {
  var value_input = Blockly.Python.valueToCode(block, 'input', Blockly.Python.ORDER_NONE);
  var value_robots = Blockly.Python.valueToCode(block, 'robots', Blockly.Python.ORDER_NONE);
  var code = rizeBlocks.do_action_robots(value_input, value_robots)
  return code;
};

Blockly.Python['do_action'] = function (block) {
  var value_input = Blockly.Python.valueToCode(block, 'input', Blockly.Python.ORDER_NONE);
  var code = rizeBlocks.do_action(value_input)
  return code;
};

Blockly.Python['add_robot'] = function (block) {
  var dropdown_robot = block.getFieldValue('robot');
  var code = dropdown_robot;
  return [code, Blockly.Python.ORDER_NONE];
};


Blockly.Python['do_behavior'] = function (block) {
  var text_behavior = block.getFieldValue('module_name');
  var code = rizeBlocks.do_behavior(text_behavior);
  return code;
};


Blockly.Python['two_options_question_wait_answer'] = function (block) {
  //var text_name = block.getFieldValue('module_name');
  var text_name = "";
  var statements_ask = Blockly.Python.statementToCode(block, 'ask');
  var number_time = block.getFieldValue('time');
  var text_option1 = block.getFieldValue('option1');
  var statements_yes = Blockly.Python.statementToCode(block, 'yes');
  var text_option2 = block.getFieldValue('option2');
  var statements_no = Blockly.Python.statementToCode(block, 'no');
  var statements_other = Blockly.Python.statementToCode(block, 'other');
  // TODO: Assemble Python into code variable.
  var code = rizeBlocks.two_options_question_wait_answer(text_name, statements_ask, number_time,
    text_option1, statements_yes, text_option2, statements_no, statements_other);
  return code
};

Blockly.Python['check_perception'] = function (block) {
  var value_option1 = Blockly.Python.valueToCode(block, 'option1', Blockly.Python.ORDER_NONE);
  var statements_seq2 = Blockly.Python.statementToCode(block, 'seq2');
  // TODO: Assemble undefined into code variable.
  var code = rizeBlocks.check_perception(value_option1, statements_seq2)
  return code;
};

Blockly.Python['selector'] = function (block) {
  var statements_seq1 = Blockly.Python.statementToCode(block, 'seq1');
  // TODO: Assemble undefined into code variable.
  var code = rizeBlocks.module_selector(statements_seq1)
  return code;
};

Blockly.Python['set_interaction_state'] = function (block) {
  var text_state = block.getFieldValue('state');
  var code = rizeBlocks.set_interaction_state(text_state);
  return code;
};



