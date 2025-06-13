import requests
import json

# IMPORTANT: Replace with your actual API Key and Token
API_KEY = "bf371933fcd49ba099774ba087050e38"  # Replace with your Trello API Key (bf371933fcd49ba099774ba087050e38)
TOKEN = "ATTA3f27a64d09d2ceef38759b7f1941ca024bc84c274224f592b84fe11c701398898D4A4EE9"    # Replace with the Token you just generated

# The Trello API endpoint to get the user's boards
# 'me' refers to the user whose token is being used
url = f"https://api.trello.com/1/members/me/boards?key={API_KEY}&token={TOKEN}"

headers = {
    "Accept": "application/json"
}

try:
    response = requests.get(url, headers=headers)
    response.raise_for_status()  # This will raise an exception for HTTP errors (4xx or 5xx)

    boards = response.json()

    if boards:
        print("Successfully connected to Trello! Your boards are:")
        for board in boards:
            print(f"- {board['name']} (ID: {board['id']})")
    else:
        print("Successfully connected to Trello, but you don't seem to have any boards.")

except requests.exceptions.HTTPError as http_err:
    print(f"HTTP error occurred: {http_err}")
    print(f"Response content: {response.content}")
except requests.exceptions.RequestException as req_err:
    print(f"A Request error occurred: {req_err}")
except json.JSONDecodeError:
    print("Failed to decode JSON response. The response was:")
    print(response.text)
except Exception as err:
    print(f"An unexpected error occurred: {err}") 