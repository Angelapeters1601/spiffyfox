import Contractor from "../pages/contractor/Contractor";
import { supabase } from "./supabaseClient";

// SIGN UP CLIENT
export async function signUpClient(email, password) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/join`,
    },
  });

  if (error) throw error;

  // Create client profile
  if (data.user) {
    await createProfile(data.user.id, email, "client");
  }

  return data;
}

// SIGN UP CONTRACTOR
export async function signUpContractor(email, password) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/contractor`,
    },
  });

  console.log("SIGNUP DATA:", data);
  console.log("SIGNUP ERROR:", error);

  if (error) throw error;

  if (data.user) {
    await createProfile(data.user.id, email, "contractor");
  }

  return data;
}

// Helper to create/update profile
async function createProfile(userId, email, role) {
  try {
    // First check if profile exists
    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", userId)
      .maybeSingle();

    if (!existingProfile) {
      // Insert new profile
      const { error } = await supabase.from("profiles").insert([
        {
          id: userId,
          email: email,
          role: role,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ]);

      if (error) {
        console.error("Error creating profile:", error);
      } else {
        console.log(`Profile created for ${email} with role: ${role}`);
      }
    } else {
      // Update existing profile
      const { error } = await supabase
        .from("profiles")
        .update({
          email: email,
          role: role,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);

      if (error) {
        console.error("Error updating profile:", error);
      }
    }
  } catch (error) {
    console.error("Error in createProfile:", error);
  }
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

// OLD FUNCTION (keep for backwards compatibility)
export async function signUpWithEmail(email, password) {
  return signUpClient(email, password);
}
