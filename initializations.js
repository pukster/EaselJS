dojo.require("Container");
dojo.require("Stage");
dojo.require("BoundingBox");

//Initialization functions only get called once at beginning
function init(){
	/*All initialization functions must go in here
	*/
	shadowFlags = {
		ALL : function () {  return false;},
		SPECIFIC : function (displayObject) { return !shadowFlags.NONE() && (shadowFlags.ALL() || displayObject.shadowOn);},
		NONE : function () { return false;}
	};
	/*
	alphaFlags = {
		ALL : function () {  return false;},
		SPECIFIC : function (displayObject) { return !alphaFlags.NONE() && (alphaFlags.ALL() || displayObject.alphaOn);},
		NONE : function () { return false;}
	};
	fillFlags = {
		ALL : function () {  return false;},
		SPECIFIC : function (displayObject) { return !fillFlags.NONE() && (fillFlags.ALL() || displayObject.fillOn);},
		NONE : function () {  return false;}
	};
	dragFillFlags = {
		ALL : function () {  return false;},
		SPECIFIC : function (displayObject) { return !dragFillFlags.NONE() && (dragFillFlags.ALL() || displayObject.dragFillOn);},
		NONE : function () {  return false;}
	};
	sketchFlags = {
		ALL : function () {  return false;},
		SPECIFIC : function (displayObject) { return !sketchFlags.NONE() && (sketchFlags.ALL() || displayObject.sketchOn);},
		NONE : function () {  return false;}
	};
	dragSketchFlags = {
		ALL : function () {  return false;},
		SPECIFIC : function (displayObject) { return !dragSketchFlags.NONE() && (dragSketchFlags.ALL() || displayObject.dragSketchOn);},
		NONE : function () {  return false;}
	};
	fillGradientFlags = {
		ALL : function () {  return true;},
		SPECIFIC : function (displayObject) { return !fillGradientFlags.NONE() && (fillGradientFlags.ALL() || displayObject.fillGradientOn);},
		NONE : function () { return false;}
	};
	sketchGradientFlags = {
		ALL : function () {  return true;},
		SPECIFIC : function (displayObject) { return !sketchGradientFlags.NONE() && (sketchGradientFlags.ALL() || displayObject.sketchGradientOn);},
		NONE : function () { return false;}
	};
	dragFillGradientFlags = {
		ALL : function () {  return true;},
		SPECIFIC : function (displayObject) { return !dragFillGradientFlags.NONE() && (dragFillGradientFlags.ALL() || displayObject.dragFillGradientOn);},
		NONE : function () { return false;}
	};
	dragSketchGradientFlags = {
		ALL : function () {  return true;},
		SPECIFIC : function (displayObject) { return !dragSketchGradientFlags.NONE() && (dragSketchGradientFlags.ALL() || displayObject.dragSketchGradientOn);},
		NONE : function () { return false;}
	};
	gradientFlags = {
		ALL : function () {  return true;},
		SPECIFIC : function (displayObject) { return !gradientFlags.NONE() && (gradientFlags.ALL() || displayObject.gradientOn);},
		NONE : function () { return false;}
	};
	*/
	cacheFlags = {
		ALL : function () {  return false;},
		SPECIFIC : function (displayObject) { return !cacheFlags.NONE() && (cacheFlags.ALL() || displayObject.cacheOn);},
		NONE : function () { return false;}
	};
	collisionFlags = {
		NOMOTION : 0,
		MOTION : 1,
		RECTBOUNDED : 2,
		RECTCIRCBOUNDED : 3,
		POLYBOUNDED : 4,
		PHYSICS : 5		
	};
	debugFlags = {
		ALL : function () { return false;},
		CONSOLE : function () { return !debugFlags.NONE() && (debugFlags.ALL() || false);},
		BOUNDINGBOX : function () { return !debugFlags.NONE() && (debugFlags.ALL() || true);},
		NONE : function () { return false;}
	};

	//shadowOn = shadowFlags.SPECIFIC;
	//gradientOn = gradientFlags.ALL;
	//lineGradientOn = gradientFlags.ALL;
	//dragDrawOn = dragDrawFlags.SKETCH;
	//alphaOn = alphaFlags.SPECIFIC;
	mouseFrequency = 200;
	//debugOn = debugFlags.BOUNDINGBOX;
	//cacheOn = cacheFlags.SPECIFIC;
	refreshOn = false;	//if true, refreshes the screen continuously rather than during user interaction
	refreshRate = 60;	//hertz

	initializeCanvas();

	if (window.addEventListener){
		window.addEventListener('DOMMouseScroll',onMouseWheelSpin,false);
		window.addEventListener('mousewheel',onMouseWheelSpin,false);		// Chrome
	}
	else {window.onmousewheel= onMouseWheelSpin;}

	if (window.Event) {
		document.captureEvents(Event.MOUSEMOVE);	//mouse movement
		document.captureEvents(Event.MOUSEDOWN);	//mouse click
		document.captureEvents(Event.MOUSEUP);	//mouse click
	}
	document.onmousemove=onMouseMotion;
	document.onmousedown=onMouseDown;
	document.onmouseup=onMouseUp;
}

