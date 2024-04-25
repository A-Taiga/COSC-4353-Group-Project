import React, { useEffect, useState } from "react"
import { useGetHisotyrQuery } from "../api/apiSlice"
import "../styles/History.css"
interface FuelQuote {
  id: string
  userId: string
  gallonsRequested: string
  deliveryDate: string
  deliveryAddress: string
  suggestedPrice: string
  totalPrice: string
  createdAt: Date
}

const FuelQuotesPage: React.FC = () => {
  const [fuelQuotes, setFuelQuotes] = useState<FuelQuote[]>([])
  const { data, isSuccess, isLoading } = useGetHisotyrQuery({})

  // Fetch fuel quotes data
  useEffect(() => {
    if (data && isSuccess) {
      setFuelQuotes(data.fuelQuotes)
    }
  }, [data, isSuccess])

  return isLoading ? (
    <div>Loading...</div>
  ) : (
    <div id="fuelQuoteContainer">
      <h1 id="tableTitle">All Quotes</h1>
      <div id="quoteHistoryTableContainer">
        <table id="quoteHistoryTable">
          <thead>
            <tr>
              <th>Submit Date</th>
              <th>Gallons Requested</th>
              <th>Delivery Date</th>
              <th>Delivery Address</th>
              <th>Suggested Price</th>
              <th>Total Amount Due</th>
            </tr>
          </thead>
          <tbody>
            {fuelQuotes.map((quote, index) => (
              <tr key={index}>
                <td>{new Date(quote.createdAt).toLocaleDateString()}</td>
                <td>{quote.gallonsRequested}</td>
                <td>{new Date(quote.deliveryDate).toLocaleDateString()}</td>
                <td>{quote.deliveryAddress}</td>
                <td>${parseFloat(quote.suggestedPrice).toFixed(2)}</td>
                <td>${parseFloat(quote.totalPrice).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default FuelQuotesPage
