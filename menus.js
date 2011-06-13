function TMBBg(w,h,container){
	/*Top Menubar Background represented as a rectangle
	*/
	var sh=new Shape({name : 'Top Menubar Background' , ids : [eventID.OVER , eventID.OUT , eventID.CLICK , eventID.DBLCLICK , eventID.RCLICK , eventID.DBLRCLICK , eventID.LPRESS , eventID.RPRESS , eventID.DRAG , eventID.DROP , eventID.SCROLL] , shadowOn : false , cacheOn : true});
	container.addChild(sh);
	var p=stage.localToLocal(0,0,sh);
	sh.x=p.x=-p.x;
	sh.y=p.y=-p.y;
	sh.w=w;
	sh.h=h;
	//sh.a = (alphaFlags.SPECIFIC(this)) ? sh._a : 1;
	delete p;

	sh.boundingBox=new BoundingBox({x : sh.x , y : sh.y , w : sh.w , h : sh.h , type : shapeType.RECTANGLE , parent : sh});
	//console.log(sh.w+" v "+sh.h);
	//console.log(sh.boundingBox);
	sh.generateGraphics=function (){
		this.initializeGC();

		var x = this.x << 0 , y = this.y << 0 , h = this.h << 0 , w = this.w << 0 , a = this.a;
	
		//if (gradientFlags.SPECIFIC(this)){
		this.graphics[eventID.OVER].lf([Graphics.getHSL(135,100,40,0.9),Graphics.getHSL(135,100,20,0.75)],[0,1],0,h/2,w,h/2).dr(x,y,w,h).ef();
		this.graphics[eventID.OUT].lf([Graphics.getHSL(180,100,60,0.9),Graphics.getHSL(180,100,20,0.75)],[0,1],0,h/2,w,h/2).dr(x,y,w,h).ef();
		this.graphics[eventID.CLICK].lf([Graphics.getHSL(90,100,40,0.9),Graphics.getHSL(90,50,20,0.75)],[0,1],0,h/2,w,h/2).dr(x,y,w,h).ef();
		this.graphics[eventID.DBLCLICK].lf([Graphics.getHSL(45,100,40,0.9),Graphics.getHSL(45,100,20,0.75)],[0,1],0,h/2,w,h/2).dr(x,y,w,h).ef();
		this.graphics[eventID.RCLICK].lf([Graphics.getHSL(10,100,40,0.9),Graphics.getHSL(10,100,20,0.75)],[0,1],0,h/2,w,h/2).dr(x,y,w,h).ef();
		this.graphics[eventID.LPRESS].lf([Graphics.getHSL(110,25,40,0.9),Graphics.getHSL(110,25,20,0.75)],[0,1],0,h/2,w,h/2).dr(x,y,w,h).ef();
		this.graphics[eventID.RPRESS].lf([Graphics.getHSL(110,50,40,0.9),Graphics.getHSL(110,50,20,0.75)],[0,1],0,h/2,w,h/2).dr(x,y,w,h).ef();
		this.graphics[eventID.DRAG].lf([Graphics.getHSL(110,50,40,0.9),Graphics.getHSL(110,50,20,0.75)],[0,1],0,h/2,w,h/2).dr(x,y,w,h).ef();
		this.graphics[eventID.DROP].lf([Graphics.getHSL(110,50,40,0.9),Graphics.getHSL(110,50,20,0.75)],[0,1],0,h/2,w,h/2).dr(x,y,w,h).ef();
		this.graphics[eventID.SCROLL].lf([Graphics.getHSL(110,50,40,0.9),Graphics.getHSL(110,50,20,0.75)],[0,1],0,h/2,w,h/2).dr(x,y,w,h).ef();
		/*}
		else{
			this.graphics[eventID.OVER].f(rgba(0,0,255,a)).dr(x,y,w,h).ef();
			this.graphics[eventID.OUT].f(rgba(0,255,0,a)).dr(x,y,w,h).ef();
			this.graphics[eventID.CLICK].f(rgba(255,0,0,a)).dr(x,y,w,h).ef();
			this.graphics[eventID.DBLCLICK].f(rgba(255,255,0,a)).dr(x,y,w,h).ef();
			this.graphics[eventID.RCLICK].f(rgba(255,255,255,a)).dr(x,y,w,h).ef();
			this.graphics[eventID.LPRESS].f(rgba(100,100,100,a)).dr(x,y,w,h).ef();
			this.graphics[eventID.RPRESS].f(rgba(100,255,200,a)).dr(x,y,w,h).ef();
			this.graphics[eventID.DRAG].f(rgba(100,255,200,a)).dr(x,y,w,h).ef();
			this.graphics[eventID.DROP].f(rgba(100,255,200,a)).dr(x,y,w,h).ef();
			this.graphics[eventID.SCROLL].f(rgba(100,255,200,a)).dr(x,y,w,h).ef();
		}*/

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
	sh.mouse = new MouseObject(sh,sh.boundingBox , {_mouseOn : true ,
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
									_scrollOutOn : true});

	sh.mouse.onClick=function(){
		//this.parent.graphics=this.parent.graphicsClick;

		if (this.parent.suspendedContainers.length==0){
			topLContainer.visible=false;
			topLContainer.mouse._mouseOn=false;
			topRContainer.visible=false;
			topRContainer.mouse._mouseOn=false;
			middleContainer.visible=false;
			middleContainer.mouse._mouseOn=false;
			botLContainer.visible=false;
			botLContainer.mouse._mouseOn=false;
			botMContainer.visible=false;
			botMContainer.mouse._mouseOn=false;
			botRContainer.visible=false;
			botRContainer.mouse._mouseOn=false;

			this.parent.suspendedContainers[0]=topLContainer;
			this.parent.suspendedContainers[1]=topRContainer;
			this.parent.suspendedContainers[2]=middleContainer;
			this.parent.suspendedContainers[3]=botLContainer;
			this.parent.suspendedContainers[4]=botMContainer;
			this.parent.suspendedContainers[5]=botRContainer;

			this.parent.historyContainer=new Container();
			this.parent.historyContainer.x=stage.x;
			this.parent.historyContainer.y=middleContainer.y;
			this.parent.historyContainer.w=stage.w;
			this.parent.historyContainer.h=middleContainer.h;
			this.parent.historyContainer.boundingBox=new BoundingBox({'x' : this.parent.historyContainer.x, 'y' : this.parent.historyContainer.y, 'w' : this.parent.historyContainer.w, 'h' : this.parent.historyContainer.h, 'type' : shapeType.RECTANGLE, 'parent' : this.parent.historyContainer});
			this.parent.historyContainer.mouse = new MouseObject(this.parent.historyContainer,this.parent.historyContainer.boundingBox, {
									 _mouseOn:true ,
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
									_scrollOutOn : true});
			this.parent.historyContainer.initializeGC();
			this.parent.historyContainer.generateGraphics();
			
			stage.addChildAt(this.parent.historyContainer,1);

			new HistoryView(this.parent.historyContainer);

			this.parent.historyContainer.clean();
			this.parent.historyContainer.renderAll();
		}
		else{
			topLContainer.visible=true;
			topLContainer.mouse._mouseOn=true;
			topRContainer.visible=true;
			topRContainer.mouse._mouseOn=true;
			middleContainer.visible=true;
			middleContainer.mouse._mouseOn=true;
			botLContainer.visible=true;
			botLContainer.mouse._mouseOn=true;
			botMContainer.visible=true;
			botMContainer.mouse._mouseOn=true;
			botRContainer.visible=true;
			botRContainer.mouse._mouseOn=true;

			this.parent.suspendedContainers=[];

			stage.removeChild(this.parent.historyContainer);
			
			stage.clean();
			stage.renderAll();
		}
		return this._onClick();
	}

	var label=new Text("Label", "35px Arial", "#FFF" , {name : 'Top Menu Bar Label ' , textBaseline : 'top' , ids : [eventID.OVER , eventID.OUT] , cacheOn : true});
	container.addChild(label);
	var p=stage.localToLocal(0,0,label);
	p.x=-p.x;
	p.y=-p.y;
	label.w=label.getMeasuredWidth();
	label.h=label.getMeasuredLineHeight();
	label.x=p.x+(w-label.w)/2;
	label.y=p.y;

	label.boundingBox=new BoundingBox({'x' : label.x, 'y' : label.y, 'w' : label.w, 'h' : label.h, 'type' : shapeType.RECTANGLE, 'parent' : label});
	label.mouse = new MouseObject(label,label.boundingBox);
	label.initializeCacheCanvas();
	label.cacheAll();
}

function BMBBg(w,h,container){
	/*Bottom Menubar Background represented as a rectangle
	*/
	var sh=new Shape({'name':'Top Menubar Background' , ids : [eventID.OVER , eventID.OUT , eventID.CLICK , eventID.DBLCLICK , eventID.RCLICK , eventID.DBLRCLICK , eventID.LPRESS , eventID.RPRESS , eventID.DRAG , eventID.DROP , eventID.SCROLL] , shadowOn : false , cacheOn : true});
	container.addChild(sh);
	var p=stage.localToLocal(0,0,sh);
	sh.x=p.x=-p.x;
	sh.y=p.y=-p.y;
	sh.w=w;
	sh.h=h;
	//sh.a = (alphaFlags.SPECIFIC(this)) ? sh._a : 1;
	delete p;

	sh.boundingBox=new BoundingBox({'x' : sh.x, 'y' : sh.y, 'w' : sh.w, 'h' : sh.h, 'type' : shapeType.RECTANGLE, 'parent' : sh});
	
	sh.generateGraphics=function (){
		this.initializeGC();

		var x = this.x << 0 , y = this.y << 0 , h = this.h << 0 , w = this.w << 0 , a = this.a;
	
		//if (gradientFlags.SPECIFIC(this)){
		this.graphics[eventID.OVER].lf([Graphics.getHSL(135,100,40,0.9),Graphics.getHSL(135,100,20,0.75)],[0,1],0,h/2,w,h/2).dr(x,y,w,h).ef();
		this.graphics[eventID.OUT].lf([Graphics.getHSL(180,100,60,0.9),Graphics.getHSL(180,100,20,0.75)],[0,1],0,h/2,w,h/2).dr(x,y,w,h).ef();
		this.graphics[eventID.CLICK].lf([Graphics.getHSL(90,100,40,0.9),Graphics.getHSL(90,50,20,0.75)],[0,1],0,h/2,w,h/2).dr(x,y,w,h).ef();
		this.graphics[eventID.DBLCLICK].lf([Graphics.getHSL(45,100,40,0.9),Graphics.getHSL(45,100,20,0.75)],[0,1],0,h/2,w,h/2).dr(x,y,w,h).ef();
		this.graphics[eventID.RCLICK].lf([Graphics.getHSL(10,100,40,0.9),Graphics.getHSL(10,100,20,0.75)],[0,1],0,h/2,w,h/2).dr(x,y,w,h).ef();
		this.graphics[eventID.LPRESS].lf([Graphics.getHSL(110,25,40,0.9),Graphics.getHSL(110,25,20,0.75)],[0,1],0,h/2,w,h/2).dr(x,y,w,h).ef();
		this.graphics[eventID.RPRESS].lf([Graphics.getHSL(110,50,40,0.9),Graphics.getHSL(110,50,20,0.75)],[0,1],0,h/2,w,h/2).dr(x,y,w,h).ef();
		this.graphics[eventID.DRAG].lf([Graphics.getHSL(110,50,40,0.9),Graphics.getHSL(110,50,20,0.75)],[0,1],0,h/2,w,h/2).dr(x,y,w,h).ef();
		this.graphics[eventID.DROP].lf([Graphics.getHSL(110,50,40,0.9),Graphics.getHSL(110,50,20,0.75)],[0,1],0,h/2,w,h/2).dr(x,y,w,h).ef();
		this.graphics[eventID.SCROLL].lf([Graphics.getHSL(110,50,40,0.9),Graphics.getHSL(110,50,20,0.75)],[0,1],0,h/2,w,h/2).dr(x,y,w,h).ef();
		/*}
		else{
			this.graphics[eventID.OVER].f(rgba(0,0,255,a)).dr(x,y,w,h);
			this.graphics[eventID.OUT].f(rgba(0,255,0,a)).dr(x,y,w,h);
			this.graphics[eventID.CLICK].f(rgba(255,0,0,a)).dr(x,y,w,h);
			this.graphics[eventID.DBLCLICK].f(rgba(255,255,0,a)).dr(x,y,w,h);
			this.graphics[eventID.RCLICK].f(rgba(255,255,255,a)).dr(x,y,w,h);
			this.graphics[eventID.LPRESS].f(rgba(100,100,100,a)).dr(x,y,w,h);
			this.graphics[eventID.RPRESS].f(rgba(100,255,200,a)).dr(x,y,w,h);
			this.graphics[eventID.DRAG].f(rgba(100,255,200,a)).dr(x,y,w,h);
			this.graphics[eventID.DROP].f(rgba(100,255,200,a)).dr(x,y,w,h);
			this.graphics[eventID.SCROLL].f(rgba(100,255,200,a)).dr(x,y,w,h);
		}*/

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
									_scrollOutOn : true});

	var label=new Text("Label", "35px Arial", "#FFF" , {name : 'Bottom Menu Bar Label ' , textBaseline : 'top' , ids : [eventID.OVER , eventID.OUT] , cacheOn : true});
	container.addChild(label);
	var p=stage.localToLocal(0,0,label);
	p.x=-p.x;
	p.y=-p.y;
	label.w=label.getMeasuredWidth();
	label.h=label.getMeasuredLineHeight();
	label.x=p.x+(w-label.w)/2;
	label.y=p.y;

	label.boundingBox=new BoundingBox({'x' : label.x, 'y' : label.y, 'w' : label.w, 'h' : label.h, 'type' : shapeType.RECTANGLE, 'parent' : label});
	label.mouse = new MouseObject(label,label.boundingBox);
	label.initializeCacheCanvas();
	label.cacheAll();
}

