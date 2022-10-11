const {Given, When, Then} = require('@cucumber/cucumber'); 

When('{user} search for photos with searchstring {string}', function (user, string) {
  // Write code here that turns the phrase above into concrete actions
  return 'pending';
});

When('{user} search for {string}', function (user, string) {
  // Write code here that turns the phrase above into concrete actions
  return 'pending';
});

Then('{user} sees Photos of {string}', function (user, string) {
  // Write code here that turns the phrase above into concrete actions
  return 'pending';
});

When('{user} chooses to download selected photo', function (user) {
  // Write code here that turns the phrase above into concrete actions
  return 'pending';
});

When('{user} enter {string} and choose {string}', function (user, string, string2) {
  // Write code here that turns the phrase above into concrete actions
  return 'pending';
});

Then('Photo is downloaded', function () {
  // Write code here that turns the phrase above into concrete actions
  return 'pending';
});

Then('Message is sent to ERP', function () {
  // Write code here that turns the phrase above into concrete actions
  return 'pending';
});