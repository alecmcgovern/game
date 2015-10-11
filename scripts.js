$('document').ready(function(){



	//This Code controls the arrow key movement of player  one's ship

	var position = $('#ship1').position();
	var speed1 = 5;

	kd.run(function () {
 	 	kd.tick();
	});


	kd.DOWN.down(function(){
		console.log('key down pressed');
		$('#ship1').finish().animate({top: "+="+speed1});
	});
	kd.UP.down(function(){
		console.log('key down pressed');
		$('#ship1').finish().animate({top: "-="+speed1});
	});
	kd.LEFT.down(function(){
		console.log('key down pressed');
		$('#ship1').finish().animate({left: "-="+speed1});
	});
	kd.RIGHT.down(function(){
		console.log('key down pressed');
		$('#ship1').finish().animate({left: "+="+speed1});
	});



	//This Code controls the 'WASD' movement of player two's ship
	var position = $('#ship2').position();
	var speed2 = 5;



	kd.S.down(function(){
		console.log('key down pressed');
		$('#ship2').finish().animate({top: "+="+speed2});
	});
	kd.W.down(function(){
		console.log('key down pressed');
		$('#ship2').finish().animate({top: "-="+speed2});
	});
	kd.A.down(function(){
		console.log('key down pressed');
		$('#ship2').finish().animate({left: "-="+speed2});
	});
	kd.D.down(function(){
		console.log('key down pressed');
		$('#ship2').finish().animate({left: "+="+speed2});
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