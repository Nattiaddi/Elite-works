import { supabase } from '../../../config/supabase';

export const signUpElite = async (email, password, fullName, role) => {
  // 1. Sign up the user in Auth
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) throw error;

  // 2. Insert into our custom Profiles table
  const { error: profileError } = await supabase
    .from('profiles')
    .insert([
      { 
        id: data.user.id, 
        full_name: fullName, 
        role: role // 'client' or 'freelancer'
      }
    ]);

  if (profileError) throw profileError;
  return data;
};