import axios from "axios";
import { getSpotifyToken } from "./getSpotifyToken";

export const getArtistById = async (artistId: string) => {
    try {


        const token = getSpotifyToken()

        const url = `https://api.spotify.com/v1/artists/${artistId}`;

        const reponse = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${token}`
            },
        })

        return reponse.data;
    } catch (error: any) {
        console.error("Spotify Artist Fetch Error:", error.response?.data || error);
        throw new Error("Failed to fetch artist from Spotify");
    }
}