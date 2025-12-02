// SessionContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { IUser, UserRole } from "../app/types";
import { setCookie } from "@/app/utilities/cookie";

// ============================================================================
// SESSION TYPES
// ============================================================================

type IUserSession = Omit<IUser, "password">;

interface SessionContextType {
  user: IUserSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (user: IUserSession) => void;
  hasRole: (roles: UserRole | UserRole[]) => boolean;
}

// ============================================================================
// CONTEXT CREATION
// ============================================================================

const SessionContext = createContext<SessionContextType | undefined>(undefined);

// ============================================================================
// PROVIDER COMPONENT
// ============================================================================

interface SessionProviderProps {
  children: ReactNode;
}

export const SessionProvider: React.FC<SessionProviderProps> = ({ children }) => {
  const [user, setUser] = useState<IUserSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      // Use any protected endpoint to validate the HttpOnly cookie
      // Browser automatically sends cookie with credentials: "include"
      const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/api/patient/", {
        credentials: "include", // Send HttpOnly cookies automatically
      });

      if (response.ok) {
        // Token/cookie is valid - restore user data from localStorage
        const userDataStr = localStorage.getItem("userData");
        if (userDataStr) {
          const userData = JSON.parse(userDataStr);
          setUser(userData);
        } else {
          // Cookie exists but no user data - clear state
          setUser(null);
        }
      } else {
        // Token is invalid (401/403) - clear user data
        localStorage.removeItem("userData");
        setUser(null);
      }
    } catch (error) {
      console.error("Session check failed:", error);
      localStorage.removeItem("userData");
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (username: string, password: string) => {
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/api/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Receive HttpOnly cookies in response
        body: JSON.stringify({
          username,
          password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error: ${response.status}`);
      }

      const data = await response.json();

      setCookie("AuthToken", data.token, 24 * 3600)

      // Store user data in localStorage for client-side access
      localStorage.setItem("userData", JSON.stringify(data.user));

      // Set user data in state
      setUser(data.user);

      return data;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = () => {
    // Call backend logout endpoint to clear HttpOnly cookie
    fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/api/user/logout", {
      method: "POST",
      credentials: "include",
    }).catch(console.error);
    
    // Clear user data from localStorage and state
    localStorage.removeItem("userData");
    setUser(null);
  };

  const updateUser = (updatedUser: IUserSession) => {
    setUser(updatedUser);
    localStorage.setItem("userData", JSON.stringify(updatedUser));
  };

  const hasRole = (roles: UserRole | UserRole[]): boolean => {
    if (!user) return false;

    const roleArray = Array.isArray(roles) ? roles : [roles];
    return roleArray.includes(user.role);
  };

  const value: SessionContextType = {
    user,
    isAuthenticated: !!user, // Based on user existence
    isLoading,
    login,
    logout,
    updateUser,
    hasRole,
  };

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
};

// ============================================================================
// CUSTOM HOOK
// ============================================================================

export const useSession = (): SessionContextType => {
  const context = useContext(SessionContext);

  if (context === undefined) {
    throw new Error("useSession must be used within a SessionProvider");
  }

  return context;
};

// ============================================================================
// PROTECTED ROUTE COMPONENT
// ============================================================================

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRoles?: UserRole[];
  fallback?: ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRoles,
  fallback = <div>Unauthorized access</div>,
}) => {
  const { isAuthenticated, hasRole, isLoading } = useSession();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-green-dark">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login
    if (typeof window !== 'undefined') {
      window.location.href = "/auth/login";
    }
    return null;
  }

  if (requiredRoles && !hasRole(requiredRoles)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

// ============================================================================
// ROLE-BASED COMPONENT VISIBILITY
// ============================================================================

interface RoleGateProps {
  children: ReactNode;
  allowedRoles: UserRole[];
  fallback?: ReactNode;
}

export const RoleGate: React.FC<RoleGateProps> = ({ children, allowedRoles, fallback = null }) => {
  const { hasRole } = useSession();

  if (!hasRole(allowedRoles)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};