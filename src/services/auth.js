import { supabase } from "./supabaseClient";

// SIGN UP
export async function signUpWithEmail(email, password) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  if (error) throw error;
  return data;
}

// SIGN IN
export async function signInWithEmail(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
}

// SIGN OUT
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}
