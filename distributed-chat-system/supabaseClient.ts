// supabaseClient.ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://iaikoxhpgszhoygfqjat.supabase.co";
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseKey) {
  throw new Error("Missing SUPABASE_KEY environment variable.");
}

export const supabase = createClient(supabaseUrl, supabaseKey);
