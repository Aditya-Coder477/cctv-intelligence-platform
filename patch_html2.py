from pathlib import Path

HTML_PATH = Path("frontend/public/synthetic-standalone.html")
html = HTML_PATH.read_text(encoding="utf-8")

# Find start of <script> and end of </script>
script_start = html.index("  <script>")
script_end = html.index("  </script>") + len("  </script>")

NEW_SCRIPT = """  <script>
    let currentVideo = "2.mp4"
    let isPlaying = true
    let detectionsList = []
    let alertsList = []
    let videosData = []
    let prevAlertCount = 0

    const CAT_STYLES = {
      STOLEN_VEHICLE:         { border: 'border-red-600',    bg: 'bg-red-950/80',    text: 'text-red-300',    label: 'STOLEN VEHICLE',  icon: 'shield-alert' },
      WANTED_PERSON:          { border: 'border-orange-500', bg: 'bg-orange-950/80', text: 'text-orange-300', label: 'WANTED PERSON',   icon: 'user-x' },
      MISSING_PERSON_VEHICLE: { border: 'border-yellow-500', bg: 'bg-yellow-950/80', text: 'text-yellow-300', label: 'MISSING PERSON',  icon: 'eye' },
      BLACKLISTED_VEHICLE:    { border: 'border-purple-600', bg: 'bg-purple-950/80', text: 'text-purple-300', label: 'BLACKLISTED',     icon: 'ban' },
      SUSPECT_VEHICLE:        { border: 'border-amber-500',  bg: 'bg-amber-950/80',  text: 'text-amber-300',  label: 'SUSPECT VEHICLE', icon: 'alert-triangle' },
    }
    function catStyle(cat) {
      return CAT_STYLES[cat] || { border: 'border-slate-600', bg: 'bg-slate-900/80', text: 'text-slate-300', label: cat, icon: 'alert-circle' }
    }
    function priorityDotClass(p) {
      if (p === 'CRITICAL' || p === 'HIGH') return 'bg-red-500 animate-ping'
      if (p === 'MEDIUM') return 'bg-amber-500'
      return 'bg-slate-500'
    }

    async function init() {
      lucide.createIcons()
      await loadVideos()
      startStream()
      startPolling()
    }

    async function loadVideos() {
      try {
        const res = await fetch('/api/synthetic/videos')
        videosData = await res.json()
        const shelf = document.getElementById('video-shelf')
        const uploadCard = shelf.firstElementChild
        shelf.innerHTML = ''
        shelf.appendChild(uploadCard)
        videosData.forEach(v => {
          const isSel = v.filename === currentVideo
          const div = document.createElement('div')
          div.className = `cursor-pointer rounded-lg overflow-hidden border transition-all ${isSel ? 'border-cyan-400 ring-2 ring-cyan-500/40 bg-police-950' : 'border-police-800 hover:border-police-600 bg-police-950/60'}`
          div.onclick = () => selectVideo(v.filename)
          div.innerHTML = `
            <div class="aspect-video w-full bg-slate-950 relative">
              <img src="${v.thumbnail_url}" alt="${v.display_name}" class="w-full h-full object-cover" onerror="this.style.display='none'" />
              ${isSel ? '<span class="absolute top-1 left-1 px-1.5 py-0.2 bg-cyan-500 text-[8px] font-bold text-black rounded uppercase">ACTIVE</span>' : ''}
              <span class="absolute bottom-1 right-1 px-1 bg-black/80 text-[8px] font-mono text-slate-300 rounded">${v.duration_sec}s</span>
            </div>
            <div class="p-2 bg-police-950">
              <p class="text-[11px] font-medium text-white truncate">${v.display_name}</p>
              <p class="text-[9px] text-slate-400 font-mono">${v.width}x${v.height} \u2022 ${v.fps}fps</p>
            </div>`
          shelf.appendChild(div)
        })
        lucide.createIcons()
      } catch (err) { console.error('Failed to load videos', err) }
    }

    function selectVideo(fn) {
      currentVideo = fn; isPlaying = true; alertsList = []; detectionsList = []; prevAlertCount = 0
      document.getElementById('stream-paused-overlay').classList.add('hidden')
      loadVideos(); startStream()
    }

    function startStream() {
      const interval = document.getElementById('sel-interval').value
      const conf = document.getElementById('rng-conf').value
      document.getElementById('mjpeg-stream').src = `/api/synthetic/stream?video=${encodeURIComponent(currentVideo)}&detector_interval=${interval}&conf=${conf}&_t=${Date.now()}`
    }

    function togglePlay() {
      isPlaying = !isPlaying
      const overlay = document.getElementById('stream-paused-overlay')
      const btn = document.getElementById('lbl-play-pause')
      if (isPlaying) { overlay.classList.add('hidden'); btn.innerText = "Pause"; startStream() }
      else { overlay.classList.remove('hidden'); btn.innerText = "Resume"; document.getElementById('mjpeg-stream').src = "" }
    }

    function restartStream() {
      isPlaying = true; document.getElementById('stream-paused-overlay').classList.add('hidden'); startStream()
    }

    function updateStreamParams() {
      document.getElementById('lbl-conf').innerText = Math.round(document.getElementById('rng-conf').value * 100) + '%'
      if (isPlaying) startStream()
    }

    async function uploadCustomVideo(input) {
      const file = input.files[0]; if (!file) return
      const statusLbl = document.getElementById('upload-status'); statusLbl.innerText = "Uploading..."
      const formData = new FormData(); formData.append('file', file)
      try {
        const res = await fetch('/api/synthetic/upload', { method: 'POST', body: formData })
        if (!res.ok) throw new Error("Upload failed")
        const data = await res.json(); await loadVideos(); selectVideo(data.filename); statusLbl.innerText = "Success!"
      } catch (e) { alert("Upload error: " + e.message); statusLbl.innerText = "Error" }
    }

    function startPolling() {
      setInterval(async () => {
        if (!isPlaying) return
        try {
          const [detRes, alertRes] = await Promise.all([
            fetch(`/api/synthetic/detections?video=${encodeURIComponent(currentVideo)}`),
            fetch(`/api/synthetic/alerts?video=${encodeURIComponent(currentVideo)}`)
          ])
          if (detRes.ok) {
            const data = await detRes.json()
            detectionsList = data.vehicles || []
            document.getElementById('stat-vehicles').innerText = data.total_detected || 0
            document.getElementById('stat-plates').innerText = data.total_plates_identified || 0
          }
          if (alertRes.ok) {
            alertsList = await alertRes.json()
            const newCount = alertsList.filter(a => a.status === 'NEW').length
            if (alertsList.length > prevAlertCount) switchTab('alerts')
            prevAlertCount = alertsList.length
            updateAlertUI(newCount)
          }
          document.getElementById('tab-label-detections').innerText = `Vehicles (${detectionsList.length})`
          document.getElementById('tab-label-alerts').innerText = `Alerts (${alertsList.length})`
          renderDetections(); renderAlerts()
        } catch (e) {}
      }, 1200)
    }

    function updateAlertUI(newCount) {
      const statBox = document.getElementById('stat-alerts-box')
      const banner = document.getElementById('alert-banner')
      const badge = document.getElementById('tab-alerts-badge')
      document.getElementById('stat-alerts').innerText = newCount
      if (newCount > 0) {
        statBox.classList.remove('hidden'); banner.classList.remove('hidden')
        document.getElementById('alert-banner-text').innerText =
          `\u26a0 WATCHLIST MATCH \u2014 ${newCount} unacknowledged alert${newCount > 1 ? 's' : ''} require operator attention`
        badge.classList.remove('hidden'); badge.innerText = newCount
      } else {
        statBox.classList.add('hidden'); banner.classList.add('hidden'); badge.classList.add('hidden')
      }
    }

    function switchTab(tab) {
      const detBtn = document.getElementById('tab-btn-detections')
      const altBtn = document.getElementById('tab-btn-alerts')
      const detCont = document.getElementById('detections-container')
      const altCont = document.getElementById('alerts-container')
      const subDet = document.getElementById('tab-sub-detections')
      const subDetBtn = document.getElementById('tab-sub-detections-btn')
      const subAlt = document.getElementById('tab-sub-alerts')
      if (tab === 'detections') {
        detBtn.className = 'flex-1 flex items-center justify-center gap-2 py-3 text-xs font-semibold text-cyan-300 border-b-2 border-cyan-400 bg-cyan-950/20 transition-colors'
        altBtn.className = 'flex-1 flex items-center justify-center gap-2 py-3 text-xs font-semibold text-slate-400 hover:text-white relative transition-colors'
        detCont.classList.remove('hidden'); altCont.classList.add('hidden')
        subDet.classList.remove('hidden'); subDetBtn.classList.remove('hidden'); subAlt.classList.add('hidden')
      } else {
        altBtn.className = 'flex-1 flex items-center justify-center gap-2 py-3 text-xs font-semibold text-red-300 border-b-2 border-red-500 bg-red-950/20 relative transition-colors'
        detBtn.className = 'flex-1 flex items-center justify-center gap-2 py-3 text-xs font-semibold text-slate-400 hover:text-white transition-colors'
        altCont.classList.remove('hidden'); detCont.classList.add('hidden')
        subAlt.classList.remove('hidden'); subDet.classList.add('hidden'); subDetBtn.classList.add('hidden')
        const nc = alertsList.filter(a => a.status === 'NEW').length
        subAlt.innerText = nc > 0 ? `${nc} unacknowledged \u2014 click Acknowledge to clear` : 'No pending alerts'
      }
      lucide.createIcons()
    }

    function renderDetections() {
      const container = document.getElementById('detections-container')
      const query = document.getElementById('inp-search').value.toUpperCase()
      const filtered = detectionsList.filter(d => {
        if (!query) return true
        return d.track_id.toUpperCase().includes(query) ||
               (d.plate_number && d.plate_number.toUpperCase().includes(query)) ||
               d.vehicle_type.toUpperCase().includes(query)
      })
      if (filtered.length === 0) {
        container.innerHTML = `<div class="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500"><i data-lucide="car" class="w-8 h-8 mb-2 opacity-40 text-cyan-400"></i><p class="text-xs">No vehicles detected yet</p></div>`
        lucide.createIcons(); return
      }
      container.innerHTML = filtered.map(v => {
        const hasPlate = Boolean(v.plate_number)
        const isMatch = Boolean(v.is_watchlist_match)
        const cs = isMatch && v.watchlist_category ? catStyle(v.watchlist_category) : null
        return `<div class="p-3 rounded-lg border transition-all space-y-2 ${isMatch ? 'bg-red-950/30 border-red-700/70' : 'bg-police-950 border-police-800/90 hover:border-cyan-500/50'}">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="px-2 py-0.5 rounded ${isMatch ? 'bg-red-950 text-red-300 border border-red-700' : 'bg-cyan-950 text-cyan-400 border border-cyan-800'} text-[11px] font-mono font-bold">${v.track_id}</span>
              <span class="text-xs font-semibold text-white capitalize">${v.vehicle_type}</span>
            </div>
            <div class="flex items-center gap-1.5">
              ${isMatch && cs ? `<span class="flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold border ${cs.bg} ${cs.border} ${cs.text}"><i data-lucide="${cs.icon}" class="w-3 h-3"></i>${cs.label}</span>` : ''}
              <span class="text-[10px] text-slate-400 font-mono">${v.last_seen_sec.toFixed(1)}s</span>
            </div>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-[10px] text-slate-400 uppercase">Plate:</span>
            ${hasPlate ? `<span class="px-2 py-0.5 rounded font-mono font-bold text-xs tracking-wider border ${isMatch ? 'bg-red-950/90 border-red-600 text-red-300' : 'bg-emerald-950 border-emerald-600 text-emerald-300'}">${v.plate_number}</span>` : `<span class="text-[11px] text-amber-400/80 italic font-mono">Scanning...</span>`}
          </div>
          ${isMatch && v.watchlist_description ? `<div class="text-[10px] text-red-300/80 bg-red-950/30 rounded px-2 py-1 border border-red-900/60 italic">${v.watchlist_description}${v.watchlist_case_number ? ` <span class="font-mono font-bold text-red-400">#${v.watchlist_case_number}</span>` : ''}</div>` : ''}
          ${(v.vehicle_snapshot_url || v.plate_snapshot_url) ? `<div class="flex items-center gap-2 pt-1 border-t border-police-800/60">
            ${v.vehicle_snapshot_url ? `<a href="${v.vehicle_snapshot_url}" target="_blank" class="w-14 h-9 bg-black rounded border border-police-700 overflow-hidden block"><img src="${v.vehicle_snapshot_url}" class="w-full h-full object-cover" /></a>` : ''}
            ${v.plate_snapshot_url ? `<a href="${v.plate_snapshot_url}" target="_blank" class="w-16 h-7 bg-black rounded border ${isMatch ? 'border-red-700' : 'border-emerald-600'} overflow-hidden flex items-center justify-center block"><img src="${v.plate_snapshot_url}" class="w-full h-full object-contain" /></a>` : ''}
            <span class="text-[9px] text-slate-500 ml-auto">Click to enlarge</span></div>` : ''}
        </div>`
      }).join('')
      lucide.createIcons()
    }

    function renderAlerts() {
      const container = document.getElementById('alerts-container')
      if (alertsList.length === 0) {
        container.innerHTML = `<div class="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500"><i data-lucide="shield-check" class="w-8 h-8 mb-2 opacity-40 text-emerald-400"></i><p class="text-xs text-emerald-400/60 font-semibold">No Alerts Generated</p><p class="text-[10px] mt-1">Alerts appear when a detected vehicle matches the classified watchlist database</p></div>`
        lucide.createIcons(); return
      }
      container.innerHTML = alertsList.map(alert => {
        const cs = catStyle(alert.category)
        const isNew = alert.status === 'NEW'
        const ackTime = alert.acknowledged_at ? new Date(alert.acknowledged_at).toLocaleTimeString() : ''
        return `<div class="rounded-lg border overflow-hidden ${isNew ? `${cs.bg} ${cs.border} shadow-lg` : 'bg-police-900/40 border-police-700'}">
          <div class="flex items-center justify-between px-3 py-2 ${isNew ? 'bg-black/30' : 'bg-police-900/50'}">
            <div class="flex items-center gap-2">
              <span class="flex items-center gap-1 ${isNew ? cs.text : 'text-slate-400'}"><i data-lucide="${cs.icon}" class="w-3.5 h-3.5"></i><span class="text-[11px] font-bold">${cs.label}</span></span>
              ${isNew ? '<span class="px-1.5 py-0.5 bg-red-600 text-white text-[9px] font-bold rounded uppercase animate-pulse">NEW</span>' : '<span class="px-1.5 py-0.5 bg-slate-700 text-slate-300 text-[9px] font-bold rounded uppercase">ACK</span>'}
            </div>
            <div class="flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full inline-flex ${priorityDotClass(alert.priority)}"></span>
              <span class="text-[10px] font-bold font-mono text-slate-300">${alert.priority}</span>
            </div>
          </div>
          <div class="px-3 py-2.5 space-y-1.5">
            <div class="flex items-center gap-2 flex-wrap">
              <span class="px-2.5 py-0.5 rounded font-mono font-bold text-sm tracking-widest border ${cs.bg} ${cs.border} ${cs.text}">${alert.registration_number}</span>
              <span class="text-[11px] text-slate-400 font-mono">${alert.track_id}</span>
              <span class="text-[10px] font-mono ${alert.match_type === 'EXACT_MATCH' ? 'text-red-400' : 'text-amber-400'}">${alert.match_type === 'EXACT_MATCH' ? '\u26a1 EXACT' : '~ FUZZY'}</span>
            </div>
            <p class="text-[11px] text-slate-300 leading-tight">${alert.description}</p>
            <div class="flex items-center gap-3 text-[10px] text-slate-400 font-mono">
              ${alert.case_number ? `<span>Case: <span class="text-slate-200">${alert.case_number}</span></span>` : ''}
              <span>Score: <span class="text-emerald-400">${(alert.match_score * 100).toFixed(0)}%</span></span>
              <span>@${alert.detected_at_sec.toFixed(1)}s</span>
            </div>
            ${isNew
              ? `<button onclick="acknowledgeAlert('${alert.alert_id}')" class="mt-1 w-full flex items-center justify-center gap-1.5 py-1.5 rounded text-xs font-semibold border ${cs.border} ${cs.text} hover:bg-white/10"><i data-lucide="check-circle-2" class="w-3.5 h-3.5"></i> Acknowledge Alert</button>`
              : `<p class="text-[10px] text-slate-500 italic">\u2713 Acknowledged by ${alert.acknowledged_by || 'Operator'}${ackTime ? ' \u2022 ' + ackTime : ''}</p>`}
          </div>
        </div>`
      }).join('')
      lucide.createIcons()
    }

    async function acknowledgeAlert(alertId) {
      try {
        await fetch(`/api/synthetic/alerts/${alertId}/acknowledge?operator=Operator`, { method: 'POST' })
        alertsList = alertsList.map(a => a.alert_id === alertId ? { ...a, status: 'ACKNOWLEDGED' } : a)
        const newCount = alertsList.filter(a => a.status === 'NEW').length
        updateAlertUI(newCount); renderAlerts()
      } catch (e) { console.error('Acknowledge failed', e) }
    }

    function exportJSON() {
      const data = { video: currentVideo, exported_at: new Date().toISOString(), vehicles: detectionsList, alerts: alertsList }
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob)
      a.download = `cctv_synthetic_detections_${currentVideo}.json`; a.click()
    }

    window.onload = init
  </script>"""

html = html[:script_start] + NEW_SCRIPT + "\n</body>\n</html>"
HTML_PATH.write_text(html, encoding="utf-8")
print("Patch 4 (script) done. Length:", len(html))
