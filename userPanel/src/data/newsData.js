import news1 from "../assets/news1.jpg";
import news2 from "../assets/news2.jpg";
import news3 from "../assets/news3.jpg";
import news4 from "../assets/news4.jpg";

export const mainFeatured = {
    id: 1,
    category: "FASHION",
    date: "NOVEMBER 28, 2025",
    title: "Spring/Summer 2025: A Vision of Timeless Elegance",
    description: "Explore our latest collection featuring refined silhouettes and innovative design elements that define contemporary luxury. Join us as we unveil the future of fashion. The collection draws inspiration from early 20th-century modernism, blending sharp lines with fluid drapes. Each piece tells a story of evolution—honoring the past while boldly stepping into the future. Materials have been sourced from sustainable artisans in Italy and Japan, ensuring that every garment not only looks exquisite but also adheres to our commitment to ethical luxury. The runway show, held at the historic celestial observatory, provided a fitting backdrop for a collection that aims to reach for the stars.",
    image: news1,
    author: "BY SARAH JENKINS"
};

export const subFeatured = [
    {
        id: 2,
        category: "PEFORMANCES",
        date: "NOVEMBER 25, 2025",
        title: "The Art of Craftsmanship: A Behind-the-Scenes Look",
        description: "Witness the meticulous attention to detail that goes into every stitch. Our artisans spend hundreds of hours perfecting the embroidery and beadwork that adorn our couture pieces. This exclusive behind-the-scenes look takes you into the atelier, where tradition meets innovation. Interviews with our master tailors reveal the passion and dedication required to maintain the highest standards of haute couture in a fast-paced digital world.",
        image: news2
    },
    {
        id: 3,
        category: "FINE ART",
        date: "NOVEMBER 20, 2025",
        title: "Sketching the Future: The Creative Process from Concept",
        description: "From the first charcoal stroke on paper to the final fabric selection, follow the creative journey of our lead designer. This article explores the raw inspiration—found in architecture, nature, and abstract art—that eventually translates into wearable masterpieces. We delve into the sketchbooks that hold the seeds of the season's most iconic looks.",
        image: news3
    }
];

export const latestNews = [
    {
        id: 4,
        category: "FASHION",
        date: "NOVEMBER 15, 2025",
        title: "Capturing the Moment: Photoshoot Showcase",
        description: "Behind the lens of our latest editorial photoshoot showcasing the collection in motion. The energy on set was palpable as models brought the static garments to life. Shot on location in the rugged landscapes of Iceland, the contrast between the ethereal fabrics and the harsh natural elements created a visual narrative of resilience and beauty.",
        image: news4
    },
    {
        id: 5,
        category: "COSMETICS",
        date: "NOVEMBER 10, 2025",
        title: "Color Palettes of the Season: Earth Tones Return",
        description: "An in-depth analysis of the shifting color trends in the global fashion scene. As the world seeks grounding and stability, fashion responds with a palette of rich terracottas, deep moss greens, and calming ochres. We explore how these colors can be styled for both day and evening wear, and their psychological impact on the wearer.",
        image: news2
    },
    {
        id: 6,
        category: "EDUCATION",
        date: "NOVEMBER 05, 2025",
        title: "The Business of Fashion: Market Shifts in 2026",
        description: "How digital transformation is reshaping the luxury retail landscape. With the rise of the metaverse and digital ownership, luxury brands are reimagining what it means to own a piece of high fashion. This report analyzes the latest market data and predicts the major shifts we will see in consumer behavior over the next five years.",
        image: news3
    },
    {
        id: 7,
        category: "TRAVEL",
        date: "NOVEMBER 01, 2025",
        title: "Interview: The Rising Star of London Fashion",
        description: "A candid conversation with the designer everyone is talking about. Fresh from their debut at London Fashion Week, this young prodigy shares their unique perspective on sustainability, gender-fluid fashion, and the challenges of starting a brand in today's competitive market.",
        image: news1
    }
];

export const allNewsItems = [mainFeatured, ...subFeatured, ...latestNews];
