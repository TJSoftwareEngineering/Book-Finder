
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('recommendationForm');
  const genreInput = document.getElementById('genreInput');
  const recommendationsDiv = document.getElementById('recommendations');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const genre = genreInput.value;
    const recommendations = await getBookRecommendation(genre);

    displayRandomRecommendations(recommendations, 3);
  });
});

async function getBookRecommendation(genre) {
  try {
    const randomString = Math.random().toString(36).substring(7);
    // Fetch books from API based on genre
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=subject:${genre}&maxResults=40&random=${randomString}`
    );

    const data = await response.json();

    // Extract relevant info
    const books = data.items.map((book) => ({
      title: book.volumeInfo.title,
      authors: book.volumeInfo.authors,
      description: book.volumeInfo.description,
      previewLink: book.volumeInfo.previewLink,
    }));

    // Shuffle books
    const shuffledBooks = shuffleArray(books);

    return shuffledBooks;
  } catch (error) {
    console.error('Error fetching book recommendations:', error.message);
    return [];
  }
}

function displayRandomRecommendations(recommendations, count) {
  const recommendationsDiv = document.getElementById('recommendations');

  // Clear previous recommendations
  recommendationsDiv.innerHTML = '';

  if (recommendations.length === 0) {
    recommendationsDiv.innerHTML = '<p>No recommendations found.</p>';
    return;
  }

  // Display 3 random recommendations
  const selectedRecommendations = recommendations.slice(0, count);

  selectedRecommendations.forEach((book) => {
    const bookDiv = document.createElement('div');
    bookDiv.innerHTML = `
    <div class='recommendationContainer'>
      <div class='recTitle'>${book.title}</div>
      <p class='recAuthor'>By ${book.authors.join(', ')}</p>
      <p class='recDescription'>${book.description}</p>
      <a class='recLink' href="${book.previewLink}" target="_blank">Preview Link</a>
    </div>
    `;
    recommendationsDiv.appendChild(bookDiv);
  });
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
