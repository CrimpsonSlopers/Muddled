import requests

def is_stream_live(channel_name, client_id, oauth_token):
    url = f"https://api.twitch.tv/helix/streams?user_login={channel_name}"
    headers = {
        'Authorization': f'Bearer {oauth_token}',
        "Client-ID": client_id,
    }
    response = requests.get(url, headers=headers)
    data = response.json()

    print(data)

    if "data" in data and len(data["data"]) > 0:
        # If there is data and the stream is live, return True
        return True
    else:
        # If there is no data or the stream is offline, return False
        return False

# Replace 'YOUR_CLIENT_ID' with your Twitch API client ID
oauth_token = "midf6aaz8hgc14usszu0dgmmo2gqdd"
client_id = "0dtk34naiy7fvawd3x204afor6w76o"
channel_name = "atrioc"

if is_stream_live(channel_name, client_id, oauth_token):
    print(f"{channel_name} is live!")
else:
    print(f"{channel_name} is offline.")