import requests
from bs4 import BeautifulSoup
import json
import time
import re

# CONFIGURATION
BASE_URL_TEMPLATE = "https://www.ethiopicbible.com/books/%E1%88%98%E1%8B%9D%E1%88%99%E1%88%A8-%E1%8B%B3%E1%8B%8A%E1%89%B5-{}"
OUTPUT_FILE = "geez_psalms_1988_formatted.json"

# --- HELPER: Ge'ez Numeral Converter ---
def to_geez(n):
    """Converts an integer to a Ge'ez numeral string."""
    if n <= 0: return ""
    geez_map = {
        1: "፩", 2: "፪", 3: "፫", 4: "፬", 5: "፭",
        6: "፮", 7: "፯", 8: "፰", 9: "፱", 10: "፲",
        20: "፳", 30: "፴", 40: "፵", 50: "፶",
        60: "፷", 70: "፸", 80: "፹", 90: "፺", 100: "፻"
    }
    if n in geez_map: return geez_map[n]

    if n > 100:
        hundreds = n // 100
        remainder = n % 100
        prefix = to_geez(hundreds) if hundreds > 1 else ""
        return prefix + geez_map[100] + to_geez(remainder)
    elif n > 10:
        tens = (n // 10) * 10
        ones = n % 10
        return geez_map[tens] + to_geez(ones)
    return ""

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
        geez_container = soup.find('div', class_='geezBibleChapterContainer')
        if not geez_container:
            print(f"⚠️ Warning: 'geezBibleChapterContainer' not found for Ch {chapter_num}.")
            return None

        # 2. EXTRACT TITLE
        # Try to find the specific title header
        title_text = f"መዝሙር ዘዳዊት {to_geez(chapter_num)}" # Default fallback
        title_div = geez_container.find('div', class_='chapterTitleContainer')
        if title_div:
            # Get text with separator to handle spans like <span class="chapterTitle">
            raw_title = title_div.get_text(separator=' ', strip=True)
            title_text = re.sub(r'\s+', ' ', raw_title).strip()

        # 3. FIND THE VERSES
        verses_container = geez_container.find('div', class_='versesContainer')
        if not verses_container:
            print(f"⚠️ Warning: 'versesContainer' not found for Ch {chapter_num}.")
            return None

        verses = []
        rows = verses_container.find_all('tr')

        # Use an enumerator to ensure sequential integer IDs for verses
        verse_counter = 1

        for row in rows:
            num_cell = row.find('td', class_='verseNumCell')
            text_cell = row.find('td', class_='verseConentCell')

            if num_cell and text_cell:
                # Get visual Ge'ez number string (e.g. "፩")
                v_geez_str = num_cell.get_text(strip=True)

                # Fix spacing: separate words wrapped in spans (like "God")
                raw_text = text_cell.get_text(separator=' ', strip=True)
                # Remove newlines and collapse multiple spaces
                v_text = re.sub(r'\s+', ' ', raw_text).strip()

                if v_text:
                    verses.append({
                        "verse_number": verse_counter, # Integer for app logic
                        "verse_geez": v_geez_str,      # String for display
                        "text": v_text
                    })
                    verse_counter += 1

        if not verses:
            print(f"⚠️ Warning: No verses extracted for Chapter {chapter_num}.")
            return None

        # Return object matching the desired JSON structure
        return {
            "id": chapter_num,
            "chapter_geez": to_geez(chapter_num),
            "title_geez": title_text,
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

        time.sleep(0.5)

    # Save to JSON
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(all_chapters, f, ensure_ascii=False, indent=2)

    print(f"\n✅ Done! Saved {len(all_chapters)} formatted chapters to {OUTPUT_FILE}")

if __name__ == "__main__":
    main()