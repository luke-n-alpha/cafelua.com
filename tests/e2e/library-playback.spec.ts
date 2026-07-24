import { expect, test } from "@playwright/test";

test("Mars title spreads continue reading and playback modes are exclusive", async ({ page }) => {
  test.setTimeout(120_000);
  await page.addInitScript(() => {
    class MockUtterance {
      text: string;
      lang = "";
      rate = 1;
      voice = null;
      onstart: (() => void) | null = null;
      onend: (() => void) | null = null;
      onerror: (() => void) | null = null;

      constructor(text: string) {
        this.text = text;
      }
    }

    const state = window as typeof window & {
      __readerUtterance?: MockUtterance;
      __readerUtterances?: MockUtterance[];
    };
    state.__readerUtterances = [];
    Object.defineProperty(window, "SpeechSynthesisUtterance", {
      configurable: true,
      value: MockUtterance,
    });
    Object.defineProperty(window, "speechSynthesis", {
      configurable: true,
      value: {
        speak(utterance: MockUtterance) {
          state.__readerUtterance = utterance;
          state.__readerUtterances?.push(utterance);
          utterance.onstart?.();
        },
        cancel() {},
        pause() {},
        resume() {},
        getVoices() { return []; },
        addEventListener() {},
        removeEventListener() {},
      },
    });
  });

  await page.goto("/ko/library/mars-invasion/?read=1");
  await page.waitForFunction(() => {
    const counter = document.querySelector(".library-spread-navigation span")?.textContent ?? "";
    return /\/\s*[1-9]/u.test(counter);
  });

  await page.locator(".library-toc-toggle").click();
  await page.locator("#library-reader-toc button", { hasText: "1장. 전쟁의 전야" }).click();
  await page.waitForFunction(() =>
    document
      .querySelector("[data-reader-page-index] > header span")
      ?.textContent?.includes("1장. 전쟁의 전야"),
  );

  const pageCounter = page.locator(".library-spread-navigation span");
  const initialCounter = await pageCounter.textContent();
  await page.getByRole("button", { name: "읽기 재생 설정" }).click();
  await page.getByRole("spinbutton", { name: "자동 넘김" }).fill("3");
  const rate = page.getByRole("slider");
  await rate.focus();
  await page.keyboard.press("ArrowRight");
  await expect(pageCounter).toHaveText(initialCounter ?? "");
  await expect(rate).toHaveValue("1.1");
  await page.getByRole("button", { name: "시작", exact: true }).first().click();
  await page.getByRole("button", { name: "소리 내어 읽기" }).click();

  await page.waitForTimeout(3_400);
  await expect(pageCounter).toHaveText(initialCounter ?? "");
  const spokenText = await page.evaluate(() => {
    const state = window as typeof window & { __readerUtterance?: { text: string } };
    return state.__readerUtterance?.text ?? "";
  });
  expect(spokenText).toContain("01.");

  await page.evaluate(() => {
    const state = window as typeof window & {
      __readerUtterance?: { onend: (() => void) | null };
    };
    state.__readerUtterance?.onend?.();
  });
  await expect(pageCounter).not.toHaveText(initialCounter ?? "", { timeout: 2_000 });
  await page.waitForFunction(() => {
    const state = window as typeof window & { __readerUtterances?: unknown[] };
    return (state.__readerUtterances?.length ?? 0) >= 2;
  });
  const continuedText = await page.evaluate(() => {
    const state = window as typeof window & {
      __readerUtterances?: { text: string }[];
    };
    return state.__readerUtterances?.[1]?.text ?? "";
  });
  expect(continuedText).not.toBe(spokenText);

  const counterBeforeTimedTurn = await pageCounter.textContent();
  await page.getByRole("button", { name: "시작", exact: true }).first().click();
  await page.evaluate(() => {
    const state = window as typeof window & {
      __readerUtterances?: { onend: (() => void) | null }[];
    };
    state.__readerUtterances?.[1]?.onend?.();
  });
  await page.waitForTimeout(2_000);
  await expect(pageCounter).toHaveText(counterBeforeTimedTurn ?? "");
  await expect(pageCounter).not.toHaveText(counterBeforeTimedTurn ?? "", { timeout: 2_000 });
});
