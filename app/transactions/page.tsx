const transactions = [
  {
    id: 1,
    userId: 101,
    amountCents: 2500,
    description: "Coffee shop purchase",
    createdAt: new Date("2024-05-01T10:30:00Z"),
  },
  {
    id: 2,
    userId: 101,
    amountCents: -1200,
    description: "Refund - groceries",
    createdAt: new Date("2024-05-02T14:15:00Z"),
  },
];

export default function TransactionsPage() {
  return (
    <main style={{ padding: 20 }}>
      <h1>Transactions</h1>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 20 }}>
        <thead>
          <tr>
            <th style={{ borderBottom: '1px solid #ccc', textAlign: 'left', padding: 8 }}>User ID</th>
            <th style={{ borderBottom: '1px solid #ccc', textAlign: 'right', padding: 8 }}>Amount</th>
            <th style={{ borderBottom: '1px solid #ccc', textAlign: 'left', padding: 8 }}>Description</th>
            <th style={{ borderBottom: '1px solid #ccc', textAlign: 'left', padding: 8 }}>Date</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map(tx => (
            <tr key={tx.id}>
              <td style={{ padding: 8 }}>{tx.userId}</td>
              <td style={{ padding: 8, textAlign: 'right' }}>{(tx.amountCents / 100).toFixed(2)}</td>
              <td style={{ padding: 8 }}>{tx.description ?? ''}</td>
              <td style={{ padding: 8 }}>{tx.createdAt.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
