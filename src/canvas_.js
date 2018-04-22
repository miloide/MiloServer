
var maxWidth = maxHeight = 28;
 function Canvas(){
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
    });
};

function resizeImage(canvas){
    var ctx = canvas.getContext("2d");
    var newCanvas = document.createElement("canvas");
    var newContext = newCanvas.getContext("2d");
    var ratio = 1;
    if (canvas.width > maxWidth){
        ratio = maxWidth / canvas.width;
    } else if (canvas.height > maxHeight){
        ratio = maxHeight / canvas.height;
    }
    newCanvas.width = canvas.width * ratio;
    newCanvas.height = canvas.height * ratio;
    newContext.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, newCanvas.width, newCanvas.height);
    var imgPixels = newContext.getImageData(0,0, maxWidth, maxHeight);
    var image = new Image();
    console.log(imgPixels);
    for (var y = 0; y < imgPixels.height; y++){
     for (var x = 0; x < imgPixels.width; x++){
          var i = (y * 4) * imgPixels.width + x * 4;
          var avg = (imgPixels.data[i] + imgPixels.data[i + 1] + imgPixels.data[i + 2]) / 3;
          imgPixels.data[i] = avg;
        }
    }
    console.log(imgPixels);
}

module.exports = Canvas;
