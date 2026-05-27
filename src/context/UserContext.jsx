import { createContext, useContext, useState } from 'react'

const Ctx = createContext(null)

export function UserProvider({ children }) {
  const [user, setUser] = useState(null)
  const [plan, setPlan] = useState('free')
  const [verified, setVerified] = useState(false)

  return (
    <Ctx.Provider value={{ user, setUser, plan, setPlan, verified, setVerified }}>
      {children}
    </Ctx.Provider>
  )
}

export function useUser() {
  return useContext(Ctx)
}
