export async function GET(request: Request) {
  try {
    const externalRes = await fetch(
      `${process.env.radio}/api/nowplaying/lime?t=${new Date().toISOString()}`, { cache: "no-store" }
    );
    if (!externalRes.ok) {
      throw new Error(`Failed to fetch: ${externalRes.statusText}`);
    }
    const azuracastData = await externalRes.json();
    const title = azuracastData.now_playing.song.title;
    const artist = azuracastData.now_playing.song.artist;
    const data = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      body: new URLSearchParams({
        'grant_type': 'client_credentials',
        'client_id': process.env.spotify_client_id || "",
        'client_secret': process.env.spotify_client_secret || ""
      })
    });
    const json = await data.json()
    const spotifyRes = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(`${title} ${artist.split("/").join(", ")}`)}&type=track`,
      {
        headers: {
          Authorization: `Bearer ${json.access_token}`,
        },
        cache: "no-store",
      }
    );

    if (!spotifyRes.ok) {
      throw new Error(`Failed to fetch: ${spotifyRes.statusText}`);
    }
    const spotifyData = await spotifyRes.json();
    const iconUrl = spotifyData.tracks.items[0]?.album.images[0]?.url;
    if (!azuracastData.now_playing.playlist) {
    azuracastData.now_playing.song.art = iconUrl}
    if (azuracastData.now_playing.song.art.split("/art/")[1]) {azuracastData.now_playing.song.art = `/api/image?id=${azuracastData.now_playing.song.art.split("/art/")[1]}`}

    const repackagedData = {
      data: {
      now_playing: azuracastData.now_playing,
      live: azuracastData.live,
      listeners: azuracastData.listeners
    }}
    return new Response(JSON.stringify(repackagedData), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.log(error)
    return new Response(
      JSON.stringify({ message: "An error occurred. Please try again later." }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}
