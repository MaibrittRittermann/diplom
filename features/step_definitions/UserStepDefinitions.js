const {Given, When, Then, Before} = require('@cucumber/cucumber'); 
const {User} = require("../../model/User");
const {assertThat, is} = require('hamjest');

    Before(function() {
        this.users = [];
    });

    Given('Users exist:', function async (dataTable) {
        dataTable.hashes().map((user) => {
            this.users[user.name] = new User({
                name : user.name, 
                email : user.email, 
                password : user.password, 
                isAdmin : user.isAdmin});
        });

       
    });

    Given('{user} is administrator', function (user) {
        return user.isAdmin;
    });

    When('{user} creates new user', function (user, dataTable) {
        dataTable.hashes().map((user) => {
            this.users[user.name] = new User({
              name : user.name, 
              email : user.email, 
              password : user.password, 
              isAdmin : user.isAdmin});
          });
      });

    Then('new user with email {string} is created', function (string) {
        // let usr = User.find({email: email});
        assertThat(user.email, is(string));
    });

    Then('{user} recieves message {string}', function () {
        return 'pending';
    });

    Then('the user {user} should be deleted', function (user) {
        return 'pending';
    });

    When('{user} deletes user {user}', function (user, user2) {
        return 'pending';
    });

    Then('the system should reject and inform {string}', function (extectedMessage) {
        assertThat(extectedMessage, is('Deletion fail because you are the last administrator on the system'));
    });
