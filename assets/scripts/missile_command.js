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
var enemyInterval = 200;
var nextEnemy = Math.floor(Math.random()*enemyInterval + 800);
var enemyVelocity = 1;
var enemyXFactor = 0.8;
var enemyExplosions = [];
var enemyExplosionsRadius = 20;
var enemyExplosionStep = 1;
var cities = [];
var citiesNum = 6;
var rocketLaunchers = [];
var rocketLaunchersNum = 3;
var missiles = [];
var explosions = [];
var explosionsRadius = 20;
var explosionStep = 1;
var missilesNum = 15;
var velocity = 3;
var tick = 0;

var gameLoop = function(){
	window.requestAnimFrame(gameLoop);
	draw();
	drawText();
	generateEnemies();
	detectCollisions();
}

var setup = function(){
	//create rocketLaunchers
	rocketLaunchers.push({'ax': 10, 'ay': 470, 'bx': 30, 'by': 440, 'cx': 50, 'cy': 470});
	rocketLaunchers.push({'ax': 230, 'ay': 470, 'bx': 250, 'by': 440, 'cx': 270, 'cy': 470});
	rocketLaunchers.push({'ax': 450, 'ay': 470, 'bx': 470, 'by': 440, 'cx': 490, 'cy': 470});

	//create cities
	cities.push({'ax': 70, 'ay': 475, 'height': 15, 'width': 40});
	cities.push({'ax': 120, 'ay': 475, 'height': 15, 'width': 40});
	cities.push({'ax': 170, 'ay': 475, 'height': 15, 'width': 40});
	cities.push({'ax': 290, 'ay': 475, 'height': 15, 'width': 40});
	cities.push({'ax': 350, 'ay': 475, 'height': 15, 'width': 40});
	cities.push({'ax': 410, 'ay': 475, 'height': 15, 'width': 40});

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

var detectCollisions = function(){
	for(var i = 0; i < enemies.length; i++){
	//enemy - cities collisions
		for(var j = 0; j < cities.length; j++){
			if(enemies[i].x >= cities[j].ax &&
			   enemies[i].x <= (cities[j].ax+cities[j].width) &&
			   enemies[i].y >= cities[j].ay &&
			   enemies[i].y <= (cities[j].ay+cities[j].height)){
			   		explodeEnemies(enemies[i].x, enemies[i].y);
					cities.splice(j,1);
					enemies.splice(i,1);
					i = i - 1;
					j = j - 1;
					console.log("city destroyed");
			}
		}
	}
	for(var i = 0; i < enemies.length; i++){
		//enemy - rocket launchers collisions
		for(var j = 0; j < rocketLaunchers.length; j++){
			if(enemies[i].x >= rocketLaunchers[j].ax &&
			   enemies[i].x <= (rocketLaunchers[j].cx) &&
			   enemies[i].y >= rocketLaunchers[j].by &&
			   enemies[i].y <= (rocketLaunchers[j].cy)){
			   		explodeEnemies(enemies[i].x, enemies[i].y);
					rocketLaunchers.splice(j,1);
					enemies.splice(i,1);
					i = i-1;
					j = j-1;
					console.log("rocketLauncher destroyed");
			}
		}
	}
	for(var i = 0; i < enemies.length; i++){
	//enemy - missiles collisions
		for(var j = 0; j < explosions.length; j++){
			if(enemies[i].x >= (explosions[j].x - explosions[j].radius) &&
			   enemies[i].x <= (explosions[j].x + explosions[j].radius) &&
			   enemies[i].y >= (explosions[j].y - explosions[j].radius) &&
			   enemies[i].y <= (explosions[j].y + explosions[j].radius)){
			   		explodeEnemies(enemies[i].x, enemies[i].y);
					enemies.splice(i,1);
					i = i - 1;
					j = j - 1;
					console.log("enemy shoot down");
			}
		}
	}
}

var explodeEnemies = function(x, y){
	enemyExplosions.push({'x':x, 'y':y, 'radius':0});
}

var shoot = function(x, y){
	//choose start point
	//console.log("x: " + x + " y: " + y);
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
	if (rocketLaunchers.length == 1){
		startX = rocketLaunchers[0].bx;
	}
	//console.log("startx: "+startX+" starty: "+startY);
	var difx = x - startX;
	var dify = y - startY;

	//var velx = Math.sqrt((Math.pow(difx,2))/(Math.pow(difx,2)+Math.pow(dify,2)))*velocity;
	//var vely = Math.sqrt((Math.pow(dify,2))/(Math.pow(difx,2)+Math.pow(dify,2)))*velocity;

	var velx = difx/(Math.abs(difx) + Math.abs(dify))*velocity;
	var vely = dify/(Math.abs(difx) + Math.abs(dify))*velocity;

	//console.log("velx: "+velx+" vely: "+vely);

	missiles.push({'startX':startX, 'startY':startY, 'velx':velx, 'vely':vely, 'x':startX, 'y':startY, 'endX':x, 'endY':y});
	missilesNum -= 1;
}

var drawText = function(){
	
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
		context.moveTo(rocketLaunchers[i].ax,rocketLaunchers[i].ay)
		context.beginPath();
		context.moveTo(rocketLaunchers[i].ax,rocketLaunchers[i].ay);
		context.lineTo(rocketLaunchers[i].bx,rocketLaunchers[i].by);
		context.lineTo(rocketLaunchers[i].cx,rocketLaunchers[i].cy);
		context.fillStyle = "orange";
		context.fill();
	}
	//draw cities
	for(var i = 0; i < cities.length; i++){
		context.fillStyle = "blue";
		context.fillRect(cities[i].ax, cities[i].ay, cities[i].width, cities[i].height);		
	}
	//draw missiles
	for(var i = 0; i < missiles.length; i++){
		if(missiles[i].x > canvas.width || missiles[i].x < 0 || missiles[i].y < 0){
			missiles.splice(i, 1);
		} else  if (missiles[i].y < missiles[i].endY) {
			explode(missiles[i].x, missiles[i].y);
			missiles.splice(i, 1);
			//animate explosion
		}
		else{
			//console.log("draw");
			context.strokeStyle = "white";
			context.beginPath();
			context.moveTo(missiles[i].startX,missiles[i].startY);
			context.lineTo(missiles[i].x,missiles[i].y);
			context.stroke();

			missiles[i].x += missiles[i].velx;
			missiles[i].y += missiles[i].vely;
		}
	}
	//draw explosions
	for(var i = 0; i < explosions.length; i++){
		if(explosions[i].radius > explosionsRadius){
			explosions.splice(i, 1);
		} else{ 
			context.fillStyle = "orange";
			explosions[i].radius += explosionStep;
			context.moveTo(explosions[i].x,explosions[i].y);
			context.arc(explosions[i].x, explosions[i].y, explosions[i].radius, 0 ,Math.PI*2,false);
			context.fill();
		}
	}

	//draw enemies
	for(var i = 0; i < enemies.length; i++){
		if(enemies[i].y > canvas.height){
			enemies.splice(i, 1);
		} else{
			//console.log("draw");
			context.strokeStyle = "red";
			context.beginPath();
			context.moveTo(enemies[i].startX,enemies[i].startY);
			context.lineTo(enemies[i].x,enemies[i].y);
			context.stroke();

			enemies[i].x += enemies[i].velX;
			enemies[i].y += enemies[i].velY;			
		}
	}

	//draw enemies explosions
	for(var i = 0; i < enemyExplosions.length; i++){
		if(enemyExplosions[i].radius > enemyExplosionsRadius){
			enemyExplosions.splice(i, 1);
		} else{ 
			context.fillStyle = "white";
			enemyExplosions[i].radius += enemyExplosionStep;
			context.moveTo(enemyExplosions[i].x,enemyExplosions[i].y);
			context.arc(enemyExplosions[i].x, enemyExplosions[i].y, enemyExplosions[i].radius, 0 ,Math.PI*2,false);
			context.fill();
		}
	}
}

var generateEnemies = function(){
	if (tick % nextEnemy == 0 && enemiesNum > 0){
		shootEnemies();
		//console.log("shoot enemy");
		nextEnemy = Math.floor(Math.random()*enemyInterval + 800)
		//console.log(tick+" "+nextEnemy);
	}

	tick += 1;
}
var shootEnemies = function(){
	var x = Math.random()*canvas.width;
	var velX = (Math.random() - 0.5)*enemyXFactor;
	if( x < 200 && velX < 0 )
		velX = velX*(-1);
	if( x > 300 && velX > 0)
		velX = velX*(-1);
	var velY = enemyVelocity - Math.abs(velX);
	enemies.push({'startX':x, 'startY':0, 'x':x, 'y': 0, 'velX':velX, 'velY':velY});
	enemiesNum = enemiesNum - 1;
	//console.log("enemy x: "+x+" velx "+velX+" velY "+velY);
}

var explode = function(x, y){
	explosions.push({'x':x, 'y':y, 'radius':0});
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