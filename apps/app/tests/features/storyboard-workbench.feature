@app-shell @workbench
Feature: Storyboard workbench regression
  The storyboard shell should stay usable even before full media generation
  and backend orchestration are wired.

  Background:
    Given the motion workspace app is open
    And I switch from chat to the workbench surface

  @smoke
  Scenario: Add a shot and refresh preview
    When I add the first shot to the storyboard
    And I rename the shot to "Cold open"
    And I stage an output URL for the shot image job
    And I mark the image job as ready
    And I refresh the preview
    Then the ready shot count should be 1
    And the preview should report 1 scene
    And the preview status should be "Ready"
    And the preview scene label should be "Cold open"
    And the preview should record a refresh timestamp

  Scenario: Reorder storyboard shots and keep preview in sync
    When I add the first shot to the storyboard
    And I rename the first shot to "Pack hero"
    And I set the first shot duration to 5 seconds
    And I add a second shot to the storyboard
    And I rename the second shot to "Strap detail"
    And I set the second shot duration to 7 seconds
    And I move the second shot above the first shot
    Then the storyboard should still report 2 shots
    And the storyboard duration should stay at 12 seconds
    And the first preview scene label should be "Strap detail"
    And the second preview scene label should be "Pack hero"

  @failure
  Scenario: Mark a shot image job as failed
    When I add the first shot to the storyboard
    And I mark the image job as failed
    Then the shot status control should be "failed"
    And the image job status pill should read "Failed"
    And the image job error should mention retry or prompt revision

  Scenario: Reset a failed image job back to idle
    When I add the first shot to the storyboard
    And I queue the image job
    And I mark the image job as failed
    And I reset the image job
    Then the shot status control should be "draft"
    And the image job status pill should read "Idle"
    And the image job error should disappear
    And the preview status should be "Staged"

  Scenario: Delete a shot and collapse the preview timeline
    When I add the first shot to the storyboard
    And I rename the first shot to "Opening frame"
    And I set the first shot duration to 5 seconds
    And I add a second shot to the storyboard
    And I rename the second shot to "Closing frame"
    And I set the second shot duration to 7 seconds
    And I delete the first shot
    Then the storyboard should still report 1 shot
    And the storyboard duration should stay at 7 seconds
    And the first shot row should now be titled "Closing frame"
    And the preview should report 1 scene
    And the preview scene label should be "Closing frame"
