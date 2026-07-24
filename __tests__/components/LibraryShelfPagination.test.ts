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
      expect(page.split("\n").length - 2).toBeLessThanOrEqual(2);
    }
  });

  it("uses smaller row groups on compact readers", () => {
    const pages = splitMarkdownTable(table, 110, true);

    expect(pages.length).toBeGreaterThan(3);
    for (const page of pages) {
      expect(page.split("\n").length - 2).toBe(1);
    }
  });

  it("isolates a tall row instead of combining it with another row", () => {
    const tallTable = [
      "| Item | Description |",
      "| --- | --- |",
      "| Tall | " + "Detailed content ".repeat(30) + " |",
      "| Short | Brief content |",
    ].join("\n");

    const pages = splitMarkdownTable(tallTable, 420, false);

    expect(pages).toHaveLength(2);
    expect(pages[0]).toContain("| Tall |");
    expect(pages[0]).not.toContain("| Short |");
    expect(pages[1]).toContain("| Short |");
  });
});
