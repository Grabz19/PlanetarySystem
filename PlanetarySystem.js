var PlanetarySystem = (function(window) {
	var DEG_TO_RAD = Math.PI / 180;
	
	//rotation speed is in deg/sec
	//rotation direction - true: clockwise, false: counterclockwise
	function Planet(name, image, distance, startingAngle, orbitSpeed, orbitDirection, width, height, startingRotation, rotationSpeed, rotationDirection, clickedCallback) {
		this.name = name;
		this.image = image;
		
		this.distance = distance;
		
		this.angle = startingAngle;
		this.orbitSpeed = orbitSpeed;
		this.orbitDirection = orbitDirection;
		
		this.width = width;
		this.height = height;
		
		this.rotation = startingRotation;
		this.rotationSpeed = rotationSpeed;
		this.rotationDirection = rotationDirection;
		
		this.x = 0;
		this.y = 0;
		
		this.clickedCallback = clickedCallback;
	}
	
	function PlanetarySystem(canvas) {
		var ctx = canvas.getContext("2d");
		
		canvas.style.backgroundColor = "black";

		canvas.style.width = "100%";
		canvas.style.height = "100%";
		
		var rect = canvas.getBoundingClientRect();
		canvas.width = rect.width;
		canvas.height = rect.height;
		
		var lastTimestamp = 0;
		var frameTime = 0;
		
		var planets = {};
		
		var mouseX = 0;
		var mouseY = 0;
		
		canvas.onclick = (function(e) {
			var name, planet;
			for(name in planets) {
				planet = planets[name];
				
				if(e.clientX > planet.x - planet.width  / 2 && e.clientX < planet.x + planet.width  / 2 &&
				   e.clientY > planet.y - planet.height / 2 && e.clientY < planet.y + planet.height / 2) {
					if(typeof planet.clickedCallback === "function")
						planet.clickedCallback();
				}
			}
		});
		
		canvas.onmousemove = (function(e) {
			mouseX = e.clientX;
			mouseY = e.clientY;
		});
		
		this.addPlanet = function(name, image, distance, startingAngle, orbitSpeed, orbitDirection, width, height, startingRotation, rotationSpeed, rotationDirection, clickedCallback) {
			planets[name] = new Planet(name, image, distance, startingAngle, orbitSpeed, orbitDirection, width, height, startingRotation, rotationSpeed, rotationDirection, clickedCallback);
		}
		 
		//clean up for object deletion
		this.dispose = function() {
			canvas.onclick = null;
		}
		
		function draw(timestamp) {
			frameTime = (timestamp - lastTimestamp) / 1000;
			lastTimestamp = timestamp;
			
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			
			var name, planet;
			for(name in planets) {
				planet = planets[name];
				
				if(planet.distance <= 0)
					continue;
				
				ctx.strokeStyle = "white";
				ctx.beginPath();
				ctx.arc(canvas.width / 2, canvas.height / 2, planet.distance * 2 + planet.width / 2, 0, 2 * Math.PI);
				ctx.stroke();
			}
			for(name in planets) {
				planet = planets[name];
				
				//center + radius + angle
				//center is the center of the canvas
				//radius is the distance from center to center origin of the planet
				//resetting the Math.cos to 0 instead of 1 if the planet has 0 distance aka. is a sun
				planet.x = (canvas.width / 2) + (planet.distance * 2 + planet.width / 2) * (planet.distance > 0 ? Math.cos(planet.angle * DEG_TO_RAD) : 0);
				planet.y = (canvas.height / 2) + (planet.distance * 2 + planet.height / 2) * Math.sin(planet.angle * DEG_TO_RAD);
				
				//console.log(planet.x, planet.y);
				
				if(planet.rotationDirection)
					planet.rotation += planet.rotationSpeed * DEG_TO_RAD * frameTime;
				else
					planet.rotation -= planet.rotationSpeed * DEG_TO_RAD * frameTime;
				
				if(planet.orbitDirection)
					planet.angle += planet.orbitSpeed * DEG_TO_RAD * frameTime;
				else
					planet.angle -= planet.orbitSpeed * DEG_TO_RAD * frameTime;
				
				if(planet.image) {
					ctx.translate(planet.x, planet.y);
					ctx.rotate(planet.rotation);
					ctx.drawImage(planet.image, -planet.width / 2, -planet.height / 2, planet.width, planet.height);
					ctx.rotate(-planet.rotation);
					ctx.translate(-planet.x, -planet.y);
				}
			}
			for(name in planets) {
				planet = planets[name];
				
				ctx.fillStyle = "white";
				ctx.fillText(planet.name, planet.x - ctx.measureText(planet.name).width / 2, planet.y - planet.height / 2 - 2);
			}
			
			for(name in planets) {
				planet = planets[name];
				
				if(mouseX > planet.x - planet.width  / 2 && mouseX < planet.x + planet.width  / 2 &&
				   mouseY > planet.y - planet.height / 2 && mouseY < planet.y + planet.height / 2) {
					
					ctx.strokeStyle = "yellow";
					ctx.beginPath();
					ctx.arc(planet.x, planet.y, planet.width / 2 + 16, 0, 2 * Math.PI);
					ctx.stroke();
				}
			}
			
			window.requestAnimationFrame(draw);
		}
		window.requestAnimationFrame(draw);
	}
	
	return PlanetarySystem;
})(window);


var canvas_planets = document.getElementById("canvas_planets");

var sun = new Image();
sun.src = "sun.png";

var earth = new Image();
earth.src = "earth.png";

var pluto = new Image();
pluto.src = "pluto.png";

var jupiter = new Image();
jupiter.src = "jupiter.png";

var sys = new PlanetarySystem(canvas_planets);

//addPlanet = function(name, image, distance, startingAngle, orbitSpeed, orbitDirection, width, height, startingRotation, rotationSpeed, rotationDirection) {
sys.addPlanet("Sun", sun, 0, 0, 0, true, 128, 128, 0, 5, true, function() {
	alert("Sun clicked!");
});
sys.addPlanet("Earth", earth, 40, 180, 100, true, 64, 64, 0, 10, true, function() {
	alert("Earth clicked!");
});
sys.addPlanet("Jupiter", jupiter, 85, 40, 180, true, 100, 100, 0, 14, true, function() {
	alert("Jupiter clicked!");
});
sys.addPlanet("Pluto", pluto, 140, 110, 300, true, 32, 32, 0, 20, true, function() {
	alert("Pluto clicked");
});

















