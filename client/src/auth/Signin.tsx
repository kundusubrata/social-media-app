import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useSignIn } from "../hooks/useAuth";
import { toast } from "react-toastify";

type FormValues = {
  email: string;
  password: string;
};

export default function Signin() {
  const [showPassword, setShowPassword] = useState(false);
  const { signin, isLoading, error } = useSignIn();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit = async (data: FormValues) => {
    const response = await signin(data);

    if (response.success) {
      toast.success("User logged in successfully");
      reset();
      navigate("/");
    } else {
      toast.error(response?.message || "Signin failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <div className="m-6">
          <p className="text-2xl font-semibold text-center">Sign In</p>
          <p className="text-md text-gray-500 text-center">
            Enter your credentials to access your account
          </p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Invalid email address",
                },
              })}
              className="w-full p-2 mt-1 border rounded-md focus:ring focus:ring-indigo-200"
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 3,
                    message: "Password must be at least 3 characters",
                  },
                })}
                className="w-full p-2 mt-1 border rounded-md focus:ring focus:ring-indigo-200"
              />
              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-2 my-2 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
          >
            Sign Up
          </button>

          {error && <p className="text-sm text-red-500">{error}</p>}
        </form>
        <div className="flex justify-center items-center gap-2 mt-4">
          <p>Don't have an Account</p>
          <Link to="/signup" className="underline">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
