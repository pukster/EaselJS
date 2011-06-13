dojo.provide("CurvedText");
dojo.require("Text");

dojo.declare("CurvedText", [Text], {
	constructor: function(text, font, color, args){
	/*<x,y> : Origin of circle
	  r : radius of circle
	  text : array of letters to render to the screen
	  font,color : font and color of the text to draw
	*/
		dojo.mixin(this,args);
		this._debug=false;
	},
	write : function (context){
		var circle={x : this.boundingBox.x, y : this.boundingBox.y, r : this.boundingBox.r};
		var a0=this.boundingBox.a0;
		var a1=this.boundingBox.a1;
		var text=this.text;
		var charHeight=this.charHeight;
		var font=this.font;

		context.fillStyle=this.color;
		context.font = font;
		context.textBaseline="middle";

		var a=a0+Math.PI/2+(a1-a0)/(2*text.length);
		for (var i = 0; i < text.length; i++) {
			var charWidth=context.measureText(text[i]).width;
			var x=-charWidth/2;
			var y=-circle.r;

			context.translate(circle.x,circle.y);
			context.rotate(a);

			context.fillText(text[i], x, y);
			
			if (this._debug){
				//draw boundaries
				context.strokeStyle="rgba(255,255,0,1)";
				context.lineWidth=2;

				context.beginPath();

				context.moveTo(x,y-charHeight/2); //left
				context.lineTo(x,y+charHeight/2);//left
				context.moveTo(x+charWidth/2,y-charHeight/2); //center
				context.lineTo(x+charWidth/2,y+charHeight/2);//center
				context.moveTo(x+charWidth,y-charHeight/2); //right
				context.lineTo(x+charWidth,y+charHeight/2);//right
				context.moveTo(x,y-charHeight/2);//top
				context.lineTo(x+charWidth,y-charHeight/2);//top
				context.moveTo(x,y);//middle
				context.lineTo(x+charWidth,y);//middle
				context.moveTo(x,y+charHeight/2);//bottom
				context.lineTo(x+charWidth,y+charHeight/2);//bottom

				context.closePath();
				context.stroke();
			}

			context.rotate(-a);
			context.translate(-circle.x,-circle.y);
		
			a+=(a1-a0)/text.length;
		}
	}
});
