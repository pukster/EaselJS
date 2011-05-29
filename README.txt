PUKSTERS MODIFICATIONS:

This is my attempt to optimize the EaselJS library by minimizing matrix multiplications and screen redraws. After each addition a benchmark test is run to observe the performance increase. 

Benchmark Test: The benchmark test located in benchmark.html draws a large number of shapes with complex gradients and with alpha transparency values. It then averages out the run time over 100 trials. This same test is used after each code optimization to see its effects.

--Test 1): The first test uses the unmodified EaselJS library. It removes all children from the stage every trial iteration, creates new shapes, draws new graphics for that shape and calls update WITHOUT first calling clear().
	-Stage.autoClear==false
	-Stage.enableMouseOver(0)
	-Stage.mouseEnabled==false

	-Average Run Time: 491.93 ms

--Test 2): Runs test 1 but this time calls stage.clear() every trial iteration.
	-Stage.autoClear==false
	-Stage.enableMouseOver(0)
	-Stage.mouseEnabled==false

	-Average Run Time: 443.01 ms

--Test 3): Redraws the shape instead of recreating the shape every iteration.
	-Stage.autoClear==false
	-Stage.enableMouseOver(0)
	-Stage.mouseEnabled==false

	-Average Run Time: 439.14 ms

--Test 4): Updates the stage every iteration without changing the Shapes or their graphics. Note, as the shapes are not cached, they will still be redrawn every trial iteration in the container.draw() function.
	-Stage.autoClear==false
	-Stage.enableMouseOver(0)
	-Stage.mouseEnabled==false

	-Average Run Time: 269.95 ms

--Test 5): Same as test 4 but shapes are cached this time.
	-Stage.autoClear==false
	-Stage.enableMouseOver(0)
	-Stage.mouseEnabled==false

	-Average Run Time: 248.83 ms

--Test 6): Same as test 5 but the single container is cached this time. This means that only a single drawImage(_chachedCanvas,w,h) call is made, as opposed to ros x cols number of calls. Note, whether or not the shapes are cached should little to no affect on performance as they are only cached once.
	-Stage.autoClear==false
	-Stage.enableMouseOver(0)
	-Stage.mouseEnabled==false

	-Average Run Time: 21.05 ms

--Test 7): Simulates mouse motion on test 5. One of the boxes (by default the first one) is chosen and a mouse enter is simulated on it and it is recached. onMouseEnter simply redraws it to simulate a rollover effect (even though the same color is used here). As would be expected, this significantly slows down performance as the new graphics has to be initialized, drawn and then cached.
	-Stage.autoClear==false
	-Stage.enableMouseOver(0)
	-Stage.mouseEnabled==false

	-Average Run Time: 271.62 ms

--Test 8): Simulates the mouse motion above on test 6. One of the boxes (by default the first one) is chosen and a mouse enter is simulated on it and then the entire container is recached. onMouseEnter simply redraws it to simulate a rollover effect (even though the same color is used here). Surprisingly, this is slower than only caching a single shape. The reason for this is that more is being cached every iteration whereas caching containers increases performance only if the cache is seldom updated.
	-Stage.autoClear==false
	-Stage.enableMouseOver(0)
	-Stage.mouseEnabled==false

	-Average Run Time: 331.82 ms

