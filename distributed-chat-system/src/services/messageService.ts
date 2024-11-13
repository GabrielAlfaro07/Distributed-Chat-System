import { supabase } from "../../supabaseClient";
import { logUserActivity } from "./activityLogger"; // Import the logging function

export const subscribeToMessages = (
  chatId: string,
  onMessageEvent: (message: any) => void // Pass the actual message object
) => {
  const messageChannel = supabase
    .channel(`messages_channel_${chatId}`)
    .on(
      "postgres_changes",
      {
        event: "*", // This listens to all events (INSERT, UPDATE, DELETE)
        schema: "public",
        table: "Messages",
        filter: `id_chat=eq.${chatId}`,
      },
      (payload) => {
        const message = payload.new || payload.old; // Ensure we get the message object
        onMessageEvent(message); // Pass the message object to the callback
      }
    )
    .subscribe();

  return messageChannel;
};

export const unsubscribe = async (subscription: any) => {
  await subscription.unsubscribe();
};

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
  fileUrl?: string | null, // Optional field for file URL
  fileType?: string | null, // Optional field for file type
  selfDestructTime?: string, // Optional field for self-destruct time
  encryptionKey?: string // Optional field for encryption key
) => {
  const { data, error } = await supabase.from("Messages").insert([
    {
      id_chat: chatId,
      id_sender: senderId,
      content,
      file_url: fileUrl || null, // Use null if no file URL is provided
      file_type: fileType || null,
      is_deleted: false, // Assuming new messages are not deleted
      is_edited: false, // New messages are not edited
      self_destruct_time: selfDestructTime || null, // Use null if no self-destruct time is provided
      encryption_key: encryptionKey || null, // Use null if no encryption key is provided
    },
  ]);

  if (error) throw error;

  // Log the send message activity
  await logUserActivity(senderId, `Send Message in Chat ${chatId}`);
  return data;
};

// Update a message's content and mark it as edited
export const updateMessage = async (messageId: string, newContent: string) => {
  const { data, error } = await supabase
    .from("Messages")
    .update({ content: newContent, is_edited: true })
    .eq("id_message", messageId);

  if (error) throw error;
  const { data: sessionData, error: sessionError } =
    await supabase.auth.getSession();

  if (sessionError) {
    console.error("Error fetching user session:", sessionError.message);
    return null;
  }
  const user = sessionData?.session?.user;
  if (!user) return null;

  const userId = user.id;

  await logUserActivity(userId, `Update Message ${messageId}`);

  return data;
};

// Mark a message as deleted
export const deleteMessage = async (messageId: string) => {
  try {
    // Fetch the message to get the file URL (if it exists)
    const { data: messageData, error: fetchError } = await supabase
      .from("Messages")
      .select("file_url")
      .eq("id_message", messageId)
      .single();

    if (fetchError) throw fetchError;

    // If there's a file_url, delete the file from the bucket
    if (messageData?.file_url) {
      // Extract the file path from the URL
      const filePath = messageData.file_url.replace(
        `${
          supabase.storage.from("message-attachments").getPublicUrl("").data
            .publicUrl
        }/`,
        ""
      );

      // Delete the file from the storage bucket
      const { error: deleteError } = await supabase.storage
        .from("message-attachments")
        .remove([filePath]);

      if (deleteError) throw deleteError;
    }

    // Mark the message as deleted
    const { data, error } = await supabase
      .from("Messages")
      .update({ is_deleted: true })
      .eq("id_message", messageId);

    if (error) throw error;

    // Fetch the session to log user activity
    const { data: sessionData, error: sessionError } =
      await supabase.auth.getSession();

    if (sessionError) {
      console.error("Error fetching user session:", sessionError.message);
      return null;
    }

    const user = sessionData?.session?.user;
    if (!user) return null;

    const userId = user.id;
    await logUserActivity(userId, `Delete Message ${messageId}`);

    return data;
  } catch (error) {
    console.error("Failed to delete message:", error);
    throw error;
  }
};
