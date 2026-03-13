@app-shell @chat
Feature: Storyboard chat loop
  The chat rail should be able to turn a prompt into an editable storyboard draft.

  Background:
    Given the motion workspace app is open
    And the chat rail is visible

  @known-failure
  Scenario: Request a storyboard draft from chat
    When I ask for a 3-shot launch storyboard for a new camera bag
    Then I should see my request in the chat rail
    And the assistant should answer with a storyboard draft
    And the workbench should show 3 storyboard shots
