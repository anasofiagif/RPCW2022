FROM mongo:latest
COPY new_movies.json .
# RUN ['mongoimport','-d', 'FilmLog', '-c', 'movies', '--file', 'new_movies.json' ,'--jsonArray']
CMD mongoimport -d FilmLog -c movies --file new_movies.json --jsonArray
EXPOSE 27017