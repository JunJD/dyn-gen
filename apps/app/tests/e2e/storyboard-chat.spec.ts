import { openWorkspace, expect, test } from "./fixtures";

// Source of truth: ../features/storyboard-chat.feature
test.describe("Feature: Storyboard chat loop", () => {
  test.fail(
    "Scenario: request a storyboard draft from chat @known-failure",
    async ({ page }) => {
      test.setTimeout(30_000);

      await openWorkspace(page);

      const prompt = "Create a 3-shot launch storyboard for a new camera bag";

      await page.getByTestId("chat-input").fill(prompt);
      await page.getByTestId("chat-send-button").click();

      await expect(page.getByTestId("chat-message-user-1")).toContainText(prompt);

      await expect(page.getByTestId("chat-message-assistant-1")).toContainText(
        /camera bag|launch storyboard|shot/i,
        { timeout: 20_000 },
      );
      await expect(page.getByTestId("summary-shot-count")).toContainText("3");
    },
  );
});
