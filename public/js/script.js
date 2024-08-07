const API_URL = "http://localhost:3000";

const favoritesArr = [];
const moviesArr = [];
async function getMovies() {
	try {
	  const response = await fetch(`${API_URL}/movies`);
	  if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
	  const movies = await response.json();
  
	  const moviesList = document.getElementById("moviesList");
	  moviesList.innerHTML = "";
  
	  movies.forEach((movie) => {
		moviesArr.push(movie);
		const card = createMovieCard(movie);
		const li = document.createElement("li");
		li.appendChild(card);
		moviesList.appendChild(li);
	  });
  
	  const buttons = document.querySelectorAll(".add-favourite-btn");
	  [...buttons].forEach((button) => {
		button.addEventListener("click", () => {
		  const movie = JSON.parse(button.dataset.movie);
		  console.log(movie);
		  addFavourite(movie.id);

		});
	  });
  
	  return movies; 
	} catch (error) {
	  console.error("Error occurred while fetching movies:", error);
	  throw error;
	}
  }
  

  async function getFavourites() {
	try {
	  const response = await fetch(`${API_URL}/favourites`);
	  if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
	  const favourites = await response.json();
	  console.log("Favourites: ", favourites);
  
	  const favouritesList = document.getElementById("favouritesList");
	  if (!favouritesList) throw new Error("Element with ID 'favouritesList' not found");
  
	  favouritesList.innerHTML = "";
  
	  favourites.forEach((movie) => {
		const card = createMovieCard(
		  movie,
		  "remove-favourite-btn",
		  "Remove from Favourite"
		);
		const li = document.createElement("li");
		li.appendChild(card);
		favouritesList.appendChild(li);
	  });
  
	  const buttons = document.querySelectorAll(".remove-favourite-btn");
	  [...buttons].forEach((button) => {
		button.addEventListener("click", () => {
		  const movie = JSON.parse(button.dataset.movie);
		  removeFromFavourite(movie);
		});
	  });
  
	  return favourites;
	} catch (error) {
	  console.error("Error occurred while fetching favourites:", error);
	  throw error; 
	}
  }
  async function addFavourite(movieId) {
	const movie = moviesArr.find(m => m.id === movieId);
  
	if (!favoritesArr.some(fav => fav.id === movieId)) {
	  console.log(favoritesArr, movie);
	  let postResponse;
	  try {
		postResponse = await fetch(`${API_URL}/favourites`, {
		  method: "POST",
		  headers: {
			"Content-Type": "application/json",
		  },
		  body: JSON.stringify(movie),
		});
  
		if (postResponse == null || postResponse == undefined) {
		  throw new Error('Dummy error from server');
		}
	  } catch (error) {
		throw new Error('Dummy error from server');
	  }
  
	  const newFavourite = await postResponse.json();
	  favoritesArr.push(newFavourite);
  
	  return favoritesArr;
	} else {
	  throw new Error('Movie is already added to favourites');
	}
  }  

async function removeFromFavourite(movie) {
  try {
    await fetch(`${API_URL}/favourites/${movie.id}`, {
      method: "DELETE",
    });
    getFavourites();
  } catch (error) {
    console.error("Error occurred while removing from favourites:", error);
  }
}

function createMovieCard(
  movie,
  buttonClass = "add-favourite-btn",
  buttonText = "Add to Favourite"
) {
  const cardHTML = `
    <div class="card mb-3" style="width: 18rem;">
      <img class="card-img-top" src="${movie.posterPath}" alt="${movie.title}">
      <div class="card-body">
        <h5 class="card-title">${movie.title}</h5>
        <p class="card-text">${movie.overview}</p>
        <p class="card-text"><small class="text-muted">Release Date: ${movie.releaseDate}</small></p>
        <p class="card-text"><small class="text-muted">Vote Count: ${movie.voteCount}</small></p>
        <p class="card-text"><small class="text-muted">Vote Average: ${movie.voteAverage}</small></p>
        <p class="card-text"><small class="text-muted">Popularity: ${movie.popularity}</small></p>
        <p class="card-text"><small class="text-muted">Original Language: ${movie.originalLanguage}</small></p>
        <p class="card-text"><small class="text-muted">Original Title: ${movie.originalTitle}</small></p>
        <p class="card-text"><small class="text-muted">Adult: ${movie.adult}</small></p>
        <button data-movie='${JSON.stringify(movie)}' class='${buttonClass}'>${buttonText}</button>
      </div>
    </div>
  `;

  const container = document.createElement('div');
  container.innerHTML = cardHTML;

  return container.firstElementChild;
}

module.exports = {
  getMovies,
  getFavourites,
  addFavourite,
  removeFromFavourite
};
