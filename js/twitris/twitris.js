if(typeof(jQ)==="undefined") var jQ=$(document);
if("function"!==typeof(String.prototype.trim)) String.prototype.trim=function(){ return this.replace(/^\s+|\s+$/g,""); };
"function"!==typeof String.prototype.replaceSpecialChars&&(String.prototype.replaceSpecialChars=function(){var b={"\u00e7":"c","\u00e6":"ae","\u0153":"oe","\u00e1":"a","\u00e9":"e","\u00ed":"i","\u00f3":"o","\u00fa":"u","\u00e0":"a","\u00e8":"e","\u00ec":"i","\u00f2":"o","\u00f9":"u","\u00e4":"a","\u00eb":"e","\u00ef":"i","\u00f6":"o","\u00fc":"u","\u00ff":"y","\u00e2":"a","\u00ea":"e","\u00ee":"i","\u00f4":"o","\u00fb":"u","\u00e5":"a","\u00e3":"a","\u00f8":"o","\u00f5":"o",u:"u","\u00c1":"A","\u00c9":"E","\u00cd":"I","\u00d3":"O","\u00da":"U","\u00ca":"E","\u00d4":"O","\u00dc":"U","\u00c3":"A","\u00d5":"O","\u00c0":"A","\u00c7":"C"};return this.replace(/[\u00e0-\u00fa]/g,function(a){return"undefined"!=typeof b[a]?b[a]:a})});
//if("object"===typeof(console)) console.log("base v 01");

var TetrisEngine = null;

var tweets = [];

//var twitris_objects = [];

var Twitris=
{
	init:function(b, t)
	{
		TetrisEngine = t;
		Twitris.collectTweets("superuber",tweets);
	},
	windowOnload:function(b)
	{
		//alert("loaded!");
		Twitris.generatePuzzles();
	},
	collectTweets:function(hashtag,array)
	{
		var options = {
			max_tweets: 30
		}
		
		var requestTweets = function(array) {
			$.ajax({
				url: 'http://search.twitter.com/search.json?noCache=' + Math.random()*999999,
				data: {q: hashtag, rpp: options.max_tweets},
				method: 'GET',
				success: function(data) {
					for (var tweet in data.results) {
						var t = data.results[tweet];
						//array.push(new Tweet(t.from_user, t.text, t.created_at, t.profile_image_url));
						//alert(t);
						array.push({username:t.from_user, tweet:t.text, date:t.created_at, avatar:t.profile_image_url});
					}
					//Twitris.loadImages();
					Twitris.saveImages();
				},
				dataType: 'jsonp'
			});
		}
		
		requestTweets(array);
	},
	saveImages:function()
	{
		var saveImage = function(loadFile, saveFile) {
			//console.log(String('file_save.php?load=' + loadFile + '&save=' + saveFile));
			$.ajax({
				url: 'save_file.php?load=' + loadFile + '&save=' + saveFile,
				method: 'POST',
				success: function(data) {
					
				}
			});
		};
		
		for (var i = 0; i < tweets.length; i++) {
			var source = tweets[i].avatar;
			var filename = tweets[i].username + '.jpg';
			
			saveImage(source,filename);
		}
		
		Twitris.loadImages();
	},
	loadImages:function()
	{
		for (var i = 0; i < tweets.length; i++) {
			var image = 'http://www.twitris.net/textures/' + tweets[i].username + '.jpg';
			if(image != undefined)
			{
				$('body').append('<img src="' + image + '"alt="" border="0" style="display:none;" />');
			}
			else 
			{
				tweets.pop(i);
			}
		}
		//Twitris.saveImages();
	},
	drawImages:function()
	{
	},
	generatePuzzles:function()
	{
		for (var i = 0; i < tweets.length; i++)
		{
			var tweet = String(tweets[i].tweet).toUpperCase();
			var username = tweets[i].username;
			
			var avatar = new Image();
			avatar.src = tweets[i].avatar;
			
			//var avatarBase64 = Utils.getBase64Image(avatar);
			
			for (var j = 0; j < tweet.length; j++)
			{
				switch(tweet[j])
				{
					case "O":
					case "T":
					case "I":
					case "S":
					case "Z":
					case "J":
					case "L":
						//twitris_objects.push({puzzle:Tetris.Puzzle.defineTwitrisPuzzle(tweet[j]),avatar:avatar});
						//twitris_objects.push({puzzle:DefineTwitrisPuzzle(String(tweet[j])),avatar:avatar});
						TetrisPuzzlesQueue.push({puzzle:DefineTwitrisPuzzle(String(tweet[j])),tetronimo:tweet[j],avatar:avatar, /*avatarBase64:avatarBase64,*/username:username,src:tweets[i].avatar,srcTexture:'textures/'+username+'.jpg'});
					break;
				}
			}
			Utils.shuffleArray(TetrisPuzzlesQueue);
		}
	},
	addControls:function(b)
	{
		var divSuperior = document.createElement("div");
		div.style = "width:100%;height:500px;position:absolute;";
		var linkDivSuperior = document.createElement("a");
		linkDivSuperior.onClick = "";//tetris.up();
		linkDivSuperior.appendChild(divSuperior);

		/*var divDireito = document.createElement("div");
		divDireito.style = "width:100%;height:500px;position:absolute;";

		var divEsquerdo = document.createElement("div");
		divEsquerdo.style = "width:100%;height:500px;position:absolute;";*/

		var divInferior = document.createElement("div");
		divInferior.style = "width:100%;height:500px;position:absolute;top:50%;";
		var linkDivInferior = document.createElement("a");
		linkDivInferior.onClick = "";//tetris.down();
		linkDivInferior.appendChild(divInferior);
		
		b.appendChild(linkDivSuperior);
		b.appendChild(linkDivInferior);
		/*b.appendChild(divDireito);
		b.appendChild(divEsquerdo);*/
		/*divSuperior.width = ;
		divSuperior.height = ;*/
	}
}

