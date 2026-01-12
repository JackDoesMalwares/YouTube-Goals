// CONFIG
const API_KEY = "YOUR_YOUTUBE_API_KEY"; // put your API key here
const HANDLE = "@CappedGuy_"; // put your handle here
const GOAL = 2000; // subscriber goal

// ELEMENTS
const subscriberCountEl = document.getElementById("subscriber-count");
const progressBarEl = document.getElementById("progress-bar");
const lastSubscriberEl = document.getElementById("last-subscriber");
const firstSubscriberEl = document.getElementById("first-subscriber");
const oldNamesEl = document.getElementById("old-names");
const firstVideoEl = document.getElementById("first-video");
const lastVideoEl = document.getElementById("last-video");
const startDateEl = document.getElementById("start-date");

// STEP 1: Resolve handle to channel ID
async function getChannelId(handle) {
    const cleanHandle = handle.replace("@", "");
    const res = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${cleanHandle}&key=${API_KEY}`);
    const data = await res.json();
    if (data.items && data.items.length > 0) {
        return data.items[0].snippet.channelId;
    } else {
        throw new Error("Channel not found!");
    }
}

// STEP 2: Fetch channel info
async function fetchChannelInfo(channelId) {
    try {
        const res = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&key=${API_KEY}&id=${channelId}`);
        const data = await res.json();
        const channel = data.items[0];

        const subs = parseInt(channel.statistics.subscriberCount);
        const title = channel.snippet.title;
        const startDate = channel.snippet.publishedAt.split("T")[0];

        subscriberCountEl.textContent = subs.toLocaleString();
        const progressPercent = Math.min((subs / GOAL) * 100, 100);
        progressBarEl.style.width = progressPercent + "%";
        startDateEl.textContent = `Start date: ${startDate}`;
        oldNamesEl.textContent = `Old channel names: ${title} (current)`;

        fetchVideos(channelId);
    } catch (err) {
        console.error("Error fetching channel info:", err);
    }
}

// STEP 3: Fetch first and last video
async function fetchVideos(channelId) {
    try {
        const res = await fetch(`https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${channelId}&part=snippet&order=date&maxResults=50&type=video`);
        const data = await res.json();
        const videos = data.items;

        if (videos.length > 0) {
            firstVideoEl.textContent = `First video: ${videos[videos.length-1].snippet.title}`;
            lastVideoEl.textContent = `Last video: ${videos[0].snippet.title}`;
        }

        lastSubscriberEl.textContent = "Last subscriber: N/A";
        firstSubscriberEl.textContent = "First subscriber: N/A";
    } catch (err) {
        console.error("Error fetching videos:", err);
    }
}

// INITIALIZE
(async () => {
    try {
        const channelId = await getChannelId(HANDLE);
        fetchChannelInfo(channelId);
    } catch (err) {
        console.error(err);
    }
})();
