FROM mongo
COPY . .
CMD mongoimport --host mongo -d FilmLog -c movies --file new_movies.json --jsonArray
