import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { SignupInputs } from "../types/auth";
import axios from "axios";

const signupSchema = z.object({
  username: z.string().min(8),
  email: z.string().email(),
  password: z.string().min(8),
});

type SignupType = z.infer<typeof signupSchema>;

const Signup = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupType>({ resolver: zodResolver(signupSchema) });

  const onSubmit = async (data: SignupInputs) => {
    try {
      const url = `http://localhost:5000/api/signup`;
      const res = await axios.post(url, data);
      localStorage.setItem("token", res.data.token);
    } catch (err: any) {
      alert(err.response?.data?.message);
    }
  };

  return (
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
      <div>
        <button
          className="w-full p-2 rounded bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
          type="submit"
        >
          Signup
        </button>
      </div>
    </form>
  );
};

export default Signup;
