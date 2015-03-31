function saveUser(err){
	console.log("Save");
	if(err){
		res.send(err + user);
	}
	else{
		res.send(user);
	}
}