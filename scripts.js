$('document').ready(function(){



	//This Code controls the arrow key movement of player  one's ship

	var speed1 = 5;

	kd.run(function () {
 	 	kd.tick();
	});


	kd.DOWN.down(function(){
		$('#ship1').finish().animate({top: "+="+speed1});
	});
	kd.UP.down(function(){
		$('#ship1').finish().animate({top: "-="+speed1});
	});
	kd.LEFT.down(function(){
		$('#ship1').finish().animate({left: "-="+speed1});
	});
	kd.RIGHT.down(function(){
		$('#ship1').finish().animate({left: "+="+speed1});
	});



	//This Code controls the 'WASD' movement of player two's ship
	var speed2 = 5;

	kd.S.down(function(){
		$('#ship2').finish().animate({top: "+="+speed2});
	});
	kd.W.down(function(){
		$('#ship2').finish().animate({top: "-="+speed2});
	});
	kd.A.down(function(){
		$('#ship2').finish().animate({left: "-="+speed2});
	});
	kd.D.down(function(){
		$('#ship2').finish().animate({left: "+="+speed2});
	});

	


	//This code fires the lasers
	var laser_speed = 10;

	$(document).keydown(function(e){
		e.preventDefault();
		if (e.which === 32){
			fire1();
		}
		if (e.which === 16){
			fire2();
		}
	});
	//ship1 laser 
	function fire1(){
		var x = $('#ship1').position();
		$("body").append($("<div>").addClass("laser").css({top: x.top, left: x.left + 50}));
	}

	//ship 2 laser
	function fire2(){
		var y = $('#ship2').position();
		$("body").append($("<div>").addClass("laser").css({top: y.top, left: y.left + 50}));
	}

	//udate all laser positions
	setInterval(updateLaserPosition, 30);

	function updateLaserPosition(){
		$('.laser').each(function(){
			var oldHeight = $(this).offset().top;
			if (oldHeight>0){
				$(this).css("top", oldHeight-laser_speed);
			}else{
				$(this).remove();
			}

		});
	}
	


});