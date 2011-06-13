dojo.provide("Container");
dojo.provide("Cache");
dojo.provide("Shape");
dojo.provide("Stage");
dojo.provide("Text");
dojo.provide("ModifiedDisplayObject");
dojo.provide("ModifiedContainer");
dojo.provide("ModifiedStage");
dojo.provide("ModifiedShape");
dojo.provide("ModifiedText");
dojo.provide("Bitmap");

dojo.declare("ModifiedDisplayObject", null, {
	constructor: function(){
		this.boundingBox = null;
		this.shadow=new Shadow("rgba(0,0,0,0.5)",10,-10,5);
		this.suspendedContainers=[];
		this.draggable=false;
		this.shadowOn=true;
		this.w=NaN;
		this.h=NaN;
		this.r=NaN;
		this.a = this._a = 0.5;
		this.solid = false;
		//this.alphaOn = true;
		//this.fillOn = true;
		//this.dragFillOn = true;
		//this.sketchOn = true;
		//this.dragSketchOn = true;
		//this.gradientOn = true;
	},
	ID : function(){return this.name+' ('+this.id+ ') ';}
});

eventID={
	DEFAULT:-2,
	CLEAN:-1,
	OVER:0,
	OUT:1,
	CLICK:2,
	DBLCLICK:3,
	RCLICK:4,
	DBLRCLICK:5,
	LPRESS:6,
	RPRESS:7,
	LRELEASE:8,
	RRELEASE:9,
	DRAG:10,
	DRAGGING : 11,
	DROP:12,
	VALIDDROP:13,
	INVALIDDROP:14,
	SCROLL:15
}

dojo.declare("Cache", null, {
	constructor: function(){
		this.canvas={};
		this.ids=[];
		this.currentID = eventID.OUT;
		this.cacheOn=false;
	},
	renderFromCache : function(context , sx , sy , sw , sh , dx , dy , dw , dh){
		if (this.visible &&  this.boundingBox.intersectBounds.intersects){ 
			if (debugFlags.CONSOLE()) {
				console.log("Rendering from Cache: "+this.name +" (" +this.id+") Cache Canvas["+this.currentID+"] ("+this.canvas[this.currentID].width+" , "+this.canvas[this.currentID].height+") to "+context+" sx="+sx+" sy="+sy+" sw="+sw+" sh="+sh+" dx="+dx+" dy="+dy+" dw="+dw+" dh="+dh );
				//console.log(this.boundingBox);
			}
			try{
				context.drawImage(this.canvas[this.currentID] , sx << 0  , sy << 0  , sw << 0  , sh << 0  , dx << 0  , dy << 0  , dw << 0  , dh << 0);
			}
			catch(e){
				console.log("An exception occurred in the script. Error name: " + e.name + ". Error message: " + e.message);
				console.log(this.name +" (" +this.id+") ["+this.canvas[this.currentID].width+" , "+this.canvas[this.currentID].height+"] to "+"sx="+sx+" sy="+sy+" sw="+sw+" sh="+sh+" dx="+dx+" dy="+dy+" dw="+dw+" dh="+dh );
			}
		}
	},
	cacheAll : function(){
		for (var i = 0; i < this.ids.length ; i++){
			this.cache(this.ids[i]);
		}
	},
	initializeCacheCanvas : function(ids){
		for (id in this.canvas){
			delete this.canvas[id];
		}
		if (ids){ this.ids=ids;}

		for (var i = 0; i < this.ids.length ; i++){
			this.canvas[this.ids[i]] = document.createElement('canvas'); 
			this.canvas[this.ids[i]].width = this.boundingBox.softW + 2; 
			this.canvas[this.ids[i]].height = this.boundingBox.softH + 2;
			this.canvas[this.ids[i]].getContext('2d').translate(-this.boundingBox.softBounds.L << 0 , -this.boundingBox.softBounds.T << 0);
			if (debugFlags.CONSOLE()) {
				console.log("Initializing Cache Canvas: "+this.name +" (" +this.id+") Cache Canvas["+this.ids[i]+"] ("+this.canvas[this.ids[i]].width+" , "+this.canvas[this.ids[i]].height+")" );
			}
		}
	}
});

