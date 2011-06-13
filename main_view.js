dojo.require("mouse/MouseObject");
dojo.require("BoundingBox");
dojo.require("Shape");
dojo.require("Text");
dojo.require("CurvedText");

function MVBg(w,h,container){
	/*Introducer Background represented as a rectangle
	*/
	var sh=new Shape({name:'Main View Background' , ids : [eventID.OVER , eventID.OUT , eventID.CLICK , eventID.DBLCLICK , eventID.RCLICK , eventID.DBLRCLICK , eventID.LPRESS , eventID.RPRESS , eventID.SCROLL] , shadowOn : false , cacheOn : true});
	container.addChild(sh);
	sh.x=container.x;
	sh.y=container.y;
	sh.w=w;
	sh.h=h;
	
	sh.boundingBox=new BoundingBox({x : sh.x , y : sh.y , w : sh.w , h : sh.h , type : shapeType.RECTANGLE , parent : sh});
	sh.generateGraphics=function (){
		this.initializeGC();

		var x = this.x << 0 , y = this.y << 0 , h = this.h << 0 , w = this.w << 0 , a = this.a;

		this.graphics[eventID.OVER].lf([hsl(135,100,40,0.9),hsl(135,100,20,0.75)],[0,1],0,h/2,w,h/2).dr(x,y,w,h).ef();
		this.graphics[eventID.OUT].lf([hsl(180,100,60,0.9),hsl(180,100,20,0.75)],[0,1],0,h/2,w,h/2).dr(x,y,w,h).ef();
		this.graphics[eventID.CLICK].lf([hsl(90,100,40,0.9),hsl(90,50,20,0.75)],[0,1],0,h/2,w,h/2).dr(x,y,w,h).ef();
		this.graphics[eventID.RCLICK].lf([hsl(90,110,40,0.9),hsl(80,60,20,0.45)],[0,1],0,h/2,w,h/2).dr(x,y,w,h).ef();
		this.graphics[eventID.DBLCLICK].lf([hsl(45,100,40,0.9),hsl(45,100,20,0.75)],[0,1],0,h/2,w,h/2).dr(x,y,w,h).ef();
		this.graphics[eventID.DBLRCLICK].lf([hsl(10,100,40,0.9),hsl(10,100,20,0.75)],[0,1],0,h/2,w,h/2).dr(x,y,w,h).ef();
		this.graphics[eventID.LPRESS].lf([hsl(110,25,40,0.9),hsl(110,25,20,0.75)],[0,1],0,h/2,w,h/2).dr(x,y,w,h).ef();
		this.graphics[eventID.RPRESS].lf([hsl(110,50,40,0.9),hsl(110,50,20,0.75)],[0,1],0,h/2,w,h/2).dr(x,y,w,h).ef();
		//this.graphics[eventID.DRAG].lf([hsl(110,50,40,0.9),hsl(110,50,20,0.75)],[0,1],0,h/2,w,h/2).dr(x,y,w,h).ef();
		//this.graphics[eventID.DROP].lf([hsl(110,50,40,0.9),hsl(110,50,20,0.75)],[0,1],0,h/2,w,h/2).dr(x,y,w,h).ef();
		this.graphics[eventID.SCROLL].lf([hsl(110,50,40,0.9),hsl(110,50,20,0.75)],[0,1],0,h/2,w,h/2).dr(x,y,w,h).ef();

		if (debugFlags.BOUNDINGBOX()){
			this.graphics[eventID.OVER].ss(2).s(rgba(0,255,0,a)).dr(this.boundingBox.softBounds.L +4<<0, this.boundingBox.softBounds.T +4<<0, this.boundingBox.softBounds.w-8<<0 , this.boundingBox.softBounds.h-8<<0).es();
			this.graphics[eventID.OVER].ss(2).s(rgba(255,0,0,a)).dr(this.boundingBox.bounds.L +4<<0, this.boundingBox.bounds.T +4<<0, this.boundingBox.bounds.w-8<<0 , this.boundingBox.bounds.h-8<<0).es();
			this.graphics[eventID.OVER].f(rgba(0,0,255,a)).dc(this.boundingBox.p1.x+4 , this.boundingBox.p1.y+4 , 4).ef();
			this.graphics[eventID.OVER].f(rgba(0,0,255,a)).dc(this.boundingBox.p2.x-8 , this.boundingBox.p2.y+4 , 4).ef();
			this.graphics[eventID.OVER].f(rgba(0,0,255,a)).dc(this.boundingBox.p3.x-8 , this.boundingBox.p3.y-8 , 4).ef();
			this.graphics[eventID.OVER].f(rgba(0,0,255,a)).dc(this.boundingBox.p4.x+4 , this.boundingBox.p4.y-8 , 4).ef();
		}
	}

	sh.generateGraphics();
	sh.cacheAll();
	sh.mouse = new MouseObject(sh , sh.boundingBox , {_mouseOn : true ,
									_motionOn : true , 
									_mouseButtonOn : true ,
									_mouseEnterOn : true , 
									_mouseLeaveOn : true ,  
									_leftMousePressOn : true , 
									_rightMousePressOn : true , 
									_clickOn : true , 
									_dblClickOn : true , 
									_rightClickOn : true , 
									_dblRightClickOn : true , 
									_scrollOn : true,
									_scrollInOn : true , 
									_scrollOutOn : true,
									_eventOrder :  eventOrderFlags.TOP});
	return sh;
}

