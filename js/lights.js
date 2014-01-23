(function($, document, window) {
	"use strict"

	var lights = function()
	{
		this.CANVAS_ID = "lightsCanvas";
		this.CANVAS_WIDTH = 20;
		this.CANVAS_HEIGHT = 365;
		this.CANVAS_WRAPPER_ID = "lightsCanvasWrapper";
		this.NUMBER_OF_LIGHTS = 11;
		this.LIGHT_RADIUS = 10;
		this.LIGHT_PADDING = 12;
		this.UPDATE_INTERVAL = 100;
	
		this.logEnabled = true;
		
		this.lights = new Array();
		for (var i = 0; i < this.NUMBER_OF_LIGHTS; i++) {
			var thisLightX = this.CANVAS_WIDTH / 2;
			var thisLightY = ( i * this.LIGHT_PADDING) + ( (i+1) * this.LIGHT_RADIUS * 2);
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

			this.lights[this.NUMBER_OF_LIGHTS - i - 1] = {
				"colour" : lightColour,
				"x" : thisLightX,
				"y" : thisLightY,
				"radius" : this.LIGHT_RADIUS,
				"strokeStyle" : "#000",
				"state" : "off"
			}
		}

		this.queue = new Array();
		this.interval = -1;
		this.endOfQueueValue = -1;
	}
	lights.prototype._processQueue = function() {
		if (this.queue.length > 0) {
			var method = this.queue.shift();
			if (method) {
				method.bind(this).call();
				this.draw();
			}
		} else {
			this._stopProcessing();
		}
	}
	lights.prototype._startProcessing = function() {
		this.draw();
		if (this.interval == -1) {
			this.interval = setInterval(this._processQueue.bind(this), this.UPDATE_INTERVAL);
		}
	}
	lights.prototype._stopProcessing = function() {
		if (this.interval != -1) {
			clearInterval(this.interval)
			this.interval = -1;
		}
	}
	lights.prototype._pushMethod = function(fn, params) {
		this.queue.push( function() {
	    	fn.bind(this).apply(window, params);
		});
		this._startProcessing();
	}
	lights.prototype._setValue = function(value) {
		var theValue = value || 0;
		theValue = (theValue < 0) ? 0 : theValue;
		for (var lightNum = 0; lightNum < this.lights.length; lightNum++) {
			var light = this.lights[lightNum];
			light.state = (lightNum < value) ? "on" : "off";
		}
	}
	lights.prototype._setEndOfQueueValue = function(val) {
		this.endOfQueueValue = val;
	}
	lights.prototype.draw = function() {
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
	lights.prototype._noop = function() { }

	lights.prototype.setInterval = function(interval) {
		this._pushMethod(function() {
			this.UPDATE_INTERVAL = interval;
			this._stopProcessing();
			this._startProcessing();
		}, []);
	}
	lights.prototype.getInterval = function() {
		return this.UPDATE_INTERVAL;
	}
	lights.prototype.pauseFor = function(val) {
		for (var i = 0; i < val; i++) {
			this._pushMethod(this._noop, []);
		}
	}
	lights.prototype.flashUpTo = function(start, val) {
		var limit = val || this.NUMBER_OF_LIGHTS;
		var startVal = start || 0;
		for (var lightNum = startVal; lightNum <= limit; lightNum++) {
			this._pushMethod( this._setValue, [lightNum]);
		}
		this._setEndOfQueueValue(limit);
	}
	lights.prototype.flashDownTo = function(start, val) {
		var limit = (val || 0);
		var startVal = (start!=undefined) ? start : this.NUMBER_OF_LIGHTS -1;
		for (var lightNum = startVal; lightNum >= limit; lightNum--) {
			this._pushMethod( this._setValue, [lightNum]);
		}
		this._setEndOfQueueValue(limit);
	}
	lights.prototype.flashTo = function(start, val) {
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

	lights.prototype.init = function() {
		$("<canvas id='"+this.CANVAS_ID+"' width='"+this.CANVAS_WIDTH+
			"' height='"+this.CANVAS_HEIGHT+"'></canvas>")
			.appendTo("#"+this.CANVAS_WRAPPER_ID);
		this.canvasElement = $("#"+this.CANVAS_ID);

		this._startProcessing();
		this.pauseFor(2);
		var oldInterval = this.getInterval();
		this.setInterval(30);
		this.flashUpTo();
		this.flashDownTo();
		this.setInterval(oldInterval);
	}

	window.lights = new lights();
	
})(jQuery, document, window);
