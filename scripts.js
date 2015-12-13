$('document').ready(function(){
	//Audio Setup and volume
	var spacemen = document.getElementById("spacemen");
	var laser_sound = document.getElementById("lasersound");
	var click = document.getElementById("click");
	var boom = document.getElementById("boom");
	var hit = document.getElementById("hit");
	spacemen.volume = 0.6;
	click.volume = 0.4;
	laser_sound.volume = 0.4;
	boom.volume = 0.15;
	hit.volume = 0.2;

	//music and effects control in the footer
	var effects_volume = 1;
	var music_volume = 1;
	$('#effectsVol').on('click', function(){
		if(effects_volume===1){
			$('#effectsVol').css({color: "grey"});
			laser_sound.volume = 0.0;
			click.volume = 0.0;
			boom.volume = 0.0;
			effects_volume = 0;
			hit.volume = 0.0;
		}else{
			$('#effectsVol').css({color: "#00ffff"});
			laser_sound.volume = 0.2;
			click.volume = 0.2;
			boom.volume = 0.05;
			effects_volume = 1;
			hit.volume = 0.2;
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
	var laser_speed = 30; 
	var regenerating1 = 0; 
	var regenerating2 = 0;
	var winvariable = 0; 

	mainMenuState(); //
	
	//This function runs the menu before the game begins
	function mainMenuState(){
		$('.menuhide').hide();
		$('.alien').hide();
		$('#menu').show();
		$('#solobutton').on('click', function(){ //if 'Solo' mode chosen
			click.play();
			numPlayers = 1;
			controlsState();
		})
		$('#teambutton').on('click', function(){ //if 'Team' mode chosen
			click.play();
			numPlayers = 2;
			controlsState();
		})
	}

	//This function runs the controls menu
	function controlsState(){
		$('#menu').hide();
		$('#controls').show();
		if (numPlayers===1){  //Shows single player controls
			$('#double').hide();
			$('#arrowkeys').show();
			$('#gotit').on('click', function(){
				click.play();
				$('#controls').hide();
				inGameState();		
			});
		}else if(numPlayers===2){ //Shows team controls
			$('#arrowkeys').hide();
			$('#double').show();
			$('#gotit').on('click', function(){
				click.play();
				$('#controls').hide();
				inGameState();
			});
		}
		$('#back').on('click', function(){ //back to main menu
			$('#controls').hide();
			click.play();
			mainMenuState();
		});
	}

	//This sets up single player mode
	function setup1(){
		score = 0;
		speed1 = 7;
		player1Lives = 3;
		player1active = 1;
		$('.alien').removeClass("active oneHP twoHP threeHP")
		$('#ship1').css({top: "80%", left: "80%"});
		$('#ship1').show();
		$('.lives1').show();
	}
	// This sets up team mode
	function setup2(){
		score = 0;
		speed1 = 7;
		speed2 = 7;
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

	//This controls the movement of the ships
	//uses the "keydrown" jquery library found at: https://jeremyckahn.github.io/keydrown/
 	kd.run(function () { // this code is necessary for the keydrown library
 	 	kd.tick();
	});
	//Player 1 controls
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
	//Player 2 controls
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

	//updates the score box on the right every 100 milliseconds
	var score = 0;
	setInterval(updateScore,100);	
	function updateScore(){
		$('#score').text(score);
	}

	//This code triggers the lasers when SPACE and SHIFT are pressed
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

	//  The firing method was inspired by Alex Turpin's 
	//  	answer to this stackoverflow question:
	//  http://stackoverflow.com/questions/7823192/fire-a-bullet-with-jquery-javascript
	//  appends a new "laser" div at the position of ship 1
	function fire1(){
		if(player1active===1){
			var x = $('#ship1').position();
			$("#playfield").append($("<div>").addClass("laser").css({top: x.top, left: x.left + 36}));
			laser_sound.currentTime = 0;
			laser_sound.play();
		}
	}

	//appends a new "laser" div at the position of ship2
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
			if (oldHeight>0){  // if at top of screen, remove
				$(this).css("top", oldHeight-laser_speed);
				var laserCoordinates = $(this).position();
				var collided = checkCollision(laserCoordinates);
				if(collided){  // if collided with alien, remove
					$(this).remove();
				}
			}else{
				$(this).remove();
			}
		});
	}

	//Code to sense when the laser hits an alien ship
	function checkCollision(object){ //takes in the top and left coordinates of a laser
		var isHit = null;
		$('.oneHP').each(function(){ //cycles through all remaining aliens
			var alienPos = $(this).position();
			var alienHeight = $(this).height();
			var alienWidth = $(this).width();
			if(alienPos.top <object.top && object.top < alienPos.top + alienHeight &&
				alienPos.left< object.left && object.left<alienPos.left + alienWidth){ //checks coordinates against the laser
					if($(this).hasClass("threeHP")){ // removes a hit point
						hit.currentTime=0;
						hit.play();
						$(this).removeClass("threeHP");
						isHit = true;
						return false;
					}else if($(this).hasClass("twoHP")){ // removes a hit point
						hit.currentTime=0;
						hit.play();
						$(this).removeClass("twoHP");
						isHit = true;
						return false;
					}else if($(this).hasClass("oneHP")){ //removes last hit point
						boom.currentTime=0;
						boom.play();
						$(this).removeClass("oneHP active");
						$(this).stop(true).empty();
						$(this).append("<img class='alien1' src='images/explosion.png'>");
						$(this).fadeOut(1000);
						score += 10;  // increases score
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
		$('.oneHP').each(function(){ // cycles through all remaining aliens
			var alienPos = $(this).position();
			var alienHeight = $(this).height();
			var alienWidth = $(this).width();
			var player1Pos = $('#ship1').position();
			if (player1Pos.top < alienPos.top + alienHeight  &&
				alienPos.top  < player1Pos.top + $('#ship1').height() &&
				player1Pos.left < alienPos.left + alienWidth &&
				alienPos.left < player1Pos.left + $('#ship1').width()){
					if (regenerating1===0){
						boom.play();
						$(this).removeClass("active oneHP twoHP threeHP");																							
						$(this).stop(true).empty();
						$(this).append("<img class='alien1' src='images/explosion.png'>");
						$(this).fadeOut(1000);
						player1LifeLoss();
					}
			}
			if(numPlayers===2){  // checks against player 2 ship only if numPlayers===2
				var player2Pos = $('#ship2').position();
				if (player2Pos.top < alienPos.top + alienHeight  &&
					alienPos.top  < player2Pos.top + $('#ship2').height() &&
					player2Pos.left < alienPos.left + alienWidth &&
					alienPos.left < player2Pos.left + $('#ship2').width()){
						if(regenerating2===0){
							boom.play();
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
		regenerating1=1;
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
		$('#ship1').css('opacity', '0'); //blinks ship while regenerating
		var handle = setInterval(function(){
			$('#ship1').css('opacity', '1');
			setTimeout(function(){
				if(regenerating1===1){
					$('#ship1').css('opacity', '0');
				}
			}, 200);
		}, 400);

		setTimeout(clear, 2000); //time spent regenerating
		function clear() {
			regenerating1 = 0;
			clearInterval(handle);
			$('#ship1').css('opacity', '1');
		}
	}

	//This takes away a life when player 2's ship is hit
	function player2LifeLoss (){
		regenerating2=1;
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
		$('#ship2').css('opacity', '0');  // blinks ship while regenerating
		var handle = setInterval(function(){
			$('#ship2').css('opacity', '1');
			setTimeout(function(){
				if(regenerating2===1){
					$('#ship2').css('opacity', '0');
				}
			}, 200);
		}, 400);

		setTimeout(clear2, 2000); //time spent regenerating
		function clear2() {
			regenerating2 = 0;
			clearInterval(handle);
			$('#ship2').css('opacity', '1');
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


	//The following functions controls the waves of Aliens.  
	//Each wave triggers the next when all aliens have been defeated

	//Wave one
	function waveOne(){
		$('#levelnumber').text(1);  //level indicators
		$('#levelindicator').text("Level 1");
		$('#levelindicator').fadeIn(1000);
		setTimeout(function(){
			$('#levelindicator').fadeOut(1000);
		},1000)
		winvariable=0;
		setupwave1($('#a1')); //sets up the aliens for this level
		setupwave1($('#a2'));
		setupwave1($('#a3'));

		function setupwave1(alien){
			alien.finish().empty();
			alien.append("<img class='alien1' src='images/alien1.png'>")
			alien.addClass("active oneHP twoHP");
		}

		$('#a1').css({left: "10%", top: "0%"}); //Starting position of aliens
		$('#a2').css({left: "50%", top: "0%"});
		$('#a3').css({left: "90%", top: "0%"});
		$('.active').each(function(){
			$(this).show();
		});

		formation1();
		var wave1 = setInterval(formation1,7000); //repeats the pre-determined formation
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
			if($('.oneHP').length<1){ //Checks to see how many aliens are left
				if(winvariable===0){
					clearInterval(wave1);
					setTimeout(function(){
						$('.alien').removeClass("active oneHP twoHP threeHP");
						waveTwo(); //Calls the next wave
					}, 2000);
					clearInterval(checkLevel1);
				}else{
					clearInterval(checkLevel1);
				}
			}
		},100);
	}
	//Wave 2
	function waveTwo(){
		$('#levelnumber').text(2); //level indicators
		$('#levelindicator').text("Level 2");
		$('#levelindicator').fadeIn(1000);
		setTimeout(function(){
			$('#levelindicator').fadeOut(1000);
		},1000)

		setupwave2($('#a1')); //sets up the aliens for the level
		setupwave2($('#a2'));
		setupwave2($('#a3'));
		function setupwave2(alien){
			alien.finish().empty();
			alien.append("<img class='alien1' src='images/alien1.png'>");
			alien.addClass("active oneHP twoHP threeHP");
		}

		$('#a1').css({left: "10%", top: "0%"}); //starting positions
		$('#a2').css({left: "20%", top: "0%"}); 
		$('#a3').css({left: "30%", top: "0%"});
		$('.oneHP').show();

		formation2();
		var wave2 = setInterval(formation2,7000); //Loops formation
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
			if($('.oneHP').length<1){ //Checks to see how many aliens remain
				if(winvariable===0){
					clearInterval(wave2);
					setTimeout(function(){
						$('.alien').removeClass("active oneHP twoHP threeHP");
						waveThree(); // next wave
					}, 1000);
					clearInterval(checkLevel2);
				}else{
					clearInterval(checkLevel2);
				}
			}
		},100);
	}

	function waveThree(){
		$('#levelnumber').text(3);  //level indicators
		$('#levelindicator').text("Level 3");
		$('#levelindicator').fadeIn(1000);
		setTimeout(function(){
			$('#levelindicator').fadeOut(1000);
		},1000)

		setupwave3($('#a1')); //sets up aliens
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

		$('#a1').css({left: "10%", top: "0%"}); //starting positions
		$('#a2').css({left: "20%", top: "0%"});
		$('#a3').css({left: "30%", top: "0%"});
		$('#a4').css({left: "70%", top: "0%"});
		$('#a5').css({left: "80%", top: "0%"});
		$('#a6').css({left: "90%", top: "0%"});
		$('.oneHP').show();

		formation3();
		var wave3 = setInterval(formation3,7000); //loops formations
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
			if($('.oneHP').length<1){ //checks for remaining aliens
				if(winvariable===0){
					clearInterval(wave3);
					setTimeout(function(){
						$('.alien').removeClass("active oneHP twoHP threeHP");
						waveFour(); //next level
					}, 1000);
					clearInterval(checkLevel3);
				}else{
					clearInterval(checkLevel3);
				}
			}
		},100);

	}

	function waveFour(){
		$('#levelnumber').text(4); //level indicators
		$('#levelindicator').text("Level 4");
		$('#levelindicator').fadeIn(1000);
		setTimeout(function(){
			$('#levelindicator').fadeOut(1000);
		},1000)

		setupwave4($('#a1')); //setup aliens
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

		$('#a1').css({left: "10%", top: "0%"}); //starting positions
		$('#a2').css({left: "20%", top: "0%"}); 
		$('#a3').css({left: "30%", top: "0%"});
		$('#a4').css({left: "70%", top: "0%"});
		$('#a5').css({left: "80%", top: "0%"});
		$('#a6').css({left: "90%", top: "0%"});
		$('.oneHP').show();

		formation4();
		var wave4 = setInterval(formation4,3000); //loops formation
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
			if($('.oneHP').length<1){ //checks for remaining aliens
				if(winvariable===0){
					clearInterval(wave4);
					setTimeout(function(){
						$('.alien').removeClass("active oneHP twoHP threeHP");
						waveFive(); //next level
					}, 1000);
					clearInterval(checkLevel4);
				}else{
					clearInterval(checkLevel4);
				}
			}
		},100);
	}

	function waveFive(){
		$('#levelnumber').text(5);  //level indicators
		$('#levelindicator').text("Level 5");
		$('#levelindicator').fadeIn(1000);
		setTimeout(function(){
			$('#levelindicator').fadeOut(1000);
		},1000)

		setupwave5($('#a1')); //sets up aliens
		setupwave5($('#a2'));
		setupwave5($('#a3'));
		setupwave5($('#a4'));
		setupwave5($('#a5'));
		setupwave5($('#a6'));
		setupwave5($('#a7'));
		setupwave5($('#a8'));
		setupwave5($('#a9'));
		setupwave5($('#a10'));
		function setupwave5(alien){
			alien.finish().empty();
			alien.append("<img class='alien1' src='images/alien1.png'>");
			alien.addClass("active oneHP twoHP threeHP");
		}

		$('#a1').css({left: "10%", top: "0%"}); //starting positions
		$('#a2').css({left: "20%", top: "0%"});
		$('#a3').css({left: "30%", top: "0%"});
		$('#a4').css({left: "40%", top: "0%"});
		$('#a5').css({left: "50%", top: "0%"});
		$('#a6').css({left: "60%", top: "0%"});
		$('#a7').css({left: "70%", top: "0%"});
		$('#a8').css({left: "80%", top: "0%"});
		$('#a9').css({left: "90%", top: "0%"});
		$('#a10').css({left: "0%", top: "0%"});
		$('.oneHP').show();

		formation5();
		var wave5 = setInterval(formation5,3000); //loops formation
		function formation5(){
			$('.oneHP').each(function(){
				$(this).animate({left: Math.ceil(Math.random()*9)+"0%", top: Math.ceil(Math.random()*9)+"0%"}, 1000);
			});
			$('.oneHP').animate({top: "100%"}, 1500, function(){
				$('.oneHP').css("top", "0%");
			});
		}

		var checkLevel5 = setInterval(function(){
			if($('.oneHP').length<1){ //checks for remaining aliens
				if(winvariable===0){
					clearInterval(wave5);
					setTimeout(function(){
						$('.alien').removeClass("active oneHP twoHP threeHP");
						youWin(); //you win!
					}, 1000);
					clearInterval(checkLevel5);
				}else{
					clearInterval(checkLevel5);
				}
			}
		},100);
	}

	//This is called when you win the game, and lets you replay or go to main menu
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

	//you lose.  Try again or main menu
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