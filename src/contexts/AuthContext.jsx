import React, { createContext, useReducer, useEffect } from 'react'
import { api } from '../services/api'

export const AuthContext = createContext()

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      localStorage.setItem('token', action.payload.token)
      localStorage.setItem('user', JSON.stringify(action.payload.user))
      return {
        ...state,
        isAuthenticated: true,
        token: action.payload.token,
        user: action.payload.user,
        loading: false
      }
    case 'LOGOUT':
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      return {
        ...state,
        isAuthenticated: false,
        token: null,
        user: null,
        loading: false
      }
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    case 'INIT_AUTH':
      const token = localStorage.getItem('token')
      const user = localStorage.getItem('user')
      return {
        ...state,
        isAuthenticated: !!token,
        token: token,
        user: user ? JSON.parse(user) : null,
        loading: false
      }
    default:
      return state
  }
}

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    isAuthenticated: false,
    token: null,
    user: null,
    loading: true
  })

  useEffect(() => {
    dispatch({ type: 'INIT_AUTH' })
  }, [])

  const login = async (credentials) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const response = await api.login(credentials)
      
      
      const user = { username: credentials.userName, role: 'ADMIN' } 
      dispatch({ 
        type: 'LOGIN', 
        payload: { 
          token: response.token || '', 
          user 
        } 
      })
      return { success: true }
    } catch (error) {
      dispatch({ type: 'SET_LOADING', payload: false })
      return { success: false, error: error.message }
    }
  }

  const logout = () => {
    dispatch({ type: 'LOGOUT' })
  }

  return (
    <AuthContext.Provider value={{ ...state, login, logout, dispatch }}>
      {children}
    </AuthContext.Provider>
  )
}