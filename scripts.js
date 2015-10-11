$('document').ready(function(){



	preGameState();

	//This function runs through the menus before the game actually begins
	function preGameState(){
		$('menu').show();
		$('#ship1').hide();
		$('#ship2').hide();

		$('#solo').on('click', function(){
			$('#menu').hide();
			inGameState();
			$('#ship1').show();
		})
		$('#team').on('click', function(){
			$('#menu').hide();
			inGameState();
			$('#ship1').show();
			$('#ship2').show();
		})
	}


	//This code is for when the user is playing the game
	function inGameState(){
	//This Code controls the movement of the ships
	var speed1 = 5;


	//This bit of code is needed to use the kd ("keydrown") attached library
	// found at https://jeremyckahn.github.io/keydrown/
	kd.run(function () {
 	 	kd.tick();
	});

	//This Code controls the arrow key movement of player  one's ship

	kd.DOWN.down(function(){
		if($('#ship1').position().top < 600) {
			$('#ship1').finish().animate({top: "+="+speed1});
		}
	});
	kd.UP.down(function(){
		if($('#ship1').position().top > 0) {
			$('#ship1').finish().animate({top: "-="+speed1});
		}
	});
	kd.LEFT.down(function(){
		if($('#ship1').position().left > 0) {
			$('#ship1').finish().animate({left: "-="+speed1});
		}
	});
	kd.RIGHT.down(function(){
		if($('#ship1').position().left < screen.width-100) {
			$('#ship1').finish().animate({left: "+="+speed1});
		}
	});


	//This Code controls the 'WASD' movement of player two's ship
	var speed2 = 5;

	kd.S.down(function(){
		if($('#ship2').position().top < 600) {
			$('#ship2').finish().animate({top: "+="+speed2});
		}
	});
	kd.W.down(function(){
		if($('#ship2').position().top > 0) {
			$('#ship2').finish().animate({top: "-="+speed1});
		}
	});
	kd.A.down(function(){
		if($('#ship2').position().left > 0) {
			$('#ship2').finish().animate({left: "-="+speed1});
		}
	});
	kd.D.down(function(){
		if($('#ship2').position().left < screen.width-100) {
			$('#ship2').finish().animate({left: "+="+speed1});
		}
	});	

	//This code fires the lasers
	var laser_speed = 20;
	var laser_sound = document.getElementById("lasersound");
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
		$("body").append($("<div>").addClass("laser").css({top: x.top, left: x.left + 36}));
		laser_sound.play();
	}

	//ship 2 laser
	function fire2(){
		var y = $('#ship2').position();
		$("body").append($("<div>").addClass("laser").css({top: y.top, left: y.left + 36}));
		laser_sound.play();
	}

	//udate all laser positions
	setInterval(updateLaserPosition, 20);

	function updateLaserPosition(){
		$('.laser').each(function(){
			var oldHeight = $(this).offset().top;
			if (oldHeight>0){
				$(this).css("top", oldHeight-laser_speed);
				var laserCoordinates = $(this).position();
				console.log(laserCoordinates);
				if(checkCollision(laserCoordinates)){
					$(this).remove();
				}
			}else{
				$(this).remove();
			}
		});
	}
	
	//Code to sense when the laser hits a ship
	function checkCollision(object){
		//for each alien with class active, check laser coordinates.  
		// If touching an alien, make it dissapear and return true
		// If not return false
	}

	// function updateAlienPosition(){
	// 	$(.active).each(function(){
	// 		$(this).animate()

	// 	});
	// }
	} //end of inGameState
	



});