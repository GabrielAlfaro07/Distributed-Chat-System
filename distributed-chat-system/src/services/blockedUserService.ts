// src/services/blockedUserService.ts
import { supabase } from "../../supabaseClient";

// Function to add a blocked user
export const addBlockedUser = async (userId: string, blockedUserId: string) => {
  const { data, error } = await supabase.from("BlockedUsers").insert({
    id_user: userId,
    id_blocked: blockedUserId,
    blocked_at: new Date(),
  });

  if (error) throw error;
  return data;
};

// Function to remove a blocked user
export const removeBlockedUser = async (
  userId: string,
  blockedUserId: string
) => {
  const { data, error } = await supabase
    .from("BlockedUsers")
    .delete()
    .eq("id_user", userId)
    .eq("id_blocked", blockedUserId);

  if (error) throw error;
  return data;
};

// Function to check if a user is blocked
export const isUserBlocked = async (userId: string, otherUserId: string) => {
  const { data, error } = await supabase
    .from("BlockedUsers")
    .select("*")
    .or(`id_user.eq.${userId},id_blocked.eq.${otherUserId}`)
    .limit(1);

  if (error) throw error;
  return data.length > 0;
};

// Function to get all blocked users for a specific user
export const getBlockedUsers = async (userId: string) => {
  const { data, error } = await supabase
    .from("BlockedUsers")
    .select("id_blocked")
    .eq("id_user", userId);

  if (error) throw error;
  return data.map((entry) => entry.id_blocked); // Return an array of blocked user IDs
};
