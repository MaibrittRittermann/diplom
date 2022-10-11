Feature: Upload Photos
  Background:
    Given Tom is a registered user
    And Tom is logged in
 
Rule: Maximum image size 1.5M

  Scenario: Corrupt files or wrong format
    When When Tom try to upload a Corrupt photos
    Then Tom recieves message 'Fejl'

  Scenario: Photo content is recognised
    When Tom try to upload photos
    Then the photos are uploaded
    And the photos are classified
    
  Scenario: Photo content is not recognised
    When Tom try to upload photos
    Then the photos are uploaded
    When the photos are not recognised
    Then Tom recieves message 'Oplys venligst om indholdet på billedet i nøgleord'
    When Tom fills in metadata
    Then the photos are classified