import { ReactNode, createContext, useEffect, useState } from "react"

interface AuthState {
  // Define the properties of the auth object here
  user?: string
  fingerprint?: string
}

interface AuthContextType {
  auth: AuthState
  setAuth: React.Dispatch<React.SetStateAction<AuthState>>
}

const AuthContext = createContext<AuthContextType>({
  auth: {}, // Provide a default value for auth
  setAuth: () => {}, // Provide a default function for setAuth
})

interface AuthProviderProps {
  children: JSX.Element | ReactNode
}
export const AuthProvider: React.FC<AuthProviderProps> = ({
  children,
}): JSX.Element | ReactNode => {
  const [auth, setAuth] = useState<AuthState>(() => {
    const sessionAuthData = sessionStorage.getItem("auth")
    return sessionAuthData ? JSON.parse(sessionAuthData) : {}
  })

  // Sync auth state to sessionStorage
  useEffect(() => {
    sessionStorage.setItem("auth", JSON.stringify(auth))
  }, [auth])

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
