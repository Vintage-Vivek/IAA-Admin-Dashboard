export function downloadQueriesAsCSV(data, filename = 'queries.csv') {
  if (!data || !data.length) return;

  const keys = ['S.No', 'Name', 'Phone', 'Query', 'Date/Time'];
  const csvRows = [keys.join(',')];

  data.forEach((row, idx) => {
    const serial = idx + 1;

    const name = row.name || '';

    let phone = row.phone || '';
    phone = phone.replace(/[^0-9]/g, ''); 
    if (phone.length > 10) phone = phone.slice(-10); 
    phone = '+91-' + phone;

    phone = `="${phone}"`;

    const query = row.query || '';


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
