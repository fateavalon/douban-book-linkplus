// @ts-nocheck

const getURL_GM = (url, headers, data) => {
  return new Promise((resolve) =>
    GM.xmlHttpRequest({
      method: data ? 'POST' : 'GET',
      url: url,
      headers: headers,
      data: data,
      onload: function (response) {
        if (response.status >= 200 && response.status < 400) {
          resolve(response.responseText);
        } else {
          console.error(`Error getting ${url}:`, response.status, response.statusText, response.responseText);
          resolve();
        }
      },
      onerror: function (response) {
        console.error(`Error during GM.xmlHttpRequest to ${url}:`, response.statusText);
        resolve();
      },
    })
  );
};

const getJSON_GM = async (url, headers, post_data) => {
  const data = await getURL_GM(url, headers, post_data);
  if (data) {
    return JSON.parse(data);
  }
};

const getJSONP_GM = async (url, headers, post_data) => {
  const data = await getURL_GM(url, headers, post_data);
  if (data) {
    const end = data.lastIndexOf(')');
    const [, json] = data.substring(0, end).split('(', 2);
    return JSON.parse(json);
  }
};

const getJSON = async (url) => {
  try {
    const response = await fetch(url);
    if (response.status >= 200 && response.status < 400) return await response.json();
    console.error(`Error fetching ${url}:`, response.status, response.statusText, await response.text());
  } catch (e) {
    console.error(`Error fetching ${url}:`, e);
  }
};

// const getIMDbInfo = async (id) => {
//   const keys = ['40700ff1', '4ee790e0', 'd82cb888', '386234f9', 'd58193b6', '15c0aa3f'];
//   const apikey = keys[Math.floor(Math.random() * keys.length)];
//   const omdbapi_url = `https://www.omdbapi.com/?tomatoes=true&apikey=${apikey}&i=${id}`;
//   const imdb_url = `https://p.media-imdb.com/static-content/documents/v1/title/${id}/ratings%3Fjsonp=imdb.rating.run:imdb.api.title.ratings/data.json`;
//   const [omdb_data = {}, imdb_data] = await Promise.all([getJSON(omdbapi_url), getJSONP_GM(imdb_url)]);
//   if (imdb_data && imdb_data.resource) {
//     const resource = imdb_data.resource;
//     if (resource.rating) {
//       omdb_data.imdbRating = resource.rating;
//     }
//     if (resource.ratingCount) {
//       omdb_data.imdbVotes = resource.ratingCount;
//     }
//     if (resource.ratingsHistograms && resource.ratingsHistograms['IMDb Users']) {
//       omdb_data.histogram = resource.ratingsHistograms['IMDb Users'].histogram;
//     }
//     if (resource.topRank) {
//       omdb_data.topRank = resource.topRank;
//     }
//   }
//   return omdb_data;
// };

const getDoubanAPI = async (query) => {
  return await getJSON_GM(
    `https://api.douban.com/v2/${query}`,
    {
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf8',
    },
    'apikey=0ab215a8b1977939201640fa14c66bab'
  );
};

export const getDoubanBookInfo = async (id) => {
  const data = await getDoubanAPI(`book/${id}`);
  if (data) {
    if (isEmpty(data.alt)) return;
    // const url = data.alt.replace('/movie/', '/subject/') + '/';
    // return { url, rating: data.rating, title: data.title };
    return data;
  }
  // Fallback to search.
  // const search = await getJSON_GM(`https://movie.douban.com/j/subject_suggest?q=${id}`);
  // if (search && search.length > 0 && search[0].id) {
  //   const abstract = await getJSON_GM(`https://movie.douban.com/j/subject_abstract?subject_id=${search[0].id}`);
  //   const average = abstract && abstract.subject && abstract.subject.rate ? abstract.subject.rate : '?';
  //   return {
  //     url: `https://movie.douban.com/subject/${search[0].id}/`,
  //     rating: { numRaters: '', max: 10, average },
  //     title: search[0].title,
  //   };
  // }
};

const isEmpty = (s) => {
  return !s || s === 'N/A';
};
