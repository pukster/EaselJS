PUKSTERS MODIFICATIONS:

Created a simple example of my modified EaselJS code for user mck

The example has a single stage with several different containers. The main central containers shows the following shapes
1)A ractangle (background)
2)Circles
3)Arcs
4)labels

Right now the code still has some bugs, but it accurately shows how efficient easel can be made.

The mouse events have also been improved. To enable mouse functionality the user has to initialize the Shape.mouse attribute with the Mouse object, turning on all the mouse actions they would like. Mouse.js is responsible for determining how to classify mouse events. Also, it determines what subset of the stage has been modified, and using that determines what subset of Shapes to redraw (if cache is enabled). Finally, the mouse.js file keeps track of the layers of Shapes underneath the mouse and only calls the Shapes if they are either the TOP layer or they have been specified as accepting mouse events from beneath other layers (eventOrderFlags.TOP v eventOrderFlags.ALL). This is very useful if the user wants, for example a background which changes color whenever a mouse is inside it (eventOrderFlags.ALL). Currently, in easel the only way to do this is via pixel tests, and a onMouseLeave signal will be generated if the mouse goes over another shape while still inside the background.

The following mouse events are currently provided

eventID={
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

The user provides images (html Canvas objects) or Graphics for each case, and the engine is then responsible for updating the screen. This is very usefull for, for example, dragging objects. The user needs to provide graphics or cacheCanvas images for

DRAG:10,
DRAGGING : 11,
DROP:12,
VALIDDROP:13,
INVALIDDROP:14,

And rules for what targets are valid and which are invalid, then the mouse.js file, when dragging, sets the original image to that defined in DRAG. It  creates a new shape which is being dragged as defined by DRAGGING. While dragging, if it is over a valid drop target, the new shape is redrawn as defined by VALIDDROP, and by INVALIDDROP if over an invalid drop target. When the new shape is dropped it deletes the shapes, moves the old shape and redraws it as defined by DROP.

The user can still carry out computation before the screen is rendered to via, for example, onMouseClick(), or they can completely reimplement how mouse clicks are handled by reimplementing, for example, _onMouseClick()

A BoundingBox class is introduced to check for mouse inside/outside position as well as rectangular boundaries for determining what subset of the cache to redraw. Currently three shapes are supported: rectangles, circles and arcs. Inside/outside is determined mathematically based on the shape type. Rectangular boundaries are calculated manually for each shape type, and then updated if the shapes are dragged. BoundingBox.bounds is the bounds of the shape, wherease BoundingBox.softBounds is the bounds of the shape as well as its shadow. Polygons are not currently supported, neither is a hit detection system for shapes. However, hit detection is supported for rectangles and is currently employed to ensure sub containers can not leave their parent containers. This reduces the number of redraws as a container only needs to worry about its children.

easel.js is included instead of modifying the actual src/ files in case there is new version of Easel. This way, the modifications can easily be transferred over.

BUGS:
-Some redraws don't calculate the bounds properly and a 1 pixel horizontal and/or vertical line remains
-Mouse drag behaves badly when mouse goes outside boundaries of container, but shape not allowed to move. On going the other way, the shape should be restricted from movement until the mouse reenters the contaienr
-Moving entire containers is not yet implemented

TO IMPLEMENT:
-More mouse events 
	-Triple clicks
	-Left and Right Mouse Press
	-Right Drag
	-Double/Triple L/R click+drag
	-Left and Right Mouse Press and drag
-Animations. Currently animations can easily be incorporated as the screen redraw functions are rather robust. However, the same does not go for animations where the size of the bounding box changes. For example, a rectangle near the edge of the container can not increase as it will hit the side of the container.
-Collisions. I have created a 'solid' attribute for DisplayObject to signal that no other shape can 'hit' it, but I still don't know what other rules to employ. For example, what about a shape and a container? should they 'hit' eachother? What about a solid shape, a non solid container with solid shapes? Should shapes from different container be allowed to 'collide', or should they pass over eachother?
	
