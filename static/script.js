function redirectToApiDocs() {
    window.location.href = 'https://www.leoapi.xyz/docs';
  }
  
  // Authenticate the user and get the access token
  async function login(email, password) {
    const response = await fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `username=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}&grant_type=password`
    });
  
    if (response.status === 200) {
      const data = await response.json();
      localStorage.setItem('access_token', data.access_token);
      return data.access_token;
    } else {
      throw new Error('Login failed');
    }
  }
  
  // Fetch the posts data from the API
  async function fetchPosts(accessToken) {
    const response = await fetch('/posts/', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
  
    if (!response.ok) {
      throw new Error('Failed to fetch posts');
    }
  
    const posts = await response.json();
    console.log('Fetched posts:', posts);
    return posts;
  }
  
  // Render the list of posts on the webpage
  async function renderPosts(accessToken) {
    console.log('Rendering posts:', posts);
    const postsContainer = document.getElementById('posts-container');
    const posts = await fetchPosts(accessToken);
  
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
  
  // Handle the login form submission
document.getElementById('login-form').addEventListener('submit', async (event) => {
    event.preventDefault();
  
    const email = document.getElementById('username').value;
    const password = document.getElementById('password').value;
  
    try {
      const accessToken = await login(email, password);
      const posts = await fetchPosts(accessToken);
      displayPosts(posts);
    } catch (error) {
      alert('Login failed. Please check your credentials and try again.');
    }
  });
  
  function displayPosts(posts) {
    document.getElementById('login-form').style.display = 'none';
    console.log('Displaying posts:', posts);
    const postsContainer = document.getElementById('posts-container');
    postsContainer.innerHTML = '';
  
    for (const postObj of posts) {
      const post = postObj.Post;
      const votes = postObj.votes;
  
      const postDiv = document.createElement('div');
      postDiv.style.border = '1px solid lightgrey';
      postDiv.style.borderRadius = '5px';
      postDiv.style.padding = '10px';
      postDiv.style.marginBottom = '10px';
      postDiv.innerHTML = `
        <h4>${post.title}</h4>
        <p style="font-size: small;">${post.content}</p>
        <p style="font-size: small;">Votes: ${votes}</p>
      `;
  
      postsContainer.appendChild(postDiv);
    }
  }

  async function createUser(email, password) {
    const response = await fetch('/users/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email,
        password: password
      })
    });
  
    if (response.status === 201) {
      const data = await response.json();
      return data;
    } else {
      throw new Error('User creation failed');
    }
  }
  document.getElementById('register-form').addEventListener('submit', async (event) => {
    event.preventDefault();
  
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
  
    try {
      const newUser = await createUser(email, password);
      alert('User created successfully. Please log in.');
    } catch (error) {
      alert('User creation failed. Please try again.');
    }
  });
  