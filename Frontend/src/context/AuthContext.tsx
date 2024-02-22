import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react"

const AuthContext = createContext<{
  auth: boolean
  setAuth: React.Dispatch<React.SetStateAction<boolean>>
}>({
  auth: false, // Initial default value
  setAuth: () => {}, // Placeholder function
})

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [auth, setAuth] = useState<boolean>(() => {
    // When the state initializes, read the value from local storage and convert it to boolean
    const storedAuth = localStorage.getItem("auth")
    return storedAuth ? JSON.parse(storedAuth) : false
  })

  useEffect(() => {
    // Assuming you want to store the auth state in local storage whenever it changes
    localStorage.setItem("auth", JSON.stringify(auth))
  }, [auth])

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