function DDMenu(w,h,label,menuItems,top,left,container){
	/*Creates a drop down menu with the passed drop down menu items
	*/
	var sh=new Shape({'name':'Drop Down Menu' , ids : [eventID.OVER , eventID.OUT , eventID.CLICK , eventID.DBLCLICK , eventID.RCLICK , eventID.DBLRCLICK , eventID.LPRESS , eventID.RPRESS , eventID.DRAG , eventID.DROP , eventID.SCROLL] , shadowOn : false , cacheOn : true});
	container.addChild(sh);
	var p=stage.localToLocal(0,0,sh);
	sh.x=p.x=-p.x;
	sh.y=p.y=-p.y;
	sh.w=w;
	sh.h=h;
	//sh.a = (alphaFlags.SPECIFIC(this)) ? sh._a : 1;
	delete p;

	sh.boundingBox=new BoundingBox({'x' : sh.x, 'y' : sh.y, 'w' : sh.w, 'h' : sh.h, 'type' : shapeType.RECTANGLE, 'parent' : sh});
	
	sh.generateGraphics=function (){
		this.initializeGC();

		var x = this.x << 0 , y = this.y << 0 , h = this.h << 0 , w = this.w << 0 , a = this.a;
	
		//if (gradientFlags.SPECIFIC(this)){
		this.graphics[eventID.OVER].lf([Graphics.getHSL(135,100,40,0.9),Graphics.getHSL(135,100,20,0.75)],[0,1],0,h/2,w,h/2).dr(x,y,w,h).ef();
		this.graphics[eventID.OUT].lf([Graphics.getHSL(180,100,60,0.9),Graphics.getHSL(180,100,20,0.75)],[0,1],0,h/2,w,h/2).dr(x,y,w,h).ef();
		this.graphics[eventID.CLICK].lf([Graphics.getHSL(90,100,40,0.9),Graphics.getHSL(90,50,20,0.75)],[0,1],0,h/2,w,h/2).dr(x,y,w,h).ef();
		this.graphics[eventID.DBLCLICK].lf([Graphics.getHSL(45,100,40,0.9),Graphics.getHSL(45,100,20,0.75)],[0,1],0,h/2,w,h/2).dr(x,y,w,h).ef();
		this.graphics[eventID.RCLICK].lf([Graphics.getHSL(10,100,40,0.9),Graphics.getHSL(10,100,20,0.75)],[0,1],0,h/2,w,h/2).dr(x,y,w,h).ef();
		this.graphics[eventID.LPRESS].lf([Graphics.getHSL(110,25,40,0.9),Graphics.getHSL(110,25,20,0.75)],[0,1],0,h/2,w,h/2).dr(x,y,w,h).ef();
		this.graphics[eventID.RPRESS].lf([Graphics.getHSL(110,50,40,0.9),Graphics.getHSL(110,50,20,0.75)],[0,1],0,h/2,w,h/2).dr(x,y,w,h).ef();
		this.graphics[eventID.DRAG].lf([Graphics.getHSL(110,50,40,0.9),Graphics.getHSL(110,50,20,0.75)],[0,1],0,h/2,w,h/2).dr(x,y,w,h).ef();
		this.graphics[eventID.DROP].lf([Graphics.getHSL(110,50,40,0.9),Graphics.getHSL(110,50,20,0.75)],[0,1],0,h/2,w,h/2).dr(x,y,w,h).ef();
		this.graphics[eventID.SCROLL].lf([Graphics.getHSL(110,50,40,0.9),Graphics.getHSL(110,50,20,0.75)],[0,1],0,h/2,w,h/2).dr(x,y,w,h).ef();
		/*}
		else{
			this.graphics[eventID.OVER].f(rgba(0,0,255,a)).dr(x,y,w,h);
			this.graphics[eventID.OUT].f(rgba(0,255,0,a)).dr(x,y,w,h);
			this.graphics[eventID.CLICK].f(rgba(255,0,0,a)).dr(x,y,w,h);
			this.graphics[eventID.DBLCLICK].f(rgba(255,255,0,a)).dr(x,y,w,h);
			this.graphics[eventID.RCLICK].f(rgba(255,255,255,a)).dr(x,y,w,h);
			this.graphics[eventID.LPRESS].f(rgba(100,100,100,a)).dr(x,y,w,h);
			this.graphics[eventID.RPRESS].f(rgba(100,255,200,a)).dr(x,y,w,h);
			this.graphics[eventID.DRAG].f(rgba(100,255,200,a)).dr(x,y,w,h);
			this.graphics[eventID.DROP].f(rgba(100,255,200,a)).dr(x,y,w,h);
			this.graphics[eventID.SCROLL].f(rgba(100,255,200,a)).dr(x,y,w,h);
		}*/

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
									_scrollOutOn : true});
	sh.mouse.onClick=function(){
		for (var i = 0; i < this.parent.DDMenuItems.length; i++){
			this.parent.DDMenuItems[i].sh.visible=!this.parent.DDMenuItems[i].sh.visible;
			this.parent.DDMenuItems[i].sh.mouse._mouseOn=!this.parent.DDMenuItems[i].sh.mouse._mouseOn;
			this.parent.DDMenuItems[i].label.visible=!this.parent.DDMenuItems[i].label.visible;
			this.parent.DDMenuItems[i].label.mouse._mouseOn=!this.parent.DDMenuItems[i].label.mouse._mouseOn;
		}
		return this._onClick();
	}

	//label
	var label=new Text("Label", "35px Arial", "#FFF" , {name : ((top)?'T':'B')+((left)?'L':'R')+' Drop Down Menu' , textBaseline : 'top' , ids : [eventID.OVER , eventID.OUT] , cacheOn : true});
	container.addChild(label);
	var p=stage.localToLocal(0,0,label);
	p.x=-p.x;
	p.y=-p.y;
	label.w=label.getMeasuredWidth();
	label.h=label.getMeasuredLineHeight();
	label.x=p.x+(w-label.w)/2;
	label.y=p.y;

	label.boundingBox=new BoundingBox({'x' : label.x, 'y' : label.y, 'w' : label.w, 'h' : label.h, 'type' : shapeType.RECTANGLE, 'parent' : label});
	label.mouse = new MouseObject(label,label.boundingBox);
	label.initializeCacheCanvas();
	label.cacheAll();

	//drop down menu items
	sh.DDMenuItems=[];
	container.h=(menuItems.length+1)*h;
	if (top){container.graphics[eventID.CLEAN].f(stage.color).dr(container.x << 0,container.y << 0,container.w << 0,container.h << 0);}
	else {container.graphics[eventID.CLEAN].f(stage.color).dr(container.x << 0,container.y -menuItems.length*h << 0,container.w << 0,container.h << 0);}

	for (var i = 0; i < menuItems.length; i++){
		var menuItem = new DDMenuItem(w,h,i,top,left,menuItems[i][0],menuItems[i][1],container);
		sh.DDMenuItems[i]=menuItem;
	}
}

