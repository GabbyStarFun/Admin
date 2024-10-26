import axios from 'axios';
import { deleteById, getStaffByAzuraID, insert, removeStaffByAzuraID } from '@/functions/Supabase';

export async function POST(request: Request) {
    const { id, isActive } = await request.json();

    console.log("Incoming request data:", { id, isActive });

    const apiKey = request.headers.get('x-api-key');

    if (apiKey !== process.env.NEXT_PUBLIC_API_KEY) {
        return new Response(JSON.stringify({ message: "Unauthorized" }), {
            status: 403,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    try {
        const azuraResponse = await axios.get(
            `${process.env.radio}/api/station/1/streamer/${id}`,
            {
                headers: {
                    'X-API-Key': process.env.NEXT_PUBLIC_AZURACAST_API_KEY,
                },
            }
        );

        const currentData = azuraResponse.data;
        console.log("Current data from AzuraCast:", currentData);

        const dbInfo = await getStaffByAzuraID(id);
        console.log("Database info:", dbInfo);
        
        if (!dbInfo) {
            return new Response(JSON.stringify({ message: "Staff record not found." }), {
                status: 404,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }

        const { id: _, ...updatedInfo } = dbInfo;
        updatedInfo.active = !isActive;

        console.log("Preparing to delete old record and insert new data:", updatedInfo);

        await removeStaffByAzuraID(id)
        const insertResponse = await insert("staff", updatedInfo);


        console.log("New record inserted:", insertResponse);

        return new Response(JSON.stringify({ message: `User ${!isActive ? 'activated' : 'deactivated'} successfully` }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (err) {
        console.log("Error processing request:", err);
        return new Response(JSON.stringify({ message: "Failed to update user status. Please try again." }), {
            status: 500, 
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}