--Test 9): merges tests 7 and 8 by also caching shapes to see if this speeds up caching of containers. One of the boxes (by default the first one) is chosen and a mouse enter is simulated on it and then the entire container is recached. onMouseEnter simply redraws it to simulate a rollover effect (even though the same color is used here). There seems to be no increase in performance by also caching the shapes. The reason for this seems to be due to DisplayObject.cache(). To redraw the canvas the draw method is called as such: DisplayObject.draw(_cacheCtx, true, new Matrix2D(1,0,0,1,-x,-y)). 'true' here signals that we should ignore the cache. This prevents the situation where the same cache is drawn to the cache, rather than updating the cache. This is great for Shapes. Unfortunately, it also overlooks the cache of all children of a container. There are three ways to fix this. 1) create a new parameter for draw 'ignoreChildCache' which considers or ignores all children caches. 2) make ignoreCache only for the immediate DisplayObject. 3) Add a '_modified' flag so Easel knows when to cache displayObjects and when to use existing caches. The first solution has the drawback that the user has to provide more information. The second solution has the drawback that their is more micromanagement as the user has to manually cache every child before caching the parent. The third solution either leads to micromanagement as the user has to indicate when the displayObject has been modified, or careful care has to be taken to ensure all modifications are recorded (ie. mark shapes as modified when their graphics are updated).
	-Stage.autoClear==false
	-Stage.enableMouseOver(0)
	-Stage.mouseEnabled==false

	-Average Run Time: 329.78 ms

--Test 9.1): Carry out test 9 again, this time checking to see the performance increase when child caches are reused to create parent caches. It stands to reason that in a container more things will stay the same than they will change. For example, in Mario Brothers 1 (NES) if mario hits a block, all other blocks, enemies, pipes... stay the same. Likewise, if a container has 100 buttons, 99 of those will not change on a rollover effect, only 1 will. 

What we want in the onMouseOver function is a command such as 'this.cache(...); this.parent.cache(...);' what we don't want is either the parent to redraw all children, thereby defeating the purpose of caching the child in the first place, or removing the parent cache entirely and only caching the children (which was shown to be less efficient in test 6). 

Unfortunately, for this test the Easel code must be updated. We will introduce a new instance level flag DisplayObject._modified. To keep things simple we will only consider shapes capable of being modified, and then they will propagate all the way back to inform all of their parents that a modification has occurred. Similarly, parents will look at all their children and treat modified from unmodified children differently. Shapes will be considered modified either when they have a new graphics instance created or when their graphics isntances are modified. In other words, when the graphics instance is initialized or when the graphics._dirty flag is true. When Shape is initialized, _modified is set to true so that it gets drawn the first time (even if graphics is an empty instance). Then in Graphics, when there is a test for _dirty, the _modified flag must be set to true. Later, when the shape is either drawn or cached, the _modified flag must be set to false. However, as there is no connection between the Graphics instance and the Shape it belongs to, and as my purpose here is to show that a performance gain exists in this approach, not to show the actual approach, I will simply set the _modified flag to true in the onMouseOver function and have the container set it to false once it has cached it. This is NOT how I intend the final application to follow.

From tracing the flow of function calls, there is a hint of spaghetti code which almost everyone falls victim to when using scripting languages. 
--Container.cache() --calls--> DisplayObject.cache()
--DisplayObject.cache() --calls--> Container.draw()
--Container.draw() --calls--> Dispaly.Draw()
--Dispaly.Draw() --draws on-->Container._cacheCanvas

Here, all that I did was change the conditional statement in DisplayObject.draw() from

if (ignoreCache || !this.cacheCanvas) { return false; }

to

if (this._modified || !this.cacheCanvas) { return false; }

so that the cache is used every time, unless there are changes.

WARNING: This could lead to errors as it has already been reported that it is not good practice to continually read and write from and to the canvas. This applies to putImageData, but it might also apply to ctx.DrawImage (http://www.whatwg.org/specs/web-apps/current-work/multipage/the-canvas-element.html#pixel-manipulation)

The results indicate a huge performance gain over redrawing all shapes inside a container (test 9). I think it would be highly beneficial to incorporate this into all other classes so long as it is possible to locate all situations where an object transitions from the unmodified to the modified and then back to the modified stage.

	-Stage.autoClear==false
	-Stage.enableMouseOver(0)
	-Stage.mouseEnabled==false

	-Average Run Time: 97.73 ms

Test 10) uses the method devised above, but introduces a second cache. As computers generally have more memory than they have processing power, this test aims to find out whether having multiple caches provides any performance increases. Every shape, in addition to having the standard cache will also have one for onMouseOver. the OnMouseOver function quickly points the cache canvas to the onMouseOverCanvas. If there are many mouse signals, one canvas can be created for each:

