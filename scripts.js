$('document').ready(function(){



	//This Code controls the arrow key movement of the player's ship

	var position = $('#ship').position();
	var speed = 5;

	kd.run(function () {
 	 		kd.tick();
	});


	kd.DOWN.down(function(){
		console.log('key down pressed');
		$('#ship').finish().animate({top: "+="+speed});
	});
	kd.UP.down(function(){
		console.log('key down pressed');
		$('#ship').finish().animate({top: "-="+speed});
	});
	kd.LEFT.down(function(){
		console.log('key down pressed');
		$('#ship').finish().animate({left: "-="+speed});
	});
	kd.RIGHT.down(function(){
		console.log('key down pressed');
		$('#ship').finish().animate({left: "+="+speed});
	});





	// var events = {};
	// var spaceship = {x:0, y:0, speed: 1};

	// var spaceShipImage = new Image();
	// // var background = new Image();
	// spaceShipImage.src = "spaceship_transparent.png";
	// // background.src = "transparent_background.png";


	// document.addEventListener("keydown", function(e){events[e.keyCode]=true;}, false);
	// document.addEventListener("keyup", function(e){delete events[e.keyCode]}, false);

	

	// var render = function(){
	// 	c.clearRect(0, 0, c.width, c.height);
	// 	ctx.drawImage(spaceShipImage, spaceship.x, spaceship.y, 75, 50);

	// 	if(37 in events){
	// 		spaceship.x -= spaceship.speed;
	// 	}
	// 	if(38 in events){
	// 		spaceship.y -= spaceship.speed;
	// 	}
	// 	if(39 in events){
	// 		spaceship.x += spaceship.speed;
	// 	}
	// 	if(40 in events){
	// 		spaceship.y += spaceship.speed;
	// 	}



	// };

	// setInterval(render, 10);




});