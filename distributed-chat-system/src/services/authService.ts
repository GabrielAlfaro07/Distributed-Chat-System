import { supabase } from "../../supabaseClient";
import { toast } from "react-toastify";
import { logUserActivity } from "./activityLogger";

// Define the updated UserInfo interface with id_user
export interface UserInfo {
  id_user: string;
  username: string;
  phone_number: string;
  information?: string;
  profile_picture_url?: string;
}

// Sign up function with Toast notifications
export const signUp = async (
  email: string,
  password: string,
  userInfo: UserInfo
) => {
  const { data, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
  });

  const user = data?.user;

  if (signUpError) {
    toast.error("Sign-up failed: " + signUpError.message);
    return { error: signUpError };
  }

  const { error: insertError } = await supabase.from("Users").insert([
    {
      id_user: user?.id,
      username: userInfo.username,
      phone_number: userInfo.phone_number,
      information: userInfo.information || "",
      profile_picture_url: userInfo.profile_picture_url || "",
      status: "offline",
      last_active: new Date().toISOString(),
    },
  ]);

  if (insertError) {
    toast.error("Error saving user info: " + insertError.message);
    return { error: insertError };
  }

  // Log the sign-up activity
  if (user) {
    await logUserActivity(user.id, "Sign Up");
  }

  return { user };
};

// Sign-In function with Toast notifications
export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  const user = data?.user;

  if (error) {
    toast.error("Sign-in failed: " + error.message);
    return { error };
  }

  if (user) {
    const { error: updateError } = await supabase
      .from("Users")
      .update({
        status: "online",
        last_active: new Date().toISOString(),
      })
      .eq("id_user", user.id);

    if (updateError) {
      console.error("Error updating user status:", updateError.message);
    }

    // Log the sign-in activity
    await logUserActivity(user.id, "Sign In");
  }

  return { user };
};

// Sign-Out function with Toast notifications
export const signOut = async () => {
  const { data: sessionData, error: sessionError } =
    await supabase.auth.getSession();

  if (sessionError) {
    toast.error("Session retrieval error: " + sessionError.message);
    return { error: sessionError };
  }

  const user = sessionData?.session?.user;

  if (user) {
    const { error: updateError } = await supabase
      .from("Users")
      .update({
        status: "offline",
        last_active: new Date().toISOString(),
      })
      .eq("id_user", user.id);

    if (updateError) {
      toast.error("Error updating status: " + updateError.message);
      return { error: updateError };
    }

    // Log the sign-out activity
    await logUserActivity(user.id, "Sign Out");
  }

  const { error: signOutError } = await supabase.auth.signOut();

  if (signOutError) {
    toast.error("Sign-out error: " + signOutError.message);
    return { error: signOutError };
  }
  return { message: "Signed out successfully" };
};

// Fetch user by ID or current session user if no ID is provided
export const fetchUser = async (id?: string): Promise<UserInfo | null> => {
  const { data: sessionData, error: sessionError } =
    await supabase.auth.getSession();

  if (sessionError) {
    console.error("Error fetching user session:", sessionError.message);
    return null;
  }

  const user = sessionData?.session?.user;
  if (!user) return null;

  const userId = id || user.id;

  const { data, error } = await supabase
    .from("Users")
    .select("*")
    .eq("id_user", userId)
    .single();

  if (error) {
    console.error("Error fetching user:", error.message);
    return null;
  }
  return data as UserInfo;
};
