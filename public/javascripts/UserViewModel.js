//Mapping for the list of users to view models
//----------------------------mapping----------------------------
var mapping = {

    'users': {
        create: function(options) {
            return new User(options.data);
        }
    }
}


// validation for passwords.
/*ko.validation.rules['confirmPasswordMatches'] = {
    validator: function (val, params) {
        var otherValue = params;
        return val === ko.validation.utils.getValue(otherValue);
    },
    message: 'Passwords do not match.',
};
ko.validation.registerExtenders();*/


//Class for user with functions to update and delete
//---------------------------class User--------------------------
function User(data)
{
	var self = this;

	self._id = ko.observable(data._id);
	self.DisplayName = ko.observable(data.DisplayName);
	self.UserName = ko.observable(data.UserName);
	self.RadiusM = ko.observable(data.RadiusM).extend(/*{number:true}*/);
	self.password = ko.observable()/*.extend({
		required: { 
			message: 'Password is required',
			params: true,
			onlyIf: self.isNew()
			}
		})*/;
	self.passwordConfirm = ko.observable()/*.extend({
		confirmPasswordMatches: {
			params: self.password,
			onlyIf: self.isNew()
		}
	})*/;

	self.errors = ko.validation.group(self);
	self.isSelected = ko.observable(false);
	self.isNew = ko.observable(false);
	self.hasChanged = ko.computed(function(){ 
		//var noErrors = (self.errors().length === 0)
		var result = (self.DisplayName() != data.DisplayName || self.UserName() != data.UserName || self.RadiusM() != data.RadiusM)
		/*if(result == true && noErrors == true){
			return true;
		} else {
			return false;
		}*/
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
		if(self.currentUser())
		var user = ko.mapping.toJSON(self.currentUser());
		console.log(user);
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
		$.getJSON("/users", function(users) { 
			self.users([]);
			ko.mapping.fromJS({users: users}, mapping, self);
		});
	}

	//Method: Turn the current user into a new user
	self.newUser = function(){
		self.currentUser(new User({
			DisplayName: "",
		    UserName: "",
		    RadiusM:"",
		    password1:"",
		    password2:""
		}));
		self.currentUser().isNew(true);
	};

	//Init
	self.refresh();
}