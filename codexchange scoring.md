**Claim offer

8e263bce-874f-47d8-8e85-fa63a66468bd.png
@media (max-width: 480px) {
header {
padding: 10px 10px 8px;
}

.logo img.header-logo {
height: 28px;
}

.logo img.header-logo.wc-logo {
height: 30px;
max-width: 34px;
}

.logo-text h1 {
font-size: 14px;
}

.logo-text p {
font-size: 10px;
}

.logo-divider {
height: 22px;
}

.nav-btn {
padding: 10px 12px;
font-size: 12px;
}

.login-logo .trophy {
width: min(170px, 62vw);
margin-bottom: 12px;
}

.user-pill {
font-size: 12px;
padding: 4px 8px 4px 4px;
}

#user-display-name {
display: none; /_ just show avatar on tiny screens _/
}

main {
margin: 16px auto;
padding: 0 12px;
}

.section-title {
font-size: 18px;
}

.mc-body {
padding: 14px 12px;
}

.mc-result-grid {
grid-template-columns: 1fr;
}

.mc-result-score {
font-size: 24px;
}

.mc-result-score--sub {
font-size: 16px;
}

.score-input {
width: 54px;
height: 46px;
font-size: 22px;
}

.champion-trophy {
width: 72px;
height: 72px;
font-size: 42px;
}

.champion-name {
font-size: 18px;
}

.result-card .match-date {
font-size: 12px;
}

.result-card .team-name {
font-size: 16px;
}

.result-card .result-score {
font-size: 26px;
}

.modal {
padding: 20px 16px;
}

.scoring-grid {
grid-template-columns: 1fr;
}
}

@media (hover: none), (pointer: coarse) {
.match-card.open:hover,
.result-card:hover,
.score-rule-card:hover,
.btn-primary:hover {
transform: none;
box-shadow: inherit;
}
}

/_ Rules Modal Styles _/
.rules-modal-content {
max-width: 550px !important;
max-height: 85vh;
overflow-y: auto;
scrollbar-width: thin;
scrollbar-color: var(--wc-blue) var(--dark);
}

.rules-modal-content::-webkit-scrollbar {
width: 6px;
}
.rules-modal-content::-webkit-scrollbar-track {
background: var(--dark);
}
.rules-modal-content::-webkit-scrollbar-thumb {
background-color: var(--wc-blue);
border-radius: 3px;
}

.welcome-text {
font-family: "DM Sans", sans-serif;
font-size: 14px;
line-height: 1.6;
color: var(--light);
margin-bottom: 20px;
}

.modal-section-title {
font-family: "Barlow Condensed", sans-serif;
font-size: 18px;
font-weight: 700;
text-transform: uppercase;
color: var(--wc-blue);
margin: 20px 0 10px 0;
letter-spacing: 0.5px;
border-bottom: 1px solid rgba(0, 209, 94, 0.2);
padding-bottom: 5px;
}

.rules-list {
list-style: none;
margin-bottom: 20px;
}

.rules-list li {
position: relative;
padding-left: 20px;
margin-bottom: 10px;
font-size: 13px;
line-height: 1.5;
color: #d1d5db;
}

.rules-list li::before {
content: "✦";
position: absolute;
left: 0;
color: var(--wc-blue);
}

.scoring-grid {
display: grid;
grid-template-columns: repeat(2, 1fr);
gap: 12px;
margin-bottom: 25px;
}

@media (max-width: 480px) {
.scoring-grid {
grid-template-columns: 1fr;
}
}

.score-rule-card {
background: rgba(255, 255, 255, 0.03);
border-radius: 10px;
padding: 12px 15px;
position: relative;
transition: all 0.3s ease;
}

.score-rule-card:hover {
background: rgba(255, 255, 255, 0.06);
transform: translateY(-2px);
}

.pts-val {
position: absolute;
top: 10px;
right: 12px;
font-family: "Barlow Condensed", sans-serif;
font-size: 18px;
font-weight: 800;
}

.score-rule-card strong {
display: block;
font-family: "DM Sans", sans-serif;
font-size: 13px;
font-weight: 600;
margin-bottom: 4px;
}

how can i fix this /_ GGO WC 2026 Predictor - Main Stylesheet _/

:root {
--wc-blue: #00d15e; /_ GGO Green _/
--wc-red: #00b359; /_ GGO Green Dim _/
--dark: #06080f;
--light: #f5f5f5;
--muted: #a0a0a0;
--success: #10b981;
--warning: #f59e0b;
--danger: #ef4444;
--font-ggo-display: "Barlow Condensed", "Arial Narrow", sans-serif;
--font-ggo-body: "DM Sans", "Segoe UI", sans-serif;
}

- {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  }

html,
body {
font-family: var(--font-ggo-body);
background: var(--dark);
color: var(--light);
min-height: 100vh;
}

html {
-webkit-text-size-adjust: 100%;
}

body {
overflow-x: hidden;
line-height: 1.45;
}

button,
input,
textarea,
select {
font: inherit;
}

/_ ════════════════════════════════════════
LOGIN SCREEN
════════════════════════════════════════ _/

#login-screen {
display: flex;
justify-content: center;
align-items: center;
min-height: 100vh;
background:
linear-gradient(180deg, rgba(6, 8, 15, 0.96) 0%, rgba(6, 8, 15, 0.98) 100%),
repeating-linear-gradient(
135deg,
rgba(255, 255, 255, 0.03) 0 1px,
transparent 1px 11px
);
padding: 20px;
}

.login-card {
background:
linear-gradient(
145deg,
rgba(12, 17, 24, 0.98) 0%,
rgba(6, 36, 24, 0.78) 100%
),
repeating-linear-gradient(
135deg,
rgba(255, 255, 255, 0.04) 0 1px,
transparent 1px 9px
);
border: 2px solid rgba(0, 209, 94, 0.32);
border-radius: 8px;
padding: 34px;
max-width: 430px;
width: 100%;
overflow: hidden;
box-shadow: 0 18px 34px rgba(0, 0, 0, 0.26);
}

.login-logo {
text-align: center;
margin-bottom: 30px;
}

.login-logo .trophy {
display: block;
width: min(240px, 72vw);
max-width: 100%;
margin: 0 auto 15px;
overflow: hidden;
}

.login-logo .trophy img {
display: block;
width: 100%;
height: auto;
object-fit: contain;
}

.login-logo h2 {
font-family: var(--font-ggo-display);
font-size: 30px;
font-weight: 900;
margin-bottom: 6px;
letter-spacing: 0.4px;
text-transform: uppercase;
}

.login-logo h2 span {
color: var(--wc-red);
}

.login-logo p {
color: var(--muted);
font-size: 12px;
letter-spacing: 0.4px;
text-transform: uppercase;
}

.login-divider {
height: 1px;
background: rgba(0, 209, 94, 0.35);
margin: 22px 0;
}

.login-error {
display: none;
background: rgba(239, 68, 68, 0.08);
border: 1px solid rgba(239, 68, 68, 0.28);
color: #fecaca;
padding: 12px 15px;
border-radius: 6px;
font-size: 13px;
margin-bottom: 20px;
}

.login-error.show {
display: block;
}

.form-group {
margin-bottom: 20px;
}

.form-group label {
display: block;
font-size: 12px;
font-weight: 600;
text-transform: uppercase;
letter-spacing: 0.4px;
margin-bottom: 8px;
color: var(--muted);
}

.form-group input {
width: 100%;
padding: 12px 15px;
border: 1px solid rgba(0, 209, 94, 0.3);
border-radius: 8px;
background: rgba(0, 0, 0, 0.38);
color: var(--light);
font-size: 14px;
transition: all 0.3s ease;
}

.form-group input:focus {
outline: none;
border-color: var(--wc-blue);
background: rgba(0, 209, 94, 0.08);
box-shadow: 0 0 0 3px rgba(0, 209, 94, 0.12);
}

.username-suggestions {
margin-top: 8px;
display: grid;
gap: 6px;
max-height: 180px;
overflow: auto;
}

.username-suggestion {
width: 100%;
text-align: left;
padding: 10px 12px;
border: 1px solid rgba(0, 209, 94, 0.2);
border-radius: 8px;
background: rgba(0, 0, 0, 0.3);
color: var(--light);
font: inherit;
cursor: pointer;
}

.username-suggestion:hover,
.username-suggestion:focus-visible {
outline: none;
background: rgba(0, 209, 94, 0.12);
border-color: var(--wc-blue);
}

.btn-primary {
width: 100%;
padding: 12px 20px;
background: linear-gradient(135deg, var(--wc-blue) 0%, #00b359 100%);
color: white;
border: none;
border-radius: 8px;
font-family: var(--font-ggo-display);
font-size: 15px;
font-weight: 900;
letter-spacing: 0.5px;
cursor: pointer;
transition: all 0.3s ease;
text-transform: uppercase;
}

.btn-primary:hover {
transform: translateY(-2px);
box-shadow: 0 8px 20px rgba(0, 209, 94, 0.3);
}

.btn-primary:active {
transform: translateY(0);
}

/_ ════════════════════════════════════════
HEADER
════════════════════════════════════════ _/

header {
background: linear-gradient(
180deg,
rgba(6, 8, 15, 0.95) 0%,
rgba(6, 8, 15, 0.85) 100%
);
border-bottom: 2px solid var(--wc-blue);
padding: 12px 30px;
display: flex;
align-items: center;
gap: 20px;
position: sticky;
top: 0;
z-index: 100;
box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
flex-wrap: wrap;
}

.header-top {
display: flex;
align-items: center;
gap: 16px;
flex: 1;
min-width: 0;
}

.logo {
display: flex;
align-items: center;
gap: 12px;
min-width: 0;
overflow: hidden;
}

.logo img {
height: 40px;
width: auto;
}

.logo-next {
font-family: "Barlow Condensed", sans-serif;
font-size: 11px;
font-weight: 700;
text-transform: uppercase;
letter-spacing: 1px;
color: var(--wc-red);
opacity: 0.8;
}

.logo-divider {
width: 1px;
height: 30px;
background: var(--wc-blue);
opacity: 0.5;
}

.logo-text {
min-width: 0;
}

.logo-text h1 {
font-family: "Barlow Condensed", sans-serif;
font-size: 18px;
font-weight: 700;
letter-spacing: 1px;
white-space: nowrap;
}

.logo-text h1 span {
color: var(--wc-red);
}

.logo-text p {
font-size: 11px;
color: var(--muted);
letter-spacing: 0.5px;
}

.wc-badge {
display: flex;
align-items: center;
gap: 6px;
background: rgba(0, 209, 94, 0.1);
border: 1px solid rgba(0, 209, 94, 0.3);
padding: 6px 12px;
border-radius: 20px;
font-size: 11px;
white-space: nowrap;
}

.trophy-icon {
font-size: 14px;
}

.trophy-label {
color: var(--wc-blue);
font-weight: 600;
letter-spacing: 0.3px;
}

#main-nav {
display: flex;
gap: 8px;
flex-shrink: 0;
}

.nav-btn {
padding: 8px 16px;
background: transparent;
color: var(--muted);
border: 1px solid transparent;
border-radius: 6px;
font-family: "DM Sans", sans-serif;
font-size: 13px;
font-weight: 500;
cursor: pointer;
transition: all 0.3s ease;
white-space: nowrap;
min-height: 44px;
}

.nav-btn:hover {
color: var(--light);
border-color: var(--wc-blue);
}

.nav-btn.active {
background: var(--wc-blue);
color: white;
border-color: var(--wc-blue);
}

.nav-btn {
display: inline-flex;
align-items: center;
gap: 6px;
}

.nav-badge {
display: inline-flex;
align-items: center;
justify-content: center;
min-width: 18px;
height: 18px;
padding: 0 5px;
border-radius: 999px;
background: #ef4444;
color: #fff;
font-size: 11px;
font-weight: 700;
line-height: 1;
}
/_ ────────────────────────────────────────
FILTER BUTTONS
────────────────────────────────────────── _/

.matches-filter {
display: flex;
gap: 8px;
margin-bottom: 20px;
flex-wrap: wrap;
}

.filter-btn {
padding: 8px 16px;
background: rgba(0, 209, 94, 0.08);
color: var(--light);
border: 1px solid rgba(0, 209, 94, 0.3);
border-radius: 6px;
font-family: "DM Sans", sans-serif;
font-size: 13px;
font-weight: 600;
cursor: pointer;
transition: all 0.3s ease;
white-space: nowrap;
min-height: 44px;
}

.filter-btn:hover {
background: rgba(0, 209, 94, 0.18);
border-color: var(--wc-blue);
color: var(--light);
}

.filter-btn.active {
background: var(--wc-blue);
color: #fff;
border-color: var(--wc-blue);
box-shadow: 0 4px 12px rgba(0, 209, 94, 0.25);
}
.admin-btn {
margin-left: 10px;
border-left: 1px solid rgba(255, 255, 255, 0.1);
}

.sync-container {
display: flex;
align-items: center;
gap: 12px;
flex-shrink: 0;
}

.sync-status {
display: flex;
align-items: center;
gap: 8px;
font-size: 12px;
color: var(--muted);
}

.sync-btn {
padding: 7px 12px;
background: rgba(0, 209, 94, 0.12);
color: var(--light);
border: 1px solid rgba(0, 209, 94, 0.35);
border-radius: 6px;
font-size: 12px;
font-weight: 700;
cursor: pointer;
min-height: 44px;
}

.sync-btn:hover {
border-color: var(--wc-blue);
background: rgba(0, 209, 94, 0.24);
}

.sync-btn.loading {
opacity: 0.65;
pointer-events: none;
}

.status-dot {
display: inline-block;
width: 8px;
height: 8px;
border-radius: 50%;
background: var(--muted);
animation: pulse 2s infinite;
}

