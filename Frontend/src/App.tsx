import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import "./App.css"
// import StartPage from "./StartPage/StartPage"
import Login from "./pages/Login.tsx"
import Register from "./pages/Registration.tsx"
// import FuelQuoteForm from "./Components/FuelQuoteFormComponent"

export default function App() {
  return (
    // Router allows for client-side routing
    // Add your pages here and their routes
    <BrowserRouter>
      {/* Ensure BrowserRouter is used */}
      <Routes>
        <Route path="/">
          {/* public routes */}
          <Route index element={<Login />} />
          <Route path="login" element={<Navigate replace to="/" />} />
          <Route path="register" element={<Register />} />

          {/* protected routes */}
          {/* <Route element={<RequireAuth />}>
            <Route path="/fuel-quote" element={<FuelQuoteForm />} />
          </Route> */}

          {/* unavailable page in case of error */}
          {/* <Route path="unavailable" element={<Unavailable />} /> */}

          {/* catch all */}
          {/* <Route path="*" element={<Missing />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
