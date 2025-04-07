import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { EllipsisVerticalIcon, Trash2 } from "lucide-react";
import { useState } from "react";
import { useDeletePost } from "../hooks/usePosts";

import { AxiosError } from "axios";
import { toast } from "react-toastify";

export const DeleteDropdown = ({ postId }: { postId: string }) => {
  const [open, setOpen] = useState(false);
  const { deletePost } = useDeletePost();

  const handleDelete = async () => {
    try {
      await deletePost(postId);
      toast.success("Post deleted successfully");
      window.location.reload();
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data?.message || "Failed to delete post");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger className="p-2 bg-gray-100 rounded">
          <EllipsisVerticalIcon size={16} />
        </DropdownMenu.Trigger>
        <DropdownMenu.Content className="bg-white shadow p-2 rounded">
          <DropdownMenu.Item
            onSelect={() => setOpen(true)}
            className="text-red-600 cursor-pointer p-1 flex items-center gap-2"
          >
            <Trash2 size={16} /> Delete
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>

      <AlertDialog.Root open={open} onOpenChange={setOpen}>
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
