// authService.ts
import { supabase } from "../../supabaseClient";
import { toast } from "react-toastify";

export interface UserInfo {
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
      status: "offline", // Initialize as 'offline'
      last_active: new Date().toISOString(),
    },
  ]);

  if (insertError) {
    toast.error("Error saving user info: " + insertError.message);
    return { error: insertError };
  }

  toast.success("Sign-up successful!");
  return { user };
};

// SignIn function with Toast notifications
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

  toast.success("Sign-in successful!");
  return { user };
};

// SignOut function with Toast notifications
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
  }

  const { error: signOutError } = await supabase.auth.signOut();

  if (signOutError) {
    toast.error("Sign-out error: " + signOutError.message);
    return { error: signOutError };
  }

  toast.success("Signed out successfully!");
  return { message: "Signed out successfully" };
};
