Feature: Users
  Background:
    Given Users exist:
      | name          | email               | password          | admin   |
      | Ole           | olfs@skivecollege.dk| Diplom#Admin-2022 | true    |
      | Kent          | kent@epassiona.com  | Diplom#2022       | false   |
    Given Ole is administrator
    And Ole is logged in

  Scenario: Create user
    When Ole creates new user 
      | name          | email               | password          | admin  |
      | Tom           | tom@epassiona.com   | Diplom#2022       | false  |
    Then new user with email 'tom@epassiona.dk' is created

  Scenario: Create user with invalid email
    When Ole creates new user 
      | name          | email               | password          | admin  |
      | Bob           | Bob                 | Diplom#2022       | false  |
    Then Ole recieves message '"email" length must be at least 5 characters long'

  Scenario: Delete Kent
    When Ole deletes user Kent
    Then the user Kent should be deleted
    
  Scenario: Delete last user (the last administrator) fail
    When Ole deletes user Ole
    Then Ole recieves message 'Deletion fail because you are the last administrator on the system'