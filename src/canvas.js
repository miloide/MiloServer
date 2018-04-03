
 function Canvas(){
    this.canvas = document.createElement('canvas');
    this.eraser = document.createElement('a');
    this.clear = document.createElement('a');
    this.setCanvas();
}

Canvas.prototype.setCanvas = function(){
    var canvasId = Blockly.JavaScript.variableDB_.getDistinctName(
        'canvas', Blockly.Variables.NAME_TYPE);
    this.canvas.id = canvasId;
    this.canvas.height = 500;
    this.canvas.width = 300;

    var eraserId = Blockly.JavaScript.variableDB_.getDistinctName(
        'eraser', Blockly.Variables.NAME_TYPE);
    this.eraser.innerHTML = "Eraser";
    this.eraser.id = eraserId;

    var clearId = Blockly.JavaScript.variableDB_.getDistinctName(
        'clear', Blockly.Variables.NAME_TYPE);
    this.clear.innerHTML = "Clear";
    this.clear.id = clearId;
    this.addCanvasListeners();
    var body = document.getElementById("graph_output");

    body.appendChild(canvas);
    body.appendChild(eraser);
    body.appendChild(clear);
    $("#graph_output").show();
}
Canvas.prototype.addCanvasListeners = function(){
        var cntx=this.canvas.getContext("2d");
        cntx.strokeStyle="red";
        cntx.lineWidth=10;
        cntx.lineCap="round";
        cntx.fillStyle="#fff";
        cntx.fillRect(0,0,this.canvas.width,this.canvas.height);
        $(this.canvas.id).mousedown(function(canvas){
            clic=true;
            cntx.save();
            xCoord=canvas.pageX-this.offsetLeft;
            yCoord=canvas.pageY-this.offsetTop;
        });

        $(document).mouseup(function(){
                clic=false;
        });

        $(document).click(function(){
                clic=false;
        });
        $(this.canvas.id).mousemove(function(canvas){
            if (clic==true){
                cntx.beginPath();
                cntx.moveTo(canvas.pageX-this.offsetLeft,canvas.pageY-this.offsetTop);
                cntx.lineTo(xCoord,yCoord);
                cntx.stroke();
                cntx.closePath();
                xCoord=canvas.pageX-this.offsetLeft;
                yCoord=canvas.pageY-this.offsetTop;
            }
        });
        $(this.eraser.id).click(function(){
                cntx.strokeStyle="#fff";
        });
        $(this.clear.id).click(function(){
            cntx.fillStyle="#fff";
            cntx.fillRect(0,0,this.canvas.width, this.canvas.height);
            cntx.strokeStyle="red";
            cntx.fillStyle="red";
        });
}
module.exports = Canvas;