--onMouseOverGraphics-->onMouseOverCanvas
--onMouseEnterGraphics-->onMouseEnterCanvas
--onMouseLeaveGraphics-->onMouseLeaveCanvas
--onMouseClickGraphics-->onMouseClickCanvas
--onMouseDblClickGraphics-->onMouseDblClickCanvas
...

The user would then swap canvases in and out to quickly change the shapes.

As there is only one mouse function here, to simulate enter and leave events, we will switch between the original cache canvas and a new onMouseOverCanvas which will reuse the same graphics object, jsut reinitialize it to incorporate the overhead into this test. The results of this should be very similar to the results for test 6 as all we're really doing is redrawing the cache every iteration. However, there should be some significant overhead as there are now twice as many initial cache() calls, as well as twice as many graphic vector draws, and the creation of another canvas. The benefit is that there are no more draw routines every time onMouseOver() is called, and only the container is cached, and even then it uses all of the existing cached shapes.

	-Stage.autoClear==false
	-Stage.enableMouseOver(0)
	-Stage.mouseEnabled==false

	-Average Run Time: 95.5 ms

EASELJS LIBRARY:

EaselJS is a library to make working with the Canvas element easier. It provides a display list to allow you to work with display elements on a canvas as nested objects. It also provides a simple framework for providing shape based mouse interactions on elements in the display list. This is useful for games, generative art, and other highly graphical experiences.

The home page for EaselJS can be found at http://easeljs.com/

There is a Google Group for discussions and support at http://groups.google.com/group/easeljs

There is a GitHub repository, which includes downloads, issue tracking, & a wiki at https://github.com/gskinner/EaselJS

It was built by gskinner.com, and is released for free under the MIT license, which means you can use it for almost any purpose (including commercial projects). We appreciate credit where possible, but it is not a requirement.

EaselJS is currently in alpha. We will be making significant improvements to the library, samples, and documentation over the coming weeks. Please be aware that this may necessitate changes to the existing API.


The API is inspired by Flash's display list, and should be easy to pick up for both JS and AS3 developers. The key classes are:

DisplayObject
Abstract base class for all display elements in EaselJS. Exposes all of the display properties (ex. x, y, rotation, scaleX, scaleY, skewX, skewY, alpha, shadow, etc) that are common to all display objects.

Stage
The root level display container for display elements. Each time tick() is called on Stage, it will update and render the display list to its associated canvas.

Container
A nestable display container, which lets you aggregate display objects and manipulate them as a group.

Bitmap
Draws an image, video or canvas to the canvas according to its display properties.

BitmapSequence
Displays animated or dynamic sprite sheets (images with multiple frames on a grid), and provides APIs for managing playback and sequencing.

Shape
Renders a Graphics object within the context of the display list.

Graphics
Provides an easy to use API for drawing vector data. Can be used with Shape, or completely stand alone.

Text
Renders a single line of text to the stage.


There are also a few helper classes included:

Shadow
Defines all of the properties needed to display a shadow on a display object.

Ticker
Provides a pausable centralized tick manager for ticking Stage instances or other time based code.

UID
Very simple class that provides global, incremental unique numeric IDs.

SpriteSheetUtils
Contains utility methods for extending existing sprite sheets with flipped frames, and for outputting/debugging frame data objects.

SpriteSheet
Encapsulates all the data associated with a sprite sheet to be used with BitmapSequence.

Matrix2D
Represents a 3x3 affine transformation matrix. Used internally for calculating concatenated transformations.

Rectangle & Point
Represent geometric data.


Have a look at the included examples and API documentation for more in-depth information.
