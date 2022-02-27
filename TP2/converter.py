import json
import os.path

# ----------------- AUXILIAR FUNCTIONS --------------------

# Removes invalid characters from a word
#   word: word from where the characters are going to be removed
def rm_char(word):

    invalid_char = '/. <>:|\?*"'

    for char in invalid_char:
        word = word.replace(char, "")

    return word

# Creates a new html file
#   name: file's name
#   title: file's title
def create_file(name, title):

    initial_content = ['<!DOCTYPE html>\n',
                       '<html>\n', 
                       '\t<head>\n', 
                       '\t\t<meta charset="UTF-8">\n',
                       '\t\t<title>' + title + '</title>\n',
                       '\t\t<b><a href="../films">Films</a></b>\n',
                       '\t\t<b><a href="../actors">Actors</a></b>\n'
                       '\t</head>\n',
                       '\t<body>\n',
                       '\t\t<h1>' + title + '</h1>\n']

    f = open(name, "w+")
    f.writelines(initial_content)

    return f

# Adds final tags to the file and closes it 
#   file: file pointer
def close_file(file):
    file.write("\t\t</ul>\n\t</body>\n</html>")
    file.close()

# Create output folders if they don't exist
#   folder: name of the output folder
def mk_output_dir(directory: str):
    try:
        if not os.path.exists(directory):
            os.mkdir(directory)
        if not os.path.exists(f"{directory}/films"):
            os.mkdir(f"{directory}/films")
        if not os.path.exists(f"{directory}/actors"):
            os.mkdir(f"{directory}/actors")
    except:
        print("Problem creating %s directory." % directory)

# ----------------- MAIN FUNCTION --------------------

def main():

    # output folder name
    out = "out"

    # create output folders
    mk_output_dir(out)
    
    # open and read the JSON file
    f = open('cinemaATP.json')
    films = json.load(f)

    # sort films in alphabetical order
    films.sort(key= lambda x : x["title"].lower())

    # create the film index 
    index = create_file("out/films.html","Films")
    index.write("\t\t<ul>\n")

    # dictionary to store actors and their films 
    actors = {}

    # iterate through every film
    for film in films:

        title = film['title']

        # remove invalid characters from the film's title
        newTitle = rm_char(title)

        # register film on the index
        index.write('\t\t\t<li><a href = "films/' + newTitle + '">' + title + '</a></li>\n')

        # create a new film file 
        ff = create_file("out/films/" + newTitle + ".html", title)

        # write the film info in the file
        ff.write("\t\t<p><b>Year:&nbsp;</b>" + str(film['year']) + "</p>\n")
        ff.write("\t\t<p><b>Cast:</b></p>\n\t\t<ul>\n")

        for actor in film['cast']:

            ff.write('\t\t\t<li><a href = "../actors/' + rm_char(actor) + '">' + actor + '</a></li>\n')

            # add actor and/or film to the dictionary 
            if actor in actors:
                actors[actor].append(title)
            else:
                actors[actor] = [title]
        
        ff.write("\t\t</ul>\n")

        ff.write("\t\t<p><b>Genres:</b></p>\n\t\t<ul>\n")
        for genre in film['genres']:
            ff.write("\t\t\t<li>" + genre + "</li>\n")
    
        close_file(ff)

    close_file(index)
    f.close()

    # sort actors in alphabetical order
    actors = sorted(actors.items())

    # create the actor index 
    aIndex = create_file("out/actors.html","Actors")
    aIndex.write("\t\t<ul>\n")

    # build actor's files
    for actor in actors:

        newName = rm_char(actor[0])

        # register actor on the index
        aIndex.write('\t\t\t<li><a href = "actors/' + newName + '">' + actor[0] + '</a></li>\n')

        # create new actor file
        af = create_file("out/actors/" + newName + ".html", actor[0])

        # write actor's films
        af.write("\t\t<ul>\n")

        for film in actor[1]:
            af.write('\t\t\t<li><a href = "../films/' + rm_char(film) + '">' + film + '</a></li>\n')

        close_file(af)
    
    close_file(aIndex)

if __name__ == "__main__":
    main()