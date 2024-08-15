const searchButton = document.querySelector(".search-button");
const inputKeyword = document.querySelector(".input-keyword");
const alertContainer = document.querySelector(".alert-container");

// fungsi untuk menjalankan pencarian
async function searchMovie() {
  clearErrorAlert(); // hapus pesan error sebelum jalankan fungsi
  if (inputKeyword.value.trim() === "") {
    showErrorAlert(
      new Error("Search field cannot be empty. Please enter a movie title.")
    );
    return;
  }
  try {
    const movies = await getMovies(inputKeyword.value);
    updateUI(movies);
  } catch (err) {
    showErrorAlert(err);
  }
}

// event listener untuk tombol search
searchButton.addEventListener("click", function () {
  searchMovie();
});

// event listener untuk tombol enter
inputKeyword.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    searchMovie();
  }
});

// event binding untuk tombol detail
document.addEventListener("click", async function (e) {
  if (e.target.classList.contains("modal-detail-button")) {
    try {
      const imdbid = e.target.dataset.imdbid;
      const movieDetail = await getMovieDetail(imdbid);
      updateUIDetail(movieDetail);
    } catch (err) {
      showErrorAlert(err);
    }
  }
});

// fetch data movie
function getMovies(keyword) {
  const apiKey = "{apikey}"; // Ganti {apikey} dengan API key Anda
  return fetch(`http://www.omdbapi.com/?apikey=${apiKey}&s=${keyword}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.json();
    })
    .then((response) => {
      if (response.Response === "False") {
        throw new Error(response.Error);
      }
      return response.Search;
    });
}

// update tampilan data movie
function updateUI(movies) {
  let cards = "";
  movies.forEach((m) => (cards += showCards(m)));
  const movieContainer = document.querySelector(".movie-container");
  movieContainer.innerHTML = cards;
}

// fetch data detail movie
function getMovieDetail(imdbid) {
  const apiKey = "{apikey}"; // Ganti {apikey} dengan API key Anda
  return fetch(`http://www.omdbapi.com/?apikey=${apiKey}&i=${imdbid}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.json();
    })
    .then((m) => m);
}

// update tampilan detail movie
function updateUIDetail(m) {
  const movieDetail = showMovieDetail(m);
  const modalBody = document.querySelector(".modal-body");
  modalBody.innerHTML = movieDetail;
}

// menampilkan error alert
function showErrorAlert(err) {
  const alert = `
    <div class="alert alert-danger alert-dismissible fade show" role="alert">
      <strong>Error:</strong> ${err.message}
    </div>`;
  alertContainer.innerHTML = alert;
}

// menghapus tampilan error alert
function clearErrorAlert() {
  alertContainer.innerHTML = "";
}

// Fungsi untuk menampilkan kartu film
function showCards(m) {
  return `
    <div class="col-md-4 my-3">
      <div class="card">
        <img src="${m.Poster}" class="card-img-top" />
        <div class="card-body">
          <h5 class="card-title">${m.Title}</h5>
          <h6 class="card-subtitle mb-2 text-muted">${m.Year}</h6>
          <a href="#" class="btn btn-primary modal-detail-button" data-toggle="modal"
          data-target="#movieDetailModal" data-imdbid="${m.imdbID}">Show Details</a>
        </div>
      </div>
    </div>`;
}

// Fungsi untuk menampilkan detail film
function showMovieDetail(m) {
  return `
    <div class="container-fluid">
      <div class="row">
        <div class="col-md-3">
          <img src="${m.Poster}" alt="" class="img-fluid" />
        </div>
        <div class="col-md">
          <ul class="list-group">
            <li class="list-group-item"><h4>${m.Title} (${m.Year})</h4></li>
            <li class="list-group-item">
              <strong>Director:</strong> ${m.Director}
            </li>
            <li class="list-group-item">
              <strong>Actors:</strong> ${m.Actors}
            </li>
            <li class="list-group-item">
              <strong>Writer:</strong> ${m.Writer}
            </li>
            <li class="list-group-item">
              <strong>Plot:</strong> <br />
              ${m.Plot}
            </li>
          </ul>
        </div>
      </div>
    </div>`;
}
