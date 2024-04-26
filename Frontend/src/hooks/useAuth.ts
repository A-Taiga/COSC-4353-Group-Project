import { useContext, useDebugValue } from "react"
import AuthContext from "../context/AuthProvider"

const useAuth = () => {
  const { auth, setAuth } = useContext(AuthContext)
  useDebugValue(auth, (auth) => (auth?.user ? "Logged In" : "Logged Out"))
  return { auth, setAuth }
}

export default useAuth
