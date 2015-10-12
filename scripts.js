$('document').ready(function(){
	//Audio Setup
	var laser_sound = document.getElementById("lasersound");
	laser_sound.volume = 0.2;

	var click = document.getElementById("click");
		click.volume = 0.2;

	var boom = document.getElementById("boom");
		boom.volume = 0.05;

	preGameState();

	//This function runs through the menus before the game actually begins
	function preGameState(){
		$('menu').show();
		$('#ship1').hide();
		$('#ship2').hide();
		$('.alien').each(function(){
			$(this).hide();
		})
		$('#scoreboard').hide();

		$('#solo').on('click', function(){
			click.play();
			$('#menu').hide();
			inGameState();
			$('#ship1').show();
		})
		$('#team').on('click', function(){
			click.play();
			$('#menu').hide();
			inGameState();
			$('#ship1').show();
			$('#ship2').show();
		})
	}


//This code is for when the user is playing the game
function inGameState(){	
	$('#scoreboard').show();
	
	waveOne(); 
	//This variable controls the movement of the ships
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
		laser_sound.currentTime = 0;
		laser_sound.play();
	}

	//ship 2 laser
	function fire2(){
		var y = $('#ship2').position();
		$("body").append($("<div>").addClass("laser").css({top: y.top, left: y.left + 36}));
		laser_sound.currentTime = 0;
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
				if(checkCollision(laserCoordinates)){
					checkCollision();
					$(this).remove();
				}
			}else{
				$(this).remove();
			}
		});
	}


	//updates the score
	var score = 0;
	setInterval(updateScore,50);	

	function updateScore(){
		$('#score').text(score);
	}


	//Code to sense when the laser hits an alien ship
		//for each alien with class 'active', check coordinates.  
		// If laser is touching the alien, make it dissapear and return true
		// If not return false
	function checkCollision(object){
		var hit = null;
		$('.active').each(function(){
			var alienPos = $(this).position();
			var alienHeight = $(this).height();
			var alienWidth = $(this).width();
			if(alienPos.top <object.top && object.top < alienPos.top + alienHeight &&
				alienPos.left< object.left && object.left<alienPos.left + alienWidth){
					boom.currentTime=0;
					boom.play();
					$(this).hide();
					score += 10;
					var hit = true;
			}else{
				var hit = false;
			}
		})
		return hit;
	}





} //end of inGameState
	
	//Wave one
	function waveOne(){
		$('#a1').css({left: "50px"});
		$('#a2').css({left: "350px"});
		$('#a3').css({left: "650px"});
		$('.alien').each(function(){
			$(this).show();
		});
		$('#a1').animate({left: "900px"}, 3000);
		$('#a2').animate({left: "1200px"}, 3000);
		$('#a3').animate({left: "50px"}, 3000);

	}



});