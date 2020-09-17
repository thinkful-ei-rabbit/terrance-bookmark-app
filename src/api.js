const BASE_URL = 'https://thinkful-list-api.herokuapp.com/terrat';

const fetchApi = function (...args) {
  return fetch(...args)
    .then(res => res.json())
    .then(data => data)
    .catch(error => error.message);
};

function getBookmarks(){
    return fetchApi(`${BASE_URL}/bookmarks`)
}

const createBookmark = function (json) {
  return fetchApi(`${BASE_URL}/bookmarks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: json
  });
};
// const createBookmark = function (bookmarkData) {
//   const newBookmark = JSON.stringify(bookmarkData);

//   return fetchApi(`${BASE_URL}`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json'
//     },
//     body: newBookmark
//   });
// };

const updateBookmark = function (id, bookmarkData) {
  const updateData = JSON.stringify(bookmarkData);

  return fetchApi(`${BASE_URL}/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: updateData
  });
};

const deleteBookmark = function (id) {
  return fetchApi(`${BASE_URL}/${id}`, {
    method: 'DELETE'
  });
};

export default {
  getBookmarks,
  createBookmark,
  updateBookmark,
  deleteBookmark
};