function redirectToApiDocs() {
  window.location.href = 'http://127.0.0.1:8000';
}

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

async function getHabits(userEmail, accessToken) {
  const response = await fetch(`/habits/${encodeURIComponent(userEmail)}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`
    },
  });

  if (response.status === 200) {
    const data = await response.json();
    return data;
  } else {
    throw new Error('Unable to retrieve habits');
  }
}

async function displayHabits(habits) {
  const habitsContainer = document.getElementById('habits-container');
  
  habits.forEach(habit => {
    const habitElement = document.createElement('div');
    habitElement.classList.add('habit');
    habitElement.textContent = habit.habit_description;  // Replace 'name' with whatever property your Habit has for its name
    habitsContainer.appendChild(habitElement);
  });
}

document.getElementById('login-form').addEventListener('submit', async (event) => {
  event.preventDefault();

  const email = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  try {
    const accessToken = await login(email, password);
    const habits = await getHabits(email, accessToken);
    displayHabits(habits);
  } catch (error) {
    alert('Login failed. Please check your credentials and try again.');
  }
});