function DDMenuItem(w,h,index,top,left,label,functions,container){
	var sh=new Shape({'name':'Drop Down Menu Item' , ids : [eventID.OVER , eventID.OUT , eventID.CLICK , eventID.DBLCLICK , eventID.RCLICK , eventID.DBLRCLICK , eventID.LPRESS , eventID.RPRESS , eventID.DRAG , eventID.DROP , eventID.SCROLL] , shadowOn : false , cacheOn : true});
	container.addChild(sh);
	var p=stage.localToLocal(0,0,sh);
	sh.x=p.x=-p.x;
	if (top){sh.y=p.y=-p.y+(index+1)*h;}
	else {sh.y=p.y=-p.y-(index+1)*h;}
	sh.w=w;
	sh.h=h;
	//sh.a = (alphaFlags.SPECIFIC(this)) ? sh._a : 1;
	sh.visible=false;
	delete p;

	sh.boundingBox=new BoundingBox({'x' : sh.x, 'y' : sh.y, 'w' : sh.w, 'h' : sh.h, 'type' : shapeType.RECTANGLE, 'parent' : sh});
	
	sh.generateGraphics=function (){
		this.initializeGC();

		var x = this.x << 0 , y = this.y << 0 , h = this.h << 0 , w = this.w << 0 , a = this.a;
	
		//if (gradientFlags.SPECIFIC(this)){
		this.graphics[eventID.OVER].lf([Graphics.getHSL(135,100,40,0.9),Graphics.getHSL(135,100,20,0.75)],[0,1],0,h/2,w,h/2).dr(x,y,w,h).ef();
		this.graphics[eventID.OUT].lf([Graphics.getHSL(180,100,60,0.9),Graphics.getHSL(180,100,20,0.75)],[0,1],0,h/2,w,h/2).dr(x,y,w,h).ef();
		this.graphics[eventID.CLICK].lf([Graphics.getHSL(90,100,40,0.9),Graphics.getHSL(90,50,20,0.75)],[0,1],0,h/2,w,h/2).dr(x,y,w,h).ef();
		this.graphics[eventID.DBLCLICK].lf([Graphics.getHSL(45,100,40,0.9),Graphics.getHSL(45,100,20,0.75)],[0,1],0,h/2,w,h/2).dr(x,y,w,h).ef();
		this.graphics[eventID.RCLICK].lf([Graphics.getHSL(10,100,40,0.9),Graphics.getHSL(10,100,20,0.75)],[0,1],0,h/2,w,h/2).dr(x,y,w,h).ef();
		this.graphics[eventID.LPRESS].lf([Graphics.getHSL(110,25,40,0.9),Graphics.getHSL(110,25,20,0.75)],[0,1],0,h/2,w,h/2).dr(x,y,w,h).ef();
		this.graphics[eventID.RPRESS].lf([Graphics.getHSL(110,50,40,0.9),Graphics.getHSL(110,50,20,0.75)],[0,1],0,h/2,w,h/2).dr(x,y,w,h).ef();
		this.graphics[eventID.DRAG].lf([Graphics.getHSL(110,50,40,0.9),Graphics.getHSL(110,50,20,0.75)],[0,1],0,h/2,w,h/2).dr(x,y,w,h).ef();
		this.graphics[eventID.DROP].lf([Graphics.getHSL(110,50,40,0.9),Graphics.getHSL(110,50,20,0.75)],[0,1],0,h/2,w,h/2).dr(x,y,w,h).ef();
		this.graphics[eventID.SCROLL].lf([Graphics.getHSL(110,50,40,0.9),Graphics.getHSL(110,50,20,0.75)],[0,1],0,h/2,w,h/2).dr(x,y,w,h).ef();
		/*}
		else{
			this.graphics[eventID.OVER].f(rgba(0,0,255,a)).dr(x,y,w,h);
			this.graphics[eventID.OUT].f(rgba(0,255,0,a)).dr(x,y,w,h);
			this.graphics[eventID.CLICK].f(rgba(255,0,0,a)).dr(x,y,w,h);
			this.graphics[eventID.DBLCLICK].f(rgba(255,255,0,a)).dr(x,y,w,h);
			this.graphics[eventID.RCLICK].f(rgba(255,255,255,a)).dr(x,y,w,h);
			this.graphics[eventID.LPRESS].f(rgba(100,100,100,a)).dr(x,y,w,h);
			this.graphics[eventID.RPRESS].f(rgba(100,255,200,a)).dr(x,y,w,h);
			this.graphics[eventID.DRAG].f(rgba(100,255,200,a)).dr(x,y,w,h);
			this.graphics[eventID.DROP].f(rgba(100,255,200,a)).dr(x,y,w,h);
			this.graphics[eventID.SCROLL].f(rgba(100,255,200,a)).dr(x,y,w,h);
		}*/
	}
	sh.generateGraphics();
	sh.cacheAll();
	sh.mouse = new MouseObject(sh , sh.boundingBox , {mouseOn : false ,
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
									_scrollOutOn : true});

	//label
	var label=new Text("Label", "30px Arial", "#FFF" , {name : ((top)?'T':'B')+((left)?'L':'R')+' Drop Down Menu Item '+index , textBaseline : 'top' , ids : [eventID.OVER , eventID.OUT] , cacheOn : true});
	container.addChild(label);
	label.w=label.getMeasuredWidth();
	label.h=label.getMeasuredLineHeight();
	if (left){label.x=container.x+0.1*label.w;}
	else {label.x=sh.x+(w-label.w)-0.1*label.w;}
	//if (center){label.x=sh.x+(w-label.w)/2;}
	label.y=sh.y;

	label.visible=false;

	label.boundingBox=new BoundingBox({'x' : label.x, 'y' : label.y, 'w' : label.w, 'h' : label.h, 'type' : shapeType.RECTANGLE, 'parent' : label});
	label.mouse = new MouseObject(label,label.boundingBox);
	label.initializeCacheCanvas();
	label.cacheAll();

	return {'sh' : sh, 'label' : label};
}

