class BehaviorTree {

    constructor() {
        this.n_action = 0;
        this.n_condition = 0;
        this.n_sequence = 0;
        this.n_goal = 0;
        this.n_reaction = 0;
    }

    getID(type_node) {
        let init = ""
        let value = 0
        if (type_node === "action") { init = "acti"; value = this.n_action++ }
        if (type_node === "condition") { init = "cond"; value = this.n_condition++ }
        if (type_node === "sequence") { init = "sequ"; value = this.n_sequence++ }
        if (type_node === "goal") { init = "goal"; value = this.n_goal++ }
        if (type_node === "reaction") { init = "reac"; value = this.n_reaction++ }

        Date.prototype.yyyymmddhhmmss = function () {
            var yyyy = this.getFullYear();
            var mm = this.getMonth() < 9 ? "0" + (this.getMonth() + 1) : (this.getMonth() + 1); // getMonth() is zero-based
            var dd = this.getDate() < 10 ? "0" + this.getDate() : this.getDate();
            var hh = this.getHours() < 10 ? "0" + this.getHours() : this.getHours();
            var min = this.getMinutes() < 10 ? "0" + this.getMinutes() : this.getMinutes();
            var ss = this.getSeconds() < 10 ? "0" + this.getSeconds() : this.getSeconds();
            return "".concat(yyyy).concat(mm).concat(dd).concat(hh).concat(min).concat(ss);
        };
        var d = new Date();
        return init + d.yyyymmddhhmmss() + "-" + value;
    }

    isJSON(primitives) {
        let json_primitives = {}
        if (typeof primitives === 'string' || primitives instanceof String) {
            try {
                json_primitives = JSON.parse(primitives)
            }
            catch (e) {
                console.log("ERROR: is not string or JSON")
                console.log(primitives);
            }
        }
        else {
            json_primitives = primitives
        }
        return json_primitives
    }


    action(primitives, robots) {

        let json_primitives = this.isJSON(primitives)

        let action_json = {
            "node": "action",
            "primitives": [],
            "robots": robots,
            "state": "idle",
            "times": 0,
            "id": this.getID("action")
        }

        if (Array.isArray(json_primitives)) {
            action_json["primitives"] = json_primitives
        }
        else {
            action_json["primitives"] = json_primitives
        }
        return action_json
    }
    condition(primitive) {

        let json_primitive = this.isJSON(primitive)
        let json_value = {
            "node": "condition",
            "primitive": json_primitive["primitive"],
            "input": json_primitive["input"],
            "state": "idle",
            "robots": "any",
            "times": 0,
            "id": this.getID("condition")
        }

        try {

            if ("options" in json_primitive) {
                if ("remember" in json_primitive["options"]) {
                    json_value["remember"] = json_primitive["options"]["remember"]
                }
                if ("keep" in json_primitive["options"]) {
                    json_value["keep"] = false
                }

            }

        } catch (error) {
            json_value["remember"] = 1;
        }

        return json_value
    }

    sequence(children) {
        let json_ = {
            "node": "sequence",
            "state": "idle",
            "times": 0,
            "children": children,
            "id": this.getID("sequence")
        }
        return json_
    }

    selector(children) {
        let json_ = {
            "node": "selector",
            "state": "idle",
            "times": 0,
            "children": children,
            "id": this.getID("selector")
        }
        return json_
    }

    random_selector(children) {
        let json_ = {
            "node": "random_selector",
            "state": "idle",
            "times": 0,
            "n": 'none',
            "children": children,
            "id": this.getID("random")
        }
        return json_
    }


    // Executed when one start_condition is meet, finished when the one stop_condition is meet
    goal(name_goal, start_conditions, stop_conditions, goal_bt, stop_bt, return_bt, utility, options, delay) {
        console.log(start_conditions)
        let json_goal = {
            "node": "goal",
            "name": name_goal,
            "activate": start_conditions,
            "cancel": stop_conditions,
            "bt": goal_bt,
            "stop_bt": stop_bt,
            "return_bt": return_bt,
            "utility": utility,
            "delay": delay,
            "options": options,
            "id": this.getID("goal")
        }
        return json_goal
    }

    // Executed anytime one start_condition is meet, not allows preemption.
    // It executes un executed until their sub-bt returns a non running,
    reaction(name_reaction, start_conditions, sub_bt, utility) {
        let json_reaction = {
            "name": name_reaction,
            "activate": start_conditions,
            "bt": sub_bt,
            "utility": utility,
            "id": this.getID("reaction")
        }
        return json_reaction
    }
}


