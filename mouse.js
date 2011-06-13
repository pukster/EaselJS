var mousePos={x : NaN , y : NaN};
var dragShape = null;
var mouseEventOrder = {	//array of all displayobjects which where activated by mouse, from top to bottom
	_displayObjects : [],
	addToTop : function(displayObject){
		for (var i = 0 ; i < this._displayObjects.length ; i++){
			if (this._displayObjects[i] == displayObject){ return;}
		}		
		this._displayObjects[this._displayObjects.length]=displayObject;
	},
	has : function(displayObject){
		for (var i = 0 ; i < this._displayObjects.length ; i++){
			if (this._displayObjects[i] == displayObject){ return true;}
		}		
		return false;
	},
	remove :  function(displayObject){
		for (var i = 0 ; i < this._displayObjects.length ; i++){
			if (this._displayObjects[i] == displayObject){ this._displayObjects.splice(i,1); return;}
		}
	},
	isTop :  function(displayObject){
		return this._displayObjects[this._displayObjects.length - 1] == displayObject;
	}
}

eventOrderFlags = {
	TOP : 0,
	ALL : 1	
}
dojo.provide("mouse/MouseObject");

dojo.declare("MouseObject", null, {
	constructor: function(parent,boundingBox,controlFlags){
	/*Contains all the essential mouse functions and attributes
	*/
		this.parent = parent;
		this.boundingBox = boundingBox;

		this._leftMouseDownTime = [0,0];		//time of last left mouse click
		this._rightMouseDownTime = [0,0];		//time of last left mouse click
		this._inside = false;
		this._top = false;
		this._rightMouseDown = false;
		this._leftMouseDown = false;
		this._dragging = false;
		this._lastMousePosition = {x : mousePos.x , y : mousePos.y};
		this._dx = NaN;
		this._dy = NaN;
		this._outOfBoundsCoords = {x : 0 , y : 0};

		this.dblClickDelay = 250;
		dojo.mixin(this,{_constantClickOn : false , 
					_constantMotionOn : false , 
					_mouseOn : false , 
					_motionOn : false , 
					_mouseEnterOn : false , 
					_mouseLeaveOn : false , 
					_dragOn : false , 
					_dropOn : false , 
					_mouseButtonOn : false ,
					_leftMousePressOn : false , 
					_rightMousePressOn : false , 
					_leftMouseReleaseOn : false , 
					_rightMouseReleaseOn : false , 
					_clickOn : false , 
					_dblClickOn : false , 
					_rightClickOn : false , 
					_dblRightClickOn : false , 
					_scrollOn : false , 
					_scrollInOn : false , 
					_scrollOutOn : false,
					_eventOrder : eventOrderFlags.ALL});

		dojo.mixin(this,controlFlags);

		if (this.parent instanceof Shape){
			if (this._mouseEnterOn && typeof this.parent.graphics[eventID.OVER] == 'undefined'){throw this.parent.ID()+"_mouseEnterOn needs graphics[eventID.OVER]";}
			if (this._mouseLeaveOn && typeof this.parent.graphics[eventID.OUT] == 'undefined'){throw this.parent.ID()+"_mouseEnterOn needs graphics[eventID.OUT]";}
			if (this._dragOn && typeof this.parent.graphics[eventID.DRAG] == 'undefined'){throw this.parent.ID()+"_dragOn needs graphics[eventID.DRAG]";}
			if (this._dragOn && typeof this.parent.graphics[eventID.DRAGGING] == 'undefined'){throw this.parent.ID()+"_dragOn needs graphics[eventID.DRAGGING]";}
			if (this._dropOn && typeof this.parent.graphics[eventID.DROP] == 'undefined'){throw this.parent.ID()+"_dropOn needs graphics[eventID.DROP]";}
			if (this._dropOn && typeof this.parent.graphics[eventID.VALIDDROP] == 'undefined'){throw this.parent.ID()+"_dropOn needs graphics[eventID.VALIDDROP]";}
			if (this._dropOn && typeof this.parent.graphics[eventID.INVALIDDROP] == 'undefined'){throw this.parent.ID()+"_dropOn needs graphics[eventID.INVALIDDROP]";}
			if (this._leftMousePressOn && typeof this.parent.graphics[eventID.LPRESS] == 'undefined'){throw this.parent.ID()+"_leftMousePressOn needs graphics[eventID.LPRESS]";}
			if (this._rightMousePressOn && typeof this.parent.graphics[eventID.RPRESS] == 'undefined'){throw this.parent.ID()+"_rightMousePressOn needs graphics[eventID.RPRESS]";}
			if (this._leftMouseReleaseOn && typeof this.parent.graphics[eventID.LRELEASE] == 'undefined'){throw this.parent.ID()+"_leftMouseReleaseOn needs graphics[eventID.LRELEASE]";}
			if (this._rightMouseReleaseOn && typeof this.parent.graphics[eventID.RRELEASE] == 'undefined'){throw this.parent.ID()+"_rightMouseReleaseOn needs graphics[eventID.RRELEASE]";}
			if (this._clickOn && typeof this.parent.graphics[eventID.CLICK] == 'undefined'){throw this.parent.ID()+"_clickOn needs graphics[eventID.CLICK]";}
			if (this._dblClickOn && typeof this.parent.graphics[eventID.DBLCLICK] == 'undefined'){throw this.parent.ID()+"_dblClickOn needs graphics[eventID.DBLCLICK]";}
			if (this._rightClickOn && typeof this.parent.graphics[eventID.RCLICK] == 'undefined'){throw this.parent.ID()+"_rightClickOn needs graphics[eventID.RCLICK]";}
			if (this._dblRightClickOn && typeof this.parent.graphics[eventID.DBLRCLICK] == 'undefined'){throw this.parent.ID()+"_dblRightClickOn needs graphics[eventID.DBLRCLICK]";}
			if (this._scrollInOn && typeof this.parent.graphics[eventID.SCROLL] == 'undefined'){throw this.parent.ID()+"_scrollInOn needs graphics[eventID.SCROLL]";}
			if (this._scrollOutOn && typeof this.parent.graphics[eventID.SCROLL] == 'undefined'){throw this.parent.ID()+"_scrollOutOn needs graphics[eventID.SCROLL]";}
		}
	},
	onMotion : function(){
		return this._onMotion();
	},
	onMouseEnter : function(){
		return this._onMouseEnter();
	},
	onMouseLeave : function(){
		return this._onMouseLeave();
	},
	onDragStart : function(x , y , dx , dy){
		return this._onDragStart(x , y , dx , dy);
	},
	onDrag : function(x , y , dx , dy){
		return this._onDrag(x , y , dx , dy);
	},
	onDrop : function(x , y , dx , dy){
		return this._onDrop(x , y , dx , dy);
	},
	onLeftMousePress : function(){
		return this._onLeftMousePress();
	},
	onRightMousePress : function(){
		return this._onRightMousePress();
	},
	onLeftMouseRelease : function(){
		return this._onLeftMouseRelease();
	},
	onRightMouseRelease : function(){
		return this._onRightMouseRelease();
	},
	onClick : function(){
		return this._onClick();
	},
	onDblClick : function(){
		return this._onDblClick();
	},
	onRightClick : function(){
		return this._onRightClick();
	},
	onDblRightClick : function(){
		return this._onDblRightClick();
	},
	onScrollIn : function(){
		return this._onScrollIn();
	},
	onScrollOut : function(){
		return this._onScrollOut();
	},
	_onMotion : function(){
		if (debugFlags.CONSOLE()){console.log('Motion '+this.parent.name+' '+this.parent.id);}
		if (this._motionOn){
			this.parent.currentID=eventID.MOTION;
			stage.modifiedArea = stage.modifiedArea.OR(this.boundingBox);
		}
		return this._motionOn;
	},
	_onMouseEnter : function(){
		if (debugFlags.CONSOLE()){console.log('Enter '+this.parent.name+' '+this.parent.id);}
		if (this._mouseEnterOn){ 
			this.parent.currentID=eventID.OVER;
			stage.modifiedArea = stage.modifiedArea.OR(this.boundingBox);
		}
		return this._mouseEnterOn;
	},
	_onMouseLeave : function(){
		if (debugFlags.CONSOLE()){console.log('Leave '+this.parent.name+' '+this.parent.id);}
		if (this._mouseLeaveOn){ 
			this.parent.currentID=eventID.OUT;
			stage.modifiedArea = stage.modifiedArea.OR(this.boundingBox);
		}
		return this._mouseLeaveOn;
	},
	_onDragStart : function(){
		if (debugFlags.CONSOLE()){console.log('Drag Start '+this.parent.name+' '+this.parent.id); }
		if (this._dragOn){
			if (this.parent.draggable){
				this._outOfBoundsCoords = {x : 0 , y : 0};
				dragShape = new Shape({name : this.parent.name , draggable : false , ids : [eventID.DRAGGING , eventID.VALIDDROP , eventID.INVALIDDROP] , currentID : eventID.DRAGGING , cacheOn : this.parent.cacheOn , shadowOn : this.parent.shadowOn , x : this.parent.x , y : this.parent.y , r : this.parent.r , lw : this.parent.lw , a : this.parent.a});
				dragShape.boundingBox = this.boundingBox.clone(dragShape);
				if (cacheFlags.SPECIFIC(this.parent)){
					dragShape.canvas[eventID.DRAGGING] = this.parent.canvas[eventID.DRAGGING];
					dragShape.canvas[eventID.VALIDDROP] = this.parent.canvas[eventID.VALIDDROP];
					dragShape.canvas[eventID.INVALIDDROP] = this.parent.canvas[eventID.INVALIDDROP];
				}
				else{
					dragShape.graphics[eventID.DRAGGING] = this.parent.graphics[eventID.DRAGGING];
					dragShape.graphics[eventID.VALIDDROP] = this.parent.graphics[eventID.VALIDDROP];
					dragShape.graphics[eventID.INVALIDDROP] = this.parent.graphics[eventID.INVALIDDROP];
				}
				dragShape.mouse = new MouseObject(this , this.boundingBox);
			}
			this.parent.currentID=eventID.DRAG;
			if (dragShape != null){	this.parent.parent.addChild(dragShape);}
		}
		return this._dragOn;
	},
	_onDrag : function(x , y , dx , dy){
		if (debugFlags.CONSOLE()){console.log('Drag '+this.parent.name+' '+this.parent.id); }
		if (this._dragOn){
			if (this.parent.draggable){
				var delta = dragShape.boundingBox.validateMove({x : dx , y : dy});
				if (delta.x != 0 || delta.y != 0){
					stage.modifiedArea = stage.modifiedArea.OR(dragShape.boundingBox);
					dragShape.x+=delta.x;
					dragShape.y+=delta.y;
					dragShape.boundingBox.updateBounds(delta.x , delta.y);
				}
			}
			if (dragShape != null){	stage.modifiedArea = stage.modifiedArea.OR(dragShape.boundingBox);}
		}
		return this._dragOn;
	},
	_onDrop : function(x , y , dx , dy){
		if (debugFlags.CONSOLE()){console.log('Drop '+this.parent.name+' '+this.parent.id);}
		if (this._dropOn){ 
			if (this.parent.draggable){
				stage.modifiedArea = stage.modifiedArea.OR(this.boundingBox);
				var delta = {x : dragShape.x - this.parent.x , y : dragShape.y - this.parent.y }
				this.parent.x=dragShape.x;
				this.parent.y=dragShape.y;
				this.boundingBox.updateBounds(delta.x , delta.y);
				//stage.modifiedArea = stage.modifiedArea.OR(this.boundingBox);
			}

			this.parent.currentID=eventID.DROP;
			if (dragShape != null){
				stage.modifiedArea = stage.modifiedArea.OR(this.boundingBox);
				stage.modifiedArea = stage.modifiedArea.OR(dragShape.boundingBox);
				this.parent.parent.removeChild(dragShape);
				delete dragShape;
				dragShape = null;
			}
		}
		return this._dropOn;
	},
	_onLeftMousePress : function(){
		if (debugFlags.CONSOLE()){console.log('Left Mouse Press '+this.parent.name+' '+this.parent.id);}
		if (this._leftMousePressOn){
			this.parent.currentID=eventID.LPRESS;
			stage.modifiedArea = stage.modifiedArea.OR(this.boundingBox);
		}
		return this._leftMousePressOn;
	},
	_onRightMousePress : function(){
		if (debugFlags.CONSOLE()){console.log('Right Mouse Press '+this.parent.name+' '+this.parent.id);}
		if (this._rightMousePressOn){
			this.parent.currentID=eventID.RPRESS;
			stage.modifiedArea = stage.modifiedArea.OR(this.boundingBox);
		}
		return this._rightMousePressOn;
	},
	_onLeftMouseRelease : function(){
		if (debugFlags.CONSOLE()){console.log('Left Mouse Release '+this.parent.name+' '+this.parent.id);}
		if (this._leftMouseReleaseOn){
			this.parent.currentID=eventID.LRELEASE;
			stage.modifiedArea = stage.modifiedArea.OR(this.boundingBox);
		}
		return this._leftMouseReleaseOn;
	},
	_onRightMouseRelease : function(){
		if (debugFlags.CONSOLE()){console.log('Right Mouse Release '+this.parent.name+' '+this.parent.id);}
		if (this._rightMouseReleaseOn){
			this.parent.currentID=eventID.RRELEASE;
			stage.modifiedArea = stage.modifiedArea.OR(this.boundingBox);
		}
		return this._rightMouseReleaseOn;
	},
	_onClick : function(){
		if (debugFlags.CONSOLE()){console.log('Click '+this.parent.name+' '+this.parent.id);}
		if (this._clickOn){ 
			//if this is the only one selected, or the top most selected, make it the global top most
			this.parent.currentID=eventID.CLICK;
			stage.modifiedArea = stage.modifiedArea.OR(this.boundingBox);
		}
		return this._clickOn;
	},
	_onDblClick : function(){
		if (debugFlags.CONSOLE()){console.log('Dbl Click '+this.parent.name+' '+this.parent.id);}
		if (this._dblClickOn){
			this.parent.currentID=eventID.DBLCLICK;
			stage.modifiedArea = stage.modifiedArea.OR(this.boundingBox);
		}
		return this._dblClickOn;
	},
	_onRightClick : function(){
		if (debugFlags.CONSOLE()){console.log('R Click '+this.parent.name+' '+this.parent.id);}
		if (this._rightClickOn){
			this.parent.currentID=eventID.RCLICK;
			stage.modifiedArea = stage.modifiedArea.OR(this.boundingBox);
		}
		return this._rightClickOn;
	},
	_onDblRightClick : function(){
		if (debugFlags.CONSOLE()){console.log('Dbl R Click '+this.parent.name+' '+this.parent.id);}
		if (this._dblRightClickOn){
			this.parent.currentID=eventID.DBLRCLICK;
			stage.modifiedArea = stage.modifiedArea.OR(this.boundingBox);
		}
		return this._dblRightClickOn;
	},
	_onScrollIn : function(){
		if (debugFlags.CONSOLE()){console.log('Scroll In '+this.parent.name+' '+this.parent.id);}
		if (this._scrollInOn){
			this.parent.currentID=eventID.SCROLL;
			stage.modifiedArea = stage.modifiedArea.OR(this.boundingBox);
		}
		return this._scrollInOn;
	},
	_onScrollOut : function(){
		if (debugFlags.CONSOLE()){console.log('Scroll Out '+this.parent.name+' '+this.parent.id);}
		if (this._scrollOutOn){
			this.parent.currentID=eventID.SCROLL;
			stage.modifiedArea = stage.modifiedArea.OR(this.boundingBox);
		}
		return this._scrollOutOn;
	},
	dragging : function (){ return this._dragging;},
	globalDragging : function (){return this._globalDragging[0];},
	_globalDragging : [false],
	_leftMouseTimer : function(){
		this._leftMouseDownTime[1] = this._leftMouseDownTime[0];
		var d = new Date();
		this._leftMouseDownTime[0]=d.getTime();
	},
	_rightMouseTimer : function(){
		this._rightMouseDownTime[1] = this._rightMouseDownTime[0];
		var d = new Date();
		this._rightMouseDownTime[0]=d.getTime();
	},
	


	__onMotion:function(x,y){
		if (!this._mouseOn || !this._motionOn){return false;}
		this._dx=x-this._lastMousePosition.x;
		this._dy=y-this._lastMousePosition.y;
		this._lastMousePosition.x=x;	//safest bet is to always record previous mouse positions as there are many situations when they will be needed
		this._lastMousePosition.y=y;
		if (this._dragOn && this._leftMouseDown){	//if it's a drag set the flags to characterize a drag
			if (!this.dragging()){ this.onDragStart(x , y , this._dx , this._dy);}
			this._dragging=true;
			this._globalDragging[0]=true;
			this._leftMouseDownTime=[0,0];	//ensure no double click is generated if the user quickly drags and drops
		}
		if (this.dragging()){	//if we are dragging, disregard all other motion signals (enter, leave or motion)
			return this.onDrag(x , y , this._dx , this._dy);
		}
		if (this.boundingBox.inside(x,y)){
			mouseEventOrder.addToTop(this.parent);
			//if (this.parent.id == 52){console.log("Is top: "+mouseEventOrder.isTop(this.parent)+" is inside: "+this._inside);}
			if ((this._eventOrder ==  eventOrderFlags.ALL || (this._eventOrder == eventOrderFlags.TOP && mouseEventOrder.isTop(this.parent))) && !this._inside){
				//console.log(this.parent.name+" is inside");
				this._inside=true;
				/*
				if (this.parent.id == 52){
					var str = '';
					for (var i = 0 ; i < mouseEventOrder._displayObjects.length ; i++){
						str+=mouseEventOrder._displayObjects[i].name + '('+mouseEventOrder._displayObjects[i].id + ') ';
					}	
					console.log(str);
					//console.log((mouseEventOrder._displayObjects.length>0)?mouseEventOrder._displayObjects[mouseEventOrder._displayObjects.length-1].name:'N/A');
				}*/

				return this.onMouseEnter();
			}
			else if ((this._eventOrder ==  eventOrderFlags.TOP && !mouseEventOrder.isTop(this.parent)) && this._inside){
				//console.log(this.parent.name+" is outside");
				this._inside=false;
				
				//if (this.parent.id == 10){console.log('removing the container x='+x+' y='+y+' L='+this.parent.x+' R='+this.parent.y);}
				//if (this.parent.id == 52){console.log('removing the Background x='+x+' y='+y+' L='+this.parent.x+' R='+this.parent.y);}
				if (this.parent.id == 52){
					//var str = '';
					//for (var i = 0 ; i < mouseEventOrder._displayObjects.length ; i++){
					//	str+=mouseEventOrder._displayObjects[i].name + '('+mouseEventOrder._displayObjects[i].id + ') ';
					//}	
					//console.log(str);
					//console.log((mouseEventOrder._displayObjects.length>0)?mouseEventOrder._displayObjects[mouseEventOrder._displayObjects.length-1].name:'N/A');
				}
				
				return this.onMouseLeave();
			}
			/*else if(this.parent.id == 52){
				//console.log("Is top: "+mouseEventOrder.isTop(this.parent)+" is inside: "+this._inside);
				
				if (this.parent.id == 52){
					var str = '';
					for (var i = 0 ; i < mouseEventOrder._displayObjects.length ; i++){
						str+=mouseEventOrder._displayObjects[i].name + '('+mouseEventOrder._displayObjects[i].id + ') ';
					}	
					console.log(str);
					//console.log((mouseEventOrder._displayObjects.length>0)?mouseEventOrder._displayObjects[mouseEventOrder._displayObjects.length-1].name:'N/A');
				}
			}*/
		}
		else if(this._inside || (!this._inside && mouseEventOrder.has(this.parent))){
			this._inside=false;
			mouseEventOrder.remove(this.parent);
			//if (this.parent.id == 10){console.log('removing the container x='+x+' y='+y+' L='+this.parent.x+' R='+this.parent.y);}
			//if (this.parent.id == 52){console.log('removing the Background x='+x+' y='+y+' L='+this.parent.x+' R='+this.parent.y);}
			if (this.parent.id == 52){
				/*var str = '';
				for (var i = 0 ; i < mouseEventOrder._displayObjects.length ; i++){
					str+=mouseEventOrder._displayObjects[i].name + '('+mouseEventOrder._displayObjects[i].id + ') ';
				}	
				console.log(str);
				console.log((mouseEventOrder._displayObjects.length>0)?mouseEventOrder._displayObjects[mouseEventOrder._displayObjects.length-1].name:'N/A');
				*/
			}
			
			return this.onMouseLeave();
		}
		if (this._constantMotionOn && this._inside){
			return this.onMotion();
		}
		return false;
	},



	__onLeftMousePress:function(x , y , button){
		this._leftMouseDown=true;
		return this.onLeftMousePress();
	},
	__onLeftMouseRelease:function(x , y , button){
		/*The current implementation returns the return value of single or double click, ORed with the return value of onDrop. This means the click signal is handled IN ADDITION to the drop signal. If the user only wants a drop signal and no clicks, change to returns only
		*/
		if (this._leftMouseDown){
			if (this._dragging){
				this._dragging=false;
				this._globalDragging[0]=false;
				this.onDrop();
			}

			this._leftMouseDown=false;
			this._leftMouseTimer();
			this.onLeftMouseRelease();
			if (this._leftMouseDownTime[0]-this._leftMouseDownTime[1]<this.dblClickDelay){
				this._leftMouseDownTime=[0,0];
				return this.onDblClick();
			}
			else{
				return this.onClick();
			}
		}
		return false;
	},
	__onRightMousePress:function(x , y , button){
		this._rightMouseDown=true;
		return this.onRightMousePress();
	},
	__onRightMouseRelease:function(x , y , button){
		if (this._rightMouseDown){
			this._rightMouseDown=false;
			this._rightMouseTimer();
			this.onRightMouseRelease();
			if (this._rightMouseDownTime[0]-this._rightMouseDownTime[1]<this.dblClickDelay){
				this._rightMouseDownTime=[0,0];
				return this.onDblRightClick();
			}
			else{
				return this.onRightClick();
			}
		}
		return false;
	},
	__onMousePress:function(x , y , button){
		if (this._constantClickOn || this._inside){
			if (button==mouseButtonType.LEFT){return this.__onLeftMousePress(x , y , button);}
			else if(button==mouseButtonType.RIGHT) {return this.__onRightMousePress(x , y , button);}
			else if(button==mouseButtonType.MIDDLE) {console.log("Middle mouse button is not supported yet");}
		}
		return false;
	},
	__onMouseRelease:function(x , y , button){
		if (this._constantClickOn || this._inside || this._leftMouseDown){
			if (button==mouseButtonType.LEFT){return this.__onLeftMouseRelease(x , y , button)}
			else if (button==mouseButtonType.RIGHT){return this.__onRightMouseRelease(x , y , button)}
			else if(button==mouseButtonType.MIDDLE) {console.log("Middle mouse button is not supported yet");}
		}
		return false;
	},




	__onScroll : function(x , y , scroll){
		if (this._inside){
			if (scroll == mouseScrollType.IN){return this.onScrollIn();}
			if (scroll == mouseScrollType.OUT){return this.onScrollOut();}
		}	
		return false;
	}
});

