shapeType={
	RECTANGLE:0,
	CIRCLE:1,
	ARC:2,
	POLYGON:3,
	OTHER:4
}

dojo.provide("BoundingBox");

dojo.declare("BoundingBox", null, {
	constructor: function(args){
	/*Defines the area of a shape considered to be inside
	**The bounding box is used for other purposes too. For example, when caching, the bounding box boundaries are used instead of the shape coordinates, as the shape coordinates for polygons and circles do not correspond to a rectangular box.
	*/
		dojo.mixin(this,args);
		this.initializeBounds();
	},
	initializeBounds : function (){
		this.bounds = {L : NaN , R : NaN , T : NaN , B : NaN , w : NaN , h : NaN};
		switch (this.type){
		case shapeType.RECTANGLE :
			this.bounds.L = this.x;
			this.bounds.R = this.x + this.w;
			this.bounds.T = this.y;
			this.bounds.B = this.y + this.h;
			this.bounds.w = this.w;
			this.bounds.h = this.h;

			this.p1 = {x : this.bounds.L , y : this.bounds.T};
			this.p2 = {x : this.bounds.R , y : this.bounds.T};
			this.p3 = {x : this.bounds.R , y : this.bounds.B};
			this.p4 = {x : this.bounds.L , y : this.bounds.B};

			break;
		case shapeType.CIRCLE :
			this.bounds.L = this.x - (this.r + this.lw/2);
			this.bounds.R = this.x + (this.r + this.lw/2);
			this.bounds.T = this.y - (this.r + this.lw/2);
			this.bounds.B = this.y + (this.r + this.lw/2);
			this.w = this.bounds.R - this.bounds.L;
			this.h = this.bounds.B - this.bounds.T;
			this.bounds.w = this.w;
			this.bounds.h = this.h;

			this.p1 = {x : this.x , y : this.y};
			break;
		case shapeType.ARC :
			this.p1 = {x : Math.cos(this.a0)*(this.r-this.lw/2) + this.x , y : Math.sin(this.a0)*(this.r-this.lw/2) + this.y};
			this.p2 = {x : Math.cos(this.a0)*(this.r+this.lw/2) + this.x , y : Math.sin(this.a0)*(this.r+this.lw/2) + this.y};
			this.p3 = {x : Math.cos(this.a0+(this.a1-this.a0)/2)*(this.r+this.lw/2) + this.x , y : Math.sin(this.a0+(this.a1-this.a0)/2)*(this.r+this.lw/2) + this.y};
			this.p4 = {x : Math.cos(this.a1)*(this.r+this.lw/2) + this.x , y : Math.sin(this.a1)*(this.r+this.lw/2) + this.y};
			this.p5 = {x : Math.cos(this.a1)*(this.r-this.lw/2) + this.x , y : Math.sin(this.a1)*(this.r-this.lw/2) + this.y};
			this.bounds.L = Math.min(this.p1.x,this.p2.x,this.p3.x,this.p4.x,this.p5.x);
			this.bounds.R = Math.max(this.p1.x,this.p2.x,this.p3.x,this.p4.x,this.p5.x);
			this.bounds.T = Math.min(this.p1.y,this.p2.y,this.p3.y,this.p4.y,this.p5.y);
			this.bounds.B = Math.max(this.p1.y,this.p2.y,this.p3.y,this.p4.y,this.p5.y);
			this.bounds.w = this.bounds.R - this.bounds.L;
			this.bounds.h = this.bounds.B - this.bounds.T;
			this.w = this.bounds.w;
			this.h = this.bounds.h;

			if (debugFlags.CONSOLE()){ console.log('Initializations for Arcs are currently poorly implemented');}
			break;
		case shapeType.POLYGON :
			if (debugFlags.CONSOLE()){ console.log('Initializations for Polygons are currently not implemented');}
			break;
		default : throw "Invalid bounding box type"; break;
		}
		if (this.shadow){
			var k = 1.5;
			this.softBounds = {L : NaN , R : NaN , T : NaN , B : NaN , w : NaN , h : NaN};
			this.softBounds.L = (this.shadow.offsetX>=0) ? this.bounds.L : (this.bounds.L + k * this.shadow.offsetX<0) ? 0 : this.bounds.L + k * this.shadow.offsetX;
			this.softBounds.R = (this.shadow.offsetX<=0) ? this.bounds.R : this.bounds.R + k * this.shadow.offsetX;
			this.softBounds.T = (this.shadow.offsetY>=0) ? this.bounds.T : (this.bounds.T + k * this.shadow.offsetY<0) ? 0 : this.bounds.T + k * this.shadow.offsetY;
			this.softBounds.B = (this.shadow.offsetY<=0) ? this.bounds.B : this.bounds.B + k * this.shadow.offsetY;
			this.softW =  (this.bounds.L + this.shadow.offsetX<0) ? this.bounds.w + Math.abs(k * this.shadow.offsetX) + (this.bounds.L + k * this.shadow.offsetX): this.bounds.w + Math.abs(k * this.shadow.offsetX);
			this.softH =  (this.bounds.T + this.shadow.offsetY<0) ? this.bounds.h + Math.abs(k * this.shadow.offsetY) + (this.bounds.T + k * this.shadow.offsetY): this.bounds.h + Math.abs(k * this.shadow.offsetY);
			this.softBounds.h = this.softH;
			this.softBounds.w = this.softW;
		}
		else {
			this.softBounds = {L : NaN , R : NaN , T : NaN , B : NaN};
			this.softBounds.L = this.bounds.L;
			this.softBounds.R = this.bounds.R;
			this.softBounds.T = this.bounds.T;
			this.softBounds.B = this.bounds.B;
			this.softW = this.w;
			this.softH = this.h;
			this.softBounds.h = this.softH;
			this.softBounds.w = this.softW;
		}
		if (typeof this.intersectBounds == 'undefined'){
			this.intersectBounds = {sx : NaN , sy : NaN , sw : NaN , sh : NaN , dx : NaN , dy : NaN , dw : NaN , dh : NaN , intersects : false};
		}
	},
	updateBounds : function (dx , dy){
		this.x+=dx;
		this.y+=dy;
		this.bounds.L+=dx;
		this.bounds.R+=dx;
		this.bounds.T+=dy;
		this.bounds.B+=dy;
		this.softBounds.L+=dx;
		this.softBounds.R+=dx;
		this.softBounds.T+=dy;
		this.softBounds.B+=dy;
	},
	clone : function(parent){
		switch (this.type){
		case shapeType.RECTANGLE :
			var boundingBox = new BoundingBox({x : this.x, y : this.y, w : this.w, h : this.h, type : shapeType.RECTANGLE, parent : parent , shadow : parent.shadow});
			break;
		case shapeType.CIRCLE :
			var boundingBox = new BoundingBox({x : this.x , y : this.y , r : this.r , lw : this.lw , type : shapeType.CIRCLE , parent : parent , shadow : parent.shadow});
			break;
		case shapeType.ARC :
			var boundingBox = new BoundingBox({x : this.x , y : this.y , r : this.r , lw : this.lw , a0 : this.a0 , a1 : this.a1 , lw : this.lw , type : shapeType.ARC , parent : parent , shadow : parent.shadow});
			break;
		case shapeType.POLYGON :
			if (debugFlags.CONSOLE()){ console.log('Clones for Polygons are currently not implemented');}
			break;
		default : throw "Invalid bounding box type"; break;
		}
		return boundingBox;
	},
	OR : function (targetBox){
		/*OR is used by stage to find minimum stage area affected. It returns a BoundingBox which overwrites Stage.modifiedArea*/
		if (this.w == 0 || this.h == 0){
			var x = targetBox.softBounds.L;
			var y = targetBox.softBounds.T;
			var w = targetBox.softW;
			var h = targetBox.softH;
		} 
		else{
			var x = (this.softBounds.L <= targetBox.softBounds.L) ? this.softBounds.L : targetBox.softBounds.L;
			var y = (this.softBounds.T <= targetBox.softBounds.T) ? this.softBounds.T : targetBox.softBounds.T;
			var w = (this.softBounds.R >= targetBox.softBounds.R) ? this.softBounds.R - x + 0 : targetBox.softBounds.R - x + 0;
			var h = (this.softBounds.B >= targetBox.softBounds.B) ? this.softBounds.B - y + 0 : targetBox.softBounds.B - y + 0;
		}

		if (debugFlags.CONSOLE()){console.log("ORing "+targetBox.parent.name+" ("+targetBox.parent.id+")-->"+"x="+x+" y="+y+" w="+w+" h="+h);}
		return new BoundingBox({x : x , y : y , w : w , h : h , type : shapeType.RECTANGLE});
	},
	AND : function (targetBox){
		/*AND is used to determine what region of the modified area affects the target box. It only updates the intersectBounds of the targetBox
		**If an intersection has occurred sets the <intersects> property to true and returns a valid area
		**If no intersection has occurred sets the <intersects> property to false and returns aN invalid area*/
		//if (targetBox.intersectBounds.intersects){throw targetBox.parent.name+" Target must come in with intersect set to false";}
		if (this.w == 0 || this.h == 0){
			if (debugFlags.CONSOLE()){console.log("No intersection for "+targetBox.parent.name+" ("+targetBox.parent.id+")");}
			targetBox.intersectBounds.intersects = false;
		}
		else{
			//if (debugFlags.CONSOLE()){ console.log(targetBox);}
			var s = this.softBounds;
			var t = targetBox.softBounds;
			targetBox.intersectBounds.sx = (s.R <= t.L || t.R <= s.L) ? NaN : ((s.L <= t.L) ? 0 : Math.ceil(s.L - t.L)) ;
			targetBox.intersectBounds.sy = (s.B <= t.T || t.B <= s.T) ? NaN : ((s.T <= t.T) ? 0 : Math.ceil(s.T - t.T)) ;
			targetBox.intersectBounds.sw = (s.R < t.R) ? Math.ceil(targetBox.softW-targetBox.intersectBounds.sx-(t.R - s.R)) : Math.ceil(targetBox.softW-targetBox.intersectBounds.sx) ;
			targetBox.intersectBounds.sh = (s.B < t.B) ? Math.ceil(targetBox.softH-targetBox.intersectBounds.sy-(t.B - s.B)) : Math.ceil(targetBox.softH-targetBox.intersectBounds.sy) ;
			targetBox.intersectBounds.dx = targetBox.intersectBounds.sx + t.L << 0 ;
			targetBox.intersectBounds.dy = targetBox.intersectBounds.sy + t.T << 0 ;
			targetBox.intersectBounds.dw = targetBox.intersectBounds.sw ;
			targetBox.intersectBounds.dh = targetBox.intersectBounds.sh ;
			targetBox.intersectBounds.intersects = (isNaN(targetBox.intersectBounds.sx) || isNaN(targetBox.intersectBounds.sy) || targetBox.intersectBounds.sw <= 0 || targetBox.intersectBounds.sh <= 0) ? false : true ;

			//if (!targetBox.intersectBounds.intersects){console.log('NO INTERSECTION '+targetBox.parent.name);}
			//else{console.log('INTERSECTION '+targetBox.parent.name);}
			//if (targetBox.intersectBounds.intersects){
			//	var t = targetBox.intersectBounds;
			//	var s = stage.modifiedArea;
			//	if (t.dx+t.dw>s.x+s.w){throw targetBox.parent.name+" target R is off modified R: "+t.dx+t.dw+">"+s.x+s.w;}
			//	if (t.dx<s.x){throw targetBox.parent.name+" target x is less than modified x: "+t.dx+"<"+s.x;}
			//}
			//if (debugFlags.CONSOLE()){ console.log(targetBox);}
			if (debugFlags.CONSOLE()){console.log("Intersection for "+targetBox.parent.name+" ("+targetBox.parent.id+") -->"+targetBox.intersectBounds.intersects+" sx="+targetBox.intersectBounds.sx+" sy="+targetBox.intersectBounds.sy+" sw="+targetBox.intersectBounds.sw+" sh="+targetBox.intersectBounds.sh+" dx="+targetBox.intersectBounds.dx+" dy="+targetBox.intersectBounds.dy+" dw="+targetBox.intersectBounds.dw+" dh="+targetBox.intersectBounds.dh);}
		}
	},
	inside : function inside(x,y){
		switch (this.type){
		case shapeType.RECTANGLE :
			return (this.x<=x) && (x<=this.x+this.w) && (this.y<=y) && (y<=this.y+this.h);
		case shapeType.CIRCLE :
			return Math.sqrt((this.x-x)*(this.x-x)+(this.y-y)*(this.y-y))<this.r;
		case shapeType.ARC :
			var h=Math.sqrt((this.x-x)*(this.x-x)+(this.y-y)*(this.y-y));
			var radiusTest=h>=this.r-this.lw/2 && h<=this.r+this.lw/2;

			function angle(center, p1) {
				var p0 = {x: center.x, y: center.y - Math.sqrt(Math.abs(p1.x - center.x) * Math.abs(p1.x - center.x)
				+ Math.abs(p1.y - center.y) * Math.abs(p1.y - center.y))};
				return ((2 * Math.atan2(p1.y - p0.y, p1.x - p0.x)+3*Math.PI/2)%(2*Math.PI)); // * 180 / Math.PI;
			}

			a=angle({x:this.x,y:this.y},{x:x,y:y});

			var angleTest = a >= this.a0 && a <= this.a1;

			return radiusTest && angleTest;
		case shapeType.POLYGON :
			return isPointInPoly({'x' : x , 'y' : y});
		default : throw "Invalid bounding box type"; break;
		}
	},
	isPointInPoly : function (p){
	/*I took this code from http://snippets.dzone.com/posts/show/5295
	  It expects the polygon to be specified by an array of points in the following format
	[
		{x: 0, y: 0},
		{x: 0, y: 50},
		{x: 50, y: 10},
		{x: -50, y: -10},
		{x: 0, y: -50},
		{x: 0, y: 0}
	]
  	  and a point simply in the following format
	{x: 10, y: 10}
	  returns true or false
	*/
		for(var c = false, i = -1, l = this.polygon.length, j = l - 1; ++i < l; j = i)
			((this.polygon[i].y <= p.y && p.y < this.polygon[j].y) || (this.polygon[j].y <= p.y && p.y < this.polygon[i].y))
			&& (p.x < (this.polygon[j].x - this.polygon[i].x) * (p.y - this.polygon[i].y) / (this.polygon[j].y - this.polygon[i].y) + this.polygon[i].x)
			&& (c = !c);
		return c;
	},
	validateMoveOLD : function (delta){
		/*Ensures shapes stay inside their parent containers
		*/
		var sb = this.softBounds;
		var psb = this.parent.parent.boundingBox.softBounds;

		delta.x = (sb.L + delta.x < psb.L) ? psb.L - sb.L << 0 : ((sb.R + delta.x > psb.R) ? psb.R - sb.R : delta.x);
		delta.y = (sb.T + delta.y < psb.T) ? psb.T - sb.T << 0 : ((sb.B + delta.y > psb.B) ? psb.B - sb.B : delta.y);
		return delta;
	},
	validateMove : function (delta){
		/*Ensures Containers stay inside their parent containers, and do not overlap their solid sibling containers
		*/
		var sb = this.softBounds;
		var psb = this.parent.parent.boundingBox.softBounds;

		delta.x = (sb.L + delta.x < psb.L) ? psb.L - sb.L << 0 : ((sb.R + delta.x > psb.R) ? psb.R - sb.R : delta.x);
		delta.y = (sb.T + delta.y < psb.T) ? psb.T - sb.T << 0 : ((sb.B + delta.y > psb.B) ? psb.B - sb.B : delta.y);

		var sourcei = this.parent.parent.getChildIndex(this.parent);
		for (var i = 0; i < this.parent.parent.getNumChildren(); i++) { 
			if (i != sourcei && this.parent.parent.getChildAt(i).solid){
				var psb = this.parent.parent.getChildAt(i).boundingBox.softBounds;
				delta.x = (sb.L + delta.x < psb.R) ? psb.R - sb.L << 0 : ((sb.R + delta.x > psb.L) ? psb.L - sb.R : delta.x);
				delta.y = (sb.T + delta.y < psb.B) ? psb.B - sb.T << 0 : ((sb.B + delta.y > psb.T) ? psb.T - sb.B : delta.y);
			}
		}
		return delta;
	},
	collision : function (boundingBox , delta){
		switch (this.type){
		case shapeType.RECTANGLE:
			switch (boundingBox.type){
			case shapeType.RECTANGLE :
				return _rvrCollision(this.bounds , target.bounds , delta);
			default : if (debugFlags.CONSOLE()){ console.log("Only collisions with other rectangles are currently being processed")};break;
			}
		default : console.log("Only collisions by rectangles are currently being processed"); break;
		}
	},
	_rvrCollision : function (b1 , b2 , d){
		var collision=false;
		var dx=dy=0;

		if ((b1.L + d.x <= b2.R) && (b2.L <= b1.R + d.x) && (b2.T <= b1.T + d.y) && (b1.T + d.y <= b2.B)) {	//TOP OF BOX 1 INSIDE BOX 2 (AND POSSIBLE L AND/OR R EDGE AS WELL)
			collision=true;
			if (b2.T > b1.T + d.y) {dy=b2.T-b1.T;}
			else {}
		}
		else {return {collision : false , dx : 0 , dy : 0};}
		if ((b1.L + d.x <= b2.R) && (b2.L <= b1.R + d.x) && (b2.T <= b1.B + d.y) && (b1.B + d.y <= b2.B)) {	//BOTTOM OF BOX 1 INSIDE BOX 2 (AND POSSIBLE L AND/OR R EDGE AS WELL)
			return true;
		}
		else {return {collision : false , dx : 0 , dy : 0};}
		if ((b2.L <= b1.L + d.x) && (b1.L + d.x <= b2.R) && (b1.T + d.y <= b2.B) && (b2.T <= b1.B + d.y)) {	//LEFT OF BOX 1 INSIDE BOX 2  (AND POSSIBLE T AND/OR B EDGE AS WELL)
			return true;
		}
		else {return {collision : false , dx : 0 , dy : 0};}
		if ((b2.R <= b1.R + d.x) && (b2.L <= b1.R + d.x) && (b1.T + d.y <= b2.B) && (b2.T <= b1.B + d.y)) {	//RIGHT OF BOX 1 INSIDE BOX 2  (AND POSSIBLE T AND/OR B EDGE AS WELL)
			return true;
		}
		else {return {collision : false , dx : 0 , dy : 0};}
		
		return {collision : collision , dx : dx , dy : dy};
	}
});












