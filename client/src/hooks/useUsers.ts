import axios from "axios";
import useSWR from "swr";

const getUserProfile = (url: string) =>
  axios
    .get(url, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
    .then((res) => res.data);

export const useUserProfile = (userId: string) => {
  const { data, error, isLoading } = useSWR(
    `/api/v1/users/${userId}`,
    getUserProfile
  );
  return { data, error, isLoading };
};

const getAllUserList = (url: string) =>
  axios
    .get(url, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
    .then((res) => res.data);

export const useAllUser = () => {
  const { data, error, isLoading } = useSWR("/api/v1/users/", getAllUserList);
  return { data, error, isLoading };
};

export const editProfile = async ({
  id,
  username,
  email,
  bio,
}: {
  id: string;
  username: string;
  email: string;
  bio: string;
}) => {
  const { data } = await axios.put(
    `/api/v1/users/${id}`,
    {
      username,
      email,
      bio,
    },
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
  return data;
};

export const useDeleteAccount = () => {
  const deleteProfile = async (userId: string) => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Unauthorized");

    const res = await axios.delete(`/api/v1/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  };

  return { deleteProfile };
};
