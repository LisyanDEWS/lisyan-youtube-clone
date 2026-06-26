const DEFAULT_TIMEOUT_MS = 15000;

const trimTrailingSlash = (url = '') => url.replace(/\/+$/, '');

const getBaseUrl = () => {
  const fromEnv = process.env.VUE_APP_INVIDIOUS_BASE_URL;
  return trimTrailingSlash(fromEnv || '/api/invidious');
};

const createUrl = (path, params = {}) => {
  const url = new URL(`${getBaseUrl()}${path}`, window.location.origin);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, String(value));
    }
  });

  return url.toString();
};

const request = async (path, params = {}, timeoutMs = DEFAULT_TIMEOUT_MS) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(createUrl(path, params), {
      method: 'GET',
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Invidious API error ${response.status}: ${text || response.statusText}`);
    }

    return await response.json();
  } finally {
    clearTimeout(timeout);
  }
};

export const invidiousApi = {
  search(query, page = 1, sortBy = 'relevance', date = '', duration = '', type = 'video') {
    return request('/search', {
      q: query,
      page,
      sort_by: sortBy,
      date,
      duration,
      type,
    });
  },

  getVideo(videoId) {
    return request(`/videos/${encodeURIComponent(videoId)}`);
  },

  getTrending(region = 'US', type = 'default') {
    return request('/trending', {
      region,
      type,
    });
  },

  getChannel(channelId, page = 1, sortBy = 'newest') {
    return request(`/channels/${encodeURIComponent(channelId)}`, {
      page,
      sort_by: sortBy,
    });
  },

  getChannelVideos(channelId, page = 1, sortBy = 'newest') {
    return request(`/channels/${encodeURIComponent(channelId)}/videos`, {
      page,
      sort_by: sortBy,
    });
  },
};

export default invidiousApi;
