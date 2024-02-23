import React, { useState } from 'react';
import '../styles/History.css';

interface Quote {
    transactionId: number;
    gallonsRequested: number;
    delivDate: string;
    delivAddress: string;
    suggestedPrice: number;
    totalAmountDue: number;
}

const DisplayHistory = () => {
  // Dummy quotes data for display, to be replaced with database fetching
  const [quotes] = useState<Quote[]>([
    {
        transactionId: 16782,
        gallonsRequested: 100,
        delivDate: "08-04-1980",
        delivAddress: "123 Nunya Ln. University, Texas 77000",
        suggestedPrice: 2.5,
        totalAmountDue: 250,
    },
    {
        transactionId: 23769,
        gallonsRequested: 20,
        delivDate: "02-13-1987",
        delivAddress: "123 Nunya Ln. University, Texas 77000",
        suggestedPrice: 2.5,
        totalAmountDue: 50,
      },
      {
        transactionId: 36540,
        gallonsRequested: 35,
        delivDate: "04-20-1991",
        delivAddress: "123 Nunya Ln. University, Texas 77000",
        suggestedPrice: 2.5,
        totalAmountDue: 87.5,
      },
      {
        transactionId: 41867,
        gallonsRequested: 180,
        delivDate: "01-02-1995",
        delivAddress: "123 Nunya Ln. University, Texas 77000",
        suggestedPrice: 2.5,
        totalAmountDue: 450,
      },
      {
        transactionId: 52008,
        gallonsRequested: 79,
        delivDate: "09-23-2007",
        delivAddress: "123 Nunya Ln. University, Texas 77000",
        suggestedPrice: 2.5,
        totalAmountDue: 197.5,
      },
  ]);

  return (
    <div id="fuelQuoteContainer">
      <h1 id = "tableTitle"> All Quotes</h1>
      <div id="quoteHistoryTableContainer">
        <table id="quoteHistoryTable">
          <thead>
            <tr>
              <th>Transaction Id</th>
              <th>Gallons Requested</th>
              <th>Delivery Date</th>
              <th>Delivery Address</th>
              <th>Suggested Price</th>
              <th>Total Amount Due</th>
            </tr>
          </thead>
          <tbody>
            {quotes.map((quote, index) => (
              <tr key={index}>
                <td>{quote.transactionId}</td>
                <td>{quote.gallonsRequested}</td>
                <td>{quote.delivDate}</td>
                <td>{quote.delivAddress}</td>
                <td>${quote.suggestedPrice.toFixed(2)}</td>
                <td>${quote.totalAmountDue.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DisplayHistory;