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
      const token = localStorage.getItem("authToken");

      if (!token) {
        setIsLoading(false);
        return;
      }

      // Validate token and get user data
      const response = await fetch("/api/auth/validate", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        // Token is invalid, clear it
        localStorage.removeItem("authToken");
      }
    } catch (error) {
      console.error("Session check failed:", error);
      localStorage.removeItem("authToken");
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

      // Store token
      setCookie("AuthToken", data.token, 10 * 3600)

      // Set user data
      setUser(data.user);

      return data; // Return the data if needed
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setUser(null);
  };

  const updateUser = (updatedUser: IUserSession) => {
    setUser(updatedUser);
  };

  const hasRole = (roles: UserRole | UserRole[]): boolean => {
    if (!user) return false;

    const roleArray = Array.isArray(roles) ? roles : [roles];
    return roleArray.includes(user.role);
  };

  const value: SessionContextType = {
    user,
    isAuthenticated: !!user,
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login or show fallback
    window.location.href = "/login";
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

