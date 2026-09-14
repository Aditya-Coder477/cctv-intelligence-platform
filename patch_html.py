from pathlib import Path
import re

HTML_PATH = Path("frontend/public/synthetic-standalone.html")
html = HTML_PATH.read_text(encoding="utf-8")

# PATCH 1: Add alerts stat badge in header
html = html.replace(
    '<a href="/" class="px-3 py-1.5 rounded-lg bg-police-800 hover:bg-police-700 text-white font-medium text-xs flex items-center gap-1.5 transition-colors">\n        <i data-lucide="arrow-left" class="w-3.5 h-3.5"></i> Command Centre',
    '<div id="stat-alerts-box" class="hidden px-3 py-1.5 rounded-lg bg-red-950 border border-red-700 flex items-center gap-2"><i data-lucide="shield-alert" class="w-4 h-4 text-red-400"></i><span class="text-red-300">Alerts: <strong id="stat-alerts" class="font-mono">0</strong> Active</span></div>\n      <a href="/" class="px-3 py-1.5 rounded-lg bg-police-800 hover:bg-police-700 text-white font-medium text-xs flex items-center gap-1.5 transition-colors">\n        <i data-lucide="arrow-left" class="w-3.5 h-3.5"></i> Command Centre',
    1
)
print("P1:", "stat-alerts-box" in html)

# PATCH 2: Add alert banner after </header>
html = html.replace(
    "  </header>\n\n  <!-- Main Container -->",
    '  </header>\n\n  <!-- Alert Banner -->\n  <div id="alert-banner" class="hidden mx-6 mt-4"><div class="flex items-center gap-3 px-4 py-3 bg-red-950/80 border border-red-700 rounded-xl"><i data-lucide="shield-alert" class="w-5 h-5 text-red-400 shrink-0"></i><p id="alert-banner-text" class="text-sm font-bold text-red-300 flex-1">WATCHLIST MATCH DETECTED</p><button onclick="switchTab(\'alerts\')" class="px-3 py-1.5 bg-red-700 text-white text-xs font-semibold rounded-lg">View Alerts</button></div></div>\n\n  <!-- Main Container -->',
    1
)
print("P2:", "alert-banner" in html)

# PATCH 3: Replace right panel section
OLD_PANEL = '''      <!-- Right Feed (4 Cols) -->
      <section class="lg:col-span-4 bg-police-900/70 rounded-xl border border-police-800 flex flex-col h-[600px] shadow-xl overflow-hidden">
        <div class="p-4 border-b border-police-800 space-y-3">
          <div class="flex items-center justify-between">
            <h3 class="font-semibold text-white text-sm flex items-center gap-2">
              <i data-lucide="activity" class="w-4 h-4 text-emerald-400"></i>
              Live Detected Vehicles
            </h3>
            <button onclick="exportJSON()" class="px-2.5 py-1 text-[11px] font-medium text-cyan-300 bg-cyan-950/80 border border-cyan-800 rounded hover:bg-cyan-900/80 flex items-center gap-1">
              <i data-lucide="download" class="w-3 h-3"></i> Export
            </button>
          </div>

          <div class="relative">
            <i data-lucide="search" class="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5"></i>
            <input type="text" id="inp-search" oninput="renderDetections()" placeholder="Filter by Vehicle ID or Plate..." class="w-full bg-police-950 border border-police-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-500" />
          </div>
        </div>

        <div id="detections-container" class="flex-1 overflow-y-auto p-3 space-y-2.5">
          <!-- Injected via JavaScript -->
        </div>
      </section>'''

NEW_PANEL = '''      <!-- Right Panel Tabbed -->
      <section class="lg:col-span-4 bg-police-900/70 rounded-xl border border-police-800 flex flex-col h-[640px] shadow-xl overflow-hidden">
        <div class="border-b border-police-800">
          <div class="flex">
            <button id="tab-btn-detections" onclick="switchTab('detections')" class="flex-1 flex items-center justify-center gap-2 py-3 text-xs font-semibold text-cyan-300 border-b-2 border-cyan-400 bg-cyan-950/20 transition-colors">
              <i data-lucide="check-circle-2" class="w-3.5 h-3.5"></i>
              <span id="tab-label-detections">Vehicles (0)</span>
            </button>
            <button id="tab-btn-alerts" onclick="switchTab('alerts')" class="flex-1 flex items-center justify-center gap-2 py-3 text-xs font-semibold text-slate-400 hover:text-white relative transition-colors">
              <i data-lucide="bell-off" id="tab-bell-icon" class="w-3.5 h-3.5"></i>
              <span id="tab-label-alerts">Alerts (0)</span>
              <span id="tab-alerts-badge" class="hidden absolute top-2 right-6 w-4 h-4 bg-red-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center">0</span>
            </button>
          </div>
          <div class="px-4 py-2.5 flex items-center gap-2">
            <div id="tab-sub-detections" class="relative flex-1">
              <i data-lucide="search" class="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5"></i>
              <input type="text" id="inp-search" oninput="renderDetections()" placeholder="Filter by Vehicle ID or Plate..." class="w-full bg-police-950 border border-police-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-500" />
            </div>
            <div id="tab-sub-detections-btn">
              <button onclick="exportJSON()" class="px-2.5 py-1.5 text-[11px] font-medium text-cyan-300 bg-cyan-950/80 border border-cyan-800 rounded hover:bg-cyan-900/80 flex items-center gap-1">
                <i data-lucide="download" class="w-3 h-3"></i> Export
              </button>
            </div>
            <span id="tab-sub-alerts" class="hidden text-[11px] text-slate-400">No pending alerts</span>
          </div>
        </div>
        <div id="detections-container" class="flex-1 overflow-y-auto p-3 space-y-2.5"></div>
        <div id="alerts-container" class="hidden flex-1 overflow-y-auto p-3 space-y-3"></div>
      </section>'''

assert OLD_PANEL in html, "OLD_PANEL NOT FOUND"
html = html.replace(OLD_PANEL, NEW_PANEL, 1)
print("P3:", "alerts-container" in html)

HTML_PATH.write_text(html, encoding="utf-8")
print("Patches 1-3 written.")
