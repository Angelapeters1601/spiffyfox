import { supabase } from "./supabaseClient";

// SIGN UP CLIENT
export async function signUpClient(email, password) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
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
  });

  if (error) throw error;

  // Create contractor profile
  if (data.user) {
    await createProfile(data.user.id, email, "contractor");
  }

  return data;
}

// Helper to create/update profile
async function createProfile(userId, email, role) {
  try {
    const { error } = await supabase.from("profiles").upsert(
      [
        {
          id: userId,
          email: email,
          role: role,
          updated_at: new Date().toISOString(),
        },
      ],
      {
        onConflict: "id", // Update if exists
        ignoreDuplicates: false,
      },
    );

    if (error) {
      console.error("Error in createProfile:", error);
    }
  } catch (error) {
    console.error("Error creating profile:", error);
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

// OLD FUNCTION
export async function signUpWithEmail(email, password) {
  return signUpClient(email, password);
}