var _lastMouseRegisterTime = 0;	//most recent time a mouse motion was registered. Used to keep track of frequency of mouse signals generated

function onMouseMotion(e) {
	/*Writes the current cursor position to the document variables cursorX and cursorY
	*/
	var d = new Date();
	if (d.getTime()-_lastMouseRegisterTime>1000/mouseFrequency){
		_lastMouseRegisterTime=d.getTime();
		mousePos.x=(window.Event) ? e.pageX : event.clientX + (document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft);
		mousePos.y=(window.Event) ? e.pageY : event.clientY + (document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop);

		stage.resetIntersections();
		stage.initalizeModifiedArea();
		_onMouseMotion(stage, mousePos.x , mousePos.y);
		stage.normalizeModifiedArea();
		if (stage.modifiedArea.w>0){
			stage.calculateIntersections();
			stage.renderAll();
		}
	}
}

function _onMouseMotion(displayObject , x , y) {
	if (displayObject instanceof Shape || displayObject instanceof Bitmap || displayObject instanceof Text){
		if (displayObject.mouse && displayObject.mouse._mouseOn && displayObject.mouse._motionOn){ return displayObject.mouse.__onMotion(x , y);}
		return false;
	}
	else if (displayObject instanceof Container || displayObject instanceof Stage){
		if (displayObject.mouse && displayObject.mouse._mouseOn && displayObject.mouse._motionOn){
			var result = displayObject.mouse.__onMotion(x , y); 
			for (var i = displayObject.getNumChildren() - 1; i >= 0; i--) { 
				result = _onMouseMotion(displayObject.getChildAt(i) , x , y) || result;
			}
			return result;
		}
	}	
}

