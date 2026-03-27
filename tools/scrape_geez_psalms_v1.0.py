import requests
from bs4 import BeautifulSoup
import json
import time
import re

# CONFIGURATION
# URL for "Mezmure Dawit" (Psalms of David)
BASE_URL_TEMPLATE = "https://www.ethiopicbible.com/books/%E1%88%98%E1%8B%9D%E1%88%99%E1%88%A8-%E1%8B%B3%E1%8B%8A%E1%89%B5-{}"
OUTPUT_FILE = "geez_psalms_1988.json"

def scrape_chapter(chapter_num):
    url = BASE_URL_TEMPLATE.format(chapter_num)
    print(f"Requesting Chapter {chapter_num} (Ge'ez)...")

    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36'
        }
        response = requests.get(url, headers=headers)

        if response.status_code != 200:
            print(f"❌ Failed to retrieve Chapter {chapter_num}. Status: {response.status_code}")
            return None

        soup = BeautifulSoup(response.content, 'html.parser')

        # 1. FIND THE GE'EZ CONTAINER
        # Based on the HTML provided, we look for this specific class
        geez_container = soup.find('div', class_='geezBibleChapterContainer')

        if not geez_container:
            print(f"⚠️ Warning: 'geezBibleChapterContainer' class not found for Chapter {chapter_num}.")
            return None

        # 2. FIND THE VERSES TABLE/CONTAINER
        verses_container = geez_container.find('div', class_='versesContainer')
        if not verses_container:
            print(f"⚠️ Warning: 'versesContainer' class not found for Chapter {chapter_num}.")
            return None

        # 3. EXTRACT VERSES FROM TABLE ROWS
        verses = []
        # The HTML uses a <table> with <tr> rows for each verse
        rows = verses_container.find_all('tr')

        for row in rows:
            # Verse Number is in 'verseNumCell'
            num_cell = row.find('td', class_='verseNumCell')
            # Verse Text is in 'verseConentCell'
            text_cell = row.find('td', class_='verseConentCell')

            if num_cell and text_cell:
                # Get text and strip whitespace
                v_num = num_cell.get_text(strip=True)
                v_text = text_cell.get_text(strip=True)

                # Cleanup: specific span classes like 'divineWord' are handled automatically by get_text(),
                # but we ensure we capture the clean string.
                if v_text:
                    verses.append({
                        "verse": v_num,
                        "text": v_text
                    })

        if not verses:
            print(f"⚠️ Warning: No verses extracted for Chapter {chapter_num}.")
            return None

        return {
            "book": "Psalms",
            "chapter": chapter_num,
            "language": "Geez",
            "verses": verses
        }

    except Exception as e:
        print(f"❌ Error scraping Chapter {chapter_num}: {e}")
        return None

def main():
    all_chapters = []

    # EOTC Canon has 151 Psalms
    for i in range(1, 152):
        data = scrape_chapter(i)
        if data:
            all_chapters.append(data)

        # Polite delay
        time.sleep(0.5)

    # Save to JSON
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(all_chapters, f, ensure_ascii=False, indent=2)
    
    print(f"\n✅ Done! Saved {len(all_chapters)} Ge'ez chapters to {OUTPUT_FILE}")

if __name__ == "__main__":
    main()