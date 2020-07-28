'use strict'
goog.provide('Blockly.Python.primitives');
goog.require('Blockly.Python');

Blockly.Python['animation'] = function(block) {
var text = block.getFieldValue('inp_1');
var options_dic = block.getFieldValue('inp_2');
options_dic = rizeBlockly.formatOptions(options_dic) 
var code  = '{"primitive":"animation"'+","+ '"input":' + '"' + text + '"'+","+'"options":' + options_dic + '}';
return [code, Blockly.Python.ORDER_NONE];
};

Blockly.Python['close_hand'] = function(block) {
var text = block.getFieldValue('inp_1');
var code  = '{"primitive":"close_hand"'+","+ '"input":' + '"' + text + '"'+","+'"options":"none"}';
return [code, Blockly.Python.ORDER_NONE];
};

Blockly.Python['emotion'] = function(block) {
var text = block.getFieldValue('inp_1');
var code  = '{"primitive":"emotion"'+","+ '"input":' + '"' + text + '"'+","+'"options":"none"}';
return [code, Blockly.Python.ORDER_NONE];
};

Blockly.Python['human_detected'] = function(block) {
var text = block.getFieldValue('inp_1');
var code  = '{"primitive":"human_detected"'+","+ '"input":' + '"' + text + '"'+","+'"options":"none"}';
return [code, Blockly.Python.ORDER_NONE];
};

Blockly.Python['mode'] = function(block) {
var text = block.getFieldValue('inp_1');
var code  = '{"primitive":"mode"'+","+ '"input":' + '"' + text + '"'+","+'"options":"none"}';
return [code, Blockly.Python.ORDER_NONE];
};

Blockly.Python['object_detected'] = function(block) {
var text = block.getFieldValue('inp_1');
var code  = '{"primitive":"object_detected"'+","+ '"input":' + '"' + text + '"'+","+'"options":"none"}';
return [code, Blockly.Python.ORDER_NONE];
};

Blockly.Python['open_hand'] = function(block) {
var text = block.getFieldValue('inp_1');
var code  = '{"primitive":"open_hand"'+","+ '"input":' + '"' + text + '"'+","+'"options":"none"}';
return [code, Blockly.Python.ORDER_NONE];
};

Blockly.Python['say'] = function(block) {
var text = block.getFieldValue('inp_1');
var options_dic = block.getFieldValue('inp_2');
options_dic = rizeBlockly.formatOptions(options_dic) 
var code  = '{"primitive":"say"'+","+ '"input":' + '"' + text + '"'+","+'"options":' + options_dic + '}';
return [code, Blockly.Python.ORDER_NONE];
};

Blockly.Python['take_photo'] = function(block) {
var text = block.getFieldValue('inp_1');
var code  = '{"primitive":"take_photo"'+","+ '"input":' + '"' + text + '"'+","+'"options":"none"}';
return [code, Blockly.Python.ORDER_NONE];
};

Blockly.Python['touched'] = function(block) {
var text = block.getFieldValue('inp_1');
var code  = '{"primitive":"touched"'+","+ '"input":' + '"' + text + '"'+","+'"options":"none"}';
return [code, Blockly.Python.ORDER_NONE];
};

Blockly.Python['track_people_with'] = function(block) {
var text = block.getFieldValue('inp_1');
var options_dic = block.getFieldValue('inp_2');
options_dic = rizeBlockly.formatOptions(options_dic) 
var code  = '{"primitive":"track_people_with"'+","+ '"input":' + '"' + text + '"'+","+'"options":' + options_dic + '}';
return [code, Blockly.Python.ORDER_NONE];
};

Blockly.Python['track_redball_with'] = function(block) {
var text = block.getFieldValue('inp_1');
var options_dic = block.getFieldValue('inp_2');
options_dic = rizeBlockly.formatOptions(options_dic) 
var code  = '{"primitive":"track_redball_with"'+","+ '"input":' + '"' + text + '"'+","+'"options":' + options_dic + '}';
return [code, Blockly.Python.ORDER_NONE];
};

Blockly.Python['track_sound_with'] = function(block) {
var text = block.getFieldValue('inp_1');
var options_dic = block.getFieldValue('inp_2');
options_dic = rizeBlockly.formatOptions(options_dic) 
var code  = '{"primitive":"track_sound_with"'+","+ '"input":' + '"' + text + '"'+","+'"options":' + options_dic + '}';
return [code, Blockly.Python.ORDER_NONE];
};

Blockly.Python['turn'] = function(block) {
var text = block.getFieldValue('inp_1');
var options_dic = block.getFieldValue('inp_2');
options_dic = rizeBlockly.formatOptions(options_dic) 
var code  = '{"primitive":"turn"'+","+ '"input":' + '"' + text + '"'+","+'"options":' + options_dic + '}';
return [code, Blockly.Python.ORDER_NONE];
};

Blockly.Python['wait'] = function(block) {
var text = block.getFieldValue('inp_1');
var code  = '{"primitive":"wait"'+","+ '"input":' + '"' + text + '"'+","+'"options":"none"}';
return [code, Blockly.Python.ORDER_NONE];
};

Blockly.Python['walk'] = function(block) {
var text = block.getFieldValue('inp_1');
var options_dic = block.getFieldValue('inp_2');
options_dic = rizeBlockly.formatOptions(options_dic) 
var code  = '{"primitive":"walk"'+","+ '"input":' + '"' + text + '"'+","+'"options":' + options_dic + '}';
return [code, Blockly.Python.ORDER_NONE];
};

Blockly.Python['walk_toward'] = function(block) {
var text = block.getFieldValue('inp_1');
var options_dic = block.getFieldValue('inp_2');
options_dic = rizeBlockly.formatOptions(options_dic) 
var code  = '{"primitive":"walk_toward"'+","+ '"input":' + '"' + text + '"'+","+'"options":' + options_dic + '}';
return [code, Blockly.Python.ORDER_NONE];
};

Blockly.Python['word'] = function(block) {
var text = block.getFieldValue('inp_1');
var code  = '{"primitive":"word"'+","+ '"input":' + '"' + text + '"'+","+'"options":"none"}';
return [code, Blockly.Python.ORDER_NONE];
};