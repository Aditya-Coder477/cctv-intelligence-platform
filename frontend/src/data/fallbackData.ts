import { Camera, Alert, ObservedVehicle } from "../types"

export const FALLBACK_CAMERAS: Camera[] = ([
  {
    "camera_id": "cam01",
    "name": "01 Chiman bhai Bridge",
    "location": "Chimanbhai Bridge, Sabarmati, Ahmedabad",
    "latitude": 23.0673,
    "longitude": 72.5815,
    "status": "active_alert",
    "codec": "UNKNOWN",
    "width": null,
    "height": null,
    "fps": null,
    "bitrate": null,
    "rtsp_url": "rtsp://103.250.160.189:8554/stream/cam01",
    "hls_url": "https://cctv.corp8.cloud/cam01/index.m3u8",
    "webrtc_url": "http://103.250.160.189:8889/stream/cam01/whep",
    "timezone": null,
    "extra": {},
    "camera_type": "ANPR",
    "department": "Ahmedabad City Police",
    "ai_capabilities": [
      "Vehicle Detection",
      "ANPR",
      "Multi-Object Tracking"
    ],
    "is_spatial": true
  },
  {
    "camera_id": "cam02",
    "name": "02 Janpath",
    "location": "Janpath Crossroad, Ashram Road, Ahmedabad",
    "latitude": 23.0286,
    "longitude": 72.562,
    "status": "active_alert",
    "codec": "UNKNOWN",
    "width": null,
    "height": null,
    "fps": null,
    "bitrate": null,
    "rtsp_url": "rtsp://103.250.160.189:8554/stream/cam02",
    "hls_url": "https://cctv.corp8.cloud/cam02/index.m3u8",
    "webrtc_url": "http://103.250.160.189:8889/stream/cam02/whep",
    "timezone": null,
    "extra": {},
    "camera_type": "PTZ",
    "department": "Ahmedabad Traffic Branch",
    "ai_capabilities": [
      "Vehicle Detection",
      "ANPR",
      "Pan-Tilt Tracking"
    ],
    "is_spatial": true
  },
  {
    "camera_id": "cam03",
    "name": "03 O.N.G.C. Office",
    "location": "ONGC Complex, Chandkheda, Ahmedabad",
    "latitude": 23.0934,
    "longitude": 72.5878,
    "status": "online",
    "codec": "UNKNOWN",
    "width": null,
    "height": null,
    "fps": null,
    "bitrate": null,
    "rtsp_url": "rtsp://103.250.160.189:8554/stream/cam03",
    "hls_url": "https://cctv.corp8.cloud/cam03/index.m3u8",
    "webrtc_url": "http://103.250.160.189:8889/stream/cam03/whep",
    "timezone": null,
    "extra": {},
    "camera_type": "Fixed",
    "department": "Ahmedabad City Police",
    "ai_capabilities": [
      "Vehicle Detection",
      "Event Detection"
    ],
    "is_spatial": true
  },
  {
    "camera_id": "cam04",
    "name": "04 Paldi Circle",
    "location": "Paldi Crossroad, Ellisbridge, Ahmedabad",
    "latitude": 23.0135,
    "longitude": 72.5625,
    "status": "active_alert",
    "codec": "UNKNOWN",
    "width": null,
    "height": null,
    "fps": null,
    "bitrate": null,
    "rtsp_url": "rtsp://103.250.160.189:8554/stream/cam04",
    "hls_url": "https://cctv.corp8.cloud/cam04/index.m3u8",
    "webrtc_url": "http://103.250.160.189:8889/stream/cam04/whep",
    "timezone": null,
    "extra": {},
    "camera_type": "ANPR",
    "department": "Ahmedabad Traffic Branch",
    "ai_capabilities": [
      "Vehicle Detection",
      "ANPR",
      "Multi-Object Tracking"
    ],
    "is_spatial": true
  },
  {
    "camera_id": "cam05",
    "name": "05 Visat teen Rasta",
    "location": "Visat Three Roads, Sabarmati, Ahmedabad",
    "latitude": 23.097,
    "longitude": 72.5925,
    "status": "online",
    "codec": "UNKNOWN",
    "width": null,
    "height": null,
    "fps": null,
    "bitrate": null,
    "rtsp_url": "rtsp://103.250.160.189:8554/stream/cam05",
    "hls_url": "https://cctv.corp8.cloud/cam05/index.m3u8",
    "webrtc_url": "http://103.250.160.189:8889/stream/cam05/whep",
    "timezone": null,
    "extra": {},
    "camera_type": "Traffic",
    "department": "Ahmedabad Traffic Branch",
    "ai_capabilities": [
      "Vehicle Detection",
      "ANPR",
      "Speed Estimation"
    ],
    "is_spatial": true
  },
  {
    "camera_id": "cam06",
    "name": "06 Timbavadi gate-Junagadh",
    "location": "Timbavadi Gate, Junagadh City",
    "latitude": 21.516,
    "longitude": 70.4475,
    "status": "online",
    "codec": "UNKNOWN",
    "width": null,
    "height": null,
    "fps": null,
    "bitrate": null,
    "rtsp_url": "rtsp://103.250.160.189:8554/stream/cam06",
    "hls_url": "https://cctv.corp8.cloud/cam06/index.m3u8",
    "webrtc_url": "http://103.250.160.189:8889/stream/cam06/whep",
    "timezone": null,
    "extra": {},
    "camera_type": "Public Area",
    "department": "Junagadh Police",
    "ai_capabilities": [
      "Vehicle Detection",
      "Crowd Density"
    ],
    "is_spatial": true
  },
  {
    "camera_id": "cam07",
    "name": "07 hero-showroom-gir-somnath",
    "location": "Somnath Bypass Road, Veraval, Gir Somnath",
    "latitude": 20.9,
    "longitude": 70.3667,
    "status": "online",
    "codec": "UNKNOWN",
    "width": null,
    "height": null,
    "fps": null,
    "bitrate": null,
    "rtsp_url": "rtsp://103.250.160.189:8554/stream/cam07",
    "hls_url": "https://cctv.corp8.cloud/cam07/index.m3u8",
    "webrtc_url": "http://103.250.160.189:8889/stream/cam07/whep",
    "timezone": null,
    "extra": {},
    "camera_type": "ANPR",
    "department": "Gir Somnath Police",
    "ai_capabilities": [
      "Vehicle Detection",
      "ANPR",
      "Toll Logistics"
    ],
    "is_spatial": true
  },
  {
    "camera_id": "cam08",
    "name": "08 majewadi-gate-junagadh",
    "location": "Majewadi Gate, Old City, Junagadh",
    "latitude": 21.528,
    "longitude": 70.463,
    "status": "degraded",
    "codec": "UNKNOWN",
    "width": null,
    "height": null,
    "fps": null,
    "bitrate": null,
    "rtsp_url": "rtsp://103.250.160.189:8554/stream/cam08",
    "hls_url": "https://cctv.corp8.cloud/cam08/index.m3u8",
    "webrtc_url": "http://103.250.160.189:8889/stream/cam08/whep",
    "timezone": null,
    "extra": {},
    "camera_type": "Fixed",
    "department": "Junagadh Police",
    "ai_capabilities": [
      "Vehicle Detection"
    ],
    "is_spatial": true
  },
  {
    "camera_id": "cam09",
    "name": "09 new-bypass-near-by-circle-junagadh-2",
    "location": "National Highway Bypass Circle, Junagadh",
    "latitude": 21.505,
    "longitude": 70.471,
    "status": "online",
    "codec": "UNKNOWN",
    "width": null,
    "height": null,
    "fps": null,
    "bitrate": null,
    "rtsp_url": "rtsp://103.250.160.189:8554/stream/cam09",
    "hls_url": "https://cctv.corp8.cloud/cam09/index.m3u8",
    "webrtc_url": "http://103.250.160.189:8889/stream/cam09/whep",
    "timezone": null,
    "extra": {},
    "camera_type": "Traffic",
    "department": "Junagadh Highway Patrol",
    "ai_capabilities": [
      "Vehicle Detection",
      "Traffic Flow"
    ],
    "is_spatial": true
  },
  {
    "camera_id": "cam10",
    "name": "10 char-chowk-road-2-junagadh",
    "location": "Char Chowk Road, Junagadh Central",
    "latitude": 21.52,
    "longitude": 70.459,
    "status": "online",
    "codec": "UNKNOWN",
    "width": null,
    "height": null,
    "fps": null,
    "bitrate": null,
    "rtsp_url": "rtsp://103.250.160.189:8554/stream/cam10",
    "hls_url": "https://cctv.corp8.cloud/cam10/index.m3u8",
    "webrtc_url": "http://103.250.160.189:8889/stream/cam10/whep",
    "timezone": null,
    "extra": {},
    "camera_type": "PTZ",
    "department": "Junagadh Police",
    "ai_capabilities": [
      "Vehicle Detection",
      "Pan-Tilt Tracking"
    ],
    "is_spatial": true
  },
  {
    "camera_id": "cam11",
    "name": "11 dolatpara-junagadh",
    "location": "Dolatpara Industrial Area, Junagadh",
    "latitude": 21.536,
    "longitude": 70.474,
    "status": "online",
    "codec": "UNKNOWN",
    "width": null,
    "height": null,
    "fps": null,
    "bitrate": null,
    "rtsp_url": "rtsp://103.250.160.189:8554/stream/cam11",
    "hls_url": "https://cctv.corp8.cloud/cam11/index.m3u8",
    "webrtc_url": "http://103.250.160.189:8889/stream/cam11/whep",
    "timezone": null,
    "extra": {},
    "camera_type": "Fixed",
    "department": "Junagadh Police",
    "ai_capabilities": [
      "Vehicle Detection"
    ],
    "is_spatial": true
  },
  {
    "camera_id": "cam12",
    "name": "12 Tri Mandir Adalaj Tollnaka",
    "location": "Tri Mandir Toll Plaza, Adalaj, Gandhinagar",
    "latitude": 23.167,
    "longitude": 72.58,
    "status": "online",
    "codec": "UNKNOWN",
    "width": null,
    "height": null,
    "fps": null,
    "bitrate": null,
    "rtsp_url": "rtsp://103.250.160.189:8554/stream/cam12",
    "hls_url": "https://cctv.corp8.cloud/cam12/index.m3u8",
    "webrtc_url": "http://103.250.160.189:8889/stream/cam12/whep",
    "timezone": null,
    "extra": {},
    "camera_type": "ANPR",
    "department": "Gandhinagar Traffic Command",
    "ai_capabilities": [
      "Vehicle Detection",
      "ANPR",
      "Toll Logistics"
    ],
    "is_spatial": true
  },
  {
    "camera_id": "cam13",
    "name": "13 CN Vidhyalaya",
    "location": "CN Vidhyalaya Road, Ambawadi, Ahmedabad",
    "latitude": 23.024,
    "longitude": 72.545,
    "status": "online",
    "codec": "UNKNOWN",
    "width": null,
    "height": null,
    "fps": null,
    "bitrate": null,
    "rtsp_url": "rtsp://103.250.160.189:8554/stream/cam13",
    "hls_url": "https://cctv.corp8.cloud/cam13/index.m3u8",
    "webrtc_url": "http://103.250.160.189:8889/stream/cam13/whep",
    "timezone": null,
    "extra": {},
    "camera_type": "Public Area",
    "department": "Ahmedabad City Police",
    "ai_capabilities": [
      "Vehicle Detection"
    ],
    "is_spatial": true
  },
  {
    "camera_id": "cam14",
    "name": "14 Delight RLVD",
    "location": "Drive-In Road Junction, Vastrapur, Ahmedabad",
    "latitude": 23.038,
    "longitude": 72.531,
    "status": "online",
    "codec": "UNKNOWN",
    "width": null,
    "height": null,
    "fps": null,
    "bitrate": null,
    "rtsp_url": "rtsp://103.250.160.189:8554/stream/cam14",
    "hls_url": "https://cctv.corp8.cloud/cam14/index.m3u8",
    "webrtc_url": "http://103.250.160.189:8889/stream/cam14/whep",
    "timezone": null,
    "extra": {},
    "camera_type": "Fixed",
    "department": "Ahmedabad Traffic Branch",
    "ai_capabilities": [
      "Vehicle Detection",
      "Traffic Flow"
    ],
    "is_spatial": true
  },
  {
    "camera_id": "cam15",
    "name": "15 Suvidha park",
    "location": "Suvidha Park, Navrangpura, Ahmedabad",
    "latitude": 23.045,
    "longitude": 72.552,
    "status": "online",
    "codec": "UNKNOWN",
    "width": null,
    "height": null,
    "fps": null,
    "bitrate": null,
    "rtsp_url": "rtsp://103.250.160.189:8554/stream/cam15",
    "hls_url": "https://cctv.corp8.cloud/cam15/index.m3u8",
    "webrtc_url": "http://103.250.160.189:8889/stream/cam15/whep",
    "timezone": null,
    "extra": {},
    "camera_type": "Fixed",
    "department": "Ahmedabad City Police",
    "ai_capabilities": [
      "Vehicle Detection"
    ],
    "is_spatial": true
  },
  {
    "camera_id": "cam16",
    "name": "16 Visat P2",
    "location": "Visat Toll Point 2, Sabarmati, Ahmedabad",
    "latitude": 23.098,
    "longitude": 72.593,
    "status": "online",
    "codec": "UNKNOWN",
    "width": null,
    "height": null,
    "fps": null,
    "bitrate": null,
    "rtsp_url": "rtsp://103.250.160.189:8554/stream/cam16",
    "hls_url": "https://cctv.corp8.cloud/cam16/index.m3u8",
    "webrtc_url": "http://103.250.160.189:8889/stream/cam16/whep",
    "timezone": null,
    "extra": {},
    "camera_type": "ANPR",
    "department": "Ahmedabad Traffic Branch",
    "ai_capabilities": [
      "Vehicle Detection",
      "ANPR"
    ],
    "is_spatial": true
  },
  {
    "camera_id": "cam17",
    "name": "17 Rajkot Bus Port CCTV",
    "location": "Central Bus Port, Rajkot City",
    "latitude": 22.304,
    "longitude": 70.798,
    "status": "online",
    "codec": "UNKNOWN",
    "width": null,
    "height": null,
    "fps": null,
    "bitrate": null,
    "rtsp_url": "rtsp://103.250.160.189:8554/stream/cam17",
    "hls_url": "https://cctv.corp8.cloud/cam17/index.m3u8",
    "webrtc_url": "http://103.250.160.189:8889/stream/cam17/whep",
    "timezone": null,
    "extra": {},
    "camera_type": "Public Area",
    "department": "Rajkot City Police",
    "ai_capabilities": [
      "Vehicle Detection",
      "Crowd Density"
    ],
    "is_spatial": true
  },
  {
    "camera_id": "cam18",
    "name": "18 Rajkot CCTV",
    "location": "Dhebar Road Crossroad, Rajkot",
    "latitude": 22.301,
    "longitude": 70.802,
    "status": "degraded",
    "codec": "UNKNOWN",
    "width": null,
    "height": null,
    "fps": null,
    "bitrate": null,
    "rtsp_url": "rtsp://103.250.160.189:8554/stream/cam18",
    "hls_url": "https://cctv.corp8.cloud/cam18/index.m3u8",
    "webrtc_url": "http://103.250.160.189:8889/stream/cam18/whep",
    "timezone": null,
    "extra": {},
    "camera_type": "Traffic",
    "department": "Rajkot Traffic Police",
    "ai_capabilities": [
      "Vehicle Detection",
      "Traffic Flow"
    ],
    "is_spatial": true
  },
  {
    "camera_id": "cam19",
    "name": "19 KHAPARIA GRAM PANCHAYAT , TALUKA GANDEVI, DISTRICT NAVSARI",
    "location": "Khaparia Gram Panchayat, Gandevi, Navsari",
    "latitude": 20.82,
    "longitude": 72.99,
    "status": "online",
    "codec": "UNKNOWN",
    "width": null,
    "height": null,
    "fps": null,
    "bitrate": null,
    "rtsp_url": "rtsp://103.250.160.189:8554/stream/cam19",
    "hls_url": "https://cctv.corp8.cloud/cam19/index.m3u8",
    "webrtc_url": "http://103.250.160.189:8889/stream/cam19/whep",
    "timezone": null,
    "extra": {},
    "camera_type": "Fixed",
    "department": "Navsari Rural Police",
    "ai_capabilities": [
      "Vehicle Detection"
    ],
    "is_spatial": true
  },
  {
    "camera_id": "cam20",
    "name": "20 Mohanpura",
    "location": "Mohanpura Junction, Kalupur, Ahmedabad",
    "latitude": 23.033,
    "longitude": 72.592,
    "status": "online",
    "codec": "UNKNOWN",
    "width": null,
    "height": null,
    "fps": null,
    "bitrate": null,
    "rtsp_url": "rtsp://103.250.160.189:8554/stream/cam20",
    "hls_url": "https://cctv.corp8.cloud/cam20/index.m3u8",
    "webrtc_url": "http://103.250.160.189:8889/stream/cam20/whep",
    "timezone": null,
    "extra": {},
    "camera_type": "PTZ",
    "department": "Ahmedabad City Police",
    "ai_capabilities": [
      "Vehicle Detection",
      "Event Detection"
    ],
    "is_spatial": true
  },
  {
    "camera_id": "cam21",
    "name": "23 Patan Dethali Char Rasta",
    "location": "Dethali Char Rasta, Patan Highway",
    "latitude": 23.85,
    "longitude": 72.13,
    "status": "online",
    "codec": "UNKNOWN",
    "width": null,
    "height": null,
    "fps": null,
    "bitrate": null,
    "rtsp_url": "rtsp://103.250.160.189:8554/stream/cam21",
    "hls_url": "https://cctv.corp8.cloud/cam21/index.m3u8",
    "webrtc_url": "http://103.250.160.189:8889/stream/cam21/whep",
    "timezone": null,
    "extra": {},
    "camera_type": "Traffic",
    "department": "Patan District Police",
    "ai_capabilities": [
      "Vehicle Detection",
      "Highway Patrol"
    ],
    "is_spatial": true
  },
  {
    "camera_id": "cam22",
    "name": "28 BK Mervada tran Rasta",
    "location": "Mervada Three Roads, Banaskantha",
    "latitude": 24.17,
    "longitude": 72.43,
    "status": "offline",
    "codec": "UNKNOWN",
    "width": null,
    "height": null,
    "fps": null,
    "bitrate": null,
    "rtsp_url": "rtsp://103.250.160.189:8554/stream/cam22",
    "hls_url": "https://cctv.corp8.cloud/cam22/index.m3u8",
    "webrtc_url": "http://103.250.160.189:8889/stream/cam22/whep",
    "timezone": null,
    "extra": {},
    "camera_type": "Fixed",
    "department": "Banaskantha Police",
    "ai_capabilities": [
      "Vehicle Detection"
    ],
    "is_spatial": true
  },
  {
    "camera_id": "cam23",
    "name": "30 kheram",
    "location": "Kheram Junction, Sabarkantha",
    "latitude": 23.6,
    "longitude": 72.95,
    "status": "online",
    "codec": "UNKNOWN",
    "width": null,
    "height": null,
    "fps": null,
    "bitrate": null,
    "rtsp_url": "rtsp://103.250.160.189:8554/stream/cam23",
    "hls_url": "https://cctv.corp8.cloud/cam23/index.m3u8",
    "webrtc_url": "http://103.250.160.189:8889/stream/cam23/whep",
    "timezone": null,
    "extra": {},
    "camera_type": "Fixed",
    "department": "Sabarkantha Police",
    "ai_capabilities": [
      "Vehicle Detection"
    ],
    "is_spatial": true
  },
  {
    "camera_id": "cam24",
    "name": "33 dehgam",
    "location": "Dehgam Circle, Gandhinagar Highway",
    "latitude": 23.168,
    "longitude": 72.812,
    "status": "online",
    "codec": "UNKNOWN",
    "width": null,
    "height": null,
    "fps": null,
    "bitrate": null,
    "rtsp_url": "rtsp://103.250.160.189:8554/stream/cam24",
    "hls_url": "https://cctv.corp8.cloud/cam24/index.m3u8",
    "webrtc_url": "http://103.250.160.189:8889/stream/cam24/whep",
    "timezone": null,
    "extra": {},
    "camera_type": "Traffic",
    "department": "Gandhinagar Police",
    "ai_capabilities": [
      "Vehicle Detection",
      "Traffic Flow"
    ],
    "is_spatial": true
  },
  {
    "camera_id": "cam25",
    "name": "34 dhanori",
    "location": "Dhanori Road, Gandevi, Navsari",
    "latitude": 20.85,
    "longitude": 73.01,
    "status": "degraded",
    "codec": "UNKNOWN",
    "width": null,
    "height": null,
    "fps": null,
    "bitrate": null,
    "rtsp_url": "rtsp://103.250.160.189:8554/stream/cam25",
    "hls_url": "https://cctv.corp8.cloud/cam25/index.m3u8",
    "webrtc_url": "http://103.250.160.189:8889/stream/cam25/whep",
    "timezone": null,
    "extra": {},
    "camera_type": "Fixed",
    "department": "Navsari Rural Police",
    "ai_capabilities": [
      "Vehicle Detection"
    ],
    "is_spatial": true
  },
  {
    "camera_id": "cam26",
    "name": "35 TANKAL",
    "location": "Tankal Village Entrance, Navsari",
    "latitude": 20.78,
    "longitude": 73.05,
    "status": "offline",
    "codec": "UNKNOWN",
    "width": null,
    "height": null,
    "fps": null,
    "bitrate": null,
    "rtsp_url": "rtsp://103.250.160.189:8554/stream/cam26",
    "hls_url": "https://cctv.corp8.cloud/cam26/index.m3u8",
    "webrtc_url": "http://103.250.160.189:8889/stream/cam26/whep",
    "timezone": null,
    "extra": {},
    "camera_type": "Fixed",
    "department": "Navsari Rural Police",
    "ai_capabilities": [
      "Vehicle Detection"
    ],
    "is_spatial": true
  },
  {
    "camera_id": "cam27",
    "name": "36 bilimora",
    "location": "Station Road, Bilimora, Navsari",
    "latitude": 20.76,
    "longitude": 72.96,
    "status": "online",
    "codec": "UNKNOWN",
    "width": null,
    "height": null,
    "fps": null,
    "bitrate": null,
    "rtsp_url": "rtsp://103.250.160.189:8554/stream/cam27",
    "hls_url": "https://cctv.corp8.cloud/cam27/index.m3u8",
    "webrtc_url": "http://103.250.160.189:8889/stream/cam27/whep",
    "timezone": null,
    "extra": {},
    "camera_type": "Public Area",
    "department": "Bilimora Town Police",
    "ai_capabilities": [
      "Vehicle Detection",
      "Public Safety"
    ],
    "is_spatial": true
  },
  {
    "camera_id": "cam28",
    "name": "37 bilimora",
    "location": "Town Hall Circle, Bilimora",
    "latitude": 20.762,
    "longitude": 72.964,
    "status": "online",
    "codec": "UNKNOWN",
    "width": null,
    "height": null,
    "fps": null,
    "bitrate": null,
    "rtsp_url": "rtsp://103.250.160.189:8554/stream/cam28",
    "hls_url": "https://cctv.corp8.cloud/cam28/index.m3u8",
    "webrtc_url": "http://103.250.160.189:8889/stream/cam28/whep",
    "timezone": null,
    "extra": {},
    "camera_type": "PTZ",
    "department": "Bilimora Town Police",
    "ai_capabilities": [
      "Vehicle Detection",
      "Pan-Tilt Tracking"
    ],
    "is_spatial": true
  },
  {
    "camera_id": "cam29",
    "name": "38 bilimora",
    "location": "GIDC Entrance, Bilimora Highway",
    "latitude": 20.765,
    "longitude": 72.968,
    "status": "degraded",
    "codec": "UNKNOWN",
    "width": null,
    "height": null,
    "fps": null,
    "bitrate": null,
    "rtsp_url": "rtsp://103.250.160.189:8554/stream/cam29",
    "hls_url": "https://cctv.corp8.cloud/cam29/index.m3u8",
    "webrtc_url": "http://103.250.160.189:8889/stream/cam29/whep",
    "timezone": null,
    "extra": {},
    "camera_type": "ANPR",
    "department": "Bilimora Traffic Branch",
    "ai_capabilities": [
      "Vehicle Detection",
      "ANPR"
    ],
    "is_spatial": true
  },
  {
    "camera_id": "cam30",
    "name": "Gandhidham Rambaugh p2",
    "location": "Rambaugh Road, Point 2, Gandhidham, Kutch",
    "latitude": 23.076,
    "longitude": 70.133,
    "status": "online",
    "codec": "UNKNOWN",
    "width": null,
    "height": null,
    "fps": null,
    "bitrate": null,
    "rtsp_url": "rtsp://103.250.160.189:8554/stream/cam30",
    "hls_url": "https://cctv.corp8.cloud/cam30/index.m3u8",
    "webrtc_url": "http://103.250.160.189:8889/stream/cam30/whep",
    "timezone": null,
    "extra": {},
    "camera_type": "Traffic",
    "department": "Kutch East Police",
    "ai_capabilities": [
      "Vehicle Detection",
      "Toll Logistics"
    ],
    "is_spatial": true
  }
]) as unknown as Camera[]

