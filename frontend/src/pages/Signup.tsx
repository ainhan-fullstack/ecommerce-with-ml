import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { SignupInputs } from "../types/auth";
import api from "../utils/axios";
import { Link, useNavigate } from "react-router-dom";
import { setAccessToken } from "../utils/auth";
import logo from "../assets/ecommerce-random-logo.webp";

const signupSchema = z.object({
  username: z.string().min(8),
  email: z.string().email(),
  password: z.string().min(8),
});

type SignupType = z.infer<typeof signupSchema>;

const Signup = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupType>({ resolver: zodResolver(signupSchema) });

  const onSubmit = async (data: SignupInputs) => {
    try {
      const res = await api.post("/signup", data);
      setAccessToken(res.data.token);
      localStorage.setItem("token", res.data.token);
      navigate("/products");
    } catch (err: any) {
      alert("Signup Error!");
    }
  };

  return (
    <>
      <Link to={"/"}>
        <img src={logo} alt="Logo" className="w-15 h-15 object-contain" />
      </Link>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-md mx-auto p-6 space-y-4 bg-white rounded shadow"
      >
        <h2 className="text-2xl font-semibold text-center">Signup</h2>
        <div>
          <input
            className="w-full p-2 border rounded"
            type="text"
            placeholder="Username"
            {...register("username")}
          />
          {errors.username && (
            <p className="text-red-600">{errors.username.message}</p>
          )}
        </div>
        <div>
          <input
            className="w-full p-2 border rounded"
            type="email"
            placeholder="Email"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-red-600">{errors.email.message}</p>
          )}
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
        <div>
          <button
            className="w-full p-2 rounded bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
            type="submit"
          >
            Signup
          </button>
          <button
            className="w-full p-2 bg-gray-600 rounded hover:bg-gray-700 cursor-pointer text-white mt-2"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        </div>
      </form>
    </>
  );
};

export default Signup;
