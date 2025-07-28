import requests
import time

url = "https://nfs.faireconomy.media/ff_calendar_thisweek.csv"

output_path = "forex_factory_thisweek.csv"

max_retries = 3
delay_seconds = 5

for attempt in range(1, max_retries + 1):
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        with open(output_path, "wb") as f:
            f.write(response.content)
        print(f"✅ Downloaded on attempt {attempt}")
        break
    except requests.RequestException as e:
        print(f"⚠️ Attempt {attempt} failed: {e}")
        if attempt < max_retries:
            print(f"⏳ Waiting {delay_seconds} seconds before retry...")
            time.sleep(delay_seconds)
        else:
            print("❌ All attempts failed.")