export const FALLBACK_ALERTS: Alert[] = ([
  {
    "alert_id": "MATCH-cam01-TRK-5259-2728966",
    "match_id": "MATCH-cam01-TRK-5259-2728966",
    "observation_id": "OBS-cam01-TRK-5259-2728966",
    "registration_number": "JEETMS32",
    "normalized_registration_number": "JEETMS32",
    "watchlist_id": "WL-VEH-000003",
    "category": "DEMO_BLACKLISTED_VEHICLE",
    "priority": "LOW",
    "decision": "MATCH",
    "camera_id": "cam01",
    "track_id": "TRK-5259",
    "status": "ACKNOWLEDGED",
    "recognition_confidence": 0.4296,
    "consensus_score": 0.5378,
    "first_seen_pts_ms": 2726466.0,
    "recognition_pts_ms": 2728966.0,
    "source_time": null,
    "source_time_status": "NOT_RESOLVED",
    "evidence_image": null,
    "evidence_url": null,
    "matched_at_utc": "2026-09-14T13:32:22.921981+00:00",
    "acknowledged_by": "Officer Patel",
    "acknowledged_at": "2026-09-14T15:21:28.337172+00:00",
    "operator_notes": "Dispatched unit 4",
    "audit_history": [
      {
        "timestamp": "2026-09-14T13:32:22.921981+00:00",
        "action": "TRIGGERED",
        "operator": "SYSTEM (AI Watchlist Matcher)",
        "notes": "Match detected with score 1.00"
      },
      {
        "timestamp": "2026-09-14T15:21:28.337172+00:00",
        "action": "ACKNOWLEDGE",
        "operator": "Officer Patel",
        "notes": "Dispatched unit 4"
      }
    ]
  },
  {
    "alert_id": "MATCH-cam02-TRK-0336-171966",
    "match_id": "MATCH-cam02-TRK-0336-171966",
    "observation_id": "OBS-cam02-TRK-0336-171966",
    "registration_number": "CHMBHBIC",
    "normalized_registration_number": "CHMBHBIC",
    "watchlist_id": "WL-VEH-000006",
    "category": "DEMO_BLACKLISTED_VEHICLE",
    "priority": "LOW",
    "decision": "MATCH",
    "camera_id": "cam02",
    "track_id": "TRK-0336",
    "status": "NEW",
    "recognition_confidence": 0.7858,
    "consensus_score": 0.64,
    "first_seen_pts_ms": 171966.0,
    "recognition_pts_ms": 171966.0,
    "source_time": null,
    "source_time_status": "NOT_RESOLVED",
    "evidence_image": null,
    "evidence_url": null,
    "matched_at_utc": "2026-09-14T13:32:22.932227+00:00",
    "acknowledged_by": null,
    "acknowledged_at": null,
    "operator_notes": null,
    "audit_history": [
      {
        "timestamp": "2026-09-14T13:32:22.932227+00:00",
        "action": "TRIGGERED",
        "operator": "SYSTEM (AI Watchlist Matcher)",
        "notes": "Match detected with score 1.00"
      }
    ]
  },
  {
    "alert_id": "MATCH-cam04-TRK-0336-171966",
    "match_id": "MATCH-cam04-TRK-0336-171966",
    "observation_id": "OBS-cam04-TRK-0336-171966",
    "registration_number": "CHMBHBIC",
    "normalized_registration_number": "CHMBHBIC",
    "watchlist_id": "WL-VEH-000006",
    "category": "DEMO_BLACKLISTED_VEHICLE",
    "priority": "LOW",
    "decision": "MATCH",
    "camera_id": "cam04",
    "track_id": "TRK-0336",
    "status": "NEW",
    "recognition_confidence": 0.7858,
    "consensus_score": 0.64,
    "first_seen_pts_ms": 171966.0,
    "recognition_pts_ms": 171966.0,
    "source_time": null,
    "source_time_status": "NOT_RESOLVED",
    "evidence_image": null,
    "evidence_url": null,
    "matched_at_utc": "2026-09-14T13:32:22.952727+00:00",
    "acknowledged_by": null,
    "acknowledged_at": null,
    "operator_notes": null,
    "audit_history": [
      {
        "timestamp": "2026-09-14T13:32:22.952727+00:00",
        "action": "TRIGGERED",
        "operator": "SYSTEM (AI Watchlist Matcher)",
        "notes": "Match detected with score 1.00"
      }
    ]
  },
  {
    "alert_id": "ALT-8-TRK-0002-1",
    "match_id": "ALT-8-TRK-0002-1",
    "observation_id": "OBS-8.mp4-TRK-0002",
    "registration_number": "KA 02 MN 1826",
    "normalized_registration_number": "KA 02 MN 1826",
    "watchlist_id": "WL-SYN-000026",
    "category": "STOLEN_VEHICLE",
    "priority": "CRITICAL",
    "decision": "MATCH",
    "camera_id": "synthetic_8",
    "track_id": "TRK-0002",
    "status": "NEW",
    "recognition_confidence": 0.0,
    "consensus_score": 0.0,
    "first_seen_pts_ms": null,
    "recognition_pts_ms": null,
    "source_time": null,
    "source_time_status": "NOT_RESOLVED",
    "evidence_image": null,
    "evidence_url": null,
    "matched_at_utc": "2026-09-14T17:18:43.550116+00:00",
    "acknowledged_by": null,
    "acknowledged_at": null,
    "operator_notes": null,
    "audit_history": [
      {
        "timestamp": "2026-09-14T17:18:43.550116+00:00",
        "action": "TRIGGERED",
        "operator": "AI Synthetic Surveillance Engine",
        "notes": "Match detected with score 1.00 via EXACT_MATCH (STOLEN_VEHICLE)"
      }
    ]
  },
  {
    "alert_id": "ALT-5-TRK-0001-7",
    "match_id": "ALT-5-TRK-0001-7",
    "observation_id": "OBS-5.mp4-TRK-0001",
    "registration_number": "7L644344",
    "normalized_registration_number": "7L644344",
    "watchlist_id": "WL-SYN-000012",
    "category": "SUSPECT_VEHICLE",
    "priority": "LOW",
    "decision": "MATCH",
    "camera_id": "synthetic_5",
    "track_id": "TRK-0001",
    "status": "NEW",
    "recognition_confidence": 0.0,
    "consensus_score": 0.0,
    "first_seen_pts_ms": null,
    "recognition_pts_ms": null,
    "source_time": null,
    "source_time_status": "NOT_RESOLVED",
    "evidence_image": null,
    "evidence_url": null,
    "matched_at_utc": "2026-09-14T17:46:31.777100+00:00",
    "acknowledged_by": null,
    "acknowledged_at": null,
    "operator_notes": null,
    "audit_history": [
      {
        "timestamp": "2026-09-14T17:46:31.777100+00:00",
        "action": "TRIGGERED",
        "operator": "AI Synthetic Surveillance Engine",
        "notes": "Match detected with score 1.00 via EXACT_MATCH (SUSPECT_VEHICLE)"
      }
    ]
  },
  {
    "alert_id": "ALT-1-TRK-0001-11",
    "match_id": "ALT-1-TRK-0001-11",
    "observation_id": "OBS-1.mp4-TRK-0001",
    "registration_number": "SMH6J43",
    "normalized_registration_number": "SMH6J43",
    "watchlist_id": "WL-SYN-000013",
    "category": "BLACKLISTED_VEHICLE",
    "priority": "LOW",
    "decision": "MATCH",
    "camera_id": "synthetic_1",
    "track_id": "TRK-0001",
    "status": "NEW",
    "recognition_confidence": 0.0,
    "consensus_score": 0.0,
    "first_seen_pts_ms": null,
    "recognition_pts_ms": null,
    "source_time": null,
    "source_time_status": "NOT_RESOLVED",
    "evidence_image": null,
    "evidence_url": null,
    "matched_at_utc": "2026-09-14T17:53:06.497982+00:00",
    "acknowledged_by": null,
    "acknowledged_at": null,
    "operator_notes": null,
    "audit_history": [
      {
        "timestamp": "2026-09-14T17:53:06.497982+00:00",
        "action": "TRIGGERED",
        "operator": "AI Synthetic Surveillance Engine",
        "notes": "Match detected with score 1.00 via EXACT_MATCH (BLACKLISTED_VEHICLE)"
      }
    ]
  },
  {
    "alert_id": "ALT-8-KA02MN1826",
    "match_id": "ALT-8-KA02MN1826",
    "observation_id": "OBS-8.mp4-TRK-0001",
    "registration_number": "KA02MN1826",
    "normalized_registration_number": "KA02MN1826",
    "watchlist_id": "WL-SYN-000026",
    "category": "STOLEN_VEHICLE",
    "priority": "CRITICAL",
    "decision": "MATCH",
    "camera_id": "synthetic_8",
    "track_id": "TRK-0001",
    "status": "NEW",
    "recognition_confidence": 0.0,
    "consensus_score": 0.0,
    "first_seen_pts_ms": null,
    "recognition_pts_ms": null,
    "source_time": null,
    "source_time_status": "NOT_RESOLVED",
    "evidence_image": null,
    "evidence_url": null,
    "matched_at_utc": "2026-09-14T18:16:26.248398+00:00",
    "acknowledged_by": null,
    "acknowledged_at": null,
    "operator_notes": null,
    "audit_history": [
      {
        "timestamp": "2026-09-14T18:16:26.248398+00:00",
        "action": "TRIGGERED",
        "operator": "AI Synthetic Surveillance Engine",
        "notes": "Match detected with score 1.00 via EXACT_MATCH (STOLEN_VEHICLE)"
      }
    ]
  }
]) as unknown as Alert[]

