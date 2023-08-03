document.addEventListener("DOMContentLoaded", function() {
    getNotes();
});

function getNotes() {
	document.querySelector(".notes").innerHTML = "";
    if(localStorage.getItem("notes")) {
		var posts = JSON.parse(localStorage.getItem("notes"));
		for(post of posts) {
			document.querySelector(".notes").innerHTML+=`
			<div class='post'>
				<h3 class='post-title'>${post.title}</h3>
				<div class='post-img'><img src='${post.img || ""}'/></div>
				<div class='post-content'>${post.text}</div>
			</div>
			`;
		}
    }

}

function addNote() {
	var sub = document.querySelector(".sub").value;
	var quantity = document.querySelector(".quantity").value;
	requestRedditPosts(sub, quantity);
}

function autofill() {
	var val = document.querySelector(".autofill-subs").value;
	document.querySelector(".sub").value = val;
}

function requestRedditPosts(sub, quantity) {
	document.querySelector(".notes").innerHTML = "Carregando...";

	const subreddit = sub;
const limit = quantity || 10; // Number of posts to retrieve (max 100)

const url = `https://www.reddit.com/r/${subreddit}/new.json?limit=${limit}`;

fetch(url)
  .then((response) => response.json())
  .then((data) => {
    // Process the data here
    if (data.data && data.data.children) {
      const posts = data.data.children;
	  let parsedPosts = [];
      posts.forEach((post) => {
        const title = post.data.title;
        const text = post.data.selftext.replaceAll("\n", "<div class='line-break'></div>");
		//const img = post.data.preview.images[0].source.url || "";
		sendMessage(img);
		parsedPosts.push({title:title, text:text});
      });
	  localStorage.setItem("notes", JSON.stringify(parsedPosts));

    } else {
      alert('No data found.');
    }
	getNotes();
  })
  .catch((error) => {
    alert('Error fetching data:', error);
  });
}

function sendMessage(message) {
	// This wraps the message posting/response in a promise, which will resolve if the response doesn't
	// contain an error, and reject with the error if it does. If you'd prefer, it's possible to call
	// controller.postMessage() and set up the onmessage handler independently of a promise, but this is
	// a convenient wrapper.
	return new Promise(function(resolve, reject) {
	  var messageChannel = new MessageChannel();
	  messageChannel.port1.onmessage = function(event) {
		if (event.data.error) {
		  reject(event.data.error);
		} else {
		  resolve(event.data);
		}
	  };
  
	  // This sends the message data as well as transferring messageChannel.port2 to the service worker.
	  // The service worker can then use the transferred port to reply via postMessage(), which
	  // will in turn trigger the onmessage handler on messageChannel.port1.
	  // See https://html.spec.whatwg.org/multipage/workers.html#dom-worker-postmessage
	  navigator.serviceWorker.controller.postMessage(message,
		[messageChannel.port2]);
	});
  }
  