rightMouseDown=false;		//true if right mouse button is down
leftMouseDown=false;		//true if left mouse button is down

mouseButtonType={
	LEFT:0,
	MIDDLE:1,
	RIGHT:2
}
function onMouseDown(e) {
	/*Updates the right and left mouse button states
	*/
	if (!e){
		var e=window.event;
	}
	if (e.which){
		leftMouseDown=(e.which==1);
		rightMouseDown=(e.which==3);
	}
	else if (e.button){
		leftMouseDown=(e.button==1);
		rightMouseDown=(e.button==2);
	}

	if (leftMouseDown) {var button=mouseButtonType.LEFT;}
	else if (rightMouseDown) {var button=mouseButtonType.RIGHT;}
	else {var button=mouseButtonType.MIDDLE;}

	stage.resetIntersections();
	stage.initalizeModifiedArea();
	_onMouseDown(stage, mousePos.x , mousePos.y , button);
	if (stage.modifiedArea.w>0){
		stage.calculateIntersections();
		stage.renderAll();
	}
}

function _onMouseDown(displayObject , x , y , button) {
	if (displayObject instanceof Shape || displayObject instanceof Bitmap || displayObject instanceof Text){
		if (displayObject.mouse && displayObject.mouse._mouseOn && displayObject.mouse._mouseButtonOn){ return displayObject.mouse.__onMousePress(x , y , button);}
		return false;
	}
	else if (displayObject instanceof Container || displayObject instanceof Stage){
		if (displayObject.mouse && displayObject.mouse._mouseOn && displayObject.mouse._mouseButtonOn){
			var result = displayObject.mouse.__onMousePress(x , y , button); 
			for (var i = displayObject.getNumChildren() - 1; i >= 0; i--) { 
				result = _onMouseDown(displayObject.getChildAt(i) , x , y , button) || result;
			}
			return result;
		}
	}	
}

