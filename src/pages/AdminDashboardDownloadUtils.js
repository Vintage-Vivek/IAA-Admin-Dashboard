// Utility to convert data to CSV and trigger download
export function downloadQueriesAsCSV(data, filename = 'queries.csv') {
  if (!data || !data.length) return;
  const keys = Object.keys(data[0]);
  const csvRows = [keys.join(',')];
  for (const row of data) {
    csvRows.push(keys.map(k => {
      let value = String(row[k] ?? '');
      if (k.toLowerCase().includes('name') || k.toLowerCase().includes('phone')) {
        value = '\t' + value;
      }
      return '"' + value.replace(/"/g, '""') + '"';
    }).join(','));
  }
  const csvContent = csvRows.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
