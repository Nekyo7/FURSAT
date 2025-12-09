import { supabase } from "@/lib/supabase";

export async function signup(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
  email,
  password,
  options: {
    data: {
      username: username,   // → THIS is what fixes EVERYTHING
    },
  },
  });
  if (error) throw error;
  return data;
}

export async function login(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
}

export async function logout() {
  await supabase.auth.signOut();
}
