import { supabase } from "../../supabaseClient";

// Select all chats for a user
export const getChatsByUserId = async (userId: string) => {
  const { data, error } = await supabase
    .from("ChatParticipants")
    .select("id_chat")
    .eq("id_user", userId);

  if (error) throw error;
  return data;
};

// Insert a new chat
export const createChat = async (name: string) => {
  const { data, error } = await supabase
    .from("Chats")
    .insert({ name })
    .select("id_chat")
    .single();

  if (error) throw error;
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
  return data;
};
