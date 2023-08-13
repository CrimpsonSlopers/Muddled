'''
Django settings for muddle project.

Generated by 'django-admin startproject' using Django 4.2.3.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/4.2/ref/settings/
'''

import os
from pathlib import Path

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-abaabllth4ipn#eyi*6w9ra3!sjo)=6+yde^i_d-)9y5wx#sr3'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = [ 'localhost', '3.129.228.189', 'muddled.live', 'www.muddled.live' ]


# Application definition

INSTALLED_APPS = [
    'corsheaders',
    'rest_framework',

    'api.apps.ApiConfig',
    'frontend.apps.FrontendConfig',
    'users.apps.UsersConfig',
   
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    'oauth2_provider',
    'social_django',
    'drf_social_oauth2',
]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:8000",
    "http://127.0.0.1:8000",
]

CORS_ALLOW_ALL_ORIGINS = True

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    # Oauth
    #'social_django.middleware.SocialAuthExceptionMiddleware',
    'django.middleware.common.CommonMiddleware',
    #'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'oauth2_provider.middleware.OAuth2TokenMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'muddle.urls'


TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',      

                'social_django.context_processors.backends',
                'social_django.context_processors.login_redirect',       
            ],
        },
    },
]

WSGI_APPLICATION = 'muddle.wsgi.application'


# Database
# https://docs.djangoproject.com/en/4.2/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}


# Password validation
# https://docs.djangoproject.com/en/4.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Custom user model
AUTH_USER_MODEL = "users.TwitchUser"

# Internationalization
# https://docs.djangoproject.com/en/4.2/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.2/howto/static-files/

STATIC_URL = 'static/'

STATIC_ROOT = os.path.join(BASE_DIR, 'static/')

# Default primary key field type
# https://docs.djangoproject.com/en/4.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

SOCIAL_AUTH_PIPELINE = (
    # Get the information we can about the user and return it in a simple
    # format to create the user instance later. In some cases the details are
    # already part of the auth response from the provider, but sometimes this
    # could hit a provider API.
    'social_core.pipeline.social_auth.social_details',
    # Get the social uid from whichever service we're authing thru. The uid is
    # the unique identifier of the given user in the provider.
    'social_core.pipeline.social_auth.social_uid',
    # Verifies that the current auth process is valid within the current
    # project, this is where emails and domains whitelists are applied (if
    # defined).
    'social_core.pipeline.social_auth.auth_allowed',
    # Checks if the current social-account is already associated in the site.
    'social_core.pipeline.social_auth.social_user',
    # Make up a username for this person, appends a random string at the end if
    # there's any collision.
    'social_core.pipeline.user.get_username',
    # Associates the current social details with another user account with
    # a similar email address. Disabled by default.
    'social_core.pipeline.social_auth.associate_by_email',
    # Create a user account if we haven't found one yet.
    'social_core.pipeline.user.create_user',
    'users.pipeline_utils.save_meta_data',
    # Create the record that associates the social account with the user.
    'social_core.pipeline.social_auth.associate_user',
    # Populate the extra_data field in the social record with the values
    # specified by settings (and the default ones like access_token, etc).
    'social_core.pipeline.social_auth.load_extra_data',
    # Update the user record with any changed info from the auth service.
    'social_core.pipeline.user.user_details',
)

YOUTUBE_API_KEY = 'AIzaSyBcAGB3CipbV0ywYEzWpSMpe7FJilp47Hg'

"""
SOCIAL_AUTH_LOGIN_ERROR_URL = '/api/social-auth-login-error-url'
SOCIAL_AUTH_NEW_USER_REDIRECT_URL = '/api/social-auth-new-user-redirect-url'
SOCIAL_AUTH_INACTIVE_USER_URL = '/api/social-auth-inactive-user-url'
SOCIAL_AUTH_DISCONNECT_REDIRECT_URL = '/api/social-auth-disconnect-redirect-url'
SOCIAL_AUTH_NEW_ASSOCIATION_REDIRECT_URL = '/api/social-auth-new-association-redirect-url'
"""

REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.AllowAny',
    ],
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'oauth2_provider.contrib.rest_framework.OAuth2Authentication',
        'drf_social_oauth2.authentication.SocialAuthentication',
    ),
}


AUTHENTICATION_BACKENDS = [
    'social_core.backends.twitch.TwitchOAuth2',
    'django.contrib.auth.backends.ModelBackend',
    'drf_social_oauth2.backends.DjangoOAuth2',
]

DJANGO_CLIENT_ID = 'd5tuuQVUuUc5tVkjjWSaolsLKwiBYG6bnvBPxD2g'
DJANGO_SECRET_KEY = 'Qfj5iBYZZDKilIs3FxcRuQ2Sz66LA3Lj8dWQ5UIE01CzuhWqXBa7ePJzoUCFFnIZYQbTPH3ZtwRFdjxuVycDpRhpdqJYtovI8O8rbz5JFrMDeHsiJOmuYsqdcMMs4jc0'

YOUTUBE_API_KEY = 'AIzaSyBcAGB3CipbV0ywYEzWpSMpe7FJilp47Hg'

# Twitch configuration
SOCIAL_AUTH_TWITCH_KEY = 'bs99mqyazrfa7tut83c2wa108xasmz'
SOCIAL_AUTH_TWITCH_SECRET = 'bvwn6hdxaq7d9f3e590awx2z58pmon'
SOCIAL_AUTH_TWITCH_SCOPE = 'user:read:email'
SOCIAL_AUTH_TWITCH_PROFILE_EXTRA_PARAMS = { 'fields': 'id, login, display_name' }

APPEND_SLASH = True