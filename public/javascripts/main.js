document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');

  if (loginForm) {
    const errorMessageDiv = document.getElementById('error-message');

    loginForm.addEventListener('submit', async (event) => {
      event.preventDefault(); // Prevent page from reloading

      const formData = new FormData(loginForm);
      const data = Object.fromEntries(formData.entries());

      try {
        const response = await fetch('/users/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        const result = await response.json();

        if (!response.ok) {
          // This block runs for errors (like status 401)
          errorMessageDiv.textContent = result.message;
          errorMessageDiv.style.display = 'block'; // Show the error div
        } else {
          // This block runs for success (status 200)
          window.location.href = result.redirectTo || '/'; // Redirect to the profile page or homepage
        }
      } catch (error) {
        // This catches network errors etc.
        errorMessageDiv.textContent = 'A network or server error occurred. Please try again.';
        errorMessageDiv.style.display = 'block';
      }
    });
  }

  // Handle asynchronous like button clicks
  document.querySelectorAll('.like-form').forEach(form => {
    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      const actionUrl = form.getAttribute('action');
      const likesCountSpan = form.closest('.card').querySelector('.likes-count');

      try {
        const response = await fetch(actionUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const result = await response.json();
          likesCountSpan.textContent = result.likes;
        }
      } catch (error) {
        console.error('Failed to like the outfit:', error);
      }
    });
  });

  // Handle dynamic battle voting
  function setupBattleForms() {
    document.querySelectorAll('.battle-form').forEach(form => {
      form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const battleContainer = form.closest('.battle-container');
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        try {
          // --- New, more robust logic ---
          const outfit1Id = battleContainer.querySelector('.outfit1-winner').value;

          const response = await fetch('/battle/vote', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
          });

          if (!response.ok) throw new Error('Vote failed');

          const { winnerId } = await response.json();

          // --- New, more robust logic ---
          // 1. Find the winner's card and wins span using the unique ID
          const winsSpan = document.getElementById(`wins-${winnerId}`);
          const winnerCard = winsSpan ? winsSpan.closest('.battle-card') : null;

          // 2. Increment the win count and apply flash effect
          if (winsSpan && winnerCard) {
            const currentWins = parseInt(winsSpan.textContent, 10);
            winsSpan.textContent = currentWins + 1;
            winnerCard.classList.add('winner-flash');
          }

          // 3. After a delay, replace the battle with a thank you message
          setTimeout(() => {
            // Replace the battle with a thank you message.
            battleContainer.innerHTML = '<div class="card-body text-center"><p class="lead text-success">Thanks for voting!</p></div>';
          }, 700); // 0.7 second delay
        } catch (error) {
          console.error('Error during battle:', error);
        }
      });
    });
  }

  // Initial setup for the battle forms when the page loads
  if (document.getElementById('battle-arena')) {
    setupBattleForms();
  }
});