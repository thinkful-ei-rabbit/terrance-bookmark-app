let bookmarks = [];
let error = '';
let adding = false;
let filter = 0;

const findById = function (id) {
	return this.bookmarks.find(currentBookmark => currentBookmark.id === id);
};

const addBookmark = function (bookmark) {
	Object.assign(bookmark, {expanded: false})
	this.bookmarks.push(bookmark);
};

const findAndDelete = function (id) {
	this.bookmarks = this.bookmarks.filter(currentBookmark => currentBookmark.id !== id);
};

const toggleForm = function () {
	this.adding = !this.adding;
};

const findAndUpdate = function (id, newData) {
	const currentBookmark = this.findById(id);
	Object.assign(currentBookmark, newData);
};

const logError = function (error) {
  this.error = error;
};

export default {
	bookmarks,
	error,
	adding,
	filter,
	toggleForm,
	findById,
	addBookmark,
	findAndDelete,
	findAndUpdate,
	logError
};