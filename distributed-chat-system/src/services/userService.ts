import { supabase } from "../../supabaseClient";
import { UserInfo } from "./authService";

// Function to get all users except the current session user
export const getAllUsersExceptSessionUser = async (sessionUserId: string) => {
  const { data, error } = await supabase
    .from("Users")
    .select("*")
    .neq("id_user", sessionUserId);

  if (error) throw error;
  return data;
};

// Function to update the current session user
export const updateUser = async (
  sessionUserId: string,
  updatedData: Partial<UserInfo>
) => {
  const { data, error } = await supabase
    .from("Users")
    .update(updatedData)
    .eq("id_user", sessionUserId);

  if (error) throw error;
  return data;
};

// Function to delete the current session user
export const deleteUser = async (sessionUserId: string) => {
  const { data, error } = await supabase
    .from("Users")
    .delete()
    .eq("id_user", sessionUserId);

  if (error) throw error;
  return data;
};
