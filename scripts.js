$('document').ready(function(){
	//Audio Setup
	var spacemen = document.getElementById("spacemen");
	spacemen.volume = 1.0;

	var laser_sound = document.getElementById("lasersound");
	laser_sound.volume = 0.2;

	var click = document.getElementById("click");
	click.volume = 0.2;

	var boom = document.getElementById("boom");
	boom.volume = 0.05;

	var effects_volume = 1;
	var music_volume = 1;

	$('#effectsVol').on('click', function(){
		if(effects_volume===1){
			$('#effectsVol').css({color: "grey"});
			laser_sound.volume = 0.0;
			click.volume = 0.0;
			boom.volume = 0.0;
			effects_volume = 0;
		}else{
			$('#effectsVol').css({color: "#00ffff"});
			laser_sound.volume = 0.2;
			click.volume = 0.2;
			boom.volume = 0.05;
			effects_volume = 1;
		}
	});

	$('#musicVol').on('click', function(){
		if(music_volume===1){
			$('#musicVol').css({color: "grey"});
			spacemen.volume = 0.0;
			music_volume = 0;
		}else{
			$('#musicVol').css({color: "#00ff00"});
			spacemen.volume = 1.0;
			music_volume = 1;
		}
	});

	var numPlayers = 0;
	var player1active = 0;
	var player2active = 0;
	var player1Lives = 3;
	var player2Lives = 3;
	var speed1 = 5;
	var speed2 = 5;
	var laser_speed = 20;
	preGameState();
	


	//This function runs through the menu before the game actually begins
	function preGameState(){
		$('.lives1').hide();
		$('.lives2').hide();
		$('#left').hide();
		$('#right').hide();
		$('#ship1').hide();
		$('#ship2').hide();
		$('.alien').each(function(){
			$(this).hide();
		})
		$('#scoreboard').hide();
		$('#level').hide();
		$('#menu').show();

		$('#solo').on('click', function(){
			click.play();
			$('#menu').hide();
			numPlayers = 1;
			setup1();
			inGameState();
		})
		$('#team').on('click', function(){
			click.play();
			$('#menu').hide();
			numPlayers = 2;
			setup2();
			inGameState();
		})
	}


	//sets up game states for one player and two player
	function setup1(){
		speed1 = 5;
		player1Lives = 3;
		player1active = 1;
		$('#ship1').css({top: "500px", left: "80%"});
		$('#ship1').show();
		$('.lives1').show();
	}

	function setup2(){
		speed1 = 5;
		speed2 = 5;
		player1Lives = 3;
		player2Lives = 3;
		player1active = 1;
		player2active = 1;
		$('#ship1').css({top: "500px", left: "80%"});
		$('#ship1').show();
		$('#ship2').css({top: "500px", left: "10%"});
		$('#ship2').show();
		$('.lives1').show();
		$('.lives2').show();
	}

	//This bit of code is needed to use the kd ("keydrown") attached library
	kd.run(function () {
 	 	kd.tick();
	});

	//This Code controls the arrow key movement of player  one's ship
	kd.DOWN.down(function(){
		if($('#ship1').position().top < 540 && player1active===1) {
			$('#ship1').finish().animate({top: "+="+speed1});
		}
	});
	kd.UP.down(function(){
		if($('#ship1').position().top > 0 && player1active===1) {
			$('#ship1').finish().animate({top: "-="+speed1});
		}
	});
	kd.LEFT.down(function(){
		if($('#ship1').position().left > 120 && player1active===1) {
			$('#ship1').finish().animate({left: "-="+speed1});
		}
	});
	kd.RIGHT.down(function(){
		if($('#ship1').position().left < screen.width-220 && player1active===1) {
			$('#ship1').finish().animate({left: "+="+speed1});
		}
	});

	//This Code controls the 'WASD' movement of player two's ship
	kd.S.down(function(){
		if($('#ship2').position().top < 540 && player2active===1) {
			$('#ship2').finish().animate({top: "+="+speed2});
		}
	});
	kd.W.down(function(){
		if($('#ship2').position().top > 0 && player2active===1) {
			$('#ship2').finish().animate({top: "-="+speed2});
		}
	});
	kd.A.down(function(){
		if($('#ship2').position().left > 120 && player2active===1) {
			$('#ship2').finish().animate({left: "-="+speed2});
		}
	});
	kd.D.down(function(){
		if($('#ship2').position().left < screen.width-220 && player2active===1) {
			$('#ship2').finish().animate({left: "+="+speed2});
		}
	});	

	//updates the score
	var score = 0;
	setInterval(updateScore,50);	

	function updateScore(){
		$('#score').text(score);
	}


	//This code fires the lasers
	$(document).keydown(function(e){
		e.preventDefault();
		if (e.which === 32){
			fire1();
		}
		if(numPlayers===2){
			if (e.which === 16){
				fire2();
			}
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

	//Code to sense when the laser hits an alien ship
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
					$(this).removeClass("active");
					$(this).hide();
					score += 10;
					var hit = true;
			}else{
				var hit = false;
			}
		})
		return hit;
	}

	//This checks to see if the aliens hit either player
		setInterval(checkDamage, 20);
		var regenerating1 = 0;
		var regenerating2 = 0;

		function checkDamage(){
			$('.active').each(function(){
				var alienPos = $(this).position();
				var alienHeight = $(this).height();
				var alienWidth = $(this).width();
				var player1Pos = $('#ship1').position();
				var player2Pos = $('#ship2').position();
				console.log("checking for damage");
				if (player1Pos.top < alienPos.top + alienHeight  &&
					alienPos.top  < player1Pos.top + $('#ship1').height() &&
					player1Pos.left < alienPos.left + alienWidth &&
					alienPos.left < player1Pos.left + $('#ship1').width()){
						if (regenerating1===0){
							regenerating1=1;
							$(this).removeClass("active");
							$(this).hide();
							player1LifeLoss();
						}
				}
				if (player2Pos.top < alienPos.top + alienHeight  &&
					alienPos.top  < player2Pos.top + $('#ship2').height() &&
					player2Pos.left < alienPos.left + alienWidth &&
					alienPos.left < player2Pos.left + $('#ship2').width()){
						if(regenerating2===0){
							regenerating2=1;
							$(this).removeClass("active");
							$(this).hide();
							player2LifeLoss();
						}
				}
			});
		}

		//This takes away a life when player's ship is hit
		function player1LifeLoss () {
			boom.play();
			if(player1Lives===3){
				$('#life11').hide();
				player1Lives=2;
			}
			else if(player1Lives===2){
				$('#life12').hide();
				player1Lives=1;
			}
			else if(player1Lives===1){
				$('#life13').hide();
				player1Lives=0;
				gameOver();
			}
			$('#ship1').css('opacity', '0');
			var handle = setInterval(function(){
				$('#ship1').css('opacity', '1');
				setTimeout(function(){
					$('#ship1').css('opacity', '0');
				}, 200);
			}, 400);

			setTimeout(clear, 3200);

			function clear() {
				clearInterval(handle);
				$('#ship1').css('opacity', '1');
				regenerating1 = 0;
			}
		}


		function player2LifeLoss (){
			boom.play();
			if(player2Lives===3){
				$('#life21').hide();
				player2Lives=2;
			}
			else if(player2Lives===2){
				$('#life22').hide();
				player2Lives=1;
			}
			else if(player2Lives===1){
				$('#life23').hide();
				player2Lives=0;
				gameOver();
			}
			$('#ship2').css('opacity', '0');
			var handle = setInterval(function(){
				$('#ship2').css('opacity', '1');
				setTimeout(function(){
					$('#ship2').css('opacity', '0');
				}, 200);
			}, 400);

			setTimeout(clear2, 3200);

			function clear2() {
				clearInterval(handle);
				$('#ship2').css('opacity', '1');
				regenerating2 = 0;
			}	
		}

		function gameOver() {
			player1active = 0;
			player2active = 0;
			$('#gameover').show();
			$('#tryagain').on('click', function(){
				$('#gameover').hide();
				click.play();
				if(numPlayers===1){
					setup1();
					inGameState();
				}
				if(numPlayers===2){
					setup2();
					inGameState();
				}
			});
			$('#mainmenu').on('click', function(){
				$('#gameover').hide();
				click.play();
				$('.lives1').hide();
				$('.lives2').hide();
				$('#left').hide();
				$('#right').hide();
				$('#ship1').hide();
				$('#ship2').hide();
				$('.alien').each(function(){
					$(this).hide();
				})
				$('#scoreboard').hide();
				$('#level').hide();
				$('#menu').show();
				numPlayers = 0;
			})
		}

//This code is for when the user is playing the game
function inGameState(){	

	$('#left').show();
	$('#right').show();
	$('footer').show();
	$('#scoreboard').show();
	$('#level').show();
	$('#levelnumber').text(1);


	setTimeout(waveOne, 2000); 



} //end of inGameState


//Alien waves/levels
	
	//Wave one
	function waveOne(){
		$('.alien').each(function(){
			$(this).addClass("active")
		})
		$('#a1').css({left: "120px"});
		$('#a2').css({left: "500px"});
		$('#a3').css({left: "750px"});
		$('.alien').each(function(){
			$(this).show();
		});
		$('#a1').animate({left: "900px"}, 3000);
		$('#a2').animate({left: "400px"}, 3000);
		$('#a3').animate({left: "120px"}, 3000);


		

	}



});