dojo.declare("ModifiedStage", null, {
	constructor: function(){
		this.initalizeModifiedArea();
	},
	initalizeModifiedArea : function (args){
		if (args){ this.modifiedArea = new BoundingBox({x : args.x , y : args.y , w : args.w , h : args.h , type : shapeType.RECTANGLE});}
		else{ this.modifiedArea = new BoundingBox({x : 0 , y : 0 , w : 0 , h : 0 , type : shapeType.RECTANGLE});}
	},
	normalizeModifiedArea : function (){
		this.modifiedArea = new BoundingBox({x : this.modifiedArea.x << 0 , y : this.modifiedArea.y << 0 , w : Math.ceil(this.modifiedArea.w) , h : Math.ceil(this.modifiedArea.h) , type : shapeType.RECTANGLE});
	}
});
dojo.declare("ModifiedContainer", null, {
	constructor: function(){
		this.graphics={};
		this.transparent = true;
	},
	initializeGraphics : function (ids){
		for (id in this.graphics){
			delete this.graphics[id];
		}
		if (ids){ this.ids=ids;}

		for (var i = 0; i < this.ids.length ; i++){
			this.graphics[this.ids[i]] = new Graphics();
		}
	},
	initializeGC : function (ids){
		this.initializeGraphics(ids);
		if (cacheFlags.SPECIFIC(this)){ this.initializeCacheCanvas(ids);}
	},
	generateGraphics : function (){
		this.initializeGC();
		if (debugFlags.CONSOLE()){console.log("Generating container graphics for "+this.name+"("+this.id+") x="+this.x+" y="+this.y+" w="+this.w+" h="+this.h+" color="+stage.color);}
		this.graphics[eventID.CLEAN].f(stage.color).dr(this.x << 0,this.y << 0,this.w << 0,this.h<< 0).ef();
	},
	deleteGraphics : function (){
		for (var i = 0; i < this.ids.length ; i++){
			delete this.graphics[this.ids[i]];
		}
	},
	clean : function(){
		if (cacheFlags.SPECIFIC(this) && !this.transparent){ 
			if (debugFlags.CONSOLE()){ console.log("Cleaning from Cache "+this.name+" ("+this.id+")");}
			this.renderFromCache(ctx , this.boundingBox.intersectBounds.sx  , this.boundingBox.intersectBounds.sy , this.boundingBox.intersectBounds.sw , this.boundingBox.intersectBounds.sh , this.boundingBox.intersectBounds.dx , this.boundingBox.intersectBounds.dy , this.boundingBox.intersectBounds.dw , this.boundingBox.intersectBounds.dh);
		}
		else if (!this.transparent){
			if (debugFlags.CONSOLE()){ console.log("Cleaning from Graphics "+this.name+" ("+this.id+")");}
			this.graphics[eventID.CLEAN].draw(ctx);
		}
	},
	renderAll : function(){
		for (var i = 0; i < this.getNumChildren(); i++) { 
			if (this.getChildAt(i) instanceof Stage){ console.log("Stages should not have stages as children");}
			else if (this.getChildAt(i) instanceof Container){ 
				this.getChildAt(i).clean();
				this.getChildAt(i).renderAll();}
			else if (this.getChildAt(i).visible && this.boundingBox.intersectBounds.intersects){ this.getChildAt(i).render();}
		}	
	},
	renderShapes : function(){
		for (var i = 0; i < this.getNumChildren(); i++) { 
			if (this.getChildAt(i).visible && this.boundingBox.intersectBounds.intersects){ this.getChildAt(i).render();}
		}
	},
	cache : function(){	//id will always be returned as eventID.DEFAULT
		this.graphics[eventID.CLEAN].draw(this.canvas[eventID.CLEAN].getContext('2d'));
		this.graphics[eventID.DEFAULT].draw(this.canvas[eventID.DEFAULT].getContext('2d'));
	},
	calculateIntersections : function (){	
		for (var i = 0; i < this.getNumChildren(); i++) { 
			stage.modifiedArea.AND(this.getChildAt(i).boundingBox);
			if (this.getChildAt(i) instanceof Container && this.getChildAt(i).visible && this.getChildAt(i).boundingBox.intersectBounds.intersects){ this.getChildAt(i).calculateIntersections();}	
		}
	},
	resetIntersections : function (){	
		this.boundingBox.intersectBounds.intersects = false;
		for (var i = 0; i < this.getNumChildren(); i++) { 
			if (this.getChildAt(i) instanceof Container){ this.getChildAt(i).resetIntersections();}	
			else{this.getChildAt(i).boundingBox.intersectBounds.intersects = false;}
		}
	}
});
dojo.declare("ModifiedShape", null, {
	constructor: function(){
		this.gradientOn = true;
		this.lineGradientOn = false;
		this.lGraphics=[];
	},
	initializeGraphics : function (ids){
		for (id in this.graphics){
			delete this.graphics[id];
		}
		if (ids){ this.ids=ids;}

		for (var i = 0; i < this.ids.length ; i++){
			this.graphics[this.ids[i]] = new Graphics();
		}
	},
	initializeGC : function (ids){
		this.initializeGraphics(ids);
		if (cacheFlags.SPECIFIC(this)){ this.initializeCacheCanvas(ids);}
	},
	cache : function(id){
		this.canvas[id].getContext('2d').save();
		if (shadowFlags.SPECIFIC(this)){this.applyShadow(this.canvas[id].getContext('2d'),this.shadow);}
		this.graphics[id].draw(this.canvas[id].getContext('2d'));
		this.canvas[id].getContext('2d').restore();
	},
	generateGraphics : function (){},
	deleteGraphics : function (){
		for (var i = 0; i < this.ids.length ; i++){
			delete this.graphics[this.ids[i]];
		}
	},
	render : function(){
		if (cacheFlags.SPECIFIC(this)){ this.renderFromCache(ctx , this.boundingBox.intersectBounds.sx  , this.boundingBox.intersectBounds.sy , this.boundingBox.intersectBounds.sw , this.boundingBox.intersectBounds.sh , this.boundingBox.intersectBounds.dx , this.boundingBox.intersectBounds.dy , this.boundingBox.intersectBounds.dw , this.boundingBox.intersectBounds.dh);}
		else{
			if (debugFlags.CONSOLE()){ console.log("Rendering "+this.name+" ("+this.id+")");}
			ctx.save();
			if (shadowFlags.SPECIFIC(this)){this.applyShadow(ctx,this.shadow);}
			this.graphics[this.currentID].draw(ctx);
			for (var j = 0; j < this.lGraphics.length ; j++){
				this.lGraphics[j].draw(ctx);
			}
			ctx.restore();
		}
	}
});
dojo.declare("ModifiedText", null, {
	constructor: function(){
		this.rotation=0;
	},
	write : function(context) {
		//if (this.DisplayObject_draw(context, ignoreCache)) { return true; }
		
		if (this.outline) { context.strokeStyle = this.color; }
		else { context.fillStyle = this.color; }
		context.font = this.font;
		context.textAlign = this.textAlign ? this.textAlign : "start";
		context.textBaseline = this.textBaseline ? this.textBaseline : "alphabetic";

		var lines = String(this.text).split(/(?:\r\n|\r|\n)/);
		var lineHeight = (this.lineHeight == null) ? this.getMeasuredLineHeight() : this.lineHeight;
		var y = this.y;
		for (var i=0, l=lines.length; i<l; i++) {
			var w = context.measureText(lines[i]).width;
			if (this.lineWidth == null || w < this.lineWidth) {
				this._drawTextLine(lines[i], y , context);
				y += lineHeight;
				continue;
			}

			// split up the line
			var words = lines[i].split(/(\s)/);
			var str = words[0];
			for (var j=1, jl=words.length; j<jl; j+=2) {
				// Line needs to wrap:
				if (context.measureText(str + words[j] + words[j+1]).width > this.lineWidth) {
					this._drawTextLine(str, y , context);
					y += lineHeight;
					str = words[j+1];
				} else {
					str += words[j] + words[j+1];
				}
			}
			this._drawTextLine( str, y , context); // Draw remaining text
			y += lineHeight;
		}
		return true;
	},
	_drawTextLine : function(text, y , context) {
		if (this.outline) { context.strokeText(text, this.x, y, this.maxWidth); }
		else { context.fillText(text, this.x, y, this.maxWidth); }
	},	
	getMeasuredWidth : function() {
		ctx.save();
		ctx.font = this.font;
		ctx.textAlign = this.textAlign ? this.textAlign : "start";
		ctx.textBaseline = this.textBaseline ? this.textBaseline : "alphabetic";
		var result=ctx.measureText(this.text).width;
		ctx.restore();
		return result;
	},
	getMeasuredLineHeight : function() {
		ctx.save();
		ctx.font = this.font;
		ctx.textAlign = this.textAlign ? this.textAlign : "start";
		ctx.textBaseline = this.textBaseline ? this.textBaseline : "alphabetic";
		var result=ctx.measureText("M").width*1.2;
		ctx.restore();
		return result;
	},
	render : function(){
		if (cacheFlags.SPECIFIC(this)){this.renderFromCache(ctx , this.boundingBox.intersectBounds.sx  , this.boundingBox.intersectBounds.sy , this.boundingBox.intersectBounds.sw , this.boundingBox.intersectBounds.sh , this.boundingBox.intersectBounds.dx , this.boundingBox.intersectBounds.dy , this.boundingBox.intersectBounds.dw , this.boundingBox.intersectBounds.dh);}
		else{
			if (debugFlags.CONSOLE()){ console.log("Rendering "+this.name+" ("+this.id+")");}
			ctx.save();
			if (shadowFlags.SPECIFIC(this)){this.applyShadow(ctx,this.shadow);}
			this.write(ctx);
			ctx.restore();
		}
	},
	cache : function(id){
		if (debugFlags.CONSOLE()){ console.log("caching "+this.name+" ("+this.id+")");}
		this.canvas[id].getContext('2d').save();
		if (shadowFlags.SPECIFIC(this)){this.applyShadow(this.canvas[id].getContext('2d'),this.shadow);}
		this.write(this.canvas[id].getContext('2d'));
		this.canvas[id].getContext('2d').restore();
	}
});
dojo.declare("ModifiedBitmap", null, {
	constructor: function(){
		this.shadowOn = false;
	},
	render : function(){
		ctx.drawImage(this.image, this.x << 0, this.y << 0, this.w << 0, this.h << 0);
	}
});
dojo.declare("Stage", [Stage,ModifiedDisplayObject,ModifiedContainer,ModifiedStage], {
	constructor: function(canvas,args){
		dojo.mixin(this,args);
	}
});
dojo.declare("Container", [Container,ModifiedDisplayObject,ModifiedContainer,Cache], {
	constructor: function(args){
		dojo.mixin(this,args);
	}
});
dojo.declare("Shape", [Shape,ModifiedDisplayObject,ModifiedShape,Cache], {
	constructor: function(args){
		dojo.mixin(this,args);
		for (var i = 0; i < this.ids.length ; i++){
			if (! this.graphics[this.ids[i]]instanceof Graphics){ throw this.parent.ID()+"eventID="+this.ids[i]+" needs graphics["+this.ids[i]+"]";}
		}
	}
});
dojo.declare("Text", [Text,ModifiedDisplayObject,ModifiedText,Cache], {
	constructor: function(text , font , color , args){
		dojo.mixin(this,args);
	}
});
dojo.declare("Bitmap", [Bitmap,ModifiedDisplayObject,ModifiedBitmap], {
	constructor: function(args){
		dojo.mixin(this,args);
	}
});

//helper pointer (Graphics.getHSL(135,100,40,0.9) is too verbose)
hsl = Graphics.getHSL;
rgba = function (r , g , b , a){return "rgba("+r+","+g+","+b+","+a+")";}