class BTManager {
    constructor(NepNode) {
        this.pub_action = NepNode.new_pub("robot_action")
        this.current_module = {} // Current module to execute 
        this.pause_module = {} // Current module to execute 
        this.current_response = "idle"
    }

    setBlackboardModel(sharo_model) {
        this.sharo_model = sharo_model
    }

    checkPrimitive(primitive, _input, remember = 0) {

        if (primitive in this.sharo_model) {
            if (_input in this.sharo_model[primitive]) {
                // 0 is value for always keep in mind
                // if trigger time > remember*1000 (milliseconds) then the robot forgot the primitive


                if (typeof (this.sharo_model[primitive][_input]["value"]) === "boolean") {
                    if (this.sharo_model[primitive][_input]["value"] === true) {

                        //console.log("------------ Remember ------------")
                        if (remember > 0) {
                            var current_time = performance.now();
                            var difference = (current_time - this.sharo_model[primitive][_input]["time"]) / 1000

                            //console.log(this.sharo_model[primitive])
                            //console.log("Still active by:" + String(difference))
                            //console.log("Remember time: " + String(remember))


                            if (difference > remember) {
                                return "failure"
                            }
                            else {
                                return "success"
                            }
                        }
                        else {
                            return "success"
                        }
                    }
                }
                else {
                    //console.log("------------ Remember ------------")
                    //console.log(remember)
                    //console.log(primitive)
                    if (remember > 0) {
                        var current_time = performance.now();
                        var difference = (current_time - this.sharo_model[primitive][_input]["time"]) / 1000
                        //console.log(this.sharo_model[primitive])
                        //console.log("Still active by:" + String(difference))
                        //console.log("Remember time: " + String(remember))

                        if (difference > remember) {
                            return "failure"
                        }

                        else {
                            return "success"
                        }
                    }
                    else {
                        return "success"
                    }

                }

            }
        }
        return "failure"
    }

    checkActiveBehaviors(lista) {

        
        let active = []
        lista.forEach(element => {
            var chech_condition =  JSON.parse(JSON.stringify(element["activate"]));
            chech_condition.state = "idle";
            let result = this.tick(chech_condition)
            if (result == "success") {
                active.push(element)
            }

        });

        return active.sort(function (a, b) { return b.utility - a.utility });
    }


    // ------------- runCondition  --------------

    runCondition(node) {
        var primitive = node["primitive"]
        var input_ = node["input"]

        if ("remember" in node) {
            if ("keep" in node) {
                if (node["keep"] === false) {
                    var response = this.checkPrimitive(primitive, input_, node["remember"]) // First check
                    if (response === "success") {
                        console.log("  -------- Keep ------- ")
                        console.log("Keep: " + primitive + " - " + input_)
                        node["keep"] = true
                        return response
                    }
                    else {
                        return response
                    }

                }
                else {
                    return "success" // Keep returning true
                }

            }
            else {
                return this.checkPrimitive(primitive, input_, node["remember"])
            }
        }
        else {
            return this.checkPrimitive(primitive, input_, .2)
        }

    }

    // ------------- tick  --------------

    tick(node) {

        var node_type = node["node"]

        if (node["state"] === "success") {
            return "success"
        }

        if (node["state"] === "failure") {
            return "failure"
        }

        if (node_type === "condition") {
            return this.runCondition(node)
        }

        else if (node["state"] === "idle" || node["state"] === "running") {
            if (node_type === "sequence") { return this.runSequence(node) }
            else if (node_type === "selector") { return this.runSelector(node) }
            else if (node_type === "action") { return this.runAction(node) }
            else if (node_type === "cancel") { return this.runCancel(node) }
            else if (node_type === "random_selector") { return this.runRandomSelector(node) }
            else if (node_type === "always_failure") { return this.runAlwaysFailure(node) }
            else if (node_type === "negation") { return this.runNegation(node) }
        }

    }


    tickReset(node) {

        var node_type = node["node"]

        if (node["state"] === "success") {
            return "success"
        }

        if (node["state"] === "failure") {
            return "failure"
        }

        if (node_type === "condition") {
            return this.runCondition(node)
        }

        else if (node["state"] === "idle" || node["state"] === "running") {
            if (node_type === "sequence") { return this.runSequenceReset(node) }
            else if (node_type === "selector") { return this.runSelectorReset(node) }
            else if (node_type === "action") { return this.runActionReset(node) }
            else if (node_type === "cancel") { return this.runCancelReset(node) }
            else if (node_type === "random_selector") { return this.runRandomSelectorReset(node) }
            else if (node_type === "always_failure") { return this.runAlwaysFailureReset(node) }
            else if (node_type === "negation") { return this.runNegationReset(node) }
        }

    }

