
import { createClient } from "@supabase/supabase-js";

// Get the Supabase project URL.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

// Get the Supabase publishable API key.
const supabaseKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// Check that both values exist.
if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    "Missing Supabase environment variables."
  );
}

// Create the connection to Supabase.
export const supabase = createClient(
  supabaseUrl,
  supabaseKey
);
