export const handleDownload = async ({ data, filename }) => {
  const csv = convertToCSV(data);
  downloadHelperCSV(csv, filename);
};

export function convertToCSV(data) {
  if (!data || !data.length) return "";
  const headers = Object.keys(data[0]).join(",");
  const rows = data.map((obj) => Object.values(obj).join(",")).join("\n");
  return `${headers}\n${rows}`;
}

export function downloadHelperCSV(csv, filename) {
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${filename}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
