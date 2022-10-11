Feature: Login
  Background:
    Given Users exist:
      | name          | email             | password      | type  |
      | Tom           | tom@epassiona.com | Diplom#2022   | user  |

  Scenario: Try to login with empty email and password fields
    When Tom tries to submut an empty loginform
    Then Tom recieves message '"email" is not allowed to be empty'

  Scenario: Try to login with wrong password
    When Tom tries to login with credentials 'tom@epassiona.com' and 'hemmelig'
    Then Tom recieves message 'Ugyldig email eller adgangskode'
    
  Scenario: Login successfully
    When Tom tries to login with credentials 'tom@epassiona.com' and 'Diplom#2022'
    Then Tom is logged in