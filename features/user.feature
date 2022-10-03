Feature: users
  Background:
    Given I am administrator
    And I am logged in
    And I am in the 'User' dashboard
  Scenario: Create user
    When I click on 'Create new'
    Then I should see the Create user page
    When I fill in the field 'first name'
    And I fill in the field 'lastname'
    And I fill in the field 'email'
    And I fill in the field 'password'
    And I fill in the field 'repeat password' with a matching password as in the first passwordfield
    Then a user is created
  Scenario: Create user with non matching password in 'password field' and 'repeat password'
    When I click on 'Create new'
    Then I should see the Create user page
    When I fill in the field 'first name'
    And I fill in the field 'lastname'
    And I fill in the field 'email'
    And I fill in the field 'password'
    And I fill in the field 'repeat password' with another password than entered in the first password field
    Then I should be informed to adjust passwords, so they match
  Scenario: Create user with invalid email
    When I click on 'Create new'
    Then I should see the Create user page
    When I fill in the field 'first name'
    And I fill in the field 'lastname'
    And I fill in the field 'email' with an invalid email
    Then a pop up should inform that email is invalid
  Scenario: Delete user
    When I have selected a user in the system
    And I click on 'Delete user'
    Then the user should be deleted
  Scenario: Delete last user (the last administrator) fail
    When I try to delete the last administrator (my self)
    Then the system should reject and inform 'Deletion fail because you are the last administrator on the system'