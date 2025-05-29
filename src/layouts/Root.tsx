import { useQuery } from "@tanstack/react-query";
import { Outlet } from "react-router-dom";
import { self } from "../http/api";
import { useAuthStore } from "../store";
import { useEffect } from "react";

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
  });

  useEffect(() => {
    console.log("data is: ", data);
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