.status-dot.connected {
background: var(--success);
}

.status-dot.active {
background: var(--success);
}

.status-dot.loading {
background: var(--warning);
}

@keyframes pulse {
0%,
100% {
opacity: 0.6;
}
50% {
opacity: 1;
}
}

.user-pill {
display: flex;
align-items: center;
gap: 10px;
background: rgba(0, 209, 94, 0.1);
border: 1px solid rgba(0, 209, 94, 0.3);
border-radius: 20px;
padding: 6px 12px 6px 6px;
font-size: 13px;
max-width: 100%;
}

.user-avatar {
width: 28px;
height: 28px;
border-radius: 50%;
background: var(--wc-blue);
display: flex;
align-items: center;
justify-content: center;
font-weight: 700;
font-size: 12px;
}

.logout-btn {
background: transparent;
color: var(--muted);
border: none;
cursor: pointer;
font-size: 16px;
padding: 0;
transition: color 0.3s ease;
}

.logout-btn:hover {
color: var(--danger);
}

/_ ════════════════════════════════════════
VIEW SWITCHING
════════════════════════════════════════ _/

.view {
display: none;
}

.view.active {
display: block;
}

/_ ════════════════════════════════════════
MAIN CONTENT
════════════════════════════════════════ _/

main {
max-width: 1200px;
margin: 40px auto;
padding: 0 20px;
}

.matches-list {
display: grid;
grid-template-columns: 1fr;
gap: 20px;
}

.section-title {
font-family: "Barlow Condensed", sans-serif;
font-size: 28px;
font-weight: 700;
letter-spacing: 1px;
margin-bottom: 20px;
}

.title-accent {
color: var(--wc-red);
}

/_ ────────────────────────────────────────
MATCH CARDS (redesigned)
────────────────────────────────────────── _/

.group-matches {
display: grid;
grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
gap: 16px;
}

.match-card {
background:
linear-gradient(
145deg,
rgba(12, 17, 24, 0.98) 0%,
rgba(6, 36, 24, 0.78) 100%
),
repeating-linear-gradient(
135deg,
rgba(255, 255, 255, 0.04) 0 1px,
transparent 1px 9px
);
border: 2px solid rgba(0, 209, 94, 0.32);
border-radius: 8px;
overflow: hidden;
transition: all 0.25s ease;
position: relative;
box-shadow: 0 18px 34px rgba(0, 0, 0, 0.26);
display: flex;
flex-direction: column;
height: 100%;
}

.match-card::before {
content: "";
position: absolute;
top: 0;
left: 0;
right: 0;
height: 3px;
background: linear-gradient(90deg, var(--wc-blue), var(--wc-red));
opacity: 0;
transition: opacity 0.25s ease;
}

.match-card.open:hover {
border-color: rgba(0, 209, 94, 0.6);
box-shadow: 0 12px 32px rgba(0, 209, 94, 0.2);
transform: translateY(-2px);
}

.match-card.open:hover::before {
opacity: 1;
}

.match-card.locked {
opacity: 0.72;
}

.match-card.live {
border-color: rgba(245, 158, 11, 0.5);
box-shadow: 0 0 20px rgba(245, 158, 11, 0.15);
}

