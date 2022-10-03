Feature: Login
  Background:
    Given I go to '/login'
    And the field 'email' is empty
    And the field 'password' is empty
  Scenario: Error on empty fields
    When I click on 'enter'
    Then field 'email' should be with error
    And field 'password' should be with error
  Scenario: Wrong password
    When I type 'projekt@rittermann.pro' in 'email'
    And I type '123456-ABC' in 'password'
    And I click on 'enter'
    Then I should see 'E-mail or password is incorrect'
  Scenario: Login successfully
    Given I have users:
      | name           | email             | password |
      | Test Bruger  | project@rittermann.pro  | Diplom#2022   |
    When I type 'project@rittermann.pro' in 'email'
    And I type 'Diplom#2022' in 'password'
    And I click on 'enter'
    Then I shouldn't see 'Access your account'