function onMouseUp(e) {
	/*Updates the right and left mouse button states
	*/
	if (!e){
		var e=window.event;
	}
	var button;
	if (e.which){
		if (leftMouseDown && e.which==1){		//left mouse button was down but now is raised, set left mouse button to false
			leftMouseDown=false;
			button=mouseButtonType.LEFT;
		}
		else if(rightMouseDown &&e.which==3){	//right mouse button was down but now is raised, set left mouse button to false
			rightMouseDown=false;
			button=mouseButtonType.RIGHT;
		}
		else{
			button=mouseButtonType.MIDDLE;
		}
	}
	else if (e.button){
		if (leftMouseDown && e.which==1){		//left mouse button was down but now is raised, set left mouse button to false
			leftMouseDown=false;
			button=mouseButtonType.LEFT;
		}
		else if(rightMouseDown &&e.which==2){	//right mouse button was down but now is raised, set left mouse button to false
			rightMouseDown=false;
			button=mouseButtonType.RIGHT;
		}
		else{
			button=mouseButtonType.MIDDLE;
		}
	}

	stage.resetIntersections();
	stage.initalizeModifiedArea();
	_onMouseUp(stage, mousePos.x , mousePos.y , button);
	if (stage.modifiedArea.w>0){
		stage.calculateIntersections();
		stage.renderAll();
	}
}

