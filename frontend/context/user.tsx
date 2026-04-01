import { createContext, useEffect, useState } from "react"

const UserContext = createContext<{
    IsLoggedIn: boolean;
    onLogin: (user: { name: string; phoneNumber: string }) => void;
    user: { name: string; phoneNumber: string } | null;
    onLogout: () => void;
} | null>(null)

const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [user, setUser] = useState<{ name: string; phoneNumber: string } | null>(null)

    const onLogin = (user: { name: string; phoneNumber: string }) => {
        localStorage.setItem("user", JSON.stringify(user))
        setIsLoggedIn(true)
        setUser(user)
    }

    const onLogout = () => {
        localStorage.removeItem("user")
        setIsLoggedIn(false)
        setUser(null)
    }

    const intializeLoginState = () => {
        const userData = localStorage.getItem("user")
        const user = userData ? JSON.parse(userData) : null
        if (user) {
            setIsLoggedIn(true)
            setUser(user)
        }
    }

    useEffect(() => {
        intializeLoginState()
    }, [])

    return (
        <UserContext.Provider value={{ onLogout, IsLoggedIn: isLoggedIn, onLogin, user }}>
            {children}
        </UserContext.Provider>
    )
}

export { UserContext, UserProvider }

