
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
        //resizeImage(self.canvas, context);
        context.fillStyle="#fff";
        context.fillRect(0,0,self.canvas.width, self.canvas.height);
        context.strokeStyle="black";
        context.fillStyle="black";
    });
};

function resizeImage(canvas, context){
    // var imgPixels = context.getImageData(0,0,280,560);
    // for(var y = 0; y < 560; y++){
    //     for(var x = 0; x < 280; x++){
    //     var i = (y * 4) * 280 + x * 4;
    //     var avg = (imgPixels.data[i] + imgPixels.data[i + 1] + imgPixels.data[i + 2]) / 3;
    //     imgPixels.data[i] = avg;
    //     imgPixels.data[i + 1] = avg;
    //     imgPixels.data[i + 2] = avg;
    //     }
    // }
    // var resizedImage = document.createElement('canvas');
    var image = new Image();
    image.src = canvas.toDataURL();
    image.width = 28;
    image.height = 28;
    //console.log(image);
    //console.log(tf.fromPixels(image,2).toFloat());
}

module.exports = Canvas;
