goog.provide('Blockly.Blocks.primitives');
goog.require('Blockly.Blocks');


Blockly.Blocks["animation"] = {
init: function() {
	this.appendDummyInput()
		.appendField("Animation")
		.appendField(new Blockly.FieldTextInput("edit"), "inp_1")
		.appendField(" options")
		.appendField(new Blockly.FieldTextInput("edit"), "inp_2")
		.appendField(new Blockly.FieldImage(configuration_image, 16, 16, "*", edit_primitive))		;
	this.setColour("#2196f3");
	this.setOutput(true,['action']);

	this.setTooltip("Perform an animation");
 	this.setHelpUrl("");
}};

Blockly.Blocks["close_hand"] = {
init: function() {
	this.appendDummyInput()
		.appendField("Close hand")
		.appendField(new Blockly.FieldTextInput("edit"), "inp_1")
		.appendField(new Blockly.FieldImage(configuration_image, 16, 16, "*", edit_primitive))		;
	this.setColour("#2196f3");
	this.setOutput(true,['action']);

	this.setTooltip("Close robot's hand");
 	this.setHelpUrl("");
}};

Blockly.Blocks["emotion"] = {
init: function() {
	this.appendDummyInput()
		.appendField("Emotion")
		.appendField(new Blockly.FieldTextInput("edit"), "inp_1")
		.appendField(new Blockly.FieldImage(configuration_image, 16, 16, "*", edit_primitive))		;
	this.setColour("#009688");
	this.setOutput(true,['condition']);

	this.setTooltip("Some emotion");
 	this.setHelpUrl("");
}};

Blockly.Blocks["human_detected"] = {
init: function() {
	this.appendDummyInput()
		.appendField("Human detected (camera)")
		.appendField(new Blockly.FieldTextInput("edit"), "inp_1")
		.appendField(new Blockly.FieldImage(configuration_image, 16, 16, "*", edit_primitive))		;
	this.setColour("#009688");
	this.setOutput(true,['condition']);

	this.setTooltip("Is human detected with the camera?");
 	this.setHelpUrl("");
}};

Blockly.Blocks["mode"] = {
init: function() {
	this.appendDummyInput()
		.appendField("Mode (Wake up/ Rest)")
		.appendField(new Blockly.FieldTextInput("edit"), "inp_1")
		.appendField(new Blockly.FieldImage(configuration_image, 16, 16, "*", edit_primitive))		;
	this.setColour("#2196f3");
	this.setOutput(true,['action']);

	this.setTooltip("Wake or rest the robot");
 	this.setHelpUrl("");
}};

Blockly.Blocks["object_detected"] = {
init: function() {
	this.appendDummyInput()
		.appendField("Object detected")
		.appendField(new Blockly.FieldTextInput("edit"), "inp_1")
		.appendField(new Blockly.FieldImage(configuration_image, 16, 16, "*", edit_primitive))		;
	this.setColour("#009688");
	this.setOutput(true,['condition']);

	this.setTooltip("Object detected");
 	this.setHelpUrl("");
}};

Blockly.Blocks["open_hand"] = {
init: function() {
	this.appendDummyInput()
		.appendField("Open hand")
		.appendField(new Blockly.FieldTextInput("edit"), "inp_1")
		.appendField(new Blockly.FieldImage(configuration_image, 16, 16, "*", edit_primitive))		;
	this.setColour("#2196f3");
	this.setOutput(true,['action']);

	this.setTooltip("Open robot's hands");
 	this.setHelpUrl("");
}};

Blockly.Blocks["say"] = {
init: function() {
	this.appendDummyInput()
		.appendField("Say")
		.appendField(new Blockly.FieldTextInput("edit"), "inp_1")
		.appendField(" options")
		.appendField(new Blockly.FieldTextInput("edit"), "inp_2")
		.appendField(new Blockly.FieldImage(configuration_image, 16, 16, "*", edit_primitive))		;
	this.setColour("#2196f3");
	this.setOutput(true,['action']);

	this.setTooltip("Say something with the robot");
 	this.setHelpUrl("");
}};

Blockly.Blocks["take_photo"] = {
init: function() {
	this.appendDummyInput()
		.appendField("Take photo with camera on")
		.appendField(new Blockly.FieldTextInput("edit"), "inp_1")
		.appendField(new Blockly.FieldImage(configuration_image, 16, 16, "*", edit_primitive))		;
	this.setColour("#2196f3");
	this.setOutput(true,['action']);

	this.setTooltip("Take and show a photo");
 	this.setHelpUrl("");
}};

