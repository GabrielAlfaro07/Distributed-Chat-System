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
  return { message: "Signed out successfully" };
};

// New function to fetch user info
export const fetchUser = async () => {
  // Get the session to fetch the current authenticated user
  const { data: sessionData, error: sessionError } =
    await supabase.auth.getSession();

  if (sessionError) {
    console.error("Error fetching user session:", sessionError.message);
    return { error: sessionError };
  }

  const user = sessionData?.session?.user;
  if (!user) {
    // If there is no user, return null
    return null;
  }

  // Fetch user details from the "Users" table based on the user's ID (id_user)
  const { data, error } = await supabase
    .from("Users")
    .select("*")
    .eq("id_user", user.id)
    .single(); // Assuming there will only be one user with that id_user

  if (error) {
    console.error("Error fetching user info from Users table:", error.message);
    return { error };
  }

  // Return user data from the Users table
  return data || null; // If no user data is found, return null
};
