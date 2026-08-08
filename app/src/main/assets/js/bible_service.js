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
        const bookFile = this.getBookFile(bookName);
        if (!bookFile) return null;

        const cacheKey = `${edition}-${bookFile}`;
        if (this.cache.has(cacheKey)) return this.cache.get(cacheKey);

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
        const bookData = this.cache.get(cacheKey);
        if (!bookData || !bookData.chapters) return null;

        const chapterData = bookData.chapters.find(c => c.n === ref.chapter);
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
