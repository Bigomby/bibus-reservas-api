import requests

class colors:
    OK = "\033[92m"
    FAIL = "\033[91m"
    ENDC = "\033[0m"
    BOLD = "\033[1m"

def print_turn(turn):
    print(' ▶ [{}]:'.format(turn["time"]), end="")
    if turn["available"]:
        print("\t" + colors.OK + "Libre" + colors.ENDC)
    else:
        print("\t" + colors.FAIL + "Ocupada" + colors.ENDC)

def print_room(room):
    sala = "SALA " + str(room)
    print("-" * 31)
    print(colors.BOLD + sala.center(31, " ") + colors.ENDC)
    print("-" * 31)

response = requests.get("http://api.salas.gonebe.com/salas")
assert response.status_code == 200

for sala in response.json():
    print_room(sala["id"])
    for turn in sala["turns"]:
        print_turn(turn)
