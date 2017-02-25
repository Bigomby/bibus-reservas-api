import requests

class colors:
    OK = "\033[92m"
    FAIL = "\033[91m"
    GRAY = "\033[90m"
    ENDC = "\033[0m"
    BOLD = "\033[1m"

def print_slot(slot):
    print(' ▶ [{}]:'.format(slot["timeFrame"]), end="")
    if slot["status"] == "available":
        print("\t" + colors.OK + "Available" + colors.ENDC)
    elif slot["status"] == "reserved":
        print("\t" + colors.FAIL + "Reserved" + colors.ENDC)
    else:
        print("\t" + colors.GRAY + "Closed" + colors.ENDC)

def print_room(room):
    print("-" * 35)
    print(colors.BOLD + str(room).center(35, " ") + colors.ENDC)
    print("-" * 35)

response = requests.get("http://api.salas.gonebe.com/libraries/bia/rooms")
assert response.status_code == 200

for room in response.json():
    print_room(room["name"])
    for slot in room["slots"]:
        print_slot(slot)
