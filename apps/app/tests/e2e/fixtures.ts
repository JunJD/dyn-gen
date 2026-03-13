import { expect, test as base, type Page } from "@playwright/test";

type WorkbenchFixtures = {
  workbenchPage: Page;
};

export async function openWorkspace(page: Page) {
  await page.goto("/");
  await expect(page.getByTestId("workspace-chat-panel")).toBeVisible();
}

export const test = base.extend<WorkbenchFixtures>({
  workbenchPage: async ({ page }, runFixture) => {
    await openWorkspace(page);
    await page.getByTestId("mode-toggle-app").click();
    await expect(page.getByTestId("workspace-app-panel")).toBeVisible();
    await expect(page.getByTestId("workbench-root")).toBeVisible();
    await runFixture(page);
  },
});

export { expect };

export async function addFirstShot(page: Page) {
  await page.getByTestId("canvas-add-shot").click();
  await expect(page.getByTestId("shot-row-1")).toBeVisible();
  await expect(page.getByTestId("image-job-card-1")).toBeVisible();
}

export function getShotRow(page: Page, shotNumber: number) {
  return page.getByTestId(`shot-row-${shotNumber}`);
}
