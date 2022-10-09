Feature: Login
  Background:
    Given users exist:
      | name          | email             | password      | type  |
      | Tom           | tom@epassiona.com | Diplom#2022   | user  |
    Given Tom is on the '/login' page
    And the field 'email' is empty
    And the field 'password' is empty

  Scenario: Error on empty fields
    When press 'enter'
    Then field 'email' should be with error
    And field 'password' should be with error

Rule: Maximum length of email 255 characters
Rule: Maximum length of password 255 characters
  Scenario: Wrong password
    When Tom type 'tom@epassiona.com' in 'email'
    And Tom type '123456-ABC' in 'password'
    And press 'enter'
    Then Tom should see 'E-mail or password is incorrect'
    
  Scenario: Login successfully
    When Tom type 'tom@epassiona.com' in 'email'
    And Tom type 'Diplom#2022' in 'password'
    And press 'enter'
    Then Tom should see 'Access your account'