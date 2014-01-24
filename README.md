---
layout: main
permalink: /index.html
title: JS Light Meter
---

<script src="js-dependencies/jQuery.js"></script>
<script src="js-dependencies/jCanvas.js"></script>
<script src="LightMeter.js"></script>

# JS Light Meter

A light meter using JavaScript and Canvas. Originally created for an online tool for [TimelessTime](www.timelesstime.co.uk).

## Dependencies
- jCanvas
- jQuery

## Demo

<div class="demo">
	<canvas id='canvas1' width='20' height='365'></canvas>
	<canvas id='canvas2' width='200' height='600'></canvas>
	<canvas id='canvas3' width='50' height='600'></canvas>
</div>

<script>
	var lights1 = new LightMeter( $("#canvas1") );
	lights1.flashUpTo();
	lights1.flashDownTo();

	var lights2 = new LightMeter( $("#canvas2"), {
		lightRadius: 50,
		numberOfLights: 5,
		updateInterval: 500,
		lightOutlineColor : "white",
		lightColour1Max : 2,
		lightColour2Max : 3
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

## API

#### redraw
#### setInterval
#### getInterval
#### pauseFor
#### flashUpTo
#### flashDownTo
#### flashTo
#### changeValueBy
#### getValue
#### setValue
#### blinkLight