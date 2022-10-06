const User = require("../../model/User");
const {Given, When, Then} = require('@cucumber/cucumber'); 
const {assertThat, is} = require('hamjest');

    Given('users exist:', function (dataTable) {
        this.tom = new User(dataTable, "tom@epassiona.com", "Diplom#2022");
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