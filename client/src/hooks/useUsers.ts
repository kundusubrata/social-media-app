import axios from "axios";
import useSWR from "swr";

const getUserProfile = (url: string) => axios.get(url, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
  }).then(res => res.data);
  
  export const useUserProfile = (userId: string) => {
    const { data, error, isLoading } = useSWR(`/api/v1/users/${userId}`, getUserProfile);
    return { data, error, isLoading };
  };


const getAllUserList = (url: string) => axios.get(url, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
  }).then(res => res.data);
  
  export const useAllUser = () => {
    const { data, error, isLoading } = useSWR("/api/v1/users/", getAllUserList);
    return { data, error, isLoading };
  };