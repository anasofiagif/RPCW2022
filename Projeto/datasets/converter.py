import csv
import re
import os

# initial setup to json file
json = open('new_movies.json', 'w+')
json.write('[\n')

id = 0

with open('movies.csv') as movies, open('credits.csv') as credits:

    csv_movies = csv.DictReader(movies)
    csv_credits = csv.DictReader(credits)

    for rm, rc in zip(csv_movies, csv_credits):

        json.write('\t{\n')

        # id
        json.write('\t\t"_id": ' + str(id) + ",\n")
        id += 1

        # title
        json.write('\t\t"title": "' + rm['title'] + '",\n')

        # release date
        year = rm['release_date'].split('-')[0]
        if year:
            json.write('\t\t"year": ' + year + ',\n')
        else:
            json.write('\t\t"year": "",\n')

        # run time
        if rm['runtime']:
            json.write('\t\t"runtime": ' + rm['runtime'] + ",\n")
        else:
            json.write('\t\t"runtime": "",\n')

        # overview
        overview = rm['overview'].replace('"', "'")
        overview = overview.replace("\n", " ")
        json.write('\t\t"overview": "' + overview + '",\n')

        # studios
        pat = re.compile(r'"name": "([a-zA-Z\.\-\s][a-zA-Z\.\-\s]*)"')
        studios = rm['production_companies']
        studios = pat.findall(studios)

        json.write('\t\t"studios": [\n')

        if studios:
            for c in studios[:-1]:
                json.write('\t\t\t"' + c + '",\n')
            json.write('\t\t\t"' + studios[-1] + '"\n\t\t],\n')
        else:
            json.write('\t\t],\n')

        # countries
        pat = re.compile(r'"name": "([a-zA-Z\.\-\s][a-zA-Z\.\-\s]*)"')
        countries= rm['production_countries']
        countries = pat.findall(countries)

        json.write('\t\t"countries": [\n')

        if countries:
            for c in countries[:-1]:
                json.write('\t\t\t"' + c + '",\n')
            json.write('\t\t\t"' + countries[-1] + '"\n\t\t],\n')
        else:
            json.write('\t\t],\n')

         # language
        pat = re.compile(r'"name": "([a-zA-Z\.\-\s][a-zA-Z\.\-\s]*)"')
        language= rm['spoken_languages']
        language = pat.findall(language)

        json.write('\t\t"language": [\n')

        if language:
            for c in language[:-1]:
                json.write('\t\t\t"' + c + '",\n')
            json.write('\t\t\t"' + language[-1] + '"\n\t\t],\n')
        else:
            json.write('\t\t],\n')

         # director
        pat = re.compile(r'"job": "Director", "name": "([a-zA-Z\.\-\s][a-zA-Z\.\-\s]*)"')
        dir = rc['crew']
        dir = pat.findall(dir)

        json.write('\t\t"director": [\n')

        if dir:
            if len(dir) > 10:
                dir = dir[0:10]
            for c in dir[:-1]:
                json.write('\t\t\t"' + c + '",\n')
            json.write('\t\t\t"' + dir[-1] + '"\n\t\t],\n')
        else:
            json.write('\t\t],\n')

        # cast
        pat = re.compile(r'"name": "([a-zA-Z\.\-\s][a-zA-Z\.\-\s]*)", "order":')
        cast = rc['cast']
        cast = pat.findall(cast)

        json.write('\t\t"cast": [\n')

        if cast:
            if len(cast) > 10:
                cast = cast[0:10]
            for c in cast[:-1]:
                json.write('\t\t\t"' + c + '",\n')
            json.write('\t\t\t"' + cast[-1] + '"\n\t\t],\n')
        else:
            json.write('\t\t],\n')
        

        # genres
        pat = re.compile(r'"name": "([a-zA-Z\.\-\s][a-zA-Z\.\-\s]*)"')
        genres = rm['genres']
        genres = pat.findall(genres)

        json.write('\t\t"genres": [\n')

        if genres:
            for i in genres[:-1]:
                json.write('\t\t\t"' + i + '",\n')
            json.write('\t\t\t"' + genres[-1] + '"\n\t\t]\n')
        else:
            json.write('\t\t]\n')

        json.write('\t},\n')

json.close()

aux =  open('new_movies.json', 'r').read()
aux = aux[:-2]

json =  open('new_movies.json', 'w+')
json.write(aux)
json.write(']')
json.close()
