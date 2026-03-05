const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3001;
const CACHE_DIR = path.join(__dirname, '../audio-cache');

// Track active downloads to prevent race conditions
const activeDownloads = new Set();

// Ensure cache directory exists
if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
}

app.use(cors());
app.use('/audio', express.static(CACHE_DIR));

// Status Endpoint
app.get('/', (req, res) => {
    res.json({
        status: 'online',
        message: 'Abyssal Audio Downloader is running.',
        cache_dir: CACHE_DIR,
        active_downloads: Array.from(activeDownloads)
    });
});

app.get('/download/:videoId', (req, res) => {
    const { videoId } = req.params;

    // 1. Sanitization: Basic YouTube ID regex (11 chars, alphanumeric, underscores, hyphens)
    if (!/^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
        return res.status(400).json({ success: false, error: 'Invalid Video ID format' });
    }

    const fileName = `${videoId}.mp3`;
    const filePath = path.join(CACHE_DIR, fileName);

    // 2. Cache Hit
    if (fs.existsSync(filePath)) {
        console.log(`✅ [Cache Hit] ${videoId}`);
        return res.json({ success: true, url: `http://localhost:${PORT}/audio/${fileName}` });
    }

    // 3. Prevent Concurrent Downloads for same ID
    if (activeDownloads.has(videoId)) {
        console.log(`⏳ [Wait] Download already in progress for ${videoId}`);
        return res.status(409).json({ success: false, error: 'Download already in progress' });
    }

    activeDownloads.add(videoId);
    console.log(`📥 [Start] Downloading: ${videoId}`);

    const ytDlpPath = '/home/abhishek/.local/bin/yt-dlp';
    const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36';

    // Command flags: extract audio, mp3 format, no playlist, bypass geo, skip SSL errors, spoof UA
    const command = `${ytDlpPath} -x --audio-format mp3 --no-playlist --geo-bypass --no-check-certificates --user-agent "${userAgent}" -o "${path.join(CACHE_DIR, videoId)}.%(ext)s" "https://www.youtube.com/watch?v=${videoId}"`;

    // 4. Execution with Timeout (120 seconds)
    exec(command, { timeout: 120000 }, (error, stdout, stderr) => {
        activeDownloads.delete(videoId);

        if (error) {
            console.error(`❌ [Error] yt-dlp failed for ${videoId}:\n${stderr || error.message}`);
            return res.status(500).json({
                success: false,
                error: error.message,
                details: stderr || stdout
            });
        }

        if (fs.existsSync(filePath)) {
            console.log(`✨ [Success] Track ready: ${fileName}`);
            return res.json({ success: true, url: `http://localhost:${PORT}/audio/${fileName}` });
        } else {
            console.error(`❌ [Critical] File missing after download: ${filePath}`);
            return res.status(500).json({ success: false, error: 'File not found after extraction' });
        }
    });
});

app.get('/metadata/:videoId', (req, res) => {
    const { videoId } = req.params;
    if (!/^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
        return res.status(400).json({ success: false, error: 'Invalid Video ID format' });
    }

    const ytDlpPath = '/home/abhishek/.local/bin/yt-dlp';
    const command = `${ytDlpPath} --dump-json "https://www.youtube.com/watch?v=${videoId}"`;

    exec(command, { timeout: 15000 }, (error, stdout, stderr) => {
        if (error) {
            return res.status(500).json({ success: false, error: 'Metadata fetch failed' });
        }
        try {
            const data = JSON.parse(stdout);
            res.json({
                success: true,
                title: data.title,
                description: data.description,
                tags: data.tags || []
            });
        } catch (e) {
            res.status(500).json({ success: false, error: 'Parsing failed' });
        }
    });
});

const server = app.listen(PORT, () => {
    console.log(`\n🎧 Abyssal Audio Server`);
    console.log(`🔗 URL: http://localhost:${PORT}`);
    console.log(`📂 Cache: ${CACHE_DIR}\n`);
});

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`❌ Error: Port ${PORT} is already in use.`);
    } else {
        console.error(`❌ Server Error:`, err);
    }
    process.exit(1);
});
