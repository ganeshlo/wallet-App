import React, { useState } from 'react';

export default function Wallet() {
  const [balance, setBalance] = useState(1340.56);
  const [transactions, setTransactions] = useState([]);

  const handleAddMoney = () => {
    const input = prompt("Enter amount to add:");
    if (input === null) return;

    const amount = parseFloat(input);
    if (isNaN(amount)) {
      alert("Please enter a valid number");
      return;
    }
    
    if (amount <= 0) {
      alert("Amount must be greater than 0");
      return;
    }

    setBalance(prev => prev + amount);
    addTransaction("Deposit", amount, "received");
  };

  const handleWithdraw = () => {
    const input = prompt("Enter amount to withdraw:");
    if (input === null) return;

    const amount = parseFloat(input);
    if (isNaN(amount)) {
      alert("Please enter a valid number");
      return;
    }
    
    if (amount <= 0) {
      alert("Amount must be greater than 0");
      return;
    }
    
    if (amount > balance) {
      alert(`Insufficient funds. Your balance is $${balance.toFixed(2)}`);
      return;
    }

    setBalance(prev => prev - amount);
    addTransaction("Withdrawal", amount, "sent");
  };

  const addTransaction = (description, amount, type) => {
    const now = new Date();
    const today = now.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });

    const newItem = {
      id: `${now.getTime()}-${Math.random().toString(36).substr(2, 9)}`, // Unique ID
      name: type === "received" ? "Deposit" : "Withdrawal",
      description,
      time: now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
      }),
      amount,
      type,
      date: today
    };

    setTransactions(prev => {
      const updated = [...prev];
      const todayIndex = updated.findIndex(group => group.date === today);

      if (todayIndex >= 0) {
        // Check if this exact transaction already exists
        const exists = updated[todayIndex].items.some(
          item => item.id === newItem.id
        );
        if (!exists) {
          updated[todayIndex].items.unshift(newItem);
        }
      } else {
        updated.unshift({ 
          date: today, 
          items: [newItem] 
        });
      }

      return updated;
    });
  };

  return (
    <div className="max-w-sm mx-auto p-4 dark:bg-gray-900 dark:text-white min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-center">Wallet</h1>

      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mb-6">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">Your Balance</p>
          <p className="text-3xl font-bold">${balance.toFixed(2)}</p>
        </div>
        <div className="flex gap-2 mt-4">
          <button
            onClick={handleAddMoney}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg flex-1 hover:bg-blue-600 transition"
          >
            + Add Money
          </button>
          <button
            onClick={handleWithdraw}
            className="bg-yellow-500 text-white px-4 py-2 rounded-lg flex-1 hover:bg-yellow-600 transition"
          >
            Withdraw
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {transactions.length > 0 ? (
          transactions.map((group, groupIndex) => (
            <div key={group.date}>
              <h2 className="text-gray-500 text-sm mb-2 text-center dark:text-gray-400">
                {group.date}
              </h2>
              <div className="space-y-3">
                {group.items.map((item, itemIndex) => (
                  <div
                    key={`${groupIndex}-${itemIndex}-${item.id}`} // More unique key
                    className="flex items-center p-3 border-b border-gray-200 dark:border-gray-700"
                  >
                    <div
                      className={`w-8 h-8 rounded-md mr-3 flex items-center justify-center ${
                        item.type === "received"
                          ? "bg-green-100 text-green-600"
                          : "bg-yellow-100 text-yellow-600"
                      }`}
                    >
                      <span className="text-xl font-bold">
                        {item.type === "received" ? "↑" : "↓"}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-gray-500 text-sm dark:text-gray-400">
                            {item.description}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-gray-500 text-sm dark:text-gray-400">
                            {item.time}
                          </p>
                          <p
                            className={`font-medium ${
                              item.type === "received"
                                ? "text-green-600"
                                : "text-yellow-600"
                            }`}
                          >
                            {item.type === "received" ? "+" : "-"}$
                            {item.amount.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400 py-4">
            No transactions yet
          </p>
        )}
      </div>
    </div>
  );
}