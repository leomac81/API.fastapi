function redirectToApiDocs() {
    window.location.href = 'https://www.leoapi.xyz/docs';
  }
  
// Fetch the posts data from the API
async function fetchPosts() {
    const response = await fetch('/www.leoapi.xyz/posts/');
    const posts = await response.json();
    return posts;
  }
  
  // Render the list of posts on the webpage
  async function renderPosts() {
    const postsContainer = document.getElementById('posts-container');
    const posts = await fetchPosts();
  
    posts.forEach((post) => {
      const postElement = document.createElement('div');
      postElement.classList.add('post');
  
      const postTitle = document.createElement('h3');
      postTitle.textContent = post.title;
      postElement.appendChild(postTitle);
  
      const postContent = document.createElement('p');
      postContent.textContent = post.content;
      postElement.appendChild(postContent);
  
      postsContainer.appendChild(postElement);
    });
  }
  
  // Call the renderPosts function when the page loads
  renderPosts();
  