import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { fetchWithAuth, postWithAuth, setAccessToken } from "@/utils/auth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const [avatar, setAvatar] = useState<string>();
  const [username, setUsername] = useState();
  const [email, setEmail] = useState();
  const [about, setAbout] = useState<string | undefined>();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await fetchWithAuth("/profile");
        if (res?.data) {
          setUsername(res?.data.username || "");
          setEmail(res?.data.email || "");
          setAbout(res.data.about_me);
          setAvatar(
            "https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI="
          );
        }
      } catch (err) {
        console.error(err);
      }
    };
    loadProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await postWithAuth("/logout", {});
    } catch (err) {
      console.error(err);
    } finally {
      localStorage.removeItem("token");
      setAccessToken("");
      navigate("/products");
      window.location.reload();
    }
  };

  const handleAboutSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await postWithAuth("/profile", { about });
      alert("About Me updated successfully.");
    } catch (err) {
      console.error(err);
      alert("Failed to update.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 flex gap-4">
      <Card className="w-1/3">
        <CardContent className="p-4 mx-auto my-auto">
          <ul className="space-y-2">
            <li>
              <Button
                variant="outline"
                className="w-full cursor-pointer"
                onClick={() => navigate("/profile/change-password")}
              >
                Change Password
              </Button>
            </li>
            <li>
              <Button
                variant="outline"
                className="w-full cursor-pointer"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </li>
          </ul>
        </CardContent>
      </Card>
      <Card className="flex-1">
        <CardContent className="p-6 space-y-4">
          <div className="flex flex-col items-center space-y-4">
            <img
              src={avatar || "https://via.placeholder.com/150?text=Profile"}
              alt="Profile"
              className="w-24 h-24 rounded-full"
            />
            <div className="text-center space-y-1">
              <p className="font-semibold">Username: {username}</p>
              <p className="font-semibold">Email: {email}</p>
            </div>
          </div>
          <form className="space-y-4" onSubmit={handleAboutSave}>
            <div>
              <label className="block mb-1 text-sm font-medium">About Me</label>
              <textarea
                className="w-full p-2 border rounded"
                rows={4}
                value={about}
                onChange={(e) => setAbout(e.target.value)}
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit" className="cursor-pointer">
                Save
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
