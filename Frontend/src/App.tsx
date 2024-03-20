import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import "./App.css"
import Login from "./pages/Login.tsx"
import Register from "./pages/Registration.tsx"
import StartPage from "./pages/StartPage.tsx"
// import RequireAuth from "./components/RequireAuth.tsx"
import Layout from "./components/Layout.tsx"
import FuelQuote from "./pages/FuelQuote.tsx"
import History from "./pages/History.tsx"
import Profile from "./pages/Profile.tsx"

export default function App() {
  return (
    // Router allows for client-side routing
    // Add your pages here and their routes
    <BrowserRouter>
      {/* Ensure BrowserRouter is used */}
      <Routes>
        <Route path="/" >
          {/* public routes */}
          <Route index element={<StartPage />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />

          {/* protected routes */}
          {/* <Route element={<RequireAuth />}> */}
          <Route path="/" element={<Layout />}>
            <Route path="fuel-quote" element={<FuelQuote />} />
            <Route index element={<Navigate to="fuel-quote" replace />} />
            <Route path="history" element={<History />} />
            <Route path="profile" element={<Profile />} />
          </Route>
          {/* </Route> */}

          {/* unavailable page in case of error */}
          {/* <Route path="unavailable" element={<Unavailable />} /> */}

          {/* catch all */}
          {/* <Route path="*" element={<Missing />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
