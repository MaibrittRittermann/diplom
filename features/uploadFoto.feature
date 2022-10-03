Feature: Upload Photos
  Background:
    Given I am a registered user
    And I am logged in
    And I am on the 'Upload' page
  Scenario: Corrupt files or wrong format
    When When I attach Corrupt photos
    And Press the upload button
    Then I shoul see an error 'Fejl'
  Scenario: Photo content is recognised
    When I attach photos
    And Press the upload button
    Then the photos are uploaded
    And the photos are classified
  Scenario: Photo content is not recognised
    When I attach photos
    And Press the upload button
    Then the photos are uploaded
    When the photos are not recognised
    Then I am asked for information about photos
    When I submit
    Then the photos are classified