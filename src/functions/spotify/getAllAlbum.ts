import axios from "axios";
import { getSpotifyToken } from "./getSpotifyToken";

export const getAllAlbum = async (Artistid: string) => {
    try {
        // Await the token
        const token = await getSpotifyToken();

        const url = `https://api.spotify.com/v1/artists/${Artistid}/albums`;

        const response = await axios.get(url, {  
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: {
                include_groups: 'album,single', // Optional: specify what types to include
                limit: 50 // Optional: max results per request
            }
        });

        return response.data;
    } catch (error: any) {
        console.error("Spotify Album Fetch Error:", error.response?.data || error);
        console.error("Artist ID:", Artistid);
        throw new Error("Failed to fetch albums from Spotify");
    }
}