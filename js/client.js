$(document).ready(function() {

	var Twitter = require('twitter')
		fs = require('fs'),
		path = require('path');
	
	
	var __dirname = path.resolve(path.dirname());

	var y = 0;
	var load = setInterval(function() {
		if(y === 0) $('#loadDots').text('');
		if(y === 1) $('#loadDots').text('.');
		if(y === 2) $('#loadDots').text('..');
		if(y === 3) $('#loadDots').text('...');
		if(y === 4) $('#loadDots').text('..');
		if(y === 5) $('#loadDots').text('.');
		if(y === 5) {
			y = 0;
		} else {
			y++;
		}
	}, 700);

	// ====================================
	// Reading creds file to get api creds!
	// ====================================
	var file = fs.readFileSync(__dirname + '/creds.json', 'utf8');
	if(file) {
		app();
	} else {
		$('#load').hide();
		$('#creds').show();
		console.log('hey');
		$('#credsForm').submit(function(e) {
			e.preventDefault();
			var obj = {};

			obj.c_k = $('#c_k').val();
			obj.c_s = $('#c_s').val();
			obj.a_t_k = $('#a_t_k').val();
			obj.a_t_s = $('#a_t_s').val();

			fs.writeFile(__dirname + '/creds.json', JSON.stringify(obj), function(err) {
				if(err) return console.log(err);
				console.log('Wrote: ' + JSON.stringify(obj) + ' to file SUCCESSFULLY!')

				app();
			})
		})
	}


function app() {

	$('#error').hide();
	$('#creds').hide();
	$('#load').show();

	var file = fs.readFileSync(__dirname + '/creds.json', 'utf8');
	file = JSON.parse(file);

	var data = [];


	var client = new Twitter({
  		consumer_key: file.c_k,
  		consumer_secret: file.c_s,
  		access_token_key: file.a_t_k,
  		access_token_secret: file.a_t_s
	});


	//make a little loading animation of dots and stuff
	client.get('search/tweets', {q: 'fun'}, function(error, tweets, response){
   		if(error) {
   			$('#load').hide();
   			$('#error').fadeIn(1500);
   			$('#newConn').click(function() {
   				app();
   			})

   			$('#newCreds').click(function() {
   				$('#error').hide();
   				$('#creds').show();
   			})
   		} else {

   	$('#load').hide();
   	clearInterval(load);
	$('#fade').fadeIn(1500);

	$('#form').submit(function(e) {
		e.preventDefault();
		data = [];
		$('.tweetList').remove();

		// Gets the keyword from the form when submitting
		var key = $('#key').val();
		console.log('Key: ' + key)
		var list = $('.tweetList');


// ==================================================
// Opens Twitter Stream tracking the inputted keyword
// ==================================================
client.stream('statuses/filter', {track: key}, function(stream) {
	console.log('...')


  stream.on('data', function(tweet) {
  	var date = tweet.created_at.split(' ').slice(0, 4).join(' ');

  	data.push({
  		text: tweet.text, 
  		username: tweet.user.name, 
  		screen_name: tweet.user.screen_name, 
  		date: date
  	});

  	$('#null').hide();
  	clearInterval(dots);
    $('<div class="panel panel-default tweetList" style="width: 50%; margin: auto; margin-bottom: 20px"><div class="panel-body" style="color: black; text-align: left"><p>' + tweet.text + '</p><p><b>- ' + tweet.user.name + ' (@ ' + tweet.user.screen_name + ')</b> ' + date + '</p></div></div>').prependTo('#tweets');


  	for(var j = 0; j < $('.tweetList').length; j++) {
  		if(j > 1) {
  			$($('.tweetList')[j]).remove();
  		}
  	}

  });

  global.twitterStream = stream;
 
  stream.on('error', function(error) {
    return console.log(error);
  });

  setTimeout(function() {
  	console.log('Running...');
  }, 3000)
});

	$('#fade').hide();
	$('#null').show();
	console.log($('#null'));
	$('#later').show();
	$('#key').val('');

	
});


	// ===============
	// Fancy null dots
	// ===============
	var i = 0;
	var dots = setInterval(function() {
		if(i === 0) $('#swagDots').text('..');
		if(i === 1) $('#swagDots').text('...');
		if(i === 2) $('#swagDots').text('.');
		if(i === 2) {
			i = 0;
		} else {
			i++;
		}
	}, 700);


$('#raw').click(function() {
	$('#tweets').hide();
	$('#raw').hide();
	$('#null').hide();
	$('#rawTweet').remove();
	$('<p id="rawTweet" style="padding-top: 5%">' + JSON.stringify(data) + '</p>').appendTo('#later');
	$('#restart').show();
	global.twitterStream.destroy();
	console.log('destroyed stream.')
});

$('#restart').click(function() {
	$('#later').hide();
	$('#fade').fadeIn(1500);
	$('#tweets').show();
	$('#raw').show();
	$('#restart').hide();
	$('#rawTweet').hide();
	$('#null').show();
});

}});
};
});
