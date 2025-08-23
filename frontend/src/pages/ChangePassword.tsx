import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { postWithAuth } from "@/utils/auth";
import { useNavigate } from "react-router-dom";

const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(8, "Current password must be at least 8 characters."),
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  });

type ChangePasswordType = z.infer<typeof changePasswordSchema>;

const ChangePassword = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ChangePasswordType>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = async (data: ChangePasswordType) => {
    try {
      await postWithAuth("/profile/change-password", {
        oldPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      alert("Update password successfully.");
      reset();
      navigate("/profile");
    } catch (err) {
      console.error(err);
      alert("Failed to update password.");
    }
  };

  return (
    <div className="flex items-center justify-center h-108">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md p-6 space-y-4 bg-white rounded shadow"
      >
        <h2 className="text-2xl font-semibold text-center">Change Password</h2>
        <div>
          <input
            className="w-full p-2 border rounded"
            type="password"
            placeholder="Current Password"
            {...register("currentPassword")}
          />
          {errors.currentPassword && (
            <p className="text-red-600">{errors.currentPassword.message}</p>
          )}
        </div>
        <div>
          <input
            className="w-full p-2 border rounded"
            type="password"
            placeholder="New Password"
            {...register("newPassword")}
          />
          {errors.newPassword && (
            <p className="text-red-600">{errors.newPassword.message}</p>
          )}
        </div>
        <div>
          <input
            className="w-full p-2 border rounded"
            type="password"
            placeholder="Confirm New Password"
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <p className="text-red-600">{errors.confirmPassword.message}</p>
          )}
        </div>
        <Button type="submit" className="w-full cursor-pointer">
          Save
        </Button>
      </form>
    </div>
  );
};

export default ChangePassword;