function TopMenubar(container){
	/*Creates a container with all the elements which characterize the top menu bar
	*/
	new TMBBg(container.w,container.h,container);
}

function TLDDMenu(container){
	new DDMenu(container.w,container.h,"Top Left DD Menu",[
		["Item 1",[
			{'onClick' : function(){},
			'onDblClick' : function(){},
			'onRCLICK' : function(){},
			'onLPRESS' : function(){},
			'onRPRESS' : function(){},
			'onScroll' : function(){},
			'onEnter' : function(){},
			'onLeave' : function(){}
			}]],
		["Item 2",[
			{'onClick' : function(){},
			'onDblClick' : function(){},
			'onRCLICK' : function(){},
			'onLPRESS' : function(){},
			'onRPRESS' : function(){},
			'onScroll' : function(){},
			'onEnter' : function(){},
			'onLeave' : function(){}
			}]],
		["Item 3",[
			{'onClick' : function(){},
			'onDblClick' : function(){},
			'onRCLICK' : function(){},
			'onLPRESS' : function(){},
			'onRPRESS' : function(){},
			'onScroll' : function(){},
			'onEnter' : function(){},
			'onLeave' : function(){}
			}]],
		["Item 4",[
			{'onClick' : function(){},
			'onDblClick' : function(){},
			'onRCLICK' : function(){},
			'onLPRESS' : function(){},
			'onRPRESS' : function(){},
			'onScroll' : function(){},
			'onEnter' : function(){},
			'onLeave' : function(){}
			}]],
		["Item 5",[
			{'onClick' : function(){},
			'onDblClick' : function(){},
			'onRCLICK' : function(){},
			'onLPRESS' : function(){},
			'onRPRESS' : function(){},
			'onScroll' : function(){},
			'onEnter' : function(){},
			'onLeave' : function(){}
			}]],
		["Item 6",[
			{'onClick' : function(){},
			'onDblClick' : function(){},
			'onRCLICK' : function(){},
			'onLPRESS' : function(){},
			'onRPRESS' : function(){},
			'onScroll' : function(){},
			'onEnter' : function(){},
			'onLeave' : function(){}
			}]],
		["Item 7",[
			{'onClick' : function(){},
			'onDblClick' : function(){},
			'onRCLICK' : function(){},
			'onLPRESS' : function(){},
			'onRPRESS' : function(){},
			'onScroll' : function(){},
			'onEnter' : function(){},
			'onLeave' : function(){}
			}]],
		["Item 8",[
			{'onClick' : function(){},
			'onDblClick' : function(){},
			'onRCLICK' : function(){},
			'onLPRESS' : function(){},
			'onRPRESS' : function(){},
			'onScroll' : function(){},
			'onEnter' : function(){},
			'onLeave' : function(){}
			}]],
		],true,true,container);
}

