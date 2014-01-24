(function($, document, window) {
	"use strict"

	var DEFAULTS = {
		NUMBER_OF_LIGHTS	:	11,
		LIGHT_RADIUS		:	10,
		LIGHT_SPACING		:	12,
		UPDATE_INTERVAL		:	100,
		LIGHT_X_POSITION	:	-1, // -1 == use canvas width / 2
		LIGHT_COLOUR_1_MAX	:	3,
		LIGHT_COLOUR_2_MAX	:	7,
		LIGHT_COLOUR_1		:	"green",
		LIGHT_COLOUR_2		:	"orange",
		LIGHT_COLOUR_3		:	"red",
		WHITE_LIGHT_COLOR	:	"white",
		LIGHT_OUTLINE_COLOR	:	"black"
	}


	var lights = function(lightsCanvas, config)
	{
		config = config || {};
		this.lightXPosition = config.lightXPosition || DEFAULTS.LIGHT_X_POSITION;
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
		this.lightOutlineColor = config.lightOutlineColor || DEFAULTS.LIGHT_OUTLINE_COLOR;

		this.canvasElement = lightsCanvas;

		var canvas = $(this.canvasElement);
		canvas.width = $(canvas).parent().width();

		this.lights = new Array();
		for (var i = 0; i < this.numberOfLights; i++) {
			var thisLightX = this.lightXPosition;
			if (thisLightX < 0)
			{
				thisLightX = this.canvasElement.width() / 2;
			}

			var thisLightY = (this.canvasElement.height() - (i * 2 * this.lightRadius)) - this.lightRadius - ((i + 1) * this.lightSpacing);

			// TODO: allow an infinite number of light colours and get rid of the ugly if statement
			var lightColour = DEFAULTS.WHITE_LIGHT_COLOR;
			if (i < this.lightColour1Max)
			{
				lightColour = this.lightColour1;
			}
			else if (i < this.lightColour2Max)
			{
				lightColour = this.lightColour2;
			}
			else if (i < this.lightColour3Max)
			{
				lightColour = this.lightColour3;
			}

			this.lights[i] = {
				"colour" : lightColour,
				"x" : thisLightX,
				"y" : thisLightY,
				"radius" : this.lightRadius,
				"strokeStyle" : this.lightOutlineColor,
				"state" : "off"
			}
		}

		this.queue = new Array();
		this.interval = -1;
		this.curLightValue = -1;
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
	lights.prototype.flashUpTo = function(val) {
		var startVal = this.getValue();
		var limit = val || this.numberOfLights;
		for (var lightNum = startVal; lightNum <= limit; lightNum++) {
			pushMethod.call(this, setValue, lightNum);
		}
		this.curLightValue = limit;
	}
	lights.prototype.flashDownTo = function(val) {
		var startVal = this.getValue();
		var limit = val || 0;
		for (var lightNum = startVal; lightNum >= limit; lightNum--) {
			pushMethod.call(this, setValue, lightNum);
		}
		this.curLightValue = limit;
	}
	lights.prototype.flashTo = function(val) {
		val = Math.max(0, val);
		var currentVal = this.getValue();
		
		if (val > currentVal)
		{
			this.flashUpTo(val);
		}
		else if (val < currentVal)
		{
			this.flashDownTo(val);
		}
	}
	lights.prototype.changeValueBy = function(diff) {
		var curValue = this.getValue();
		var newValue = curValue + diff;
		this.flashTo(newValue);
	}
	lights.prototype.getValue = function() {
		return this.curLightValue;
	}
	lights.prototype.setValue = function(val) {
		setValue.call(this, val);
		this.redraw();
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
	
	window.LightMeter = lights;
		
})(jQuery, document, window);
