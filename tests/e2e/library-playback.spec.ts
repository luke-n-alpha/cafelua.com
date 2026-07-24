import { expect, test } from "@playwright/test";

test("auto-turn and browser speech share the canonical ebook reader", async ({ page }) => {
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
    };
    Object.defineProperty(window, "SpeechSynthesisUtterance", {
      configurable: true,
      value: MockUtterance,
    });
    Object.defineProperty(window, "speechSynthesis", {
      configurable: true,
      value: {
        speak(utterance: MockUtterance) {
          state.__readerUtterance = utterance;
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

  await page.goto("/ko/library/harness-engineering/?read=1");
  await page.waitForFunction(() => {
    const counter = document.querySelector(".library-spread-navigation span")?.textContent ?? "";
    return /\/\s*[1-9]/u.test(counter);
  });

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
  expect(spokenText.length).toBeGreaterThan(20);

  await page.evaluate(() => {
    const state = window as typeof window & {
      __readerUtterance?: { onend: (() => void) | null };
    };
    state.__readerUtterance?.onend?.();
  });
  await expect(pageCounter).not.toHaveText(initialCounter ?? "", { timeout: 5_000 });
});
