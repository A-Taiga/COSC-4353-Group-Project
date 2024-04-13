/*
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
*/

import React, { useEffect, useState } from 'react';
import '../styles/History.css';

interface FuelQuote {
    id: string;
    userId: string;
    gallonsRequested: string;
    deliveryDate: Date;
    deliveryAddress: string;
    suggestedPrice: string;
    totalPrice: string;
    createdAt: Date;
}

interface FuelQuoteHistoryProps {
    fuelQuotes?: FuelQuote[]; // Make fuelQuotes prop optional
    userIdToDisplay: string; // User ID to filter fuel quotes
}

const FuelQuoteHistory: React.FC<FuelQuoteHistoryProps> = ({ fuelQuotes, userIdToDisplay }) => {
    if (!fuelQuotes || fuelQuotes.length === 0) {
        return <div>Loading...</div>; // Or display a message indicating no data
    }

    // Filter fuel quotes based on userIdToDisplay
    const filteredFuelQuotes = fuelQuotes.filter(quote => quote.userId === userIdToDisplay);

    return (
        <div>
            <h2>Fuel Quote History</h2>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>User ID</th>
                        <th>Gallons Requested</th>
                        <th>Delivery Date</th>
                        <th>Delivery Address</th>
                        <th>Suggested Price</th>
                        <th>Total Price</th>
                        <th>Created At</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredFuelQuotes.map((quote) => (
                        <tr key={quote.id}>
                            <td>{quote.id}</td>
                            <td>{quote.userId}</td>
                            <td>{quote.gallonsRequested}</td>
                            <td>{quote.deliveryDate.toDateString()}</td>
                            <td>{quote.deliveryAddress}</td>
                            <td>{quote.suggestedPrice}</td>
                            <td>{quote.totalPrice}</td>
                            <td>{quote.createdAt.toDateString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const FuelQuotesPage: React.FC = () => {
    const [fuelQuotes, setFuelQuotes] = useState<FuelQuote[]>([]);
    const desiredUserId = "cc798fcb-2a90-4b19-a833-a1a3aa00f656";

    // Simulated fetch fuel quotes data
    useEffect(() => {
        // Simulated data
        const mockFuelQuotes: FuelQuote[] = [
            // Sample fuel quotes data
        ];
        setFuelQuotes(mockFuelQuotes);
    }, []);

    return (
        <div>
            {/* Render FuelQuoteHistory component with fuelQuotes data and desired user ID */}
            <FuelQuoteHistory fuelQuotes={fuelQuotes} userIdToDisplay={desiredUserId} />
        </div>
    );
};

export default FuelQuotesPage;
