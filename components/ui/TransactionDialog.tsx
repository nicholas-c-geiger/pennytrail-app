'use client';
import React, { useState, useEffect } from 'react';

interface Transaction {
  id?: number;
  userId: number;
  amountCents: number;
  description: string;
  createdAt: Date;
}

interface TransactionDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (transaction: Transaction) => void;
  initialTransaction?: Transaction;
}

const emptyTransaction: Transaction = {
  userId: 0,
  amountCents: 0,
  description: '',
  createdAt: new Date(),
};

const TransactionDialog: React.FC<TransactionDialogProps> = ({
  open,
  onClose,
  onSave,
  initialTransaction,
}) => {
  const [transaction, setTransaction] = useState<Transaction>(
    initialTransaction || emptyTransaction,
  );

  useEffect(() => {
    setTransaction(initialTransaction || emptyTransaction);
  }, [initialTransaction, open]);

  if (!open) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTransaction((prev) => ({
      ...prev,
      [name]: name === 'amountCents' || name === 'userId' ? Number(value) : value,
    }));
  };

  const handleSave = () => {
    onSave({ ...transaction, createdAt: transaction.createdAt || new Date() });
  };

  return (
    <dialog open style={{ padding: 24, borderRadius: 8, minWidth: 320 }}>
      <h2>{transaction.id ? 'Edit Transaction' : 'Add Transaction'}</h2>
      <form
        style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
        onSubmit={(e) => {
          e.preventDefault();
          handleSave();
        }}
      >
        <label>
          User ID:
          <input
            name="userId"
            type="number"
            value={transaction.userId}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Amount (cents):
          <input
            name="amountCents"
            type="number"
            value={transaction.amountCents}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Description:
          <input
            name="description"
            value={transaction.description}
            onChange={handleChange}
            required
          />
        </label>
        <div style={{ marginTop: 16, textAlign: 'right' }}>
          <button type="button" onClick={onClose} style={{ marginRight: 8 }}>
            Cancel
          </button>
          <button type="submit">Save</button>
        </div>
      </form>
    </dialog>
  );
};

export type { Transaction };
export default TransactionDialog;