function MVTestSubContainer(w , h , container){
	/*Introducer Circle
	*/
	var sh=new Shape({'name':'Main View Test Circle' , ids : [eventID.OVER , eventID.OUT , eventID.CLICK , eventID.DBLCLICK , eventID.RCLICK , eventID.DBLRCLICK , eventID.LPRESS , eventID.RPRESS , eventID.DRAG , eventID.DROP , eventID.SCROLL , eventID.DRAGGING , eventID.VALIDDROP , eventID.INVALIDDROP] , draggable : true , cacheOn : true , shadowOn : true , solid : false});
	container.addChild(sh);
	sh.x=container.x+w/4;
	sh.y=container.y+h/4;
	sh.r=w/6;
	sh.lw=20;

	sh.boundingBox=new BoundingBox({x : sh.x , y : sh.y , r : sh.r , lw : sh.lw , type : shapeType.CIRCLE , parent : sh , shadow : sh.shadow});
	
	sh.generateGraphics=function (){
		this.initializeGC();
		var x = this.x << 0 , y = this.y << 0 , r = this.r << 0 , lw = this.lw << 0 , a = this.a;
		this.graphics[eventID.OVER].s(rgba(0,0,0,a)).ss(lw).dc(x,y,r).es().lf([hsl(60,100,50,0.9),hsl(60,100,40,0.25)],[0,1],x-r,y,x+r,y).dc(x,y,r-lw/2).ef();
		this.graphics[eventID.OUT].s(rgba(0,0,0,a)).ss(lw).dc(x,y,r).es().lf([hsl(180,100,60,0.9),hsl(180,100,20,0.25)],[0,1],x-r,y,x+r,y).dc(x,y,r-lw/2).ef();
		this.graphics[eventID.CLICK].s(rgba(0,0,0,a)).ss(lw).dc(x,y,r).es().lf([hsl(90,100,40,0.9),hsl(90,50,20,0.25)],[0,1],x-r,y,x+r,y).dc(x,y,r-lw/2).ef();
		this.graphics[eventID.RCLICK].s(rgba(0,0,0,a)).ss(lw).dc(x,y,r).es().lf([hsl(70,100,40,0.9),hsl(60,40,20,0.55)],[0,1],x-r,y,x+r,y).dc(x,y,r-lw/2).ef();
		this.graphics[eventID.DBLCLICK].s(rgba(0,0,0,a)).ss(lw).dc(x,y,r).es().lf([hsl(45,100,40,0.9),hsl(45,100,20,0.25)],[0,1],x-r,y,x+r,y).dc(x,y,r-lw/2).ef();
		this.graphics[eventID.DBLRCLICK].s(rgba(0,0,0,a)).ss(lw).dc(x,y,r).es().lf([hsl(10,100,40,0.9),hsl(10,100,20,0.25)],[0,1],x-r,y,x+r,y).dc(x,y,r-lw/2).ef();
		this.graphics[eventID.LPRESS].s(rgba(0,0,0,a)).ss(lw).dc(x,y,r).es().lf([hsl(110,25,40,0.9),hsl(110,25,20,0.25)],[0,1],x-r,y,x+r,y).dc(x,y,r-lw/2).ef();
		this.graphics[eventID.RPRESS].s(rgba(0,0,0,a)).ss(lw).dc(x,y,r).es().lf([hsl(110,50,40,0.9),hsl(110,50,20,0.25)],[0,1],x-r,y,x+r,y).dc(x,y,r-lw/2).ef();
		this.graphics[eventID.DRAG].s(rgba(0,0,0,a)).ss(lw).dc(x,y,r).es().lf([hsl(110,50,40,0.9),hsl(110,50,20,0.25)],[0,1],x-r,y,x+r,y).dc(x,y,r-lw/2).ef();
		this.graphics[eventID.DROP].s(rgba(0,0,0,a)).ss(lw).dc(x,y,r).es().lf([hsl(110,50,40,0.9),hsl(110,50,20,0.25)],[0,1],x-r,y,x+r,y).dc(x,y,r-lw/2).ef();
		this.graphics[eventID.SCROLL].s(rgba(0,0,0,a)).ss(lw).dc(x,y,r).es().lf([hsl(110,50,40,0.9),hsl(110,50,20,0.25)],[0,1],x-r,y,x+r,y).dc(x,y,r-lw/2).ef();

		this.graphics[eventID.DRAGGING].s(rgba(0,0,255,a)).ss(lw).dc(x,y,r).es();
		this.graphics[eventID.VALIDDROP].s(rgba(0,255,0,a)).ss(lw).dc(x,y,r).es();
		this.graphics[eventID.INVALIDDROP].s(rgba(255,0,0,a)).ss(lw).dc(x,y,r).es();

		if (debugFlags.BOUNDINGBOX()){
			this.graphics[eventID.OVER].ss(2).s(rgba(0,255,0,a)).dr(this.boundingBox.softBounds.L +4<<0, this.boundingBox.softBounds.T +4<<0, this.boundingBox.softBounds.w-8<<0 , this.boundingBox.softBounds.h-8<<0).es();
			this.graphics[eventID.OVER].ss(2).s(rgba(255,0,0,a)).dr(this.boundingBox.bounds.L +2<<0, this.boundingBox.bounds.T +2<<0, this.boundingBox.bounds.w-4<<0 , this.boundingBox.bounds.h-4<<0).es();
			this.graphics[eventID.OVER].f(rgba(0,0,255,a)).dc(this.boundingBox.p1.x , this.boundingBox.p1.y , 4).ef();
		}
	}
	sh.generateGraphics();
	sh.cacheAll();
	sh.mouse = new MouseObject(sh , sh.boundingBox , {_mouseOn : true ,
									_motionOn : true , 
									_mouseButtonOn : true ,
									_mouseEnterOn : true , 
									_mouseLeaveOn : true , 
									_dragOn : true , 
									_dropOn : true , 
									_leftMousePressOn : true , 
									_rightMousePressOn : true , 
									_clickOn : true , 
									_dblClickOn : true , 
									_rightClickOn : true , 
									_dblRightClickOn : true , 
									_scrollOn : true,
									_scrollInOn : true , 
									_scrollOutOn : true,
									_eventOrder :  eventOrderFlags.TOP});
}