function TRDDMenu(container){
	new DDMenu(container.w,container.h,"Top Right DD Menu",[
		["Item 1",[
			{'onClick' : function(){},
			'onDblClick' : function(){},
			'onRCLICK' : function(){},
			'onLPRESS' : function(){},
			'onRPRESS' : function(){},
			'onScroll' : function(){},
			'onEnter' : function(){},
			'onLeave' : function(){}
			}]],
		["Item 2",[
			{'onClick' : function(){},
			'onDblClick' : function(){},
			'onRCLICK' : function(){},
			'onLPRESS' : function(){},
			'onRPRESS' : function(){},
			'onScroll' : function(){},
			'onEnter' : function(){},
			'onLeave' : function(){}
			}]],
		["Item 3",[
			{'onClick' : function(){},
			'onDblClick' : function(){},
			'onRCLICK' : function(){},
			'onLPRESS' : function(){},
			'onRPRESS' : function(){},
			'onScroll' : function(){},
			'onEnter' : function(){},
			'onLeave' : function(){}
			}]],
		["Item 4",[
			{'onClick' : function(){},
			'onDblClick' : function(){},
			'onRCLICK' : function(){},
			'onLPRESS' : function(){},
			'onRPRESS' : function(){},
			'onScroll' : function(){},
			'onEnter' : function(){},
			'onLeave' : function(){}
			}]],
		["Item 5",[
			{'onClick' : function(){},
			'onDblClick' : function(){},
			'onRCLICK' : function(){},
			'onLPRESS' : function(){},
			'onRPRESS' : function(){},
			'onScroll' : function(){},
			'onEnter' : function(){},
			'onLeave' : function(){}
			}]],
		["Item 6",[
			{'onClick' : function(){},
			'onDblClick' : function(){},
			'onRCLICK' : function(){},
			'onLPRESS' : function(){},
			'onRPRESS' : function(){},
			'onScroll' : function(){},
			'onEnter' : function(){},
			'onLeave' : function(){}
			}]],
		["Item 7",[
			{'onClick' : function(){},
			'onDblClick' : function(){},
			'onRCLICK' : function(){},
			'onLPRESS' : function(){},
			'onRPRESS' : function(){},
			'onScroll' : function(){},
			'onEnter' : function(){},
			'onLeave' : function(){}
			}]],
		["Item 8",[
			{'onClick' : function(){},
			'onDblClick' : function(){},
			'onRCLICK' : function(){},
			'onLPRESS' : function(){},
			'onRPRESS' : function(){},
			'onScroll' : function(){},
			'onEnter' : function(){},
			'onLeave' : function(){}
			}]],
		],true,false,container);
}

