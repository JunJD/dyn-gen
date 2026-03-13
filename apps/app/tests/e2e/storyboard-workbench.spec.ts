import { addFirstShot, expect, getShotRow, test } from "./fixtures";

// Source of truth: ../features/storyboard-workbench.feature
test.describe("Feature: Storyboard workbench", () => {
  test("Scenario: add a shot and refresh preview @smoke", async ({ workbenchPage }) => {
    await addFirstShot(workbenchPage);
    const firstShotRow = getShotRow(workbenchPage, 1);

    await firstShotRow.getByTestId("shot-title-1").fill("Cold open");
    await workbenchPage
      .getByTestId("image-job-output-url-1")
      .fill("file:///tmp/storyboard-shot-1.png");
    await workbenchPage.getByTestId("image-job-mark-ready-1").click();

    await expect(workbenchPage.getByTestId("summary-ready-count")).toContainText("1");
    await expect(workbenchPage.getByTestId("preview-scene-count")).toContainText("1");
    await expect(workbenchPage.getByTestId("preview-status-value")).toHaveAttribute(
      "data-state-key",
      "ready",
    );
    await expect(workbenchPage.getByTestId("preview-scene-label-1")).toHaveText("Cold open");

    await workbenchPage.getByTestId("preview-refresh-button").click();
    await expect(workbenchPage.getByTestId("preview-last-refresh")).toBeVisible();
  });

  test("Scenario: reorder storyboard shots and keep preview in sync", async ({ workbenchPage }) => {
    await addFirstShot(workbenchPage);
    const firstShotRow = getShotRow(workbenchPage, 1);

    await firstShotRow.getByTestId("shot-title-1").fill("Pack hero");
    await firstShotRow.getByTestId("shot-duration-1").fill("5");

    await workbenchPage.getByTestId("canvas-add-shot").click();
    await expect(workbenchPage.getByTestId("shot-row-2")).toBeVisible();
    const secondShotRow = getShotRow(workbenchPage, 2);

    await secondShotRow.getByTestId("shot-title-2").fill("Strap detail");
    await secondShotRow.getByTestId("shot-duration-2").fill("7");

    await expect(workbenchPage.getByTestId("summary-shot-count")).toContainText("2");
    await expect(workbenchPage.getByTestId("summary-duration")).toContainText("12");
    await expect(workbenchPage.getByTestId("preview-scene-label-1")).toHaveText("Pack hero");
    await expect(workbenchPage.getByTestId("preview-scene-label-2")).toHaveText(
      "Strap detail",
    );

    await secondShotRow.getByTestId("shot-move-up-2").click();

    await expect(getShotRow(workbenchPage, 1).getByTestId("shot-title-1")).toHaveValue(
      "Strap detail",
    );
    await expect(getShotRow(workbenchPage, 2).getByTestId("shot-title-2")).toHaveValue(
      "Pack hero",
    );
    await expect(workbenchPage.getByTestId("preview-scene-label-1")).toHaveText(
      "Strap detail",
    );
    await expect(workbenchPage.getByTestId("preview-scene-label-2")).toHaveText("Pack hero");
    await expect(workbenchPage.getByTestId("preview-duration")).toContainText("12");
  });

  test("Scenario: mark a shot image job as failed", async ({ workbenchPage }) => {
    await addFirstShot(workbenchPage);
    const firstShotRow = getShotRow(workbenchPage, 1);

    await expect(workbenchPage.getByTestId("preview-status-value")).toHaveAttribute(
      "data-state-key",
      "staged",
    );
    await workbenchPage.getByTestId("image-job-mark-failed-1").click();

    await expect(firstShotRow.getByTestId("shot-status-1")).toHaveValue("failed");
    await expect(workbenchPage.getByTestId("image-job-status-1")).toHaveAttribute(
      "data-status-key",
      "failed",
    );
    await expect(workbenchPage.getByTestId("image-job-error-1")).toBeVisible();
  });

  test("Scenario: reset a failed image job back to idle", async ({ workbenchPage }) => {
    await addFirstShot(workbenchPage);
    const firstShotRow = getShotRow(workbenchPage, 1);

    await workbenchPage.getByTestId("image-job-queue-1").click();
    await expect(firstShotRow.getByTestId("shot-status-1")).toHaveValue("generating");
    await expect(workbenchPage.getByTestId("image-job-status-1")).toHaveAttribute(
      "data-status-key",
      "queued",
    );

    await workbenchPage.getByTestId("image-job-mark-failed-1").click();
    await expect(workbenchPage.getByTestId("image-job-error-1")).toBeVisible();

    await workbenchPage.getByTestId("image-job-reset-1").click();

    await expect(firstShotRow.getByTestId("shot-status-1")).toHaveValue("draft");
    await expect(workbenchPage.getByTestId("image-job-status-1")).toHaveAttribute(
      "data-status-key",
      "idle",
    );
    await expect(workbenchPage.getByTestId("image-job-error-1")).toHaveCount(0);
    await expect(workbenchPage.getByTestId("preview-status-value")).toHaveAttribute(
      "data-state-key",
      "staged",
    );
  });

  test("Scenario: delete a shot and collapse the preview timeline", async ({ workbenchPage }) => {
    await addFirstShot(workbenchPage);
    const firstShotRow = getShotRow(workbenchPage, 1);

    await firstShotRow.getByTestId("shot-title-1").fill("Opening frame");
    await firstShotRow.getByTestId("shot-duration-1").fill("5");

    await workbenchPage.getByTestId("canvas-add-shot").click();
    await expect(workbenchPage.getByTestId("shot-row-2")).toBeVisible();
    const secondShotRow = getShotRow(workbenchPage, 2);

    await secondShotRow.getByTestId("shot-title-2").fill("Closing frame");
    await secondShotRow.getByTestId("shot-duration-2").fill("7");

    await firstShotRow.getByTestId("shot-delete-1").click();

    await expect(workbenchPage.getByTestId("summary-shot-count")).toContainText("1");
    await expect(workbenchPage.getByTestId("summary-duration")).toContainText("7");
    await expect(workbenchPage.getByTestId("preview-scene-count")).toContainText("1");
    await expect(getShotRow(workbenchPage, 1).getByTestId("shot-title-1")).toHaveValue(
      "Closing frame",
    );
    await expect(workbenchPage.getByTestId("preview-scene-label-1")).toHaveText(
      "Closing frame",
    );
    await expect(workbenchPage.getByTestId("preview-duration")).toContainText("7");
  });
});
