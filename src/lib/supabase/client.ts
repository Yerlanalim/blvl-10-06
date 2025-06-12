import {createBrowserClient} from '@supabase/ssr'
import {ClientType, SassClient} from "@/lib/supabase/unified";
import {Database} from "@/lib/types";

// Singleton pattern для переиспользования Supabase client
let supabaseClient: ReturnType<typeof createBrowserClient<Database>> | null = null;
let sassClientInstance: SassClient | null = null;

export function createSPAClient() {
    if (supabaseClient) {
        return supabaseClient;
    }
    
    supabaseClient = createBrowserClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    
    return supabaseClient;
}

export async function createSPASassClient() {
    if (sassClientInstance) {
        return sassClientInstance;
    }
    
    const client = createSPAClient();
    sassClientInstance = new SassClient(client, ClientType.SPA);
    
    return sassClientInstance;
}

// Utility function для очистки singleton в случае необходимости
export function clearClientCache() {
    supabaseClient = null;
    sassClientInstance = null;
}