.match-card.live::before {
background: linear-gradient(90deg, var(--warning), #f97316);
opacity: 1;
}

/_ ── Card Header ── _/
.mc-header {
display: flex;
align-items: flex-start;
justify-content: space-between;
gap: 14px;
padding: 16px 18px 12px;
border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.mc-meta {
display: flex;
flex-direction: column;
gap: 7px;
min-width: 0;
}

.mc-kickoff {
display: flex;
align-items: baseline;
gap: 8px;
font-size: 15px;
font-weight: 800;
color: var(--light);
letter-spacing: 0.3px;
}

.mc-venue {
display: grid;
grid-template-columns: auto 1fr;
column-gap: 8px;
row-gap: 1px;
color: var(--muted);
text-decoration: none;
letter-spacing: 0.2px;
line-height: 1.25;
max-width: 260px;
}

.mc-venue strong {
color: var(--light);
font-size: 13px;
font-weight: 900;
}

.mc-venue span:last-child {
grid-column: 2;
font-size: 12px;
}

.mc-venue:hover strong,
.mc-venue:focus-visible strong {
color: var(--wc-blue);
text-decoration: underline;
}

.meta-label {
font-family: var(--font-ggo-display);
font-size: 11px;
font-weight: 900;
color: var(--wc-blue);
text-transform: uppercase;
letter-spacing: 0.8px;
}

.mc-badge {
display: inline-flex;
align-items: center;
gap: 5px;
font-size: 10px;
font-weight: 700;
padding: 4px 10px;
border-radius: 999px;
border: 1px solid;
white-space: nowrap;
letter-spacing: 0.5px;
text-transform: uppercase;
}

.mc-badge.open {
color: var(--success);
border-color: rgba(16, 185, 129, 0.4);
background: rgba(16, 185, 129, 0.08);
}

.mc-badge.locked {
color: #94a3b8;
border-color: rgba(148, 163, 184, 0.3);
background: rgba(148, 163, 184, 0.07);
}

.mc-badge.live {
color: var(--warning);
border-color: rgba(245, 158, 11, 0.4);
background: rgba(245, 158, 11, 0.1);
animation: blink 1.5s infinite;
}

.live-dot {
width: 7px;
height: 7px;
border-radius: 50%;
background: var(--warning);
flex-shrink: 0;
}

/_ ── Card Body ── _/
.mc-body {
display: grid;
grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
align-items: center;
column-gap: clamp(10px, 2vw, 18px);
padding: 24px 18px 22px;
flex-grow: 1;
}

.mc-team {
display: flex;
flex-direction: column;
align-items: center;
gap: 7px;
min-width: 0;
}

.mc-team:first-child {
align-items: flex-end;
text-align: right;
}

.mc-team:last-child {
align-items: flex-start;
text-align: left;
}

.team-mark {
width: 62px;
height: 44px;
display: grid;
place-items: center;
background: linear-gradient(180deg, #f8fff9 0%, #dff8e8 100%);
color: #07120c;
border: 2px solid rgba(0, 209, 94, 0.72);
border-radius: 6px;
font-family: var(--font-ggo-display);
font-size: 22px;
font-weight: 900;
box-shadow: 0 10px 18px rgba(0, 0, 0, 0.25);
}

.mc-name {
font-family: var(--font-ggo-display);
font-size: 16px;
font-weight: 900;
text-align: center;
color: var(--light);
letter-spacing: 0.2px;
line-height: 1.02;
max-width: 130px;
text-transform: uppercase;
}

.mc-middle {
display: flex;
flex-direction: column;
align-items: center;
gap: 4px;
min-width: 60px;
padding-inline: 2px;
}

.mc-result-block {
display: flex;
flex-direction: column;
align-items: center;
gap: 3px;
text-align: center;
}

.mc-result-grid {
display: grid;
grid-template-columns: repeat(2, minmax(0, 1fr));
gap: 8px;
width: min(100%, 220px);
}

.mc-result-grid .mc-result-block {
padding: 9px 8px 8px;
border-radius: 10px;
background: rgba(255, 255, 255, 0.04);
border: 1px solid rgba(255, 255, 255, 0.07);
}

.mc-result-actual {
box-shadow: inset 0 0 0 1px rgba(0, 209, 94, 0.12);
}

.mc-result-prediction {
box-shadow: inset 0 0 0 1px rgba(77, 132, 255, 0.12);
}

.mc-result-prediction.no-pick {
opacity: 0.72;
border-style: dashed;
}

.mc-result-prediction.has-pick {
background: rgba(77, 132, 255, 0.08);
}

.mc-result-label {
font-size: 9px;
font-weight: 700;
color: var(--muted);
text-transform: uppercase;
letter-spacing: 0.6px;
}

.mc-pred-score {
font-family: "Barlow Condensed", sans-serif;
font-size: 21px;
font-weight: 800;
color: rgba(255, 255, 255, 0.8);
min-height: 1em;
}

.mc-actual-score {
font-family: "Barlow Condensed", sans-serif;
font-size: 23px;
font-weight: 800;
color: var(--light);
min-height: 1em;
}

.match-card.live .mc-actual-score {
color: var(--warning);
text-shadow: 0 0 8px rgba(245, 158, 11, 0.6);
}

.mc-pick-line {
font-size: 10px;
color: var(--muted);
letter-spacing: 0.3px;
}

.mc-vs {
font-family: var(--font-ggo-display);
font-size: 22px;
font-weight: 900;
color: rgba(255, 255, 255, 0.34);
letter-spacing: 1px;
padding-inline: 4px;
}

.mc-result-score {
font-family: "Barlow Condensed", sans-serif;
font-size: 26px;
font-weight: 800;
color: var(--light);
letter-spacing: 1px;
display: flex;
align-items: center;
gap: 4px;
}

.mc-result-score--sub {
font-size: 18px;
color: rgba(255, 255, 255, 0.82);
}

.mc-result-meta {
font-family: var(--font-ggo-body);
font-size: 10px;
color: var(--muted);
text-transform: uppercase;
letter-spacing: 0.5px;
}

.mc-status-line {
display: flex;
align-items: center;
gap: 8px;
font-family: var(--font-ggo-body);
font-size: 11px;
color: var(--muted);
}

.status-token {
padding: 3px 7px;
border-radius: 999px;
border: 1px solid rgba(0, 209, 94, 0.25);
color: var(--success);
font-size: 9px;
font-weight: 700;
letter-spacing: 0.8px;
}

.status-token.open-token {
background: rgba(255, 255, 255, 0.08);
border-color: rgba(255, 255, 255, 0.2);
color: var(--muted);
}

.mc-dash {
color: var(--muted);
font-size: 20px;
}

.mc-points {
font-family: "Barlow Condensed", sans-serif;
font-size: 20px;
font-weight: 800;
padding: 4px 10px;
border-radius: 8px;
display: flex;
align-items: baseline;
gap: 2px;
line-height: 1;
}

.mc-points span {
font-size: 10px;
font-weight: 600;
opacity: 0.8;
letter-spacing: 0.5px;
}

.pts-exact {
background: rgba(255, 215, 0, 0.15);
color: #ffd700;
border: 1px solid rgba(255, 215, 0, 0.3);
}
.pts-good {
background: rgba(16, 185, 129, 0.15);
color: var(--success);
border: 1px solid rgba(16, 185, 129, 0.3);
}
.pts-partial {
background: rgba(245, 158, 11, 0.15);
color: var(--warning);
border: 1px solid rgba(245, 158, 11, 0.3);
}
.pts-zero {
background: rgba(239, 68, 68, 0.12);
color: var(--danger);
border: 1px solid rgba(239, 68, 68, 0.25);
}

/_ Score input redesign _/
.score-input {
width: 64px;
height: 52px;
padding: 8px 4px;
border: 2px solid rgba(0, 209, 94, 0.35);
border-radius: 10px;
background: rgba(0, 0, 0, 0.4);
color: var(--light);
text-align: center;
font-family: "Barlow Condensed", sans-serif;
font-size: 26px;
font-weight: 800;
transition: all 0.2s ease;
-moz-appearance: textfield;
appearance: textfield;
}

.score-input.editable:hover,
.score-input.editable:focus {
border-color: var(--wc-blue);
background: rgba(0, 209, 94, 0.12);
box-shadow: 0 0 0 3px rgba(0, 209, 94, 0.15);
outline: none;
}

.score-input::-webkit-outer-spin-button,
.score-input::-webkit-inner-spin-button {
-webkit-appearance: none;
}

.score-input:disabled {
cursor: not-allowed;
opacity: 0.45;
border-color: rgba(255, 255, 255, 0.1);
}

/_ ── Card Footer ── _/
.mc-footer {
padding: 10px 16px 14px;
border-top: 1px solid rgba(255, 255, 255, 0.06);
display: flex;
flex-direction: column;
gap: 8px;
}

.score-comparison {
display: flex;
justify-content: space-between;
font-size: 11px;
color: var(--muted);
}

.score-comparison strong {
color: var(--light);
}

.status-token,
.team-code {
display: inline-grid;
place-items: center;
min-width: 34px;
height: 22px;
padding: 0 6px;
margin-right: 8px;
border-radius: 4px;
background: rgba(0, 209, 94, 0.14);
border: 1px solid rgba(0, 209, 94, 0.38);
color: var(--wc-blue);
font-family: var(--font-ggo-display);
font-size: 13px;
font-weight: 900;
line-height: 1;
}

.status-token {
min-width: auto;
height: 20px;
margin-right: 0;
font-size: 10px;
}

/_ ────────────────────────────────────────
GROUP STANDINGS
────────────────────────────────────────── _/

#group-standings {
display: grid;
grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
gap: 20px;
}

.group-table {
background: rgba(0, 209, 94, 0.05);
border: 1px solid rgba(0, 209, 94, 0.2);
border-radius: 10px;
overflow: hidden;
min-width: 0;
}

.group-table h3 {
padding: 12px;
}

.group-header {
background: linear-gradient(90deg, var(--wc-blue) 0%, #00b359 100%);
padding: 12px;
font-weight: 700;
letter-spacing: 0.5px;
text-align: center;
}

.group-standings-table {
width: 100%;
border-collapse: collapse;
font-size: 12px;
}

.group-standings-table th {
padding: 10px;
text-align: center;
border-bottom: 1px solid rgba(0, 209, 94, 0.2);
color: var(--muted);
font-weight: 600;
}

.group-standings-table td {
padding: 10px;
border-bottom: 1px solid rgba(0, 209, 94, 0.1);
}

.group-standings-table tr:last-child td {
border-bottom: none;
}

.team-rank {
text-align: center;
font-weight: 700;
}

────────────────────────────────────────
LEADERBOARD
────────────────────────────────────────── _/

#view-leaderboard {
display: flex;
flex-direction: column;
align-items: center;
}

#view-leaderboard .section-title {
width: 100%;
max-width: 820px;
}

.leaderboard-table {
width: 100%;
max-width: 820px;
margin: 0 auto;
border-collapse: collapse;
background: rgba(0, 209, 94, 0.04);
border: 1px solid rgba(0, 209, 94, 0.2);
border-radius: 12px;
overflow: hidden;
box-shadow: 0 8px 28px rgba(0, 0, 0, 0.22);
}

.leaderboard-table th {
background: linear-gradient(90deg, var(--wc-blue) 0%, #00b359 100%);
padding: 14px 18px;
text-align: center;
font-weight: 700;
letter-spacing: 0.6px;
text-transform: uppercase;
font-size: 11px;
color: #fff;
}

.leaderboard-table th:nth-child(2) {
text-align: left;
}

.leaderboard-table td {
padding: 14px 18px;
border-bottom: 1px solid rgba(0, 209, 94, 0.08);
text-align: center;
vertical-align: middle;
}

.leaderboard-table td:nth-child(2) {
text-align: left;
}

.leaderboard-table tr:last-child td {
border-bottom: none;
}

.leaderboard-table tbody tr:hover {
background: rgba(0, 209, 94, 0.1);
}

.leaderboard-table tbody tr.current-user {
background: rgba(0, 179, 89, 0.12);
}

.table-empty {
text-align: center;
padding: 40px;
color: var(--muted);
}

.rank-badge {
background: var(--wc-red);
color: white;
border-radius: 50%;
width: 30px;
height: 30px;
display: flex;
align-items: center;
justify-content: center;
font-weight: 700;
margin: 0 auto;
}

.rank-badge.gold {
background: #ffd700;
color: #333;
}

.rank-badge.silver {
background: #c0c0c0;
color: #333;
}

.rank-badge.bronze {
background: #cd7f32;
color: white;
}

.player-info {
text-align: left;
display: flex;
align-items: center;
gap: 10px;
}

.player-avatar {
width: 32px;
height: 32px;
border-radius: 50%;
background: var(--wc-blue);
display: flex;
align-items: center;
justify-content: center;
font-weight: 700;
font-size: 12px;
}

.player-name {
font-weight: 600;
}
/_ ════════════════════════════════════════
MATCH DETAIL DRAWER
Append to bottom of style.css
════════════════════════════════════════ _/

/_ ── Drawer overlay ── _/
.match-drawer-overlay {
position: fixed;
inset: 0;
background: rgba(0, 0, 0, 0);
z-index: 500;
pointer-events: none;
transition: background 0.3s ease;
}
.match-drawer-overlay.open {
background: rgba(0, 0, 0, 0.65);
pointer-events: all;
}

/_ ── Drawer panel ── _/
.match-drawer {
position: fixed;
top: 0;
right: 0;
bottom: 0;
width: min(480px, 100vw);
background:
linear-gradient(
160deg,
rgba(6, 10, 18, 0.99) 0%,
rgba(4, 22, 14, 0.97) 100%
),
repeating-linear-gradient(
135deg,
rgba(255, 255, 255, 0.03) 0 1px,
transparent 1px 10px
);
border-left: 2px solid rgba(0, 209, 94, 0.28);
box-shadow: -12px 0 40px rgba(0, 0, 0, 0.5);
transform: translateX(100%);
transition: transform 0.32s cubic-bezier(0.4, 0, 0.2, 1);
z-index: 501;
display: flex;
flex-direction: column;
overflow: hidden;
}
.match-drawer.open {
transform: translateX(0);
}

/_ ── Drawer top accent ── _/
.match-drawer::before {
content: "";
position: absolute;
top: 0;
left: 0;
right: 0;
height: 3px;
background: linear-gradient(90deg, var(--wc-blue), var(--wc-red));
}

/_ ── Drawer header ── _/
.drawer-header {
display: flex;
align-items: center;
justify-content: space-between;
padding: 22px 22px 16px;
border-bottom: 1px solid rgba(255, 255, 255, 0.07);
flex-shrink: 0;
}
.drawer-header-meta {
display: flex;
flex-direction: column;
gap: 3px;
}
.drawer-round {
font-family: var(--font-ggo-display);
font-size: 13px;
font-weight: 700;
color: var(--wc-blue);
text-transform: uppercase;
letter-spacing: 0.6px;
}
.drawer-date {
font-size: 12px;
color: var(--muted);
}
.drawer-close {
width: 36px;
height: 36px;
display: grid;
place-items: center;
background: rgba(255, 255, 255, 0.06);
border: 1px solid rgba(255, 255, 255, 0.1);
border-radius: 8px;
color: var(--muted);
cursor: pointer;
transition: all 0.2s;
flex-shrink: 0;
}
.drawer-close:hover {
background: rgba(239, 68, 68, 0.15);
border-color: rgba(239, 68, 68, 0.3);
color: var(--danger);
}

/_ ── Scoreline hero ── _/
.drawer-scoreline {
padding: 28px 22px 22px;
display: grid;
grid-template-columns: 1fr auto 1fr;
align-items: center;
gap: 12px;
border-bottom: 1px solid rgba(255, 255, 255, 0.07);
flex-shrink: 0;
}
.drawer-team {
display: flex;
flex-direction: column;
align-items: center;
gap: 8px;
text-align: center;
}
.drawer-team-badge {
width: 56px;
height: 40px;
display: grid;
place-items: center;
background: linear-gradient(180deg, #f8fff9 0%, #dff8e8 100%);
color: #07120c;
border: 2px solid rgba(0, 209, 94, 0.72);
border-radius: 6px;
font-family: var(--font-ggo-display);
font-size: 19px;
font-weight: 900;
}
.drawer-team-name {
font-family: var(--font-ggo-display);
font-size: 14px;
font-weight: 900;
text-transform: uppercase;
letter-spacing: 0.3px;
color: var(--light);
line-height: 1.1;
max-width: 110px;
}
.drawer-score-block {
display: flex;
flex-direction: column;
align-items: center;
gap: 6px;
}
.drawer-score {
font-family: var(--font-ggo-display);
font-size: 52px;
font-weight: 900;
color: var(--light);
letter-spacing: 2px;
line-height: 1;
}
.drawer-score.live-score {
color: var(--warning);
text-shadow: 0 0 20px rgba(245, 158, 11, 0.4);
}
.drawer-status-chip {
display: inline-flex;
align-items: center;
gap: 5px;
padding: 3px 10px;
border-radius: 999px;
font-size: 10px;
font-weight: 700;
text-transform: uppercase;
letter-spacing: 0.5px;
border: 1px solid;
}
.drawer-status-chip.ft {
color: var(--muted);
border-color: rgba(160, 160, 160, 0.3);
}
.drawer-status-chip.live {
color: var(--warning);
border-color: rgba(245, 158, 11, 0.4);
background: rgba(245, 158, 11, 0.08);
animation: blink 1.5s infinite;
}
.drawer-status-chip.ns {
color: var(--success);
border-color: rgba(16, 185, 129, 0.35);
}

/_ ── Scrollable body ── _/
.drawer-body {
flex: 1;
overflow-y: auto;
padding: 0 22px 30px;
scrollbar-width: thin;
scrollbar-color: rgba(0, 209, 94, 0.3) transparent;
}
.drawer-body::-webkit-scrollbar {
width: 4px;
}
.drawer-body::-webkit-scrollbar-thumb {
background: rgba(0, 209, 94, 0.3);
border-radius: 2px;
}

/_ ── Section label ── _/
.drawer-section-label {
font-family: var(--font-ggo-display);
font-size: 12px;
font-weight: 900;
text-transform: uppercase;
letter-spacing: 0.8px;
color: var(--wc-blue);
padding: 18px 0 10px;
border-bottom: 1px solid rgba(0, 209, 94, 0.15);
margin-bottom: 12px;
}

/_ ── Goalscorer timeline ── _/
.scorer-timeline {
display: flex;
flex-direction: column;
gap: 0;
}
.scorer-row {
display: grid;
grid-template-columns: 1fr 48px 1fr;
align-items: center;
min-height: 34px;
position: relative;
}
.scorer-row::after {
content: "";
position: absolute;
left: 50%;
top: 50%;
transform: translate(-50%, -50%);
width: 1px;
height: 100%;
background: rgba(0, 209, 94, 0.12);
}
.scorer-name {
font-size: 13px;
font-weight: 600;
color: var(--light);
padding: 7px 10px 7px 0;
text-align: right;
line-height: 1.2;
}
.scorer-name.away-name {
text-align: left;
padding: 7px 0 7px 10px;
}
.scorer-name.empty {
opacity: 0;
}
.scorer-minute {
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
z-index: 1;
gap: 1px;
}
.scorer-minute-pill {
background: rgba(0, 209, 94, 0.12);
border: 1px solid rgba(0, 209, 94, 0.28);
border-radius: 999px;
font-family: var(--font-ggo-display);
font-size: 11px;
font-weight: 900;
color: var(--wc-blue);
padding: 1px 7px;
white-space: nowrap;
letter-spacing: 0.3px;
}
.scorer-ball {
font-size: 11px;
line-height: 1;
}
.no-scorers {
font-size: 12px;
color: var(--muted);
text-align: center;
padding: 16px 0;
font-style: italic;
}

/_ ── Your prediction block ── _/
.drawer-prediction {
display: flex;
align-items: center;
justify-content: space-between;
padding: 14px 16px;
background: rgba(0, 209, 94, 0.06);
border: 1px solid rgba(0, 209, 94, 0.18);
border-radius: 10px;
gap: 12px;
}
.drawer-pred-label {
font-size: 11px;
font-weight: 700;
text-transform: uppercase;
letter-spacing: 0.5px;
color: var(--muted);
margin-bottom: 4px;
}
.drawer-pred-score {
font-family: var(--font-ggo-display);
font-size: 26px;
font-weight: 900;
color: var(--light);
letter-spacing: 1px;
}
.drawer-pred-score.no-pred {
font-family: var(--font-ggo-body);
font-size: 13px;
font-weight: 400;
color: var(--muted);
}
.drawer-pred-pts {
font-family: var(--font-ggo-display);
font-size: 28px;
font-weight: 900;
padding: 6px 14px;
border-radius: 10px;
display: flex;
align-items: baseline;
gap: 3px;
flex-shrink: 0;
}
.drawer-pred-pts sub {
font-size: 11px;
font-weight: 600;
opacity: 0.75;
}

/_ ── Venue info ── _/
.drawer-venue {
display: flex;
flex-direction: column;
gap: 4px;
padding: 12px 0;
}
.drawer-venue-name {
font-size: 14px;
font-weight: 600;
color: var(--light);
}
.drawer-venue-city {
font-size: 12px;
color: var(--muted);
}

/_ ── Result card clickable cursor ── _/
.result-card {
cursor: pointer;
}
.result-card:hover .match-teams {
opacity: 0.85;
}

/_ ── Mobile ── _/
@media (max-width: 480px) {
.match-drawer {
width: 100vw;
border-left: none;
border-top: 2px solid rgba(0, 209, 94, 0.28);
top: auto;
height: 90vh;
border-radius: 16px 16px 0 0;
transform: translateY(100%);
}
.match-drawer.open {
transform: translateY(0);
}
.drawer-score {
font-size: 42px;
}
}
/_ ────────────────────────────────────────
RESULTS VIEW
────────────────────────────────────────── _/

.result-card {
background:
linear-gradient(
145deg,
rgba(12, 17, 24, 0.98) 0%,
rgba(6, 36, 24, 0.78) 100%
),
repeating-linear-gradient(
135deg,
rgba(255, 255, 255, 0.04) 0 1px,
transparent 1px 9px
);
border: 2px solid rgba(0, 209, 94, 0.32);
border-radius: 8px;
padding: 20px;
transition: all 0.25s ease;
position: relative;
box-shadow: 0 18px 34px rgba(0, 0, 0, 0.26);
}

.result-card::before {
content: "";
position: absolute;
top: 0;
left: 0;
right: 0;
height: 3px;
background: linear-gradient(90deg, var(--wc-blue), var(--wc-red));
opacity: 0;
transition: opacity 0.25s ease;
}

.result-card:hover {
border-color: rgba(0, 209, 94, 0.6);
box-shadow: 0 12px 32px rgba(0, 209, 94, 0.2);
transform: translateY(-2px);
}

.result-card:hover::before {
opacity: 1;
}

.result-card .match-date {
font-family: var(--font-ggo-body);
font-size: 13px;
font-weight: 500;
color: var(--muted);
text-align: center;
margin-bottom: 12px;
}

.match-teams {
display: flex;
align-items: center;
justify-content: space-between;
gap: 16px;
margin: 16px 0;
}

.result-card .team {
flex: 1;
display: flex;
align-items: center;
min-width: 0;
}

.result-card .team:first-child {
justify-content: flex-end;
text-align: right;
}

.result-card .team:last-child {
justify-content: flex-start;
text-align: left;
}

.result-card .team-name {
font-family: var(--font-ggo-display);
font-size: 18px;
font-weight: 900;
text-transform: uppercase;
letter-spacing: 0.5px;
color: var(--light);
}

.result-card .team:first-child .team-name {
display: flex;
align-items: center;
gap: 10px;
}

.result-card .team:last-child .team-name {
display: flex;
align-items: center;
flex-direction: row-reverse;
gap: 10px;
}

.result-card .team-code {
margin-right: 0;
}

.inline-flag-img {
width: 40px;
height: 27px;
object-fit: cover;
border-radius: 2px;
border: 1px solid rgba(255, 255, 255, 0.2);
flex-shrink: 0;
}

.result-card .result-score {
font-family: "Barlow Condensed", sans-serif;
font-size: 32px;
font-weight: 800;
color: var(--light);
min-width: 80px;
text-align: center;
}

.result-card .result-status {
font-size: 11px;
font-weight: 700;
color: var(--warning);
text-align: center;
margin-top: 4px;
text-transform: uppercase;
letter-spacing: 0.5px;
}

.result-card .match-footer {
display: flex;
justify-content: space-between;
align-items: center;
border-top: 1px solid rgba(255, 255, 255, 0.06);
padding-top: 12px;
margin-top: 12px;
font-size: 13px;
color: var(--muted);
}

.result-card .match-footer strong {
color: var(--wc-blue);
font-weight: 700;
}

/_ ────────────────────────────────────────
BRACKET VIEW
────────────────────────────────────────── _/

.champion-section {
text-align: center;
background: linear-gradient(
135deg,
rgba(0, 209, 94, 0.1) 0%,
rgba(0, 179, 89, 0.05) 100%
);
border: 2px solid var(--wc-red);
border-radius: 8px;
padding: 30px;
margin-bottom: 40px;
}

.champion-trophy {
width: 82px;
height: 82px;
display: grid;
place-items: center;
margin: 0 auto 15px;
border-radius: 50%;
background: #f8fff9;
color: #06120c;
border: 3px solid var(--wc-blue);
font-family: var(--font-ggo-display);
font-size: 30px;
font-weight: 900;
}

.champion-title {
font-family: "Barlow Condensed", sans-serif;
font-size: 18px;
font-weight: 700;
color: var(--wc-red);
margin-bottom: 10px;
letter-spacing: 1px;
}

.champion-name {
font-size: 24px;
font-weight: 700;
margin-bottom: 8px;
}

.champion-subtitle {
font-size: 12px;
color: var(--muted);
}

.bracket-container {
overflow-x: auto;
margin-bottom: 40px;
padding-bottom: 12px;
}

.vertical-bracket {
display: flex;
align-items: stretch;
gap: 0;
min-width: 1120px;
padding: 20px 8px 28px;
}

.bracket-round {
width: 190px;
display: flex;
flex-direction: column;
gap: 14px;
padding: 0 22px 0 0;
position: relative;
}

.bracket-round h3 {
min-height: 44px;
font-family: var(--font-ggo-display);
font-size: 18px;
font-weight: 900;
text-transform: uppercase;
color: var(--wc-blue);
letter-spacing: 0.4px;
}

.bracket-stack {
display: grid;
gap: 18px;
align-content: space-around;
height: 100%;
}

.bracket-round-2 .bracket-stack {
padding-top: 36px;
padding-bottom: 36px;
}

.bracket-round-3 .bracket-stack {
padding-top: 82px;
padding-bottom: 82px;
}

.bracket-round-4 .bracket-stack {
padding-top: 134px;
padding-bottom: 134px;
}

.bracket-round-5 .bracket-stack {
padding-top: 188px;
padding-bottom: 188px;
}

.bracket-round-6 .bracket-stack {
padding-top: 242px;
padding-bottom: 242px;
}

.bracket-match {
position: relative;
background: linear-gradient(
180deg,
rgba(12, 18, 24, 0.98),
rgba(7, 33, 22, 0.92)
);
border: 2px solid rgba(0, 209, 94, 0.36);
border-radius: 6px;
padding: 8px;
min-height: 92px;
font-size: 12px;
box-shadow: 0 12px 24px rgba(0, 0, 0, 0.24);
}

.bracket-round:not(:last-child) .bracket-match::after {
content: "";
position: absolute;
top: 50%;
right: -24px;
width: 24px;
height: 2px;
background: rgba(0, 209, 94, 0.58);
}

.bracket-round:not(:last-child) .bracket-match::before {
content: "";
position: absolute;
top: calc(50% - 22px);
right: -24px;
width: 2px;
height: 44px;
background: rgba(0, 209, 94, 0.35);
}

.bracket-seed {
display: grid;
grid-template-columns: 42px 1fr;
align-items: center;
gap: 7px;
min-height: 28px;
color: var(--light);
font-weight: 800;
text-align: left;
}

.bracket-match strong {
display: block;
margin: 5px 0;
color: var(--wc-blue);
font-family: var(--font-ggo-display);
font-size: 18px;
font-weight: 900;
text-align: center;
text-transform: uppercase;
}

.admin-grid {
display: grid;
grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
gap: 16px;
}

.admin-card {
background: rgba(0, 209, 94, 0.08);
border: 1px solid rgba(0, 209, 94, 0.25);
border-radius: 10px;
padding: 18px;
}

.admin-card strong {
display: block;
font-family: "Barlow Condensed", sans-serif;
font-size: 30px;
margin-bottom: 4px;
}

.admin-card span {
color: var(--muted);
font-size: 13px;
}

.admin-section {
margin-top: 24px;
}

.admin-section h3 {
font-family: var(--font-ggo-display);
font-size: 20px;
letter-spacing: 0.5px;
margin-bottom: 14px;
}

.request-list {
display: grid;
gap: 12px;
}

.request-card {
display: flex;
justify-content: space-between;
gap: 16px;
align-items: flex-start;
padding: 16px;
border: 1px solid rgba(0, 209, 94, 0.22);
border-radius: 8px;
background: rgba(0, 209, 94, 0.05);
}

.request-card strong {
display: block;
font-size: 15px;
margin-bottom: 2px;
}

.request-card p,
.request-card small {
color: var(--muted);
font-size: 12px;
}

.request-actions {
display: flex;
gap: 8px;
flex-shrink: 0;
}

.request-actions .btn-primary,
.request-actions .btn-secondary {
width: auto;
min-width: 96px;
margin-top: 0;
}

.empty-state.compact {
padding: 18px 12px;
}
.player-name-link {
color: inherit;
text-decoration: none;
transition: color 0.2s;
}
.player-name-link:hover {
color: var(--wc-blue);
text-decoration: underline;
}

/_ ════════════════════════════════════════
MODAL
════════════════════════════════════════ _/

.modal-overlay {
display: none;
position: fixed;
top: 0;
left: 0;
right: 0;
bottom: 0;
background: rgba(0, 0, 0, 0.7);
z-index: 1000;
align-items: center;
justify-content: center;
}

.modal-overlay.show {
display: flex;
}

.modal {
background: var(--dark);
border: 1px solid rgba(0, 209, 94, 0.3);
border-radius: 12px;
padding: 30px;
max-width: 400px;
width: 90%;
box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
}

.account-modal {
max-width: 460px;
}

.modal-copy {
color: var(--muted);
font-size: 13px;
line-height: 1.5;
margin-bottom: 18px;
}

.modal-header {
display: flex;
justify-content: space-between;
align-items: center;
margin-bottom: 20px;
}

.modal-header h2 {
font-family: "Barlow Condensed", sans-serif;
font-size: 20px;
font-weight: 700;
}

.close-modal {
background: transparent;
color: var(--muted);
border: none;
font-size: 24px;
cursor: pointer;
transition: color 0.3s ease;
width: 44px;
height: 44px;
display: grid;
place-items: center;
flex-shrink: 0;
}

.close-modal:hover {
color: var(--light);
}

.btn-secondary {
width: 100%;
padding: 10px 20px;
background: transparent;
color: var(--light);
border: 1px solid rgba(0, 209, 94, 0.3);
border-radius: 8px;
font-size: 13px;
cursor: pointer;
transition: all 0.3s ease;
margin-top: 10px;
text-transform: uppercase;
font-family: var(--font-ggo-display);
font-weight: 900;
letter-spacing: 0.5px;
}

.login-ghost-btn {
margin-top: 12px;
}

.btn-secondary:hover {
border-color: var(--wc-blue);
background: rgba(0, 209, 94, 0.1);
}

/_ ════════════════════════════════════════
TOAST NOTIFICATION
════════════════════════════════════════ _/

.toast {
position: fixed;
bottom: 30px;
left: 50%;
transform: translateX(-50%) translateY(20px);
background: #10b981;
color: white;
padding: 12px 24px;
border-radius: 8px;
font-size: 14px;
font-weight: 600;
opacity: 0;
pointer-events: none;
transition:
opacity 0.25s ease,
transform 0.25s ease;
z-index: 9999;
white-space: nowrap;
}

.toast.show {
opacity: 1;
transform: translateX(-50%) translateY(0);
}

.toast.toast-error {
background: #ef4444;
}

.toast.toast-warning {
background: #f59e0b;
}

/_ ════════════════════════════════════════
RESPONSIVE
════════════════════════════════════════ _/

/_ Tablet (900px and below) _/
@media (max-width: 900px) {
header {
padding: 12px 20px;
gap: 12px;
}

.sync-status {
display: none; /_ hide verbose "Live - HH:MM" on smaller screens _/
}

.sync-container {
gap: 12px;
}
}

/_ Mobile (768px and below) _/
@media (max-width: 768px) {
header {
flex-direction: column;
align-items: stretch;
gap: 10px;
padding: 10px 12px;
}

.header-top {
flex-wrap: wrap;
justify-content: space-between;
align-items: center;
width: 100%;
gap: 10px;
}

.logo {
flex: 1 1 100%;
min-width: 0;
}

.wc-logo {
display: block;
max-width: 42px;
object-fit: contain;
}

.logo img.header-logo {
height: 34px;
flex-shrink: 0;
}

.logo img.header-logo.wc-logo {
height: 34px;
}

.logo-text h1 {
font-size: 16px;
}

.logo-text p {
font-size: 10px;
}

.logo-divider {
height: 24px;
}

#main-nav {
width: 100%;
gap: 8px;
justify-content: flex-start;
overflow-x: auto;
flex-wrap: nowrap;
padding-bottom: 4px;
scrollbar-width: none;
-ms-overflow-style: none;
scroll-snap-type: x proximity;
-webkit-overflow-scrolling: touch;
}

#main-nav::-webkit-scrollbar {
display: none;
}

.nav-btn {
flex: 0 0 auto;
padding: 10px 14px;
}

.sync-container {
justify-content: space-between;
width: 100%;
gap: 10px;
}

.sync-status {
display: flex;
}

.matches-filter {
overflow-x: auto;
flex-wrap: nowrap;
padding-bottom: 4px;
scrollbar-width: none;
-ms-overflow-style: none;
-webkit-overflow-scrolling: touch;
}

.matches-filter::-webkit-scrollbar {
display: none;
}

.filter-btn {
flex: 0 0 auto;
}

main {
margin: 20px auto;
padding: 0 14px 24px;
}

.section-title {
font-size: 22px;
}

.matches-list {
grid-template-columns: 1fr;
}
#group-standings {
grid-template-columns: 1fr;
}

.group-table {
border-radius: 12px;
}

.leaderboard-table {
display: block;
background: transparent;
border: 0;
}

.leaderboard-table thead {
display: none;
}

.leaderboard-table tbody {
display: block;
}

.leaderboard-table tr {
display: grid;
gap: 8px;
padding: 14px;
margin-bottom: 12px;
border: 1px solid rgba(0, 209, 94, 0.2);
border-radius: 12px;
background: rgba(0, 209, 94, 0.05);
}

.leaderboard-table td {
display: flex;
justify-content: space-between;
align-items: center;
gap: 12px;
padding: 0;
border: 0;
text-align: right;
}

.leaderboard-table td::before,
.group-standings-table td::before {
content: attr(data-label);
color: var(--muted);
font-size: 10px;
font-weight: 700;
letter-spacing: 0.6px;
text-transform: uppercase;
}

.leaderboard-table td[data-label="Rank"],
.group-standings-table td[data-label="#"] {
justify-content: flex-start;
}

.leaderboard-table td[data-label="Player"],
.group-standings-table td[data-label="Team"] {
text-align: left;
}

.leaderboard-table td[data-label="Player"] .player-info,
.group-standings-table td[data-label="Team"] .team-name {
width: 100%;
}

.leaderboard-table td strong {
font-size: 16px;
}

.group-standings-table {
display: block;
}

.group-standings-table thead {
display: none;
}

.group-standings-table tbody {
display: block;
}

.group-standings-table tr {
display: grid;
gap: 8px;
padding: 12px 14px;
margin-bottom: 10px;
border: 1px solid rgba(0, 209, 94, 0.2);
border-radius: 12px;
background: rgba(0, 209, 94, 0.05);
}

.group-standings-table td {
display: flex;
justify-content: space-between;
align-items: center;
gap: 12px;
padding: 0;
border: 0;
text-align: right;
}

.match-card {
border-radius: 14px;
}

.mc-header {
flex-direction: column;
gap: 10px;
padding: 14px;
}

.mc-badge {
align-self: flex-start;
}

.mc-body {
grid-template-columns: 1fr;
gap: 14px;
padding: 16px 14px 18px;
}

.mc-team,
.mc-team:first-child,
.mc-team:last-child {
align-items: center;
text-align: center;
}

.mc-name {
max-width: none;
font-size: 15px;
}

.mc-middle {
min-width: 0;
}

.mc-result-grid {
width: 100%;
}

.score-input {
width: 72px;
height: 48px;
font-size: 24px;
}

.result-card {
border-radius: 14px;
}

.result-card .match-teams {
flex-direction: column;
gap: 10px;
}

.result-card .team,
.result-card .team:first-child,
.result-card .team:last-child {
justify-content: center;
text-align: center;
}

.result-card .team:first-child .team-name,
.result-card .team:last-child .team-name {
flex-direction: row;
}

.result-card .result-score {
min-width: 0;
font-size: 28px;
}

.result-card .match-footer {
flex-direction: column;
align-items: flex-start;
gap: 6px;
}

.bracket-container {
margin-inline: -14px;
padding-inline: 14px;
}

.vertical-bracket {
min-width: 960px;
}

.modal-overlay {
padding: 12px;
align-items: flex-start;
overflow-y: auto;
}

.modal {
width: min(100%, 560px);
padding: 22px 18px;
}
}

