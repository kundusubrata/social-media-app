import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { useState } from "react";
import { useDeleteAccount } from "../hooks/useUsers";
import { toast } from "react-toastify";
import { AxiosError } from "axios";

const DeleteProfile = ({ userId }: { userId: string }) => {
  const [open, setOpen] = useState(false);
  const { deleteProfile } = useDeleteAccount();

  const handleDelete = async () => {
    try {
      await deleteProfile(userId);
      toast.success("Profile deleted successfully!");
      setOpen(false);
      localStorage.clear();
      window.location.reload();
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data?.message || "Failed to delete profile");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    }
  };
  return (
    <>
      <AlertDialog.Root open={open} onOpenChange={setOpen}>
        <AlertDialog.Trigger asChild>
          <button className="bg-gray-200 text-black py-2 px-6 rounded-full hover:bg-red-300">
            Delete Profile
          </button>
        </AlertDialog.Trigger>
        <AlertDialog.Portal>
          <AlertDialog.Overlay className="fixed inset-0 bg-black/50" />
          <AlertDialog.Content className="fixed top-1/2 left-1/2 w-80 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded shadow">
            <AlertDialog.Title className="text-lg font-bold">
              Are you sure?
            </AlertDialog.Title>
            <AlertDialog.Description className="text-sm mt-2">
              This action cannot be undone.
            </AlertDialog.Description>

            <div className="mt-4 flex justify-end gap-2">
              <AlertDialog.Cancel className="px-3 py-1 bg-gray-200 rounded">
                Cancel
              </AlertDialog.Cancel>
              <AlertDialog.Action
                className="px-3 py-1 bg-red-600 text-white rounded"
                onClick={handleDelete}
              >
                Delete
              </AlertDialog.Action>
            </div>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog.Root>
    </>
  );
};

export default DeleteProfile;
