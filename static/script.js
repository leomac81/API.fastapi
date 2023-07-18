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

function createHabit() {
  // Create the habit object from form data
  const habit = {
    public: document.getElementById('public').checked,
    frequency: document.getElementById('frequency').value,
    description: document.getElementById('habit_description').value,
    end_goal: document.getElementById('end_goal').value,
    end_date: document.getElementById('end_date').value,
  };

  // Fetch the current user
  const currentUser = 1; // Replace with actual current user

  // Send a POST request to the server
  fetch('/habits/create_habit/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${currentUser}` // Replace with your token-based authentication system
    },
    body: JSON.stringify(habit)
  })
  .then(response => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error('Failed to create habit');
    }
  })
  .then(data => {
    // Do something with the returned data
    console.log(data);
  })
  .catch(error => {
    console.error('Error:', error);
  });
}


async function displayHabits(habits) {
  const habitsContainer = document.getElementById('habits-container');
  habitsContainer.style.display = 'block';
  document.getElementById('logout-button').style.display = 'block';
  const createHabitForm = document.getElementById('create-habit-form');
  createHabitForm.style.display = 'block';

  habits.forEach(habit => {
    const habitElement = document.createElement('div');
    habitElement.classList.add('habit');

    const habitDescription = document.createElement('p');
    habitDescription.textContent = `Description: ${habit.habit_description}`;
    habitElement.appendChild(habitDescription);

    const habitEndGoal = document.createElement('p');
    habitEndGoal.textContent = `End Goal: ${habit.end_goal}`;
    habitElement.appendChild(habitEndGoal);

    const habitEndDate = document.createElement('p');
    let date = new Date(habit.end_date);
    let formattedDate = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
    habitEndDate.textContent = `End Date: ${formattedDate}`;
    habitElement.appendChild(habitEndDate);




    const habitFrequency = document.createElement('p');
    habitFrequency.textContent = `Frequency: ${habit.frequency}`;
    habitElement.appendChild(habitFrequency);

    const habitCompletions = document.createElement('p');
    let completedBool = habit.completions.filter(completion => completion.completed).map(completion => completion.completed);
    habitCompletions.textContent = `Completions: ${completedBool.join(', ')}`;
    habitElement.appendChild(habitCompletions);


    habitsContainer.appendChild(habitElement);
  });
}
function logout() {
  localStorage.removeItem('access_token');

  document.getElementById('habits-container').style.display = 'none';
  document.getElementById('create-habit-form').style.display = 'none';
  document.getElementById('login-container').style.display = 'block';
}

document.getElementById('logout-button').addEventListener('click', logout);

document.getElementById('login-form').addEventListener('submit', async (event) => {
  event.preventDefault();

  const email = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  if (event.submitter.name === 'signin') {
    try {
      const accessToken = await login(email, password);
      const habits = await getHabits(email, accessToken);
      displayHabits(habits);

      document.getElementById('login-container').style.display = 'none';
    } catch (error) {
      alert('Login failed. Please check your credentials and try again.');
    }
  } else if (event.submitter.name === 'register') {
    try {
      const newUser = await createUser(email, password);
      alert('User created successfully. Please log in.');
    } catch (error) {
      alert('User creation failed. Please try again.');
    }
  }
});

document.getElementById('create-habit-form').addEventListener('submit', async (event) => {
  event.preventDefault();

  
    try {
      const accessToken = await createHabit();

    } catch (error) {
      alert('Habit creation failed.');
    }
});
