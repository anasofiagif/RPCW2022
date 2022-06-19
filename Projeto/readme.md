# **API**

## **Setup:**

In order to use this API, you need to create and populate a database in MongoDB by following the next steps:

1. Download datasets from [Kaggle](https://www.kaggle.com/datasets/tmdb/tmdb-movie-metadata) 

2. Move the downloaded datasets to the `datasets` directory

3. Rename datasets:
- `tmdb_5000_movies.csv` to `movies.csv`
- `tmdb_5000_credits.csv` to `credits.csv`

3. `cd datasets`

4. `python converter.py`

5. `mongoimport -d FilmLog -c movies --file new_movies.json --jsonArray`

**Note:** You only need to execute this setup **once**.

## **Running the API-Server:**

1. `cd api-server`

2. `npm start`

## **Available routes:**
- **GET /api/movies -** lists movie's complete information, sorted by title
- **GET /api/movies/:id -** return a movie's complete information
- **GET /api/movies?genre=X -** lists movies that belong to a certain genre
- **GET /api/movies?q=X -** lists movies that contain a certain string on their name

**Note:** In order to consult the API through the browser, access `http://localhost:4444/`


