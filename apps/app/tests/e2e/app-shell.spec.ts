import { openWorkspace, expect, test } from "./fixtures";

// Source of truth: shell containment regression for DYN-22
test.describe("Feature: App shell containment", () => {
  test("Scenario: keep viewport scrolling pinned to the chat rail", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await openWorkspace(page);

    const initialMetrics = await page.evaluate(() => {
      const chatScroller = document.querySelector<HTMLElement>(
        '[data-testid="chat-scroll-container"]',
      );

      return {
        viewportHeight: window.innerHeight,
        documentScrollHeight: document.documentElement.scrollHeight,
        bodyScrollHeight: document.body.scrollHeight,
        chatOverflowY: chatScroller
          ? window.getComputedStyle(chatScroller).overflowY
          : null,
      };
    });

    expect(initialMetrics.documentScrollHeight - initialMetrics.viewportHeight).toBeLessThanOrEqual(
      1,
    );
    expect(initialMetrics.bodyScrollHeight - initialMetrics.viewportHeight).toBeLessThanOrEqual(
      1,
    );
    expect(initialMetrics.chatOverflowY).toBe("auto");

    await page.evaluate(() => {
      window.scrollTo(0, 240);
    });

    await expect
      .poll(async () => page.evaluate(() => window.scrollY))
      .toBeLessThanOrEqual(1);

    const chatScrollMetrics = await page.evaluate(async () => {
      const chatScroller = document.querySelector<HTMLElement>(
        '[data-testid="chat-scroll-container"]',
      );

      if (!chatScroller) {
        throw new Error("Missing chat scroll container");
      }

      const spacer = document.createElement("div");
      spacer.setAttribute("data-testid", "chat-scroll-spacer");
      spacer.style.height = "1600px";
      spacer.style.width = "100%";
      chatScroller.appendChild(spacer);

      const windowScrollBefore = window.scrollY;
      chatScroller.scrollTop = 480;

      await new Promise((resolve) => window.requestAnimationFrame(resolve));

      return {
        chatClientHeight: chatScroller.clientHeight,
        chatScrollHeight: chatScroller.scrollHeight,
        chatScrollTop: chatScroller.scrollTop,
        windowScrollBefore,
        windowScrollAfter: window.scrollY,
      };
    });

    expect(chatScrollMetrics.chatScrollHeight).toBeGreaterThan(
      chatScrollMetrics.chatClientHeight,
    );
    expect(chatScrollMetrics.chatScrollTop).toBeGreaterThan(0);
    expect(chatScrollMetrics.windowScrollAfter).toBe(chatScrollMetrics.windowScrollBefore);
  });
});
