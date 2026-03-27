import requests
from bs4 import BeautifulSoup
import json
import time
import re
import urllib.parse

# CONFIGURATION
OUTPUT_FILE = "geez_bible_66_books.json"
BASE_URL = "https://www.ethiopicbible.com/books/"

# HELPER: Ge'ez Numeral Converter
def to_geez(n):
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

# MASTER BOOK LIST
# Each entry: "English Name": ["Amharic Name (for URL)", Total Chapters]
# Note: URL slugs must match exactly what is in the browser address bar.
# I have encoded the Amharic names to ensure URL safety.
BOOKS = [
    # OLD TESTAMENT
    {"title": "Genesis", "slug": "ኦሪት-ዘፍጥረት", "chapters": 50},
    {"title": "Exodus", "slug": "ኦሪት-ዘጸአት", "chapters": 40},
    {"title": "Leviticus", "slug": "ኦሪት-ዘሌዋውያን", "chapters": 27},
    {"title": "Numbers", "slug": "ኦሪት-ዘኍልቍ", "chapters": 36},
    {"title": "Deuteronomy", "slug": "ኦሪት-ዘዳግም", "chapters": 34},
    {"title": "Joshua", "slug": "መጽሐፈ-ኢያሱ-ወልደ-ነዌ", "chapters": 24},
    {"title": "Judges", "slug": "መጽሐፈ-መሳፍንት", "chapters": 21},
    {"title": "Ruth", "slug": "መጽሐፈ-ሩት", "chapters": 4},
    {"title": "1 Samuel", "slug": "መጽሐፈ-ሳሙኤል-ቀዳማዊ", "chapters": 31},
    {"title": "2 Samuel", "slug": "መጽሐፈ-ሳሙኤል-ካልዕ", "chapters": 24},
    {"title": "1 Kings", "slug": "መጽሐፈ-ነገሥት-ቀዳማዊ", "chapters": 22},
    {"title": "2 Kings", "slug": "መጽሐፈ-ነገሥት-ካልዕ", "chapters": 25},
    {"title": "1 Chronicles", "slug": "መጽሐፈ-ዜና-መዋዕል-ቀዳማዊ", "chapters": 29},
    {"title": "2 Chronicles", "slug": "መጽሐፈ-ዜና-መዋዕል-ካልዕ", "chapters": 36},
    {"title": "Ezra", "slug": "መጽሐፈ-ዕዝራ", "chapters": 10},
    {"title": "Nehemiah", "slug": "መጽሐፈ-ነህምያ", "chapters": 13},
    {"title": "Esther", "slug": "መጽሐፈ-አስቴር", "chapters": 10},
    {"title": "Job", "slug": "መጽሐፈ-ኢዮብ", "chapters": 42},
    {"title": "Psalms", "slug": "መዝሙረ-ዳዊት", "chapters": 151}, # EOTC has 151
    {"title": "Proverbs", "slug": "መጽሐፈ-ምሳሌ", "chapters": 31},
    {"title": "Ecclesiastes", "slug": "መጽሐፈ-መክብብ", "chapters": 12},
    {"title": "Song of Solomon", "slug": "መኃልየ-መኃልይ-ዘሰሎሞን", "chapters": 8},
    {"title": "Isaiah", "slug": "ትንቢተ-ኢሳይያስ", "chapters": 66},
    {"title": "Jeremiah", "slug": "ትንቢተ-ኤርምያስ", "chapters": 52},
    {"title": "Lamentations", "slug": "ሰቆቃው-ኤርምያስ", "chapters": 5},
    {"title": "Ezekiel", "slug": "ትንቢተ-ሕዝቅኤል", "chapters": 48},
    {"title": "Daniel", "slug": "ትንቢተ-ዳንኤል", "chapters": 12},
    {"title": "Hosea", "slug": "ትንቢተ-ሆሴዕ", "chapters": 14},
    {"title": "Joel", "slug": "ትንቢተ-ኢዮኤል", "chapters": 3},
    {"title": "Amos", "slug": "ትንቢተ-አሞጽ", "chapters": 9},
    {"title": "Obadiah", "slug": "ትንቢተ-አብድዩ", "chapters": 1},
    {"title": "Jonah", "slug": "ትንቢተ-ዮናስ", "chapters": 4},
    {"title": "Micah", "slug": "ትንቢተ-ሚክያስ", "chapters": 7},
    {"title": "Nahum", "slug": "ትንቢተ-ናሆም", "chapters": 3},
    {"title": "Habakkuk", "slug": "ትንቢተ-ዕንባቆም", "chapters": 3},
    {"title": "Zephaniah", "slug": "ትንቢተ-ሶፎንያስ", "chapters": 3},
    {"title": "Haggai", "slug": "ትንቢተ-ሐጌ", "chapters": 2},
    {"title": "Zechariah", "slug": "ትንቢተ-ዘካርያስ", "chapters": 14},
    {"title": "Malachi", "slug": "ትንቢተ-ሚልክያ", "chapters": 4},

    # NEW TESTAMENT
    {"title": "Matthew", "slug": "የማቴዎስ-ወንጌል", "chapters": 28},
    {"title": "Mark", "slug": "የማርቆስ-ወንጌል", "chapters": 16},
    {"title": "Luke", "slug": "የሉቃስ-ወንጌል", "chapters": 24},
    {"title": "John", "slug": "የዮሐንስ-ወንጌል", "chapters": 21},
    {"title": "Acts", "slug": "የሐዋርያት-ሥራ", "chapters": 28},
    {"title": "Romans", "slug": "ወደ-ሮሜ-ሰዎች", "chapters": 16},
    {"title": "1 Corinthians", "slug": "፩ኛ-ወደ-ቆሮንቶስ-ሰዎች", "chapters": 16},
    {"title": "2 Corinthians", "slug": "፪ኛ-ወደ-ቆሮንቶስ-ሰዎች", "chapters": 13},
    {"title": "Galatians", "slug": "ወደ-ገላትያ-ሰዎች", "chapters": 6},
    {"title": "Ephesians", "slug": "ወደ-ኤፌሶን-ሰዎች", "chapters": 6},
    {"title": "Philippians", "slug": "ወደ-ፊልጵስዩስ-ሰዎች", "chapters": 4},
    {"title": "Colossians", "slug": "ወደ-ቆላስይስ-ሰዎች", "chapters": 4},
    {"title": "1 Thessalonians", "slug": "፩ኛ-ወደ-ተሰሎንቄ-ሰዎች", "chapters": 5},
    {"title": "2 Thessalonians", "slug": "፪ኛ-ወደ-ተሰሎንቄ-ሰዎች", "chapters": 3},
    {"title": "1 Timothy", "slug": "፩ኛ-ወደ-ጢሞቴዎስ", "chapters": 6},
    {"title": "2 Timothy", "slug": "፪ኛ-ወደ-ጢሞቴዎስ", "chapters": 4},
    {"title": "Titus", "slug": "ወደ-ቲቶ", "chapters": 3},
    {"title": "Philemon", "slug": "ወደ-ፊልሞና", "chapters": 1},
    {"title": "Hebrews", "slug": "ወደ-ዕብራውያን", "chapters": 13},
    {"title": "James", "slug": "የያዕቆብ-መልእክት", "chapters": 5},
    {"title": "1 Peter", "slug": "፩ኛ-የጴጥሮስ-መልእክት", "chapters": 5},
    {"title": "2 Peter", "slug": "፪ኛ-የጴጥሮስ-መልእክት", "chapters": 3},
    {"title": "1 John", "slug": "፩ኛ-የዮሐንስ-መልእክት", "chapters": 5},
    {"title": "2 John", "slug": "፪ኛ-የዮሐንስ-መልእክት", "chapters": 1},
    {"title": "3 John", "slug": "፫ኛ-የዮሐንስ-መልእክት", "chapters": 1},
    {"title": "Jude", "slug": "የይሁዳ-መልእክት", "chapters": 1},
    {"title": "Revelation", "slug": "የዮሐንስ-ራእይ", "chapters": 22}
]

