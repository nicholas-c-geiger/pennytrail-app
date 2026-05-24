'use client';
import { useState } from 'react';
import TransactionDialog, { Transaction } from '../../components/ui/TransactionDialog';

const initialTransactions: Transaction[] = [
  {
    id: 1,
    userId: 101,
    amountCents: 2500,
    description: 'Coffee shop purchase',
    createdAt: new Date('2024-05-01T10:30:00Z'),
  },
  {
    id: 2,
    userId: 101,
    amountCents: -1200,
    description: 'Refund - groceries',
    createdAt: new Date('2024-05-02T14:15:00Z'),
  },
];

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | undefined>(undefined);

  const handleSave = (tx: Transaction) => {
    setTransactions((prev) => {
      if (tx.id) {
        // Edit existing
        return prev.map((t) => (t.id === tx.id ? { ...tx } : t));
      } else {
        // Add new
        const newId = prev.length > 0 ? Math.max(...prev.map((t) => t.id ?? 0)) + 1 : 1;
        return [...prev, { ...tx, id: newId }];
      }
    });
    setDialogOpen(false);
    setEditingTransaction(undefined);
  };

  const handleEdit = (tx: Transaction) => {
    setEditingTransaction(tx);
    setDialogOpen(true);
  };

  return (
    <main style={{ padding: 20 }}>
      <h1>Transactions</h1>
      <button
        style={{ marginBottom: 16 }}
        onClick={() => {
          setEditingTransaction(undefined);
          setDialogOpen(true);
        }}
      >
        Add Transaction
      </button>
      <TransactionDialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setEditingTransaction(undefined);
        }}
        onSave={handleSave}
        initialTransaction={editingTransaction}
      />
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 20 }}>
        <thead>
          <tr>
            <th style={{ borderBottom: '1px solid #ccc', textAlign: 'left', padding: 8 }}>
              User ID
            </th>
            <th style={{ borderBottom: '1px solid #ccc', textAlign: 'right', padding: 8 }}>
              Amount
            </th>
            <th style={{ borderBottom: '1px solid #ccc', textAlign: 'left', padding: 8 }}>
              Description
            </th>
            <th style={{ borderBottom: '1px solid #ccc', textAlign: 'left', padding: 8 }}>Date</th>
            <th style={{ borderBottom: '1px solid #ccc', textAlign: 'left', padding: 8 }}>
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => (
            <tr key={tx.id}>
              <td style={{ padding: 8 }}>{tx.userId}</td>
              <td style={{ padding: 8, textAlign: 'right' }}>
                {(tx.amountCents / 100).toFixed(2)}
              </td>
              <td style={{ padding: 8 }}>{tx.description ?? ''}</td>
              <td style={{ padding: 8 }}>
                {tx.createdAt instanceof Date
                  ? tx.createdAt.toLocaleString()
                  : new Date(tx.createdAt).toLocaleString()}
              </td>
              <td style={{ padding: 8 }}>
                <button onClick={() => handleEdit(tx)}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
