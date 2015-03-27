//Mapping for the list of users to view models
//----------------------------mapping----------------------------
var mapping = {

    'users': {
        create: function(options) {
            return new User(options.data);
        }
    }
}

//Class for user with functions to update and delete
//---------------------------class User--------------------------
function User(data)
{
	var self = this;

	self._id = ko.observable(data._id);
	self.displayName = ko.observable(data.DisplayName);
	self.userName = ko.observable(data.UserName);
	self.Radius = ko.observable(data.RadiusM);

	self.isSelected = ko.observable(false);
	self.isNew = ko.observable(false);
	self.hasChanged = ko.computed(function(){
		var result = (self.displayName() != data.DisplayName || self.userName() != data.UserName || self.Radius() != data.RadiusM)
		return result;
	});

	self.editUser = function()
	{
		console.log("edit");
	};
}

//Class for user overview 
//----------------------class UserViewModel----------------------
function UserViewModel()
{
	var self = this;

	self.users = ko.observableArray([]);
	self.currentUser = ko.observable();

	//Method: Add the current user to the new field
	self.addUser = function()
	{
		var user = ko.mapping.toJSON(self.currentUser());

		$.ajax({
		    url: '/users', 
		    type: 'POST', 
		    contentType: 'application/json', 
		    data: '{"user": ' + user + "}",
		    success: function(result)
		    {
		    	self.refresh();
		    }
		});
	};

	//Method: Remove the currently selected user
	self.removeUser = function(user)
	{
		if(window.confirm("Are you sure you want to remove this user?")) 
		{
			$.ajax({
			    url: '/users/' + self.currentUser()._id(),
			    type: 'DELETE',
			    success: function(result) {
			        self.refresh();
			        self.currentUser(null);
			    }
			});
		}
	};

	self.updateUser = function()
	{
		var user = ko.mapping.toJSON(self.currentUser());

		$.ajax({
		    url: '/users/' + self.currentUser()._id(), 
		    type: 'PUT', 
		    contentType: 'application/json', 
		    data: '{"user": ' + user + "}",
		    success: function(result)
		    {
		    	self.refresh();
		    }
		});
	};

	//Method: Select user to current collection
	self.selectUser = function(item)
	{
		if(self.currentUser())
			self.currentUser().isSelected(false);

		item.isSelected(true);
		self.currentUser(item);
	}

	//Method: Refresh current collection from server
	self.refresh = function()
	{
		console.log('refreshing');
		$.getJSON("/users", function(users) { 
			console.log(users);
			self.users([]);
			ko.mapping.fromJS({users: users}, mapping, self);
		});
	}

	//Method: Turn the current user into a new user
	/*self.newUser = function(){
		self.currentUser(new User({
			firstname: "",
		    username: ""
		}));
		self.currentUser().isNew(true);
	};
*/
	//Init
	self.refresh();
}