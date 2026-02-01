// arXiv API configuration for CS.AI papers
export const ARXIV_CONFIG = {
  // Search queries
  queries: [
    { name: 'cs.AI', query: 'cat:cs.AI', label: 'Artificial Intelligence' },
    { name: 'cs.LG', query: 'cat:cs.LG', label: 'Machine Learning' },
    { name: 'cs.CL', query: 'cat:cs.CL', label: 'Computation and Language' },
    { name: 'cs.CV', query: 'cat:cs.CV', label: 'Computer Vision' },
    { name: 'cs.NE', query: 'cat:cs.NE', label: 'Neural and Evolutionary Computing' },
    { name: 'stat.ML', query: 'cat:stat.ML', label: 'Machine Learning (Stats)' },
  ],
  // API settings
  baseUrl: 'http://export.arxiv.org/api/query',
  maxResults: 10,
  sortBy: 'submittedDate',
  sortOrder: 'descending',
};

export default ARXIV_CONFIG;
