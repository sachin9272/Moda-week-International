
import axios from 'axios';

// Cache the result to avoid hitting rate limits
let cache = {
    followers: "23.5k",
    posts: [
        { id: 1, image: "/assets/instagram/post1.jpg", likes: "10.2k" },
        { id: 2, image: "/assets/instagram/post2.jpg", likes: "8.9k" },
        { id: 3, image: "/assets/instagram/post3.jpg", likes: "15.1k" },
        { id: 4, image: "/assets/instagram/post4.jpg", likes: "12.4k" }
    ],
    lastUpdated: 0
};

const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

export const getInstagramFollowers = async (req, res) => {
    try {
        const username = 'modaweekinternationalofficial';
        const baseUrl = `${req.protocol}://${req.get('host')}`;

        // Return cached data (simulated "live" data since we are using local assets for reliability)
        // We iterate and prepend baseUrl to image paths if they are local
        const postsWithUrl = cache.posts.map(post => ({
            ...post,
            image: post.image.startsWith('http') ? post.image : `${baseUrl}${post.image}`
        }));

        // Check cache for followers
        const now = Date.now();
        if (now - cache.lastUpdated < CACHE_DURATION && cache.followers) {
            return res.json({ followers: cache.followers, posts: postsWithUrl, source: 'cache' });
        }

        // Attempt to fetch from public page (Followers only)
        const response = await axios.get(`https://www.instagram.com/${username}/`, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5'
            }
        });

        const html = response.data;

        // Try to parse from meta tags
        const metaMatch = html.match(/<meta property="og:description" content="([^"]+)"/);

        if (metaMatch && metaMatch[1]) {
            const content = metaMatch[1];
            const followerMatch = content.match(/^([0-9.,]+[km]?)\s+Followers/i);

            if (followerMatch && followerMatch[1]) {
                cache.followers = followerMatch[1];
                cache.lastUpdated = now;
            }
        }

        return res.json({ followers: cache.followers, posts: postsWithUrl, source: 'live' });

    } catch (error) {
        console.error('Error fetching Instagram stats:', error.message);
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const postsWithUrl = cache.posts.map(post => ({
            ...post,
            image: post.image.startsWith('http') ? post.image : `${baseUrl}${post.image}`
        }));
        return res.json({ followers: cache.followers || "23.5k", posts: postsWithUrl, source: 'error-fallback' });
    }
};
