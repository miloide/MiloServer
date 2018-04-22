
var Mnist = require('./ML/Mnist/model');
var maxWidth = maxHeight = 28;
 function Canvas(){
    this.loadMnist();
    $("#drawCanvasDiv").show();
    this.canvas = document.getElementById("drawCanvas");
    var context = this.context = this.canvas.getContext("2d");
    context.lineWidth = 8;

	// The pencil tool instance
	tool = new tool_pencil();

	// Attach the mousedown, mousemove and mouseup event listeners
	this.canvas.addEventListener('mousedown', ev_canvas, false);
	this.canvas.addEventListener('mousemove', ev_canvas, false);
	this.canvas.addEventListener('mouseup',	 ev_canvas, false);

    // This painting tool works like a drawing
    // pencil which tracks the mouse movements
    function tool_pencil () {
        var tool = this;
        this.started = false;

        // This is called when you start holding down the mouse button
        // This starts the pencil drawing
        this.mousedown = function (ev) {
                context.beginPath();
                context.moveTo(ev._x, ev._y);
                tool.started = true;
        };

        // This function is called every time you move the mouse. Obviously, it only
        // draws if the tool.started state is set to true (when you are holding down
        // the mouse button)
        this.mousemove = function (ev) {
            if (tool.started) {
                context.lineTo(ev._x, ev._y);
                context.stroke();
            }
        };

        // This is called when you release the mouse button
        this.mouseup = function (ev) {
            if (tool.started) {
                tool.mousemove(ev);
                tool.started = false;
            }
        };
    }

    // The general-purpose event handler. This function just determines
    // the mouse position relative to the <canvas> element
    function ev_canvas (ev) {
        // Firefox
        if (ev.layerX || ev.layerX == 0) {
            ev._x = ev.layerX;
            ev._y = ev.layerY;
        // Opera
        } else if (ev.offsetX || ev.offsetX == 0) {
            ev._x = ev.offsetX;
            ev._y = ev.offsetY;
        }

        // Call the event handler of the tool
        var func = tool[ev.type];
        if (func) {
            func(ev);
        }
    }
    var self = this;
    $("#clear").click(function(){
        context.fillStyle="#fff";
        context.fillRect(0,0,self.canvas.width, self.canvas.height);
        context.strokeStyle="black";
        context.fillStyle="black";
        context.beginPath();
    });
};

Canvas.prototype.loadMnist = async function(){
    this.mnist = new Mnist();
    await this.mnist.fit();
    var self = this;
    $("#predict").show();
    $("#predict").click(async function(){
        if (self.mnist != undefined){
            var imgData = self.resizeImage();
            var prediction = await self.mnist.predict(imgData);
            var indexOfMaxValue = prediction.reduce((iMax, x, i, arr) => x > arr[iMax] ? i : iMax, 0);
            var output = document.createElement('div');
            output.innerHTML = '<span class="msg">'+"Predicted :"+ indexOfMaxValue+ '</span>';
            $("#console_javascript").append(output);
        }
    });
};

Canvas.prototype.resizeImage = function(){
    var newCanvas = document.createElement("canvas");
    var ctx = this.canvas.getContext("2d");
    var newContext = newCanvas.getContext("2d");
    var ratio = 1;
    if (this.canvas.width > maxWidth){
        ratio = maxWidth / this.canvas.width;
    } else if (this.canvas.height > maxHeight){
        ratio = maxHeight / this.canvas.height;
    }
    newCanvas.width = this.canvas.width * ratio;
    newCanvas.height = this.canvas.height * ratio;
    newContext.drawImage(this.canvas, 0, 0, this.canvas.width, this.canvas.height, 0, 0, newCanvas.width, newCanvas.height);
    var imgPixels = newContext.getImageData(0,0, maxWidth, maxHeight);
    var pixelData = imgPixels.data;
    var singleChannelData = [];
    for (var i = 0;i < pixelData.length; i+=4){
        var avg = (pixelData[i] + pixelData[i + 1] + pixelData[i + 2]) / 3;
        console.log(avg);
        singleChannelData.push(avg);
    }
    console.log(singleChannelData);
    return singleChannelData;
};

module.exports = Canvas;
