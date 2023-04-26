"use strict";

window.addEventListener("load", start);
const endpoint = "https://byca-crud-default-rtdb.europe-west1.firebasedatabase.app/";

async function start() {
    const moviesArray = await getMovies(endpoint);
    showMovies(moviesArray);
}

async function getMovies(url) {
    const response = await fetch(`${url}movies.json`);
    const data = await response.json();
    const preparedData = prepareData(data);
    return preparedData;
}

function prepareData(dataObject) {
    const movies = [];

    for (const key in dataObject) {
        const movie = dataObject[key];
        movie.id = key;
        movies.push(movie);
    }
    return movies;
}

function showMovies(movies) {
    for (const movie of movies) {
        showMovie(movie);
    }
}

function showMovie(movie) {
    const moviesContainer = document.querySelector("#movie-grid");
    const movieHTML = /*html*/ `
  
  <article class="grid-item" > 
  <img src="${movie.poster}" >
  </article>

  `;

    moviesContainer.insertAdjacentHTML("beforeend", movieHTML);
    document.querySelector("#movie-grid article:last-child").addEventListener("click", movieClicked);

    function movieClicked(event) {
        showMovieDialog(movie);
    }
}

function showMovieDialog(movie) {
    document.querySelector("#dialog-modal").innerHTML = "";

    const genreString = getGenreTagsAsString(movie.genreTags)

    const section = /*html*/ `
	<section class="movie-details-section">
        <article class="movie-details-functions">
            <button id="movie-update-btn">Update details</button>
            <button id="movie-remove-btn">Remove</button>
        </article>

        <article class="movie-details-header">
            <p>${movie.title}</p>
            <p>${movie.year}</p>
            <p>${movie.runtime} Minutes</p>
            <p>${movie.score}</p>
        </article>

        <article class="movie-details-main">
            <div>
                <img src="${movie.poster}">
            </div>

            <div>
                <iframe src="${movie.trailer}"></iframe>
            </div>
        </article>

        <article class="movie-details-other">
            <div>
                <p>${genreString}</p>
                <p>${movie.director}</p>
                <p>${movie.description}</p>
            </div>
            <div>
                <p>Actors:</p>
                <ul id="movie-actor-list">
                    
                </ul>
            </div>
        </article>
    </section>
    `;

    document.querySelector("#dialog-modal").insertAdjacentHTML("beforeend", section)
    populateActorList(movie.actorStars)


    document.querySelector("#movie-update-btn").addEventListener("click", updateClicked);
    document.querySelector("#movie-remove-btn").addEventListener("click", removeClicked);

    function updateClicked() {
        document.querySelector("#movie-update-btn").addEventListener("click", updateClicked);
        // kald på brains funktion med movie som argument mhp. updater
    }

    function removeClicked() {
        document.querySelector("#movie-remove-btn").removeEventListener("click", removeClicked);
        // kald på brains funktion med movie som argument mhp. slet
    }

    document.querySelector("#dialog-modal").showModal();
}

function getGenreTagsAsString(genreTags) {
    let genreString = "";

    for (let i = 0; i < genreTags.length; i++){
        if (i === genreTags.length - 1) {
            genreString += genreTags[i];
        } else {
            genreString += `${genreTags[i]}, `;
        }
    }

    return genreString
}

function populateActorList(actors) {
    for (const actor of actors) {
        const html = /*html*/`
        <li>${actor}</li>
        `
        document.querySelector("#movie-actor-list").insertAdjacentHTML("beforeend", html);
    }
}
