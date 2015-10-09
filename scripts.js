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


	//This code is to sense when the ship is touching any of the boxes





});