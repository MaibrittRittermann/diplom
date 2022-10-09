Feature: users
  Background:
    Given users exist:
      | name          | email               | password          | type  |
      | Ole           | olfs@skivecollege.dk| Diplom#Admin-2022 | admin |
      | Kent          | kent@epassiona.com  | Diplom#2022       | user  |
    Given Ole is administrator
    And Ole is logged in
    And Ole is in the 'User' dashboard

  Scenario: Create user
    When Ole click on 'Create new'
    Then Ole should see the Create user page
    When Ole fill in the field 'first name'
    And Ole fill in the field 'lastname'
    And Ole fill in the field 'email'
    And Ole fill in the field 'password'
    And Ole fill in matching password in the field 'repeat password'
    Then new user Kent is created

  Scenario: Create user with non matching password in 'password field' and 'repeat password'
    When Ole click on 'Create new'
    Then Ole should see the Create user page
    When Ole fill in the field 'first name'
    And Ole fill in the field 'lastname'
    And Ole fill in the field 'email'
    And Ole fill in the field 'password'
    And Ole fill in non matching entry in field 'repeat password'
    Then Ole should be informed to adjust passwords, so they match

  Scenario: Create user with invalid email
    When Ole click on 'Create new'
    Then Ole should see the Create user page
    When Ole fill in the field 'first name'
    And Ole fill in the field 'lastname'
    And Ole fill in the field 'email' with an invalid email
    Then a pop up should inform that email is invalid

  Scenario: Delete Kent
    When Ole have selected user Kent
    And Ole click on 'Delete'
    Then the user Kent should be deleted
    
  Scenario: Delete last user (the last administrator) fail
    When Ole try to delete Ole
    Then the system should reject and inform 'Deletion fail because you are the last administrator on the system'