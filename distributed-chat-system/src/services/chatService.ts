import { supabase } from "../../supabaseClient";
import { toast } from "react-toastify";

// Fetch complete chat details where the user is a participant
export const getChatsByUserId = async (userId: string) => {
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
      ChatParticipants(id_user, Users(username, profile_picture_url)),
      Messages(content, created_at, id_sender)
    `
    )
    .in("id_chat", chatIds)
    .order("created_at", { foreignTable: "Messages", ascending: false })
    .limit(1, { foreignTable: "Messages" });

  if (chatError) throw chatError;

  return chatData;
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
  return data;
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