function BLDDMenu(container){
	new DDMenu(container.w,container.h,"Bottom Left DD Menu",[
		["Item 1",[
			{'onClick' : function(){},
			'onDblClick' : function(){},
			'onRCLICK' : function(){},
			'onLPRESS' : function(){},
			'onRPRESS' : function(){},
			'onScroll' : function(){},
			'onEnter' : function(){},
			'onLeave' : function(){}
			}]],
		["Item 2",[
			{'onClick' : function(){},
			'onDblClick' : function(){},
			'onRCLICK' : function(){},
			'onLPRESS' : function(){},
			'onRPRESS' : function(){},
			'onScroll' : function(){},
			'onEnter' : function(){},
			'onLeave' : function(){}
			}]],
		["Item 3",[
			{'onClick' : function(){},
			'onDblClick' : function(){},
			'onRCLICK' : function(){},
			'onLPRESS' : function(){},
			'onRPRESS' : function(){},
			'onScroll' : function(){},
			'onEnter' : function(){},
			'onLeave' : function(){}
			}]],
		["Item 4",[
			{'onClick' : function(){},
			'onDblClick' : function(){},
			'onRCLICK' : function(){},
			'onLPRESS' : function(){},
			'onRPRESS' : function(){},
			'onScroll' : function(){},
			'onEnter' : function(){},
			'onLeave' : function(){}
			}]],
		["Item 5",[
			{'onClick' : function(){},
			'onDblClick' : function(){},
			'onRCLICK' : function(){},
			'onLPRESS' : function(){},
			'onRPRESS' : function(){},
			'onScroll' : function(){},
			'onEnter' : function(){},
			'onLeave' : function(){}
			}]],
		["Item 6",[
			{'onClick' : function(){},
			'onDblClick' : function(){},
			'onRCLICK' : function(){},
			'onLPRESS' : function(){},
			'onRPRESS' : function(){},
			'onScroll' : function(){},
			'onEnter' : function(){},
			'onLeave' : function(){}
			}]],
		["Item 7",[
			{'onClick' : function(){},
			'onDblClick' : function(){},
			'onRCLICK' : function(){},
			'onLPRESS' : function(){},
			'onRPRESS' : function(){},
			'onScroll' : function(){},
			'onEnter' : function(){},
			'onLeave' : function(){}
			}]],
		["Item 8",[
			{'onClick' : function(){},
			'onDblClick' : function(){},
			'onRCLICK' : function(){},
			'onLPRESS' : function(){},
			'onRPRESS' : function(){},
			'onScroll' : function(){},
			'onEnter' : function(){},
			'onLeave' : function(){}
			}]],
		],false,true,container);
}

