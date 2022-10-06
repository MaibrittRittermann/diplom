Feature: Locate Fotos
  Background:
    Given users exist:
      | name          | email             | password      | type  |
      | Tom           | tom@epassiona.com | Diplom#2022   | user  |
    Given Tom is logged in
    And Tom is on the SearchPhotos page
  Scenario: No entries exist on subject
    When Tom enter an invalidtext searchstring 
    And press 'enter'
    Then Tom should see invaligtext not found
  Scenario: Entries found
    When Tom enter 'Mette Frederiksen'
    And press 'enter'
    Then Tom should see 'Results for Mette Frederiksen'
    And Photos of 'Mette Frederiksen'
  Scenario: Use photo
    When Tom choose download photo
    Then Tom should see 'Download screen'
    When Tom enter 'useFor'
    And choose 'useDate'
    Then 'Download' button is active
    When Tom 'click' 'Download' button
    Then Photo should download