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


  // Event listeners for displaying forms
document.getElementById('create-user-btn').addEventListener('click', () => {
  displayForm('create-user-form');
});

document.getElementById('create-post-btn').addEventListener('click', () => {
  displayForm('create-post-form');
});

document.getElementById('get-user-btn').addEventListener('click', () => {
  displayForm('get-user-form');
});

document.getElementById('vote-btn').addEventListener('click', () => {
  displayForm('vote-form');
});

function displayForm(formId) {
  document.querySelectorAll('.form-container').forEach((form) => {
    form.style.display = 'none';
  });
  document.getElementById(formId).style.display = 'block';
}

// Event listeners for form submissions
document.getElementById('create-user-form').addEventListener('submit', async (event) => {
  event.preventDefault();

  const email = document.getElementById('create-user-email').value;
  const password = document.getElementById('create-user-password').value;

  try {
    const newUser = await createUser({ email: email, password: password });
    alert(`User created with ID: ${newUser.id}`);
  } catch (error) {
    alert('Failed to create user');
  }
});

document.getElementById('create-post-form').addEventListener('submit', async (event) => {
  event.preventDefault();

  const title = document.getElementById('create-post-title').value;
  const content = document.getElementById('create-post-content').value;
  const published = document.getElementById('create-post-published').checked;

  try {
    const newPost = await createPost({ title: title, content: content, published: published });
    alert(`Post created with ID: ${newPost.id}`);
  } catch (error) {
    alert('Failed to create post');
  }
});

document.getElementById('get-user-form').addEventListener('submit', async (event) => {
  event.preventDefault();

  const userId = document.getElementById('get-user-id').value;

  try {
    const user = await getUser(userId);
    alert(`User ID: ${user.id}, Email: ${user.email}`);
  } catch (error) {
    alert('Failed to get user');
  }
});

document.getElementById('vote-form').addEventListener('submit', async (event) => {
  event.preventDefault();

  const postId = document.getElementById('vote-post-id').value;
  const dir = document.getElementById('vote-dir').value;

  try {
    const response = await vote({ post_id: postId, dir: parseInt(dir) });
    alert(`Vote action: ${response.message}`);
  } catch (error) {
    alert('Failed to perform vote action');
  }
});

// Implement the API calls for each action
async function createUser(userData) {
  const response = await fetch('/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return await response.json();
}

async function createPost(postData) {
  const response = await fetch('/posts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(postData),
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return await response.json();
}

async function getUser(id) {
  const response = await fetch(`/users/${id}`, {
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch user');
  }

  const user = await response.json();
  console.log('Fetched user:', user);
  return user;
}

async function vote(postId, direction) {
  const response = await fetch('/vote/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
    },
    body: JSON.stringify({
      post_id: postId,
      dir: direction,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to vote');
  }

  const result = await response.json();
  console.log('Vote result:', result);
  return result;
}
