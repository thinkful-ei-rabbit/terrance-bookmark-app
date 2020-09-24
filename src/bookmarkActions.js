import $ from 'jquery';
import store from './store';
import api from './api';

const generateLayout = () => {
  return `
    <div class="header">
			<h1>Terrance's-bookmarks-app</h1>
			<div class="action-button">
				<button class="new-bookmark">+ New &#128278;</button>
				<select name="filter" id='filter'>
					<option value="0">Filter By Rating</option>
					<option value="5">5 Star</option>
					<option value="4">4+ Stars</option>
					<option value="3">3+ Stars</option>
					<option value="2">2+ Stars</option>
					<option value="1">1+ Stars</option>
				</select>
			</div>
    </div>

		<div class="container-form"></div>

    <div class="container">
			<ul class="bookmarks"></ul>
		</div>

		<div class='error-message'></div>
  `
}

function bookmarkFormFields() {
	return `
		<label for="bookmark-title">Title:</label>
		<input type="text" id='bookmark-title' placeholder="JavaScript Classes, API Docs, NodeJS" required>
		<label for="bookmark-url">URL:</label>
		<input type="text" id='bookmark-url' placeholder="https://developer.mozilla.org/" required>

		<span id='rating-container'>
			<input type="radio" name="rating" value="1" required>
			<label for="rating-1" class="rating">⭐️</label>
			<input type="radio" name="rating" value="2">
			<label for="rating-2" class="rating">⭐️</label>
			<input type="radio" name="rating" value="3">
			<label for="rating-3" class="rating">⭐️</label>
			<input type="radio" name="rating" value="4">
			<label for="rating-4" class="rating">⭐️</label>
			<input type="radio" name="rating" value="5">
			<label for="rating-5" class="rating">⭐️</label>
		</span>

		<div>
			<label for="bookmark-description">Description:</label>
			<textarea name="new-bookmark-entry" id="bookmark-description" placeholder="Describe your bookmark (optional)" cols="15" rows="5"></textarea>
		</div>
	`
}

function bookmarkForm() {
	return `
		<form id="bookmark-form">
			<div class="form-content">
				${bookmarkFormFields()}
			</div>
			<div class="action-button">
				<button class="cancel-form" type="reset">Cancel</button>
				<button type="submit">Add</button>
			</div>
		</form>
	</div>
	`;
}

function createBookmarkElement(bookmark) {
	let rating = generateRating(bookmark.rating)
	const {expanded} = bookmark

	if(expanded) {
		return `
			<li class="bookmark" data-bookmark-id="${bookmark.id}">
				<div class="list-control">
					<div class="bookmark-title">${bookmark.title}</div>
					<div class="bookmark-rating">
						${rating}
						<div>&#128065</div>
					</div>
				</div>
				<div style="margin-bottom: 50px">
					<div>
						${bookmark.desc}
					</div><br>
					<div style="float: right;">
						<a href="${bookmark.url}" target="_blank">
							<span class="go-to-site">Visit Site</span>
						</a>
					</div>
				</div>
				<div class="expanded">
					<form class="bookmark-form">
						${bookmarkFormFields()}
						<div class="action-button">
							<button type="submit" class="update">Update</button>
							<span class="delete">Delete</span>
						</div>
					</form>
				</div>
			</li>
		`;
	} else {
		return `
			<li class="bookmark" data-bookmark-id="${bookmark.id}">
				<div class="list-control">
					<div class="bookmark-title">${bookmark.title}</div>
					<div class="bookmark-rating">
						${rating}
						<div class="view-icon">&#128065</div>
					</div>
				</div>
			</li>
		`;
	}
}

function getAllBookmarks(bookmarksList) {
	const bookmarks = bookmarksList.map((bookmark) => createBookmarkElement(bookmark));
	return bookmarks.join('');
};

function generateRating(number) {
	let starRating = '';

	for(let i = 0; i < number; i++) {
		starRating += '⭐️';
	};

	return `<span>${starRating}</span>`;
};

