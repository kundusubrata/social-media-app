import useSWRMutation from "swr/mutation";
import axios from "axios";
import useSWR from "swr";

const createPostRequest = async (url: string, { arg }: { arg: FormData }) => {
  const { data } = await axios.post(url, arg, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return data;
};

export const useCreatePost = () => {
  return useSWRMutation("/api/v1/posts", createPostRequest);
};


const getAllPosts = (url: string) => axios.get(url, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
  }).then(res => res.data);
  
  export const useAllPost = () => {
    const { data, error, isLoading } = useSWR("/api/v1/posts", getAllPosts);
    return { data, error, isLoading };
  };
  

