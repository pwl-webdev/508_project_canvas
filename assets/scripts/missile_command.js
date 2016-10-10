$(document).ready(function(){
	console.log("ready");
	setup();
	window.requestAnimFrame(gameLoop);
});

var canvas = document.getElementById('game');
	canvas.width = 500;
	canvas.height = 500;
var context = canvas.getContext('2d');
var enemies = [];
var enemiesNum = 10;
var cities = [];
var citiesNum = 6;
var rocketLaunchers = [];
var rocketLaunchersNum = 3;

var gameLoop = function(){
	window.requestAnimFrame(gameLoop);
	draw();
}

var setup = function(){
	//create rocketLaunchers
	rocketLaunchers.push({'ax': 10, 'ay': 470, 'bx': 30, 'by': 440, 'cx': 50, 'cy': 470});
	rocketLaunchers.push({'ax': 230, 'ay': 470, 'bx': 250, 'by': 440, 'cx': 270, 'cy': 470});
	rocketLaunchers.push({'ax': 450, 'ay': 470, 'bx': 470, 'by': 440, 'cx': 490, 'cy': 470});

	//create cities
	cities.push({'ax': 70, 'ay': 475, 'height': 30, 'width': 20});
	cities.push({'ax': 120, 'ay': 475, 'height': 30, 'width': 20});
	cities.push({'ax': 170, 'ay': 475, 'height': 30, 'width': 20});
	cities.push({'ax': 290, 'ay': 475, 'height': 30, 'width': 20});
	cities.push({'ax': 350, 'ay': 475, 'height': 30, 'width': 20});
	cities.push({'ax': 410, 'ay': 475, 'height': 30, 'width': 20});
};

var draw = function(){
	context.fillStyle = "black";
	context.fillRect(0,0,canvas.width, canvas.height);

	//draw ground level
	context.fillStyle = "yellow";
	context.fillRect(0,canvas.height-30,canvas.width,canvas.height);
	
	//draw rocketLaunchers
	for (var i = 0; i < rocketLaunchers.length; i++){
		context.fillStyle = "orange";
		context.beginPath();
		context.moveTo(rocketLaunchers[i].ax,rocketLaunchers[i].ay);
		context.lineTo(rocketLaunchers[i].bx,rocketLaunchers[i].by);
		context.lineTo(rocketLaunchers[i].cx,rocketLaunchers[i].cy);
		context.fill();
	}

	for(var i = 0; i < cities.length; i++){
		context.fillStyle = "blue";
		context.fillRect(cities[i].ax, cities[i].ay, cities[i].height, cities[i].width);		
	}
}

// shim layer with setTimeout fallback 
window.requestAnimFrame = (function(){
return  window.requestAnimationFrame       ||            
   		window.webkitRequestAnimationFrame ||            
   		window.mozRequestAnimationFrame    ||            
   		window.oRequestAnimationFrame      ||            
   		window.msRequestAnimationFrame     ||            
   		function( callback ){             
   			window.setTimeout(callback, 1000 / 60);           
   		}; 
})(); 