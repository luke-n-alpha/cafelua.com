import { splitMarkdownTable } from "@/lib/library-table-pagination";

describe("library table pagination", () => {
  const table = [
    "| Item | Description |",
    "| --- | --- |",
    ...Array.from(
      { length: 14 },
      (_, index) =>
        "| Row " +
        (index + 1) +
        " | A sufficiently detailed description for this row |",
    ),
  ].join("\n");

  it("splits long tables and repeats their header on every page", () => {
    const pages = splitMarkdownTable(table, 420, false);

    expect(pages.length).toBeGreaterThan(1);
    for (const page of pages) {
      expect(page).toContain("| Item | Description |");
      expect(page).toContain("| --- | --- |");
      expect(page.split("\n").length - 2).toBeLessThanOrEqual(6);
    }
  });

  it("uses smaller row groups on compact readers", () => {
    const pages = splitMarkdownTable(table, 110, true);

    expect(pages.length).toBeGreaterThan(3);
    for (const page of pages) {
      expect(page.split("\n").length - 2).toBeLessThanOrEqual(3);
    }
  });
});
