(function($, document, window) {
	"use strict"

	/* config */
	var lights = {}
	lights.CANVAS_ID = "lightsCanvas";
	lights.CANVAS_WIDTH = 20;
	lights.CANVAS_HEIGHT = 365;
	lights.CANVAS_WRAPPER_ID = "lightsCanvasWrapper";
	lights.NUMBER_OF_LIGHTS = 11;
	lights.LIGHT_RADIUS = 10;
	lights.LIGHT_PADDING = 12;
	lights.UPDATE_INTERVAL = 100;

	/* end config */

	lights.lights = new Array();
	for (var i = 0; i < lights.NUMBER_OF_LIGHTS; i++) {
		var thisLightX = lights.CANVAS_WIDTH / 2;
		var thisLightY = ( i * lights.LIGHT_PADDING) + ( (i+1) * lights.LIGHT_RADIUS * 2);
		var lightColour;

		switch(i) {
			case 0:
			case 1:
			case 2:
			case 3:
				lightColour = "green";
				break;
			case 4:
			case 5:
			case 6:
			case 7:
				lightColour = "orange";
				break;
			case 8:
			case 9:
			case 10:
				lightColour = "red";
				break;
		}

		lights.lights[lights.NUMBER_OF_LIGHTS - i - 1] = {
			"colour" : lightColour,
			"x" : thisLightX,
			"y" : thisLightY,
			"radius" : lights.LIGHT_RADIUS,
			"strokeStyle" : "#000",
			"state" : "off"
		}
	}

	lights.queue = new Array();
	lights.interval = -1;
	lights.endOfQueueValue = -1;
	lights._processQueue = function() {
		if (lights.queue.length > 0) {
			var method = lights.queue.shift();
			if (method) {
				method();
				lights.draw();
			}
		} else {
			lights._stopProcessing();
		}
	}
	lights._startProcessing = function() {
		lights.draw();
		if (lights.interval == -1) {
			lights.interval = setInterval(lights._processQueue, lights.UPDATE_INTERVAL);
		}
	}
	lights._stopProcessing = function() {
		if (lights.interval != -1) {
			clearInterval(lights.interval)
			lights.interval = -1;
		}
	}
	lights._pushMethod = function(fn, params) {
		lights.queue.push( function() {
	    	fn.apply(window, params);
		});
		lights._startProcessing();
	}
	lights._setValue = function(value) {
		var theValue = value || 0;
		theValue = (theValue < 0) ? 0 : theValue;
		for (var lightNum = 0; lightNum < lights.lights.length; lightNum++) {
			var light = lights.lights[lightNum];
			light.state = (lightNum < value) ? "on" : "off";
		}
	}
	lights._setEndOfQueueValue = function(val) {
		lights.endOfQueueValue = val;
	}
	lights.draw = function() {
		lights.canvasElement.clearCanvas();
		for (var lightNum = 0; lightNum < lights.lights.length; lightNum++) {
			var light = lights.lights[lightNum];
			lights.canvasElement.drawArc({
				strokeStyle: light.strokeStyle,
				fillStyle: (light.state == "on") ? light.colour : "none",
				x: light.x, 
				y: light.y,
				radius: light.radius
			})
		}
	}
	lights._noop = function() { }



	lights.setInterval = function(interval) {
		lights._pushMethod(function() {
			lights.UPDATE_INTERVAL = interval;
			lights._stopProcessing();
			lights._startProcessing();
		}, []);
	}
	lights.getInterval = function() {
		return lights.UPDATE_INTERVAL;
	}
	lights.pauseFor = function(val) {
		for (var i = 0; i < val; i++) {
			lights._pushMethod(lights._noop, []);
		}
	}
	lights.flashUpTo = function(start, val) {
		var limit = val || lights.NUMBER_OF_LIGHTS;
		var startVal = start || 0;
		for (var lightNum = startVal; lightNum <= limit; lightNum++) {
			lights._pushMethod( lights._setValue, [lightNum]);
		}
		lights._setEndOfQueueValue(limit);
	}
	lights.flashDownTo = function(start, val) {
		var limit = (val || 0);
		var startVal = (start!=undefined) ? start : lights.NUMBER_OF_LIGHTS -1;
		for (var lightNum = startVal; lightNum >= limit; lightNum--) {
			lights._pushMethod( lights._setValue, [lightNum]);
		}
		lights._setEndOfQueueValue(limit);
	}
	lights.flashTo = function(start, val) {
		if (val > start) {
			lights.flashUpTo(start, val);
		} else {
			lights.flashDownTo(start, val);
		}
	}
	lights.changeValueBy = function(diff) {
		var curValue = lights.getValue();
		var newValue = curValue + diff;
		lights.flashTo(curValue, newValue);
	}
	lights.getValue = function() {
		return lights.endOfQueueValue;
	}
	lights.blinkLight = function(count) {
		var blinkCount = count || 5;
		for (var i = 0; i < blinkCount; i++) {
			lights.changeValueBy(-1);
			lights.changeValueBy(1);
		}
	}

	lights.init = function() {
		$("<canvas id='"+lights.CANVAS_ID+"' width='"+lights.CANVAS_WIDTH+
			"' height='"+lights.CANVAS_HEIGHT+"'></canvas>")
			.appendTo("#"+lights.CANVAS_WRAPPER_ID);
		lights.canvasElement = $("#"+lights.CANVAS_ID);

		lights._startProcessing();
		lights.pauseFor(2);
		var oldInterval = lights.getInterval();
		lights.setInterval(30);
		lights.flashUpTo();
		lights.flashDownTo();
		lights.setInterval(oldInterval);
	}

	window.lights = lights;
	
})(jQuery, document, window);
