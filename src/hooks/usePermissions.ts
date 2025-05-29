import { User } from "../store";

export const usePermission = () => {
  const allowedRoles = ["admin", "manager"];

  // under the hood performing this actions of checcking the role of user
  const _hasPermisson = (user: User | null) => {
    if (user) {
      return allowedRoles.includes(user.role);
    }
    return false;
  };

  //returning an object this is a public interface:
  return {
    isAllowed: _hasPermisson,
  };
};
