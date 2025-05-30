import { useQuery } from "@tanstack/react-query";
import { Outlet } from "react-router-dom";
import { self } from "../http/api";
import { useAuthStore } from "../store";
import { useEffect } from "react";
import { AxiosError } from "axios";

const getSelf = async () => {
  const { data } = await self();
  return data;
};
const Root = () => {
  // when the root component renders , it call getSelf and it will get the suer and set user to store
  const { setUser } = useAuthStore();
  const { data, isLoading } = useQuery({
    queryKey: ["self"],
    queryFn: getSelf,
    retry: (failureCount: number, error) => {
      if (error instanceof AxiosError && error?.response?.status === 401) {
        return false;
      }
      return failureCount < 3;
    },
  });

  useEffect(() => {
    if (data) {
      setUser(data);
    }
  }, [data, setUser]);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      <Outlet />
    </div>
  );
};

export default Root;
