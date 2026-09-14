import React, { createContext, useContext, useState, useEffect } from "react"

export type UserRole = "Control Room Operator" | "Senior Investigator" | "System Administrator" | "Field Officer"

interface AuthContextType {
  role: UserRole
  operatorName: string
  badgeNumber: string
  setRole: (role: UserRole) => void
  setOperatorName: (name: string) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>("Control Room Operator")
  const [operatorName, setOperatorName] = useState<string>("Officer K. Patel")
  const [badgeNumber, setBadgeNumber] = useState<string>("GP-AHM-4082")

  useEffect(() => {
    switch (role) {
      case "Control Room Operator":
        setOperatorName("Officer K. Patel")
        setBadgeNumber("GP-AHM-4082")
        break
      case "Senior Investigator":
        setOperatorName("Insp. V. Sharma")
        setBadgeNumber("GP-INV-1029")
        break
      case "System Administrator":
        setOperatorName("Admin A. Raj")
        setBadgeNumber("GP-SYS-0001")
        break
      case "Field Officer":
        setOperatorName("Sub-Insp. M. Desai")
        setBadgeNumber("GP-FLD-8821")
        break
    }
  }, [role])

  return (
    <AuthContext.Provider value={{ role, operatorName, badgeNumber, setRole, setOperatorName }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
