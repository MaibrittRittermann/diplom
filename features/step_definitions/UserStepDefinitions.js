const {Given, When, Then} = require('@cucumber/cucumber'); 
const User = require("../../model/User");

    Given('{user} is administrator', function (user) {
        return user.isAdmin;
    });

    Given('{user} is in the {string} dashboard', function (user, string) {
        return 'pending';
    });

    Then('{user} should see the Create user page', function (user) {
        return 'pending';
    });

    When('{user} fill in the field {string}', function (user, string) {
        return string.length > 0;
    });

    When('{user} fill in matching password in the field {string}', function (user, string) {
        return 'pending';
    });

    Then('new user {user} is created', function (user) {
        // Check database for new user
        return 'pending';
    });

    When('{user} fill in non matching entry in field {string}', function (user, string) {
        return 'pending';
    });

    Then('{user} should be informed to adjust passwords, so they match', function (user) {
        return 'pending';
    });
 
    When('{user} fill in the field {string} with an invalid email', function (user, string) {
        return 'pending';
    });

    Then('a pop up should inform that email is invalid', function () {
        return 'pending';
    });

    When('{user} have selected user {user}', function (user, user2) {
        return 'pending';
    });

    Then('the user {user} should be deleted', function (user) {
        return 'pending';
    });

    When('{user} try to delete {user}', function (user, user2) {
        return 'pending';
    });

    Then('the system should reject and inform {string}', function (string) {
        return 'pending';
    });
