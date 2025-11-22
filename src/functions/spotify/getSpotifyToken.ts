import axios from "axios";

export const getSpotifyToken = async (): Promise<string> => {
  const tokenUrl = "https://accounts.spotify.com/api/token";

  const authHeader = Buffer.from(
    `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
  ).toString("base64");

  const response = await axios.post(
    tokenUrl,
    "grant_type=client_credentials",
    {
      headers: {
        Authorization: `Basic ${authHeader}`,
        "Content-Type": "application/x-www-form-urlencoded"
      },
    }
  );

  return response.data.access_token;
};
