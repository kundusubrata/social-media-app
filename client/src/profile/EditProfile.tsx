// EditProfile.tsx
import * as RadixDialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import { editProfile } from "../hooks/useUsers";
import { AxiosError } from "axios";

type EditProfileProps = {
  myUserId: string;
  myUsername: string;
  myEmail: string;
  myBio: string;
};
const EditProfile = ({
  myUserId,
  myUsername,
  myEmail,
  myBio,
}: EditProfileProps) => {
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState(myUsername);
  const [email, setEmail] = useState(myEmail);
  const [bio, setBio] = useState(myBio);

  const handleSave = async () => {
    try {
      await editProfile({ id: myUserId, username, email, bio });
      toast.success("Profile updated successfully!");
      setOpen(false);
      window.location.reload();
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data?.message || "Failed to update profile");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    }
  };
  return (
    <RadixDialog.Root open={open} onOpenChange={setOpen}>
      <RadixDialog.Trigger asChild>
        <button className="bg-gray-200 text-black py-2 px-6 rounded-full hover:bg-blue-300">
          Edit Profile
        </button>
      </RadixDialog.Trigger>

      <RadixDialog.Portal>
        <RadixDialog.Overlay className="fixed inset-0 bg-black/50" />
        <RadixDialog.Content className="fixed top-1/2 left-1/2 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-lg">
          <RadixDialog.Title className="text-xl font-bold">
            Edit Profile
          </RadixDialog.Title>
          <RadixDialog.Description className="mt-2 text-sm text-gray-600">
            Make changes and click save.
          </RadixDialog.Description>

          <div className="mt-4 space-y-4">
            <div className="flex flex-col gap-1">
              <label htmlFor="username" className="text-sm font-medium">
                Username
              </label>
              <input
                id="username"
                className="border rounded px-3 py-2"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <input
                id="email"
                className="border rounded px-3 py-2"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="bio" className="text-sm font-medium">
                Bio
              </label>
              <textarea
                id="bio"
                className="border rounded px-3 py-2"
                value={bio || ""}
                onChange={(e) => setBio(e.target.value)}
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-2">
            <RadixDialog.Close asChild>
              <button className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
            </RadixDialog.Close>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded"
              onClick={handleSave}
            >
              Save
            </button>
          </div>

          <RadixDialog.Close asChild>
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-black"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </RadixDialog.Close>
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
};

export default EditProfile;
