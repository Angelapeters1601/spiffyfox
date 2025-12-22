import { supabase } from "./supabaseClient";

/* EMAIL SIGN UP */
export async function signUpWithEmail(email, password) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

/* EMAIL LOGIN */
export async function signInWithEmail(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

/* GOOGLE LOGIN */
export async function signInWithGoogle() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: window.location.origin,
    },
  });

  if (error) throw error;
}

/* SIGN OUT */
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}
