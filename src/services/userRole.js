import { supabase } from "./supabaseClient";

/**
 * Fetches the role of a user from profiles table
 * @param {string} userId - auth.users.id
 * @returns {Promise<string>} - role of the user
 */
export async function getUserRole(userId) {
  const { data, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();

  if (error) throw error;
  return data.role;
}
