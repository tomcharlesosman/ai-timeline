// RSS Feed sources for AI news monitoring
export const RSS_FEEDS = [
  // Official AI Labs
  { name: 'OpenAI Blog', url: 'https://openai.com/blog/rss.xml', category: 'lab' },
  { name: 'Anthropic Blog', url: 'https://www.anthropic.com/rss.xml', category: 'lab' },
  { name: 'Google DeepMind', url: 'https://deepmind.google/blog/rss.xml', category: 'lab' },
  { name: 'Google AI Blog', url: 'http://googleaiblog.blogspot.com/rss.xml', category: 'lab' },
  { name: 'Meta AI Research', url: 'https://ai.meta.com/blog/rss.xml', category: 'lab' },
  { name: 'Microsoft AI Blog', url: 'https://blogs.microsoft.com/ai/feed/', category: 'lab' },
  { name: 'Amazon Science', url: 'https://www.amazon.science/rss', category: 'lab' },
  { name: 'Apple Machine Learning', url: 'https://machinelearning.apple.com/rss.xml', category: 'lab' },
  { name: 'NVIDIA Blog', url: 'https://blogs.nvidia.com/blog/category/deep-learning/feed/', category: 'lab' },
  { name: 'Intel AI', url: 'https://www.intel.com/content/www/us/en/artificial-intelligence/blog.html?format=rss', category: 'lab' },
  
  // xAI and Others
  { name: 'xAI', url: 'https://x.ai/blog/rss.xml', category: 'lab' },
  { name: 'Mistral AI', url: 'https://mistral.ai/news/rss.xml', category: 'lab' },
  { name: 'DeepSeek', url: 'https://deepseek.com/blog/rss.xml', category: 'lab' },
  { name: 'Cohere', url: 'https://cohere.com/blog/rss.xml', category: 'lab' },
  { name: 'AI21 Labs', url: 'https://www.ai21.com/blog/rss.xml', category: 'lab' },
  { name: 'Databricks', url: 'https://www.databricks.com/blog/rss.xml', category: 'lab' },
  
  // Chinese AI Labs
  { name: 'Baidu Research', url: 'https://research.baidu.com/rss.xml', category: 'lab' },
  { name: 'Tencent AI Lab', url: 'https://ai.tencent.com/rss.xml', category: 'lab' },
  { name: 'Alibaba DAMO Academy', url: 'https://damo.alibaba.com/rss.xml', category: 'lab' },
  { name: 'Qwen', url: 'https://qwen.ai/blog/rss.xml', category: 'lab' },
  { name: 'Kimi / Moonshot', url: 'https://kimi.ai/blog/rss.xml', category: 'lab' },
  
  // Research & Papers
  { name: 'arXiv CS.AI', url: 'http://export.arxiv.org/api/query?search_query=cat:cs.AI&sortBy=submittedDate&sortOrder=descending&max_results=20', category: 'research' },
  { name: 'arXiv CS.LG', url: 'http://export.arxiv.org/api/query?search_query=cat:cs.LG&sortBy=submittedDate&sortOrder=descending&max_results=20', category: 'research' },
  { name: 'Papers with Code', url: 'https://paperswithcode.com/feed', category: 'research' },
  { name: 'MIT News - AI', url: 'https://news.mit.edu/rss/topic/artificial-intelligence2', category: 'research' },
  { name: 'Stanford HAI', url: 'https://hai.stanford.edu/rss.xml', category: 'research' },
  { name: 'Berkeley AI Research', url: 'https://bair.berkeley.edu/blog/feed.xml', category: 'research' },
  { name: 'CMU LTI', url: 'https://lti.cs.cmu.edu/news/feed.xml', category: 'research' },
  
  // News & Media
  { name: 'MIT Technology Review - AI', url: 'https://www.technologyreview.com/topic/artificial-intelligence/feed', category: 'news' },
  { name: 'Wired AI', url: 'https://www.wired.com/feed/tag/ai/latest/rss', category: 'news' },
  { name: 'The Verge AI', url: 'https://www.theverge.com/rss/index/artificial-intelligence/index.xml', category: 'news' },
  { name: 'TechCrunch AI', url: 'https://techcrunch.com/category/artificial-intelligence/feed/', category: 'news' },
  { name: 'VentureBeat AI', url: 'https://venturebeat.com/ai/feed/', category: 'news' },
  { name: 'The Gradient', url: 'https://thegradient.pub/rss.xml', category: 'news' },
  { name: 'Import AI Newsletter', url: 'https://jack-clark.net/rss.xml', category: 'news' },
  { name: 'Nathan Lambert', url: 'https://www.interpreter.ai/rss.xml', category: 'news' },
  { name: 'Matthew Berman', url: 'https://matthewberman.com/rss.xml', category: 'news' },
  { name: 'The Rundown AI', url: 'https://www.therundown.ai/rss.xml', category: 'news' },
  { name: "Ben's Bites", url: 'https://bensbites.substack.com/feed', category: 'news' },
  { name: 'Futurepedia', url: 'https://www.futurepedia.io/rss', category: 'news' },
  
  // Newsletters & Aggregators
  { name: 'AI Explained', url: 'https://ai-explained.beehiiv.com/rss', category: 'news' },
  { name: 'Latent Space', url: 'https://latent-space.com/rss.xml', category: 'news' },
  { name: 'Interconnects', url: 'https://interconnects.ai/rss.xml', category: 'news' },
  { name: 'Deep Learning Weekly', url: 'https://deeplearningweekly.com/rss', category: 'news' },
  { name: 'AI Morning Brew', url: 'https://aimorningbrew.com/rss.xml', category: 'news' },
  { name: 'Superhuman AI', url: 'https://superhuman.com/ai/rss', category: 'news' },
  
  // Products & Launches
  { name: 'Product Hunt - AI', url: 'https://www.producthunt.com/feed?category=artificial-intelligence', category: 'product' },
  { name: 'Future Tools', url: 'https://www.futuretools.io/rss', category: 'product' },
  { name: "There's an AI For That", url: 'https://theresanaiforthat.com/rss', category: 'product' },
  
  // GitHub Trending
  { name: 'GitHub Trending AI', url: 'https://gh-trending-repos.github.io/trending/2024-09-01/2024-09-07/artificial-intelligence', category: 'research' },
  
  // Podcasts
  { name: 'Lex Fridman', url: 'https://lexfridman.com/category/artificial-intelligence/feed', category: 'research' },
  { name: 'a16z Podcast', url: 'https://a16z.com/podcasts/feed/', category: 'news' },
  { name: 'Andreessen Horowitz AI', url: 'https://a16z.com/category/ai/feed', category: 'news' },
];

export default RSS_FEEDS;