function MVCircle(w,h,container){
	/*Introducer Circle
	*/
	var sh=new Shape({'name':'Main View Circle' , ids : [eventID.OVER , eventID.OUT , eventID.CLICK , eventID.DBLCLICK , eventID.RCLICK , eventID.DBLRCLICK , eventID.LPRESS , eventID.RPRESS , eventID.DRAG , eventID.DROP , eventID.SCROLL , eventID.DRAGGING , eventID.VALIDDROP , eventID.INVALIDDROP] , draggable : true , cacheOn : true , shadowOn : true});
	container.addChild(sh);
	//var p=stage.localToLocal(0,0,sh);
	//p.x=-p.x+w/2;
	//p.y=-p.y+h/2;
	sh.x=container.x+w/2;
	sh.y=container.y+h/2;
	sh.r=w/4;
	sh.lw=20;

	sh.boundingBox=new BoundingBox({x : sh.x , y : sh.y , r : sh.r , lw : sh.lw , type : shapeType.CIRCLE , parent : sh , shadow : sh.shadow});
	
	sh.generateGraphics=function (){
		this.initializeGC();
		var x = this.x << 0 , y = this.y << 0 , r = this.r << 0 , lw = this.lw << 0 , a = this.a;
		this.graphics[eventID.OVER].s(rgba(0,0,0,a)).ss(lw).dc(x,y,r).es().lf([hsl(60,100,50,0.9),hsl(60,100,40,0.25)],[0,1],x-r,y,x+r,y).dc(x,y,r-lw/2).ef();
		this.graphics[eventID.OUT].s(rgba(0,0,0,a)).ss(lw).dc(x,y,r).es().lf([hsl(180,100,60,0.9),hsl(180,100,20,0.25)],[0,1],x-r,y,x+r,y).dc(x,y,r-lw/2).ef();
		this.graphics[eventID.CLICK].s(rgba(0,0,0,a)).ss(lw).dc(x,y,r).es().lf([hsl(90,100,40,0.9),hsl(90,50,20,0.25)],[0,1],x-r,y,x+r,y).dc(x,y,r-lw/2).ef();
		this.graphics[eventID.RCLICK].s(rgba(0,0,0,a)).ss(lw).dc(x,y,r).es().lf([hsl(80,100,30,0.9),hsl(80,40,20,0.65)],[0,1],x-r,y,x+r,y).dc(x,y,r-lw/2).ef();
		this.graphics[eventID.DBLCLICK].s(rgba(0,0,0,a)).ss(lw).dc(x,y,r).es().lf([hsl(45,100,40,0.9),hsl(45,100,20,0.25)],[0,1],x-r,y,x+r,y).dc(x,y,r-lw/2).ef();
		this.graphics[eventID.DBLRCLICK].s(rgba(0,0,0,a)).ss(lw).dc(x,y,r).es().lf([hsl(10,100,40,0.9),hsl(10,100,20,0.25)],[0,1],x-r,y,x+r,y).dc(x,y,r-lw/2).ef();
		this.graphics[eventID.LPRESS].s(rgba(0,0,0,a)).ss(lw).dc(x,y,r).es().lf([hsl(110,25,40,0.9),hsl(110,25,20,0.25)],[0,1],x-r,y,x+r,y).dc(x,y,r-lw/2).ef();
		this.graphics[eventID.RPRESS].s(rgba(0,0,0,a)).ss(lw).dc(x,y,r).es().lf([hsl(110,50,40,0.9),hsl(110,50,20,0.25)],[0,1],x-r,y,x+r,y).dc(x,y,r-lw/2).ef();
		this.graphics[eventID.DRAG].s(rgba(0,0,0,a)).ss(lw).dc(x,y,r).es().lf([hsl(110,50,40,0.9),hsl(110,50,20,0.25)],[0,1],x-r,y,x+r,y).dc(x,y,r-lw/2).ef();
		this.graphics[eventID.DROP].s(rgba(0,0,0,a)).ss(lw).dc(x,y,r).es().lf([hsl(110,50,40,0.9),hsl(110,50,20,0.25)],[0,1],x-r,y,x+r,y).dc(x,y,r-lw/2).ef();
		this.graphics[eventID.SCROLL].s(rgba(0,0,0,a)).ss(lw).dc(x,y,r).es().lf([hsl(110,50,40,0.9),hsl(110,50,20,0.25)],[0,1],x-r,y,x+r,y).dc(x,y,r-lw/2).ef();

		this.graphics[eventID.DRAGGING].s(rgba(0,0,255,a)).ss(lw).dc(x,y,r).es();
		this.graphics[eventID.VALIDDROP].s(rgba(0,255,0,a)).ss(lw).dc(x,y,r).es();
		this.graphics[eventID.INVALIDDROP].s(rgba(255,0,0,a)).ss(lw).dc(x,y,r).es();

		if (debugFlags.BOUNDINGBOX()){
			this.graphics[eventID.OVER].ss(2).s(rgba(0,255,0,a)).dr(this.boundingBox.softBounds.L +4<<0, this.boundingBox.softBounds.T +4<<0, this.boundingBox.softBounds.w-8<<0 , this.boundingBox.softBounds.h-8<<0).es();
			this.graphics[eventID.OVER].ss(2).s(rgba(255,0,0,a)).dr(this.boundingBox.bounds.L +2<<0, this.boundingBox.bounds.T +2<<0, this.boundingBox.bounds.w-4<<0 , this.boundingBox.bounds.h-4<<0).es();
			this.graphics[eventID.OVER].f(rgba(0,0,255,a)).dc(this.boundingBox.p1.x , this.boundingBox.p1.y , 4).ef();
		}
	}
	sh.generateGraphics();
	sh.cacheAll();
	//sh.deleteGraphics();	//make cache/non cache friendly before uncommenting this
	sh.mouse = new MouseObject(sh , sh.boundingBox , {_mouseOn : true ,
									_motionOn : true , 
									_mouseButtonOn : true ,
									_mouseEnterOn : true , 
									_mouseLeaveOn : true , 
									_dragOn : true , 
									_dropOn : true , 
									_leftMousePressOn : true , 
									_rightMousePressOn : true , 
									_clickOn : true , 
									_dblClickOn : true , 
									_rightClickOn : true , 
									_dblRightClickOn : true , 
									_scrollOn : true,
									_scrollInOn : true , 
									_scrollOutOn : true,
									_eventOrder :  eventOrderFlags.TOP});
}

