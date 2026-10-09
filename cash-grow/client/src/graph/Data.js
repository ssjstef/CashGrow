import { useContext } from 'react';

  // Group transactions by week
  export function getWeeklySpendingData(transactions) {
    const weekMap = new Map();

    transactions.forEach(tx => { 
      const txDate = new Date(tx.Date);
      const monday = getWeekStartDate(txDate);
      const key = monday.toISOString().split("T")[0];
      const amount = parseFloat(tx.Amount) || 0;

      weekMap.set(key, (weekMap.get(key) || 0) + amount);
    });

    return Array.from(weekMap.entries())
      .sort((a, b) => new Date(a[0]) - new Date(b[0]))
      .map(([weekStart, spent]) => ({ weekStart, spent }));
  }

  export function createBubbles(userData) {
    const recipientMap = {};
  
    userData.forEach(entry => {
      const recipient = entry.Recipient?.trim();  
      const amount = parseFloat(entry.Amount);
  
      if (!recipient || isNaN(amount)) return;
  
      if (recipientMap[recipient]) {
        recipientMap[recipient] += amount;
      } else {
        recipientMap[recipient] = amount;
      }
    });
  
    const children = Object.entries(recipientMap).map(([name, value]) => ({
      name,
      value: +value.toFixed(2),
    }));
  
    return {
      name: "root",
      children
    };
  }

  export function getWeeklySpendingDataPerCategory( transactions ) {
    const weekMap = new Map();
  
    transactions.forEach(tx => {
      const txDate = new Date(tx.Date);
      const monday = getWeekStartDate(txDate);
      const weekKey = monday.toISOString().split("T")[0];
      const category = tx.Category || "Uncategorized";
      const amount = parseFloat(tx.Amount) || 0;
  
      if (!weekMap.has(weekKey)) {
        weekMap.set(weekKey, {});
      }
  
      const categoryTotals = weekMap.get(weekKey);
      categoryTotals[category] = (categoryTotals[category] || 0) + amount;
    });
  
    // Convert to array format for charting
    return Array.from(weekMap.entries())
      .sort((a, b) => new Date(a[0]) - new Date(b[0]))
      .map(([weekStart, categoryData]) => ({
        weekStart,
        ...categoryData
      }));
  }

  export function getWeekStartDate(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diffToMonday = (day === 0 ? -6 : 1) - day;
    d.setDate(d.getDate() + diffToMonday);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  export function getWeeklySpending(userData) {
    if (!Array.isArray(userData)) return 0;

    const today = new Date();
    const dayOfWeek = today.getDay();
    const diffToMonday = (dayOfWeek === 0 ? -6 : 1) - dayOfWeek;
    const monday = new Date(today);
    monday.setDate(today.getDate() + diffToMonday);
    monday.setHours(0, 0, 0, 0);

    let totalSpent = 0;

    userData.forEach(transaction => {
        const transactionDate = new Date(transaction.Date);
        if (
            transactionDate >= monday &&
            transactionDate <= today
            //transaction.InOut?.toLowerCase() === "out" 
        ) {
            totalSpent += parseFloat(transaction.Amount) || 0;
        }
    });

    return totalSpent;
}


