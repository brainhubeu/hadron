Feature: The Best

  As a Brainhub
  We want to become best in the world

  Scenario: Adding two numbers
    Given brainhub is the best
    When add "2" to "3"
    Then the result is "5"

  Scenario: Not adding two numbers
    Then the result is null
