import React from 'react';

export const RightSidebar: React.FC = () => {
  return (
    <aside id="right-sidebar" className="sidebar sidebar-right collapsed">
      <div className="settings-panel">
        <div id="kidase-gated-section" className="setting-group">
          <h3>Add Prayers</h3>

          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            <input type="checkbox" id="show-daily-prayer-toggle" /> <span>Daily Prayer | ዘዘወትር ጸሎት</span>
          </label>

          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            <input type="checkbox" id="show-vespers" /> <span>Sunset Prayer | ጸሎተ ሠርክ</span>
          </label>
          <div
            id="vespers-psalm-gospel-settings"
            style={{
              display: 'none',
              marginBottom: '1rem',
              marginLeft: '1rem',
              borderLeft: '1px solid var(--border-color)',
              paddingLeft: '0.5rem',
            }}
          >
            <div className="kidase-lectionary-item" style={{ marginTop: '0.5rem' }}>
              <h5 className="settings-subtitle clickable-reading-title" data-reading-target="eveningPsalm">
                Evening Psalm (NKJV) | ምስባክ ዘሠርክ
              </h5>
              <div id="evening-psalm-ref-container" className="lectionary-picker-container"></div>
            </div>
            <hr className="lectionary-separator" />
            <div className="kidase-lectionary-item" style={{ marginTop: '0.5rem' }}>
              <h5 className="settings-subtitle clickable-reading-title" data-reading-target="eveningGospel">
                Evening Gospel | ወንጌል ዘሠርክ
              </h5>
              <div id="evening-gospel-ref-container" className="lectionary-picker-container"></div>
            </div>
          </div>

          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            <input type="checkbox" id="show-seatat-readings-toggle" /> <span><i>Se'atat</i> Readings | ምንባባተ ሰዓታት</span>
          </label>
          <div
            id="seatat-readings-settings"
            style={{
              display: 'none',
              marginLeft: '1rem',
              borderLeft: '1px solid var(--border-color)',
              paddingLeft: '0.5rem',
              marginBottom: '1rem',
            }}
          >
            <div className="title-with-info" style={{ marginTop: '0.25rem', marginBottom: '0.5rem' }}>
              <h4 className="settings-subtitle" style={{ margin: 0 }}>Scripture Readings* for <i>Tselote Se’atat</i></h4>
              <button id="seatat-info-btn" className="info-toggle-btn" title="Scripture Readings for Tselote Se’atat" aria-label="Scripture Readings for Se'atat info">
                <svg viewBox="0 0 24 24" width="18" height="18">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                </svg>
              </button>
            </div>
            <div id="seatat-lectionary-selector-container">
              <div className="lectionary-day-selector">
                <label style={{ display: 'block', marginBottom: '0.25rem' }}>
                  <input type="radio" name="seatat-lectionary-day" value="Sunday" /> Sunday | ዘእሁድ
                </label>
                <label style={{ display: 'block', marginBottom: '0.25rem' }}>
                  <input type="radio" name="seatat-lectionary-day" value="Monday" /> Monday | ዘሰኑይ
                </label>
                <label style={{ display: 'block', marginBottom: '0.25rem' }}>
                  <input type="radio" name="seatat-lectionary-day" value="Tuesday" /> Tuesday | ዘሠሉስ
                </label>
                <label style={{ display: 'block', marginBottom: '0.25rem' }}>
                  <input type="radio" name="seatat-lectionary-day" value="Wednesday" /> Wednesday | ዘረቡዕ
                </label>
                <label style={{ display: 'block', marginBottom: '0.25rem' }}>
                  <input type="radio" name="seatat-lectionary-day" value="Thursday" /> Thursday | ዘሐሙስ
                </label>
                <label style={{ display: 'block', marginBottom: '0.25rem' }}>
                  <input type="radio" name="seatat-lectionary-day" value="Friday" /> Friday | ዘዓርብ
                </label>
                <label style={{ display: 'block', marginBottom: '0.25rem' }}>
                  <input type="radio" name="seatat-lectionary-day" value="Saturday" /> Saturday | ዘቀዳሚት
                </label>
                <label style={{ display: 'block', marginBottom: '0.25rem' }}>
                  <input type="radio" name="seatat-lectionary-day" value="None" defaultChecked /> None | አልቦ
                </label>
              </div>
            </div>
            <p className="settings-subtitle lectionary-disclaimer" style={{ fontSize: '0.75rem', marginTop: '0.5rem', opacity: 0.8 }}>
              *According to the certified <i>Se'atat</i> liturgical tradition of <i>Debre Abay Abune Samuel Ze-Waldiba</i> Monastery, for the Prayer—or Liturgy—of the Hours (ጸሎተ ሰዓታት).
            </p>
          </div>

          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            <input type="checkbox" id="show-teklil" /> <span>Crowning (Matrimony) | ተክሊል</span>
          </label>
          <div
            id="teklil-names-settings"
            style={{
              display: 'none',
              marginBottom: '1rem',
              marginLeft: '1rem',
              borderLeft: '1px solid var(--border-color)',
              paddingLeft: '0.5rem',
            }}
          >
            <h4 className="settings-subtitle">Bridegroom's Baptismal Name</h4>
            <input type="text" id="bridegroom-name-input" placeholder="e.g. Gebre Kristos" style={{ marginBottom: '0.5rem' }} />
            <h4 className="settings-subtitle">Bride's Baptismal Name</h4>
            <input type="text" id="bride-name-input" placeholder="e.g. Wolete Mariam" />
          </div>

          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            <input type="checkbox" id="show-matins" /> <span>Morning Prayer | ጸሎተ ነግህ</span>
          </label>
          <div
            id="morning-psalm-gospel-settings"
            style={{
              display: 'none',
              marginBottom: '1rem',
              marginLeft: '1rem',
              borderLeft: '1px solid var(--border-color)',
              paddingLeft: '0.5rem',
            }}
          >
            <div className="kidase-lectionary-item" style={{ marginTop: '0.5rem' }}>
              <h5 className="settings-subtitle clickable-reading-title" data-reading-target="morningPsalm">
                Morning Psalm (NKJV) | ምስባክ ዘነግህ
              </h5>
              <div id="morning-psalm-ref-container" className="lectionary-picker-container"></div>
            </div>
            <hr className="lectionary-separator" />
            <div className="kidase-lectionary-item" style={{ marginTop: '0.5rem' }}>
              <h5 className="settings-subtitle clickable-reading-title" data-reading-target="morningGospel">
                Morning Gospel | ወንጌል ዘነግህ
              </h5>
              <div id="morning-gospel-ref-container" className="lectionary-picker-container"></div>
            </div>
          </div>

          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            <input type="checkbox" id="kidase-mode-toggle" /> <span>Order of the Liturgy | ሥርዓተ ቅዳሴ</span>
          </label>
          <div
            id="kidase-settings"
            style={{
              display: 'none',
              marginLeft: '1rem',
              borderLeft: '2px solid var(--accent-color)',
              paddingLeft: '1rem',
            }}
          >
            <h4 className="settings-subtitle" style={{ marginTop: '0.5rem' }}>SELECT LECTIONARY</h4>

            <div className="kidase-lectionary-item">
              <h5 className="settings-subtitle clickable-reading-title" data-reading-target="pauline">
                Pauline Epistle | መልእክተ ጳውሎስ
              </h5>
              <div id="kidase-pauline-ref-container" className="lectionary-picker-container"></div>
            </div>
            <hr className="lectionary-separator" />
            <div className="kidase-lectionary-item">
              <h5 className="settings-subtitle clickable-reading-title" data-reading-target="universal">
                Universal Epistle | መልእክተ ካቶሊካ
              </h5>
              <div id="kidase-universal-ref-container" className="lectionary-picker-container"></div>
            </div>
            <hr className="lectionary-separator" />
            <div className="kidase-lectionary-item">
              <h5 className="settings-subtitle clickable-reading-title" data-reading-target="acts">
                Acts of the Apostles | ግብረ ሐዋርያት
              </h5>
              <div id="kidase-acts-ref-container" className="lectionary-picker-container"></div>
            </div>
            <hr className="lectionary-separator" />
            <div className="kidase-lectionary-item">
              <h5 className="settings-subtitle clickable-reading-title" data-reading-target="psalm">
                Liturgy Psalm (NKJV) | ምስባክ ዘቅዳሴ
              </h5>
              <div id="kidase-psalm-ref-container" className="lectionary-picker-container"></div>
            </div>
            <hr className="lectionary-separator" />
            <div className="kidase-lectionary-item">
              <h5 className="settings-subtitle clickable-reading-title" data-reading-target="gospel">
                Liturgy Gospel | ወንጌል ዘቅዳሴ
              </h5>
              <div id="kidase-gospel-ref-container" className="lectionary-picker-container"></div>
            </div>

            <h4 className="settings-subtitle" style={{ marginTop: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem' }}>
              DAY OF ḲIDASÉ
            </h4>
            <select id="kidase-day-selector" className="settings-select" defaultValue="sunday" aria-label="Day of Kidase">
              <option value="sunday">Sunday / Major Feasts | ዘእሁድ ወበዓላት ዐበይት</option>
              <option value="saturday">Saturday (First Sabbath) | ዘቀዳሚት (ቀዳሚት ሰንበት)</option>
              <option value="weekday">Weekday (Mon–Fri) | ዘሰኑይ–ዓርብ</option>
            </select>

            <h4 className="settings-subtitle" style={{ marginTop: '0.75rem' }}>
              TIME OF ḲIDASÉ
            </h4>
            <select id="covenant-prayer-selector" className="settings-select" defaultValue="morning" aria-label="Time of Kidase">
              <option value="none">None | አልቦ</option>
              <option value="morning">Dawn | ዘነግህ</option>
              <option value="midnight">Midnight | ዘመንፈቀ ሌሊት</option>
              <option value="afternoon">Sunset | ዘሠርክ</option>
            </select>
          </div>

          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            <input type="checkbox" id="show-anaphora-toggle" /> <span>Eucharistic Prayer | አኰቴተ ቍርባን</span>
          </label>
          <div
            id="anaphora-settings"
            style={{
              display: 'none',
              marginLeft: '1rem',
              borderLeft: '1px solid var(--border-color)',
              paddingLeft: '0.5rem',
              marginBottom: '1rem',
            }}
          >
            <h4 id="anaphora-title-btn" className="settings-subtitle clickable-reading-title" style={{ marginTop: '0.5rem', cursor: 'pointer' }}>
              Anaphora | ቅዳሴ
            </h4>
            <select id="anaphora-selector" className="settings-select" defaultValue="apostles" style={{ marginTop: '0.25rem' }} aria-label="Anaphora">
              <option value="apostles">Apostles | ሐዋርያት</option>
              <option value="mary">Mary | ማርያም</option>
            </select>

            <h4 id="melka-title-btn" className="settings-subtitle clickable-reading-title" style={{ marginTop: '0.75rem', cursor: 'pointer' }}>
              <i>Melk'a</i> | መልክአ
            </h4>
            <select id="melka-selector" className="settings-select" defaultValue="communion" style={{ marginTop: '0.25rem' }} aria-label="Melk'a">
              <option value="communion">Communion | ቍርባን</option>
            </select>
            <div id="selected-melka-text" style={{ fontSize: '0.8rem', marginTop: '0.25rem', color: 'var(--text-color)', opacity: 0.8 }}>
              Peace be unto you, while bowing unto you,...<br />
              <span className="geez-font" style={{ fontSize: '1.1em', opacity: 0.8, display: 'block', marginTop: '4px' }}>
                ሰላም ለኪ እንዘ ንሰግድ ንብለኪ፣...
              </span>
            </div>

            <h4 id="miracle-title-btn" className="settings-subtitle clickable-reading-title" style={{ marginTop: '0.75rem', cursor: 'pointer' }}>
              Miracle of Mary | ተአምረ ማርያም
            </h4>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
              <button id="open-miracle-modal-btn" className="settings-button">Select Miracle</button>
              <button id="clear-miracle-btn" className="settings-button" style={{ display: 'none' }}>Clear Miracle</button>
            </div>
            <div id="selected-miracle-text" style={{ fontSize: '0.8rem', marginTop: '0.25rem', color: 'var(--text-color)', opacity: 0.8 }}>
              None selected
            </div>

            <div id="miracle-position-container" style={{ marginTop: '0.5rem', display: 'none' }}>
              <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.8rem' }}>
                <input type="radio" name="miracle-position" value="anaphora" defaultChecked /> Read After Anaphora (Default)
              </label>
              <label style={{ display: 'block', fontSize: '0.8rem' }}>
                <input type="radio" name="miracle-position" value="matins" /> Read at Matins
              </label>
            </div>
          </div>

          <h4 className="settings-subtitle" style={{ marginTop: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem' }}>
            Customizations
          </h4>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            <input type="checkbox" id="show-geez-phonetic-chants" /> <span>Ge'ez Phonetics for Chants</span>
          </label>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            <input type="checkbox" id="hide-quiet-prayers" /> <span>Quiet Prayers | ጸሎት በልኁሳስ</span>
          </label>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            <input type="checkbox" id="holy-fifty-days-toggle" /> <span>Holy 50 Days | እምትንሣኤ እስከ በዓለ ፶</span>
          </label>
        </div>

        <div className="setting-group">
          <div className="title-with-info">
            <h3 id="theotokia-title-btn" className="clickable-reading-title" style={{ cursor: 'pointer' }}>
              Add <i>Theotokia</i>
            </h3>
            <button id="ephrem-story-info-btn" className="info-toggle-btn" title="The Story of the Syrian Potter" aria-label="The Story of the Syrian Potter info">
              <svg viewBox="0 0 24 24" width="18" height="18">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
              </svg>
            </button>
          </div>
          <div id="praise-of-mary-selector-container">
            <div style={{ display: 'block', marginTop: '0.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.25rem' }}>
                <input type="radio" name="praise-of-mary-day" value="Sunday" /> Sunday | ዘእሁድ
              </label>
              <label style={{ display: 'block', marginBottom: '0.25rem' }}>
                <input type="radio" name="praise-of-mary-day" value="Monday" /> Monday | ዘሰኑይ
              </label>
              <label style={{ display: 'block', marginBottom: '0.25rem' }}>
                <input type="radio" name="praise-of-mary-day" value="Tuesday" /> Tuesday | ዘሠሉስ
              </label>
              <label style={{ display: 'block', marginBottom: '0.25rem' }}>
                <input type="radio" name="praise-of-mary-day" value="Wednesday" /> Wednesday | ዘረቡዕ
              </label>
              <label style={{ display: 'block', marginBottom: '0.25rem' }}>
                <input type="radio" name="praise-of-mary-day" value="Thursday" /> Thursday | ዘሐሙስ
              </label>
              <label style={{ display: 'block', marginBottom: '0.25rem' }}>
                <input type="radio" name="praise-of-mary-day" value="Friday" /> Friday | ዘዓርብ
              </label>
              <label style={{ display: 'block', marginBottom: '0.25rem' }}>
                <input type="radio" name="praise-of-mary-day" value="Saturday" /> Saturday | ዘቀዳሚት
              </label>
              <label style={{ display: 'block', marginBottom: '0.25rem' }}>
                <input type="radio" name="praise-of-mary-day" value="All" /> All days | ኩሉ
              </label>
              <label style={{ display: 'block', marginBottom: '0.25rem' }}>
                <input type="radio" name="praise-of-mary-day" value="None" defaultChecked /> None | አልቦ
              </label>
            </div>
          </div>
          <div style={{ marginTop: '0.75rem', borderTop: '1px dashed var(--border-color)', paddingTop: '0.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>
              <input type="checkbox" id="show-gate-of-light-toggle" /> <span>The Gate of Light | አንቀጸ ብርሃን</span>
            </label>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>
              <input type="checkbox" id="show-yewediswa-melaekt-toggle" /> <span>The Angels Praise Mary | ይዌድስዋ መላእክት ለማርያም</span>
            </label>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>
              <input type="checkbox" id="show-supplications-toggle" /> <span>Supplications | ምሕላ</span>
            </label>
          </div>
          <div style={{ fontSize: '0.75rem', fontStyle: 'italic', opacity: 0.7, marginTop: '0.75rem', textAlign: 'left' }}>
            Note: Theotokia prayers listed are complete in Ge'ez, but are in-progress for other languages.
          </div>
        </div>

        <div className="setting-group">
          <div className="title-with-info">
            <h3 id="psalms-title-btn" className="clickable-reading-title" style={{ cursor: 'pointer' }}>
              Add Psalms of David
            </h3>
            <button id="eusebius-info-btn" className="info-toggle-btn" title="About the Psalms (Eusebius)" aria-label="About the Psalms by Eusebius info">
              <svg viewBox="0 0 24 24" width="18" height="18">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
              </svg>
            </button>
          </div>
          <div id="psalm-selector-container"></div>
          <button id="psalm-combinations-btn" className="settings-button">Typical Psalm Combinations...</button>
          <button id="athanasius-guide-btn" className="settings-button">📜 St. Athanasius’ Guide</button>

          <div className="psalm-sequence-container">
            <label htmlFor="psalm-sequence-input">Sequence Order:</label>
            <input type="text" id="psalm-sequence-input" className="settings-sequence-input" placeholder="e.g. 62, 50, 112" />
          </div>
          <button id="clear-psalms-button" className="settings-button">Clear Psalms</button>
        </div>

        <div className="setting-group">
          <h3 id="prophets-title-btn" className="clickable-reading-title" style={{ cursor: 'pointer' }}>
            Add Songs of the Prophets
          </h3>
          <div id="prophet-songs-selector-container"></div>
          <div id="prophet-songs-summary" className="settings-summary"></div>
          <button id="clear-prophet-songs-button" className="settings-button">Clear Songs</button>
        </div>
      </div>
    </aside>
  );
};
