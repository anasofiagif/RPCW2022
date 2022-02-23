import json
import os.path

# Characters that need to be removed from the file's names
invalid_char = "/. <>:|\?*"

# Open and read the JSON file
f = open('cinemaATP.json')
films = json.load(f)

# Sort films in alphabetical order
films.sort(key= lambda x : x["title"].lower())

# Create film index file
index = open("filmsIndex.html", "w+")
index.write("<h1>Films</h1>\n\n<ul>\n")

# Iterate through every film
for film in films:

    title = film['title']

    # Remove invalid characters from the film's title
    newTitle = title
    for char in invalid_char:
        newTitle = newTitle.replace(char, "")

    # Create a new film file
    ff = open("films/" + newTitle + ".html", "w+")

    # Register film on the index
    index.write('<li> <a href = "localhost:1441/films/' + newTitle + '">' + title + '</a> </li>\n')

    # Write the film info in the file 
    ff.write("<h1>" + title + "</h1>\n\n")
    ff.write("<p><b>Year:&nbsp;</b>" + str(film['year']) + "</p>\n\n")
    ff.write("<p><b>Cast:</b></p>\n<ul>\n")

    for actor in film['cast']:

        # Remove invalid characters from the actor's name
        newName = actor
        for char in invalid_char:
            newName = newName.replace(char, "")
        afName = "actors/" + newName + ".html"

        ff.write('<li> <a href = "localhost:1441/actors/' + newName + '">' + actor + '</a> </li>\n')

        # Edit an existing actor file
        if os.path.exists(afName):
            af = open(afName, "a")

        # Create a new actor file
        else:
            af = open(afName, "w+")
            af.write("<h1>" + actor + "</h1>\n\n")
            

        af.write('<li> <a href = "localhost:1441/films/' + newTitle + '">' + title + '</a> </li>\n')
        af.close()
    
    ff.write("</ul>\n\n")

    ff.write("<p><b>Genres:</b></p>\n<ul>\n")
    for genre in film['genres']:
        ff.write("<li>" + genre + "</li>\n")
    
    ff.write("</ul>\n")

    ff.close()

index.write("</u>")
index.close()
f.close()