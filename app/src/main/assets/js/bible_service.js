const WeahaduBibleService = {
    cache: new Map(),
    inFlight: new Map(),
    canon: null,
    canonPromise: null,
    dillmannRaw: null,
    dillmannPromise: null,
    geezPsalmsFormattedRaw: null,
    geezPsalmsPromise: null,
    am54Raw: null,
    am54Promise: null,

    async init() {
        if (this.canon) return;
        if (!this.canonPromise) {
            this.canonPromise = (async () => {
                try {
                    const response = await fetch('bible/canon.json');
                    this.canon = await response.json();
                } catch (e) {
                    console.error("Failed to load Weahadu canon:", e);
                } finally {
                    this.canonPromise = null;
                }
            })();
        }
        await this.canonPromise;
    },

    getBookFile(bookName) {
        if (!this.canon) return null;
        let bName = bookName === 'Psalm' ? 'Psalms' : bookName;
        const book = this.canon.find(b => b.name_en === bName || b.id === bName);
        return book ? book.file : null;
    },

    buildFormattedGeezPsalmsData(raw) {
        if (!Array.isArray(raw)) return null;
        return {
            edition: 'gez-1980-formatted',
            book: 'PSA',
            isLxxPsalms: true,
            chapters: raw.map(item => ({
                n: parseInt(item.id),
                verses: (item.verses || []).map(v => ({ n: parseInt(v.verse_number), t: v.text }))
            }))
        };
    },

    buildAm54BookData(am54Raw, bName) {
        if (!am54Raw || !Array.isArray(am54Raw.books)) return null;
        const bookCfg = (typeof BIBLE_BOOK_MAPPING !== 'undefined') ? BIBLE_BOOK_MAPPING[bName] : null;
        const amTitle = bookCfg ? bookCfg.am54 : bName;
        const bookObj = am54Raw.books.find(b => b.title === amTitle);
        if (!bookObj || !Array.isArray(bookObj.chapters)) return null;
        return {
            edition: 'am54',
            book: bName,
            chapters: bookObj.chapters.map((c, idx) => {
                const chNum = parseInt(c.chapter);
                return {
                    n: !isNaN(chNum) ? chNum : (idx + 1),
                    verses: (c.verses || []).map((t, vIdx) => ({ n: vIdx + 1, t: t }))
                };
            })
        };
    },

    async _loadAm54Raw() {
        if (window.bibleData && window.bibleData.am54) {
            this.am54Raw = window.bibleData.am54;
            return this.am54Raw;
        }
        if (this.am54Raw) return this.am54Raw;
        if (!this.am54Promise) {
            this.am54Promise = (async () => {
                try {
                    const response = await fetch('bible/አም54_Haile_Selassie_Amharic_Bible_1962AD_1954EC.json');
                    if (response.ok) {
                        const data = await response.json();
                        this.am54Raw = (typeof data === 'string') ? JSON.parse(data) : data;
                        if (window.bibleData && !window.bibleData.am54) {
                            window.bibleData.am54 = this.am54Raw;
                        }
                        return this.am54Raw;
                    }
                } catch (e) {
                    console.error("Failed to load am54 raw data:", e);
                } finally {
                    this.am54Promise = null;
                }
                return null;
            })();
        }
        return this.am54Promise;
    },

    async fetchBook(edition, bookName) {
        await this.init();
        let normEdition = (edition === 'gez-1988-formatted') ? 'gez-1980-formatted' : edition;
        let bName = (bookName === 'Psalm') ? 'Psalms' : bookName;
        const bookFile = this.getBookFile(bName);
        if (!bookFile) return null;

        const cacheKey = `${normEdition}-${bookFile}`;
        if (this.cache.has(cacheKey)) return this.cache.get(cacheKey);
        if (this.inFlight.has(cacheKey)) return this.inFlight.get(cacheKey);

        const fetchPromise = this._fetchBookInternal(normEdition, bName, bookFile, cacheKey);
        this.inFlight.set(cacheKey, fetchPromise);
        try {
            return await fetchPromise;
        } finally {
            this.inFlight.delete(cacheKey);
        }
    },

    async _fetchBookInternal(normEdition, bName, bookFile, cacheKey) {
        // 1. Formatted 1980 E.C. Ge'ez Psalms (LXX numbering 1-151)
        if (normEdition === 'gez-1980-formatted') {
            if (bName === 'Psalms') {
                try {
                    let raw = (window.bibleData && Array.isArray(window.bibleData.geez_psalms))
                        ? window.bibleData.geez_psalms
                        : this.geezPsalmsFormattedRaw;
                    if (!raw) {
                        if (!this.geezPsalmsPromise) {
                            this.geezPsalmsPromise = fetch('bible/ግእዝ_Psalms_1-151_with_Songs_of_the_Prophets.json')
                                .then(r => r.ok ? r.json() : null)
                                .finally(() => { this.geezPsalmsPromise = null; });
                        }
                        raw = await this.geezPsalmsPromise;
                        if (raw) {
                            this.geezPsalmsFormattedRaw = raw;
                            if (window.bibleData && !window.bibleData.geez_psalms) {
                                window.bibleData.geez_psalms = raw;
                            }
                        }
                    }
                    const formattedData = this.buildFormattedGeezPsalmsData(raw);
                    if (formattedData) {
                        this.cache.set(cacheKey, formattedData);
                        return formattedData;
                    }
                } catch (err) {
                    console.error("Failed to fetch formatted Ge'ez Psalms, falling back to gez-1980:", err);
                }
            }
            const fallback = await this.fetchBook('gez-1980', bName);
            if (fallback) {
                this.cache.set(cacheKey, fallback);
                return fallback;
            }
            return null;
        }

        // 2. Historical Ge'ez Editions: Ludolf 1694 E.C. Psalms ('gez-1694') & Dillmann 1845 E.C. Octateuch ('gez-1845')
        if (normEdition === 'gez-1694' || normEdition === 'gez-1845') {
            try {
                if (!this.dillmannRaw) {
                    if (!this.dillmannPromise) {
                        this.dillmannPromise = fetch('bible/ግእዝ1853_Dillmann_Octateuch_1853AD_with_Ludolf_Psalms_1701AD.json')
                            .then(r => r.ok ? r.json() : null)
                            .finally(() => { this.dillmannPromise = null; });
                    }
                    const loadedDillmann = await this.dillmannPromise;
                    if (loadedDillmann) this.dillmannRaw = loadedDillmann;
                }
                if (Array.isArray(this.dillmannRaw)) {
                    const bookObj = this.dillmannRaw.find(b => b.title === bName);
                    if (bookObj && Array.isArray(bookObj.chapters) && bookObj.chapters.length > 0) {
                        const validChapters = bookObj.chapters
                            .filter(c => parseInt(c.chapter) > 0 && Array.isArray(c.verses) && c.verses.length > 0)
                            .map(c => ({
                                n: parseInt(c.chapter),
                                verses: c.verses.map(v => ({ n: parseInt(v.verse_number), t: v.text }))
                            }));
                        if (validChapters.length > 0) {
                            const historicalData = {
                                edition: normEdition,
                                book: bName,
                                isLxxPsalms: (bName === 'Psalms'),
                                chapters: validChapters
                            };
                            this.cache.set(cacheKey, historicalData);
                            return historicalData;
                        }
                    }
                }
            } catch (err) {
                console.error(`Failed to load ${normEdition} for ${bName}, falling back:`, err);
            }
            const fallbackEdition = (bName === 'Psalms') ? 'gez-1980-formatted' : 'gez-1980';
            const fallback = await this.fetchBook(fallbackEdition, bName);
            if (fallback) {
                this.cache.set(cacheKey, fallback);
                return fallback;
            }
            return null;
        }

        // 3. Haile Selassie 1954 E.C. Amharic ('am54')
        if (normEdition === 'am54') {
            try {
                const am54Raw = await this._loadAm54Raw();
                const am54Data = this.buildAm54BookData(am54Raw, bName);
                if (am54Data) {
                    this.cache.set(cacheKey, am54Data);
                    return am54Data;
                }
            } catch (err) {
                console.error("Failed to fetch am54 book, falling back to am-2000:", err);
            }
            const fallback = await this.fetchBook('am-2000', bName);
            if (fallback) {
                this.cache.set(cacheKey, fallback);
                return fallback;
            }
            return null;
        }

        // 4. Standard Modular Editions ('en-kjv', 'am-2000', 'gez-1980', 'gez-2014', 'ti-1997')
        try {
            const response = await fetch(`bible/${normEdition}/books/${bookFile}`);
            if (!response.ok) {
                if (normEdition === 'gez-2014') {
                    // gez-2014 only contains the 27 NT books; fall back to gez-1980 for OT/Deuterocanon
                    const fallback = await this.fetchBook('gez-1980', bName);
                    if (fallback) {
                        this.cache.set(cacheKey, fallback);
                        return fallback;
                    }
                }
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

        const chapterData = bookData.chapters.find(c => parseInt(c.n) === ref.chapter);
        if (!chapterData || !chapterData.verses) return null;

        return chapterData.verses
            .filter(v => parseInt(v.n) >= ref.startVerse && parseInt(v.n) <= ref.endVerse)
            .map(v => ({ n: v.n, t: v.t, alt: v.alt }));
    },
    
    getVersesSync(edition, refString) {
        const ref = this.parseReference(refString);
        if (!ref) return null;

        let normEdition = (edition === 'gez-1988-formatted') ? 'gez-1980-formatted' : edition;
        let bName = (ref.book === 'Psalm') ? 'Psalms' : ref.book;
        const bookFile = this.getBookFile(bName);
        if (!bookFile) return null;
        
        const cacheKey = `${normEdition}-${bookFile}`;
        let bookData = this.cache.get(cacheKey);

        if (!bookData && normEdition === 'gez-1980-formatted' && bName === 'Psalms' && window.bibleData && Array.isArray(window.bibleData.geez_psalms)) {
            bookData = this.buildFormattedGeezPsalmsData(window.bibleData.geez_psalms);
            if (bookData) this.cache.set(cacheKey, bookData);
        }

        if (!bookData && normEdition === 'am54') {
            const am54Source = (window.bibleData && window.bibleData.am54) ? window.bibleData.am54 : this.am54Raw;
            if (am54Source) {
                bookData = this.buildAm54BookData(am54Source, bName);
                if (bookData) this.cache.set(cacheKey, bookData);
            }
        }

        if (!bookData && ['gez-1980-formatted', 'gez-2014', 'gez-1694', 'gez-1845'].includes(normEdition)) {
            bookData = this.cache.get(`gez-1980-${bookFile}`);
        }
        if (!bookData && normEdition === 'am54') {
            bookData = this.cache.get(`am-2000-${bookFile}`);
        }
        if (!bookData) return null;

        const chapterData = bookData.chapters ? bookData.chapters.find(c => parseInt(c.n) === ref.chapter) : null;
        if (!chapterData || !chapterData.verses) return null;

        return chapterData.verses
            .filter(v => parseInt(v.n) >= ref.startVerse && parseInt(v.n) <= ref.endVerse)
            .map(v => ({ n: v.n, t: v.t, alt: v.alt }));
    },

    async preloadBooks(editions, refs) {
        if (!editions || editions.length === 0 || !refs || refs.length === 0) return;
        await this.init();
        const uniquePairs = new Set();
        const promises = [];
        for (const refString of refs) {
            const ref = this.parseReference(refString);
            if (ref) {
                let bName = (ref.book === 'Psalm') ? 'Psalms' : ref.book;
                for (const ed of editions) {
                    const pairKey = `${ed}::${bName}`;
                    if (!uniquePairs.has(pairKey)) {
                        uniquePairs.add(pairKey);
                        promises.push(this.fetchBook(ed, bName));
                    }
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
