import axios, { AxiosError } from "axios";
import { useState } from "react";
import useSWR from "swr";

type SignupUserData = {
  username: string;
  email: string;
  password: string;
};

type SigninUserData = {
  email: string;
  password: string;
};

export const useSignUp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signup = async (userData: SignupUserData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post("/api/v1/auth/register", userData);
      // console.log(response);
      localStorage.setItem("token", response.data.data.token);
      localStorage.setItem("userId", response.data.data.id);
      return response.data;
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        setError(err.response?.data?.message || "An unexpected error occurred");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { signup, isLoading, error };
};

export const useSignIn = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signin = async (userData: SigninUserData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post("/api/v1/auth/login", userData);
      localStorage.setItem("token", response.data.data.token);
      localStorage.setItem("userId", response.data.data.id);
      return response.data;
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        setError(err.response?.data?.message || "An unexpected error occurred");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { signin, isLoading, error };
};

export const useLogout = () => {
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    window.location.reload(); // Reload to reset the authentication state
  };

  return { logout };
};
const fetcher = (url: string) => axios.get(url, {
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
}).then(res => res.data);

export const useMyProfile = () => {
  const { data, error, isLoading } = useSWR("/api/v1/auth/me", fetcher);
  return { data, error, isLoading };
};
