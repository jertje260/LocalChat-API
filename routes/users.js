var express = require('express');
var router = express();
var Book;
var Author;
var _ = require('underscore');
var handleError;
var async = require('async');

/*
	TODO:
	- QueryString filter: topCategories={nummer}
		Tel alle boeken in een categorie
		Order deze categorie van meeste naar minste boeken
		Geef alleen de boeken terug die in de top {nummer} categorieën voorkomen
		(For now: Een boek kan maar 1 categorie hebben)

	// Ten slotte, een moeilijkere (door Async methodes)
	- Population: Vul alle autors van het boek
*/
function getUsers(req, res){
	var query = {};
	if(req.params.id){
		query._id = req.params.id.toLowerCase();
	}

	if(req.params.id){
		data = data[0];
	}
	res.json(data);
}

// Routing
router.route('/')
	.get(getUsers);

router.route('/:id')
	.get(getUsers);

// Export
module.exports = function (mongoose, errCallback){
	console.log('Initializing users routing module');
	User = mongoose.model('User');
	handleError = errCallback;
	return router;
};