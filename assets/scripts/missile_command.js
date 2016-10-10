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
var missiles = [];
var missilesNum = 15;
var velocity = 3;

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

	$('#game').click(function(event){
		//console.log(event);
		//var posX = $(this).position().left;
		//var posY = $(this).position().top;
		//console.log('posX '+posX+" posY "+posY);
	    var rect = canvas.getBoundingClientRect();
	    var x = event.clientX - rect.left;
	    var y = event.clientY - rect.top;
	    if (missilesNum > 0){
	    	shoot(x,y);
	    }
	});
};

var shoot = function(x, y){
	//choose start point
	console.log("x: " + x + " y: " + y);
	var startX;
	var startY = rocketLaunchers[0].by;
	if( rocketLaunchers.length > 1){
		if( x < (rocketLaunchers[0].bx + rocketLaunchers[1].bx)/2){
			startX  = rocketLaunchers[0].bx;
		} else {
			startX = rocketLaunchers[1].bx;
		}
	} 
	if (rocketLaunchers.length > 2){
		if( x < (rocketLaunchers[1].bx + rocketLaunchers[2].bx)/2){
				if( x < (rocketLaunchers[0].bx + rocketLaunchers[1].bx)/2){
					startX  = rocketLaunchers[0].bx;
				} else {
					startX = rocketLaunchers[1].bx;
				}
		} else{
			startX = rocketLaunchers[2].bx;
		}		
	}
	console.log("startx: "+startX+" starty: "+startY);
	var difx = x - startX;
	var dify = y - startY;

	//var velx = Math.sqrt((Math.pow(difx,2))/(Math.pow(difx,2)+Math.pow(dify,2)))*velocity;
	//var vely = Math.sqrt((Math.pow(dify,2))/(Math.pow(difx,2)+Math.pow(dify,2)))*velocity;

	var velx = difx/(Math.abs(difx) + Math.abs(dify))*velocity;
	var vely = dify/(Math.abs(difx) + Math.abs(dify))*velocity;

	console.log("velx: "+velx+" vely: "+vely);

	missiles.push({'startX':startX, 'startY':startY, 'velx':velx, 'vely':vely, 'x':startX, 'y':startY});
	missilesNum -= 1;
}

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
	//draw cities
	for(var i = 0; i < cities.length; i++){
		context.fillStyle = "blue";
		context.fillRect(cities[i].ax, cities[i].ay, cities[i].height, cities[i].width);		
	}
	//draw missiles
	for(var i = 0; i < missiles.length; i++){
		if(missiles[i].x > canvas.width || missiles[i].x < 0 || missiles[i].y < 0){
			missiles.splice(i, 1);
		} else {
			console.log("draw");
			context.strokeStyle = "white";
			context.beginPath();
			context.moveTo(missiles[i].startX,missiles[i].startY);
			context.lineTo(missiles[i].x,missiles[i].y);
			context.stroke();

			missiles[i].x += missiles[i].velx;
			missiles[i].y += missiles[i].vely;
		}
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