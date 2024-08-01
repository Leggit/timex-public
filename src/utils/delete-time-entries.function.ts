import { PostgrestError } from "@supabase/supabase-js";
import { supabase } from "./supabase";

export const deleteTimeEntries = async (
  ...ids: any[]
): Promise<{ error?: PostgrestError; success?: boolean }> => {
  const { error } = await supabase.from("TimeEntry").delete().in("id", ids);
  if (error) {
    return { error };
  } else {
    return { success: true };
  }
};
