export function splitMarkdownTable(
  markdown: string,
  pageCharacterLimit: number,
  isCompact: boolean,
) {
  const tableLines = markdown.trim().split("\n").filter(Boolean);
  if (tableLines.length <= 3) return [markdown];

  const tableHeader = tableLines.slice(0, 2);
  const tableRows = tableLines.slice(2);
  const maxRowsPerPage = isCompact ? 1 : 2;
  const tableCharacterLimit = Math.round(
    pageCharacterLimit * (isCompact ? 0.72 : 0.9),
  );
  const pages: string[] = [];
  let tablePageRows: string[] = [];
  let tablePageWeight = tableHeader.join("\n").length;

  const flushTablePage = () => {
    if (!tablePageRows.length) return;
    pages.push([...tableHeader, ...tablePageRows].join("\n"));
    tablePageRows = [];
    tablePageWeight = tableHeader.join("\n").length;
  };

  for (const row of tableRows) {
    const rowWeight = Math.max(80, row.length);
    if (
      tablePageRows.length > 0 &&
      (tablePageRows.length >= maxRowsPerPage ||
        tablePageWeight + rowWeight > tableCharacterLimit)
    ) {
      flushTablePage();
    }
    tablePageRows.push(row);
    tablePageWeight += rowWeight;
  }
  flushTablePage();

  return pages.length ? pages : [markdown];
}
