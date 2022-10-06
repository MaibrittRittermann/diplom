const { When, Then } = require('@cucumber/cucumber'); 

    When('When {user} attach Corrupt photo(s)', function (user) {
        return 'pending';
    });

    Then('{user} should see an error {string}', function (user, string) {
        return 'pending';
    });

    When('{user} attach photos', function (user) {
        return 'pending';
    });

    Then('the photo(s) is/are uploaded', function () {
        return 'pending';
    });

    Then('the photo(s) is/are classified', function () {
        return 'pending';
    });

    When('the photo(s) is/are not recognised', function () {
        return 'pending';
    });

    Then('{user} is asked for information about photo(s)', function () {
        return 'pending';
    });