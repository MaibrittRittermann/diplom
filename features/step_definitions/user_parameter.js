const User = require('../../model/User');
const {defineParameterType} = require('@cucumber/cucumber');

defineParameterType({
    name: "user",
    regexp: /Kent|Ole|Tom/,
    transformer: name => new User(name)
})