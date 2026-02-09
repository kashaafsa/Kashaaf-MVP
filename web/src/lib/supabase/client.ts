import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Create a function that returns the client
function createSupabaseClient() {
  if (!url || !anon) {
    const errorMsg = 
      "Missing Supabase environment variables!\n\n" +
      "Please create a .env.local file in the 'web' directory with:\n" +
      "NEXT_PUBLIC_SUPABASE_URL=your_url\n" +
      "NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key\n\n" +
      "Then restart your Next.js dev server.";
    
    console.error(errorMsg);
    
    // Return a mock client that matches Supabase's structure
    return {
      auth: {
        getSession: async () => {
          throw new Error(errorMsg);
        },
        signInWithPassword: async () => {
          throw new Error(errorMsg);
        },
        signOut: async () => {
          throw new Error(errorMsg);
        },
        getUser: async () => {
          throw new Error(errorMsg);
        },
      },
      from: () => {
        throw new Error(errorMsg);
      },
    } as any;
  }
  
  return createClient(url, anon);
}

export const supabase = createSupabaseClient();
export default supabase;