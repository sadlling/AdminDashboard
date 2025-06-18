/* eslint-disable @typescript-eslint/no-explicit-any */
// src/contexts/AuthContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
  useCallback,
} from "react";
import apiClient from "../config/apiClient"; // Наш настроенный axios клиент

// Типы для данных пользователя и API ответов
export interface LoginUserData {
  email: string;
  password: string;
}

export interface UserInfo {
  id: string;
  email: string;
}

interface LoginApiResponse {
  message: string;
  user: UserInfo;
}

interface MeApiResponse {
  userId: string;
  email: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserInfo | null;
  isLoadingAuth: boolean;
  isLoggingIn: boolean;
  isLoggingOut: boolean;

  authError: string | null;
  login: (userData: LoginUserData) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
  clearAuthError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState<boolean>(true);
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const clearAuthState = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
  }, []);
  useEffect(() => {
    const handleForceLogoutEvent = () => {
      clearAuthState();
    };

    window.addEventListener("app:forceLogout", handleForceLogoutEvent);

    return () => {
      window.removeEventListener("app:forceLogout", handleForceLogoutEvent);
    };
  }, [clearAuthState]);

  const checkAuthStatus = useCallback(async (showPageLoading = true) => {
    if (showPageLoading) setIsLoadingAuth(true);
    setAuthError(null);
    try {
      const response = await apiClient.get<MeApiResponse>("/auth/me");
      setUser({ id: response.data.userId, email: response.data.email });
      setIsAuthenticated(true);
    } catch (error: any) {
      console.log(
        "AuthContext: Failed to authenticate via /auth/me or refresh token.",
        error.message
      );
      clearAuthState();
    } finally {
      if (showPageLoading) setIsLoadingAuth(false);
    }
  }, []);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const login = async (userData: LoginUserData): Promise<boolean> => {
    setIsLoggingIn(true);
    setAuthError(null);
    try {
      const response = await apiClient.post<LoginApiResponse>(
        "/auth/login",
        userData
      );
      setUser(response.data.user);
      setIsAuthenticated(true);

      return true;
    } catch (error: any) {
      let errorMessage = "Ошибка входа. Пожалуйста, проверьте ваши данные.";
      if (error.response && error.response.data) {
        if (typeof error.response.data.detail === "string") {
          errorMessage = error.response.data.detail;
        } else if (typeof error.response.data.message === "string") {
          errorMessage = error.response.data.message;
        } else if (
          typeof error.response.data === "string" &&
          error.response.data.length < 200
        ) {
          errorMessage = error.response.data;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      console.error("AuthContext: Login failed -", errorMessage, error);
      setAuthError(errorMessage);
      clearAuthState();
      return false;
    } finally {
      setIsLoggingIn(false);
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoggingOut(true);
    setAuthError(null);
    try {
      await apiClient.post("/auth/logout");
    } catch (error) {
      console.error(
        "AuthContext: Error during server logout, proceeding with client-side cleanup.",
        error
      );
    } finally {
      clearAuthState();
      setIsLoggingOut(false);
    }
  };

  const clearAuthError = () => {
    setAuthError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        isLoadingAuth,
        isLoggingIn,
        isLoggingOut,
        authError,
        login,
        logout,
        checkAuthStatus,
        clearAuthError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