const printError = function (errorMessage) {
	return `
		<div class="error-content">
			<span id="cancel-error">⨉</span>
			<p>${errorMessage}</p>
		</div>
	`;
};

function errorHandler() {
	if (store.error) {
		const el = printError(store.error);
		$('.error-message').html(el);
	} else {
		$('.error-message').empty();
	}
};

function render() {
	$('main').html(generateLayout)
	errorHandler();

	$('.container-form, .bookmarks').empty();

	if (store.adding){
		let form = bookmarkForm()
		$('.container-form').html(form)
	} else {
		let bookmarksList = [...store.bookmarks];
		bookmarksList = bookmarksList.filter(bookmark => bookmark.rating >= store.filter)

		const bookmarksString = getAllBookmarks(bookmarksList);

		$('.bookmarks').html(bookmarksString);
	}
};

function selectedBookmarkHandler() {
	$('main').on('click', '.new-bookmark', () => {
		if (store.adding === false) {
			store.toggleForm();
			render();
		}
	})
}

function cancelSelectedBookmarkHandler() {
	$('main').on('click', '.cancel-form',() => {
		store.toggleForm();
		render();
	})
}

function createNewBookmarkHandler() {
	$('main').on('submit', '#bookmark-form', (e) => {
		e.preventDefault();

		const newBookmark = {
			title: $('#bookmark-title').val(),
			url: $('#bookmark-url').val(),
			desc: $('#bookmark-description').val(),
			rating: parseInt($('input[name="rating"]:checked').val())
		}

		api.createBookmark(newBookmark)
			.then((bookmark) => {
				store.addBookmark(bookmark);

				if(store.adding){
					store.toggleForm();
				}

				render();
				$('#bookmark-form').trigger('reset')
			})
			.catch(({message}) => {
				store.logError(message);
				render();
			});
	});
};

function handleCloseError() {
	$('main').on('click', '#cancel-error', () => {
		store.logError('');
		render();
	});
};

function getBookmarkIdFromElement(bookmark) {
	return $(bookmark).closest('.bookmark').data('bookmark-id');
};

function bookmarkListItemHandler() {
	$('main').on('click', '.list-control', evt => {
		let id = getBookmarkIdFromElement(evt.currentTarget)
		let bookmark = store.findById(id)
		store.findAndUpdate(id, {expanded: !bookmark.expanded})
		render();
	})
}

function handleUpdateBookmark() {
	$('main').on('submit', '.bookmark-form', evt => {
		let id = getBookmarkIdFromElement(evt.currentTarget)

		const newData = {
			title: $('#bookmark-title').val(),
			url: $('#bookmark-url').val(),
			desc: $('#bookmark-description').val(),
			rating: parseInt($('input[name="rating"]:checked').val())
		}

		store.findAndUpdate(id, newData)

		api.updateBookmark(id, newData)
			.then(() => {
				let bookmark = store.findById(id)
				store.findAndUpdate(id, {expanded: !bookmark.expanded})

				render();
			})
			.catch(({message}) => {
				store.logError(message);
				render();
			});

		render();
	})
}

function handleDeleteBookmark() {
	$('main').on('click', '.delete', evt => {
		const id = getBookmarkIdFromElement(evt.currentTarget);

		api.deleteBookmark(id)
			.then(() => {
				store.findAndDelete(id);
				render();
			})
			.catch(({message}) => {
				store.logError(message);
				render();
			});
	});
}

function handleRatingFilter() {
	$('main').on('change', '#filter',() => {
		store.filter = parseInt($('option:selected').val())
		render();
		useSelectedFilter(store.filter)
	})
}

const useSelectedFilter = (selected) => {
	$(`option[value="${selected}"]`).attr('selected', 'selected');
}

function bindEventListeners() {
	createNewBookmarkHandler();
	selectedBookmarkHandler();
	cancelSelectedBookmarkHandler()
	handleCloseError()
	bookmarkListItemHandler();
	handleUpdateBookmark();
	handleDeleteBookmark();
	handleRatingFilter();
}

export default {
    render,
    bindEventListeners
};
