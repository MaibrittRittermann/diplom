Feature: Locate Photos
  Background:
    Given Users exist:
      | name          | email             | password      | type  |
      | Tom           | tom@epassiona.com | Diplom#2022   | user  |
    Given Tom is logged in

  Scenario: No Photo metadata exist on search subject
    When Tom search for photos with searchstring 'noSubject' 
    Then Tom recieves message 'noSubject findes ikke i vores database'

  Scenario: Photo metadata found on subject
    When Tom search for 'Mette Frederiksen'
    Then Tom sees Photos of 'Mette Frederiksen'
    
    
  Scenario: Use photo for production
    When Tom chooses to download selected photo
    And Tom enter 'useFor' and choose 'useDate'
    Then Photo is downloaded
    And Message is sent to ERP