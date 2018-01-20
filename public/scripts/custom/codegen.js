Blockly.JavaScript.text_log = function(a) {
    return "console.webLog(" + (Blockly.JavaScript.valueToCode(a, "TEXT", Blockly.JavaScript.ORDER_NONE) || "''") + ");\n"
};

Blockly.JavaScript.constant = function(a) {
    return[parseFloat(a.getFieldValue("NUM")),Blockly.JavaScript.ORDER_ATOMIC]
};


//customize console.log
console.webLog = (function (old_function,div_id) {
    return function (text) {
        old_function(text);
        $(div_id).append('<pre class="block">' + text + '</pre>');
    };
} (console.log.bind(console), "#console_javascript"));
