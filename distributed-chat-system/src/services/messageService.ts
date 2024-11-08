import { supabase } from "../../supabaseClient";

// Fetch messages by chat ID, ordered by creation time
export const getMessagesByChatId = async (chatId: string) => {
  const { data, error } = await supabase
    .from("Messages")
    .select(
      "id_message, content, created_at, id_sender, file_url, file_type, is_deleted, is_edited, self_destruct_time, encryption_key"
    )
    .eq("id_chat", chatId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data;
};

// Insert a new message into the Messages table
export const sendMessage = async (
  chatId: string,
  senderId: string,
  content: string,
  fileUrl?: string, // Optional field for file URL
  fileType?: string, // Optional field for file type
  selfDestructTime?: string, // Optional field for self-destruct time
  encryptionKey?: string // Optional field for encryption key
) => {
  const { data, error } = await supabase.from("Messages").insert([
    {
      id_chat: chatId,
      id_sender: senderId,
      content,
      file_url: fileUrl || null, // Use null if no file URL is provided
      file_type: fileType || null, // Use null if no file type is provided
      is_deleted: false, // Assuming new messages are not deleted
      is_edited: false, // New messages are not edited
      self_destruct_time: selfDestructTime || null, // Use null if no self-destruct time is provided
      encryption_key: encryptionKey || null, // Use null if no encryption key is provided
    },
  ]);

  if (error) throw error;
  return data;
};
