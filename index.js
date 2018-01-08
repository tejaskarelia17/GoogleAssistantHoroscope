const express = require('express'),
		fs = require('fs'),
		request = require('request'),
		cheerio = require('cheerio');

const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json());

app.get('/horoscope', function(req, res) {
	url = 'http://www.prokerala.com/astrology/horoscope/?sign=cancer';

	request(url, function(err, response, html) {
		if(!err) {
			const $ = cheerio.load(html);

			var todaysHoroscope;
			const json = {
				prediction : ''
			}

			$('.horoscope-panel p').first().filter(function() {
				const data = $(this);
				todaysHoroscope = data.text().trim();
				
				json.prediction = todaysHoroscope;
				console.log(json);
				res.send("Hello"+todaysHoroscope);
			})
		}

		
	})
})

app.post('/horoscope', function(req, res) {

	// var Sign = req.query.horoscopeSign;
	// return res.json({
	// 	test: Sign
	// })
	
	var Sign =
    req.body.result &&
    req.body.result.parameters &&
    req.body.result.parameters.horoscopeSign
      ? req.body.result.parameters.horoscopeSign
      : "Seems like some problem. Speak again.";

	// if(Sign != "Seems like some problem. Speak again.") {

		url = 'http://www.prokerala.com/astrology/horoscope/?sign=Cancer';

		  	request(url, function(err, response, html) {
			if(!err) {
				const $ = cheerio.load(html);

				var todaysHoroscope;
				$('.horoscope-panel p').first().filter(function() {
					const data = $(this);
					todaysHoroscope = data.text().trim();
				})
			}
		})
		return res.json({
		    speech: todaysHoroscope,
		    displayText: todaysHoroscope,
		    source: "webhook-horoscope-sample"
		});
	// } else {
	// 		return res.json({
	// 		    speech: Sign,
	// 		    displayText: Sign,
	// 		    source: "webhook-horoscope-sample"
	// 		});
	// }
})

app.post("/horoscope2", function(req, res) {
  var speech =
    req.body.result &&
    req.body.result.parameters &&
    req.body.result.parameters.horoscopeSign
      ? req.body.result.parameters.horoscopeSign
      : "Seems like some problem. Speak again.";
  return res.json({
    speech: speech,
    displayText: speech,
    source: "webhook-echo-sample"
  });
});

app.listen(process.env.PORT || 8000, function() {
  console.log("Server up and listening");
});