function MVBmp(w,h,container){
	/*Creates a container with all the elements which characterize an introducer screen
	*/
	var r=w/4;
	var lw=20;
	var img=new Image();
	var bmp=new Bitmap(img);
	container.addChild(bmp);
	bmp.x=container.x+(w-2*r+lw)/2;
	bmp.y=container.y+(h-2*r+lw)/2;
	bmp.r=bmp.w=bmp.h=2*r-lw;
	img.onload=function(e){
	};
	img.onerror=function(e){
		console.log("Error Loading Image : " + e.target.src);
	};
	img.src = "images/stick_figure_male/circle_thumbnails/stick_figure_male_500x500.png";

	bmp.boundingBox=new BoundingBox({'x' : bmp.x, 'y' : bmp.y, 'r' : bmp.r, 'type' : shapeType.CIRCLE, 'parent' : bmp});
	bmp.mouse = new MouseObject(bmp,bmp.boundingBox);
}

function MVLabel(w,h,container){
	/*Creates a container with all the elements which characterize an introducer screen
	*/
	var label=new Text("Label", "100px Arial", "#FFF" , {name : 'Main View Label ' , textBaseline : 'top' , ids : [eventID.OVER , eventID.OUT] , cacheOn : true});
	container.addChild(label);
	label.w=label.getMeasuredWidth();
	label.h=label.getMeasuredLineHeight();
	label.x=container.x+(w-label.w)/2;
	label.y=container.y+0.95*(h-label.h);

	label.boundingBox=new BoundingBox({'x' : label.x, 'y' : label.y, 'w' : label.w, 'h' : label.h, 'type' : shapeType.RECTANGLE, 'parent' : label , shadow : label.shadow});
	label.initializeCacheCanvas();
	label.cacheAll();
	label.mouse = new MouseObject(label , label.boundingBox , {_mouseOn : true ,
									_motionOn : true ,
									_mouseEnterOn : true , 
									_mouseLeaveOn : true});
}

