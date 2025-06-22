import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { LoginInputs } from "../types/auth";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

type LoginType = z.infer<typeof loginSchema>;

const Login = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginType>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginInputs) => {
    try {
      const url = "http://localhost:5000/api/login";
      const res = await axios.post(url, data);
      localStorage.setItem("token", res.data.token);
      navigate("/");
    } catch (err: any) {
      alert(err.response?.data?.message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-md mx-auto p-6 space-y-4 bg-white rounded shadow"
    >
      <h2 className="text-2xl font-semibold text-center">Login</h2>
      <div>
        <input
          className="w-full p-2 border rounded"
          type="email"
          placeholder="Email"
          {...register("email")}
        />
        {errors.email && <p className="text-red-600">{errors.email.message}</p>}
      </div>
      <div>
        <input
          className="w-full p-2 border rounded"
          type="password"
          placeholder="Password"
          {...register("password")}
        />
        {errors.password && (
          <p className="text-red-600">{errors.password.message}</p>
        )}
      </div>
      <button
        className="w-full p-2 bg-blue-600 rounded hover:bg-blue-700 cursor-pointer text-white"
        type="submit"
      >
        Login
      </button>
    </form>
  );
};

export default Login;
