from users.models import TwitchUser
    
def save_meta_data(backend, user, response, *args, **kwargs):    
    user.twitch_id = response['id']
    user.display_name = response['display_name']
    user.type = response['type']
    user.broadcaster_type = response['broadcaster_type']
    user.profile_image_url = response['profile_image_url']
    user.created_at = response['created_at']
    
    user.save()
