import $ from 'jquery';
import './index.css';
import api from './api';
import store from './store'
import bookmarkItems from './bookmarkActions'

function main(){
	api.getBookmarks()
		.then((bookmarks) => {
			bookmarks.forEach((bookmark) => store.addBookmark(bookmark));
			bookmarkItems.render();
		});

	bookmarkItems.bindEventListeners();
}

$(main)
