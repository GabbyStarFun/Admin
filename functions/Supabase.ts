import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabase: SupabaseClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_PUBLIC_SUPABASE_SECRET as string
);

interface Record {
    [key: string]: any;
}

async function getAll(table: string): Promise<Record[]> {
    const { data, error } = await supabase.from(table).select();
    if (error != null) {
        console.error("Error getting all records:", error);
        throw error;
    }
    return data;
}

async function removeStaffByAzuraID(id: string): Promise<Record | null> {
    const { error } = await supabase.from("staff").delete().eq('azuracastUserID', id);
    if (error != null) {
        console.error("Error removing staff by Azura ID:", error);
        throw error;
    }
    return null;
}

async function getStaffByAzuraID(id: string): Promise<Record | null> {
    const { data, error } = await supabase.from("staff").select().eq('azuracastUserID', id);
    if (error != null) {
        console.error("Error getting staff by Azura ID:", error);
        throw error;
    }
    return data.length > 0 ? data[0] : null; 
}

async function getStaffByID(id: string): Promise<Record | null> {
    const { data, error } = await supabase.from("staff").select().eq('userid', id);
    if (error != null) {
        console.error("Error getting staff by ID:", error);
        throw error;
    }
    return data.length > 0 ? data[0] : null; 
}

async function updateStaffByID(id: string, updates: Record): Promise<Record | null> {
    const { data, error } = await supabase.from("staff").update(updates).eq('userid', id).select().single();
    if (error != null) {
        console.error("Error updating staff by ID:", error);
        throw error;
    }
    return data;
}

async function getById(table: string, id: number): Promise<Record | null> {
    const { data, error } = await supabase.from(table).select().eq('id', id);
    if (error != null) {
        console.error("Error getting record by ID:", error);
        throw error;
    }
    return data || null;
}

async function insert(table: string, newItem: Record): Promise<Record[] | null> {
    const { data, error } = await supabase.from(table).insert([newItem]);
    if (error != null) {
        console.error("Error inserting new record:", error);
        throw error;
    }
    return data;
}

async function update(table: string, id: number, updates: Record): Promise<Record[] | null> {
    const { data, error } = await supabase.from(table).update(updates).eq('id', id);
    if (error != null) {
        console.error("Error updating record:", error);
        throw error;
    }
    return data;
}

async function deleteById(table: string, id: number): Promise<Record | null> {
    const { data, error } = await supabase.from(table).delete().eq('id', id);
    if (error != null) {
        console.error("Error deleting record by ID:", error);
        throw error;
    }
    return data;
}

export { getAll, getById, insert, update, deleteById, getStaffByID, updateStaffByID, getStaffByAzuraID, removeStaffByAzuraID };
