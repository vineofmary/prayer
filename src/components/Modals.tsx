import React from 'react';

export const Modals: React.FC = () => {
  return (
    <>
      {/* Sidebar Backdrop */}
      <div id="sidebar-backdrop"></div>

      {/* Copy Notification Toast */}
      <div id="copy-notification" className="notification">
        Copied to clipboard!
      </div>

      {/* Se'atat Info Modal */}
      <div id="seatat-info-modal" className="modal">
        <div className="modal-content" style={{ maxWidth: '500px' }}>
          <span className="close-button" id="close-seatat-modal">&times;</span>
          <h3>Tselote Se’atat Readings</h3>
          <p>
            These are the appointed Scripture readings for the daily prayers of <i>Tselote Se'atat</i> (Horologion). Selecting a day will automatically insert the appropriate readings into the prayer view.
          </p>
        </div>
      </div>

      {/* Ephrem Story Modal */}
      <div id="ephrem-story-modal" className="modal">
        <div className="modal-content ephrem-story-content">
          <span className="close-button" id="close-ephrem-modal">&times;</span>
          <div className="story-body">
            <h2 className="story-inner-title">
              The Story of Saint Ephrem the Syrian Potter Who Composed the Praise Hymn Called “Weddase Maryam” Over Seven Days
            </h2>

            <section className="story-section intro-box">
              <h3>Introduction</h3>
              <p>
                A miracle [performed] by Our Lady Mary, Holy Twofold Virgin, the Mother of God, may her prayers and blessings be with her servant(s){' '}
                <span className="story-servant-name">{`{{Servant's Names}}`}</span> in the morning and evening, forever and ever, amen.
              </p>
              <p>
                Listen, my fathers and brothers, so that we might tell you about the great miracle that Our Lady Mary, Holy Twofold Virgin, the Mother of God, performed. As God is my witness, the holy fathers told us about this miracle, and I’ve added nothing nor taken anything away from the story.
              </p>
              <p>
                The holy fathers told us about a God-fearing potter living in Syria who loved Our Lady Mary, Holy Twofold Virgin, the Mother of God. He praised her from the depths of his heart.
              </p>
            </section>

            <div className="story-tabs-nav">
              <button className="story-tab-btn active" data-day="monday">Mon</button>
              <button className="story-tab-btn" data-day="tuesday">Tue</button>
              <button className="story-tab-btn" data-day="wednesday">Wed</button>
              <button className="story-tab-btn" data-day="thursday">Thu</button>
              <button className="story-tab-btn" data-day="friday">Fri</button>
              <button className="story-tab-btn" data-day="saturday">Sat</button>
              <button className="story-tab-btn" data-day="sunday">Sun</button>
            </div>

            <div className="story-tabs-content">
              <div id="story-monday" className="story-day-pane active">
                <h4>Monday</h4>
                <p>Early Monday morning, Our Lady Mary, Holy Twofold Virgin, the Mother of God, appeared to that potter with great majesty, clothed in light and with angels encircling her.</p>
                <p>She said to the potter, “My dear beloved one, and my son’s beloved one, peace be upon you. I have come to you now so that you may praise me abundantly, which will be how I will be remembered forever.”</p>
                <p>The potter replied, “My dear Lady, I am weak and useless. Am I [even] able to praise you? Instead, bless me with your holy hand, dear Treasury of Blessing.”</p>
                <p>Mary said, “May the blessing of the Holy Spirit be with you, amen.”</p>
                <p>When she said this, the grace of the Holy Spirit filled him, and the potter opened his mouth and said:</p>
                <blockquote>
                  “The Lord wanted to free Adam, whose heart was sad and despairing,<br />
                  To return Adam to his previous seat. . . .”
                </blockquote>
                <p>[In this way,] he effortlessly composed the Praise of Mary for Monday, while the Holy Spirit spoke with the potter’s mouth.</p>
                <p>And once he had completed her praise, Our Lady Mary, Holy Twofold Virgin, the Mother of God, blessed him, thanked him, and gave him peace.</p>
                <p>Then Mary ascended to heaven while being loudly praised [by the angels].</p>
              </div>

              <div id="story-tuesday" className="story-day-pane">
                <h4>Tuesday</h4>
                <p>On Tuesday, Mary came to him again, saying to Ephrem, “Peace be upon you, my dear beloved one! Please praise me today, just as the Holy Spirit inspired you [to do before].”</p>
                <p>He replied, “Bless me [first].”</p>
                <p>So she blessed him, and he opened his mouth and said:</p>
                <blockquote>
                  “The crown of our praise, the beginning of our rescue, the foundation of our purity,<br />
                  [All] happened through Our Lady Mary, Holy Twofold Virgin, the Mother of God. . . .”
                </blockquote>
                <p>[He composed the Praise of Mary for Tuesday] through to the end.</p>
                <p>Then Mary rejoiced, blessed him, and gave him peace. Then she ascended to heaven while being loudly praised [by the angels].</p>
              </div>

              <div id="story-wednesday" className="story-day-pane">
                <h4>Wednesday</h4>
                <p>On Wednesday, Our Lady Mary, Holy Twofold Virgin, the Mother of God, came to Ephrem again.</p>
                <p>She said to him, “Peace be upon you, dear man of God,” and she blessed him.</p>
                <p>She continued, [saying,] “Praise me, just as you have been.”</p>
                <p>Ephrem opened his mouth and said:</p>
                <blockquote>
                  “All the heavenly hosts declare that you are blessed,<br />
                  Our Lady Mary, Holy Twofold Virgin, the Mother of God, the Second Heaven. . . .”
                </blockquote>
                <p>[Thus, he composed the Praise of Mary for Wednesday] through to the end.</p>
              </div>

              <div id="story-thursday" className="story-day-pane">
                <h4>Thursday</h4>
                <p>Likewise, on Thursday, she came to him, and he praised her, saying:</p>
                <blockquote>
                  “Our Lady Mary, Holy Twofold Virgin, the Mother of God, resembles the burning bush that Moses saw in the wilderness.<br />
                  Whose branches were not burned up. . . .”<a href="#note-1" className="sup-ref">1</a>
                </blockquote>
                <p>[Thus, he composed the Praise of Mary for Thursday] through to the end.</p>
              </div>

              <div id="story-friday" className="story-day-pane">
                <h4>Friday</h4>
                <p>Then, on Friday, Our Lady Mary, Holy Twofold Virgin, the Mother of God, appeared to him again, sitting upon a glowing throne.</p>
                <p>She said to him, “Peace be upon you, my dear beloved one. Please praise him with your sweet melody.”</p>
                <p>He replied:</p>
                <blockquote>
                  “Blessed are you among women, and blessed is the fruit of your womb,<br />
                  Dear Virgin, Mother of God. . . .”<a href="#note-2" className="sup-ref">2</a>
                </blockquote>
                <p>[Thus, he composed the Praise of Mary for Friday] through to the end.</p>
                <p>Then she blessed him, made him happy, and ascended into heaven while being loudly praised [by the angels].</p>
              </div>

              <div id="story-saturday" className="story-day-pane">
                <h4>Saturday</h4>
                <p>Likewise, on Saturday, Our Lady Mary, Holy Twofold Virgin, the Mother of God, came to Ephrem, saying, “May joy and peace be with you, my dear beloved one!”</p>
                <p>After he got up [from his bed], he bowed down to her.</p>
                <p>She said to him, “Please praise me today, just as the Holy Spirit inspired you [to do before].”</p>
                <p>He replied, “Bless me [first].”</p>
                <p>So she blessed him, and he opened his mouth and said:</p>
                <blockquote>
                  “You are considered pure and luminous and holy by everyone,<br />
                  You who cradled the Lord with your arms.<br />
                  All of creation rejoices with you, shouting and declaring,<br />
                  ‘Rejoice, Full of Grace! Rejoice, for you have found favor! Rejoice, for God is with you!’”
                </blockquote>
                <p>[Thus, he composed the Praise of Mary for Saturday through to the end.]</p>
                <p>When he had finished praising her, she thanked him and ascended into heaven while being loudly praised [by the angels].</p>
              </div>

              <div id="story-sunday" className="story-day-pane">
                <h4>Sunday</h4>
                <p>Early Sunday morning, he drank [a little too much] wine and fell asleep.</p>
                <p>In the middle of Sunday night, Our Lady Mary, Holy Twofold Virgin, the Mother of God, showed up, saying to him, “Why didn’t you praise me today?! This is the most important day of the week. Today’s praise ought to be the best of all of them!”</p>
                <p>Ephrem said to her, “My dear Lady, today is Sunday, the day of rest. Christians do not work on Sundays.”</p>
                <p>Mary replied, “Don’t worry [about what you will say. Just] get out of bed, stand at your workplace, and say whatever the Holy Spirit inspires you to say.”</p>
                <p>After he got up, she blessed him, and then he kissed the cross in her hand.<a href="#note-3" className="sup-ref">3</a></p>
                <p>He stood at his workplace, where he made pottery, and opened his mouth, saying:</p>
                <blockquote>
                  “You are called love, dear blessed one among women!<br />
                  You are the second chamber, called the Holy of Holies, housing the tablet of the covenant. . . .”
                </blockquote>
                <p>Then he began to praise her [by singing the lyrics] with the three melodies[, which are called Ge’ez, Ezel, Araray].<a href="#note-4" className="sup-ref">4</a></p>
                <p>He continued until it was morning.</p>
                <p>At daybreak, Mary blessed Ephrem, saying, “My dear beloved one, may joy be with you, just as you have brought me joy. Just as you have praised me on earth, I will delight you in the kingdom of heaven. Just as you have toiled on earth to commemorate me with praise, I will give you a reward in the kingdom of heaven for your toil, which is endless joy.”</p>
                <p>It happened just as she had promised him.</p>
              </div>
            </div>

            <section className="story-section homily-box">
              <h3>Conclusion</h3>
              <p>So now, my beloved brothers, look at the extent of the love of God, and the love of Our Lady Mary, Holy Twofold Virgin, the Mother of God, for humanity. She will come down from heaven for a few good works, and she will bless those who love her and commemorate her.</p>
              <p>Now, let’s love Our Lady Mary, the Holy Virgin, and praise her as much as we can! And let’s show mercy to the poor for the sake of Our Lady Mary, the Holy Virgin. Let’s do good works and love one another. Let’s pray to Our Lord and Savior Jesus Christ and Our Lady Mary, the Holy Virgin.</p>
              <p className="story-blessing">
                May the prayer and blessings of Our Lady Mary, Holy Twofold Virgin, the Mother of God, be with her servant(s){' '}
                <span className="story-servant-name">{`{{Servant's Names}}`}</span> who loves her without limits, forever and ever, amen.
              </p>
            </section>

            <section className="story-section technical-context-collapsible">
              <button id="toggle-technical-context" className="technical-toggle-btn">
                <span>Technical & Historic Context</span>
                <svg className="toggle-icon" viewBox="0 0 24 24" width="20" height="20">
                  <path d="M7 10l5 5 5-5z" fill="currentColor" />
                </svg>
              </button>
              <div id="technical-context-content" className="technical-content-pane collapsed">
                <div className="summary-sub-box">
                  <strong>Summary:</strong>
                  <p>In Syria there was a potter named Ephrem who feared God and loved Mary. Every evening for six days, Mary visited and blessed him. After each blessing, inspired with the Holy Spirit, Ephrem recited hymns of praise in her honor. On the seventh day, he fell asleep after drinking wine. Mary visited him at midnight and demanded to know why he had not composed anything for her, on the very day when he should have the most praise. Ephrem replied that it was the Sabbath, during which the faithful are commanded not to work. Mary told him to go to his pottery workshop and to say whatever words came to him there. Ephrem obeyed Mary, and once in his workshop he praised her through the night. Pleased, Mary promised him never-ending joy in heaven.</p>
                </div>
                <div className="tech-grid">
                  <div className="tech-item">
                    <strong>Amharic Title:</strong>
                    <span>ውዳሴ ማርያምን በሰባት ቀናት የደረሰው ሶርያዊው ሸክላ ሠሪ ኤፍሬም</span>
                  </div>
                  <div className="tech-item">
                    <strong>Manuscript Info:</strong>
                    <span>This story, with the short title "The Syrian Potter's Poems," is very old: the earliest PEMM manuscript in which this story appears is from around 1451. (ይህ ታሪክ፣ በፐም የተሰጠው አጭር ርእስ, ከዐጭር ርእስ ጋር "የሸክላ ሠሪው ኤፍሬም መጽሐፍ ", ነው። በጣም የቆየ : ታሪኩ ለመጀመሪያ ጊዜ የተገኘበት ብራና የተጻፈበት ጊዜ 1451።)</span>
                  </div>
                  <div className="tech-item">
                    <strong>Liturgical Reading:</strong>
                    <span>Read in Church on the 15th day of Hamle.</span>
                  </div>
                  <div className="tech-item full-width">
                    <strong>Ge’ez Incipit:</strong>
                    <span className="geez-text">ስምዑ፡ አበውየ፡ ወአኃውየ፡ ከመ፡ ንንግርክሙ፡ ተአምረ፡ ዐባየ፡ ዘኮነ፡ ለእግዝእትነ፡ ቅድስት፡ ድንግል፡ ማርያም፡ ዘነገሩ፡ አበው፡ ቅዱሳን፡ ሰማዕትየ፡ እግዚአብሔር፡ ከመ፡ ኢይዌስክ፡ ወኢያነትግ። ይቤሉነ፡ ነበረ፡ በምድረ፡ ሶርያ፡ አሐዱ፡ ብእሲ፡ ለባሓዊ፡ ፈራሄ፡ እግዚአብሔር።</span>
                  </div>
                </div>
                <div className="notes-sub-section" style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px dashed var(--border-color)' }}>
                  <strong>Notes:</strong>
                  <ol className="story-notes" style={{ marginTop: '0.5rem' }}>
                    <li id="note-1">An allusion to Exodus 3.</li>
                    <li id="note-2">An allusion to Luke 1:42.</li>
                    <li id="note-3">Her behavior toward Ephrem is that of a priest, blessing him, and offering her cross to be kissed.</li>
                    <li id="note-4">These three melodies are used for the liturgy: ግዕዝ (Ge’ez), ዕዝል (Ezel), and ዓራራይ (Araray).</li>
                  </ol>
                </div>
              </div>
            </section>

            <footer className="story-citation">
              <p>Source: <a href="https://pemm.princeton.edu/stories/14" target="_blank" rel="noopener noreferrer">PEMM Princeton: ID 14: The Syrian Potter's Poems</a></p>
              <p className="citation-detail">Translated by Jeremy Brown & Dawit Muluneh with Wendy Laura Belcher (2024).</p>
            </footer>
          </div>
        </div>
      </div>

      {/* Help Modal */}
      <div id="help-modal" className="modal">
        <div className="modal-content">
          <span className="close-button" id="close-help-modal">&times;</span>
          <div className="help-header">
            <h2>The Mount of Mercy | ደብረ ምሕረት</h2>
            <div className="bible-verse-about">
              <p>“I praise you seven times a day” ፨ <span className="ethiopic-label">“ስብዐ ለዕለትየ እሴብሐከ”</span></p>
              <p className="citation">Psalm 118:164 ፨ <span className="ethiopic-label">መዝሙር ዘዳዊት ፻፲፰፡፻፷፬</span></p>
            </div>
          </div>

          <div className="modal-tabs help-tabs">
            <button className="help-tab-btn active" data-tab="general">General</button>
            <button className="help-tab-btn" data-tab="translations">Translations</button>
            <button className="help-tab-btn" data-tab="beta">Feedback</button>
          </div>

          <div className="help-tab-content">
            <div id="help-general" className="help-pane active">
              <p>This web app is designed to aid Orthodox Christians and catachumens towards a life of unceasing prayer. It provides access to essential daily prayers and the Divine Liturgy (Kidasé) in multiple languages, including Amharic, English, Ge'ez, Spanish, and Tigrinya with phonetic transliterations to assist in learning and pronunciation.</p>
              <h3>📱 Install App to Your Phone</h3>
              <p>For easy access and offline use, you can install this web app to your mobile home screen:</p>
              <ul>
                <li><strong>iOS (Safari):</strong> Tap the "Share" icon and then select "Add to Home Screen".</li>
                <li><strong>Android (Chrome):</strong> Tap the three-dots menu and select "Install App" or "Add to Home screen".</li>
              </ul>
              <h3>💻 Install App to Your Computer</h3>
              <p>For easy access and offline use, you can also install this web app on your desktop computer:</p>
              <ul>
                <li><strong>Chrome:</strong>
                  <ul>
                    <li>Look for the "Install" icon (a computer with a down arrow) in the address bar on the right side, and click "Install".</li>
                    <li>Alternatively, tap the three-dots menu in the top right, then click "Cast, Save, & Share" then "Install".</li>
                  </ul>
                </li>
                <li><strong>Safari (macOS):</strong> Go to "File" in the menu bar and select "Add to Dock".</li>
              </ul>
            </div>

            <div id="help-translations" className="help-pane">
              <h3>📖 Translations</h3>
              <p>The English translations of the prayers in this app are a work-in-progress and not yet approved by clergy. This English translation is intended to be a more accurate improvement upon the few existing English resources. Several sources are actively being consulted, including:</p>
              <ul>
                <li><a href="https://a.co/d/h5TO3sz" target="_blank" rel="noopener noreferrer">ውዳሴ ማርያም Widasie Maryam | The Praises of St. Mary: In Ge’ez & English, 3rd Edition</a> translated by Living Tewahdo Ministry in March 2024</li>
                <li>Daily Prayers of the Ethiopian Orthodox <i>Täwaḥədo</i> Church, Revised Pocket Edition translated by Archdeacon Täsfa Mika’el Williams in May 2020</li>
                <li><a href="https://a.co/d/3aUZYDE" target="_blank" rel="noopener noreferrer">Book of Prayer - መጽሐፈ ጸሎት: Theotokia (Weddase Mariam) / Selected Psalms, Litanies and Prayers</a> translated by Father Mebratu Kiros (PhD) in 2022</li>
                <li><a href="https://www.ethiopianorthodox.org/amharic/yeqolotbet/lessons/daily.pdf" target="_blank" rel="noopener noreferrer">የየዘወትር ጸሎት (The Daily Prayer)</a> published by ethiopianorthodox.org</li>
              </ul>

              <h4>Divine Liturgy (Kidasé)</h4>
              <p>The liturgical texts are sourced from several authoritative trilingual and bilingual editions:</p>
              <ul>
                <li><strong>Ge'ez, Amharic, & English:</strong> <i>“መጽሐፈ ቅዳሴ በግእዝ፣ በአማርኛና በእንግሊዝኛ: The Liturgy of the Ethiopian Orthodox Church”</i> published by Tensae Publishing House (Addis Ababa, Ethiopia, 2010).</li>
                <li><strong>Ge'ez Transcription:</strong> <i>Digitized Liturgical Ge'ez Text</i> transcribed by wandering poetry students (<span className="ethiopic-label">ቆሎ ተማሪ</span> - <i>Qolo Temari</i>) in Bahir Dar, Ethiopia (October 2024).</li>
                <li><strong>Tigrinya:</strong> <i>“መጽሐፈ ቅዳሴ። በግዕዝ ምስ ምልክቱን በትግርኛን”</i> published by Eritrean Orthodox Tewahdo Synod (Asmera, Eritrea 1993).</li>
                <li><strong>Arabic & English Translations:</strong> <i>“The Liturgy of the Ethiopian Church”</i> by Fr. Marcos Daoud and H.E. Blatta Marsie Hazen (Cairo, Egypt 1959).</li>
                <li><strong>Miracles of Mary Data & Translations:</strong> Princeton Ethiopian, Eritrean, and Egyptian Miracles of Mary (PEMM) Project.</li>
              </ul>
            </div>

            <div id="help-beta" className="help-pane">
              <h3>⚠️ Beta Version / Work-in-Progress</h3>
              <p>This web app is currently in a beta stage and is very much a work-in-progress. We appreciate your patience with any technical issues. Your feedback is invaluable!</p>

              <div className="feedback-form-container" style={{ marginTop: '1.5rem' }}>
                <textarea id="feedback-textarea-help" placeholder="Enter your feedback here..." style={{ width: '100%', minHeight: '120px', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--background-color)', color: 'var(--text-color)', marginBottom: '1rem' }}></textarea>
                <button id="send-feedback-button-help" className="settings-button" style={{ width: 'auto', padding: '0.6rem 2rem' }}>Send Feedback</button>
              </div>

              <p className="disclaimer" style={{ marginTop: '2rem', fontSize: '0.85rem', opacity: 0.8, fontStyle: 'italic' }}>
                This service is made with love for the glory of God and is managed by servants of the Oakland Debre Meheret Saint Michael Ethiopian Orthodox Tewahedo Church (EOTC) under the spiritual guidance of Father Nebiyou Elias and under the auspices of His Grace Archbishop Theophilus in the EOTC Diocese of Northern California, Nevada, and Arizona.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Feedback Modal */}
      <div id="feedback-modal" className="modal">
        <div className="modal-content">
          <span className="close-button" id="close-feedback-modal">&times;</span>
          <h2>Share Your Feedback</h2>
          <p>Thank you for your patience if a technical issue occurs. We are continuously working to improve this service, so please don't hesitate to submit your feedback below.</p>
          <textarea id="feedback-textarea" placeholder="Enter your feedback here..."></textarea>
          <button id="send-feedback-button">Send</button>
        </div>
      </div>

      {/* Scribe Login Modal */}
      <div id="scribe-login-modal" className="modal">
        <div className="modal-content">
          <span className="close-button" id="close-scribe-login-modal">&times;</span>
          <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
            <img src="/img/dimyanos_cropped.jpg" alt="Dimyanos the Scribe" style={{ width: '180px', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.3)' }} />
          </div>
          <h2>Scribe's Entrance</h2>
          <p>Enter your credentials to enter the Scribe's Chamber.</p>
          <form className="scribe-login-form" id="scribe-login-form">
            <input type="email" id="scribe-email" placeholder="Email" required />
            <input type="password" id="scribe-password" placeholder="Password" required autoComplete="current-password" />
            <button type="submit" id="scribe-login-btn">Login</button>
            <p id="scribe-login-error" className="error-text hidden"></p>
          </form>
        </div>
      </div>

      {/* Scribe Editor Modal */}
      <div id="scribe-editor-modal" className="modal">
        <div className="modal-content scribe-editor-content">
          <span className="close-button" id="close-scribe-editor-modal">&times;</span>
          <h2>Scribe's Chamber</h2>
          <p id="scribe-editor-ref" style={{ fontSize: '0.8rem', opacity: 0.7, marginBottom: '1rem' }}></p>

          <div id="scribe-editor-metadata" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
            <div className="editor-field-group">
              <label>Chapter</label>
              <input type="text" id="edit-chapter" readOnly style={{ padding: '0.5rem', border: '1px solid var(--border-color)', background: 'var(--surface-color)', color: 'var(--text-color)', borderRadius: '4px', opacity: 0.6, cursor: 'not-allowed' }} />
            </div>
            <div className="editor-field-group">
              <label>Stanza Index</label>
              <input type="text" id="edit-stanza" readOnly style={{ padding: '0.5rem', border: '1px solid var(--border-color)', background: 'var(--surface-color)', color: 'var(--text-color)', borderRadius: '4px', opacity: 0.6, cursor: 'not-allowed' }} />
            </div>
            <div className="editor-field-group">
              <label>Reference</label>
              <input type="text" id="edit-reference" readOnly style={{ padding: '0.5rem', border: '1px solid var(--border-color)', background: 'var(--surface-color)', color: 'var(--text-color)', borderRadius: '4px', opacity: 0.6, cursor: 'not-allowed' }} />
            </div>
            <div className="editor-field-group">
              <label>Instruction</label>
              <input type="text" id="edit-instruction" readOnly style={{ padding: '0.5rem', border: '1px solid var(--border-color)', background: 'var(--surface-color)', color: 'var(--text-color)', borderRadius: '4px', opacity: 0.6, cursor: 'not-allowed' }} />
            </div>
          </div>

          <div id="scribe-editor-fields"></div>
          <div className="scribe-editor-actions">
            <select id="scribe-status-select">
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
            <button id="scribe-save-btn">Save Changes</button>
          </div>
        </div>
      </div>

      {/* Icon Metadata Modal */}
      <div id="icon-metadata-modal" className="modal">
        <div className="modal-content icon-metadata-content">
          <span className="close-button" id="close-icon-metadata-modal">&times;</span>
          <div id="icon-metadata-body">
            <div className="icon-header">
              <h2 id="icon-title-geez" className="ethiopic-label"></h2>
              <p id="icon-title-translit" style={{ fontStyle: 'italic', opacity: 0.8 }}></p>
              <h3 id="icon-title-english"></h3>
            </div>
            <div id="icon-original-images-container" className="icon-images-container"></div>
            <div id="icon-description-container" className="icon-description-section">
              <p id="icon-desc-english"></p>
              <p id="icon-desc-amharic" className="ethiopic-label"></p>
            </div>
            <div id="icon-bible-refs" className="icon-metadata-detail"></div>
            <div id="icon-source-citation" className="icon-source-section"></div>
            <div id="icon-scribe-edit-section" className="hidden" style={{ marginTop: '2rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
              <button id="edit-icon-btn" className="settings-button">Edit Icon Metadata (Scribe)</button>
            </div>
          </div>
        </div>
      </div>

      {/* Scribe Icon Editor Modal */}
      <div id="scribe-icon-editor-modal" className="modal">
        <div className="modal-content">
          <span className="close-button" id="close-scribe-icon-editor-modal">&times;</span>
          <h2>Scribe's Icon Chamber</h2>
          <div id="scribe-icon-fields" className="scribe-editor-fields">
            <div className="editor-field-group">
              <label>Description (Amharic)</label>
              <textarea id="edit-icon-desc-amharic" className="ethiopic-label"></textarea>
            </div>
            <div className="editor-field-group">
              <label>Description (English)</label>
              <textarea id="edit-icon-desc-english"></textarea>
            </div>
            <div className="editor-field-group">
              <label>Source / Citation</label>
              <textarea id="edit-icon-source"></textarea>
            </div>
          </div>
          <div className="scribe-editor-actions">
            <button id="scribe-save-icon-btn">Save Icon Metadata</button>
          </div>
        </div>
      </div>

      {/* Eusebius Modal */}
      <div id="eusebius-modal" className="modal">
        <div className="modal-content eusebius-content">
          <span className="close-button" id="close-eusebius-modal">&times;</span>
          <div className="eusebius-body">
            <h2 className="story-inner-title">About the Psalms, according to Eusebius (c. 335 AD)</h2>
            <figure className="modal-image-container">
              <img src="/img/14th-century-intro-to-psalms-folio5r-Ethiopic-Manuscripts-No.6-St-Catherine-Mt-Sinai.jpg" alt="Ethiopic Manuscript Folio 5r" />
              <figcaption>Folio 5r, Ethiopic Manuscript No. 6, St. Catherine's Monastery, Mt. Sinai (14th Century).</figcaption>
            </figure>

            <div className="modal-tabs">
              <button className="modal-tab-btn active" data-lang="english">English<sup><a href="#fn1" id="ref1">[1]</a></sup></button>
              <button className="modal-tab-btn" data-lang="geez">ግእዝ (Ge'ez)<sup><a href="#fn2" id="ref2">[2]</a></sup></button>
              <button className="modal-tab-btn" data-lang="greek">Ελληνικά (Greek)<sup><a href="#fn3" id="ref3">[3]</a></sup></button>
            </div>

            <div className="modal-tab-content">
              <div id="eusebius-english" className="modal-pane active">
                <p>The arrangement of the order of Eusebius the Palestinian (c. 260 - 339 AD), who wrote <i>about</i> the Psalms and its arrangement, according to how it is present <i>and</i> how it was written in the Hebrew, and also how he translated <i>it</i>.</p>
                <p><i>The children of the Hebrews divide the whole book of the Psalms into five parts. The first part runs from the 1st psalm to the 40th; the second part runs from the 41st psalm to the 71st. The third part runs from the 72nd psalm to Psalm 88th; the fourth part runs from the 89th psalm to the 105th; and the fifth part runs from the 106th psalm until the end.</i> There are 19 psalms that are without superscriptions.</p>
                <p>For those whose arrangement is written:</p>
                <ul>
                  <li>72 of David.</li>
                  <li>11 of the Sons of Korah.</li>
                  <li><i>12</i> of Asaph.</li>
                  <li>1 of Ethan the Israelite.</li>
                  <li>2 of Solomon.</li>
                  <li>1 of Moses.</li>
                  <li><i>17</i> which have no name.</li>
                  <li>And <i>15</i> with Hallelujah.</li>
                  <li>And these (<i>19</i>) are those which have no title, but they are written in the book.</li>
                </ul>
                <p>And the sum of all of them is 150. Those which are within the book are of David, specifically those he sang; but there are those by other prophets who prophesied in song. And therefore, that which is in the Hebrew is not all written by David, yet the whole was named the Book of Psalms. <b>And the purpose of this book is the fear of God and keeping distant from evil.</b></p>
              </div>

              <div id="eusebius-geez" className="modal-pane">
                <p className="ethiopic-label">ግጻዌ ሥርዐት ዘአውሳብዮስ ፍልስጥናዊ ዘወ ጽሐፈ መዝሙር ወግጻዌሁ ዘበህልወ ዘከመ ተጽሕፈ ዘበ ዕብራይስጢ ወዘከመ ሂ አዕለወ።</p>
                <p className="ethiopic-label">ወ እለ ኢኮኑ ጽሑፋነ ፲፱።</p>
                <p className="ethiopic-label">ለእለ ጽሑፍ ግጻዌሆሙ ከወዘ። ፻፴ወ፬</p>
                <ul className="ethiopic-label">
                  <li>ዘዳዊት። ፸፪</li>
                  <li>ዘደቂቀ ቆሬ። ፲፪</li>
                  <li>ዘአሳፍ። ፲፪</li>
                  <li>ዘኢታን እስራኤላዊ። ፩</li>
                  <li>ዘሰሎሞን። ፪</li>
                  <li>ዘሙሴ። ፩</li>
                  <li>እለ ስመ አልቦሙ ዘኢታን። ፴፰</li>
                  <li>ወ ዘበ ሃሌ ሉያ። ፳</li>
                </ul>
                <p className="ethiopic-label">ወእሉ እለ ስመ አልቦሙ ወባሕቱ ጽሑፋት በውስተ ወባሕቱ አልቦሙ ስመ ወኢ ይብሉ ዘእገሌ።</p>
                <p className="ethiopic-label">ወክብ ኵሎሙ ፻ወ፶።</p>
                <p className="ethiopic-label">እለ ዘየውስተ ዘዳዊት ባሕቱ ዘዘመረ እለ በካልአን ነቢያት እለ በዘምሮ ተነበዩ ወበእንተዝ ዘበ ዕብራይስጢ አኮ ኵሉ ዘተጽሕፈ ለዳዊት ወኵሉ መጽሐፈ መዝሙር ተሰምየ ወዝንቱ ውእቱ ፍርሀተ እግዚአብሔር ወአርሐቀ እምፀራይ።</p>
              </div>

              <div id="eusebius-greek" className="modal-pane">
                <p>Τῆς βίβλου τῶν Ψαλμῶν ἥδε ἂν εἴη ἡ διαίρεσις, ὡς τὰ ἀκριβῆ τῶν ἀντιγράφων αὐτό τε τὸ Ἑβραϊκὸν περιέχει·</p>
                <p>Εἰς πέντε δὲ μέρη τὴν πᾶσαν τῶν ψαλμῶν βίβλον παῖδες Ἑβραίων διαίρουσιν· πρῶτον, εἰς τοὺς ἀπὸ πρώτου μέχρις τεσσαρακοστοῦ· δεύτερον, εἰς τοὺς ἀπὸ τεσσαρακοστοῦ πρώτου μέχρις ἑβδομηκοστοῦ πρώτου· τρίτον, εἰς τοὺς ἀπὸ ἑβδομηκοστοῦ δευτέρου μέχρις ὀγδοηκοστοῦ ὀγδόου· τέταρτον, εἰς τοὺς ἀπὸ ὀγδοηκοστοῦ ἐνάτου μέχρις ἑκατοστοῦ πέμπτου· πέμπτον, εἰς τοὺς ἀπὸ ἑκατοστοῦ ἕκτου μέχρις τέλους τοῦ βιβλίου.</p>
                <p>Ἀνεπίγραφοι δέ εἰσι ψαλμοὶ ιθʹ</p>
                <p>Τῶν ἐπιγεγραμμένων δέ εἰσιν οὕτως αἱ διαιρέσεις፡</p>
                <ul>
                  <li>τοῦ μὲν Δαυῒδ οβʹ</li>
                  <li>τῶν υἱῶν Κορὲ ιαʹ</li>
                  <li>τοῦ Ἀσὰφ ιβʹ</li>
                  <li>Αἰθὰμ τοῦ Ἰσραηλίτου αʹ</li>
                  <li>Σολομῶντος βʹ</li>
                  <li>Μωϋσέως αʹ</li>
                  <li>ἀνώνυμοι ιζʹ</li>
                  <li>καὶ τῶν εἰς τὸ Ἀλληλούϊα ιεʹ</li>
                </ul>
                <p>Εἰσὶ δὲ ἀνώνυμοι ὅσοι ἐπιγραφὰς μὲν ἔχουσιν, οὐ μὴν δηλοῦσι τίνος εἰσίν.</p>
                <p>ὁμοῦ ρνʹ.</p>
              </div>
            </div>

            <hr className="footnotes-separator" />
            <section className="modal-footnotes">
              <div id="fn1" className="footnote-item">
                <a href="#ref1" className="footnote-backref">1.</a> Bold text indicates phrasing unique to the Ge'ez manuscript above. Italic text indicates historical context preserved in the original Greek but absent from the cited Ge'ez manuscript.
              </div>
              <div id="fn2" className="footnote-item">
                <a href="#ref2" className="footnote-backref">2.</a> Note on Ge'ez Numerals: The internal mathematical counts in this specific manuscript total 177 rather than the standard 150. Specifically, the counts of 38 anonymous Psalms (፴፰) and 20 Hallelujah Psalms (፳) differ from the original Greek which lists 17 and 15 respectively. This is a common occurrence in ancient manuscripts resulting from scribal transcription errors or fading ink over centuries.
              </div>
              <div id="fn3" className="footnote-item">
                <a href="#ref3" className="footnote-backref">3.</a> Greek Translation Reference: "On the Division of the Psalter and Psalms," translated from the Greek by Fr. Justinus.
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Psalm Combinations Modal */}
      <div id="psalm-combinations-modal" className="modal">
        <div className="modal-content psalm-combinations-content">
          <div className="psalm-combinations-header">
            <h2>Typical Psalm Combinations</h2>
            <span className="close-button" id="close-psalm-combinations-modal">&times;</span>
          </div>
          <div className="psalm-combinations-instructions">
            The Fathers teach that if you cannot pray the entire 150 Psalms daily, you may chant a prescribed combination of Psalms or start with a single Psalm. Please consult your Father of Confession when setting a personal prayer rule for yourself. Note that all psalm chapters follow the Septuagint/Ge'ez numbering. Click on one of the options below to select a combination of Psalms to pray.
          </div>
          <div id="psalm-combinations-accordion" className="psalm-combinations-body"></div>
        </div>
      </div>

      {/* Typical Psalms (Misbak) Modal */}
      <div id="typical-psalms-modal" className="modal">
        <div className="modal-content typical-psalms-modal-content">
          <div className="typical-psalms-modal-header">
            <h2>Typical Liturgy Psalm Chants</h2>
            <span className="close-button" id="close-typical-psalms-modal">&times;</span>
          </div>
          <div className="typical-psalms-modal-instructions">
            Select a liturgical Psalm chant (misbak) from the list below. The phonetic Ge'ez incipits are listed alphabetically.
          </div>
          <div id="typical-psalms-list" className="typical-psalms-modal-body"></div>
        </div>
      </div>

      {/* St. Athanasius Modal */}
      <div id="athanasius-modal" className="modal">
        <div className="modal-content athanasius-modal-content">
          <span className="close-button" id="close-athanasius-modal">&times;</span>
          <div className="athanasius-modal-header">
            <h2>📜 St. Athanasius’ Guide to the Psalms</h2>
            <p className="athanasius-subtitle"><i>Saint Athanasius to Marcellinus: On the Interpretation of the Psalms (c. 360 AD)</i></p>
          </div>
          <div className="athanasius-search-container">
            <input type="text" id="athanasius-search-input" placeholder="Search by emotion, trial, prophecy, keyword, or LXX Psalm..." />
          </div>
          <div id="athanasius-category-chips" className="athanasius-category-chips"></div>
          <div id="athanasius-results-count" className="athanasius-results-count"></div>
          <div id="athanasius-prescriptions-list" className="athanasius-prescriptions-list"></div>
        </div>
      </div>

      {/* Changelog Modal */}
      <div id="changelog-modal" className="modal">
        <div className="modal-content changelog-content">
          <span className="close-button" id="close-changelog-modal">&times;</span>
          <div className="changelog-header">
            <h2>Mount of Mercy Changelog</h2>
            <div className="active-badge">Active Maintenance</div>
          </div>
          <p className="changelog-intro">
            Recent updates and improvements to the project. Interested in contributing? Visit our{' '}
            <a href="https://github.com/vineofmary/prayer" target="_blank" rel="noopener noreferrer">GitHub repository</a>.
          </p>
          <div id="changelog-list" className="changelog-list">
            <div className="changelog-loading">Fetching recent updates...</div>
          </div>
        </div>
      </div>

      {/* Miracle of Mary Modal */}
      <div id="miracle-modal" className="modal">
        <div className="modal-content" style={{ maxWidth: '600px', maxHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
          <span className="close" id="close-miracle-modal">&times;</span>
          <h2 style={{ marginBottom: '0.5rem', fontFamily: "'Aboriginal Serif', serif", textAlign: 'center' }}>
            Miracle of Mary | ተአምረ ማርያም
          </h2>
          <div style={{ marginBottom: '1rem' }}>
            <input type="text" id="miracle-search-input" className="settings-select" placeholder="Search by title or incipit..." style={{ width: '100%', padding: '0.5rem', boxSizing: 'border-box', marginBottom: '0.5rem' }} />
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
              <input type="checkbox" id="miracle-most-read-toggle" defaultChecked />
              Show only stories most read in church
            </label>
          </div>
          <div id="miracle-count-text" style={{ fontSize: '0.85rem', opacity: 0.8, marginBottom: '0.5rem', textAlign: 'right' }}></div>
          <div id="miracle-list-container" style={{ overflowY: 'auto', flexGrow: 1, border: '1px solid var(--border-color)', borderRadius: '4px', padding: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}></div>
        </div>
      </div>

      {/* Modal Backdrop */}
      <div id="modal-backdrop"></div>
    </>
  );
};
