document.addEventListener("DOMContentLoaded", function() {
    getNotes();
});

function getNotes() {
    document.querySelector(".noteinput").value = "";
    if(localStorage.getItem("notes")) {
		var posts = JSON.parse(localStorage.getItem("notes"));
		for(post of posts) {
			document.querySelector(".notes").innerHTML+=`
			<div class='post'>
				<h3 class='post-title'>${post.title}</h3>
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
    getNotes();
}

function requestRedditPosts(sub, quantity) {
	document.querySelector(".notes").innerHTML = "Carregando...";

	const subreddit = sub;
const limit = quantity; // Number of posts to retrieve (max 100)

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
        const text = post.data.selftext;
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