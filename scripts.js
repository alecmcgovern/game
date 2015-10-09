$('document').ready(function(){

	//This code renders the ship to the canvas
 	

	//This Code controls the arrow key movement of the player's ship
	var position = $('#ship').position();
	var speed = 5;
	var c = document.getElementById('canvas');
	var ctx = c.getContext("2d");

	kd.run(function () {
  		kd.tick();
	});

	// kd.DOWN.down(function(){
	// 	console.log('key down pressed');
	// 	$('#ship').finish().animate({top: "+="+speed});
	// });
	// kd.UP.down(function(){
	// 	console.log('key down pressed');
	// 	$('#ship').finish().animate({top: "-="+speed});
	// });
	// kd.LEFT.down(function(){
	// 	console.log('key down pressed');
	// 	$('#ship').finish().animate({left: "-="+speed});
	// });
	// kd.RIGHT.down(function(){
	// 	console.log('key down pressed');
	// 	$('#ship').finish().animate({left: "+="+speed});
	// });

	var spaceShipImage = new Image();
	spaceShipImage.src = "spaceship_transparent.png"

	var render = function(){
		ctx.drawImage(spaceShipImage, 0, 0, 75, 50);
	};

	setInterval(render, 10);




});