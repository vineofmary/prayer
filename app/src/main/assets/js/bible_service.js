const WeahaduBibleService = {
    cache: new Map(),
    canon: null,

    async init() {
        if (!this.canon) {
            try {
                const response = await fetch('bible/canon.json');
                this.canon = await response.json();
            } catch (e) {
                console.error("Failed to load Weahadu canon:", e);
            }
        }
    },

    getBookFile(bookName) {
        if (!this.canon) return null;
        let bName = bookName === 'Psalm' ? 'Psalms' : bookName;
        const book = this.canon.find(b => b.name_en === bName || b.id === bName);
        return book ? book.file : null;
    },

    async fetchBook(edition, bookName) {
        await this.init();
        let bName = (bookName === 'Psalm') ? 'Psalms' : bookName;
        const bookFile = this.getBookFile(bName);
        if (!bookFile) return null;

        const cacheKey = `${edition}-${bookFile}`;
        if (this.cache.has(cacheKey)) return this.cache.get(cacheKey);

        // Special handling for Formatted Ge'ez Psalms
        if (edition === 'gez-1988-formatted') {
            if (bName === 'Psalms') {
                try {
                    const response = await fetch('bible/ግእዝ1988_Psalms_1-150_Geez_Bible_1988AD_1980EC_Corrected_Formatted.json');
                    if (response.ok) {
                        const raw = await response.json();
                        const formattedData = {
                            edition: 'gez-1988-formatted',
                            book: 'PSA',
                            chapters: raw.map(item => ({
                                n: item.id,
                                verses: (item.verses || []).map(v => ({ n: v.verse_number, t: v.text }))
                            }))
                        };
                        this.cache.set(cacheKey, formattedData);
                        return formattedData;
                    }
                } catch (err) {
                    console.error("Failed to fetch formatted Ge'ez Psalms, falling back to gez-1980:", err);
                }
            }
            // Fallback to gez-1980 for other books
            const fallback = await this.fetchBook('gez-1980', bName);
            if (fallback) {
                this.cache.set(cacheKey, fallback);
                return fallback;
            }
        }

        // Special handling for Haile Selassie 1954 Amharic (am54)
        if (edition === 'am54') {
            try {
                let am54Raw = (window.bibleData && window.bibleData.am54) ? window.bibleData.am54 : null;
                if (!am54Raw) {
                    const response = await fetch('bible/አም54_Haile_Selassie_Amharic_Bible_1962AD_1954EC.json');
                    if (response.ok) am54Raw = await response.json();
                }
                if (am54Raw && am54Raw.books) {
                    const bookCfg = (typeof BIBLE_BOOK_MAPPING !== 'undefined') ? BIBLE_BOOK_MAPPING[bName] : null;
                    const amTitle = bookCfg ? bookCfg.am54 : bName;
                    const bookObj = am54Raw.books.find(b => b.title === amTitle);
                    if (bookObj && bookObj.chapters) {
                        const am54Data = {
                            edition: 'am54',
                            book: bName,
                            chapters: bookObj.chapters.map(c => ({
                                n: c.chapter,
                                verses: (c.verses || []).map((t, idx) => ({ n: idx + 1, t: t }))
                            }))
                        };
                        this.cache.set(cacheKey, am54Data);
                        return am54Data;
                    }
                }
            } catch (err) {
                console.error("Failed to fetch am54 book, falling back:", err);
            }
        }

        try {
            const response = await fetch(`bible/${edition}/books/${bookFile}`);
            if (!response.ok) {
                // Tigrinya (ti-1997) only has 66 books, so missing files are expected for Apocrypha
                if (response.status !== 404) {
                     console.error(`HTTP error ${response.status} fetching ${cacheKey}`);
                }
                return null;
            }
            const data = await response.json();
            this.cache.set(cacheKey, data);
            return data;
        } catch (e) {
            console.error(`Failed to fetch ${cacheKey}:`, e);
            return null;
        }
    },

    parseReference(refString) {
        // e.g. "Matthew 1:1-12", "1 Corinthians 2:3", "Psalms 119:10-End"
        const match = refString.match(/(.+?)\s+(\d+):(\d+)(?:-(End|ፍጻሜ|\d+))?/i);
        if (!match) return null;
        
        return {
            book: match[1].trim(),
            chapter: parseInt(match[2]),
            startVerse: parseInt(match[3]),
            endVerse: match[4] ? (match[4].toLowerCase() === 'end' || match[4] === 'ፍጻሜ' ? 999 : parseInt(match[4])) : parseInt(match[3])
        };
    },

    async getVerses(edition, refString) {
        const ref = this.parseReference(refString);
        if (!ref) return null;

        const bookData = await this.fetchBook(edition, ref.book);
        if (!bookData || !bookData.chapters) return null;

        const chapterData = bookData.chapters.find(c => c.n === ref.chapter);
        if (!chapterData || !chapterData.verses) return null;

        return chapterData.verses
            .filter(v => parseInt(v.n) >= ref.startVerse && parseInt(v.n) <= ref.endVerse)
            .map(v => ({ n: v.n, t: v.t, alt: v.alt }));
    },
    
    getVersesSync(edition, refString) {
        const ref = this.parseReference(refString);
        if (!ref) return null;

        const bookFile = this.getBookFile(ref.book);
        if (!bookFile) return null;
        
        const cacheKey = `${edition}-${bookFile}`;
        let bookData = this.cache.get(cacheKey);

        // Fallback for gez-1988-formatted non-psalms
        if (!bookData && edition === 'gez-1988-formatted') {
            bookData = this.cache.get(`gez-1980-${bookFile}`);
        }
        if (!bookData) return null;

        const chapterData = bookData.chapters ? bookData.chapters.find(c => c.n === ref.chapter) : null;
        if (!chapterData || !chapterData.verses) return null;

        return chapterData.verses
            .filter(v => parseInt(v.n) >= ref.startVerse && parseInt(v.n) <= ref.endVerse)
            .map(v => ({ n: v.n, t: v.t, alt: v.alt }));
    },

    async preloadBooks(editions, refs) {
        await this.init();
        const promises = [];
        for (const refString of refs) {
            const ref = this.parseReference(refString);
            if (ref) {
                for (const ed of editions) {
                    promises.push(this.fetchBook(ed, ref.book));
                }
            }
        }
        await Promise.all(promises);
    },
    
    // Helper to get formatted text for a single translation
    async getFormattedText(edition, refString, prefix = "") {
        const verses = await this.getVerses(edition, refString);
        if (!verses || verses.length === 0) return "";
        
        let out = prefix;
        for (const v of verses) {
            let num = v.alt ? v.alt : v.n;
            out += `<sup>${num}</sup> ${v.t} `;
        }
        return out.trim();
    }
};

window.WeahaduBibleService = WeahaduBibleService;
