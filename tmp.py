import re
import json
from tqdm import tqdm
import time
from urllib.parse import urlparse, parse_qs

youtube_regex = r"^.*((youtu.be/)|(v/)|(/u/\w/)|(embed/)|(watch\?))\??v?=?([^#&?]*).*"


def get_id(url):
    u_pars = urlparse(url)
    quer_v = parse_qs(u_pars.query).get("v")
    if quer_v:
        return quer_v[0]
    pth = u_pars.path.split("/")
    if pth:
        return pth[-1]


with open("chat_formatted.json", "r") as f:
    data = json.load(f)

for comment in tqdm(data["comments"]):
    regex = r"(?i)\b((?:https?://|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'\".,<>?«»“”‘’]))"
    url = re.findall(regex, comment["message"]["body"])
    for x in url:
        match = get_id(x[0])
        print(match)
