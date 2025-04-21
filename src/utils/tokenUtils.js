export function getEmailFromToken() {
    const token = localStorage.getItem("idToken");
    if (!token) return null;
  
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.email || null;
    } catch (e) {
      console.error("Failed to parse token:", e);
      return null;
    }
  }
  