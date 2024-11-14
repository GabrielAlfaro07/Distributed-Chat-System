// src/services/activityLogger.ts
import { supabase } from "../../supabaseClient";

// Function to log user activity
export const logUserActivity = async (
  id_user: string,
  activity_type: string
) => {
  const { error } = await supabase.from("UserActivityLogs").insert([
    {
      id_user,
      activity_type,
      activity_timestamp: new Date().toISOString(),
    },
  ]);

  if (error) {
    console.error("Error logging user activity:", error.message);
  }
};
