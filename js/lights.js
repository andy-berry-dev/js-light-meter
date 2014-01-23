(function($, document, window) {
	"use strict"

	var DEFAULTS = {
		NUMBER_OF_LIGHTS	:	11,
		LIGHT_RADIUS		:	10,
		LIGHT_SPACING		:	12,
		UPDATE_INTERVAL		:	100,
		LIGHT_COLOUR_1_MAX	:	3,
		LIGHT_COLOUR_2_MAX	:	7,
		LIGHT_COLOUR_1		:	"green",
		LIGHT_COLOUR_2		:	"orange",
		LIGHT_COLOUR_3		:	"red",
		WHITE_LIGHT_COLOR	:	"white"
	}
	
	
	var lights = function(lightsCanvas, config)
	{
		config = config || {};
		this.lightX = config.lightX || lightsCanvas.width() / 2;
		this.numberOfLights = config.numberOfLights || DEFAULTS.NUMBER_OF_LIGHTS;
		this.lightRadius = config.lightRadius || DEFAULTS.LIGHT_RADIUS;
		this.lightSpacing = config.lightSpacing || DEFAULTS.LIGHT_SPACING; 
		this.updateInterval = config.updateInterval || DEFAULTS.UPDATE_INTERVAL;
		this.lightColour1Max = config.lightColour1Max || DEFAULTS.LIGHT_COLOUR_1_MAX;
		this.lightColour2Max = config.lightColour2Max || DEFAULTS.LIGHT_COLOUR_2_MAX;
		this.lightColour3Max = config.lightColour3Max || this.numberOfLights;
		this.lightColour1 = config.lightColour1 || DEFAULTS.LIGHT_COLOUR_1;
		this.lightColour2 = config.lightColour2 || DEFAULTS.LIGHT_COLOUR_2;
		this.lightColour3 = config.lightColour3 || DEFAULTS.LIGHT_COLOUR_3;
		
		
		this.canvasElement = lightsCanvas;
		
		this.lights = new Array();
		for (var i = 0; i < this.numberOfLights; i++) {
			var thisLightX = this.lightX;
			var thisLightY = ( i * this.lightSpacing) + ( (i+1) * this.lightRadius * 2);
			
			// TODO: allow an infinite number of light colours and get rid of the ugly if statement
			var lightColour = DEFAULTS.WHITE_LIGHT_COLOR;
			if (i <= this.lightColour1Max)
			{
				lightColour = this.lightColour1;
			}
			else if (i <= this.lightColour2Max)
			{
				lightColour = this.lightColour2;
			}
			else if (i <= this.lightColour3Max)
			{
				lightColour = this.lightColour3;
			}
			
			var lightIndex = this.numberOfLights - i - 1; 
			this.lights[lightIndex] = {
				"colour" : lightColour,
				"x" : thisLightX,
				"y" : thisLightY,
				"radius" : this.lightRadius,
				"strokeStyle" : "#000",
				"state" : "off"
			}
		}

		this.queue = new Array();
		this.interval = -1;
		this.endOfQueueValue = -1;
	}
	lights.prototype.redraw = function()
	{
		draw.call(this);
	}
	lights.prototype.setInterval = function(interval) {
		var intervalMethod = function() {
			this.updateInterval = interval;
			stopProcessing.call(this);
			startProcessing.call(this);
		};
		pushMethod.call(this, intervalMethod, []);
	}
	lights.prototype.getInterval = function() {
		return this.updateInterval;
	}
	lights.prototype.pauseFor = function(val) {
		for (var i = 0; i < val; i++) {
			pushMethod.call(this, noop, []);
		}
	}
	lights.prototype.flashUpTo = function(start, val) {
		var limit = val || this.numberOfLights;
		var startVal = start || 0;
		for (var lightNum = startVal; lightNum <= limit; lightNum++) {
			pushMethod.call(this, setValue, [lightNum]);
		}
		setEndOfQueueValue.call(this, limit);
	}
	lights.prototype.flashDownTo = function(start, val) {
		var limit = (val || 0);
		var startVal = (start!=undefined) ? start : this.numberOfLights -1;
		for (var lightNum = startVal; lightNum >= limit; lightNum--) {
			pushMethod.call(this, setValue, [lightNum]);
		}
		setEndOfQueueValue.call(this, limit);
	}
	lights.prototype.flashTo = function(start, val) {
		val = Math.max(0, val);
		if (val > start) {
			this.flashUpTo(start, val);
		} else {
			this.flashDownTo(start, val);
		}
	}
	lights.prototype.changeValueBy = function(diff) {
		var curValue = this.getValue();
		var newValue = curValue + diff;
		this.flashTo(curValue, newValue);
	}
	lights.prototype.getValue = function() {
		return this.endOfQueueValue;
	}
	lights.prototype.blinkLight = function(count) {
		var blinkCount = count || 5;
		for (var i = 0; i < blinkCount; i++) {
			this.changeValueBy(-1);
			this.changeValueBy(1);
		}
	}	
	
	
	
	// private stuff
	var processQueue = function() {
		if (this.queue.length > 0) {
			var method = this.queue.shift();
			if (method) {
				method.bind(this).call();
				draw.call(this);
			}
		} else {
			stopProcessing.call(this);
		}
	}
	var startProcessing = function() {
		draw.call(this);
		if (this.interval == -1) {
			this.interval = setInterval(processQueue.bind(this), this.updateInterval);
		}
	}
	var stopProcessing = function() {
		if (this.interval != -1) {
			clearInterval(this.interval);
			this.interval = -1;
		}
	}
	var pushMethod = function(fn, params) {
		this.queue.push( function() {
			fn.bind(this).call(window, params);
		});
		startProcessing.call(this);
	}
	var setValue = function(value) {
		var theValue = value || 0;
		theValue = (theValue < 0) ? 0 : theValue;
		for (var lightNum = 0; lightNum < this.lights.length; lightNum++) {
			var light = this.lights[lightNum];
			light.state = (lightNum < value) ? "on" : "off";
		}
	}
	var setEndOfQueueValue = function(val) {
		this.endOfQueueValue = val;
	}
	var draw = function() {
		this.canvasElement.clearCanvas();
		for (var lightNum = 0; lightNum < this.lights.length; lightNum++) {
			var light = this.lights[lightNum];
			this.canvasElement.drawArc({
				strokeStyle: light.strokeStyle,
				fillStyle: (light.state == "on") ? light.colour : "none",
				x: light.x,
				y: light.y,
				radius: light.radius
			})
		}
	}
	var noop = function() { }
	
	
	

	window.Lights = lights;
	
})(jQuery, document, window);
