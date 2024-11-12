import { supabase } from "../../supabaseClient";
import { toast } from "react-toastify";
import { logUserActivity } from "./activityLogger";

// Define the structure of a chat participant
type ChatParticipant = {
  id_user: string;
  Users: {
    username: string;
    profile_picture_url: string;
  }[];
};

type Chat = {
  id_chat: string;
  ChatParticipants: ChatParticipant[];
  Messages: {
    content: string;
    created_at: string;
    id_sender: string;
  }[];
};

export const subscribeToChats = (
  userId: string,
  onChatAdded: (chat: any) => void
) => {
  const chatSubscription = supabase
    .channel("chat_channel") // Optionally specify a custom channel name
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "ChatParticipants",
        filter: `id_user=eq.${userId}`,
      },
      async (payload) => {
        // Fetch all chats for the user after a new chat is added
        const updatedChats = await getChatsByUserId(userId);
        onChatAdded(updatedChats); // Pass the updated chat list to the callback function
      }
    )
    .subscribe();

  return chatSubscription;
};

// Fetch complete chat details where the user is a participant
export const getChatsByUserId = async (userId: string): Promise<Chat[]> => {
  const { data: chatParticipantData, error: participantError } = await supabase
    .from("ChatParticipants")
    .select("id_chat")
    .eq("id_user", userId);

  if (participantError) throw participantError;

  const chatIds = chatParticipantData.map((chat) => chat.id_chat);
  if (chatIds.length === 0) return [];

  const { data: chatData, error: chatError } = await supabase
    .from("Chats")
    .select(
      `
    id_chat,
    ChatParticipants (
      id_user,
      Users (
        username,
        profile_picture_url
      )
    ),
    Messages (content, created_at, id_sender)
  `
    )
    .in("id_chat", chatIds)
    .order("created_at", { foreignTable: "Messages", ascending: false })
    .limit(1, { foreignTable: "Messages" });

  if (chatError) throw chatError;

  return chatData as Chat[];
};

// Insert a new chat
export const createChat = async (sessionUserId: string) => {
  // Create a new chat with the session user
  const { data, error } = await supabase
    .from("Chats")
    .insert([{ created_by: sessionUserId }]) // Optionally, save who created the chat
    .select("id_chat")
    .single();

  if (error) throw error;

  toast.success("Chat created successfully!");

  await logUserActivity(sessionUserId, `Create Chat ${data.id_chat}`);
  return data;
};

// Delete a chat by its ID
export const deleteChatById = async (idChat: string) => {
  try {
    // Delete all participants in the chat
    const { error: participantsError } = await supabase
      .from("ChatParticipants")
      .delete()
      .eq("id_chat", idChat);

    if (participantsError) throw participantsError;

    // Delete the chat itself
    const { error: chatError } = await supabase
      .from("Chats")
      .delete()
      .eq("id_chat", idChat);

    if (chatError) throw chatError;
    const { data: sessionData, error: sessionError } =
      await supabase.auth.getSession();

    if (sessionError) {
      console.error("Error fetching user session:", sessionError.message);
      return null;
    }
    const user = sessionData?.session?.user;
    if (!user) return null;

    const userId = user.id;

    await logUserActivity(userId, `Delete Chat ${idChat}`);
    toast.success("Chat deleted successfully!");
  } catch (error) {
    console.error("Error deleting chat:", error);
    toast.error("Failed to delete chat.");
  }
};

// Add a participant to a chat
export const addChatParticipant = async (
  idChat: string,
  idUser: string,
  role: string = "participant"
) => {
  const { data, error } = await supabase
    .from("ChatParticipants")
    .insert([{ id_chat: idChat, id_user: idUser, role }]);

  if (error) throw error;
  return data;
};

// Remove a participant from a chat
export const removeChatParticipant = async (idChat: string, idUser: string) => {
  const { data, error } = await supabase
    .from("ChatParticipants")
    .delete()
    .eq("id_chat", idChat)
    .eq("id_user", idUser);

  if (error) throw error;
  toast.success("Participant removed successfully!");
  return data;
};