export const FALLBACK_VEHICLES: ObservedVehicle[] = ([
  {
    "vehicle_id": "VEH-000001",
    "registration_number": "CHME",
    "normalized_registration_number": "CHME",
    "first_seen": {
      "camera_id": "cam01",
      "pts_ms": 17966.0,
      "source_time": null,
      "source_time_status": "NOT_RESOLVED"
    },
    "last_seen": {
      "camera_id": "cam04",
      "pts_ms": 441466.0,
      "source_time": null,
      "source_time_status": "NOT_RESOLVED"
    },
    "camera_count": 3,
    "cameras": [
      "cam01",
      "cam02",
      "cam04"
    ],
    "observation_count": 3,
    "track_count": 2,
    "best_consensus_score": 0.87,
    "average_consensus_score": 0.7598,
    "status": "OBSERVED",
    "timeline": [
      {
        "camera_id": "cam01",
        "track_id": "TRK-0047",
        "first_seen_pts_ms": 17966.0,
        "recognition_pts_ms": 22966.0,
        "last_seen_pts_ms": 22966.0,
        "source_time": null,
        "source_time_status": "NOT_RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.5394,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-14T13:32:02.800754+00:00",
        "evidence_url": null
      },
      {
        "camera_id": "cam02",
        "track_id": "TRK-0864",
        "first_seen_pts_ms": 440466.0,
        "recognition_pts_ms": 440466.0,
        "last_seen_pts_ms": 441466.0,
        "source_time": null,
        "source_time_status": "NOT_RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.87,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-14T13:32:02.978197+00:00",
        "evidence_url": null
      },
      {
        "camera_id": "cam04",
        "track_id": "TRK-0864",
        "first_seen_pts_ms": 440466.0,
        "recognition_pts_ms": 440466.0,
        "last_seen_pts_ms": 441466.0,
        "source_time": null,
        "source_time_status": "NOT_RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.87,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-14T13:32:03.188469+00:00",
        "evidence_url": null
      }
    ],
    "ingested_at_utc": "2026-09-14T13:32:03.263209+00:00",
    "updated_at_utc": "2026-09-14T13:32:03.263209+00:00"
  },
  {
    "vehicle_id": "VEH-000002",
    "registration_number": "CHBHB9ECSITM",
    "normalized_registration_number": "CHBHB9ECSITM",
    "first_seen": {
      "camera_id": "cam01",
      "pts_ms": 48966.0,
      "source_time": null,
      "source_time_status": "NOT_RESOLVED"
    },
    "last_seen": {
      "camera_id": "cam04",
      "pts_ms": 49966.0,
      "source_time": null,
      "source_time_status": "NOT_RESOLVED"
    },
    "camera_count": 3,
    "cameras": [
      "cam01",
      "cam02",
      "cam04"
    ],
    "observation_count": 3,
    "track_count": 1,
    "best_consensus_score": 0.7629,
    "average_consensus_score": 0.7629,
    "status": "OBSERVED",
    "timeline": [
      {
        "camera_id": "cam01",
        "track_id": "TRK-0117",
        "first_seen_pts_ms": 48966.0,
        "recognition_pts_ms": 48966.0,
        "last_seen_pts_ms": 49966.0,
        "source_time": null,
        "source_time_status": "NOT_RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.7629,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-14T13:32:02.801798+00:00",
        "evidence_url": null
      },
      {
        "camera_id": "cam02",
        "track_id": "TRK-0117",
        "first_seen_pts_ms": 48966.0,
        "recognition_pts_ms": 48966.0,
        "last_seen_pts_ms": 49966.0,
        "source_time": null,
        "source_time_status": "NOT_RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.7629,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-14T13:32:02.961122+00:00",
        "evidence_url": null
      },
      {
        "camera_id": "cam04",
        "track_id": "TRK-0117",
        "first_seen_pts_ms": 48966.0,
        "recognition_pts_ms": 48966.0,
        "last_seen_pts_ms": 49966.0,
        "source_time": null,
        "source_time_status": "NOT_RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.7629,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-14T13:32:03.179441+00:00",
        "evidence_url": null
      }
    ],
    "ingested_at_utc": "2026-09-14T13:32:03.262679+00:00",
    "updated_at_utc": "2026-09-14T13:32:03.262679+00:00"
  },
  {
    "vehicle_id": "VEH-000003",
    "registration_number": "CHMABHB9ECS",
    "normalized_registration_number": "CHMABHB9ECS",
    "first_seen": {
      "camera_id": "cam01",
      "pts_ms": 170437.0,
      "source_time": null,
      "source_time_status": "NOT_RESOLVED"
    },
    "last_seen": {
      "camera_id": "cam01",
      "pts_ms": 172437.0,
      "source_time": null,
      "source_time_status": "NOT_RESOLVED"
    },
    "camera_count": 1,
    "cameras": [
      "cam01"
    ],
    "observation_count": 1,
    "track_count": 1,
    "best_consensus_score": 0.5015,
    "average_consensus_score": 0.5015,
    "status": "OBSERVED",
    "timeline": [
      {
        "camera_id": "cam01",
        "track_id": "TRK-0538",
        "first_seen_pts_ms": 170437.0,
        "recognition_pts_ms": 170437.0,
        "last_seen_pts_ms": 172437.0,
        "source_time": null,
        "source_time_status": "NOT_RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.5015,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-14T13:32:02.811339+00:00",
        "evidence_url": null
      }
    ],
    "ingested_at_utc": "2026-09-14T13:32:02.925642+00:00",
    "updated_at_utc": "2026-09-14T13:32:02.925642+00:00"
  },
  {
    "vehicle_id": "VEH-000004",
    "registration_number": "SODH",
    "normalized_registration_number": "SODH",
    "first_seen": {
      "camera_id": "cam01",
      "pts_ms": 318466.0,
      "source_time": null,
      "source_time_status": "NOT_RESOLVED"
    },
    "last_seen": {
      "camera_id": "cam01",
      "pts_ms": 319966.0,
      "source_time": null,
      "source_time_status": "NOT_RESOLVED"
    },
    "camera_count": 1,
    "cameras": [
      "cam01"
    ],
    "observation_count": 1,
    "track_count": 1,
    "best_consensus_score": 0.7967,
    "average_consensus_score": 0.7967,
    "status": "OBSERVED",
    "timeline": [
      {
        "camera_id": "cam01",
        "track_id": "TRK-0657",
        "first_seen_pts_ms": 318466.0,
        "recognition_pts_ms": 319966.0,
        "last_seen_pts_ms": 319966.0,
        "source_time": null,
        "source_time_status": "NOT_RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.7967,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-14T13:32:02.815066+00:00",
        "evidence_url": null
      }
    ],
    "ingested_at_utc": "2026-09-14T13:32:02.925642+00:00",
    "updated_at_utc": "2026-09-14T13:32:02.925642+00:00"
  },
  {
    "vehicle_id": "VEH-000005",
    "registration_number": "5632PT",
    "normalized_registration_number": "5632PT",
    "first_seen": {
      "camera_id": "cam01",
      "pts_ms": 366966.0,
      "source_time": null,
      "source_time_status": "NOT_RESOLVED"
    },
    "last_seen": {
      "camera_id": "cam04",
      "pts_ms": 366966.0,
      "source_time": null,
      "source_time_status": "NOT_RESOLVED"
    },
    "camera_count": 3,
    "cameras": [
      "cam01",
      "cam02",
      "cam04"
    ],
    "observation_count": 3,
    "track_count": 1,
    "best_consensus_score": 0.5585,
    "average_consensus_score": 0.5585,
    "status": "OBSERVED",
    "timeline": [
      {
        "camera_id": "cam01",
        "track_id": "TRK-0736",
        "first_seen_pts_ms": 366966.0,
        "recognition_pts_ms": 366966.0,
        "last_seen_pts_ms": 366966.0,
        "source_time": null,
        "source_time_status": "NOT_RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.5585,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-14T13:32:02.819399+00:00",
        "evidence_url": null
      },
      {
        "camera_id": "cam02",
        "track_id": "TRK-0736",
        "first_seen_pts_ms": 366966.0,
        "recognition_pts_ms": 366966.0,
        "last_seen_pts_ms": 366966.0,
        "source_time": null,
        "source_time_status": "NOT_RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.5585,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-14T13:32:02.973998+00:00",
        "evidence_url": null
      },
      {
        "camera_id": "cam04",
        "track_id": "TRK-0736",
        "first_seen_pts_ms": 366966.0,
        "recognition_pts_ms": 366966.0,
        "last_seen_pts_ms": 366966.0,
        "source_time": null,
        "source_time_status": "NOT_RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.5585,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-14T13:32:03.184743+00:00",
        "evidence_url": null
      }
    ],
    "ingested_at_utc": "2026-09-14T13:32:03.262679+00:00",
    "updated_at_utc": "2026-09-14T13:32:03.262679+00:00"
  },
  {
    "vehicle_id": "VEH-000006",
    "registration_number": "CHBHE",
    "normalized_registration_number": "CHBHE",
    "first_seen": {
      "camera_id": "cam01",
      "pts_ms": 402966.0,
      "source_time": null,
      "source_time_status": "NOT_RESOLVED"
    },
    "last_seen": {
      "camera_id": "cam04",
      "pts_ms": 403966.0,
      "source_time": null,
      "source_time_status": "NOT_RESOLVED"
    },
    "camera_count": 3,
    "cameras": [
      "cam01",
      "cam02",
      "cam04"
    ],
    "observation_count": 3,
    "track_count": 1,
    "best_consensus_score": 0.709,
    "average_consensus_score": 0.709,
    "status": "OBSERVED",
    "timeline": [
      {
        "camera_id": "cam01",
        "track_id": "TRK-0791",
        "first_seen_pts_ms": 402966.0,
        "recognition_pts_ms": 403466.0,
        "last_seen_pts_ms": 403966.0,
        "source_time": null,
        "source_time_status": "NOT_RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.709,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-14T13:32:02.823927+00:00",
        "evidence_url": null
      },
      {
        "camera_id": "cam02",
        "track_id": "TRK-0791",
        "first_seen_pts_ms": 402966.0,
        "recognition_pts_ms": 403466.0,
        "last_seen_pts_ms": 403966.0,
        "source_time": null,
        "source_time_status": "NOT_RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.709,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-14T13:32:02.976629+00:00",
        "evidence_url": null
      },
      {
        "camera_id": "cam04",
        "track_id": "TRK-0791",
        "first_seen_pts_ms": 402966.0,
        "recognition_pts_ms": 403466.0,
        "last_seen_pts_ms": 403966.0,
        "source_time": null,
        "source_time_status": "NOT_RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.709,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-14T13:32:03.186878+00:00",
        "evidence_url": null
      }
    ],
    "ingested_at_utc": "2026-09-14T13:32:03.262679+00:00",
    "updated_at_utc": "2026-09-14T13:32:03.262679+00:00"
  },
  {
    "vehicle_id": "VEH-000007",
    "registration_number": "CHMBHBE",
    "normalized_registration_number": "CHMBHBE",
    "first_seen": {
      "camera_id": "cam01",
      "pts_ms": 437466.0,
      "source_time": null,
      "source_time_status": "NOT_RESOLVED"
    },
    "last_seen": {
      "camera_id": "cam01",
      "pts_ms": 439466.0,
      "source_time": null,
      "source_time_status": "NOT_RESOLVED"
    },
    "camera_count": 1,
    "cameras": [
      "cam01"
    ],
    "observation_count": 1,
    "track_count": 1,
    "best_consensus_score": 0.539,
    "average_consensus_score": 0.539,
    "status": "OBSERVED",
    "timeline": [
      {
        "camera_id": "cam01",
        "track_id": "TRK-0854",
        "first_seen_pts_ms": 437466.0,
        "recognition_pts_ms": 438466.0,
        "last_seen_pts_ms": 439466.0,
        "source_time": null,
        "source_time_status": "NOT_RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.539,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-14T13:32:02.828790+00:00",
        "evidence_url": null
      }
    ],
    "ingested_at_utc": "2026-09-14T13:32:02.925642+00:00",
    "updated_at_utc": "2026-09-14T13:32:02.925642+00:00"
  },
  {
    "vehicle_id": "VEH-000008",
    "registration_number": "CHMAL",
    "normalized_registration_number": "CHMAL",
    "first_seen": {
      "camera_id": "cam01",
      "pts_ms": 440966.0,
      "source_time": null,
      "source_time_status": "NOT_RESOLVED"
    },
    "last_seen": {
      "camera_id": "cam01",
      "pts_ms": 441466.0,
      "source_time": null,
      "source_time_status": "NOT_RESOLVED"
    },
    "camera_count": 1,
    "cameras": [
      "cam01"
    ],
    "observation_count": 1,
    "track_count": 1,
    "best_consensus_score": 0.6093,
    "average_consensus_score": 0.6093,
    "status": "OBSERVED",
    "timeline": [
      {
        "camera_id": "cam01",
        "track_id": "TRK-0864",
        "first_seen_pts_ms": 440966.0,
        "recognition_pts_ms": 441466.0,
        "last_seen_pts_ms": 441466.0,
        "source_time": null,
        "source_time_status": "NOT_RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.6093,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-14T13:32:02.830430+00:00",
        "evidence_url": null
      }
    ],
    "ingested_at_utc": "2026-09-14T13:32:02.925642+00:00",
    "updated_at_utc": "2026-09-14T13:32:02.925642+00:00"
  },
  {
    "vehicle_id": "VEH-000009",
    "registration_number": "MS32",
    "normalized_registration_number": "MS32",
    "first_seen": {
      "camera_id": "cam01",
      "pts_ms": 465466.0,
      "source_time": null,
      "source_time_status": "NOT_RESOLVED"
    },
    "last_seen": {
      "camera_id": "cam01",
      "pts_ms": 467466.0,
      "source_time": null,
      "source_time_status": "NOT_RESOLVED"
    },
    "camera_count": 1,
    "cameras": [
      "cam01"
    ],
    "observation_count": 1,
    "track_count": 1,
    "best_consensus_score": 0.7353,
    "average_consensus_score": 0.7353,
    "status": "OBSERVED",
    "timeline": [
      {
        "camera_id": "cam01",
        "track_id": "TRK-0924",
        "first_seen_pts_ms": 465466.0,
        "recognition_pts_ms": 465466.0,
        "last_seen_pts_ms": 467466.0,
        "source_time": null,
        "source_time_status": "NOT_RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.7353,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-14T13:32:02.835339+00:00",
        "evidence_url": null
      }
    ],
    "ingested_at_utc": "2026-09-14T13:32:02.925642+00:00",
    "updated_at_utc": "2026-09-14T13:32:02.925642+00:00"
  },
  {
    "vehicle_id": "VEH-000010",
    "registration_number": "7IA4E",
    "normalized_registration_number": "7IA4E",
    "first_seen": {
      "camera_id": "cam01",
      "pts_ms": 497466.0,
      "source_time": null,
      "source_time_status": "NOT_RESOLVED"
    },
    "last_seen": {
      "camera_id": "cam01",
      "pts_ms": 499966.0,
      "source_time": null,
      "source_time_status": "NOT_RESOLVED"
    },
    "camera_count": 1,
    "cameras": [
      "cam01"
    ],
    "observation_count": 1,
    "track_count": 1,
    "best_consensus_score": 0.4855,
    "average_consensus_score": 0.4855,
    "status": "OBSERVED",
    "timeline": [
      {
        "camera_id": "cam01",
        "track_id": "TRK-0994",
        "first_seen_pts_ms": 497466.0,
        "recognition_pts_ms": 497466.0,
        "last_seen_pts_ms": 499966.0,
        "source_time": null,
        "source_time_status": "NOT_RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.4855,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-14T13:32:02.836936+00:00",
        "evidence_url": null
      }
    ],
    "ingested_at_utc": "2026-09-14T13:32:02.925642+00:00",
    "updated_at_utc": "2026-09-14T13:32:02.925642+00:00"
  },
  {
    "vehicle_id": "VEH-000011",
    "registration_number": "0BHB",
    "normalized_registration_number": "0BHB",
    "first_seen": {
      "camera_id": "cam01",
      "pts_ms": 612790.0,
      "source_time": null,
      "source_time_status": "NOT_RESOLVED"
    },
    "last_seen": {
      "camera_id": "cam01",
      "pts_ms": 616793.0,
      "source_time": null,
      "source_time_status": "NOT_RESOLVED"
    },
    "camera_count": 1,
    "cameras": [
      "cam01"
    ],
    "observation_count": 1,
    "track_count": 1,
    "best_consensus_score": 0.4827,
    "average_consensus_score": 0.4827,
    "status": "OBSERVED",
    "timeline": [
      {
        "camera_id": "cam01",
        "track_id": "TRK-1230",
        "first_seen_pts_ms": 612790.0,
        "recognition_pts_ms": 614793.0,
        "last_seen_pts_ms": 616793.0,
        "source_time": null,
        "source_time_status": "NOT_RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.4827,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-14T13:32:02.840640+00:00",
        "evidence_url": null
      }
    ],
    "ingested_at_utc": "2026-09-14T13:32:02.925642+00:00",
    "updated_at_utc": "2026-09-14T13:32:02.925642+00:00"
  },
  {
    "vehicle_id": "VEH-000012",
    "registration_number": "TMS32",
    "normalized_registration_number": "TMS32",
    "first_seen": {
      "camera_id": "cam01",
      "pts_ms": 627966.0,
      "source_time": null,
      "source_time_status": "NOT_RESOLVED"
    },
    "last_seen": {
      "camera_id": "cam04",
      "pts_ms": 628466.0,
      "source_time": null,
      "source_time_status": "NOT_RESOLVED"
    },
    "camera_count": 3,
    "cameras": [
      "cam01",
      "cam02",
      "cam04"
    ],
    "observation_count": 3,
    "track_count": 1,
    "best_consensus_score": 0.9119,
    "average_consensus_score": 0.9119,
    "status": "OBSERVED",
    "timeline": [
      {
        "camera_id": "cam01",
        "track_id": "TRK-1291",
        "first_seen_pts_ms": 627966.0,
        "recognition_pts_ms": 627966.0,
        "last_seen_pts_ms": 628466.0,
        "source_time": null,
        "source_time_status": "NOT_RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.9119,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-14T13:32:02.841174+00:00",
        "evidence_url": null
      },
      {
        "camera_id": "cam02",
        "track_id": "TRK-1291",
        "first_seen_pts_ms": 627966.0,
        "recognition_pts_ms": 627966.0,
        "last_seen_pts_ms": 628466.0,
        "source_time": null,
        "source_time_status": "NOT_RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.9119,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-14T13:32:02.987573+00:00",
        "evidence_url": null
      },
      {
        "camera_id": "cam04",
        "track_id": "TRK-1291",
        "first_seen_pts_ms": 627966.0,
        "recognition_pts_ms": 627966.0,
        "last_seen_pts_ms": 628466.0,
        "source_time": null,
        "source_time_status": "NOT_RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.9119,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-14T13:32:03.194914+00:00",
        "evidence_url": null
      }
    ],
    "ingested_at_utc": "2026-09-14T13:32:03.263209+00:00",
    "updated_at_utc": "2026-09-14T13:32:03.263209+00:00"
  },
  {
    "vehicle_id": "VEH-000013",
    "registration_number": "332PTZ2",
    "normalized_registration_number": "332PTZ2",
    "first_seen": {
      "camera_id": "cam01",
      "pts_ms": 870466.0,
      "source_time": null,
      "source_time_status": "NOT_RESOLVED"
    },
    "last_seen": {
      "camera_id": "cam04",
      "pts_ms": 870466.0,
      "source_time": null,
      "source_time_status": "NOT_RESOLVED"
    },
    "camera_count": 3,
    "cameras": [
      "cam01",
      "cam02",
      "cam04"
    ],
    "observation_count": 3,
    "track_count": 1,
    "best_consensus_score": 0.5656,
    "average_consensus_score": 0.5656,
    "status": "OBSERVED",
    "timeline": [
      {
        "camera_id": "cam01",
        "track_id": "TRK-1848",
        "first_seen_pts_ms": 870466.0,
        "recognition_pts_ms": 870466.0,
        "last_seen_pts_ms": 870466.0,
        "source_time": null,
        "source_time_status": "NOT_RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.5656,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-14T13:32:02.857946+00:00",
        "evidence_url": null
      },
      {
        "camera_id": "cam02",
        "track_id": "TRK-1848",
        "first_seen_pts_ms": 870466.0,
        "recognition_pts_ms": 870466.0,
        "last_seen_pts_ms": 870466.0,
        "source_time": null,
        "source_time_status": "NOT_RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.5656,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-14T13:32:03.003915+00:00",
        "evidence_url": null
      },
      {
        "camera_id": "cam04",
        "track_id": "TRK-1848",
        "first_seen_pts_ms": 870466.0,
        "recognition_pts_ms": 870466.0,
        "last_seen_pts_ms": 870466.0,
        "source_time": null,
        "source_time_status": "NOT_RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.5656,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-14T13:32:03.206693+00:00",
        "evidence_url": null
      }
    ],
    "ingested_at_utc": "2026-09-14T13:32:03.263209+00:00",
    "updated_at_utc": "2026-09-14T13:32:03.263209+00:00"
  },
  {
    "vehicle_id": "VEH-000014",
    "registration_number": "CHMBHB",
    "normalized_registration_number": "CHMBHB",
    "first_seen": {
      "camera_id": "cam01",
      "pts_ms": 1094466.0,
      "source_time": null,
      "source_time_status": "NOT_RESOLVED"
    },
    "last_seen": {
      "camera_id": "cam01",
      "pts_ms": 1095466.0,
      "source_time": null,
      "source_time_status": "NOT_RESOLVED"
    },
    "camera_count": 1,
    "cameras": [
      "cam01"
    ],
    "observation_count": 1,
    "track_count": 1,
    "best_consensus_score": 0.6587,
    "average_consensus_score": 0.6587,
    "status": "OBSERVED",
    "timeline": [
      {
        "camera_id": "cam01",
        "track_id": "TRK-2311",
        "first_seen_pts_ms": 1094466.0,
        "recognition_pts_ms": 1095466.0,
        "last_seen_pts_ms": 1095466.0,
        "source_time": null,
        "source_time_status": "NOT_RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.6587,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-14T13:32:02.870531+00:00",
        "evidence_url": null
      }
    ],
    "ingested_at_utc": "2026-09-14T13:32:02.925642+00:00",
    "updated_at_utc": "2026-09-14T13:32:02.925642+00:00"
  },
  {
    "vehicle_id": "VEH-000015",
    "registration_number": "CBHBI",
    "normalized_registration_number": "CBHBI",
    "first_seen": {
      "camera_id": "cam01",
      "pts_ms": 1160966.0,
      "source_time": null,
      "source_time_status": "NOT_RESOLVED"
    },
    "last_seen": {
      "camera_id": "cam04",
      "pts_ms": 1161966.0,
      "source_time": null,
      "source_time_status": "NOT_RESOLVED"
    },
    "camera_count": 3,
    "cameras": [
      "cam01",
      "cam02",
      "cam04"
    ],
    "observation_count": 3,
    "track_count": 1,
    "best_consensus_score": 0.9596,
    "average_consensus_score": 0.9596,
    "status": "OBSERVED",
    "timeline": [
      {
        "camera_id": "cam01",
        "track_id": "TRK-2462",
        "first_seen_pts_ms": 1160966.0,
        "recognition_pts_ms": 1161466.0,
        "last_seen_pts_ms": 1161966.0,
        "source_time": null,
        "source_time_status": "NOT_RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.9596,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-14T13:32:02.876308+00:00",
        "evidence_url": null
      },
      {
        "camera_id": "cam02",
        "track_id": "TRK-2462",
        "first_seen_pts_ms": 1160966.0,
        "recognition_pts_ms": 1161466.0,
        "last_seen_pts_ms": 1161966.0,
        "source_time": null,
        "source_time_status": "NOT_RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.9596,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-14T13:32:03.031353+00:00",
        "evidence_url": null
      },
      {
        "camera_id": "cam04",
        "track_id": "TRK-2462",
        "first_seen_pts_ms": 1160966.0,
        "recognition_pts_ms": 1161466.0,
        "last_seen_pts_ms": 1161966.0,
        "source_time": null,
        "source_time_status": "NOT_RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.9596,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-14T13:32:03.223862+00:00",
        "evidence_url": null
      }
    ],
    "ingested_at_utc": "2026-09-14T13:32:03.263209+00:00",
    "updated_at_utc": "2026-09-14T13:32:03.263209+00:00"
  },
  {
    "vehicle_id": "VEH-000016",
    "registration_number": "CHBH",
    "normalized_registration_number": "CHBH",
    "first_seen": {
      "camera_id": "cam01",
      "pts_ms": 1208466.0,
      "source_time": null,
      "source_time_status": "NOT_RESOLVED"
    },
    "last_seen": {
      "camera_id": "cam01",
      "pts_ms": 1211966.0,
      "source_time": null,
      "source_time_status": "NOT_RESOLVED"
    },
    "camera_count": 1,
    "cameras": [
      "cam01"
    ],
    "observation_count": 1,
    "track_count": 1,
    "best_consensus_score": 0.6021,
    "average_consensus_score": 0.6021,
    "status": "OBSERVED",
    "timeline": [
      {
        "camera_id": "cam01",
        "track_id": "TRK-2548",
        "first_seen_pts_ms": 1208466.0,
        "recognition_pts_ms": 1208466.0,
        "last_seen_pts_ms": 1211966.0,
        "source_time": null,
        "source_time_status": "NOT_RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.6021,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-14T13:32:02.878401+00:00",
        "evidence_url": null
      }
    ],
    "ingested_at_utc": "2026-09-14T13:32:02.925642+00:00",
    "updated_at_utc": "2026-09-14T13:32:02.925642+00:00"
  },
  {
    "vehicle_id": "VEH-000017",
    "registration_number": "CH1BHBG",
    "normalized_registration_number": "CH1BHBG",
    "first_seen": {
      "camera_id": "cam01",
      "pts_ms": 1238966.0,
      "source_time": null,
      "source_time_status": "NOT_RESOLVED"
    },
    "last_seen": {
      "camera_id": "cam04",
      "pts_ms": 1238966.0,
      "source_time": null,
      "source_time_status": "NOT_RESOLVED"
    },
    "camera_count": 3,
    "cameras": [
      "cam01",
      "cam02",
      "cam04"
    ],
    "observation_count": 3,
    "track_count": 1,
    "best_consensus_score": 0.4635,
    "average_consensus_score": 0.4635,
    "status": "OBSERVED",
    "timeline": [
      {
        "camera_id": "cam01",
        "track_id": "TRK-2600",
        "first_seen_pts_ms": 1238966.0,
        "recognition_pts_ms": 1238966.0,
        "last_seen_pts_ms": 1238966.0,
        "source_time": null,
        "source_time_status": "NOT_RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.4635,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-14T13:32:02.879441+00:00",
        "evidence_url": null
      },
      {
        "camera_id": "cam02",
        "track_id": "TRK-2600",
        "first_seen_pts_ms": 1238966.0,
        "recognition_pts_ms": 1238966.0,
        "last_seen_pts_ms": 1238966.0,
        "source_time": null,
        "source_time_status": "NOT_RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.4635,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-14T13:32:03.035099+00:00",
        "evidence_url": null
      },
      {
        "camera_id": "cam04",
        "track_id": "TRK-2600",
        "first_seen_pts_ms": 1238966.0,
        "recognition_pts_ms": 1238966.0,
        "last_seen_pts_ms": 1238966.0,
        "source_time": null,
        "source_time_status": "NOT_RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.4635,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-14T13:32:03.225993+00:00",
        "evidence_url": null
      }
    ],
    "ingested_at_utc": "2026-09-14T13:32:03.263209+00:00",
    "updated_at_utc": "2026-09-14T13:32:03.263209+00:00"
  },
  {
    "vehicle_id": "VEH-000018",
    "registration_number": "CHM6",
    "normalized_registration_number": "CHM6",
    "first_seen": {
      "camera_id": "cam01",
      "pts_ms": 1329466.0,
      "source_time": null,
      "source_time_status": "NOT_RESOLVED"
    },
    "last_seen": {
      "camera_id": "cam04",
      "pts_ms": 1330466.0,
      "source_time": null,
      "source_time_status": "NOT_RESOLVED"
    },
    "camera_count": 3,
    "cameras": [
      "cam01",
      "cam02",
      "cam04"
    ],
    "observation_count": 3,
    "track_count": 1,
    "best_consensus_score": 0.8846,
    "average_consensus_score": 0.8179,
    "status": "OBSERVED",
    "timeline": [
      {
        "camera_id": "cam01",
        "track_id": "TRK-2745",
        "first_seen_pts_ms": 1329466.0,
        "recognition_pts_ms": 1329466.0,
        "last_seen_pts_ms": 1330466.0,
        "source_time": null,
        "source_time_status": "NOT_RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.6846,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-14T13:32:02.881592+00:00",
        "evidence_url": null
      },
      {
        "camera_id": "cam02",
        "track_id": "TRK-2745",
        "first_seen_pts_ms": 1320966.0,
        "recognition_pts_ms": 1329466.0,
        "last_seen_pts_ms": 1330466.0,
        "source_time": null,
        "source_time_status": "NOT_RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.8846,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-14T13:32:03.037742+00:00",
        "evidence_url": null
      },
      {
        "camera_id": "cam04",
        "track_id": "TRK-2745",
        "first_seen_pts_ms": 1320966.0,
        "recognition_pts_ms": 1329466.0,
        "last_seen_pts_ms": 1330466.0,
        "source_time": null,
        "source_time_status": "NOT_RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.8846,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-14T13:32:03.228128+00:00",
        "evidence_url": null
      }
    ],
    "ingested_at_utc": "2026-09-14T13:32:03.263209+00:00",
    "updated_at_utc": "2026-09-14T13:32:03.263209+00:00"
  },
  {
    "vehicle_id": "VEH-000019",
    "registration_number": "31TA",
    "normalized_registration_number": "31TA",
    "first_seen": {
      "camera_id": "cam01",
      "pts_ms": 1460466.0,
      "source_time": null,
      "source_time_status": "NOT_RESOLVED"
    },
    "last_seen": {
      "camera_id": "cam04",
      "pts_ms": 1460966.0,
      "source_time": null,
      "source_time_status": "NOT_RESOLVED"
    },
    "camera_count": 3,
    "cameras": [
      "cam01",
      "cam02",
      "cam04"
    ],
    "observation_count": 3,
    "track_count": 1,
    "best_consensus_score": 0.2196,
    "average_consensus_score": 0.2196,
    "status": "OBSERVED",
    "timeline": [
      {
        "camera_id": "cam01",
        "track_id": "TRK-3020",
        "first_seen_pts_ms": 1460466.0,
        "recognition_pts_ms": 1460966.0,
        "last_seen_pts_ms": 1460966.0,
        "source_time": null,
        "source_time_status": "NOT_RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.2196,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-14T13:32:02.883704+00:00",
        "evidence_url": null
      },
      {
        "camera_id": "cam02",
        "track_id": "TRK-3020",
        "first_seen_pts_ms": 1460466.0,
        "recognition_pts_ms": 1460966.0,
        "last_seen_pts_ms": 1460966.0,
        "source_time": null,
        "source_time_status": "NOT_RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.2196,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-14T13:32:03.039311+00:00",
        "evidence_url": null
      },
      {
        "camera_id": "cam04",
        "track_id": "TRK-3020",
        "first_seen_pts_ms": 1460466.0,
        "recognition_pts_ms": 1460966.0,
        "last_seen_pts_ms": 1460966.0,
        "source_time": null,
        "source_time_status": "NOT_RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.2196,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-14T13:32:03.229190+00:00",
        "evidence_url": null
      }
    ],
    "ingested_at_utc": "2026-09-14T13:32:03.263209+00:00",
    "updated_at_utc": "2026-09-14T13:32:03.263209+00:00"
  },
  {
    "vehicle_id": "VEH-000020",
    "registration_number": "CHMBH",
    "normalized_registration_number": "CHMBH",
    "first_seen": {
      "camera_id": "cam01",
      "pts_ms": 1744466.0,
      "source_time": null,
      "source_time_status": "NOT_RESOLVED"
    },
    "last_seen": {
      "camera_id": "cam01",
      "pts_ms": 1746966.0,
      "source_time": null,
      "source_time_status": "NOT_RESOLVED"
    },
    "camera_count": 1,
    "cameras": [
      "cam01"
    ],
    "observation_count": 1,
    "track_count": 1,
    "best_consensus_score": 0.8243,
    "average_consensus_score": 0.8243,
    "status": "OBSERVED",
    "timeline": [
      {
        "camera_id": "cam01",
        "track_id": "TRK-3538",
        "first_seen_pts_ms": 1744466.0,
        "recognition_pts_ms": 1744466.0,
        "last_seen_pts_ms": 1746966.0,
        "source_time": null,
        "source_time_status": "NOT_RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.8243,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-14T13:32:02.887865+00:00",
        "evidence_url": null
      }
    ],
    "ingested_at_utc": "2026-09-14T13:32:02.925642+00:00",
    "updated_at_utc": "2026-09-14T13:32:02.925642+00:00"
  },
  {
    "vehicle_id": "VEH-000021",
    "registration_number": "CHABHB",
    "normalized_registration_number": "CHABHB",
    "first_seen": {
      "camera_id": "cam01",
      "pts_ms": 2029966.0,
      "source_time": null,
      "source_time_status": "NOT_RESOLVED"
    },
    "last_seen": {
      "camera_id": "cam01",
      "pts_ms": 2030466.0,
      "source_time": null,
      "source_time_status": "NOT_RESOLVED"
    },
    "camera_count": 1,
    "cameras": [
      "cam01"
    ],
    "observation_count": 1,
    "track_count": 1,
    "best_consensus_score": 0.5895,
    "average_consensus_score": 0.5895,
    "status": "OBSERVED",
    "timeline": [
      {
        "camera_id": "cam01",
        "track_id": "TRK-4013",
        "first_seen_pts_ms": 2029966.0,
        "recognition_pts_ms": 2029966.0,
        "last_seen_pts_ms": 2030466.0,
        "source_time": null,
        "source_time_status": "NOT_RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.5895,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-14T13:32:02.891546+00:00",
        "evidence_url": null
      }
    ],
    "ingested_at_utc": "2026-09-14T13:32:02.925642+00:00",
    "updated_at_utc": "2026-09-14T13:32:02.925642+00:00"
  },
  {
    "vehicle_id": "VEH-000022",
    "registration_number": "J3EGECSITMS3",
    "normalized_registration_number": "J3EGECSITMS3",
    "first_seen": {
      "camera_id": "cam01",
      "pts_ms": 2439966.0,
      "source_time": null,
      "source_time_status": "NOT_RESOLVED"
    },
    "last_seen": {
      "camera_id": "cam01",
      "pts_ms": 2440466.0,
      "source_time": null,
      "source_time_status": "NOT_RESOLVED"
    },
    "camera_count": 1,
    "cameras": [
      "cam01"
    ],
    "observation_count": 1,
    "track_count": 1,
    "best_consensus_score": 0.3858,
    "average_consensus_score": 0.3858,
    "status": "OBSERVED",
    "timeline": [
      {
        "camera_id": "cam01",
        "track_id": "TRK-4765",
        "first_seen_pts_ms": 2439966.0,
        "recognition_pts_ms": 2439966.0,
        "last_seen_pts_ms": 2440466.0,
        "source_time": null,
        "source_time_status": "NOT_RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.3858,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-14T13:32:02.894666+00:00",
        "evidence_url": null
      }
    ],
    "ingested_at_utc": "2026-09-14T13:32:02.925642+00:00",
    "updated_at_utc": "2026-09-14T13:32:02.925642+00:00"
  },
  {
    "vehicle_id": "VEH-000023",
    "registration_number": "AUD2",
    "normalized_registration_number": "AUD2",
    "first_seen": {
      "camera_id": "cam01",
      "pts_ms": 2529466.0,
      "source_time": null,
      "source_time_status": "NOT_RESOLVED"
    },
    "last_seen": {
      "camera_id": "cam01",
      "pts_ms": 2530466.0,
      "source_time": null,
      "source_time_status": "NOT_RESOLVED"
    },
    "camera_count": 1,
    "cameras": [
      "cam01"
    ],
    "observation_count": 1,
    "track_count": 1,
    "best_consensus_score": 0.1788,
    "average_consensus_score": 0.1788,
    "status": "OBSERVED",
    "timeline": [
      {
        "camera_id": "cam01",
        "track_id": "TRK-4913",
        "first_seen_pts_ms": 2529466.0,
        "recognition_pts_ms": 2529466.0,
        "last_seen_pts_ms": 2530466.0,
        "source_time": null,
        "source_time_status": "NOT_RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.1788,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-14T13:32:02.896265+00:00",
        "evidence_url": null
      }
    ],
    "ingested_at_utc": "2026-09-14T13:32:02.925642+00:00",
    "updated_at_utc": "2026-09-14T13:32:02.925642+00:00"
  },
  {
    "vehicle_id": "VEH-000024",
    "registration_number": "TMS32P",
    "normalized_registration_number": "TMS32P",
    "first_seen": {
      "camera_id": "cam01",
      "pts_ms": 2528466.0,
      "source_time": null,
      "source_time_status": "NOT_RESOLVED"
    },
    "last_seen": {
      "camera_id": "cam04",
      "pts_ms": 2528466.0,
      "source_time": null,
      "source_time_status": "NOT_RESOLVED"
    },
    "camera_count": 3,
    "cameras": [
      "cam01",
      "cam02",
      "cam04"
    ],
    "observation_count": 3,
    "track_count": 1,
    "best_consensus_score": 0.6168,
    "average_consensus_score": 0.6168,
    "status": "OBSERVED",
    "timeline": [
      {
        "camera_id": "cam01",
        "track_id": "TRK-4914",
        "first_seen_pts_ms": 2528466.0,
        "recognition_pts_ms": 2528466.0,
        "last_seen_pts_ms": 2528466.0,
        "source_time": null,
        "source_time_status": "NOT_RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.6168,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-14T13:32:02.896265+00:00",
        "evidence_url": null
      },
      {
        "camera_id": "cam02",
        "track_id": "TRK-4914",
        "first_seen_pts_ms": 2528466.0,
        "recognition_pts_ms": 2528466.0,
        "last_seen_pts_ms": 2528466.0,
        "source_time": null,
        "source_time_status": "NOT_RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.6168,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-14T13:32:03.047638+00:00",
        "evidence_url": null
      },
      {
        "camera_id": "cam04",
        "track_id": "TRK-4914",
        "first_seen_pts_ms": 2528466.0,
        "recognition_pts_ms": 2528466.0,
        "last_seen_pts_ms": 2528466.0,
        "source_time": null,
        "source_time_status": "NOT_RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.6168,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-14T13:32:03.239337+00:00",
        "evidence_url": null
      }
    ],
    "ingested_at_utc": "2026-09-14T13:32:03.263209+00:00",
    "updated_at_utc": "2026-09-14T13:32:03.263209+00:00"
  },
  {
    "vehicle_id": "VEH-000025",
    "registration_number": "3B2CSITN",
    "normalized_registration_number": "3B2CSITN",
    "first_seen": {
      "camera_id": "cam01",
      "pts_ms": 2717966.0,
      "source_time": null,
      "source_time_status": "NOT_RESOLVED"
    },
    "last_seen": {
      "camera_id": "cam01",
      "pts_ms": 2718966.0,
      "source_time": null,
      "source_time_status": "NOT_RESOLVED"
    },
    "camera_count": 1,
    "cameras": [
      "cam01"
    ],
    "observation_count": 1,
    "track_count": 1,
    "best_consensus_score": 0.4943,
    "average_consensus_score": 0.4943,
    "status": "OBSERVED",
    "timeline": [
      {
        "camera_id": "cam01",
        "track_id": "TRK-5251",
        "first_seen_pts_ms": 2717966.0,
        "recognition_pts_ms": 2718466.0,
        "last_seen_pts_ms": 2718966.0,
        "source_time": null,
        "source_time_status": "NOT_RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.4943,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-14T13:32:02.901476+00:00",
        "evidence_url": null
      }
    ],
    "ingested_at_utc": "2026-09-14T13:32:02.925642+00:00",
    "updated_at_utc": "2026-09-14T13:32:02.925642+00:00"
  }
]) as unknown as ObservedVehicle[]
