// This is a template for a Node.js scraper on morph.io (https://morph.io)

var cheerio = require("cheerio");
var request = require("request");
var sqlite3 = require("sqlite3").verbose();

function initDatabase(callback) {
	// Set up sqlite database.
	var db = new sqlite3.Database("data.sqlite");
	db.serialize(function() {
		db.run("CREATE TABLE IF NOT EXISTS data (name TEXT, desc TEXT, link TEXT)");
		callback(db);
	});
}

function updateRow(db, name, description, link) {
	// Insert some data.
	var statement = db.prepare("INSERT INTO data VALUES (?, ?, ?)");
	statement.run(name, description, link);
	statement.finalize();
}

function readRows(db) {
	// Read some data.
	db.each("SELECT rowid AS id, name FROM data", function(err, row) {
		console.log(row.id + ": " + row.name);
	});
}

function fetchPage(url, callback) {
	// Use request to read in pages.
	request(url, function (error, response, body) {
		if (error) {
			console.log("Error requesting page: " + error);
			return;
		}

		callback(body);
	});
}

var BASE_URL = "http://www.phrases.org.uk/meanings/";

function run(db) {
	// Use request to read in pages.
	fetchPage(BASE_URL + "phrases-and-sayings-list.html", function (body) {
		// Use cheerio to find things in the page with css selectors.
		var $ = cheerio.load(body);

		$("p.phrase-list a").each(function () {

			var phraseLink = $(this).href;

      fetchPage(BASE_URL + phraseLink, function (phraseBody) {

        var $ = cheerio.load(phraseBody);

        var phraseTitle = $(".content h1").text().trim();
        var phraseDesc = $(".meanings-body").text().trim();
        var phraseUrl = $(BASE_URL + phraseLink)

        updateRow(db, phraseTitle, phraseDesc, phraseUrl);
      });

		});

		readRows(db);

		db.close();
	});
}

initDatabase(run);