    // ------------- runSequence --------------

    runSequence(node) {
        var children = node["children"]

        if (Array.isArray(children)) { // If is list

            for (let i = 0; i < children.length; i++) {
                var child = children[i];
                var response = this.tick(child)

                if (response === "success") { }
                else if (response === "running") {
                    this.setNodeRunning(node)
                    return response
                }
                else if (response === "failure") {
                    this.setNodeFailure(node)
                    return response
                }
                else if (response === "error") {
                    this.setNodeError(node)
                    return response
                }
            }
        }
        else {
            var response = this.tick(children)
            if (response === "success") {
                console.log("node: " + children["id"] + " returned success")
            }
            else if (response === "running") {
                this.setNodeRunning(node)
                return response
            }
            else if (response === "failure") {
                this.setNodeFailure(node)
                return response
            }
            else if (response === "error") {
                this.setNodeError(node)
                return response
            }

        }
        this.setNodeSuccess(node)
        return "success"
    }


    runSequenceReset(node) {
        var children = node["children"]

        if (Array.isArray(children)) { // If is list

            for (let i = 0; i < children.length; i++) {
                var child = children[i];
                var response = this.tickReset(child)

                if (response === "success") { }
                else if (response === "running") {
                    this.setNodeRunning(node)
                    return response
                }
                else if (response === "failure") {
                    this.setNodeFailure(node)
                    return response
                }
                else if (response === "error") {
                    this.setNodeError(node)
                    return response
                }
            }
        }
        else {
            var response = this.tickReset(children)
            if (response === "success") {
                console.log("node: " + children["id"] + " returned success")
            }
            else if (response === "running") {
                this.setNodeRunning(node)
                return response
            }
            else if (response === "failure") {
                this.setNodeFailure(node)
                return response
            }
            else if (response === "error") {
                this.setNodeError(node)
                return response
            }

        }
        this.setNodeSuccess(node)
        return "success"
    }

    // ------------- runSelector --------------

    runSelector(node) {

        console.log("run selector")
        console.log(node["children"])
        var children = node["children"]

        if (Array.isArray(children)) { // If is list

            for (let i = 0; i < children.length; i++) {
                var child = children[i];
                var response = this.tick(child)
                console.log(response)

                if (response === "success") {
                    this.setNodeSuccess(node)
                    return response
                }
                else if (response === "running") {
                    this.setNodeRunning(node)
                    return response
                }
                else if (response === "failure") {
                    console.log("continue")
                }
                else if (response === "error") {
                    this.setNodeError(node)
                    return response
                }
            }
        }

        this.setNodeFailure(node)
        return "failure"
    }


    runSelectorReset(node) {

        var children = node["children"]
        console.log(children)

        if (Array.isArray(children)) { // If is list

            for (let i = 0; i < children.length; i++) {
                var child = children[i];
                var response = this.tick(child)
                var response = this.tickReset(child)

                if (response === "success") {
                    this.setNodeSuccess(node)
                    return response
                }
                else if (response === "running") {
                    this.setNodeRunning(node)
                    return response
                }
                else if (response === "failure") {

                }
                else if (response === "error") {
                    this.setNodeError(node)
                    return response
                }
            }
        }

        this.setNodeFailure(node)
        return "failure"
    }

    // ------------- get_action_state --------------

    get_action_state() {
        var state = sharo_active_action["state"]
        return state
    }

    // ------------- Run or cancel some action --------------

    runAction(node) {
        var response = "success"
        console.log("Action to do: " + String(node["id"]) + " , state:" + String(node["state"]))

        if (node["state"] === "idle") {
            sharo_active_action = node
            console.log("Send request of: " + node["id"])
            this.pub_action.publish(node)
            node["state"] = "running"
            this.setNodeRunning(node)
        }

        return "running"
    }

    runActionReset(node) {

        console.log("--- RESET: " + String(node["id"]) + " , state:" + String(node["state"]))

        if (node["state"] === "running") {
            //this.pub_action.publish(node)
            node["state"] = "idle"
            //this.setNodeRunning(node)
        }
        return "running"
    }

    runCancel(node) { }
    runAlwaysFailure(node) { }
    runNegation(node) { }
    setNodeRunning(node) { node["state"] = "running" }
    setNodeSuccess(node) { node["state"] = "success" }
    setNodeFailure(node) { node["state"] = "failure" }
    setNodeError(node) { node["state"] = "error" }

    loadModule(module_path) {
        var module = rizeObject.onReadJSONFile(module_path)
        this.current_module = module["bt"]
    }

    loadProgram

}
