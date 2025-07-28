# Music Player Configuration Guide

Your website now includes a configurable music player! Here are three ways you can manage your playlist:

## Option 1: JSON File (Recommended) 📝

Edit the `playlist.json` file to add/remove tracks. This is the most flexible approach.

**Format:**
```json
{
  "playlist": [
    {
      "title": "Song Name",
      "artist": "Artist Name",
      "youtube": "https://youtube.com/watch?v=...",
      "apple": "https://music.apple.com/search?term=...",
      "spotify": "https://open.spotify.com/search/..."
    }
  ]
}
```

**To add a new song:**
1. Open `playlist.json`
2. Add a new object with the song details
3. Save the file
4. Refresh your website

## Option 2: Text File (Simple) 📄

Edit the `playlist.txt` file - it's easier to read and edit manually.

**Format:**
```
Song Title | Artist Name | YouTube URL | Apple Music URL | Spotify URL
```

**To add a new song:**
1. Open `playlist.txt`
2. Add a new line with your song details separated by ` | `
3. Save the file

## Option 3: Direct Code Edit 💻

If you prefer, you can edit the playlist directly in `script.js` in the `initMusicPlayer()` function.

---

## How to Find Music Links:

### YouTube:
1. Search for your song on YouTube
2. Copy the URL from the address bar
3. Use format: `https://www.youtube.com/watch?v=VIDEO_ID`

### Apple Music:
1. Use format: `https://music.apple.com/search?term=SONG_NAME+ARTIST`
2. Replace spaces with `+`

### Spotify:
1. Use format: `https://open.spotify.com/search/SONG_NAME%20ARTIST`
2. Replace spaces with `%20`

---

## Current Features:
- ✅ Play/Pause functionality
- ✅ Next/Previous track navigation
- ✅ Progress bar animation
- ✅ Platform links (YouTube, Apple Music, Spotify)
- ✅ Track counter (1/5, etc.)
- ✅ White background theme
- ✅ Mobile responsive design

---

## Tips:
- Keep song titles concise for better display
- Test links before adding them
- Consider adding your most-played coding music
- The player auto-advances to the next track
- All links open in new tabs when clicked

Enjoy your coding vibes! 🎵