function MVButton(w,h,i,numButtons,buttonPad,label,container){
	/*Introducer Background represented as a rectangle
	*/
	var sh=new Shape({name : 'Main View Button '+i , ids : [eventID.OVER , eventID.OUT , eventID.CLICK , eventID.DBLCLICK , eventID.RCLICK , eventID.DBLRCLICK , eventID.LPRESS , eventID.RPRESS , eventID.DRAG , eventID.DROP , eventID.SCROLL] , cacheOn : true});
	container.addChild(sh);
	sh.a0 = i * 2 * Math.PI / numButtons + buttonPad;
	sh.a1 = (i + 1) * 2 * Math.PI / numButtons - buttonPad;
	sh.x = container.x + w / 2;
	sh.y = container.y + h / 2;
	sh.lw = 100;
	sh.r = w / 4 + 10 + sh.lw / 2;

	sh.boundingBox=new BoundingBox({x : sh.x , y : sh.y , r : sh.r , lw : sh.lw , a0 : sh.a0 , a1 : sh.a1 , lw : sh.lw , type : shapeType.ARC , parent : sh , shadow : sh.shadow});

	sh.generateGraphics=function (){
		this.initializeGC();
	
		var x = this.x << 0 , y = this.y << 0 , r = this.r << 0 , lw = this.lw << 0 , a0 = this.a0 , a1 = this.a1 , a = this.a;
	
		this.graphics[eventID.OVER].ss(lw).rs([hsl(135,100,40,0.9),hsl(135,100,20,0.75)],[0,1],x,y,0,x,y,r).a(x,y,r,a0,a1).es();
		this.graphics[eventID.OUT].ss(lw).rs([hsl(180,100,60,0.9),hsl(180,100,20,0.75)],[0,1],x,y,0,x,y,r).a(x,y,r,a0,a1).es();
		this.graphics[eventID.CLICK].ss(lw).rs([hsl(90,100,40,0.9),hsl(90,50,20,0.75)],[0,1],x,y,0,x,y,r).a(x,y,r,a0,a1).es();
		this.graphics[eventID.RCLICK].ss(lw).rs([hsl(70,100,30,0.9),hsl(90,50,70,0.35)],[0,1],x,y,0,x,y,r).a(x,y,r,a0,a1).es();
		this.graphics[eventID.DBLCLICK].ss(lw).rs([hsl(45,100,40,0.9),hsl(45,100,20,0.75)],[0,1],x,y,0,x,y,r).a(x,y,r,a0,a1).es();
		this.graphics[eventID.DBLRCLICK].ss(lw).rs([hsl(10,100,40,0.9),hsl(10,100,20,0.75)],[0,1],x,y,0,x,y,r).a(x,y,r,a0,a1).es();
		this.graphics[eventID.LPRESS].ss(lw).rs([hsl(110,25,40,0.9),hsl(110,25,20,0.75)],[0,1],x,y,0,x,y,r).a(x,y,r,a0,a1).es();
		this.graphics[eventID.RPRESS].ss(lw).rs([hsl(110,50,40,0.9),hsl(110,50,20,0.75)],[0,1],x,y,0,x,y,r).a(x,y,r,a0,a1).es();
		this.graphics[eventID.DRAG].ss(lw).rs([hsl(110,50,40,0.9),hsl(110,50,20,0.75)],[0,1],x,y,0,x,y,r).a(x,y,r,a0,a1).es();
		this.graphics[eventID.DROP].ss(lw).rs([hsl(110,50,40,0.9),hsl(110,50,20,0.75)],[0,1],x,y,0,x,y,r).a(x,y,r,a0,a1).es();
		this.graphics[eventID.SCROLL].ss(lw).rs([hsl(110,50,40,0.9),hsl(110,50,20,0.75)],[0,1],x,y,0,x,y,r).a(x,y,r,a0,a1).es();

		if (debugFlags.BOUNDINGBOX()){
			this.graphics[eventID.OVER].ss(2).s(rgba(0,255,0,a)).dr(this.boundingBox.softBounds.L +2<<0, this.boundingBox.softBounds.T +2<<0, this.boundingBox.softBounds.w-4<<0 , this.boundingBox.softBounds.h-4<<0).es();
			this.graphics[eventID.OVER].ss(2).s(rgba(255,0,0,a)).dr(this.boundingBox.bounds.L +2<<0, this.boundingBox.bounds.T +2<<0, this.boundingBox.bounds.w-4<<0 , this.boundingBox.bounds.h-4<<0).es();
			this.graphics[eventID.OVER].f(rgba(0,0,255,a)).dc(this.boundingBox.p1.x , this.boundingBox.p1.y , 4).ef();
			this.graphics[eventID.OVER].f(rgba(0,0,255,a)).dc(this.boundingBox.p2.x , this.boundingBox.p2.y , 4).ef();
			this.graphics[eventID.OVER].f(rgba(0,0,255,a)).dc(this.boundingBox.p3.x , this.boundingBox.p3.y , 4).ef();
			this.graphics[eventID.OVER].f(rgba(0,0,255,a)).dc(this.boundingBox.p4.x , this.boundingBox.p4.y , 4).ef();
			this.graphics[eventID.OVER].f(rgba(0,0,255,a)).dc(this.boundingBox.p5.x , this.boundingBox.p5.y , 4).ef();
		}
	}
	sh.generateGraphics();
	var size = 35;
	var font = size+'px Arial';
	var color = '#FFF';
	var curvedText = new CurvedText(label,font,color,{'text' : label, 'charHeight' : size, 'font' : font, 'color' : color, 'container' : container , name : 'Main View Button Label '+i , ids : [eventID.OVER , eventID.OUT] , cacheOn : true});
	container.addChild(curvedText);
	curvedText.boundingBox = sh.boundingBox.clone(curvedText);
	curvedText.mouse = new MouseObject(curvedText , curvedText.boundingBox , {_mouseOn : true ,
									_motionOn : true ,
									_mouseEnterOn : true , 
									_mouseLeaveOn : true});

	curvedText.initializeCacheCanvas();
	curvedText.cacheAll();

	sh.cacheAll();
	sh.mouse = new MouseObject(sh , sh.boundingBox , {_mouseOn : true ,
									_motionOn : true , 
									_mouseButtonOn : true ,
									_mouseEnterOn : true , 
									_mouseLeaveOn : true , 
									_dragOn : false , 
									_dropOn : false , 
									_leftMousePressOn : true , 
									_rightMousePressOn : true , 
									_clickOn : true , 
									_dblClickOn : true , 
									_rightClickOn : true , 
									_dblRightClickOn : true , 
									_scrollOn : true,
									_scrollInOn : true , 
									_scrollOutOn : true,
									_eventOrder :  eventOrderFlags.TOP});
}

