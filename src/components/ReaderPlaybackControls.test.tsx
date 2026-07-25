import { act, fireEvent, render, screen, within } from "@testing-library/react";

import { libraryCopy } from "@/data/library/libraryCopy";
import type { MeasuredReaderPage } from "@/lib/library-dom-pagination";
import ReaderPlaybackControls from "./ReaderPlaybackControls";

const pages: MeasuredReaderPage[] = [
  {
    chapterIndex: 0,
    chapterTitle: "첫 장",
    pageInChapter: 0,
    html: "<h2>첫 장</h2><p>브라우저가 읽을 본문입니다.</p>",
    usedHeight: 100,
    availableHeight: 200,
  },
];
const nextPages: MeasuredReaderPage[] = [
  {
    ...pages[0],
    pageInChapter: 1,
    html: "<p>다음 펼침의 본문입니다.</p>",
  },
];

class MockUtterance {
  text: string;
  lang = "";
  rate = 1;
  voice: SpeechSynthesisVoice | null = null;
  onstart: (() => void) | null = null;
  onend: (() => void) | null = null;
  onerror: (() => void) | null = null;

  constructor(text: string) {
    this.text = text;
  }
}

describe("ReaderPlaybackControls", () => {
  const speak = jest.fn((utterance: MockUtterance) => utterance.onstart?.());
  const cancel = jest.fn();
  const pause = jest.fn();
  const resume = jest.fn();

  beforeEach(() => {
    jest.useFakeTimers();
    speak.mockClear();
    cancel.mockClear();
    pause.mockClear();
    resume.mockClear();
    Object.defineProperty(window, "speechSynthesis", {
      configurable: true,
      value: {
        speak,
        cancel,
        pause,
        resume,
        getVoices: () => [],
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      },
    });
    Object.defineProperty(window, "SpeechSynthesisUtterance", {
      configurable: true,
      value: MockUtterance,
    });
    Object.defineProperty(global, "SpeechSynthesisUtterance", {
      configurable: true,
      value: MockUtterance,
    });
    window.localStorage.clear();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  function renderControls(onAdvance = jest.fn()) {
    const view = render(
      <ReaderPlaybackControls
        pages={pages}
        pageIndex={0}
        pageStep={1}
        totalPages={2}
        locale="ko"
        copy={libraryCopy.ko.playback}
        onAdvance={onAdvance}
      />,
    );
    return { onAdvance, ...view };
  }

  it("turns the page after the configured interval", () => {
    const { onAdvance } = renderControls();
    fireEvent.click(screen.getByRole("button", { name: "읽기 재생 설정" }));
    const panel = screen.getByRole("region", { name: "읽기 재생 설정" });
    fireEvent.change(within(panel).getByRole("spinbutton", { name: "자동 넘김" }), {
      target: { value: "3" },
    });
    fireEvent.click(within(panel).getAllByRole("button", { name: "시작" })[0]);

    act(() => jest.advanceTimersByTime(2_999));
    expect(onAdvance).not.toHaveBeenCalled();
    act(() => jest.advanceTimersByTime(1));
    expect(onAdvance).toHaveBeenCalledTimes(1);
  });

  it("reads only the visible spread with the browser speech engine", () => {
    renderControls();
    fireEvent.click(screen.getByRole("button", { name: "소리 내어 읽기" }));

    expect(speak).toHaveBeenCalledTimes(1);
    const utterance = speak.mock.calls[0][0];
    expect(utterance.text).toBe("첫 장 브라우저가 읽을 본문입니다.");
    expect(utterance.lang).toBe("ko-KR");
  });

  it("stops auto-turn and continues to the next spread when speech ends", () => {
    const { onAdvance, rerender } = renderControls();
    fireEvent.click(screen.getByRole("button", { name: "읽기 재생 설정" }));
    const panel = screen.getByRole("region", { name: "읽기 재생 설정" });
    fireEvent.change(within(panel).getByRole("spinbutton", { name: "자동 넘김" }), {
      target: { value: "3" },
    });
    fireEvent.click(within(panel).getAllByRole("button", { name: "시작" })[0]);
    fireEvent.click(screen.getByRole("button", { name: "소리 내어 읽기" }));

    act(() => jest.advanceTimersByTime(10_000));
    expect(onAdvance).not.toHaveBeenCalled();

    act(() => speak.mock.calls[0][0].onend?.());
    expect(onAdvance).toHaveBeenCalledTimes(1);

    rerender(
      <ReaderPlaybackControls
        pages={nextPages}
        pageIndex={1}
        pageStep={1}
        totalPages={3}
        locale="ko"
        copy={libraryCopy.ko.playback}
        onAdvance={onAdvance}
      />,
    );
    act(() => jest.advanceTimersByTime(0));
    expect(speak).toHaveBeenCalledTimes(2);
    expect(speak.mock.calls[1][0].text).toBe("다음 펼침의 본문입니다.");
  });

  it("stops speech when auto-turn starts and ignores the stale utterance", () => {
    const { onAdvance } = renderControls();
    fireEvent.click(screen.getByRole("button", { name: "소리 내어 읽기" }));
    const staleUtterance = speak.mock.calls[0][0];

    fireEvent.click(screen.getByRole("button", { name: "읽기 재생 설정" }));
    const panel = screen.getByRole("region", { name: "읽기 재생 설정" });
    fireEvent.change(within(panel).getByRole("spinbutton", { name: "자동 넘김" }), {
      target: { value: "3" },
    });
    fireEvent.click(within(panel).getAllByRole("button", { name: "시작" })[0]);

    act(() => staleUtterance.onend?.());
    expect(onAdvance).not.toHaveBeenCalled();
    act(() => jest.advanceTimersByTime(2_999));
    expect(onAdvance).not.toHaveBeenCalled();
    act(() => jest.advanceTimersByTime(1));
    expect(onAdvance).toHaveBeenCalledTimes(1);
  });
});
