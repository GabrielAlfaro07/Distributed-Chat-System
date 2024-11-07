// authService.ts
import { supabase } from "../../supabaseClient";

export interface UserInfo {
  username: string;
  phone_number: string;
  information?: string;
  profile_picture_url?: string;
}

// Sign up function remains the same
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
    console.error("Sign-up error:", signUpError.message);
    return { error: signUpError };
  }

  const { error: insertError } = await supabase.from("Users").insert([
    {
      id_user: user?.id,
      username: userInfo.username,
      phone_number: userInfo.phone_number,
      information: userInfo.information || "",
      profile_picture_url: userInfo.profile_picture_url || "",
      status: "offline", // Initialize as 'offline'
      last_active: new Date().toISOString(),
    },
  ]);

  if (insertError) {
    console.error("Insert user info error:", insertError.message);
    return { error: insertError };
  }

  return { user };
};

// Modify signIn to update user's status to "online"
export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  const user = data?.user;

  if (error) {
    console.error("Sign-in error:", error.message);
    return { error };
  }

  // Update user's status to "online" and last_active timestamp
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
  }

  return { user };
};

// Modify signOut to update user's status to "offline"
export const signOut = async () => {
  // Retrieve the current session to access the user information
  const { data: sessionData, error: sessionError } =
    await supabase.auth.getSession();

  if (sessionError) {
    console.error("Error retrieving session:", sessionError.message);
    return { error: sessionError };
  }

  const user = sessionData?.session?.user;

  if (user) {
    // Update user's status to "offline" before signing out
    const { error: updateError } = await supabase
      .from("Users")
      .update({
        status: "online",
        last_active: new Date().toISOString(),
      })
      .eq("id_user", user.id);

    if (updateError) {
      console.error("Error updating user status:", updateError.message);
      return { error: updateError };
    }
  }

  // Perform sign out
  const { error: signOutError } = await supabase.auth.signOut();

  if (signOutError) {
    console.error("Sign-out error:", signOutError.message);
    return { error: signOutError };
  }

  return { message: "Signed out successfully" };
};
