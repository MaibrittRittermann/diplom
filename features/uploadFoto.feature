Feature: Upload Photos
  Background:
    Given Tom is a registered user
    And Tom is logged in
    And Tom is on the 'Upload' page

Rule: Maximum image size 1.5M

  Scenario: Corrupt files or wrong format
    When When Tom attach Corrupt photos
    And Tom click on 'upload'
    Then Tom should see an error 'Fejl'

  Scenario: Photo content is recognised
    When Tom attach photos
    And Tom click on 'upload'
    Then the photos are uploaded
    And the photos are classified
    
  Scenario: Photo content is not recognised
    When Tom attach photos
    And Tom click on 'upload'
    Then the photos are uploaded
    When the photos are not recognised
    Then Tom is asked for information about photos
    When Tom click on 'upload'
    Then the photos are classified