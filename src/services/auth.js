import { supabase } from "./supabaseClient";

/* =====================================================
   SIGN UP CLIENT
===================================================== */
export async function signUpClient(email, password) {
  // Check if profile already exists FIRST (cleaner UX)
  const { data: existingProfile } = await supabase
    .from("profiles")
    .select("role")
    .eq("email", email)
    .maybeSingle();

  if (existingProfile?.role === "contractor") {
    throw new Error(
      "This email is already registered as a contractor. Please use the contractor login page.",
    );
  }

  if (existingProfile?.role === "client") {
    throw new Error(
      "This email is already registered as a client. Please sign in.",
    );
  }

  // 🔐 Proceed with signup
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/join`,
    },
  });

  if (error) throw error;

  if (data?.user) {
    await createProfile(data.user.id, email, "client");
  }

  return data;
}

/* =====================================================
   SIGN UP CONTRACTOR
===================================================== */
export async function signUpContractor(email, password) {
  // 🔎 Check if profile already exists FIRST
  const { data: existingProfile } = await supabase
    .from("profiles")
    .select("role")
    .eq("email", email)
    .maybeSingle();

  if (existingProfile?.role === "client") {
    throw new Error(
      "This email is already registered as a client. Please use the client login page.",
    );
  }

  if (existingProfile?.role === "contractor") {
    throw new Error(
      "This email is already registered as a contractor. Please sign in.",
    );
  }

  // 🔐 Proceed with signup
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/contractor`,
    },
  });

  if (error) throw error;

  if (data?.user) {
    await createProfile(data.user.id, email, "contractor");
  }

  return data;
}

/* =====================================================
   CREATE / UPDATE PROFILE
===================================================== */
async function createProfile(userId, email, role) {
  const { data: existingProfile } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", userId)
    .maybeSingle();

  if (!existingProfile) {
    const { error } = await supabase.from("profiles").insert([
      {
        id: userId,
        email,
        role,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]);

    if (error) throw error;
  } else {
    const { error } = await supabase
      .from("profiles")
      .update({
        email,
        role,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId);

    if (error) throw error;
  }
}

/* =====================================================
   SIGN IN (ROLE AWARE)
===================================================== */
export async function signInWithEmail(email, password, requiredRole) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    if (error.message === "Invalid login credentials") {
      throw new Error("Invalid email or password. Please try again.");
    }

    if (error.message.includes("Email not confirmed")) {
      throw new Error("Please verify your email address before signing in.");
    }

    throw error;
  }

  // 🔎 Check role after successful login
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .single();

  if (profileError) throw profileError;

  if (requiredRole && profile?.role !== requiredRole) {
    // 🚨 Immediately kill wrong-role session
    await supabase.auth.signOut();

    if (profile?.role === "client") {
      throw new Error(
        "This account is registered as a client. Please use the client login page.",
      );
    }

    if (profile?.role === "contractor") {
      throw new Error(
        "This account is registered as a contractor. Please use the contractor login page.",
      );
    }

    throw new Error("Unauthorized access.");
  }

  return data;
}

/* =====================================================
   SIGN OUT
===================================================== */
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

/* =====================================================
   BACKWARDS COMPATIBILITY
===================================================== */
export async function signUpWithEmail(email, password) {
  return signUpClient(email, password);
}
