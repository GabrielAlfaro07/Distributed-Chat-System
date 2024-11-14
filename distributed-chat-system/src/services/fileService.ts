import { supabase } from "../../supabaseClient";

export const uploadFile = async (file: File, folder: string) => {
  const fileName = `${folder}/${Date.now()}_${file.name}`;

  const { data, error } = await supabase.storage
    .from("message-attachments")
    .upload(fileName, file);

  if (error) {
    console.error("File upload error:", error.message);
    throw new Error(error.message);
  }

  return data?.path;
};

export const getFileURL = (path: string) => {
  const { data } = supabase.storage
    .from("message-attachments")
    .getPublicUrl(path);
  return data.publicUrl;
};
