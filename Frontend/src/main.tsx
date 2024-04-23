import { ApiProvider } from "@reduxjs/toolkit/query/react"
import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App.tsx"
import { apiSlice } from "./api/apiSlice.ts"
import "./index.css"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ApiProvider api={apiSlice}>
      <App />
    </ApiProvider>
  </React.StrictMode>
)
