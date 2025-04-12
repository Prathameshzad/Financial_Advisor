export const setAuthTokens = (tokens) => {
    localStorage.setItem('access_token', tokens.access_token)
    localStorage.setItem('refresh_token', tokens.refresh_token)
  }
  
  export const getAccessToken = () => {
    return localStorage.getItem('access_token')
  }
  
  export const getRefreshToken = () => {
    return localStorage.getItem('refresh_token')
  }
  
  export const clearAuthTokens = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
  }