def scrape_chapter(book_slug, chapter_num):
    # URL Construction: The site uses encoded strings.
    # requests.get handles encoding automatically if we pass the string,
    # but since we have raw UTF-8 slugs, we should ensure they work in the URL.
    # Format for Ch 1: /books/Slug
    # Format for Ch 2+: /books/Slug-2

    if chapter_num == 1:
        url = f"{BASE_URL}{book_slug}"
    else:
        url = f"{BASE_URL}{book_slug}-{chapter_num}"

    print(f"  ...Requesting Ch {chapter_num}")

    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36'
        }
        response = requests.get(url, headers=headers)
        if response.status_code != 200:
            print(f"  ❌ Failed (Status {response.status_code})")
            return None

        soup = BeautifulSoup(response.content, 'html.parser')

        # 1. LOCATE GE'EZ CONTAINER
        geez_container = soup.find('div', class_='geezBibleChapterContainer')
        if not geez_container:
            # Fallback for pages that might just have one container
            return None

        # 2. EXTRACT TITLE
        title_text = ""
        title_div = geez_container.find('div', class_='chapterTitleContainer')
        if title_div:
            raw_title = title_div.get_text(separator=' ', strip=True)
            title_text = re.sub(r'\s+', ' ', raw_title).strip()

        # 3. EXTRACT VERSES
        verses_container = geez_container.find('div', class_='versesContainer')
        if not verses_container:
            return None

        verses = []
        rows = verses_container.find_all('tr')
        verse_counter = 1

        for row in rows:
            num_cell = row.find('td', class_='verseNumCell')
            text_cell = row.find('td', class_='verseConentCell')

            if num_cell and text_cell:
                v_geez_str = num_cell.get_text(strip=True)

                # Spacing Fix + Cleanup
                raw_text = text_cell.get_text(separator=' ', strip=True)
                v_text = re.sub(r'\s+', ' ', raw_text).strip()

                if v_text:
                    verses.append({
                        "verse_number": verse_counter,
                        "verse_geez": v_geez_str,
                        "text": v_text
                    })
                    verse_counter += 1

        return {
            "id": chapter_num,
            "chapter_geez": to_geez(chapter_num),
            "title_geez": title_text,
            "verses": verses
        }

    except Exception as e:
        print(f"  ❌ Error: {e}")
        return None

def main():
    full_bible_data = {
        "metadata": {
            "source": "ethiopicbible.com",
            "version": "1988 A.D. / 1980 E.C.",
            "books_count": len(BOOKS)
        },
        "books": []
    }

    print(f"Starting Scrape of {len(BOOKS)} Books...")

    for book in BOOKS:
        print(f"\n📖 Processing {book['title']} ({book['slug']})...")

        book_data = {
            "title_english": book['title'],
            "title_amharic": book['slug'].replace('-', ' '),
            "chapters": []
        }

        for i in range(1, book['chapters'] + 1):
            chapter_data = scrape_chapter(book['slug'], i)
            if chapter_data:
                book_data['chapters'].append(chapter_data)
            else:
                print(f"  ⚠️ Warning: Could not scrape Ch {i}")

            time.sleep(0.3) # Polite delay

        full_bible_data['books'].append(book_data)

    # Save to JSON
    print("\n💾 Saving to file...")
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(full_bible_data, f, ensure_ascii=False, indent=2)

    print(f"✅ Done! Saved entire Bible to {OUTPUT_FILE}")

if __name__ == "__main__":
    main()