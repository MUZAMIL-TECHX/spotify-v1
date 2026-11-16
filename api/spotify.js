const axios = require('axios');
const yts = require('yt-search');

module.exports = async (req, res) => {
    // CORS aur JSON Headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json; charset=utf-8');

    const query = req.query.q;

    if (!query) {
        return res.status(400).json({
            creator: 'c9muzamil',
            contect: '923130122643',
            team: 'TeamRedXhackers',
            channel: 'https://whatsapp.com/channel/0029VbCkm3rAe5VzCYLtNb2u',
            error: 'Please provide a song name. Example: /spotify?q=Pasoori'
        });
    }

    try {
        let videoUrl = query;
        let videoDetails = null;

        // 1. Agar user ne direct YouTube link diya hai
        if (query.includes('youtube.com') || query.includes('youtu.be')) {
            videoDetails = {
                title: 'YouTube Audio',
                thumbnail: 'https://i.postimg.cc/y6GV9P3H/file-000000004c307206bc366893b817568c-(1).png',
                timestamp: 'N/A',
                author: 'YouTube'
            };
        } else {
            // 2. Agar naam se search karna hai (yt-search)
            const searchResults = await yts(query);
            if (!searchResults || !searchResults.videos || searchResults.videos.length === 0) {
                throw new Error('No song found for this query.');
            }

            const topVideo = searchResults.videos[0];
            videoUrl = topVideo.url;
            videoDetails = {
                title: topVideo.title,
                thumbnail: topVideo.thumbnail,
                timestamp: topVideo.timestamp,
                author: topVideo.author.name
            };
        }

        // 3. Vajira API se Audio Download Link nikalna
        const apiKey = 'VajiraOfc';
        const quality = '128kbps'; // Aap '320kbps' bhi kar sakte hain
        const vajiraApiUrl = `https://vajiraofc-apis.vercel.app/api/ytmp3?apikey=${apiKey}&url=${encodeURIComponent(videoUrl)}&quality=${quality}`;

        const apiResponse = await axios.get(vajiraApiUrl, {
            timeout: 60000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });

        if (!apiResponse?.data?.success || !apiResponse?.data?.data?.download?.url) {
            throw new Error('Downloader API failed to generate link.');
        }

        const downloadLink = apiResponse.data.data.download.url;

        // 4. Final JSON Response
        res.status(200).json({
            creator: 'c9muzamil',
            contect: '923130122643',
            team: 'TeamRedXhackers',
            channel: 'https://whatsapp.com/channel/0029VbCkm3rAe5VzCYLtNb2u',
            Thumbail: videoDetails.thumbnail,
            Tital: videoDetails.title,
            Duration: videoDetails.timestamp,
            Channel: videoDetails.author,
            Downlode_link: downloadLink
        });

    } catch (error) {
        console.error('Spotify API Error:', error.message);
        res.status(500).json({
            creator: 'c9muzamil',
            contect: '923130122643',
            team: 'TeamRedXhackers',
            channel: 'https://whatsapp.com/channel/0029VbCkm3rAe5VzCYLtNb2u',
            error: error.message || 'Internal Server Error'
        });
    }
};
