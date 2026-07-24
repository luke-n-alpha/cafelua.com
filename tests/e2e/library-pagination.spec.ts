import { expect, test } from "@playwright/test";

test("paginates rendered Markdown by measured layout", async ({ page }) => {
  test.setTimeout(120_000);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/ko/library/mars-invasion/?read=1");
  await page.waitForFunction(
    () => document.querySelector(".library-spread-navigation span")?.textContent?.includes("/"),
  );
  await page.waitForTimeout(1_500);

  const source = page.locator(".library-reader-measure-source");
  await expect(source.locator("h1, h2, h3").first()).toBeAttached();
  await expect(source.locator("img").first()).toBeAttached();
  await expect(source.locator("table").first()).toBeAttached();

  const assertNoOverflow = async () => {
    const overflow = await page
      .locator("[data-reader-page-index] .library-paper-content")
      .evaluateAll((contents) =>
        contents.map((content) => content.scrollHeight - content.clientHeight),
      );
    expect(Math.max(...overflow)).toBeLessThanOrEqual(1);
  };
  await assertNoOverflow();

  await page.locator(".library-toc-toggle").click();
  await page.locator("#library-reader-toc button").nth(33).click();
  await page.waitForFunction(() =>
    document
      .querySelector("[data-reader-page-index] > header span")
      ?.textContent?.includes("AI 소설 창작법"),
  );
  for (let offset = 0; offset < 12; offset += 1) {
    if (await page.locator("[data-reader-page-index] table").count()) break;
    await page.locator(".library-spread-navigation button").last().click();
  }

  const firstHeader = await page.locator("[data-reader-page-index] thead").textContent();
  const firstRows = await page.locator("[data-reader-page-index] tbody tr").allTextContents();
  expect(firstHeader).toContain("단계");
  expect(firstRows.length).toBeGreaterThan(0);
  await assertNoOverflow();

  await page.locator(".library-spread-navigation button").last().click();
  await expect(page.locator("[data-reader-page-index] thead")).toContainText("단계");
  const secondRows = await page.locator("[data-reader-page-index] tbody tr").allTextContents();
  expect(secondRows).not.toEqual(firstRows);
  await assertNoOverflow();

  const chapterBeforeReflow = await page
    .locator("[data-reader-page-index] > header span")
    .textContent();
  const totalBeforeReflow = await page.locator(".library-spread-navigation span").textContent();
  await page.locator(".library-font-size button").last().click();
  await expect(page.locator(".library-spread-navigation span")).not.toHaveText(
    totalBeforeReflow ?? "",
    { timeout: 30_000 },
  );
  await expect(page.locator("[data-reader-page-index] > header span")).toHaveText(
    chapterBeforeReflow ?? "",
  );
  await assertNoOverflow();
});
