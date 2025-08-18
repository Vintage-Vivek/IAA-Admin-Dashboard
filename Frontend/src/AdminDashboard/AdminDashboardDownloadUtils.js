// Utility to convert data to CSV and trigger download
export function downloadQueriesAsCSV(data, filename = 'queries.csv') {
  if (!data || !data.length) return;
  // Define the columns you want in the CSV (ID removed)
  const keys = ['S.No', 'Name', 'Phone', 'Query', 'Date/Time'];
  const csvRows = [keys.join(',')];
  data.forEach((row, idx) => {
    // Serial number
    const serial = idx + 1;
    // Name
    const name = row.name || '';
    // Phone (format as +91-XXXXXXXXXX, 10 digits only)
    let phone = row.phone || '';
    phone = phone.replace(/[^0-9]/g, ''); // Remove non-digits
    if (phone.length > 10) phone = phone.slice(-10); // Use last 10 digits
    phone = '+91-' + phone;
    // Query
    const query = row.query || '';
    // Date/Time (12-hour format with AM/PM)
    let dateTime = '';
    if (row.datetime) {
      dateTime = new Date(row.datetime).toLocaleString('en-US', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } else if (row.createdAt) {
      dateTime = new Date(row.createdAt).toLocaleString('en-US', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    }
    // Compose the row (ID removed)
    const values = [serial, name, phone, query, dateTime];
    csvRows.push(values.map(v => '"' + String(v).replace(/"/g, '""') + '"').join(','));
  });
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