var Utils =
{
	RequestPermission:function(callback)
	{
		window.webkitNotifications.requestPermission(callback);
	},
	
	notif:function(image) {
		if (window.webkitNotifications.checkPermission() > 0) {
			Utils.RequestPermission(function(){Utils.getBase64Image(image);});
		}
		else
		{
			var notification = window.webkitNotifications.createHTMLNotification(image);
			notification.show();
		}
	},

	getBase64Image:function(img)
	{
		//Utils.notif(img.src);
	    // Create an empty canvas element
	    var canvas = document.createElement("canvas");
	    canvas.width = img.width;
	    canvas.height = img.height;
	
	    // Copy the image contents to the canvas
	    var ctx = canvas.getContext("2d");
	    ctx.drawImage(img, 0, 0);
	
		/*var imgURL = document.createElement('img');
		imgURL.onload = function(e) {
			ctx.drawImage(img, 0,0,canvas.width,canvas.height);
			var url = canvas.toDataURL("image/png");
			console.log(url);
			return url.replace(/^data:image\/(png|jpg);base64,/, "");
		}
		imgURL.crossOrigin = 'anonymous';
		imgURL.src = img.src;//*/
	
	    // Get the data-URL formatted image
	    // Firefox supports PNG and JPEG. You could check img.src to
	    // guess the original format, but be aware the using "image/jpg"
	    // will re-encode the image.
	    var imageDataURL = canvas.toDataURL("image/png");
	    
	    //console.log(imageDataURL);
	
	    return imageDataURL.replace(/^data:image\/(png|jpg);base64,/, "");
	},
	
	shuffleArray:function(myArray)
	{
		var i = myArray.length, j, tempi, tempj;
		if ( i === 0 ) return false;
		while ( --i ) {
			j = Math.floor( Math.random() * ( i + 1 ) );
			tempi = myArray[i];
			tempj = myArray[j];
			myArray[i] = tempj;
			myArray[j] = tempi;
		}
	}
}
	
	/*
	* 1) Carregar as imagens em tags <img> com display:none; OK
	* 2) No evento load, passar o src de todas as imagens para objetos Image() no javascript OK
	* 3) Destrinchar cada tweet em um pool de peças (T, I, L, J, S, Z, O); OK
	* 4) Passar os objetos Image() para um array de peças e imagens; OK
	* 5) Setar um método que defina que peça (this.nextType = random(this.puzzles.length);) OK
	* 6) Passar os objetos Image do array para as texturas de cada nova peça do three.js 
	* 7) Adicionar controles para mobile devices; OK
	* 8) Media queries; OK
	* 9) Preloader com spin.js; 
	*/


var _body_=null;
$(function(){
    _body_=$("body");
    //Twitris.init(_body_);
});
$(window).load(function(){
    Twitris.windowOnload(_body_);
});