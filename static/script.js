function redirectToApiDocs() {
  window.location.href = 'http://127.0.0.1:8000/docs';
}

document.getElementById('login-form').addEventListener('submit', function(event) {
  event.preventDefault();

  var username = document.getElementById('username').value;
  var password = document.getElementById('password').value;

  var data = {
      'username': username,
      'password': password
  };

  fetch('http://127.0.0.1:8000/login', { // replace with your actual server address
      method: 'POST',
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(data),
  })
  .then(response => response.json())
  .then(data => {
      if(data.access_token){
          localStorage.setItem('access_token', data.access_token);
          alert("Login successful");
          // Redirect to another page or do something else
      } else {
          alert("Login failed");
      }
  })
  .catch((error) => {
      console.error('Error:', error);
  });
});
