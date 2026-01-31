const historyList = document.getElementById('historyList');
const clearBtn = document.getElementById('clearHistoryBtn');

// Load history from localStorage
let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];

// Function to display history
function displayHistory() {
  historyList.innerHTML = '';
  if (searchHistory.length === 0) {
    historyList.innerHTML = '<li>No search history found</li>';
    return;
  }

  searchHistory.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item;

    // Clicking goes back to index.html with that search term
    li.addEventListener('click', () => {
      localStorage.setItem('lastSearch', item);
      window.location.href = 'index.html';
    });

    historyList.appendChild(li);
  });
}

displayHistory();

// Clear history
clearBtn.addEventListener('click', () => {
  localStorage.removeItem('searchHistory');
  searchHistory = [];
  displayHistory();
});
