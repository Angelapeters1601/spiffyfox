import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase URL or Anon Key");
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// New: Second Supabase connection (from the first project’s database)
const supabaseUrl2 = import.meta.env.VITE_SUPABASE_URL_PROJECT1;
const supabaseKey2 = import.meta.env.VITE_SUPABASE_ANON_KEY_PROJECT1;

if (!supabaseUrl2 || !supabaseKey2) {
  console.warn("Missing secondary Supabase URL or Anon Key");
}

export const supabase2 = createClient(supabaseUrl2, supabaseKey2);