/_ Small Mobile (480px and below) _/
@media (max-width: 480px) {
header {
padding: 10px 10px 8px;
}

.logo img.header-logo {
height: 28px;
}

.logo img.header-logo.wc-logo {
height: 30px;
max-width: 34px;
}

.logo-text h1 {
font-size: 14px;
}

.logo-text p {
font-size: 10px;
}

.logo-divider {
height: 22px;
}

.nav-btn {
padding: 10px 12px;
font-size: 12px;
}

.login-logo .trophy {
width: min(170px, 62vw);
margin-bottom: 12px;
}

.user-pill {
font-size: 12px;
padding: 4px 8px 4px 4px;
}

#user-display-name {
display: none; /_ just show avatar on tiny screens _/
}

main {
margin: 16px auto;
padding: 0 12px;
}

.section-title {
font-size: 18px;
}

.mc-body {
padding: 14px 12px;
}

.mc-result-grid {
grid-template-columns: 1fr;
}

.mc-result-score {
font-size: 24px;
}

.mc-result-score--sub {
font-size: 16px;
}

.score-input {
width: 54px;
height: 46px;
font-size: 22px;
}

.champion-trophy {
width: 72px;
height: 72px;
font-size: 42px;
}

.champion-name {
font-size: 18px;
}

.result-card .match-date {
font-size: 12px;
}