Blockly.Blocks["touched"] = {
init: function() {
	this.appendDummyInput()
		.appendField("Touched")
		.appendField(new Blockly.FieldTextInput("edit"), "inp_1")
		.appendField(new Blockly.FieldImage(configuration_image, 16, 16, "*", edit_primitive))		;
	this.setColour("#009688");
	this.setOutput(true,['condition']);

	this.setTooltip("Is robot touched");
 	this.setHelpUrl("");
}};

Blockly.Blocks["track_people_with"] = {
init: function() {
	this.appendDummyInput()
		.appendField("Track people with")
		.appendField(new Blockly.FieldTextInput("edit"), "inp_1")
		.appendField(" options")
		.appendField(new Blockly.FieldTextInput("edit"), "inp_2")
		.appendField(new Blockly.FieldImage(configuration_image, 16, 16, "*", edit_primitive))		;
	this.setColour("#2196f3");
	this.setOutput(true,['action']);

	this.setTooltip("Track human");
 	this.setHelpUrl("");
}};

Blockly.Blocks["track_redball_with"] = {
init: function() {
	this.appendDummyInput()
		.appendField("Track red ball with")
		.appendField(new Blockly.FieldTextInput("edit"), "inp_1")
		.appendField(" options")
		.appendField(new Blockly.FieldTextInput("edit"), "inp_2")
		.appendField(new Blockly.FieldImage(configuration_image, 16, 16, "*", edit_primitive))		;
	this.setColour("#2196f3");
	this.setOutput(true,['action']);

	this.setTooltip("Track red objects");
 	this.setHelpUrl("");
}};

Blockly.Blocks["track_sound_with"] = {
init: function() {
	this.appendDummyInput()
		.appendField("Track sound with")
		.appendField(new Blockly.FieldTextInput("edit"), "inp_1")
		.appendField(" options")
		.appendField(new Blockly.FieldTextInput("edit"), "inp_2")
		.appendField(new Blockly.FieldImage(configuration_image, 16, 16, "*", edit_primitive))		;
	this.setColour("#2196f3");
	this.setOutput(true,['action']);

	this.setTooltip("Track sound sources");
 	this.setHelpUrl("");
}};

Blockly.Blocks["turn"] = {
init: function() {
	this.appendDummyInput()
		.appendField("Turn")
		.appendField(new Blockly.FieldTextInput("edit"), "inp_1")
		.appendField(" options")
		.appendField(new Blockly.FieldTextInput("edit"), "inp_2")
		.appendField(new Blockly.FieldImage(configuration_image, 16, 16, "*", edit_primitive))		;
	this.setColour("#2196f3");
	this.setOutput(true,['action']);

	this.setTooltip("Turn robot body");
 	this.setHelpUrl("");
}};

Blockly.Blocks["wait"] = {
init: function() {
	this.appendDummyInput()
		.appendField("Wait (seconds)")
		.appendField(new Blockly.FieldTextInput("edit"), "inp_1")
		.appendField(new Blockly.FieldImage(configuration_image, 16, 16, "*", edit_primitive))		;
	this.setColour("#2196f3");
	this.setOutput(true,['action']);

	this.setTooltip("Wait some seconds");
 	this.setHelpUrl("");
}};

Blockly.Blocks["walk"] = {
init: function() {
	this.appendDummyInput()
		.appendField("Walk")
		.appendField(new Blockly.FieldTextInput("edit"), "inp_1")
		.appendField(" options")
		.appendField(new Blockly.FieldTextInput("edit"), "inp_2")
		.appendField(new Blockly.FieldImage(configuration_image, 16, 16, "*", edit_primitive))		;
	this.setColour("#2196f3");
	this.setOutput(true,['action']);

	this.setTooltip("Turn robot body");
 	this.setHelpUrl("");
}};

Blockly.Blocks["walk_toward"] = {
init: function() {
	this.appendDummyInput()
		.appendField("Walk towards")
		.appendField(new Blockly.FieldTextInput("edit"), "inp_1")
		.appendField(" options")
		.appendField(new Blockly.FieldTextInput("edit"), "inp_2")
		.appendField(new Blockly.FieldImage(configuration_image, 16, 16, "*", edit_primitive))		;
	this.setColour("#2196f3");
	this.setOutput(true,['action']);

	this.setTooltip("Walk towards people or a red ball");
 	this.setHelpUrl("");
}};

Blockly.Blocks["word"] = {
init: function() {
	this.appendDummyInput()
		.appendField("Word")
		.appendField(new Blockly.FieldTextInput("edit"), "inp_1")
		.appendField(new Blockly.FieldImage(configuration_image, 16, 16, "*", edit_primitive))		;
	this.setColour("#009688");
	this.setOutput(true,['condition']);

	this.setTooltip("Listen human speech and detect word");
 	this.setHelpUrl("");
}};