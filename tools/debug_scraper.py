import time
import json
import re
from selenium import webdriver
from selenium.webdriver.chrome.service import Service as ChromeService
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
from bs4 import BeautifulSoup

# CONFIGURATION
BASE_URL_TEMPLATE = "https://www.ethiopicbible.com/books/%E1%88%98%E1%8B%9D%E1%88%99%E1%88%88-%E1%8B%B3%E1%8B%8A%E1%89%B5-{}"
OUTPUT_FILE = "geez_psalms_1988.json"

def setup_driver():
    """Sets up the Selenium WebDriver."""
    print("Setting up Selenium WebDriver...")
    options = webdriver.ChromeOptions()
    options.add_argument('--headless')
    options.add_argument('--disable-gpu')
    options.add_argument('--no-sandbox')
    options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36")
    
    try:
        driver = webdriver.Chrome(service=ChromeService(ChromeDriverManager().install()), options=options)
        print("✅ WebDriver setup complete.")
        return driver
    except Exception as e:
        print(f"❌ Error setting up WebDriver: {e}")
        print("Please ensure you have Google Chrome installed on your system.")
        return None

def debug_scrape_chapter(driver, chapter_num):
    url = BASE_URL_TEMPLATE.format(chapter_num)
    print(f"Requesting Chapter {chapter_num} (Ge'ez) for debugging...")
    
    try:
        driver.get(url)
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.CLASS_NAME, "col-md-6"))
        )

        soup = BeautifulSoup(driver.page_source, 'html.parser')
        
        columns = soup.find_all('div', {'class': 'col-md-6'})
        
        if len(columns) < 2:
            print("⚠️ Error: Could not detect parallel columns.")
            return

        geez_content_div = columns[1]

        # --- DEBUGGING ---
        # Print the entire HTML of the Ge'ez column so we can inspect its structure.
        print("\n\n--- START OF GE'EZ COLUMN HTML ---")
        print(geez_content_div.prettify())
        print("--- END OF GE'EZ COLUMN HTML ---\n\n")
        # --- END DEBUGGING ---

    except Exception as e:
        print(f"❌ Error scraping Chapter {chapter_num}: {e}")

def main():
    driver = setup_driver()
    if not driver:
        return

    # We only need to debug one chapter to see the structure
    debug_scrape_chapter(driver, 1)

    driver.quit()
    print("Debug script finished. Please copy the HTML output above and provide it.")

if __name__ == "__main__":
    main()