.result-card .team-name {
font-size: 16px;
}

.result-card .result-score {
font-size: 26px;
}

.modal {
padding: 20px 16px;
}

.scoring-grid {
grid-template-columns: 1fr;
}
}

@media (hover: none), (pointer: coarse) {
.match-card.open:hover,
.result-card:hover,
.score-rule-card:hover,
.btn-primary:hover {
transform: none;
box-shadow: inherit;
}
}

/_ Rules Modal Styles _/
.rules-modal-content {
max-width: 550px !important;
max-height: 85vh;
overflow-y: auto;
scrollbar-width: thin;
scrollbar-color: var(--wc-blue) var(--dark);
}

.rules-modal-content::-webkit-scrollbar {
width: 6px;
}
.rules-modal-content::-webkit-scrollbar-track {
background: var(--dark);
}
.rules-modal-content::-webkit-scrollbar-thumb {
background-color: var(--wc-blue);
border-radius: 3px;
}

.welcome-text {
font-family: "DM Sans", sans-serif;
font-size: 14px;
line-height: 1.6;
color: var(--light);
margin-bottom: 20px;
}

.modal-section-title {
font-family: "Barlow Condensed", sans-serif;
font-size: 18px;
font-weight: 700;
text-transform: uppercase;
color: var(--wc-blue);
margin: 20px 0 10px 0;
letter-spacing: 0.5px;
border-bottom: 1px solid rgba(0, 209, 94, 0.2);
padding-bottom: 5px;
}

.rules-list {
list-style: none;
margin-bottom: 20px;
}

.rules-list li {
position: relative;
padding-left: 20px;
margin-bottom: 10px;
font-size: 13px;
line-height: 1.5;
color: #d1d5db;
}

.rules-list li::before {
content: "✦";
position: absolute;
left: 0;
color: var(--wc-blue);
}

.scoring-grid {
display: grid;
grid-template-columns: repeat(2, 1fr);
gap: 12px;
margin-bottom: 25px;
}

@media (max-width: 480px) {
.scoring-grid {
grid-template-columns: 1fr;
}
}

.score-rule-card {
background: rgba(255, 255, 255, 0.03);
border-radius: 10px;
padding: 12px 15px;
position: relative;
transition: all 0.3s ease;
}

.score-rule-card:hover {
background: rgba(255, 255, 255, 0.06);
transform: translateY(-2px);
}

.pts-val {
position: absolute;
top: 10px;
right: 12px;
font-family: "Barlow Condensed", sans-serif;
font-size: 18px;
font-weight: 800;
}

.score-rule-card strong {
display: block;
font-family: "DM Sans", sans-serif;
font-size: 13px;
font-weight: 600;
margin-bottom: 4px;
}

.score-rule-card p {
font-size: 11px;
color: var(--muted);
line-height: 1.4;
}

/_ Points classes for cards _/
.score-rule-card.pts-exact {
border: 1px solid rgba(255, 215, 0, 0.3);
}
.score-rule-card.pts-exact .pts-val {
color: #ffd700;
}
.score-rule-card.pts-exact strong {
color: #ffd700;
}

.score-rule-card.pts-good {
border: 1px solid rgba(0, 209, 94, 0.3);
}
.score-rule-card.pts-good .pts-val {
color: #00d15e;
}
.score-rule-card.pts-good strong {
color: #00d15e;
}

.score-rule-card.pts-partial {
border: 1px solid rgba(245, 158, 11, 0.3);
}
.score-rule-card.pts-partial .pts-val {
color: var(--warning);
}
.score-rule-card.pts-partial strong {
color: var(--warning);
}

.score-rule-card.pts-close-guess {
border: 1px solid rgba(0, 179, 89, 0.3);
}
.score-rule-card.pts-close-guess .pts-val {
color: #00b359;
}
.score-rule-card.pts-close-guess strong {
color: #00b359;
}

.start-playing-btn {
display: block;
margin: 15px auto 0 auto;
max-width: 200px;
box-shadow: 0 4px 15px rgba(0, 209, 94, 0.2);
}

.start-playing-btn:hover {
box-shadow: 0 6px 20px rgba(0, 209, 94, 0.4);
}

/_ ── LEADERBOARD MOBILE: compact card layout ──────────────────
Drop this at the bottom of style.css (replaces/overrides the
existing @media (max-width: 768px) leaderboard block).
────────────────────────────────────────────────────────────── _/

@media (max-width: 768px) {
/_ Wrapper becomes a plain stack _/
.leaderboard-table {
display: block;
background: transparent;
border: none;
box-shadow: none;
border-radius: 0;
}

.leaderboard-table thead {
display: none;
}

.leaderboard-table tbody {
display: flex;
flex-direction: column;
gap: 8px;
}

/_ Each row = a horizontal pill card _/
.leaderboard-table tr {
display: grid;
/_ rank | avatar+name | pts | exact | outcome _/
grid-template-columns: 36px 1fr 48px 36px 36px;
align-items: center;
gap: 0 10px;
padding: 10px 14px;
margin: 0;
border: 1px solid rgba(0, 209, 94, 0.2);
border-radius: 10px;
background: rgba(0, 209, 94, 0.05);
}

.leaderboard-table tr.current-user {
background: rgba(0, 179, 89, 0.13);
border-color: rgba(0, 209, 94, 0.45);
}

/_ All cells: no flex label trick — just show the value _/
.leaderboard-table td {
display: block;
padding: 0;
border: none;
text-align: center;
}

/_ Suppress the ::before data-label text _/
.leaderboard-table td::before {
display: none;
}

/_ Rank cell _/
.leaderboard-table td[data-label="Rank"] {
justify-self: center;
}

.rank-badge {
width: 28px;
height: 28px;
font-size: 13px;
}

/_ Player cell — left-aligned, takes all remaining space _/
.leaderboard-table td[data-label="Player"] {
text-align: left;
min-width: 0;
}

.player-info {
display: flex;
align-items: center;
gap: 8px;
min-width: 0;
}

.player-avatar {
width: 28px;
height: 28px;
font-size: 11px;
flex-shrink: 0;
}

.player-name {
font-size: 13px;
font-weight: 600;
white-space: nowrap;
overflow: hidden;
text-overflow: ellipsis;
}

/_ Stat cells — small labels above the number _/
.leaderboard-table td[data-label="Points"],
.leaderboard-table td[data-label="Exact"],
.leaderboard-table td[data-label="Outcome"] {
display: flex;
flex-direction: column;
align-items: center;
gap: 2px;
text-align: center;
}

.leaderboard-table td[data-label="Points"]::before,
.leaderboard-table td[data-label="Exact"]::before,
.leaderboard-table td[data-label="Outcome"]::before {
display: block;
font-size: 8px;
font-weight: 700;
letter-spacing: 0.5px;
text-transform: uppercase;
color: var(--muted);
line-height: 1;
}

.leaderboard-table td[data-label="Points"]::before {
content: "PTS";
}
.leaderboard-table td[data-label="Exact"]::before {
content: "EXA";
}
.leaderboard-table td[data-label="Outcome"]::before {
content: "OUT";
}

.leaderboard-table td[data-label="Points"] strong {
font-family: "Barlow Condensed", sans-serif;
font-size: 18px;
font-weight: 800;
color: var(--wc-blue);
line-height: 1;
}

.leaderboard-table td[data-label="Exact"],
.leaderboard-table td[data-label="Outcome"] {
font-size: 14px;
font-weight: 700;
color: var(--light);
}
}

@media (max-width: 768px) {
/_ Horizontal layout: flag+name | score | flag+name _/
.mc-body {
grid-template-columns: 1fr auto 1fr !important;
gap: 8px !important;
padding: 12px 10px !important;
}

.mc-team,
.mc-team:first-child,
.mc-team:last-child {
flex-direction: column;
align-items: center !important;
text-align: center !important;
gap: 4px;
}

/_ Smaller flag box _/
.team-mark {
width: 44px !important;
height: 32px !important;
font-size: 16px !important;
}

.team-mark .inline-flag-img {
width: 100% !important;
height: 100% !important;
object-fit: cover;
}

.mc-name {
font-size: 11px !important;
max-width: 80px !important;
line-height: 1.1;
}

/_ Tighten the score input _/
.score-input {
width: 48px !important;
height: 42px !important;
font-size: 20px !important;
}

/_ Shrink the result grid _/
.mc-result-grid {
width: 160px !important;
gap: 4px !important;
}

.mc-result-score {
font-size: 20px !important;
}

.mc-result-score--sub {
font-size: 14px !important;
}

/_ Tighten header _/
.mc-header {
padding: 10px 12px !important;
gap: 6px !important;
}

.mc-kickoff {
font-size: 13px !important;
}

.mc-venue strong {
font-size: 12px !important;
}
}

The screenshot shows the header controls wrapping into 3 rows on iPhone width:

Row 1 = Logo

Row 2 = User pill

Row 3 = Navigation buttons

Row 4 = Sync + Settings

The problem is not your match cards. It's the header layout.

Your current mobile CSS still allows:

header {
flex-direction: column;
}

.header-top {
flex-wrap: wrap;
}

.logo {
flex: 1 1 100%;
}
That forces the logo to take a full row and pushes everything down.

Option 1 (Recommended)
Keep logo on first row and make nav buttons horizontally scrollable below it.

Replace your mobile header block with:

@media (max-width: 768px) {

header {
display: flex;
flex-direction: column;
gap: 8px;
padding: 10px;
}

.header-top {
display: flex;
align-items: center;
justify-content: space-between;
flex-wrap: nowrap;
width: 100%;
}

.logo {
flex: 1;
min-width: 0;
}

.user-pill {
flex-shrink: 0;
}

.sync-container {
display: none;
}

#main-nav {
display: flex;
overflow-x: auto;
gap: 8px;
flex-wrap: nowrap;
width: 100%;
padding-bottom: 4px;
}

#main-nav::-webkit-scrollbar {
display: none;
}

.nav-btn {
flex: 0 0 auto;
}
}
Result:

[LOGO] [BA]

Predictions Leaderboard Results Bracket Settings
single clean layout.

Option 2 (Best UX)
Move Sync and Settings into icon buttons.

HTML:

<button class="icon-btn">
  🔄
</button>

<button class="icon-btn">
  ⚙️
</button>
CSS:

.icon-btn {
width: 42px;
height: 42px;
border-radius: 10px;
}
Then:

@media(max-width:768px){

.sync-container {
position:absolute;
top:12px;
right:12px;
}

}
This is how most sports apps handle mobile headers.

Option 3 (Quick Fix)
Your screenshot suggests the nav buttons are simply too wide.

Add:

@media (max-width:480px){

.nav-btn{
padding:8px 10px;
font-size:11px;
}

.logo-text h1{
font-size:12px;
}

.logo-text p{
display:none;
}

}
This alone often recovers 80-100px of space.

I would also remove the username completely on mobile
You already have:

#user-display-name {
display:none;
}
Go further:

@media(max-width:480px){

.user-pill{
padding:0;
border:none;
background:none;
}

.logout-btn{
display:none;
}

}
Then you'll only see the avatar:

[LOGO] [BA]
which gives the navigation much more room.

Based on the screenshot, the biggest culprit is:

.logo {
flex: 1 1 100%;
}
inside your @media (max-width:768px) block. Remove that line first. It is forcing the logo onto its own row and causing the cascading layout break.

i have an issue with point calculation, i made it so that it awards 3 points Welcome to GGO World Cup Predictor!
X
Hey Ben Arthur, join the Gulf Global Outsourcing family in predicting the FIFA World Cup 2026 matches!

Rules & Guidelines
Go to the Predictions tab to enter your predictions for upcoming matches.
Matches lock automatically as soon as kickoff begins.
Standings update automatically as you enter score predictions.
Points Allocation
15 pts
Exact Score
Your prediction matches the final score exactly.

8 pts
Correct Result + Close Difference
You picked the right winner or draw, and the goal difference is within 1.

5 pts
Correct Result
You picked the right winner or draw, but the goal difference was not close.

3 pts
Close Score, Wrong Result
Your scores were close to the final score, but the winner or draw was wrong.if you see normans last game here he got a wrong winner abut it awarded 3 points, how can i issue a fix witout altering old scores

Ghana
vs

Panama
3
pts
Result
1–0
Norman's pick
0–1
Group L
Matchday 7
2026-06-17
FT

You can fix this without altering historical scores by versioning the scoring engine.