function initializeCanvas(){
	/*Get all the canvas related variables
	*/
	canvas=document.getElementById('canvas');	//get the canvas element from HTML
	//Get the two min values first to ensure the width/height is slightly smaller than the viewport so as to avoid scrollbars. Scrollbars would reduce the size of the viewport, and thus occlude the drawing area

	canvasxMin=jQuery("#canvas").offset().left;		//left most pixel
	canvasyMin=jQuery("#canvas").offset().top;		//top most pixel

	//reset the canvas height and width to be the viewport height and width, minus the offset of the canvas (system specific)
	canvas.height=VPHeight-canvasxMin;		//height of canvas
	canvas.width=VPWidth-canvasyMin;		//width of canvas

	//NOTE the below is the only way I know how to get the left most point, but I don't know why I have to use the "#XXX" format
	//ALSO all the of the variables initially defined in canvas.js (generally to zero values) must be updated here as the canvas is being resized
	canvasHeight=canvas.height;			//canvas height
	canvasWidth=canvas.width;			//canvas width
	canvasxMax=canvasxMin+canvas.width;		//right mostmost pixel (rarely used)
	canvasyMax=canvasyMin+canvas.height;		//bottom most pixel (rarely used)

	//NOTE: canvasOff and canvasMin are different. CanvasMin is system specific and it is the top most region of the canvas. canvasOff is user specifc and it represents the extent of draw free regions, 
	//------generally used for the horizontal information bars
	canvasxOff=0;				//don't need any horizontal canvas shifts
	canvasyOff=0*canvasHeight;		//desired vertical canvas shifts.

	if (canvas.getContext){
		ctx = canvas.getContext('2d');
	}

	var bg = "rgba(255,255,0,1)";
	document.bgColor = bg;

	stage=new Stage(canvas , {name : 'Stage' , color : bg , ids : [eventID.DEFAULT , eventID.CLEAN] , shadowOn : false , cacheOn : false , transparent : false});
	stage.enableMouseOver(0);
	stage.h=canvasHeight;
	stage.w=canvasWidth; 
	stage.boundingBox=new BoundingBox({'x' : stage.x, 'y' : stage.y, 'w' : stage.w, 'h' : stage.h, 'type' : shapeType.RECTANGLE, 'parent' : stage});
	stage.mouse = new MouseObject(stage,stage.boundingBox,{_mouseOn : true , _motionOn : true , _mouseButtonOn : true , _scrollOn : true});
	//stage.initializeGraphics();
	stage.generateGraphics();

	topLContainer=new Container({name : 'Top Left Container' , ids : [eventID.DEFAULT , eventID.CLEAN] , currentID : eventID.CLEAN , shadowOn : false , cacheOn : true , transparent : false});
	topMContainer=new Container({name : 'Top Container' , ids : [eventID.DEFAULT , eventID.CLEAN] , currentID : eventID.CLEAN , shadowOn : false , cacheOn : true , transparent : false});
	topRContainer=new Container({name : 'Top Right Container' , ids : [eventID.DEFAULT , eventID.CLEAN] , currentID : eventID.CLEAN , shadowOn : false , cacheOn : true , transparent : false});
	middleContainer=new Container({name : 'Container' , ids : [eventID.DEFAULT , eventID.CLEAN] , currentID : eventID.CLEAN , shadowOn : false , cacheOn : true , transparent : false});
	botLContainer=new Container({name : 'Bottom Left Container' , ids : [eventID.DEFAULT , eventID.CLEAN] , currentID : eventID.CLEAN , shadowOn : false , cacheOn : true , transparent : false});
	botMContainer=new Container({name : 'Bottom Container' , ids : [eventID.DEFAULT , eventID.CLEAN] , currentID : eventID.CLEAN , shadowOn : false , cacheOn : true , transparent : false});
	botRContainer=new Container({name : 'Bottom Right Container' , ids : [eventID.DEFAULT , eventID.CLEAN] , currentID : eventID.CLEAN , shadowOn : false , cacheOn : true , transparent : false});

	stage.addChild(topLContainer);
	stage.addChild(topMContainer);
	stage.addChild(topRContainer);
	stage.addChild(middleContainer);
	stage.addChild(botLContainer);
	stage.addChild(botMContainer);
	stage.addChild(botRContainer);

	topLContainer.x=stage.x;
	topLContainer.y=stage.y;
	topLContainer.w=canvasxMin+(canvasWidth-stage.h*(1.0-TMBP-BMBP))/2 << 0;
	topLContainer.h=stage.h*TMBP << 0;
	topLContainer.boundingBox=new BoundingBox({'x' : topLContainer.x, 'y' : topLContainer.y, 'w' : topLContainer.w, 'h' : topLContainer.h, 'type' : shapeType.RECTANGLE, 'parent' : topLContainer});
	topLContainer.mouse = new MouseObject(topLContainer,topLContainer.boundingBox, {'_mouseOn':true , _motionOn : true , _mouseButtonOn : true , _scrollOn : true});
	topLContainer.generateGraphics();
	topLContainer.cache();

	topMContainer.x=topLContainer.x+topLContainer.w << 0;
	topMContainer.y=stage.y;
	topMContainer.w=stage.h*(1.0-TMBP-BMBP) << 0;
	topMContainer.h=stage.h*TMBP << 0;
	topMContainer.boundingBox=new BoundingBox({'x' : topMContainer.x, 'y' : topMContainer.y, 'w' : topMContainer.w, 'h' : topMContainer.h, 'type' : shapeType.RECTANGLE, 'parent' : topMContainer});
	topMContainer.mouse = new MouseObject(topMContainer,topMContainer.boundingBox, {'_mouseOn':true , _motionOn : true , _mouseButtonOn : true , _scrollOn : true});
	topMContainer.generateGraphics();
	topMContainer.cache();

	topRContainer.x=topMContainer.x+topMContainer.w << 0;
	topRContainer.y=stage.y;
	topRContainer.w=topLContainer.w << 0;
	topRContainer.h=stage.h*TMBP << 0;
	topRContainer.boundingBox=new BoundingBox({'x' : topRContainer.x, 'y' : topRContainer.y, 'w' : topRContainer.w, 'h' : topRContainer.h, 'type' : shapeType.RECTANGLE, 'parent' : topRContainer});
	topRContainer.mouse = new MouseObject(topRContainer,topRContainer.boundingBox, {'_mouseOn':true , _motionOn : true , _mouseButtonOn : true , _scrollOn : true});
	topRContainer.generateGraphics();
	topRContainer.cache();

	middleContainer.y=topMContainer.y+topMContainer.h << 0;
	middleContainer.w=middleContainer.h=stage.h*(1.0-TMBP-BMBP) << 0;
	middleContainer.x=canvasxMin+(canvasWidth-middleContainer.w)/2 << 0;
	middleContainer.boundingBox=new BoundingBox({'x' : middleContainer.x, 'y' : middleContainer.y, 'w' : middleContainer.w, 'h' : middleContainer.h, 'type' : shapeType.RECTANGLE, 'parent' : middleContainer});
	middleContainer.mouse = new MouseObject(middleContainer,middleContainer.boundingBox, {'_mouseOn':true , _motionOn : true , _mouseButtonOn : true , _scrollOn : true});
	middleContainer.generateGraphics();
	middleContainer.cache();

	/*WARNING: Bottom left and right menu bar containers get resized based on the number of items added to them on creation*/
	botLContainer.x=stage.x;
	botLContainer.y=middleContainer.y+middleContainer.h << 0;
	botLContainer.w=canvasxMin+(canvasWidth-stage.h*(1.0-TMBP-BMBP))/2 << 0;
	botLContainer.h=stage.h*BMBP << 0;
	botLContainer.boundingBox=new BoundingBox({'x' : botLContainer.x, 'y' : botLContainer.y, 'w' : botLContainer.w, 'h' : botLContainer.h, 'type' : shapeType.RECTANGLE, 'parent' : botLContainer});
	botLContainer.mouse = new MouseObject(botLContainer,botLContainer.boundingBox, {'_mouseOn':true , _motionOn : true , _mouseButtonOn : true , _scrollOn : true});
	botLContainer.generateGraphics();
	botLContainer.cache();

	botMContainer.x=botLContainer.x+botLContainer.w << 0;
	botMContainer.y=botLContainer.y << 0;
	botMContainer.w=topMContainer.w << 0;
	botMContainer.h=botLContainer.h << 0;
	botMContainer.boundingBox=new BoundingBox({'x' : botMContainer.x, 'y' : botMContainer.y, 'w' : botMContainer.w, 'h' : botMContainer.h, 'type' : shapeType.RECTANGLE, 'parent' : botMContainer});
	botMContainer.mouse = new MouseObject(botMContainer,botMContainer.boundingBox, {'_mouseOn':true , _motionOn : true , _mouseButtonOn : true , _scrollOn : true});
	botMContainer.generateGraphics();
	botMContainer.cache();

	/*WARNING: Bottom left and right menu bar containers get resized based on the number of items added to them on creation*/
	botRContainer.x=botMContainer.x+botMContainer.w << 0;
	botRContainer.y=botMContainer.y << 0;
	botRContainer.w=topRContainer.w << 0;
	botRContainer.h=botMContainer.h << 0;
	botRContainer.boundingBox=new BoundingBox({'x' : botRContainer.x, 'y' : botRContainer.y, 'w' : botRContainer.w, 'h' : botRContainer.h, 'type' : shapeType.RECTANGLE, 'parent' : botRContainer});
	botRContainer.mouse = new MouseObject(botRContainer,botRContainer.boundingBox, {'_mouseOn' : true , _motionOn : true , _mouseButtonOn : true , _scrollOn : true});
	botRContainer.generateGraphics();
	botRContainer.cache();
	
	new TLDDMenu(topLContainer);
	new TopMenubar(topMContainer);
	new TRDDMenu(topRContainer);
	new MainView(middleContainer);
	new BLDDMenu(botLContainer);
	new BotMenubar(botMContainer);
	new BRDDMenu(botRContainer);

	stage.initalizeModifiedArea({x : 0 , y : 0 , w : stage.w , h : stage.h});
	stage.calculateIntersections();
	stage.renderAll();
	stage.initalizeModifiedArea();
	stage.resetIntersections();
}

function initializeVideo(){
	/*Initialize the video player
	*/
	videoPlayer.addEventListener('play', 
		function(){
			drawVideo(videoPlayer);
		},
		false
	);
}

function initializeIntroducer(){
	/*Create the Intro object
	*/
	//////////////////WARNING THE BELOW LINE IS FOR DEBUGING ONLY///////
	loggedIn=true;
	//////////////////WARNING THE ABOVE LINE IS FOR DEBUGING ONLY///////

	if (loggedIn){		//if the user is logged in, change behaviour to reflect profile (edit profile, edit options, tweak settings)
		introducer=new IntroducerLoggedIn();
	}
	else{		//If user is not logged in, change behaviour to reflect guest (login, register...)
		introducer=new IntroducerLoggedOut();
	}

	introducer.setReady();
}

function initializeCategories(){
	/*Goes through every label and creates a portal for it
	*/
	categoryContainer=new CategoryContainer();
	categoryContainer.generateCategories()
	categoryContainer.setReady()
}























