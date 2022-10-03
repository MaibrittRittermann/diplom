Feature: Locate Fotos
  Background:
    Given I am logged in
    And I am on the SearchPhotos page
  Scenario: No entries exist on subject
    When I enter an invalidtext searchstring 
    And press 'enter'
    Then I should see invaligtext not found
  Scenario: Entries found
    When I enter 'Mette Frederiksen'
    And press 'enter'
    Then I should see 'Results for Mette Frederiksen'
    And Photos of 'Mette Frederiksen'
  Scenario: Use photo
    When I choose download photo
    Then I should see 'Download screen'
    When I enter 'useFor'
    And choose 'useDate'
    Then 'Download' button is active
    When I 'click' 'Download' button
    Then Photo should download