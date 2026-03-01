const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
app.use(bodyParser.json());

// Serve frontend
app.use(express.static(path.join(__dirname, "public")));

let walletBalance = 1000;
let transactions = [];

// Home UI
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

// Wallet API
app.get("/api/wallet", (req, res) => {
  res.json({ balance: walletBalance });
});

// Add Money
app.post("/api/addmoney", (req, res) => {
  const { amount } = req.body;
  walletBalance += amount;

  transactions.push({
    type: "ADD MONEY",
    amount,
    time: new Date()
  });

  res.json({ balance: walletBalance });
});

// Pay Money
app.post("/api/pay", (req, res) => {
  const { amount } = req.body;

  if (walletBalance < amount) {
    return res.status(400).json({ message: "Insufficient Balance" });
  }

  walletBalance -= amount;

  transactions.push({
    type: "PAYMENT",
    amount,
    time: new Date()
  });

  res.json({ balance: walletBalance });
});

// Transactions
app.get("/api/transactions", (req, res) => {
  res.json(transactions);
});

app.listen(80, () => {
  console.log("🚀 Paytm Main App Running");
});