function _onMouseUp(displayObject , x , y , button) {
	if (displayObject instanceof Shape || displayObject instanceof Bitmap || displayObject instanceof Text){
		if (displayObject.mouse && displayObject.mouse._mouseOn && displayObject.mouse._mouseButtonOn){ return displayObject.mouse.__onMouseRelease(x , y , button);}
		return false;
	}
	else if (displayObject instanceof Container || displayObject instanceof Stage){
		if (displayObject.mouse && displayObject.mouse._mouseOn && displayObject.mouse._mouseButtonOn){
			var result = displayObject.mouse.__onMouseRelease(x , y , button); 
			for (var i = displayObject.getNumChildren() - 1; i >= 0; i--) { 
				result = _onMouseUp(displayObject.getChildAt(i) , x , y , button) || result;
			}
			return result;
		}
	}	
}
mouseScrollType={
	IN:0,
	OUT:1,
	IDLE:2
}

mouseScroll=mouseScrollType.IDLE;

function onMouseWheelSpin(e) {
	var nDelta=0;

	if (!e){e=window.event;}	//For IE, access the global (window) event object
	
	if ( e.wheelDelta ){		//IE and Opera
		nDelta=e.wheelDelta;
		if (window.opera){		//Opera has the values reversed
			nDelta= -nDelta;
		}
	}
	else if (e.detail){		// Mozilla FireFox
		nDelta= -e.detail;
	}
	if (nDelta > 0){
		//moveLevelIn();
		mouseScroll=mouseScrollType.IN;
	}
	else{
		//moveLevelOut();
		mouseScroll=mouseScrollType.OUT;
	}

	stage.resetIntersections();
	stage.initalizeModifiedArea();
	_onMouseScroll(stage, mousePos.x , mousePos.y , mouseScroll);
	if (stage.modifiedArea.w>0){
		stage.calculateIntersections();
		stage.renderAll();
	}

	if (e.preventDefault){		// Mozilla FireFox
		e.preventDefault();
	}

	e.returnValue = false;		// cancel default action
}

function _onMouseScroll(displayObject , x , y , scroll) {
	if (displayObject instanceof Shape || displayObject instanceof Bitmap || displayObject instanceof Text){
		if (displayObject.mouse && displayObject.mouse._mouseOn && displayObject.mouse._scrollOn){ return displayObject.mouse.__onScroll(x , y , scroll);}
		return false;
	}
	else if (displayObject instanceof Container || displayObject instanceof Stage){
		if (displayObject.mouse && displayObject.mouse._mouseOn && displayObject.mouse._scrollOn){
			var result = displayObject.mouse.__onScroll(x , y , scroll); 
			for (var i = displayObject.getNumChildren() - 1; i >= 0; i--) { 
				result = _onMouseScroll(displayObject.getChildAt(i) , x , y , scroll) || result;
			}
			return result;
		}
	}	
}

