---
layout: main
permalink: /index.html
title: JS Light Meter
---

<script src="js-dependencies/jquery-1.11.0.min.js"></script>
<script src="js-dependencies/jcanvas-14.01.22.min.js"></script>
<script src="LightMeter.js"></script>

# JS Light Meter

A vertical light meter using JavaScript and HTML5 Canvas. 

- A nicely formatted version of this document is available [here](http://andyberry88.github.io/js-lightmeter/).
- Source is [here](https://github.com/andyberry88/js-lightmeter).

The library was originally created years ago for an online tool for [TimelessTime](www.timelesstime.co.uk), back in the day when I was new to the world of JavaScript.

## Dependencies
- jCanvas
- jQuery

## Demo

<div class="demo">
	<div class="row">
		<div class="third-width">
			<h6>#canvas1</h6>
		</div>
		<div class="third-width">
			<h6>#canvas2</h6>
		</div>
		<div class="third-width">
			<h6>#canvas3</h6>
		</div>
	</div>
	<div class="row">
		<div class="third-width">
			<div class="canvas-wrapper canvas1-wrapper">
				<canvas id='canvas1' width='20' height='365'></canvas>
			</div>
		</div>
		<div class="third-width">
			<div class="canvas-wrapper canvas2-wrapper">
				<canvas id='canvas2' width='200' height='600'></canvas>
			</div>
		</div>
		<div class="third-width">
			<div class="canvas-wrapper canvas3-wrapper">
				<canvas id='canvas3' width='50' height='600'></canvas>
			</div>
		</div>
	</div>
</div>

<script>
	var lights1 = new LightMeter( $("#canvas1") );
	lights1.flashUpTo();
	lights1.flashDownTo();

	var lights2 = new LightMeter( $("#canvas2"), {
		lightRadius: 50,
		numberOfLights: 5,
		updateInterval: 500,
		lightOutlineColour : "white",
		lightColour1Max : 2,
		lightColour2Max : 3,
		lightOffColour : "gray"
	} );
	lights2.flashUpTo();
	lights2.flashDownTo();


	var lights3 = new LightMeter( $("#canvas3"), {
		lightRadius: 5,
		numberOfLights: 25,
		updateInterval: 100,
		lightColour1Max : 5,
		lightColour2Max : 20
	} );
	lights3.flashUpTo();
	lights3.flashDownTo();
</script>

Try it out. Open up your console and use the 3 light meters that have been created. Try running some of the following.

```
lights1.flashUpTo(8)
lights1.flashDownTo(4)
lights1.flashTo(7)
lights1.changeValueBy(-4)
lights1.changeValueBy(3)
lights1.blinkLight(7)
```

## Usage

Add a canvas tag to your HTML

```
<canvas id='myCanvas' width='20' height='365'></canvas>
```

Add jCanvas, jQuery and LightMeter to your page.

```
<script src="js/jQuery.js"></script>
<script src="js/jCanvas.js"></script>
<script src="js/LightMeter.js"></script>
```

Create a new `LightMeter` instance, passing it in your canvas element &amp; start using it.

```
var lights1 = new LightMeter( $("#myCanvas") );
lights1.flashUpTo();
lights1.flashDownTo();
```

## Overview
Under the hood the the lights are controlled by pushing on/off functions to a queue which is processed every `X` seconds using an interval.
A delay in the flashing is caused by pushing `noop` functions on to the queue.

For example if the queue is processed every 200ms, the following queue would result in light 1 turning on, light 2 turning on, a pause and light 2 turning off with a 200ms delay between each event.

```
====
turn light 1 on
turn light 2 on
- noop -
turn light 2 off
===
```

## API

#### *constructor()*

#### redraw
Forces a redraw of the canvas.

#### setInterval ( interval )
Sets the interval time between processing events on the queue. A smaller interval results in a smaller delay between lights changing.

#### getInterval
Returns the current interval time.

#### pauseFor ( pauseCount )
Adds the specified number of pauses to the queue. If the current interval is 200ms and the pauseFor(5) is called, a pause of 1s will be added to the queue.

#### flashUpTo ( value )
Sets the lights to flash up to the specified value. If the value is less than the value on the end of the queue nothing will happen.

#### flashDownTo ( value )
Sets the lights to flash down to the specified value. If the value is greater than the value on the end of the queue nothing will happen.

#### flashTo ( value )
Flashes the light to a given value. Under the hood, uses **flashUpTo** &amp; **flashDownTo** depending on the current value and the target value.

#### changeValueBy ( value )
Flashes up/down to the new given value.

#### setValue ( value )
Sets the value of lights. Unlike `changeValueBy` the lights will not change to this new value.

#### getValue
Returns the value of the lights at the end of the queue (i.e. the value after all current items on the queue have been processed.)

#### blinkLight ( numberOfTimesToBlink )
Blinks the light at the value one about the current value the specified number of times.

#### stop
Stop processing items on the queue.

#### start
Start processing items on the queue.


## Config

#### lightXPosition
The X position of the middle of each light in the canvas. 

#### numberOfLights
The number of lights to draw.

#### lightRadius
The radius of each light.

#### lightSpacing
The vertical spacing between each light.

#### updateInterval
The update interval - how often to to process the queue.

#### lightColour1Max
The maximum value for colour1. If set to 3, lights 1-3 will be the colour of `lightColour1` value.

#### lightColour2Max
The maximum value for colour2. See `lightColour1Max` for details.

#### lightColour3Max
The maximum value for colour3. See `lightColour1Max` for details.
If the light number if greater than this value the light colour will be white.

#### lightColour1
The light for the first set of lights.

#### lightColour2
The light for the second set of lights.

#### lightColour3
The light for the third set of lights.

#### lightOutlineColour
The outline colour for each light.

#### lightOffColour
The colour of each light when it's off.

## Config Defaults

```
NUMBER_OF_LIGHTS		:	11,
LIGHT_RADIUS			:	10,
LIGHT_SPACING			:	12,
UPDATE_INTERVAL			:	100,
LIGHT_X_POSITION		:	undefined, // null == use canvas width / 2
LIGHT_COLOUR_1_MAX		:	3,
LIGHT_COLOUR_2_MAX		:	7,
LIGHT_COLOUR_1			:	"green",
LIGHT_COLOUR_2			:	"orange",
LIGHT_COLOUR_3			:	"red",
WHITE_LIGHT_COLOUR		:	"white",
LIGHT_OUTLINE_COLOUR	:	"black"
LIGHT_OFF_COLOUR		:	"white"
```

