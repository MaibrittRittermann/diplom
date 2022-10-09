const { User } = require("../../model/User");
const {Given, When, Then, Before} = require('@cucumber/cucumber'); 
const {assertThat, is} = require('hamjest');

    Before(function() {
        this.users = [];
    });

    Given('users exist:', function (dataTable) {
        dataTable.hashes().map((user) => {
            this.users[user.name] = new User({
                name : user.name, 
                email : user.email, 
                password : user.password, 
                isAdmin : user.isAdmin});
        });
    });

    Given('{user} is a registered user', function (user) {
        this.user = new User(user);
    });

    Given('{user} is logged in', function (user) {
        return 'pending';
    });

    Given('the field {string} is empty', function (string) {
        return 'pending';
    });

    Then('field {string} should be with error', function (string) {
        return 'pending';
    });

    When('{user} type {string} in {string}', function (user, string, string2) {
        return 'pending';
    });