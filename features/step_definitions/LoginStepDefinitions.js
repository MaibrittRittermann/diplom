const { User } = require("../../model/User");
const {Given, When, Then, Before} = require('@cucumber/cucumber'); 
const {assertThat, is} = require('hamjest');

    Given('{user} is a registered user', function (user) {
        this.user = new User(user);
    });

    When('{user} tries to submut an empty loginform', function (user) {
        // Write code here that turns the phrase above into concrete actions
        return 'pending';
    });

    When('{user} tries to login with credentials {string} and {string}', function (user, string, string2) {
        // Write code here that turns the phrase above into concrete actions
        return 'pending';
    });

    Given('{user} is logged in', function (user) {
        return user.generateAuthToken();
    });