function BRDDMenu(container){
	new DDMenu(container.w,container.h,"Bottom Right DD Menu",[
		["Item 1",[
			{'onClick' : function(){},
			'onDblClick' : function(){},
			'onRCLICK' : function(){},
			'onLPRESS' : function(){},
			'onRPRESS' : function(){},
			'onScroll' : function(){},
			'onEnter' : function(){},
			'onLeave' : function(){}
			}]],
		["Item 2",[
			{'onClick' : function(){},
			'onDblClick' : function(){},
			'onRCLICK' : function(){},
			'onLPRESS' : function(){},
			'onRPRESS' : function(){},
			'onScroll' : function(){},
			'onEnter' : function(){},
			'onLeave' : function(){}
			}]],
		["Item 3",[
			{'onClick' : function(){},
			'onDblClick' : function(){},
			'onRCLICK' : function(){},
			'onLPRESS' : function(){},
			'onRPRESS' : function(){},
			'onScroll' : function(){},
			'onEnter' : function(){},
			'onLeave' : function(){}
			}]],
		["Item 4",[
			{'onClick' : function(){},
			'onDblClick' : function(){},
			'onRCLICK' : function(){},
			'onLPRESS' : function(){},
			'onRPRESS' : function(){},
			'onScroll' : function(){},
			'onEnter' : function(){},
			'onLeave' : function(){}
			}]],
		["Item 5",[
			{'onClick' : function(){},
			'onDblClick' : function(){},
			'onRCLICK' : function(){},
			'onLPRESS' : function(){},
			'onRPRESS' : function(){},
			'onScroll' : function(){},
			'onEnter' : function(){},
			'onLeave' : function(){}
			}]],
		["Item 6",[
			{'onClick' : function(){},
			'onDblClick' : function(){},
			'onRCLICK' : function(){},
			'onLPRESS' : function(){},
			'onRPRESS' : function(){},
			'onScroll' : function(){},
			'onEnter' : function(){},
			'onLeave' : function(){}
			}]],
		["Item 7",[
			{'onClick' : function(){},
			'onDblClick' : function(){},
			'onRCLICK' : function(){},
			'onLPRESS' : function(){},
			'onRPRESS' : function(){},
			'onScroll' : function(){},
			'onEnter' : function(){},
			'onLeave' : function(){}
			}]],
		["Item 8",[
			{'onClick' : function(){},
			'onDblClick' : function(){},
			'onRCLICK' : function(){},
			'onLPRESS' : function(){},
			'onRPRESS' : function(){},
			'onScroll' : function(){},
			'onEnter' : function(){},
			'onLeave' : function(){}
			}]],
		],false,false,container);
}

function BotMenubar(container){
	/*Creates a container with all the elements which characterize the top menu bar
	*/
	new BMBBg(container.w,container.h,container);
}
