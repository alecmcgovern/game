$('document').ready(function(){
	//Audio Setup
	var spacemen = document.getElementById("spacemen");
	spacemen.volume = 1.0;

	var laser_sound = document.getElementById("lasersound");
	laser_sound.volume = 0.4;

	var click = document.getElementById("click");
	click.volume = 0.4;

	var boom = document.getElementById("boom");
	boom.volume = 0.15;

	var hit = document.getElementById("hit");
	hit.volume = 0.2;

	var effects_volume = 1;
	var music_volume = 1;

	//mutes volume/effects when icon is clicked
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

	//Global variables
	var numPlayers = 0;
	var player1active = 0;
	var player2active = 0;
	var player1Lives = 3;
	var player2Lives = 3;
	var speed1 = 5;
	var speed2 = 5;
	var laser_speed = 20;
	var regenerating1 = 0;
	var regenerating2 = 0;
	var winvariable = 0; 

	mainMenuState();
	
	//This function runs through the menu before the game actually begins
	function mainMenuState(){
		$('.menuhide').hide();
		$('.alien').hide();
		$('#menu').show();

		$('#solo').on('click', function(){
			click.play();
			numPlayers = 1;
			controlsState();
		})
		$('#team').on('click', function(){
			click.play();
			numPlayers = 2;
			controlsState();
		})
	}

	//This function shows the game controls information, and calls the 'inGameState'
	// function to begin the game
	function controlsState(){
		$('#menu').hide();
		$('#controls').show();
		if (numPlayers===1){
			$('#double').hide();
			$('#arrowkeys').show();
			$('#gotit').on('click', function(){
				click.play();
				$('#controls').hide();
				inGameState();
				
			});
		}else if(numPlayers===2){
			$('#arrowkeys').hide();
			$('#double').show();
			$('#gotit').on('click', function(){
				click.play();
				$('#controls').hide();
				inGameState();
			});
		}

		$('#back').on('click', function(){
			$('#controls').hide();
			click.play();
			mainMenuState();
		});
	}


	//sets up game states for one player and two player
	function setup1(){
		score = 0;
		speed1 = 5;
		player1Lives = 3;
		player1active = 1;
		$('.alien').removeClass("active oneHP twoHP threeHP")
		$('#ship1').css({top: "80%", left: "80%"});
		$('#ship1').show();
		$('.lives1').show();
	}

	function setup2(){
		score = 0;
		speed1 = 5;
		speed2 = 5;
		player1Lives = 3;
		player2Lives = 3;
		player1active = 1;
		player2active = 1;
		$('.alien').removeClass("active oneHP twoHP threeHP")
		$('#ship1').css({top: "80%", left: "80%"});
		$('#ship1').show();
		$('#ship2').css({top: "80%", left: "10%"});
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
		if($('#ship1').position().top < $('#playfield').height()-80 && player1active===1) {
			$('#ship1').finish().animate({top: "+="+speed1});
		}
	});
	kd.UP.down(function(){
		if($('#ship1').position().top > 0 && player1active===1) {
			$('#ship1').finish().animate({top: "-="+speed1});
		}
	});
	kd.LEFT.down(function(){
		if($('#ship1').position().left > 0 && player1active===1) {
			$('#ship1').finish().animate({left: "-="+speed1});
		}
	});
	kd.RIGHT.down(function(){
		if($('#ship1').position().left < $('#playfield').width()-60 && player1active===1) {
			$('#ship1').finish().animate({left: "+="+speed1});
		}
	});

	//This Code controls the 'WASD' movement of player two's ship
	kd.S.down(function(){
		if($('#ship2').position().top < $('#playfield').height()-80 && player2active===1) {
			$('#ship2').finish().animate({top: "+="+speed2});
		}
	});
	kd.W.down(function(){
		if($('#ship2').position().top > 0 && player2active===1) {
			$('#ship2').finish().animate({top: "-="+speed2});
		}
	});
	kd.A.down(function(){
		if($('#ship2').position().left > 0 && player2active===1) {
			$('#ship2').finish().animate({left: "-="+speed2});
		}
	});
	kd.D.down(function(){
		if($('#ship2').position().left < $('#playfield').width()-60 && player2active===1) {
			$('#ship2').finish().animate({left: "+="+speed2});
		}
	});	

	//updates the score every 100 milliseconds
	var score = 0;
	setInterval(updateScore,100);	

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
		if(player1active===1){
			var x = $('#ship1').position();
			$("#playfield").append($("<div>").addClass("laser").css({top: x.top, left: x.left + 36}));
			laser_sound.currentTime = 0;
			laser_sound.play();
		}
	}

	//ship 2 laser
	function fire2(){
		if (player2active===1) {
			var y = $('#ship2').position();
			$("#playfield").append($("<div>").addClass("laser").css({top: y.top, left: y.left + 36}));
			laser_sound.currentTime = 0;
			laser_sound.play();
		}
	}

	//udate all laser positions every 30 milliseconds, and checks for collision with alien ships
	setInterval(updateLaserPosition, 30);

	function updateLaserPosition(){
		$('.laser').each(function(){
			var oldHeight = $(this).offset().top;
			if (oldHeight>0){
				$(this).css("top", oldHeight-laser_speed);
				var laserCoordinates = $(this).position();
				var collided = checkCollision(laserCoordinates);
				if(collided){
					$(this).remove();
				}
			}else{
				$(this).remove();
			}
		});
	}

	//Code to sense when the laser hits an alien ship
	function checkCollision(object){
		var isHit = null;
		$('.active').each(function(){
			var alienPos = $(this).position();
			var alienHeight = $(this).height();
			var alienWidth = $(this).width();
			if(alienPos.top <object.top && object.top < alienPos.top + alienHeight &&
				alienPos.left< object.left && object.left<alienPos.left + alienWidth){
					if($(this).hasClass("threeHP")){
						hit.currentTime=0;
						hit.play();
						$(this).removeClass("threeHP");
						isHit = true;
						return false;
					}else if($(this).hasClass("twoHP")){
						hit.currentTime=0;
						hit.play();
						$(this).removeClass("twoHP");
						isHit = true;
						return false;
					}else if($(this).hasClass("oneHP")){
						boom.currentTime=0;
						boom.play();
						$(this).removeClass("oneHP active");
						$(this).stop(true).empty();
						$(this).append("<img class='alien1' src='images/explosion.png'>");
						$(this).fadeOut(1000);
						score += 10;
						isHit =  true;
						return false;
					} 
			}else{
				isHit =  false;
			}
		})
		return isHit;
	}

	//This checks to see if the aliens hit either player every 30 milliseconds
	setInterval(checkDamage, 30);

	function checkDamage(){
		$('.active').each(function(){
			var alienPos = $(this).position();
			var alienHeight = $(this).height();
			var alienWidth = $(this).width();
			var player1Pos = $('#ship1').position();
			var player2Pos = $('#ship2').position();
			if (player1Pos.top < alienPos.top + alienHeight  &&
				alienPos.top  < player1Pos.top + $('#ship1').height() &&
				player1Pos.left < alienPos.left + alienWidth &&
				alienPos.left < player1Pos.left + $('#ship1').width()){
					if (regenerating1===0){
						regenerating1=1;
						$(this).removeClass("active oneHP twoHP threeHP");																							
						$(this).stop(true).empty();
						$(this).append("<img class='alien1' src='images/explosion.png'>");
						$(this).fadeOut(1000);
						player1LifeLoss();
					}
			}
			if(numPlayers===2){
				if (player2Pos.top < alienPos.top + alienHeight  &&
					alienPos.top  < player2Pos.top + $('#ship2').height() &&
					player2Pos.left < alienPos.left + alienWidth &&
					alienPos.left < player2Pos.left + $('#ship2').width()){
						if(regenerating2===0){
							regenerating2=1;
							$(this).removeClass("active oneHP twoHP threeHP");
							$(this).hide();
							$(this).stop(true).empty();
							$(this).append("<img class='alien1' src='images/explosion.png'>");
							$(this).fadeOut(1000);
							player2LifeLoss();
						}
				}
			}
		});
	}

	//This takes away a life when player 1's ship is hit
	function player1LifeLoss () {
		boom.play();
		if(player1Lives===3){
			$('#life11').hide();
			player1Lives=2;
		}else if(player1Lives===2){
			$('#life12').hide();
			player1Lives=1;
		}else if(player1Lives===1){
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

		setTimeout(clear, 2000);

		function clear() {
			clearInterval(handle);
			$('#ship1').css('opacity', '1');
			regenerating1 = 0;
		}
	}

	//This takes away a life when player 2's ship is hit
	function player2LifeLoss (){
		boom.play();
		if(player2Lives===3){
			$('#life21').hide();
			player2Lives=2;
		}else if(player2Lives===2){
			$('#life22').hide();
			player2Lives=1;
		}else if(player2Lives===1){
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

		setTimeout(clear2, 2000);

		function clear2() {
			clearInterval(handle);
			$('#ship2').css('opacity', '1');
			regenerating2 = 0;
		}	
	}

	//This code starts stuff off when play is pressed
	function inGameState(){	
		if (numPlayers===1){
			setup1();
		}else if(numPlayers===2){
			setup2();
		}
		setTimeout(function(){
			spacemen.play();
		}, 1000);

		$('.gamestateshow').show();
		setTimeout(waveOne, 100); 
	} 

//Alien waves/levels.  Set interval, cleared when all enemies have been defeated
	// add health and ships to each level

	//Wave one
	function waveOne(){
		$('#levelnumber').text(1);
		$('#levelindicator').text("Level 1");
		$('#levelindicator').fadeIn(1000);
		setTimeout(function(){
			$('#levelindicator').fadeOut(1000);
		},1000)
		winvariable=0;
		setupwave1($('#a1'));
		setupwave1($('#a2'));
		setupwave1($('#a3'));

		function setupwave1(alien){
			alien.finish().empty();
			alien.append("<img class='alien1' src='images/alien1.png'>")
			alien.addClass("active oneHP twoHP");
		}

		$('#a1').css({left: "10%", top: "0%"});
		$('#a2').css({left: "50%", top: "0%"});
		$('#a3').css({left: "90%", top: "0%"});
		$('.active').each(function(){
			$(this).show();
		});

		formation1();
		var wave1 = setInterval(formation1,7000);

		function formation1(){
			$('#a1').animate({left: "70%"}, 3000);
			$('#a2').animate({left: "40%"}, 3000);
			$('#a3').animate({left: "10%"}, 3000);

			$('.oneHP').animate({top: "100%"}, 2000, function(){
				$('.oneHP').css("top", "0%");
			});
			$('.oneHP').animate({top: "40%", left: "+=30%"}, 2000);
			$('.oneHP').animate({top: "100%", left: "-=30%"}, 2000, function(){
				$('.oneHP').css("top", "0%");
			});
		}

		var checkLevel1 = setInterval(function(){
			if($('.oneHP').length<1){
				if(winvariable===0){
					clearInterval(wave1);
					setTimeout(function(){
						$('.alien').removeClass("active oneHP twoHP threeHP");
						waveTwo();
					}, 2000);
					clearInterval(checkLevel1);
				}else{
					clearInterval(checkLevel1);
				}
			}
		},100);
	}

	function waveTwo(){
		$('#levelnumber').text(2);
		$('#levelindicator').text("Level 2");
		$('#levelindicator').fadeIn(1000);
		setTimeout(function(){
			$('#levelindicator').fadeOut(1000);
		},1000)
		setupwave2($('#a1'));
		setupwave2($('#a2'));
		setupwave2($('#a3'));

		function setupwave2(alien){
			alien.finish().empty();
			alien.append("<img class='alien1' src='images/alien1.png'>");
			alien.addClass("active oneHP twoHP threeHP");
		}

		$('#a1').css({left: "10%", top: "0%"});
		$('#a2').css({left: "20%", top: "0%"});
		$('#a3').css({left: "30%", top: "0%"});
		$('.oneHP').each(function(){
			$(this).show();
		});

		formation2();
		var wave2 = setInterval(formation2,7000);

		function formation2(){
			$('#a1').animate({left: "90%"}, 2000);
			$('#a2').animate({left: "80%"}, 2000);
			$('#a3').animate({left: "70%"}, 2000);

			$('.oneHP').animate({top: "100%"}, 1500, function(){
				$('.oneHP').css("top", "0%");
			});

			$('#a1').animate({left: "40%"}, 2000);
			$('#a2').animate({left: "50%"}, 2000);
			$('#a3').animate({left: "60%"}, 2000);

			$('.oneHP').animate({top: "20%", left: "+=20%"}, 800);
			$('.oneHP').animate({top: "40%", left: "-=20%"}, 800);
			$('.oneHP').animate({top: "60%", left: "+=20%"}, 800);
			$('.oneHP').animate({top: "100%"}, 500, function(){
				$('.oneHP').css("top", "0%");
			});
		}
		var checkLevel2 = setInterval(function(){
			if($('.oneHP').length<1){
				if(winvariable===0){
					clearInterval(wave2);
					setTimeout(function(){
						$('.alien').removeClass("active oneHP twoHP threeHP");
						waveThree();
					}, 1000);
					clearInterval(checkLevel2);
				}else{
					clearInterval(checkLevel2);
				}
			}
		},100);
	}

	function waveThree(){
		$('#levelnumber').text(3);
		$('#levelindicator').text("Level 3");
		$('#levelindicator').fadeIn(1000);
		setTimeout(function(){
			$('#levelindicator').fadeOut(1000);
		},1000)
		setupwave3($('#a1'));
		setupwave3($('#a2'));
		setupwave3($('#a3'));
		setupwave3($('#a4'));
		setupwave3($('#a5'));
		setupwave3($('#a6'));

		function setupwave3(alien){
			alien.finish().empty();
			alien.append("<img class='alien1' src='images/alien1.png'>");
			alien.addClass("active oneHP twoHP threeHP");
		}

		$('#a1').css({left: "10%", top: "0%"});
		$('#a2').css({left: "20%", top: "0%"});
		$('#a3').css({left: "30%", top: "0%"});
		$('#a4').css({left: "70%", top: "0%"});
		$('#a5').css({left: "80%", top: "0%"});
		$('#a6').css({left: "90%", top: "0%"});
		$('.oneHP').each(function(){
			$(this).show();
		});

		formation3();
		var wave3 = setInterval(formation3,7000);

		function formation3(){
			$('#a1').animate({left: "20%"}, 1000);
			$('#a2').animate({left: "30%"}, 1000);
			$('#a3').animate({left: "70%"}, 1000);
			$('#a4').animate({left: "40%"}, 1000);
			$('#a5').animate({left: "50%"}, 1000);
			$('#a6').animate({left: "60%"}, 1000);

			$('.oneHP').animate({top: "100%"}, 1500, function(){
				$('.oneHP').css("top", "0%");
			});

			$('#a1').animate({left: "50%", top: "40%"}, 1000);
			$('#a2').animate({left: "10%"}, 1000);
			$('#a3').animate({left: "30%", top: "40%"}, 1000);
			$('#a4').animate({left: "80%"}, 1000);
			$('#a5').animate({left: "70%", top: "40%"}, 1000);
			$('#a6').animate({left: "90%"}, 1000);

			$('.oneHP').animate({top: "100%"}, 1500, function(){
				$('.oneHP').css("top", "0%");
			});
		}

		var checkLevel3 = setInterval(function(){
			if($('.oneHP').length<1){
				if(winvariable===0){
					clearInterval(wave3);
					setTimeout(function(){
						$('.alien').removeClass("active oneHP twoHP threeHP");
						waveFour();
					}, 1000);
					clearInterval(checkLevel3);
				}else{
					clearInterval(checkLevel3);
				}
			}
		},100);

	}

	function waveFour(){
		$('#levelnumber').text(4);
		$('#levelindicator').text("Level 4");
		$('#levelindicator').fadeIn(1000);
		setTimeout(function(){
			$('#levelindicator').fadeOut(1000);
		},1000)
		setupwave4($('#a1'));
		setupwave4($('#a2'));
		setupwave4($('#a3'));
		setupwave4($('#a4'));
		setupwave4($('#a5'));
		setupwave4($('#a6'));

		function setupwave4(alien){
			alien.finish().empty();
			alien.append("<img class='alien1' src='images/alien1.png'>");
			alien.addClass("active oneHP twoHP threeHP");
		}

		$('#a1').css({left: "10%", top: "0%"});
		$('#a2').css({left: "20%", top: "0%"});
		$('#a3').css({left: "30%", top: "0%"});
		$('#a4').css({left: "70%", top: "0%"});
		$('#a5').css({left: "80%", top: "0%"});
		$('#a6').css({left: "90%", top: "0%"});
		$('.oneHP').each(function(){
			$(this).show();
		});

		formation4();
		var wave4 = setInterval(formation4,3000);

		function formation4(){
			$('.oneHP').animate({top: "100%"}, 1500, function(){
				$('.oneHP').css("top", "0%");
			});

			Math.ceil(Math.random()*9)
			$('#a1').animate({left: Math.ceil(Math.random()*9)+"0%", top: Math.ceil(Math.random()*9)+"0%"}, 1000);
			$('#a2').animate({left: Math.ceil(Math.random()*9)+"0%", top: Math.ceil(Math.random()*9)+"0%"}, 1000);
			$('#a3').animate({left: Math.ceil(Math.random()*9)+"0%", top: Math.ceil(Math.random()*9)+"0%"}, 1000);
			$('#a4').animate({left: Math.ceil(Math.random()*9)+"0%", top: Math.ceil(Math.random()*9)+"0%"}, 1000);
			$('#a5').animate({left: Math.ceil(Math.random()*9)+"0%", top: Math.ceil(Math.random()*9)+"0%"}, 1000);
			$('#a6').animate({left: Math.ceil(Math.random()*9)+"0%", top: Math.ceil(Math.random()*9)+"0%"}, 1000);

			$('.oneHP').animate({top: "100%"}, 1500, function(){
				$('.oneHP').css("top", "0%");
			});
		}

		var checkLevel4 = setInterval(function(){
			if($('.oneHP').length<1){
				if(winvariable===0){
					clearInterval(wave4);
					setTimeout(function(){
						$('.alien').removeClass("active oneHP twoHP threeHP");
						youWin();
					}, 1000);
					clearInterval(checkLevel4);
				}else{
					clearInterval(checkLevel4);
				}
			}
		},100);
	}

	function youWin(){
		if(winvariable===0){
			winvariable=1;
			$('.alien').hide();
			$('.alien').finish();
			$('.alien').removeClass('active oneHP twoHP threeHP');
			player1active = 0;
			player2active = 0;
			$('#youwin').show();
			$('#replay').on('click', function(){
				$('#youwin').hide();
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
			$('#tomenu').on('click', function(){
				$('#youwin').hide();
				click.play();
				$('.menuhide').hide();
				$('.alien').hide();
				$('#menu').show();
				numPlayers = 0;
			});
		}
	}
	//you lose
	function gameOver() {
		winvariable=1;
		$('.alien').hide();
		$('.alien').finish();
		$('.alien').removeClass("active oneHP twoHP threeHP");
		player1active = 0;
		player2active = 0;
		$('#gameover').show();
		$('#tryagain').on('click', function(){
			$('#gameover').hide();
			click.play();
			if(numPlayers===1){
				setup1();
			}
			if(numPlayers===2){
				setup2();
			}
			inGameState();
		});
		$('#mainmenu').on('click', function(){
			$('#gameover').hide();
			click.play();
			$('.menuhide').hide();
			$('.alien').hide();
			$('#menu').show();
			numPlayers = 0;
		})
	}
});