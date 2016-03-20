/*
Logic for the simulated annealing
Author: Souradeep Nanda
*/

var SimulatedAnnealing = function(x,k,T){
	this.x = x; // Starting state
	this.k = k; // Boltzmann constant
	this.T = T; // Initial temperature
	
	this.anneal = function(f){
		if(this.T == 0) return x;
		var new_x = this.getRandomInt(0,f.length);	 
		
		if(f[new_x] > f[x]){
			// If the new chosen value is better
			// then just move to new state
			x = new_x;
		} else {
			// Calculate probability of transfer
			var p = Math.exp((f[new_x] - f[x])/(k * T));
			// If a randomly chosen value is within p
			// then move to the new state
			if(Math.random() < p)
				x = new_x;		
		}
		this.T--;
		return x;
	}
	
	this.getRandomInt = function(min, max) {
		return Math.floor(Math.random() * (max - min)) + min;
	}	
}

// Canvas controller for simulated annealing visualization
$(document).ready(function(){	
	var annealingCanvas;
	var text,line,background;
	var w,h;
	var two;
	var sa;
	
	var x = 0; // Current Index
	var f; // The objective function
	
	var DELAY = 1 * 60;
	var POINTS = 30; // Number of points of the objective function
	var INITIAL_TEMP = 50;
	var K = 1; // Boltzmann constant
	
	function init(){
		annealingCanvas = document.getElementById("annealingCanvas");
		annealingCanvas.addEventListener("click", handleClick, false);
		w = annealingCanvas.offsetWidth;
		h = 300;
		two = new Two({ width: w, height: h }).appendTo(annealingCanvas);
		sa = new SimulatedAnnealing(x,K,INITIAL_TEMP);
		text = two.makeText("Temperature: "+INITIAL_TEMP,w/2 ,10,'normal');
		line = two.makeLine(x,0,x,h);
		line.stroke = 'orangered';
		line.linewidth = 5;
		setupScene();
	}
	
	init();
	
	two.bind('update', function(frameCount){
		if(frameCount % DELAY == 0){
			x = sa.anneal(f);
			// Translate the point according to the new chosen point
			line.translation.set(x*w/POINTS,h/2);
			y = Math.round(f[x]*100)/100;
			text.value = "Temperature: "+sa.T + " ("+x+" , "+y+")";
		}
	}).play();
	
	function handleClick(){
		// When ever the canvas is clicked
		// recalculate and redraw the background
		// and reinitialize the sa object
		setupScene();
		x = 0;
		sa = new SimulatedAnnealing(x,K,INITIAL_TEMP);
	}
	
	function setupScene(){
		// If background already exists,
		// then clear it
		if(background != null)
			two.remove(background);
		f = new Array(POINTS);
		background = new Array(POINTS-1);
		f[0] = 0;
		for(var i = 1; i < f.length; i++){
			// f[i] ranges between 0 and 3*h/4
			f[i] = Math.random() * 3*h/4;
			sx = (i-1) * w/POINTS;
			sy = h - f[i-1];
			fx = i * w/POINTS;
			fy = h - f[i];
			// Draw lines connecting all f[i]
			background[i-1] = two.makeLine(sx,sy,fx,fy);
			background[i-1].linewidth = 2;
			background[i-1].stroke = '#090A3B';
		}	
		two.update();
	}
	
});