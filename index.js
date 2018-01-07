const express = require('express'),
		fs = require('fs'),
		request = require('request'),
		cheerio = require('cheerio');

const app = express();

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
				res.send(JSON.stringify(json));
			})
		}

		
	})
})

app.post('/horoscope', function(req, res) {
	var Sign = req.body.result && req.body.result.parameters && req.body.result.parameters.horoscopeSign ? req.body.result.parameters.horoscopeSign: "Seems like some problem. Speak again.";
	if(Sign != "Seems like some problem. Speak again.") {
		url = 'http://www.prokerala.com/astrology/horoscope/?sign=' + Sign;

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
	}
	return res.json({
	    speech: todaysHoroscope,
	    displayText: todaysHoroscope,
	    source: "webhook-horoscope-sample"
	});
})

app.listen(process.env.PORT || 8000, function() {
  console.log("Server up and listening");
});