function MainView(container){
	/*Creates a container with all the elements which characterize an Main View screen
	*/
	container.bg = new MVBg(container.w,container.h,container);
//	new MVBmp(container.w,container.h,container);
	new MVCircle(container.w,container.h,container);
	new MVLabel(container.w,container.h,container);

	subContainer = new Container({name : 'Test Sub Container' , ids : [eventID.DEFAULT , eventID.CLEAN , eventID.DRAG] , currentID : eventID.CLEAN , shadowOn : false , cacheOn : true , transparent : true , draggable : true});
	container.addChild(subContainer);
	subContainer.x=container.x;
	subContainer.y=container.y;
	subContainer.w=container.w/2 << 0;
	subContainer.h=container.h/2 << 0;
	subContainer.boundingBox=new BoundingBox({'x' : subContainer.x, 'y' : subContainer.y, 'w' : subContainer.w, 'h' : subContainer.h, 'type' : shapeType.RECTANGLE, 'parent' : subContainer});
	subContainer.mouse = new MouseObject(subContainer,subContainer.boundingBox, {'_mouseOn':true , _motionOn : true , _mouseButtonOn : true , _scrollOn : true , _dragOn : true, _dropOn : true , _eventOrder :  eventOrderFlags.TOP});
	subContainer.generateGraphics();
	subContainer.cache();
	new MVTestSubContainer(subContainer.w,subContainer.h,subContainer);


	subContainer.mouse.onDragStart = function (x , y , dx , dy){
		if (this.parent.draggable){
			dragShape = new Shape({'name':'Drag Test Container' , draggable : false , ids : [eventID.DEFAULT] , currentID : eventID.DEFAULT , cacheOn : true , shadowOn : true , x : this.parent.x , y : this.parent.y , w : this.parent.w , h : this.parent.h , a : this.parent.a});
			dragShape.boundingBox = this.boundingBox.clone(dragShape);
			dragShape.initializeGC();
			var x = this.parent.x << 0 , y = this.parent.y << 0 , w = this.parent.w << 0 , h = this.parent.h << 0 , a = this.parent.a , lw = 4;
			dragShape.graphics[eventID.DEFAULT].s(rgba(0,0,0,a)).ss(lw).dr(x,y,w,h).es();
			dragShape.cacheAll();
			dragShape.mouse = new MouseObject(this , this.boundingBox);
		}
		return this._onDragStart(x , y , dx , dy);
	}

	subContainer.mouse.onDrag=function(x , y , dx , dy){
		if (this.parent.draggable){
			var delta = dragShape.boundingBox.validateMove({x : dx , y : dy});
			if (delta.x != 0 || delta.y != 0){
				stage.modifiedArea = stage.modifiedArea.OR(dragShape.boundingBox);
				dragShape.x+=delta.x;
				dragShape.y+=delta.y;
				dragShape.boundingBox.updateBounds(delta.x , delta.y);
			}
		}
		return this._onDrag(x , y , dx , dy);
	}

	subContainer.mouse.onDrop=function(x , y , dx , dy){
		return this._onDrop(x , y , dx , dy);
	}




	var numButtons=6;
	var buttonPad=0.02*Math.PI;
	var labels=['Arc 1','Arc 2','Arc 3','Arc 4','Arc 5','Arc 6'];

	for (var i = 0; i < numButtons ; i++){
		new MVButton(container.w,container.h,i,numButtons,buttonPad,labels[i],container);
	}
}






































