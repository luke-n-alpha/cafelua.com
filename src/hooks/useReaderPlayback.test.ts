import { clampAutoTurnSeconds, readerPagesToText } from "./useReaderPlayback";

describe("reader playback helpers", () => {
  it("clamps automatic page-turn intervals", () => {
    expect(clampAutoTurnSeconds(1)).toBe(3);
    expect(clampAutoTurnSeconds(15.4)).toBe(15);
    expect(clampAutoTurnSeconds(999)).toBe(120);
  });

  it("extracts readable text from rendered page HTML", () => {
    expect(
      readerPagesToText([
        {
          chapterIndex: 0,
          chapterTitle: "Chapter",
          pageInChapter: 0,
          html: "<h2>Hello</h2><p>Reader <strong>world</strong>.</p>",
          usedHeight: 10,
          availableHeight: 20,
        },
      ]),
    ).toBe("Hello Reader world.");
  });
});