Right now your logic likely says:

if (
Math.abs(predHome - actualHome) <= 1 &&
Math.abs(predAway - actualAway) <= 1
) {
return 3;
}
For:

Actual: 1-0
Pick: 0-1
both teams are off by exactly 1 goal:

|0-1| = 1
|1-0| = 1
so it incorrectly awards 3 points even though the result is reversed.

Best Fix
Change the 3-point rule to:

Close score
AND
NOT opposite winner
Example:

const actualResult =
actualHome > actualAway ? "H" :
actualHome < actualAway ? "A" : "D";

const predictedResult =
predHome > predAway ? "H" :
predHome < predAway ? "A" : "D";

const closeScore =
Math.abs(predHome - actualHome) <= 1 &&
Math.abs(predAway - actualAway) <= 1;

const oppositeWinner =
(actualResult === "H" && predictedResult === "A") ||
(actualResult === "A" && predictedResult === "H");

if (closeScore && !oppositeWinner) {
return 3;
}
Then:

Actual Pick Award
1-0 0-1 0
2-1 1-2 0
1-1 0-1 3
1-1 1-0 3
2-2 1-2 3
because a draw prediction versus winner prediction isn't the exact opposite outcome.

How to avoid changing old scores
Add a scoring version field.

In Supabase:

ALTER TABLE predictions
ADD COLUMN scoring_version INTEGER DEFAULT 1;
Existing predictions:

scoring_version = 1
New predictions:

scoring_version = 2
Then:

if (prediction.scoring_version === 1) {
return calculateLegacyPoints(...)
}

return calculateV2Points(...)
Historical leaderboards remain exactly as they were.

Easier option
Since the World Cup is already underway, don't recalculate completed matches.

Only apply the new rule to matches after a cutoff:

const RULE_CHANGE_DATE = "2026-06-18T00:00:00Z";

if (new Date(match.kickoff) < new Date(RULE_CHANGE_DATE)) {
return legacyScore(...)
}

return newScore(...)
This is usually what fantasy sports games do.

What I would do
For fairness:

Leave all completed matches untouched.

Deploy the corrected logic immediately.

Set:

RULE_CHANGE_DATE = now
Display in Rules:

As of June 18, 2026, opposite-result predictions (e.g. predicting an away win when the home team won) no longer qualify for the 3-point close-score bonus.

That preserves all historical standings while preventing cases like:

Ghana 1-0 Panama
Prediction 0-1

Old = 3 pts
New = 0 pts
going forward.

what files would you need to tell me locs to change

To tell you the exact lines and functions to edit, I'd need the files where scoring is calculated and where leaderboard points are written.

Most likely one of these:

1. Scoring Engine (most important)
   Usually named something like:

score.js
scoring.js
leaderboard.js
points.js
utils/scoring.js
worker.js
index.js
api.js
Search your repo for:

15
8
5
3
Exact Score
Correct Result
or

calculatePoints
scorePrediction
awardPoints 2. Sync / Result Processing
Since you're using a Cloudflare Worker, I suspect it may be inside:

worker.js
src/index.js
index.js
Search for:

sync-scores
leaderboard
recalculate
predictions 3. Supabase Update Logic
Need to see where points get stored.

Search for:

.from("predictions")
.update({
or

points:
or

predictionPoints
Fastest way
In Cursor / VSCode search the whole repo for:

15
or

return 15
Most scoring engines look like:

if (exact) return 15;
if (correctResult && closeDiff) return 8;
if (correctResult) return 5;
if (closeScore) return 3;
return 0;
The bug is almost certainly in the closeScore condition.

If you send me:

worker.js
or

the function that calculates 15/8/5/3 points
I can tell you:

exact line(s) to modify

exact replacement code

how to preserve old scores

how to prevent future recalculations from changing historical matches.

app(1).js
JavaScript
// GGO WC 2026 — Cloudflare Worker Backend
// Primary API: Supabase reads/writes, Firestore backup, leaderboard engine.

const WORLDCUP26_GAMES_URL = "https://worldcup26.ir/get/games";
const ZAFRONIX_URL =
"https://api.zafronix.com/fifa/worldcup/v1/tournaments/2026/matches";
const LIVESCORE_FIXTURES_URL =
"https://livescore-api.com/api-client/fixtures/matches.json?competition_id=362";
const LIVESCORE_LIVE_URL =
"https://livescore-api.com/api-client/matches/live.json?competition_id=362";

const FINAL_STATUSES = ["FT", "AET", "PEN", "COMPLETED", "FINAL"];

// ─── Supabase REST helpers ──────────────────────────────────────────────────

function supabaseHeaders(env, extra) {
const key =
env.SUPABASE_SERVICE_KEY ||
env.SUPABASE_KEY ||
env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
return Object.assign(
{
apikey: key,
Authorization: Bearer ${key},
},
extra || {},
);
}

function supabaseUrl(env, table, query) {
const urlVal = env.SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL;
const base = String(urlVal || "")
.replace(/\/rest\/v1\/?$/, "")
    .replace(/\/$/, "");
const suffix = query ? ?${query} : "";
  return ${base}/rest/v1/${table}${suffix};
}

async function supabaseSelect(env, table, query) {
const url = supabaseUrl(
env,
table,
select=${encodeURIComponent(query || "\*")},
);
const response = await fetch(url, {
headers: supabaseHeaders(env),
});
if (!response.ok) {
throw new Error(Supabase GET ${table} HTTP ${response.status});
}
return response.json();
}

const SUPABASE_CONFLICT_KEYS = {
fixtures: "matchId",
results: "matchId",
predictions: "id",
users: "username",
leaderboard: "username",
accountRequests: "username",
};

async function supabaseUpsert(env, table, rows) {
if (!rows.length) return;
const conflictKey = SUPABASE_CONFLICT_KEYS[table] || "";
const query = conflictKey
? on_conflict=${encodeURIComponent(conflictKey)}
: "";
const response = await fetch(supabaseUrl(env, table, query), {
method: "POST",
headers: supabaseHeaders(env, {
"Content-Type": "application/json",
Prefer: "resolution=merge-duplicates,return=minimal",
}),
body: JSON.stringify(Array.isArray(rows) ? rows : [rows]),
});
if (!response.ok) {
const text = await response.text();
throw new Error(
Supabase upsert ${table} HTTP ${response.status}: ${text},
);
}
}

// ─── Firestore REST helpers (backup / fallback) ─────────────────────────────

async function firestoreCollection(env, collectionId) {
const projectId = env.FIREBASE_PROJECT_ID || "ggowcpredictor";
const serviceAccount = parseJsonSecret(env.FIREBASE_SERVICE_ACCOUNT_JSON);
if (!serviceAccount) throw new Error("Missing FIREBASE_SERVICE_ACCOUNT_JSON");

const token = await getAccessToken(serviceAccount);
const allDocs = [];
let pageToken = "";

while (true) {
const tokenParam = pageToken
? &pageToken=${encodeURIComponent(pageToken)}
      : "";
    const url = https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/${collectionId}?pageSize=500${tokenParam};
const response = await fetch(url, {
headers: { Authorization: Bearer ${token} },
});
if (!response.ok) throw new Error(Firestore HTTP ${response.status});
const data = await response.json();
const docs = (data.documents || []).map(firestoreDocToRow);
allDocs.push(...docs);
if (!data.nextPageToken) break;
pageToken = data.nextPageToken;
}

return allDocs;
}

function firestoreDocToRow(doc) {
const row = {
id: String(doc.name || "")
.split("/")
.pop(),
};
const fields = doc.fields || {};
for (const key of Object.keys(fields)) {
row[key] = readFirestoreField(fields[key]);
}
return row;
}

function readFirestoreField(entry) {
if (!entry) return null;
if (entry.stringValue !== undefined) return entry.stringValue;
if (entry.integerValue !== undefined) return Number(entry.integerValue);
if (entry.doubleValue !== undefined) return Number(entry.doubleValue);
if (entry.booleanValue !== undefined) return entry.booleanValue;
if (entry.timestampValue !== undefined) return entry.timestampValue;
if (entry.nullValue !== undefined) return null;
if (entry.arrayValue) {
return (entry.arrayValue.values || []).map(readFirestoreField);
}
if (entry.mapValue) {
const obj = {};
for (const [k, v] of Object.entries(entry.mapValue.fields || {})) {
obj[k] = readFirestoreField(v);
}
return obj;
}
return null;
}

async function firestoreBatchWrite(env, collection, updates) {
const projectId = env.FIREBASE_PROJECT_ID || "ggowcpredictor";
const serviceAccount = parseJsonSecret(env.FIREBASE_SERVICE_ACCOUNT_JSON);
if (!serviceAccount) return;
const token = await getAccessToken(serviceAccount);

const writes = updates.map((update) => ({
update: {
name: projects/${projectId}/databases/(default)/documents/${collection}/${update.\_docId},
fields: convertToFirestoreFields(update),
},
}));

const url = https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents:batchWrite;
const response = await fetch(url, {
method: "POST",
headers: {
Authorization: Bearer ${token},
"Content-Type": "application/json",
},
body: JSON.stringify({ writes }),
});

if (!response.ok) {
const text = await response.text();
console.warn(Firestore batchWrite failed ${response.status}: ${text});
}
}

function convertToFirestoreFields(obj) {
const fields = {};
for (const [key, value] of Object.entries(obj)) {
if (key === "\_docId") continue;
fields[key] = toFirestoreValue(value);
}
return fields;
}

function toFirestoreValue(value) {
if (value === null || value === undefined) return { nullValue: null };
if (typeof value === "boolean") return { booleanValue: value };
if (typeof value === "number") {
return Number.isInteger(value)
? { integerValue: String(value) }
: { doubleValue: value };
}
if (typeof value === "string") return { stringValue: value };
if (Array.isArray(value)) {
return { arrayValue: { values: value.map(toFirestoreValue) } };
}
if (typeof value === "object") {
const fields = {};
for (const [k, v] of Object.entries(value)) {
fields[k] = toFirestoreValue(v);
}
return { mapValue: { fields } };
}
return { stringValue: String(value) };
}

async function loadCollection(env, table) {
try {
const rows = await supabaseSelect(env, table);
if (rows && rows.length) return rows;
} catch (error) {
console.warn(Supabase ${table} unavailable: ${error.message});
}

try {
return await firestoreCollection(env, table);
} catch (error) {
console.warn(Firestore ${table} also unavailable: ${error.message});
}

return [];
}

// ─── Leaderboard Calculation Engine ─────────────────────────────────────────

function scoreMatch(p1, p2, a1, a2) {
if (p1 === a1 && p2 === a2) return 15;
const predOutcome = Math.sign(p1 - p2);
const actualOutcome = Math.sign(a1 - a2);
if (predOutcome === actualOutcome) {
const diffGap = Math.abs(p1 - p2 - (a1 - a2));
return diffGap <= 1 ? 8 : 5;
}
const totalGap = Math.abs(p1 - a1) + Math.abs(p2 - a2);
return totalGap <= 2 ? 3 : 0;
}

function buildLeaderboard(resultRows, predictionRows, userRows) {
const displayNames = {};
for (const user of userRows) {
const username = String(user.username || user.id || "").trim();
if (username) displayNames[username] = user.displayName || username;
}

const results = {};
for (const r of resultRows) {
const matchId = String(r.matchId || r.id || "").replace(/^match\_/, "");
const status = String(r.status || "").toUpperCase();
const score1 = toNullableNumber(r.score1);
const score2 = toNullableNumber(r.score2);
if (!matchId || score1 === null || score2 === null) continue;
if (!FINAL_STATUSES.includes(status)) continue;
results[matchId] = { matchId, score1, score2, status };
}

const userMap = {};
for (const prediction of predictionRows) {
const username = String(prediction.username || "").trim();
const matchId = String(prediction.matchId || "").replace(/^match\_/, "");
const pred1 = toNullableNumber(prediction.pred1);
const pred2 = toNullableNumber(prediction.pred2);
if (!username || !matchId || pred1 === null || pred2 === null) continue;

    if (!userMap[username]) {
      userMap[username] = {
        username,
        displayName: displayNames[username] || username,
        totalPoints: 0,
        exactScores: 0,
        correctOutcomes: 0,
        predicted: 0,
        scored: 0,
      };
    }

    userMap[username].predicted++;
    const result = results[matchId];
    if (!result) continue;

    const points = scoreMatch(pred1, pred2, result.score1, result.score2);
    userMap[username].totalPoints += points;
    userMap[username].scored++;
    if (points === 15) userMap[username].exactScores++;
    if (points > 0) userMap[username].correctOutcomes++;

}

const ranked = Object.values(userMap)
.sort((a, b) => {
if (b.totalPoints !== a.totalPoints) return b.totalPoints - a.totalPoints;
if (b.exactScores !== a.exactScores) return b.exactScores - a.exactScores;
if (b.correctOutcomes !== a.correctOutcomes)
return b.correctOutcomes - a.correctOutcomes;
return a.username.localeCompare(b.username);
})
.map((player, index) => ({ ...player, rank: index + 1 }));

return {
leaderboard: ranked,
results,
scoredMatches: Object.keys(results).length,
};
}

// ─── Live Score Fetching & Syncing ──────────────────────────────────────────

async function syncLiveResults(env) {
const [fixtureRows, apiMatches] = await Promise.all([
loadCollection(env, "fixtures"),
fetchPrimaryOrBackupMatches(env),
]);

const fixtureLookups = buildFixtureLookups(fixtureRows);
const matchedUpdates = [];
const fixtureApiUpdates = [];

for (const item of apiMatches) {
const resolved = resolveFixtureMatch(item, fixtureLookups);
if (!resolved) continue;

    const { fixture, flipped } = resolved;
    const internalMatchId = normalizeMatchId(fixture.matchId || fixture.id);
    const apiHome = toNullableNumber(readScore(item, "home"));
    const apiAway = toNullableNumber(readScore(item, "away"));
    const apiGameId = toNullableNumber(item.apiGameId);

    if (apiGameId !== null && !fixture.apiFixtureId) {
      fixtureApiUpdates.push({
        matchId: internalMatchId,
        apiFixtureId: apiGameId,
      });
      fixtureLookups.byApiId.set(String(apiGameId), fixture);
      fixture.apiFixtureId = apiGameId;
    }

    matchedUpdates.push({
      matchId: internalMatchId,
      score1: flipped ? apiAway : apiHome,
      score2: flipped ? apiHome : apiAway,
      status: mapStatus(item.status),
      lastUpdated: new Date().toISOString(),
      homeScorers: flipped ? item.awayScorers : item.homeScorers,
      awayScorers: flipped ? item.homeScorers : item.awayScorers,
    });

}

if (fixtureApiUpdates.length) {
try {
await supabaseUpsert(env, "fixtures", fixtureApiUpdates);
} catch (error) {
console.warn(
"Supabase fixtures apiFixtureId write failed:",
error.message,
);
}
}

const liveOrFinished = matchedUpdates.filter(
(u) => u.status !== "NS" && u.score1 !== null && u.score2 !== null,
);

if (liveOrFinished.length) {
try {
await supabaseUpsert(env, "results", liveOrFinished);
} catch (error) {
console.warn("Supabase results write failed:", error.message);
}

    try {
      const firestoreUpdates = liveOrFinished.map((u) => ({
        ...u,
        _docId: match_${u.matchId},
      }));
      await firestoreBatchWrite(env, "results", firestoreUpdates);
    } catch (error) {
      console.warn("Firestore results write failed:", error.message);
    }

}

const leaderboardData = await recalculateLeaderboard(env);
console.log(
JSON.stringify({
apiMatches: apiMatches.length,
fixtures: fixtureRows.length,
matched: matchedUpdates.length,
written: liveOrFinished.length,
apiFixtureIdsUpdated: fixtureApiUpdates.length,
sample: liveOrFinished.slice(0, 5),
}),
);
return {
success: true,
matched: matchedUpdates.length,
updated: liveOrFinished.length,
apiFixtureIdsUpdated: fixtureApiUpdates.length,
leaderboard: leaderboardData.leaderboard,
};
}

async function recalculateLeaderboard(env) {
const [resultRows, predictionRows, userRows] = await Promise.all([
loadCollection(env, "results"),
loadCollection(env, "predictions"),
loadCollection(env, "users"),
]);

const data = buildLeaderboard(resultRows, predictionRows, userRows);

// Persist leaderboard to Supabase
if (data.leaderboard.length) {
try {
const rows = data.leaderboard.map((p) => ({
...p,
updatedAt: new Date().toISOString(),
}));
await supabaseUpsert(env, "leaderboard", rows);
} catch (error) {
console.warn("Supabase leaderboard write failed:", error.message);
}
}

return data;
}

async function handleRivalryGet(env, username) {
const [allPredictions, allResults, allUsers] = await Promise.all([
loadCollection(env, "predictions"),
loadCollection(env, "results"),
loadCollection(env, "users"),
]);

// Only score finished matches
const FINAL*STS = ["FT", "AET", "PEN", "COMPLETED", "FINAL"];
const finishedMatchIds = new Set(
allResults
.filter((r) => FINAL_STS.includes(String(r.status || "").toUpperCase()))
.map((r) => String(r.matchId || r.id || "").replace(/^match*/, "")),
);

// Index this user's predictions on finished matches
const myPreds = {};
allPredictions
.filter(
(p) => String(p.username || "").toLowerCase() === username.toLowerCase(),
)
.forEach((p) => {
const mid = String(p.matchId || "").replace(/^match\_/, "");
if (finishedMatchIds.has(mid)) {
myPreds[mid] = {
pred1: toNullableNumber(p.pred1),
pred2: toNullableNumber(p.pred2),
};
}
});

if (!Object.keys(myPreds).length) {
return { rival: null, reason: "not_enough_data" };
}

// For each other user, compute divergence score on shared finished matches
// Also track agreement score (opposite of divergence)
const userScores = {};

allPredictions
.filter((p) => {
const u = String(p.username || "").toLowerCase();
return u !== username.toLowerCase() && u !== "";
})
.forEach((p) => {
const mid = String(p.matchId || "").replace(/^match\_/, "");
const mine = myPreds[mid];
if (!mine || mine.pred1 === null || mine.pred2 === null) return;

      const theirP1 = toNullableNumber(p.pred1);
      const theirP2 = toNullableNumber(p.pred2);
      if (theirP1 === null || theirP2 === null) return;

      const u = String(p.username || "").toLowerCase();
      if (!userScores[u])
        userScores[u] = { username: u, divergence: 0, shared: 0, agreement: 0 };

      const diff =
        Math.abs(mine.pred1 - theirP1) + Math.abs(mine.pred2 - theirP2);
      userScores[u].divergence += diff;
      userScores[u].shared += 1;
      // 0 diff = perfect agreement
      if (diff === 0) userScores[u].agreement += 1;
    });

const candidates = Object.values(userScores).filter((u) => u.shared >= 3);
if (!candidates.length) return { rival: null, reason: "not_enough_data" };

// Rival = highest avg divergence per shared match
candidates.sort((a, b) => b.divergence / b.shared - a.divergence / a.shared);
const rivalEntry = candidates[0];

// Twin = highest agreement rate
candidates.sort((a, b) => b.agreement / b.shared - a.agreement / a.shared);
const twinEntry = candidates[0];

// Resolve display names
const nameMap = {};
allUsers.forEach((u) => {
nameMap[String(u.username || "").toLowerCase()] =
u.displayName || u.username;
});

return {
rival: {
username: rivalEntry.username,
displayName: nameMap[rivalEntry.username] || rivalEntry.username,
divergenceScore:
Math.round((rivalEntry.divergence / rivalEntry.shared) _ 10) / 10,
sharedMatches: rivalEntry.shared,
},
twin:
twinEntry.agreement / twinEntry.shared > 0.2
? {
username: twinEntry.username,
displayName: nameMap[twinEntry.username] || twinEntry.username,
agreementPct: Math.round(
(twinEntry.agreement / twinEntry.shared) _ 100,
),
sharedMatches: twinEntry.shared,
}
: null,
};
}
async function handleProfileGet(env, username) {
const [allUsers, allPredictions, allFixtures, allResults, leaderboardData] =
await Promise.all([
loadCollection(env, "users"),
loadCollection(env, "predictions"),
loadCollection(env, "fixtures"),
loadCollection(env, "results"),
recalculateLeaderboard(env),
]);

const user = allUsers.find(
(u) =>
String(u.username || u.id || "")
.trim()
.toLowerCase() === username.toLowerCase(),
);
if (!user) {
return { success: false, error: "User not found" };
}

const lbEntry =
leaderboardData.leaderboard.find(
(e) => String(e.username || "").toLowerCase() === username.toLowerCase(),
) || {};

// Index fixtures and results by matchId
const fixtureMap = {};
for (const f of allFixtures) {
const id = String(f.matchId || f.id || "").replace(/^match*/, "");
if (id) fixtureMap[id] = f;
}
const resultMap = {};
for (const r of allResults) {
const id = String(r.matchId || r.id || "").replace(/^match*/, "");
if (id) resultMap[id] = r;
}

const userPredictions = allPredictions.filter(
(p) => String(p.username || "").toLowerCase() === username.toLowerCase(),
);

const FINAL_STS = ["FT", "AET", "PEN", "COMPLETED", "FINAL"];
const LIVE_STS = ["1H", "HT", "2H", "ET", "P", "LIVE"];

const predictions = userPredictions
.filter((p) => p.matchId != null)
.map((p) => {
const matchId = String(p.matchId).replace(/^match\_/, "");
const fixture = fixtureMap[matchId] || {};
const result = resultMap[matchId];

      const pred1 = toNullableNumber(p.pred1);
      const pred2 = toNullableNumber(p.pred2);
      const hasPred = pred1 !== null && pred2 !== null;

      let actualHome = null,
        actualAway = null,
        points = null,
        statusType = "upcoming";

      if (result) {
        actualHome = toNullableNumber(
          result.score1 ?? result.homeScore ?? result.team1Score,
        );
        actualAway = toNullableNumber(
          result.score2 ?? result.awayScore ?? result.team2Score,
        );
        const st = String(result.status || "NS").toUpperCase();
        if (FINAL_STS.includes(st)) statusType = "finished";
        else if (LIVE_STS.includes(st)) statusType = "live";
      }

      if (hasPred && actualHome !== null && actualAway !== null) {
        points = scoreMatch(pred1, pred2, actualHome, actualAway);
      }

      return {
        matchId,
        home: fixture.team1 || "TBD",
        away: fixture.team2 || "TBD",
        group: fixture.group || "",
        round: fixture.round || "",
        date: fixture.date || "",
        time: fixture.time || "",
        predictedHome: hasPred ? pred1 : null,
        predictedAway: hasPred ? pred2 : null,
        actualHome,
        actualAway,
        points,
        status: String(result?.status || "NS").toUpperCase(),
        statusType,
      };
    })
    .sort((a, b) => {
      const order = { finished: 0, live: 1, upcoming: 2 };
      const od = (order[a.statusType] ?? 3) - (order[b.statusType] ?? 3);
      return od !== 0 ? od : Number(a.matchId) - Number(b.matchId);
    });

return {
user: {
username: user.username || username,
displayName: user.displayName || username,
isAdmin: Boolean(user.isAdmin),
totalPoints: lbEntry.totalPoints ?? 0,
exactScores: lbEntry.exactScores ?? 0,
correctOutcomes: lbEntry.correctOutcomes ?? 0,
predicted: userPredictions.length,
rank: lbEntry.rank ?? null,
},
predictions,
};
}
// ─── Main GET /sync endpoint ────────────────────────────────────────────────

async function handleSyncGet(env) {
const [fixtureRows, resultRows, userRows, predictionRows] = await Promise.all(
[
loadCollection(env, "fixtures"),
loadCollection(env, "results"),
loadCollection(env, "users"),
loadCollection(env, "predictions"),
],
);

const fixtures = fixtureRows.map((f) => ({
matchId: String(f.matchId || f.id || "").replace(/^match\_/, ""),
round: f.round || "",
group: f.group || "",
date: f.date || "",
time: f.time || "",
kickoffUTC: f.kickoffUTC || null,
team1: f.team1 || "",
team2: f.team2 || "",
ground: f.ground || "",
stage: f.stage || "",
}));

const results = {};
for (const r of resultRows) {
const matchId = String(r.matchId || r.id || "").replace(/^match\_/, "");
if (!matchId) continue;
results[matchId] = {
matchId,
score1: toNullableNumber(r.score1),
score2: toNullableNumber(r.score2),
status: String(r.status || "NS").toUpperCase(),
homeScorers: r.homeScorers || [],
awayScorers: r.awayScorers || [],
};
}

const users = userRows
.map((u) => ({
username: String(u.username || u.id || "").trim(),
displayName: u.displayName || u.username || u.id || "",
isAdmin: Boolean(u.isAdmin),
}))
.filter((u) => u.username);

const { leaderboard } = buildLeaderboard(
resultRows,
predictionRows,
userRows,
);

return {
fixtures,
results,
users,
leaderboard,
timestamp: new Date().toISOString(),
};
}

// ─── Endpoint Router ────────────────────────────────────────────────────────

export default {
async fetch(request, env, ctx) {
// Handle CORS preflight
if (request.method === "OPTIONS") {
return corsResponse(new Response(null, { status: 204 }));
}

    const url = new URL(request.url);
    const path = url.pathname;
    const action = url.searchParams.get("action");

    try {
      // /sync-scores — trigger live score fetch + recalc
      if (path === "/sync-scores" || action === "sync-scores") {
        if (!isAuthorized(request, env)) {
          return corsJson({ success: false, error: "Unauthorized" }, 401);
        }
        const result = await syncLiveResults(env);
        return corsJson({ ...result, mode: "manual-sync-scores" });
      }

      // /seed — alias for sync-scores (backwards compat)
      if (path === "/seed" || action === "seed") {
        if (!isAuthorized(request, env)) {
          return corsJson({ success: false, error: "Unauthorized" }, 401);
        }
        const result = await syncLiveResults(env);
        return corsJson({ ...result, mode: "manual-seed" });
      }

      // /sync — returns all data (public, read-only)
      if (path === "/sync" || action === "sync") {
        const data = await handleSyncGet(env);
        return corsJson(data);
      }

      // /fixtures — just fixtures
      if (path === "/fixtures" || action === "fixtures") {
        const fixtureRows = await loadCollection(env, "fixtures");
        const fixtures = fixtureRows.map((f) => ({
          matchId: String(f.matchId || f.id || "").replace(/^match_/, ""),
          round: f.round || "",
          group: f.group || "",
          date: f.date || "",
          time: f.time || "",
          kickoffUTC: f.kickoffUTC || null,
          team1: f.team1 || "",
          team2: f.team2 || "",
          ground: f.ground || "",
          stage: f.stage || "",
        }));
        return corsJson({ fixtures, timestamp: new Date().toISOString() });
      }

      // /leaderboard — just the leaderboard
      if (path === "/leaderboard" || action === "leaderboard") {
        const data = await recalculateLeaderboard(env);
        return corsJson({
          leaderboard: data.leaderboard,
          scoredMatches: data.scoredMatches,
          timestamp: new Date().toISOString(),
        });
      }
      // /rivalry — find the user whose predictions diverge most from this user's
      if (path === "/rivalry" || action === "rivalry") {
        const username = url.searchParams.get("username") || "";
        if (!username) return corsJson({ error: "username required" }, 400);
        const data = await handleRivalryGet(env, username);
        return corsJson(data);
      }

      // /profile — single-user profile data
      if (path === "/profile" || action === "profile") {
        const username = url.searchParams.get("username") || "";
        if (!username) {
          return corsJson(
            { success: false, error: "username param required" },
            400,
          );
        }
        const profileData = await handleProfileGet(env, username);
        return corsJson(profileData);
      }
      // Root — API info
      return corsJson({
        ok: true,
        routes: ["/sync", "/sync-scores", "/fixtures", "/leaderboard"],
        message:
          "GGO WC 2026 Predictor API. Use /sync for all data, /sync-scores to trigger live score fetch.",
      });
    } catch (error) {
      console.error("Worker error:", error);
      return corsJson({ success: false, error: error.message }, 500);
    }

},

async scheduled(event, env, ctx) {
ctx.waitUntil(syncLiveResults(env));
},
};

You already found the bug.

Your current logic:

const totalGap = Math.abs(p1 - a1) + Math.abs(p2 - a2);
return totalGap <= 2 ? 3 : 0;
For Norman:

Actual: 1-0
Predicted: 0-1

totalGap =
|0-1| + |1-0|
= 1 + 1
= 2
Since 2 <= 2, he gets 3 points.

The problem is your implementation does not check that the predicted result was "close" in the way your rules describe. It only checks numerical distance.

Where to edit
Search for:

function scoreMatch(p1, p2, a1, a2) {
Inside that function replace:

const totalGap = Math.abs(p1 - a1) + Math.abs(p2 - a2);
return totalGap <= 2 ? 3 : 0;
with:

const totalGap = Math.abs(p1 - a1) + Math.abs(p2 - a2);

// 3 pts only if score is close AND one team score was predicted exactly
if (
totalGap <= 2 &&
(p1 === a1 || p2 === a2)
) {
return 3;
}

return 0;
Norman after fix
Actual: 1-0
Pred: 0-1

totalGap = 2

p1 === a1 ? 0===1 -> false
p2 === a2 ? 1===0 -> false
Result:

0 points
Example that WOULD get 3 pts
Actual: 2-1
Pred: 1-1
totalGap = 1
p2 === a2 -> true
Result:

3 points
How to fix future matches WITHOUT changing old scores
Add a version cutoff inside scoreMatch():

function scoreMatch(p1, p2, a1, a2, matchDate) {
Then:

const RULE_CHANGE_DATE = new Date("2026-06-18T00:00:00Z");
Use old logic before the date:

if (new Date(matchDate) < RULE_CHANGE_DATE) {
const totalGap = Math.abs(p1 - a1) + Math.abs(p2 - a2);
return totalGap <= 2 ? 3 : 0;
}
Use new logic after the date:

const totalGap = Math.abs(p1 - a1) + Math.abs(p2 - a2);

if (
totalGap <= 2 &&
(p1 === a1 || p2 === a2)
) {
return 3;
}

return 0;
That preserves all historical leaderboards while fixing future matches.

However, before changing anything, I'd want to see the frontend scoring explanation page and any profile/leaderboard components that display points. Sometimes the backend is correct but the profile page independently recalculates scores using a second copy of scoreMatch(). If that exists, you'll need to update both copies.

function scoreMatch(p1, p2, a1, a2, matchDate) {
if
if (p1 === a1 && p2 === a2) return 15;
const predOutcome = Math.sign(p1 - p2);
const actualOutcome = Math.sign(a1 - a2);
if (predOutcome === actualOutcome) {
const diffGap = Math.abs(p1 - p2 - (a1 - a2));
return diffGap <= 1 ? 8 : 5;
}
const totalGap = Math.abs(p1 - a1) + Math.abs(p2 - a2);
return totalGap <= 2 ? 3 : 0;
}

so what to do

Right now your function still has the old logic.

If you want the rule to be:

"Close score, wrong result" only when at least one team's score was predicted correctly

replace the bottom section with:

function scoreMatch(p1, p2, a1, a2) {
if (p1 === a1 && p2 === a2) return 15;

const predOutcome = Math.sign(p1 - p2);
const actualOutcome = Math.sign(a1 - a2);

if (predOutcome === actualOutcome) {
const diffGap = Math.abs((p1 - p2) - (a1 - a2));
return diffGap <= 1 ? 8 : 5;
}

const totalGap = Math.abs(p1 - a1) + Math.abs(p2 - a2);

// Wrong result but close score
if (
totalGap <= 2 &&
(p1 === a1 || p2 === a2)
) {
return 3;
}

return 0;
}
However, before deploying this, answer one question:

Should 1-0 predicted as 0-0 get 3 points?

Example:

Actual: 1-0
Pred: 0-0
One team score is correct (0) and totalGap is only 1.

Under the code above it would receive 3 points.

If that's NOT what you want, tell me exactly which situations should receive 3 points and I'll give you the precise condition.

no it should award 0

Then the current "totalGap <= 2" concept is too broad.

Based on your examples:

Actual Prediction Points
1-0 0-1 0
1-0 0-0 0
2-1 1-1 0
2-1 2-0 0
That means a wrong winner/draw should never receive points.

In that case, remove the 3-point rule entirely:

function scoreMatch(p1, p2, a1, a2) {
if (p1 === a1 && p2 === a2) return 15;

const predOutcome = Math.sign(p1 - p2);
const actualOutcome = Math.sign(a1 - a2);

if (predOutcome === actualOutcome) {
const diffGap = Math.abs((p1 - p2) - (a1 - a2));
return diffGap <= 1 ? 8 : 5;
}

return 0;
}
Or, if you still want a 3-point tier, you need to define exactly what qualifies.

For example:

Actual 2-1, Predicted 2-2 → 3?

Actual 2-1, Predicted 1-1 → 3?

Actual 2-1, Predicted 2-0 → 3?

Actual 2-1, Predicted 3-1 → 3?

Tell me which of those should get 3 points and I can write the exact rule.

From the Norman example and your response about 1-0 vs 0-0, it sounds like the simplest and fairest fix is:

15 = exact score
8 = correct winner/draw + goal difference within 1
5 = correct winner/draw
0 = everything else
which would completely eliminate the problematic 3-point category.

yes

Then the clean fix is simply:

function scoreMatch(p1, p2, a1, a2) {
if (p1 === a1 && p2 === a2) return 15;

const predOutcome = Math.sign(p1 - p2);
const actualOutcome = Math.sign(a1 - a2);

if (predOutcome === actualOutcome) {
const diffGap = Math.abs((p1 - p2) - (a1 - a2));
return diffGap <= 1 ? 8 : 5;
}

return 0;
}
What this does
Scenario Points
Exact score 15
Correct winner/draw + goal difference within 1 8
Correct winner/draw 5
Wrong winner/draw 0
Examples
Actual Prediction Points
1-0 1-0 15
2-1 3-2 8
3-0 2-0 5
1-0 0-1 0
1-0 0-0 0
2-1 1-1 0
Important
If you deploy this change and then run:

curl -H "Authorization: Bearer ggo-seed-admin-token-123" https://ggowcpredictor.ben-arthur-wiz.workers.dev/sync-scores
the leaderboard will be recalculated for all historical matches, meaning Norman will lose those previously awarded 3-point games and everyone's totals may change.

If you want to preserve old scores and only apply the new rule from today onward, you'll need a date-based cutoff in scoreMatch(). If you're okay with correcting historical scores, just replace the function and redeploy.

now add the ifs for preserving stuff before Jun 18, 07:00 PM cairo dst time (7 hours earlier than atalanta)
City
Atlanta
Mercedes-Benz Stadium

and ill append the message to tell people that we have changed the scoring, so i need to add something in html that pops up for the day

For the scoring fix, use the match date as a cutoff.

Assuming all dates are stored in UTC, Atlanta kickoff was:

Jun 18, 2026 7:00 PM Cairo (UTC+3 DST)

= Jun 18, 2026 16:00 UTC

Update your function to preserve historical scores before that match and apply the new rule afterward:

function scoreMatch(p1, p2, a1, a2, matchDate) {
const cutoff = new Date("2026-06-18T16:00:00Z");

// Preserve old scoring before cutoff
if (matchDate && new Date(matchDate) < cutoff) {
if (p1 === a1 && p2 === a2) return 15;

    const predOutcome = Math.sign(p1 - p2);
    const actualOutcome = Math.sign(a1 - a2);

    if (predOutcome === actualOutcome) {
      const diffGap = Math.abs((p1 - p2) - (a1 - a2));
      return diffGap <= 1 ? 8 : 5;
    }

    const totalGap = Math.abs(p1 - a1) + Math.abs(p2 - a2);
    return totalGap <= 2 ? 3 : 0;

}

// New scoring after cutoff
if (p1 === a1 && p2 === a2) return 15;

const predOutcome = Math.sign(p1 - p2);
const actualOutcome = Math.sign(a1 - a2);

if (predOutcome === actualOutcome) {
const diffGap = Math.abs((p1 - p2) - (a1 - a2));
return diffGap <= 1 ? 8 : 5;
}

// No consolation points anymore
return 0;
}
Then you must modify every call to scoreMatch() to pass the fixture date.

In buildLeaderboard():

const fixture = fixtureMap[matchId];
const points = scoreMatch(
pred1,
pred2,
result.score1,
result.score2,
fixture?.kickoffUTC || fixture?.date
);
In handleProfileGet():

points = scoreMatch(
pred1,
pred2,
actualHome,
actualAway,
fixture.kickoffUTC || fixture.date
);
One-day announcement popup
Add this near the top of your main page HTML:

<div id="scoringNotice" class="scoring-notice">
  <strong>Scoring Update</strong><br>
  As of June 18, 2026, the "Close Score, Wrong Result" category no longer awards 3 points.
  Historical matches played before this date remain scored under the original rules.
</div>
CSS:

.scoring-notice {
position: fixed;
top: 20px;
left: 50%;
transform: translateX(-50%);
z-index: 99999;
max-width: 700px;
padding: 16px 20px;
background: #ffd54f;
color: #000;
border-radius: 10px;
box-shadow: 0 8px 24px rgba(0,0,0,.25);
font-weight: 600;
}
JS (auto-hide after Jun 19 Cairo midnight):

<script>
(() => {
  const expiry = new Date("2026-06-18T21:00:00Z"); // Jun 19 00:00 Cairo
  const notice = document.getElementById("scoringNotice");

  if (new Date() > expiry && notice) {
    notice.remove();
  }
})();
</script>

One more thing: your current worker code does not have access to fixture dates inside buildLeaderboard(). You'll need to show me your fixtures table columns (especially matchId, kickoffUTC, date) and I'll tell you the exact locations to edit so the cutoff logic works without breaking existing leaderboards.

will this affect when the prediction was added or when it will have been locked ( it should nt matter if i added a prediction for the final today it should be scored with new rule as well

Correct. The cutoff should be based on the match kickoff date, not:

❌ when the prediction was submitted

❌ when the prediction was last edited

❌ when the match was locked

It should only depend on:

matchDate < cutoff
So:

Match Prediction Made Match Played Scoring Rule
Final Today July 2026 New rule (0 pts)
Semi-final Last week July 2026 New rule (0 pts)
Ghana vs Panama Before change Jun 17 Old rule (3 pts possible)
Any match before Atlanta kickoff Doesn't matter Before cutoff Old rule
Any match after Atlanta kickoff Doesn't matter After cutoff New rule
That means Norman's Ghana–Panama prediction keeps its 3 points because the match occurred before the rule change, while someone predicting the World Cup Final today would still be scored using the new system because the match occurs after the cutoff.

One thing though: your current scoreMatch() only receives:

scoreMatch(p1, p2, a1, a2)
so you'll need to pass the fixture kickoff date into it:

scoreMatch(
pred1,
pred2,
result.score1,
result.score2,
fixture.kickoffUTC
)
If your fixtures table already has kickoffUTC, that's the cleanest approach. If it only has date and time, I can show you exactly where to build a fixture lookup in buildLeaderboard() so the scoring engine can access the match date without changing any database records.

After deployment, run:

curl -H "Authorization: Bearer ggo-secret-admin-token-123" `
https://ggowcpredictor.ben-arthur-wiz.workers.dev/sync-scores
and then:

curl https://ggowcpredictor.ben-arthur-wiz.workers.dev/leaderboard
to force a full recalculation under the new rules while preserving all pre-cutoff matches.

i didnt edit anything yet bro i was just asking

Right — you were asking about the logic, not implementing it yet.

The answer is: if you implement the cutoff based on the match date, then prediction submission time is completely irrelevant.

Example:

User predicts World Cup Final on June 1 → Final played July 19 → new rule

User predicts World Cup Final on July 18 → Final played July 19 → new rule

User predicted Ghana vs Panama months ago → Match played June 17 → old rule

The scoring engine would look at:

matchKickoffDate
not:

prediction.createdAt
prediction.updatedAt
prediction.lockedAt
So as long as the cutoff is tied to the fixture/match date, you get exactly what you want:

Historical matches keep their old scoring.

Future matches use the new scoring.

Nobody gets grandfathered into the old rule because they entered predictions early.

Before changing anything, I'd actually recommend checking whether you even have a fixture date available inside the scoring function. Looking at the code you pasted, scoreMatch() currently only knows:

p1, p2, a1, a2
and has no idea which match it's scoring.

So the first question is:

Does your fixtures table contain a kickoffUTC column for every match?

If yes, the change is straightforward.

If no, I'd implement the cutoff using a specific match ID (the Atlanta match) instead of dates, which is actually safer because it can't be affected by timezone mistakes.

You’ve reached the Free limit for chats with attachments
Upgrade now or wait until 5:16 PM to keep using files, or chat now without files.

New chat

Claim free offer
**