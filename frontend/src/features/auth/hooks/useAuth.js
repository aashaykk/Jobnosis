import { useContext } from "react";
import { AuthContext } from "../auth.context";
import { login, register, logout } from "../services/auth.api";

export const useAuth = () => {
    const context = useContext(AuthContext)
    const {user,setUser,loading, setLoading} = context

    const handleLogin = async({email, password}) => {
        setLoading(true)
        try {
            const data = await login(email, password)
            if (data && data.user) {
                setUser(data.user)
                return { success: true }
            } else {
                setUser(null)
                return { success: false, error: "Invalid response from server." }
            }
        } catch (error) {
            console.error("Login failed:", error)
            setUser(null)
            const errMsg = error.response?.data?.message || "Login failed. Please check your credentials."
            return { success: false, error: errMsg }
        } finally {
            setLoading(false)
        }
    }

    const handleRegister = async({username, email, password}) => {
        setLoading(true)
        try {
            const data = await register(username, email, password)
            if (data && data.user) {
                setUser(data.user)
                return { success: true }
            } else {
                setUser(null)
                return { success: false, error: "Invalid response from server." }
            }
        } catch (error) {
            console.error("Registration failed:", error)
            setUser(null)
            const errMsg = error.response?.data?.message || "Registration failed. Please try again."
            return { success: false, error: errMsg }
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = async() => {
        setLoading(true)
        try {
            const data = await logout()
            setUser(null)
        } catch (error) {
            console.error("Logout failed:", error)
        } finally {
            setLoading(false)
        }
    }

    return {user,loading,handleRegister, handleLogin, handleLogout}
}