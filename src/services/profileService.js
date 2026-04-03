import { supabase } from '../config/supabase';

export const uploadVerificationID = async (file) => {
  const user = (await supabase.auth.getUser()).data.user;
  const fileExt = file.name.split('.').pop();
  const fileName = `${user.id}.${Date.now()}.${fileExt}`; // በየጊዜው አዲስ ስም እንዲኖረው Date.now() ጨምሬበታለሁ

  // 1. ፎቶውን ወደ Storage መጫን
  const { data, error: uploadError } = await supabase.storage
    .from('verification_docs')
    .upload(fileName, file);

  if (uploadError) {
    console.error("Upload error:", uploadError);
    return { success: false, error: uploadError };
  }

  // 2. በ Profile ሰንጠረዥ ላይ 'pending' ብሎ ምልክት ማድረግ
  const { error: updateError } = await supabase
    .from('profiles')
    .update({ verification_status: 'pending' })
    .eq('id', user.id);

  if (updateError) {
    return { success: false, error: updateError };
  }

  return { success: true };
};