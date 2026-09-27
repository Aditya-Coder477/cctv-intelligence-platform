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
    "vehicle_id": "VEH-GJ18AB6018",
    "registration_number": "GJ18AB6018",
    "normalized_registration_number": "GJ18AB6018",
    "first_seen": {
      "camera_id": "cam20",
      "pts_ms": 0.0,
      "source_time": "2026-09-26T15:10:59.213547+00:00",
      "source_time_status": "RESOLVED"
    },
    "last_seen": {
      "camera_id": "cam27",
      "pts_ms": 120000.0,
      "source_time": "2026-09-26T20:17:24.406323+00:00",
      "source_time_status": "RESOLVED"
    },
    "camera_count": 3,
    "cameras": [
      "cam20",
      "cam19",
      "cam27"
    ],
    "observation_count": 3,
    "track_count": 3,
    "best_consensus_score": 0.98,
    "average_consensus_score": 0.94,
    "status": "CONFIRMED",
    "timeline": [
      {
        "camera_id": "cam20",
        "track_id": "TRK-SIM-0001",
        "first_seen_pts_ms": 0.0,
        "recognition_pts_ms": 5000.0,
        "last_seen_pts_ms": 15000.0,
        "source_time": "2026-09-26T15:10:59.213547+00:00",
        "source_time_status": "RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.92,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-26T15:10:59.213547+00:00"
      },
      {
        "camera_id": "cam19",
        "track_id": "TRK-SIM-0002",
        "first_seen_pts_ms": 60000.0,
        "recognition_pts_ms": 65000.0,
        "last_seen_pts_ms": 75000.0,
        "source_time": "2026-09-26T20:03:55.016363+00:00",
        "source_time_status": "RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.935,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-26T20:03:55.016363+00:00"
      },
      {
        "camera_id": "cam27",
        "track_id": "TRK-SIM-0003",
        "first_seen_pts_ms": 120000.0,
        "recognition_pts_ms": 125000.0,
        "last_seen_pts_ms": 135000.0,
        "source_time": "2026-09-26T20:17:24.406323+00:00",
        "source_time_status": "RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.95,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-26T20:17:24.406323+00:00"
      }
    ],
    "vehicle_details": {
      "make_model": "Mahindra Scorpio-N",
      "color": "Black",
      "class": "SUV"
    },
    "total_distance_km": 256.84,
    "avg_speed_kmh": 50.3,
    "is_watchlist_match": true
  },
  {
    "vehicle_id": "VEH-GJ06JK7137",
    "registration_number": "GJ06JK7137",
    "normalized_registration_number": "GJ06JK7137",
    "first_seen": {
      "camera_id": "cam04",
      "pts_ms": 0.0,
      "source_time": "2026-09-26T17:09:59.213547+00:00",
      "source_time_status": "RESOLVED"
    },
    "last_seen": {
      "camera_id": "cam19",
      "pts_ms": 60000.0,
      "source_time": "2026-09-26T22:51:11.509747+00:00",
      "source_time_status": "RESOLVED"
    },
    "camera_count": 2,
    "cameras": [
      "cam04",
      "cam19"
    ],
    "observation_count": 2,
    "track_count": 2,
    "best_consensus_score": 0.98,
    "average_consensus_score": 0.94,
    "status": "CONFIRMED",
    "timeline": [
      {
        "camera_id": "cam04",
        "track_id": "TRK-SIM-0001",
        "first_seen_pts_ms": 0.0,
        "recognition_pts_ms": 5000.0,
        "last_seen_pts_ms": 15000.0,
        "source_time": "2026-09-26T17:09:59.213547+00:00",
        "source_time_status": "RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.92,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-26T17:09:59.213547+00:00"
      },
      {
        "camera_id": "cam19",
        "track_id": "TRK-SIM-0002",
        "first_seen_pts_ms": 60000.0,
        "recognition_pts_ms": 65000.0,
        "last_seen_pts_ms": 75000.0,
        "source_time": "2026-09-26T22:51:11.509747+00:00",
        "source_time_status": "RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.935,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-26T22:51:11.509747+00:00"
      }
    ],
    "vehicle_details": {
      "make_model": "Toyota Innova Crysta",
      "color": "White",
      "class": "MPV"
    },
    "total_distance_km": 247.86,
    "avg_speed_kmh": 43.6,
    "is_watchlist_match": false
  },
  {
    "vehicle_id": "VEH-GJ03XY4866",
    "registration_number": "GJ03XY4866",
    "normalized_registration_number": "GJ03XY4866",
    "first_seen": {
      "camera_id": "cam17",
      "pts_ms": 0.0,
      "source_time": "2026-09-26T15:38:59.213547+00:00",
      "source_time_status": "RESOLVED"
    },
    "last_seen": {
      "camera_id": "cam07",
      "pts_ms": 300000.0,
      "source_time": "2026-09-26T19:05:29.313931+00:00",
      "source_time_status": "RESOLVED"
    },
    "camera_count": 6,
    "cameras": [
      "cam17",
      "cam11",
      "cam08",
      "cam10",
      "cam09",
      "cam07"
    ],
    "observation_count": 6,
    "track_count": 6,
    "best_consensus_score": 0.98,
    "average_consensus_score": 0.94,
    "status": "CONFIRMED",
    "timeline": [
      {
        "camera_id": "cam17",
        "track_id": "TRK-SIM-0001",
        "first_seen_pts_ms": 0.0,
        "recognition_pts_ms": 5000.0,
        "last_seen_pts_ms": 15000.0,
        "source_time": "2026-09-26T15:38:59.213547+00:00",
        "source_time_status": "RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.92,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-26T15:38:59.213547+00:00"
      },
      {
        "camera_id": "cam11",
        "track_id": "TRK-SIM-0002",
        "first_seen_pts_ms": 60000.0,
        "recognition_pts_ms": 65000.0,
        "last_seen_pts_ms": 75000.0,
        "source_time": "2026-09-26T17:27:07.094651+00:00",
        "source_time_status": "RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.935,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-26T17:27:07.094651+00:00"
      },
      {
        "camera_id": "cam08",
        "track_id": "TRK-SIM-0003",
        "first_seen_pts_ms": 120000.0,
        "recognition_pts_ms": 125000.0,
        "last_seen_pts_ms": 135000.0,
        "source_time": "2026-09-26T17:29:37.094651+00:00",
        "source_time_status": "RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.95,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-26T17:29:37.094651+00:00"
      },
      {
        "camera_id": "cam10",
        "track_id": "TRK-SIM-0004",
        "first_seen_pts_ms": 180000.0,
        "recognition_pts_ms": 185000.0,
        "last_seen_pts_ms": 195000.0,
        "source_time": "2026-09-26T17:32:07.094651+00:00",
        "source_time_status": "RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.965,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-26T17:32:07.094651+00:00"
      },
      {
        "camera_id": "cam09",
        "track_id": "TRK-SIM-0005",
        "first_seen_pts_ms": 240000.0,
        "recognition_pts_ms": 245000.0,
        "last_seen_pts_ms": 255000.0,
        "source_time": "2026-09-26T17:34:50.817716+00:00",
        "source_time_status": "RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.98,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-26T17:34:50.817716+00:00"
      },
      {
        "camera_id": "cam07",
        "track_id": "TRK-SIM-0006",
        "first_seen_pts_ms": 300000.0,
        "recognition_pts_ms": 305000.0,
        "last_seen_pts_ms": 315000.0,
        "source_time": "2026-09-26T19:05:29.313931+00:00",
        "source_time_status": "RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.92,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-26T19:05:29.313931+00:00"
      }
    ],
    "vehicle_details": {
      "make_model": "Maruti Suzuki Swift",
      "color": "Silver",
      "class": "Hatchback"
    },
    "total_distance_km": 164.35,
    "avg_speed_kmh": 47.8,
    "is_watchlist_match": false
  },
  {
    "vehicle_id": "VEH-GJ01CD6417",
    "registration_number": "GJ01CD6417",
    "normalized_registration_number": "GJ01CD6417",
    "first_seen": {
      "camera_id": "cam18",
      "pts_ms": 0.0,
      "source_time": "2026-09-26T14:39:59.213547+00:00",
      "source_time_status": "RESOLVED"
    },
    "last_seen": {
      "camera_id": "cam06",
      "pts_ms": 240000.0,
      "source_time": "2026-09-26T16:25:00.416259+00:00",
      "source_time_status": "RESOLVED"
    },
    "camera_count": 5,
    "cameras": [
      "cam18",
      "cam11",
      "cam08",
      "cam10",
      "cam06"
    ],
    "observation_count": 5,
    "track_count": 5,
    "best_consensus_score": 0.98,
    "average_consensus_score": 0.94,
    "status": "CONFIRMED",
    "timeline": [
      {
        "camera_id": "cam18",
        "track_id": "TRK-SIM-0001",
        "first_seen_pts_ms": 0.0,
        "recognition_pts_ms": 5000.0,
        "last_seen_pts_ms": 15000.0,
        "source_time": "2026-09-26T14:39:59.213547+00:00",
        "source_time_status": "RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.92,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-26T14:39:59.213547+00:00"
      },
      {
        "camera_id": "cam11",
        "track_id": "TRK-SIM-0002",
        "first_seen_pts_ms": 60000.0,
        "recognition_pts_ms": 65000.0,
        "last_seen_pts_ms": 75000.0,
        "source_time": "2026-09-26T16:17:30.416259+00:00",
        "source_time_status": "RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.935,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-26T16:17:30.416259+00:00"
      },
      {
        "camera_id": "cam08",
        "track_id": "TRK-SIM-0003",
        "first_seen_pts_ms": 120000.0,
        "recognition_pts_ms": 125000.0,
        "last_seen_pts_ms": 135000.0,
        "source_time": "2026-09-26T16:20:00.416259+00:00",
        "source_time_status": "RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.95,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-26T16:20:00.416259+00:00"
      },
      {
        "camera_id": "cam10",
        "track_id": "TRK-SIM-0004",
        "first_seen_pts_ms": 180000.0,
        "recognition_pts_ms": 185000.0,
        "last_seen_pts_ms": 195000.0,
        "source_time": "2026-09-26T16:22:30.416259+00:00",
        "source_time_status": "RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.965,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-26T16:22:30.416259+00:00"
      },
      {
        "camera_id": "cam06",
        "track_id": "TRK-SIM-0005",
        "first_seen_pts_ms": 240000.0,
        "recognition_pts_ms": 245000.0,
        "last_seen_pts_ms": 255000.0,
        "source_time": "2026-09-26T16:25:00.416259+00:00",
        "source_time_status": "RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.98,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-26T16:25:00.416259+00:00"
      }
    ],
    "vehicle_details": {
      "make_model": "Maruti Suzuki Baleno",
      "color": "White",
      "class": "Hatchback"
    },
    "total_distance_km": 95.24,
    "avg_speed_kmh": 54.4,
    "is_watchlist_match": false
  },
  {
    "vehicle_id": "VEH-GJ27PQ5473",
    "registration_number": "GJ27PQ5473",
    "normalized_registration_number": "GJ27PQ5473",
    "first_seen": {
      "camera_id": "cam20",
      "pts_ms": 0.0,
      "source_time": "2026-09-26T15:11:59.213547+00:00",
      "source_time_status": "RESOLVED"
    },
    "last_seen": {
      "camera_id": "cam17",
      "pts_ms": 120000.0,
      "source_time": "2026-09-26T19:52:24.814118+00:00",
      "source_time_status": "RESOLVED"
    },
    "camera_count": 3,
    "cameras": [
      "cam20",
      "cam04",
      "cam17"
    ],
    "observation_count": 3,
    "track_count": 3,
    "best_consensus_score": 0.98,
    "average_consensus_score": 0.94,
    "status": "CONFIRMED",
    "timeline": [
      {
        "camera_id": "cam20",
        "track_id": "TRK-SIM-0001",
        "first_seen_pts_ms": 0.0,
        "recognition_pts_ms": 5000.0,
        "last_seen_pts_ms": 15000.0,
        "source_time": "2026-09-26T15:11:59.213547+00:00",
        "source_time_status": "RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.92,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-26T15:11:59.213547+00:00"
      },
      {
        "camera_id": "cam04",
        "track_id": "TRK-SIM-0002",
        "first_seen_pts_ms": 60000.0,
        "recognition_pts_ms": 65000.0,
        "last_seen_pts_ms": 75000.0,
        "source_time": "2026-09-26T15:18:21.699403+00:00",
        "source_time_status": "RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.935,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-26T15:18:21.699403+00:00"
      },
      {
        "camera_id": "cam17",
        "track_id": "TRK-SIM-0003",
        "first_seen_pts_ms": 120000.0,
        "recognition_pts_ms": 125000.0,
        "last_seen_pts_ms": 135000.0,
        "source_time": "2026-09-26T19:52:24.814118+00:00",
        "source_time_status": "RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.95,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-26T19:52:24.814118+00:00"
      }
    ],
    "vehicle_details": {
      "make_model": "Honda City",
      "color": "Grey",
      "class": "Sedan"
    },
    "total_distance_km": 201.22,
    "avg_speed_kmh": 43.1,
    "is_watchlist_match": true
  },
  {
    "vehicle_id": "VEH-GJ01MN6809",
    "registration_number": "GJ01MN6809",
    "normalized_registration_number": "GJ01MN6809",
    "first_seen": {
      "camera_id": "cam04",
      "pts_ms": 0.0,
      "source_time": "2026-09-26T16:31:59.213547+00:00",
      "source_time_status": "RESOLVED"
    },
    "last_seen": {
      "camera_id": "cam18",
      "pts_ms": 120000.0,
      "source_time": "2026-09-26T20:38:42.170989+00:00",
      "source_time_status": "RESOLVED"
    },
    "camera_count": 3,
    "cameras": [
      "cam04",
      "cam17",
      "cam18"
    ],
    "observation_count": 3,
    "track_count": 3,
    "best_consensus_score": 0.98,
    "average_consensus_score": 0.94,
    "status": "CONFIRMED",
    "timeline": [
      {
        "camera_id": "cam04",
        "track_id": "TRK-SIM-0001",
        "first_seen_pts_ms": 0.0,
        "recognition_pts_ms": 5000.0,
        "last_seen_pts_ms": 15000.0,
        "source_time": "2026-09-26T16:31:59.213547+00:00",
        "source_time_status": "RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.92,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-26T16:31:59.213547+00:00"
      },
      {
        "camera_id": "cam17",
        "track_id": "TRK-SIM-0002",
        "first_seen_pts_ms": 60000.0,
        "recognition_pts_ms": 65000.0,
        "last_seen_pts_ms": 75000.0,
        "source_time": "2026-09-26T20:36:12.170989+00:00",
        "source_time_status": "RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.935,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-26T20:36:12.170989+00:00"
      },
      {
        "camera_id": "cam18",
        "track_id": "TRK-SIM-0003",
        "first_seen_pts_ms": 120000.0,
        "recognition_pts_ms": 125000.0,
        "last_seen_pts_ms": 135000.0,
        "source_time": "2026-09-26T20:38:42.170989+00:00",
        "source_time_status": "RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.95,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-26T20:38:42.170989+00:00"
      }
    ],
    "vehicle_details": {
      "make_model": "GSRTC Express Bus",
      "color": "Orange-White",
      "class": "Bus"
    },
    "total_distance_km": 198.03,
    "avg_speed_kmh": 48.2,
    "is_watchlist_match": true
  },
  {
    "vehicle_id": "VEH-GJ27GH8688",
    "registration_number": "GJ27GH8688",
    "normalized_registration_number": "GJ27GH8688",
    "first_seen": {
      "camera_id": "cam30",
      "pts_ms": 0.0,
      "source_time": "2026-09-26T17:20:59.213547+00:00",
      "source_time_status": "RESOLVED"
    },
    "last_seen": {
      "camera_id": "cam17",
      "pts_ms": 60000.0,
      "source_time": "2026-09-26T20:06:57.257707+00:00",
      "source_time_status": "RESOLVED"
    },
    "camera_count": 2,
    "cameras": [
      "cam30",
      "cam17"
    ],
    "observation_count": 2,
    "track_count": 2,
    "best_consensus_score": 0.98,
    "average_consensus_score": 0.94,
    "status": "CONFIRMED",
    "timeline": [
      {
        "camera_id": "cam30",
        "track_id": "TRK-SIM-0001",
        "first_seen_pts_ms": 0.0,
        "recognition_pts_ms": 5000.0,
        "last_seen_pts_ms": 15000.0,
        "source_time": "2026-09-26T17:20:59.213547+00:00",
        "source_time_status": "RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.92,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-26T17:20:59.213547+00:00"
      },
      {
        "camera_id": "cam17",
        "track_id": "TRK-SIM-0002",
        "first_seen_pts_ms": 60000.0,
        "recognition_pts_ms": 65000.0,
        "last_seen_pts_ms": 75000.0,
        "source_time": "2026-09-26T20:06:57.257707+00:00",
        "source_time_status": "RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.935,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-26T20:06:57.257707+00:00"
      }
    ],
    "vehicle_details": {
      "make_model": "Hyundai Creta",
      "color": "White",
      "class": "SUV"
    },
    "total_distance_km": 109.65,
    "avg_speed_kmh": 39.6,
    "is_watchlist_match": false
  },
  {
    "vehicle_id": "VEH-GJ05EF4380",
    "registration_number": "GJ05EF4380",
    "normalized_registration_number": "GJ05EF4380",
    "first_seen": {
      "camera_id": "cam18",
      "pts_ms": 0.0,
      "source_time": "2026-09-26T15:08:59.213547+00:00",
      "source_time_status": "RESOLVED"
    },
    "last_seen": {
      "camera_id": "cam30",
      "pts_ms": 60000.0,
      "source_time": "2026-09-26T18:28:37.814093+00:00",
      "source_time_status": "RESOLVED"
    },
    "camera_count": 2,
    "cameras": [
      "cam18",
      "cam30"
    ],
    "observation_count": 2,
    "track_count": 2,
    "best_consensus_score": 0.98,
    "average_consensus_score": 0.94,
    "status": "CONFIRMED",
    "timeline": [
      {
        "camera_id": "cam18",
        "track_id": "TRK-SIM-0001",
        "first_seen_pts_ms": 0.0,
        "recognition_pts_ms": 5000.0,
        "last_seen_pts_ms": 15000.0,
        "source_time": "2026-09-26T15:08:59.213547+00:00",
        "source_time_status": "RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.92,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-26T15:08:59.213547+00:00"
      },
      {
        "camera_id": "cam30",
        "track_id": "TRK-SIM-0002",
        "first_seen_pts_ms": 60000.0,
        "recognition_pts_ms": 65000.0,
        "last_seen_pts_ms": 75000.0,
        "source_time": "2026-09-26T18:28:37.814093+00:00",
        "source_time_status": "RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.935,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-26T18:28:37.814093+00:00"
      }
    ],
    "vehicle_details": {
      "make_model": "GSRTC Express Bus",
      "color": "Orange-White",
      "class": "Bus"
    },
    "total_distance_km": 110.17,
    "avg_speed_kmh": 33.1,
    "is_watchlist_match": false
  },
  {
    "vehicle_id": "VEH-GJ05ZZ7521",
    "registration_number": "GJ05ZZ7521",
    "normalized_registration_number": "GJ05ZZ7521",
    "first_seen": {
      "camera_id": "cam17",
      "pts_ms": 0.0,
      "source_time": "2026-09-26T14:33:59.213547+00:00",
      "source_time_status": "RESOLVED"
    },
    "last_seen": {
      "camera_id": "cam30",
      "pts_ms": 60000.0,
      "source_time": "2026-09-26T17:14:00.420783+00:00",
      "source_time_status": "RESOLVED"
    },
    "camera_count": 2,
    "cameras": [
      "cam17",
      "cam30"
    ],
    "observation_count": 2,
    "track_count": 2,
    "best_consensus_score": 0.98,
    "average_consensus_score": 0.94,
    "status": "CONFIRMED",
    "timeline": [
      {
        "camera_id": "cam17",
        "track_id": "TRK-SIM-0001",
        "first_seen_pts_ms": 0.0,
        "recognition_pts_ms": 5000.0,
        "last_seen_pts_ms": 15000.0,
        "source_time": "2026-09-26T14:33:59.213547+00:00",
        "source_time_status": "RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.92,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-26T14:33:59.213547+00:00"
      },
      {
        "camera_id": "cam30",
        "track_id": "TRK-SIM-0002",
        "first_seen_pts_ms": 60000.0,
        "recognition_pts_ms": 65000.0,
        "last_seen_pts_ms": 75000.0,
        "source_time": "2026-09-26T17:14:00.420783+00:00",
        "source_time_status": "RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.935,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-26T17:14:00.420783+00:00"
      }
    ],
    "vehicle_details": {
      "make_model": "Toyota Innova Crysta",
      "color": "White",
      "class": "MPV"
    },
    "total_distance_km": 109.65,
    "avg_speed_kmh": 41.1,
    "is_watchlist_match": false
  },
  {
    "vehicle_id": "VEH-GJ06CD1095",
    "registration_number": "GJ06CD1095",
    "normalized_registration_number": "GJ06CD1095",
    "first_seen": {
      "camera_id": "cam17",
      "pts_ms": 0.0,
      "source_time": "2026-09-26T16:35:59.213547+00:00",
      "source_time_status": "RESOLVED"
    },
    "last_seen": {
      "camera_id": "cam18",
      "pts_ms": 60000.0,
      "source_time": "2026-09-26T16:38:29.213547+00:00",
      "source_time_status": "RESOLVED"
    },
    "camera_count": 2,
    "cameras": [
      "cam17",
      "cam18"
    ],
    "observation_count": 2,
    "track_count": 2,
    "best_consensus_score": 0.98,
    "average_consensus_score": 0.94,
    "status": "CONFIRMED",
    "timeline": [
      {
        "camera_id": "cam17",
        "track_id": "TRK-SIM-0001",
        "first_seen_pts_ms": 0.0,
        "recognition_pts_ms": 5000.0,
        "last_seen_pts_ms": 15000.0,
        "source_time": "2026-09-26T16:35:59.213547+00:00",
        "source_time_status": "RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.92,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-26T16:35:59.213547+00:00"
      },
      {
        "camera_id": "cam18",
        "track_id": "TRK-SIM-0002",
        "first_seen_pts_ms": 60000.0,
        "recognition_pts_ms": 65000.0,
        "last_seen_pts_ms": 75000.0,
        "source_time": "2026-09-26T16:38:29.213547+00:00",
        "source_time_status": "RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.935,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-26T16:38:29.213547+00:00"
      }
    ],
    "vehicle_details": {
      "make_model": "Toyota Innova Crysta",
      "color": "White",
      "class": "MPV"
    },
    "total_distance_km": 0.53,
    "avg_speed_kmh": 12.7,
    "is_watchlist_match": true
  },
  {
    "vehicle_id": "VEH-GJ27AB1519",
    "registration_number": "GJ27AB1519",
    "normalized_registration_number": "GJ27AB1519",
    "first_seen": {
      "camera_id": "cam16",
      "pts_ms": 0.0,
      "source_time": "2026-09-26T16:36:59.213547+00:00",
      "source_time_status": "RESOLVED"
    },
    "last_seen": {
      "camera_id": "cam24",
      "pts_ms": 120000.0,
      "source_time": "2026-09-26T17:14:14.070526+00:00",
      "source_time_status": "RESOLVED"
    },
    "camera_count": 3,
    "cameras": [
      "cam16",
      "cam12",
      "cam24"
    ],
    "observation_count": 3,
    "track_count": 3,
    "best_consensus_score": 0.98,
    "average_consensus_score": 0.94,
    "status": "CONFIRMED",
    "timeline": [
      {
        "camera_id": "cam16",
        "track_id": "TRK-SIM-0001",
        "first_seen_pts_ms": 0.0,
        "recognition_pts_ms": 5000.0,
        "last_seen_pts_ms": 15000.0,
        "source_time": "2026-09-26T16:36:59.213547+00:00",
        "source_time_status": "RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.92,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-26T16:36:59.213547+00:00"
      },
      {
        "camera_id": "cam12",
        "track_id": "TRK-SIM-0002",
        "first_seen_pts_ms": 60000.0,
        "recognition_pts_ms": 65000.0,
        "last_seen_pts_ms": 75000.0,
        "source_time": "2026-09-26T16:46:47.473360+00:00",
        "source_time_status": "RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.935,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-26T16:46:47.473360+00:00"
      },
      {
        "camera_id": "cam24",
        "track_id": "TRK-SIM-0003",
        "first_seen_pts_ms": 120000.0,
        "recognition_pts_ms": 125000.0,
        "last_seen_pts_ms": 135000.0,
        "source_time": "2026-09-26T17:14:14.070526+00:00",
        "source_time_status": "RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.95,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-26T17:14:14.070526+00:00"
      }
    ],
    "vehicle_details": {
      "make_model": "Royal Enfield Classic 350",
      "color": "Black",
      "class": "Two-Wheeler"
    },
    "total_distance_km": 31.5,
    "avg_speed_kmh": 50.7,
    "is_watchlist_match": false
  },
  {
    "vehicle_id": "VEH-GJ03PQ1239",
    "registration_number": "GJ03PQ1239",
    "normalized_registration_number": "GJ03PQ1239",
    "first_seen": {
      "camera_id": "cam21",
      "pts_ms": 0.0,
      "source_time": "2026-09-26T16:41:59.213547+00:00",
      "source_time_status": "RESOLVED"
    },
    "last_seen": {
      "camera_id": "cam23",
      "pts_ms": 60000.0,
      "source_time": "2026-09-26T18:13:12.109795+00:00",
      "source_time_status": "RESOLVED"
    },
    "camera_count": 2,
    "cameras": [
      "cam21",
      "cam23"
    ],
    "observation_count": 2,
    "track_count": 2,
    "best_consensus_score": 0.98,
    "average_consensus_score": 0.94,
    "status": "CONFIRMED",
    "timeline": [
      {
        "camera_id": "cam21",
        "track_id": "TRK-SIM-0001",
        "first_seen_pts_ms": 0.0,
        "recognition_pts_ms": 5000.0,
        "last_seen_pts_ms": 15000.0,
        "source_time": "2026-09-26T16:41:59.213547+00:00",
        "source_time_status": "RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.92,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-26T16:41:59.213547+00:00"
      },
      {
        "camera_id": "cam23",
        "track_id": "TRK-SIM-0002",
        "first_seen_pts_ms": 60000.0,
        "recognition_pts_ms": 65000.0,
        "last_seen_pts_ms": 75000.0,
        "source_time": "2026-09-26T18:13:12.109795+00:00",
        "source_time_status": "RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.935,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-26T18:13:12.109795+00:00"
      }
    ],
    "vehicle_details": {
      "make_model": "Maruti Suzuki Baleno",
      "color": "White",
      "class": "Hatchback"
    },
    "total_distance_km": 87.98,
    "avg_speed_kmh": 57.9,
    "is_watchlist_match": false
  },
  {
    "vehicle_id": "VEH-GJ02MN7199",
    "registration_number": "GJ02MN7199",
    "normalized_registration_number": "GJ02MN7199",
    "first_seen": {
      "camera_id": "cam05",
      "pts_ms": 0.0,
      "source_time": "2026-09-26T16:25:59.213547+00:00",
      "source_time_status": "RESOLVED"
    },
    "last_seen": {
      "camera_id": "cam23",
      "pts_ms": 180000.0,
      "source_time": "2026-09-26T18:28:29.687587+00:00",
      "source_time_status": "RESOLVED"
    },
    "camera_count": 4,
    "cameras": [
      "cam05",
      "cam12",
      "cam24",
      "cam23"
    ],
    "observation_count": 4,
    "track_count": 4,
    "best_consensus_score": 0.98,
    "average_consensus_score": 0.94,
    "status": "CONFIRMED",
    "timeline": [
      {
        "camera_id": "cam05",
        "track_id": "TRK-SIM-0001",
        "first_seen_pts_ms": 0.0,
        "recognition_pts_ms": 5000.0,
        "last_seen_pts_ms": 15000.0,
        "source_time": "2026-09-26T16:25:59.213547+00:00",
        "source_time_status": "RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.92,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-26T16:25:59.213547+00:00"
      },
      {
        "camera_id": "cam12",
        "track_id": "TRK-SIM-0002",
        "first_seen_pts_ms": 60000.0,
        "recognition_pts_ms": 65000.0,
        "last_seen_pts_ms": 75000.0,
        "source_time": "2026-09-26T16:34:46.443985+00:00",
        "source_time_status": "RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.935,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-26T16:34:46.443985+00:00"
      },
      {
        "camera_id": "cam24",
        "track_id": "TRK-SIM-0003",
        "first_seen_pts_ms": 120000.0,
        "recognition_pts_ms": 125000.0,
        "last_seen_pts_ms": 135000.0,
        "source_time": "2026-09-26T17:13:25.800464+00:00",
        "source_time_status": "RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.95,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-26T17:13:25.800464+00:00"
      },
      {
        "camera_id": "cam23",
        "track_id": "TRK-SIM-0004",
        "first_seen_pts_ms": 180000.0,
        "recognition_pts_ms": 185000.0,
        "last_seen_pts_ms": 195000.0,
        "source_time": "2026-09-26T18:28:29.687587+00:00",
        "source_time_status": "RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.965,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-26T18:28:29.687587+00:00"
      }
    ],
    "vehicle_details": {
      "make_model": "Royal Enfield Classic 350",
      "color": "Black",
      "class": "Two-Wheeler"
    },
    "total_distance_km": 81.66,
    "avg_speed_kmh": 40.0,
    "is_watchlist_match": false
  },
  {
    "vehicle_id": "VEH-GJ18RS4862",
    "registration_number": "GJ18RS4862",
    "normalized_registration_number": "GJ18RS4862",
    "first_seen": {
      "camera_id": "cam22",
      "pts_ms": 0.0,
      "source_time": "2026-09-26T16:29:59.213547+00:00",
      "source_time_status": "RESOLVED"
    },
    "last_seen": {
      "camera_id": "cam24",
      "pts_ms": 180000.0,
      "source_time": "2026-09-26T21:03:42.815037+00:00",
      "source_time_status": "RESOLVED"
    },
    "camera_count": 4,
    "cameras": [
      "cam22",
      "cam21",
      "cam23",
      "cam24"
    ],
    "observation_count": 4,
    "track_count": 4,
    "best_consensus_score": 0.98,
    "average_consensus_score": 0.94,
    "status": "CONFIRMED",
    "timeline": [
      {
        "camera_id": "cam22",
        "track_id": "TRK-SIM-0001",
        "first_seen_pts_ms": 0.0,
        "recognition_pts_ms": 5000.0,
        "last_seen_pts_ms": 15000.0,
        "source_time": "2026-09-26T16:29:59.213547+00:00",
        "source_time_status": "RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.92,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-26T16:29:59.213547+00:00"
      },
      {
        "camera_id": "cam21",
        "track_id": "TRK-SIM-0002",
        "first_seen_pts_ms": 60000.0,
        "recognition_pts_ms": 65000.0,
        "last_seen_pts_ms": 75000.0,
        "source_time": "2026-09-26T17:27:21.805831+00:00",
        "source_time_status": "RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.935,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-26T17:27:21.805831+00:00"
      },
      {
        "camera_id": "cam23",
        "track_id": "TRK-SIM-0003",
        "first_seen_pts_ms": 120000.0,
        "recognition_pts_ms": 125000.0,
        "last_seen_pts_ms": 135000.0,
        "source_time": "2026-09-26T20:08:42.001761+00:00",
        "source_time_status": "RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.95,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-26T20:08:42.001761+00:00"
      },
      {
        "camera_id": "cam24",
        "track_id": "TRK-SIM-0004",
        "first_seen_pts_ms": 180000.0,
        "recognition_pts_ms": 185000.0,
        "last_seen_pts_ms": 195000.0,
        "source_time": "2026-09-26T21:03:42.815037+00:00",
        "source_time_status": "RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.965,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-26T21:03:42.815037+00:00"
      }
    ],
    "vehicle_details": {
      "make_model": "Tata Nexon",
      "color": "Blue",
      "class": "Compact SUV"
    },
    "total_distance_km": 184.89,
    "avg_speed_kmh": 40.5,
    "is_watchlist_match": false
  },
  {
    "vehicle_id": "VEH-GJ05PQ2017",
    "registration_number": "GJ05PQ2017",
    "normalized_registration_number": "GJ05PQ2017",
    "first_seen": {
      "camera_id": "cam23",
      "pts_ms": 0.0,
      "source_time": "2026-09-26T15:48:59.213547+00:00",
      "source_time_status": "RESOLVED"
    },
    "last_seen": {
      "camera_id": "cam12",
      "pts_ms": 120000.0,
      "source_time": "2026-09-26T17:43:47.575639+00:00",
      "source_time_status": "RESOLVED"
    },
    "camera_count": 3,
    "cameras": [
      "cam23",
      "cam24",
      "cam12"
    ],
    "observation_count": 3,
    "track_count": 3,
    "best_consensus_score": 0.98,
    "average_consensus_score": 0.94,
    "status": "CONFIRMED",
    "timeline": [
      {
        "camera_id": "cam23",
        "track_id": "TRK-SIM-0001",
        "first_seen_pts_ms": 0.0,
        "recognition_pts_ms": 5000.0,
        "last_seen_pts_ms": 15000.0,
        "source_time": "2026-09-26T15:48:59.213547+00:00",
        "source_time_status": "RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.92,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-26T15:48:59.213547+00:00"
      },
      {
        "camera_id": "cam24",
        "track_id": "TRK-SIM-0002",
        "first_seen_pts_ms": 60000.0,
        "recognition_pts_ms": 65000.0,
        "last_seen_pts_ms": 75000.0,
        "source_time": "2026-09-26T17:17:32.758205+00:00",
        "source_time_status": "RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.935,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-26T17:17:32.758205+00:00"
      },
      {
        "camera_id": "cam12",
        "track_id": "TRK-SIM-0003",
        "first_seen_pts_ms": 120000.0,
        "recognition_pts_ms": 125000.0,
        "last_seen_pts_ms": 135000.0,
        "source_time": "2026-09-26T17:43:47.575639+00:00",
        "source_time_status": "RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.95,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-26T17:43:47.575639+00:00"
      }
    ],
    "vehicle_details": {
      "make_model": "Mahindra Scorpio-N",
      "color": "Black",
      "class": "SUV"
    },
    "total_distance_km": 73.78,
    "avg_speed_kmh": 38.6,
    "is_watchlist_match": true
  },
  {
    "vehicle_id": "VEH-GJ27XY8355",
    "registration_number": "GJ27XY8355",
    "normalized_registration_number": "GJ27XY8355",
    "first_seen": {
      "camera_id": "cam24",
      "pts_ms": 0.0,
      "source_time": "2026-09-26T16:05:59.213547+00:00",
      "source_time_status": "RESOLVED"
    },
    "last_seen": {
      "camera_id": "cam21",
      "pts_ms": 120000.0,
      "source_time": "2026-09-26T18:53:21.447467+00:00",
      "source_time_status": "RESOLVED"
    },
    "camera_count": 3,
    "cameras": [
      "cam24",
      "cam23",
      "cam21"
    ],
    "observation_count": 3,
    "track_count": 3,
    "best_consensus_score": 0.98,
    "average_consensus_score": 0.94,
    "status": "CONFIRMED",
    "timeline": [
      {
        "camera_id": "cam24",
        "track_id": "TRK-SIM-0001",
        "first_seen_pts_ms": 0.0,
        "recognition_pts_ms": 5000.0,
        "last_seen_pts_ms": 15000.0,
        "source_time": "2026-09-26T16:05:59.213547+00:00",
        "source_time_status": "RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.92,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-26T16:05:59.213547+00:00"
      },
      {
        "camera_id": "cam23",
        "track_id": "TRK-SIM-0002",
        "first_seen_pts_ms": 60000.0,
        "recognition_pts_ms": 65000.0,
        "last_seen_pts_ms": 75000.0,
        "source_time": "2026-09-26T17:00:21.917904+00:00",
        "source_time_status": "RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.935,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-26T17:00:21.917904+00:00"
      },
      {
        "camera_id": "cam21",
        "track_id": "TRK-SIM-0003",
        "first_seen_pts_ms": 120000.0,
        "recognition_pts_ms": 125000.0,
        "last_seen_pts_ms": 135000.0,
        "source_time": "2026-09-26T18:53:21.447467+00:00",
        "source_time_status": "RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.95,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-26T18:53:21.447467+00:00"
      }
    ],
    "vehicle_details": {
      "make_model": "Maruti Suzuki Baleno",
      "color": "White",
      "class": "Hatchback"
    },
    "total_distance_km": 138.04,
    "avg_speed_kmh": 49.5,
    "is_watchlist_match": false
  },
  {
    "vehicle_id": "VEH-GJ03MN5689",
    "registration_number": "GJ03MN5689",
    "normalized_registration_number": "GJ03MN5689",
    "first_seen": {
      "camera_id": "cam12",
      "pts_ms": 0.0,
      "source_time": "2026-09-26T16:08:59.213547+00:00",
      "source_time_status": "RESOLVED"
    },
    "last_seen": {
      "camera_id": "cam22",
      "pts_ms": 240000.0,
      "source_time": "2026-09-26T20:12:10.775771+00:00",
      "source_time_status": "RESOLVED"
    },
    "camera_count": 5,
    "cameras": [
      "cam12",
      "cam24",
      "cam23",
      "cam21",
      "cam22"
    ],
    "observation_count": 5,
    "track_count": 5,
    "best_consensus_score": 0.98,
    "average_consensus_score": 0.94,
    "status": "CONFIRMED",
    "timeline": [
      {
        "camera_id": "cam12",
        "track_id": "TRK-SIM-0001",
        "first_seen_pts_ms": 0.0,
        "recognition_pts_ms": 5000.0,
        "last_seen_pts_ms": 15000.0,
        "source_time": "2026-09-26T16:08:59.213547+00:00",
        "source_time_status": "RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.92,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-26T16:08:59.213547+00:00"
      },
      {
        "camera_id": "cam24",
        "track_id": "TRK-SIM-0002",
        "first_seen_pts_ms": 60000.0,
        "recognition_pts_ms": 65000.0,
        "last_seen_pts_ms": 75000.0,
        "source_time": "2026-09-26T16:37:57.196102+00:00",
        "source_time_status": "RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.935,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-26T16:37:57.196102+00:00"
      },
      {
        "camera_id": "cam23",
        "track_id": "TRK-SIM-0003",
        "first_seen_pts_ms": 120000.0,
        "recognition_pts_ms": 125000.0,
        "last_seen_pts_ms": 135000.0,
        "source_time": "2026-09-26T17:35:13.450414+00:00",
        "source_time_status": "RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.95,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-26T17:35:13.450414+00:00"
      },
      {
        "camera_id": "cam21",
        "track_id": "TRK-SIM-0004",
        "first_seen_pts_ms": 180000.0,
        "recognition_pts_ms": 185000.0,
        "last_seen_pts_ms": 195000.0,
        "source_time": "2026-09-26T19:19:57.677126+00:00",
        "source_time_status": "RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.965,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-26T19:19:57.677126+00:00"
      },
      {
        "camera_id": "cam22",
        "track_id": "TRK-SIM-0005",
        "first_seen_pts_ms": 240000.0,
        "recognition_pts_ms": 245000.0,
        "last_seen_pts_ms": 255000.0,
        "source_time": "2026-09-26T20:12:10.775771+00:00",
        "source_time_status": "RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.98,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-26T20:12:10.775771+00:00"
      }
    ],
    "vehicle_details": {
      "make_model": "Honda City",
      "color": "Grey",
      "class": "Sedan"
    },
    "total_distance_km": 208.6,
    "avg_speed_kmh": 51.5,
    "is_watchlist_match": true
  },
  {
    "vehicle_id": "VEH-GJ03XY5190",
    "registration_number": "GJ03XY5190",
    "normalized_registration_number": "GJ03XY5190",
    "first_seen": {
      "camera_id": "cam28",
      "pts_ms": 0.0,
      "source_time": "2026-09-26T15:58:59.213547+00:00",
      "source_time_status": "RESOLVED"
    },
    "last_seen": {
      "camera_id": "cam19",
      "pts_ms": 120000.0,
      "source_time": "2026-09-26T16:09:43.812794+00:00",
      "source_time_status": "RESOLVED"
    },
    "camera_count": 3,
    "cameras": [
      "cam28",
      "cam29",
      "cam19"
    ],
    "observation_count": 3,
    "track_count": 3,
    "best_consensus_score": 0.98,
    "average_consensus_score": 0.94,
    "status": "CONFIRMED",
    "timeline": [
      {
        "camera_id": "cam28",
        "track_id": "TRK-SIM-0001",
        "first_seen_pts_ms": 0.0,
        "recognition_pts_ms": 5000.0,
        "last_seen_pts_ms": 15000.0,
        "source_time": "2026-09-26T15:58:59.213547+00:00",
        "source_time_status": "RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.92,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-26T15:58:59.213547+00:00"
      },
      {
        "camera_id": "cam29",
        "track_id": "TRK-SIM-0002",
        "first_seen_pts_ms": 60000.0,
        "recognition_pts_ms": 65000.0,
        "last_seen_pts_ms": 75000.0,
        "source_time": "2026-09-26T16:01:29.213547+00:00",
        "source_time_status": "RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.935,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-26T16:01:29.213547+00:00"
      },
      {
        "camera_id": "cam19",
        "track_id": "TRK-SIM-0003",
        "first_seen_pts_ms": 120000.0,
        "recognition_pts_ms": 125000.0,
        "last_seen_pts_ms": 135000.0,
        "source_time": "2026-09-26T16:09:43.812794+00:00",
        "source_time_status": "RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.95,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-26T16:09:43.812794+00:00"
      }
    ],
    "vehicle_details": {
      "make_model": "Toyota Innova Crysta",
      "color": "White",
      "class": "MPV"
    },
    "total_distance_km": 7.06,
    "avg_speed_kmh": 39.4,
    "is_watchlist_match": false
  },
  {
    "vehicle_id": "VEH-GJ05CD6308",
    "registration_number": "GJ05CD6308",
    "normalized_registration_number": "GJ05CD6308",
    "first_seen": {
      "camera_id": "cam27",
      "pts_ms": 0.0,
      "source_time": "2026-09-26T16:35:59.213547+00:00",
      "source_time_status": "RESOLVED"
    },
    "last_seen": {
      "camera_id": "cam26",
      "pts_ms": 180000.0,
      "source_time": "2026-09-26T16:53:20.858089+00:00",
      "source_time_status": "RESOLVED"
    },
    "camera_count": 4,
    "cameras": [
      "cam27",
      "cam28",
      "cam29",
      "cam26"
    ],
    "observation_count": 4,
    "track_count": 4,
    "best_consensus_score": 0.98,
    "average_consensus_score": 0.94,
    "status": "CONFIRMED",
    "timeline": [
      {
        "camera_id": "cam27",
        "track_id": "TRK-SIM-0001",
        "first_seen_pts_ms": 0.0,
        "recognition_pts_ms": 5000.0,
        "last_seen_pts_ms": 15000.0,
        "source_time": "2026-09-26T16:35:59.213547+00:00",
        "source_time_status": "RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.92,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-26T16:35:59.213547+00:00"
      },
      {
        "camera_id": "cam28",
        "track_id": "TRK-SIM-0002",
        "first_seen_pts_ms": 60000.0,
        "recognition_pts_ms": 65000.0,
        "last_seen_pts_ms": 75000.0,
        "source_time": "2026-09-26T16:38:29.213547+00:00",
        "source_time_status": "RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.935,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-26T16:38:29.213547+00:00"
      },
      {
        "camera_id": "cam29",
        "track_id": "TRK-SIM-0003",
        "first_seen_pts_ms": 120000.0,
        "recognition_pts_ms": 125000.0,
        "last_seen_pts_ms": 135000.0,
        "source_time": "2026-09-26T16:40:59.213547+00:00",
        "source_time_status": "RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.95,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-26T16:40:59.213547+00:00"
      },
      {
        "camera_id": "cam26",
        "track_id": "TRK-SIM-0004",
        "first_seen_pts_ms": 180000.0,
        "recognition_pts_ms": 185000.0,
        "last_seen_pts_ms": 195000.0,
        "source_time": "2026-09-26T16:53:20.858089+00:00",
        "source_time_status": "RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.965,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-26T16:53:20.858089+00:00"
      }
    ],
    "vehicle_details": {
      "make_model": "Kia Seltos",
      "color": "Red",
      "class": "SUV"
    },
    "total_distance_km": 9.69,
    "avg_speed_kmh": 33.5,
    "is_watchlist_match": false
  },
  {
    "vehicle_id": "VEH-GJ27MN8049",
    "registration_number": "GJ27MN8049",
    "normalized_registration_number": "GJ27MN8049",
    "first_seen": {
      "camera_id": "cam26",
      "pts_ms": 0.0,
      "source_time": "2026-09-26T14:49:59.213547+00:00",
      "source_time_status": "RESOLVED"
    },
    "last_seen": {
      "camera_id": "cam28",
      "pts_ms": 120000.0,
      "source_time": "2026-09-26T15:04:29.071957+00:00",
      "source_time_status": "RESOLVED"
    },
    "camera_count": 3,
    "cameras": [
      "cam26",
      "cam29",
      "cam28"
    ],
    "observation_count": 3,
    "track_count": 3,
    "best_consensus_score": 0.98,
    "average_consensus_score": 0.94,
    "status": "CONFIRMED",
    "timeline": [
      {
        "camera_id": "cam26",
        "track_id": "TRK-SIM-0001",
        "first_seen_pts_ms": 0.0,
        "recognition_pts_ms": 5000.0,
        "last_seen_pts_ms": 15000.0,
        "source_time": "2026-09-26T14:49:59.213547+00:00",
        "source_time_status": "RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.92,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-26T14:49:59.213547+00:00"
      },
      {
        "camera_id": "cam29",
        "track_id": "TRK-SIM-0002",
        "first_seen_pts_ms": 60000.0,
        "recognition_pts_ms": 65000.0,
        "last_seen_pts_ms": 75000.0,
        "source_time": "2026-09-26T15:01:59.071957+00:00",
        "source_time_status": "RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.935,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-26T15:01:59.071957+00:00"
      },
      {
        "camera_id": "cam28",
        "track_id": "TRK-SIM-0003",
        "first_seen_pts_ms": 120000.0,
        "recognition_pts_ms": 125000.0,
        "last_seen_pts_ms": 135000.0,
        "source_time": "2026-09-26T15:04:29.071957+00:00",
        "source_time_status": "RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.95,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-26T15:04:29.071957+00:00"
      }
    ],
    "vehicle_details": {
      "make_model": "Royal Enfield Classic 350",
      "color": "Black",
      "class": "Two-Wheeler"
    },
    "total_distance_km": 9.22,
    "avg_speed_kmh": 38.2,
    "is_watchlist_match": false
  },
  {
    "vehicle_id": "VEH-GJ02ZZ4603",
    "registration_number": "GJ02ZZ4603",
    "normalized_registration_number": "GJ02ZZ4603",
    "first_seen": {
      "camera_id": "cam25",
      "pts_ms": 0.0,
      "source_time": "2026-09-26T15:08:59.213547+00:00",
      "source_time_status": "RESOLVED"
    },
    "last_seen": {
      "camera_id": "cam29",
      "pts_ms": 120000.0,
      "source_time": "2026-09-26T15:25:01.244896+00:00",
      "source_time_status": "RESOLVED"
    },
    "camera_count": 3,
    "cameras": [
      "cam25",
      "cam19",
      "cam29"
    ],
    "observation_count": 3,
    "track_count": 3,
    "best_consensus_score": 0.98,
    "average_consensus_score": 0.94,
    "status": "CONFIRMED",
    "timeline": [
      {
        "camera_id": "cam25",
        "track_id": "TRK-SIM-0001",
        "first_seen_pts_ms": 0.0,
        "recognition_pts_ms": 5000.0,
        "last_seen_pts_ms": 15000.0,
        "source_time": "2026-09-26T15:08:59.213547+00:00",
        "source_time_status": "RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.92,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-26T15:08:59.213547+00:00"
      },
      {
        "camera_id": "cam19",
        "track_id": "TRK-SIM-0002",
        "first_seen_pts_ms": 60000.0,
        "recognition_pts_ms": 65000.0,
        "last_seen_pts_ms": 75000.0,
        "source_time": "2026-09-26T15:15:46.399823+00:00",
        "source_time_status": "RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.935,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-26T15:15:46.399823+00:00"
      },
      {
        "camera_id": "cam29",
        "track_id": "TRK-SIM-0003",
        "first_seen_pts_ms": 120000.0,
        "recognition_pts_ms": 125000.0,
        "last_seen_pts_ms": 135000.0,
        "source_time": "2026-09-26T15:25:01.244896+00:00",
        "source_time_status": "RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.95,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-26T15:25:01.244896+00:00"
      }
    ],
    "vehicle_details": {
      "make_model": "Kia Seltos",
      "color": "Red",
      "class": "SUV"
    },
    "total_distance_km": 10.46,
    "avg_speed_kmh": 39.1,
    "is_watchlist_match": true
  },
  {
    "vehicle_id": "VEH-GJ05XY9525",
    "registration_number": "GJ05XY9525",
    "normalized_registration_number": "GJ05XY9525",
    "first_seen": {
      "camera_id": "cam19",
      "pts_ms": 0.0,
      "source_time": "2026-09-26T16:06:59.213547+00:00",
      "source_time_status": "RESOLVED"
    },
    "last_seen": {
      "camera_id": "cam27",
      "pts_ms": 60000.0,
      "source_time": "2026-09-26T16:15:51.859778+00:00",
      "source_time_status": "RESOLVED"
    },
    "camera_count": 2,
    "cameras": [
      "cam19",
      "cam27"
    ],
    "observation_count": 2,
    "track_count": 2,
    "best_consensus_score": 0.98,
    "average_consensus_score": 0.94,
    "status": "CONFIRMED",
    "timeline": [
      {
        "camera_id": "cam19",
        "track_id": "TRK-SIM-0001",
        "first_seen_pts_ms": 0.0,
        "recognition_pts_ms": 5000.0,
        "last_seen_pts_ms": 15000.0,
        "source_time": "2026-09-26T16:06:59.213547+00:00",
        "source_time_status": "RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.92,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-26T16:06:59.213547+00:00"
      },
      {
        "camera_id": "cam27",
        "track_id": "TRK-SIM-0002",
        "first_seen_pts_ms": 60000.0,
        "recognition_pts_ms": 65000.0,
        "last_seen_pts_ms": 75000.0,
        "source_time": "2026-09-26T16:15:51.859778+00:00",
        "source_time_status": "RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.935,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-26T16:15:51.859778+00:00"
      }
    ],
    "vehicle_details": {
      "make_model": "Maruti Suzuki Swift",
      "color": "Silver",
      "class": "Hatchback"
    },
    "total_distance_km": 7.36,
    "avg_speed_kmh": 49.8,
    "is_watchlist_match": false
  },
  {
    "vehicle_id": "VEH-GJ03XY4552",
    "registration_number": "GJ03XY4552",
    "normalized_registration_number": "GJ03XY4552",
    "first_seen": {
      "camera_id": "cam29",
      "pts_ms": 0.0,
      "source_time": "2026-09-26T15:49:59.213547+00:00",
      "source_time_status": "RESOLVED"
    },
    "last_seen": {
      "camera_id": "cam26",
      "pts_ms": 60000.0,
      "source_time": "2026-09-26T16:03:40.784174+00:00",
      "source_time_status": "RESOLVED"
    },
    "camera_count": 2,
    "cameras": [
      "cam29",
      "cam26"
    ],
    "observation_count": 2,
    "track_count": 2,
    "best_consensus_score": 0.98,
    "average_consensus_score": 0.94,
    "status": "CONFIRMED",
    "timeline": [
      {
        "camera_id": "cam29",
        "track_id": "TRK-SIM-0001",
        "first_seen_pts_ms": 0.0,
        "recognition_pts_ms": 5000.0,
        "last_seen_pts_ms": 15000.0,
        "source_time": "2026-09-26T15:49:59.213547+00:00",
        "source_time_status": "RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.92,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-26T15:49:59.213547+00:00"
      },
      {
        "camera_id": "cam26",
        "track_id": "TRK-SIM-0002",
        "first_seen_pts_ms": 60000.0,
        "recognition_pts_ms": 65000.0,
        "last_seen_pts_ms": 75000.0,
        "source_time": "2026-09-26T16:03:40.784174+00:00",
        "source_time_status": "RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.935,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-26T16:03:40.784174+00:00"
      }
    ],
    "vehicle_details": {
      "make_model": "Kia Seltos",
      "color": "Red",
      "class": "SUV"
    },
    "total_distance_km": 8.69,
    "avg_speed_kmh": 38.1,
    "is_watchlist_match": true
  },
  {
    "vehicle_id": "VEH-GJ05XY9217",
    "registration_number": "GJ05XY9217",
    "normalized_registration_number": "GJ05XY9217",
    "first_seen": {
      "camera_id": "cam28",
      "pts_ms": 0.0,
      "source_time": "2026-09-26T16:22:59.213547+00:00",
      "source_time_status": "RESOLVED"
    },
    "last_seen": {
      "camera_id": "cam25",
      "pts_ms": 180000.0,
      "source_time": "2026-09-26T16:37:52.025782+00:00",
      "source_time_status": "RESOLVED"
    },
    "camera_count": 4,
    "cameras": [
      "cam28",
      "cam29",
      "cam19",
      "cam25"
    ],
    "observation_count": 4,
    "track_count": 4,
    "best_consensus_score": 0.98,
    "average_consensus_score": 0.94,
    "status": "CONFIRMED",
    "timeline": [
      {
        "camera_id": "cam28",
        "track_id": "TRK-SIM-0001",
        "first_seen_pts_ms": 0.0,
        "recognition_pts_ms": 5000.0,
        "last_seen_pts_ms": 15000.0,
        "source_time": "2026-09-26T16:22:59.213547+00:00",
        "source_time_status": "RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.92,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-26T16:22:59.213547+00:00"
      },
      {
        "camera_id": "cam29",
        "track_id": "TRK-SIM-0002",
        "first_seen_pts_ms": 60000.0,
        "recognition_pts_ms": 65000.0,
        "last_seen_pts_ms": 75000.0,
        "source_time": "2026-09-26T16:25:29.213547+00:00",
        "source_time_status": "RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.935,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-26T16:25:29.213547+00:00"
      },
      {
        "camera_id": "cam19",
        "track_id": "TRK-SIM-0003",
        "first_seen_pts_ms": 120000.0,
        "recognition_pts_ms": 125000.0,
        "last_seen_pts_ms": 135000.0,
        "source_time": "2026-09-26T16:33:47.609112+00:00",
        "source_time_status": "RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.95,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-26T16:33:47.609112+00:00"
      },
      {
        "camera_id": "cam25",
        "track_id": "TRK-SIM-0004",
        "first_seen_pts_ms": 180000.0,
        "recognition_pts_ms": 185000.0,
        "last_seen_pts_ms": 195000.0,
        "source_time": "2026-09-26T16:37:52.025782+00:00",
        "source_time_status": "RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.965,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-26T16:37:52.025782+00:00"
      }
    ],
    "vehicle_details": {
      "make_model": "Hyundai Creta",
      "color": "White",
      "class": "SUV"
    },
    "total_distance_km": 10.99,
    "avg_speed_kmh": 44.3,
    "is_watchlist_match": true
  },
  {
    "vehicle_id": "VEH-GJ05XY7666",
    "registration_number": "GJ05XY7666",
    "normalized_registration_number": "GJ05XY7666",
    "first_seen": {
      "camera_id": "cam27",
      "pts_ms": 0.0,
      "source_time": "2026-09-26T15:12:59.213547+00:00",
      "source_time_status": "RESOLVED"
    },
    "last_seen": {
      "camera_id": "cam19",
      "pts_ms": 60000.0,
      "source_time": "2026-09-26T15:22:20.375573+00:00",
      "source_time_status": "RESOLVED"
    },
    "camera_count": 2,
    "cameras": [
      "cam27",
      "cam19"
    ],
    "observation_count": 2,
    "track_count": 2,
    "best_consensus_score": 0.98,
    "average_consensus_score": 0.94,
    "status": "CONFIRMED",
    "timeline": [
      {
        "camera_id": "cam27",
        "track_id": "TRK-SIM-0001",
        "first_seen_pts_ms": 0.0,
        "recognition_pts_ms": 5000.0,
        "last_seen_pts_ms": 15000.0,
        "source_time": "2026-09-26T15:12:59.213547+00:00",
        "source_time_status": "RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.92,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-26T15:12:59.213547+00:00"
      },
      {
        "camera_id": "cam19",
        "track_id": "TRK-SIM-0002",
        "first_seen_pts_ms": 60000.0,
        "recognition_pts_ms": 65000.0,
        "last_seen_pts_ms": 75000.0,
        "source_time": "2026-09-26T15:22:20.375573+00:00",
        "source_time_status": "RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.935,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-26T15:22:20.375573+00:00"
      }
    ],
    "vehicle_details": {
      "make_model": "Tata Nexon",
      "color": "Blue",
      "class": "Compact SUV"
    },
    "total_distance_km": 7.36,
    "avg_speed_kmh": 47.2,
    "is_watchlist_match": true
  },
  {
    "vehicle_id": "VEH-GJ18MN6718",
    "registration_number": "GJ18MN6718",
    "normalized_registration_number": "GJ18MN6718",
    "first_seen": {
      "camera_id": "cam11",
      "pts_ms": 0.0,
      "source_time": "2026-09-26T14:37:59.213547+00:00",
      "source_time_status": "RESOLVED"
    },
    "last_seen": {
      "camera_id": "cam06",
      "pts_ms": 180000.0,
      "source_time": "2026-09-26T14:45:29.293114+00:00",
      "source_time_status": "RESOLVED"
    },
    "camera_count": 4,
    "cameras": [
      "cam11",
      "cam08",
      "cam10",
      "cam06"
    ],
    "observation_count": 4,
    "track_count": 4,
    "best_consensus_score": 0.98,
    "average_consensus_score": 0.94,
    "status": "CONFIRMED",
    "timeline": [
      {
        "camera_id": "cam11",
        "track_id": "TRK-SIM-0001",
        "first_seen_pts_ms": 0.0,
        "recognition_pts_ms": 5000.0,
        "last_seen_pts_ms": 15000.0,
        "source_time": "2026-09-26T14:37:59.213547+00:00",
        "source_time_status": "RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.92,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-26T14:37:59.213547+00:00"
      },
      {
        "camera_id": "cam08",
        "track_id": "TRK-SIM-0002",
        "first_seen_pts_ms": 60000.0,
        "recognition_pts_ms": 65000.0,
        "last_seen_pts_ms": 75000.0,
        "source_time": "2026-09-26T14:40:29.293114+00:00",
        "source_time_status": "RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.935,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-26T14:40:29.293114+00:00"
      },
      {
        "camera_id": "cam10",
        "track_id": "TRK-SIM-0003",
        "first_seen_pts_ms": 120000.0,
        "recognition_pts_ms": 125000.0,
        "last_seen_pts_ms": 135000.0,
        "source_time": "2026-09-26T14:42:59.293114+00:00",
        "source_time_status": "RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.95,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-26T14:42:59.293114+00:00"
      },
      {
        "camera_id": "cam06",
        "track_id": "TRK-SIM-0004",
        "first_seen_pts_ms": 180000.0,
        "recognition_pts_ms": 185000.0,
        "last_seen_pts_ms": 195000.0,
        "source_time": "2026-09-26T14:45:29.293114+00:00",
        "source_time_status": "RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.965,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-26T14:45:29.293114+00:00"
      }
    ],
    "vehicle_details": {
      "make_model": "Hyundai Creta",
      "color": "White",
      "class": "SUV"
    },
    "total_distance_km": 3.7,
    "avg_speed_kmh": 29.6,
    "is_watchlist_match": false
  },
  {
    "vehicle_id": "VEH-GJ03RS3485",
    "registration_number": "GJ03RS3485",
    "normalized_registration_number": "GJ03RS3485",
    "first_seen": {
      "camera_id": "cam08",
      "pts_ms": 0.0,
      "source_time": "2026-09-26T16:01:59.213547+00:00",
      "source_time_status": "RESOLVED"
    },
    "last_seen": {
      "camera_id": "cam09",
      "pts_ms": 120000.0,
      "source_time": "2026-09-26T16:07:18.885410+00:00",
      "source_time_status": "RESOLVED"
    },
    "camera_count": 3,
    "cameras": [
      "cam08",
      "cam10",
      "cam09"
    ],
    "observation_count": 3,
    "track_count": 3,
    "best_consensus_score": 0.98,
    "average_consensus_score": 0.94,
    "status": "CONFIRMED",
    "timeline": [
      {
        "camera_id": "cam08",
        "track_id": "TRK-SIM-0001",
        "first_seen_pts_ms": 0.0,
        "recognition_pts_ms": 5000.0,
        "last_seen_pts_ms": 15000.0,
        "source_time": "2026-09-26T16:01:59.213547+00:00",
        "source_time_status": "RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.92,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-26T16:01:59.213547+00:00"
      },
      {
        "camera_id": "cam10",
        "track_id": "TRK-SIM-0002",
        "first_seen_pts_ms": 60000.0,
        "recognition_pts_ms": 65000.0,
        "last_seen_pts_ms": 75000.0,
        "source_time": "2026-09-26T16:04:29.213547+00:00",
        "source_time_status": "RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.935,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-26T16:04:29.213547+00:00"
      },
      {
        "camera_id": "cam09",
        "track_id": "TRK-SIM-0003",
        "first_seen_pts_ms": 120000.0,
        "recognition_pts_ms": 125000.0,
        "last_seen_pts_ms": 135000.0,
        "source_time": "2026-09-26T16:07:18.885410+00:00",
        "source_time_status": "RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.95,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-26T16:07:18.885410+00:00"
      }
    ],
    "vehicle_details": {
      "make_model": "Toyota Innova Crysta",
      "color": "White",
      "class": "MPV"
    },
    "total_distance_km": 3.06,
    "avg_speed_kmh": 34.5,
    "is_watchlist_match": false
  },
  {
    "vehicle_id": "VEH-GJ03GH3755",
    "registration_number": "GJ03GH3755",
    "normalized_registration_number": "GJ03GH3755",
    "first_seen": {
      "camera_id": "cam10",
      "pts_ms": 0.0,
      "source_time": "2026-09-26T16:43:59.213547+00:00",
      "source_time_status": "RESOLVED"
    },
    "last_seen": {
      "camera_id": "cam08",
      "pts_ms": 60000.0,
      "source_time": "2026-09-26T16:46:29.213547+00:00",
      "source_time_status": "RESOLVED"
    },
    "camera_count": 2,
    "cameras": [
      "cam10",
      "cam08"
    ],
    "observation_count": 2,
    "track_count": 2,
    "best_consensus_score": 0.98,
    "average_consensus_score": 0.94,
    "status": "CONFIRMED",
    "timeline": [
      {
        "camera_id": "cam10",
        "track_id": "TRK-SIM-0001",
        "first_seen_pts_ms": 0.0,
        "recognition_pts_ms": 5000.0,
        "last_seen_pts_ms": 15000.0,
        "source_time": "2026-09-26T16:43:59.213547+00:00",
        "source_time_status": "RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.92,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-26T16:43:59.213547+00:00"
      },
      {
        "camera_id": "cam08",
        "track_id": "TRK-SIM-0002",
        "first_seen_pts_ms": 60000.0,
        "recognition_pts_ms": 65000.0,
        "last_seen_pts_ms": 75000.0,
        "source_time": "2026-09-26T16:46:29.213547+00:00",
        "source_time_status": "RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.935,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-26T16:46:29.213547+00:00"
      }
    ],
    "vehicle_details": {
      "make_model": "Tata Nexon",
      "color": "Blue",
      "class": "Compact SUV"
    },
    "total_distance_km": 0.98,
    "avg_speed_kmh": 23.5,
    "is_watchlist_match": false
  },
  {
    "vehicle_id": "VEH-GJ05GH5034",
    "registration_number": "GJ05GH5034",
    "normalized_registration_number": "GJ05GH5034",
    "first_seen": {
      "camera_id": "cam11",
      "pts_ms": 0.0,
      "source_time": "2026-09-26T16:00:59.213547+00:00",
      "source_time_status": "RESOLVED"
    },
    "last_seen": {
      "camera_id": "cam07",
      "pts_ms": 240000.0,
      "source_time": "2026-09-26T17:20:29.581528+00:00",
      "source_time_status": "RESOLVED"
    },
    "camera_count": 5,
    "cameras": [
      "cam11",
      "cam08",
      "cam10",
      "cam09",
      "cam07"
    ],
    "observation_count": 5,
    "track_count": 5,
    "best_consensus_score": 0.98,
    "average_consensus_score": 0.94,
    "status": "CONFIRMED",
    "timeline": [
      {
        "camera_id": "cam11",
        "track_id": "TRK-SIM-0001",
        "first_seen_pts_ms": 0.0,
        "recognition_pts_ms": 5000.0,
        "last_seen_pts_ms": 15000.0,
        "source_time": "2026-09-26T16:00:59.213547+00:00",
        "source_time_status": "RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.92,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-26T16:00:59.213547+00:00"
      },
      {
        "camera_id": "cam08",
        "track_id": "TRK-SIM-0002",
        "first_seen_pts_ms": 60000.0,
        "recognition_pts_ms": 65000.0,
        "last_seen_pts_ms": 75000.0,
        "source_time": "2026-09-26T16:03:29.213547+00:00",
        "source_time_status": "RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.935,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-26T16:03:29.213547+00:00"
      },
      {
        "camera_id": "cam10",
        "track_id": "TRK-SIM-0003",
        "first_seen_pts_ms": 120000.0,
        "recognition_pts_ms": 125000.0,
        "last_seen_pts_ms": 135000.0,
        "source_time": "2026-09-26T16:05:59.213547+00:00",
        "source_time_status": "RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.95,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-26T16:05:59.213547+00:00"
      },
      {
        "camera_id": "cam09",
        "track_id": "TRK-SIM-0004",
        "first_seen_pts_ms": 180000.0,
        "recognition_pts_ms": 185000.0,
        "last_seen_pts_ms": 195000.0,
        "source_time": "2026-09-26T16:08:35.640613+00:00",
        "source_time_status": "RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.965,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-26T16:08:35.640613+00:00"
      },
      {
        "camera_id": "cam07",
        "track_id": "TRK-SIM-0005",
        "first_seen_pts_ms": 240000.0,
        "recognition_pts_ms": 245000.0,
        "last_seen_pts_ms": 255000.0,
        "source_time": "2026-09-26T17:20:29.581528+00:00",
        "source_time_status": "RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.98,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-26T17:20:29.581528+00:00"
      }
    ],
    "vehicle_details": {
      "make_model": "Hyundai Creta",
      "color": "White",
      "class": "SUV"
    },
    "total_distance_km": 72.64,
    "avg_speed_kmh": 54.8,
    "is_watchlist_match": false
  },
  {
    "vehicle_id": "VEH-GJ18GH3280",
    "registration_number": "GJ18GH3280",
    "normalized_registration_number": "GJ18GH3280",
    "first_seen": {
      "camera_id": "cam06",
      "pts_ms": 0.0,
      "source_time": "2026-09-26T16:02:59.213547+00:00",
      "source_time_status": "RESOLVED"
    },
    "last_seen": {
      "camera_id": "cam07",
      "pts_ms": 60000.0,
      "source_time": "2026-09-26T17:22:44.901967+00:00",
      "source_time_status": "RESOLVED"
    },
    "camera_count": 2,
    "cameras": [
      "cam06",
      "cam07"
    ],
    "observation_count": 2,
    "track_count": 2,
    "best_consensus_score": 0.98,
    "average_consensus_score": 0.94,
    "status": "CONFIRMED",
    "timeline": [
      {
        "camera_id": "cam06",
        "track_id": "TRK-SIM-0001",
        "first_seen_pts_ms": 0.0,
        "recognition_pts_ms": 5000.0,
        "last_seen_pts_ms": 15000.0,
        "source_time": "2026-09-26T16:02:59.213547+00:00",
        "source_time_status": "RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.92,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-26T16:02:59.213547+00:00"
      },
      {
        "camera_id": "cam07",
        "track_id": "TRK-SIM-0002",
        "first_seen_pts_ms": 60000.0,
        "recognition_pts_ms": 65000.0,
        "last_seen_pts_ms": 75000.0,
        "source_time": "2026-09-26T17:22:44.901967+00:00",
        "source_time_status": "RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.935,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-26T17:22:44.901967+00:00"
      }
    ],
    "vehicle_details": {
      "make_model": "GSRTC Express Bus",
      "color": "Orange-White",
      "class": "Bus"
    },
    "total_distance_km": 69.01,
    "avg_speed_kmh": 51.9,
    "is_watchlist_match": false
  },
  {
    "vehicle_id": "VEH-GJ05RS2314",
    "registration_number": "GJ05RS2314",
    "normalized_registration_number": "GJ05RS2314",
    "first_seen": {
      "camera_id": "cam09",
      "pts_ms": 0.0,
      "source_time": "2026-09-26T16:47:59.213547+00:00",
      "source_time_status": "RESOLVED"
    },
    "last_seen": {
      "camera_id": "cam10",
      "pts_ms": 60000.0,
      "source_time": "2026-09-26T16:50:29.213547+00:00",
      "source_time_status": "RESOLVED"
    },
    "camera_count": 2,
    "cameras": [
      "cam09",
      "cam10"
    ],
    "observation_count": 2,
    "track_count": 2,
    "best_consensus_score": 0.98,
    "average_consensus_score": 0.94,
    "status": "CONFIRMED",
    "timeline": [
      {
        "camera_id": "cam09",
        "track_id": "TRK-SIM-0001",
        "first_seen_pts_ms": 0.0,
        "recognition_pts_ms": 5000.0,
        "last_seen_pts_ms": 15000.0,
        "source_time": "2026-09-26T16:47:59.213547+00:00",
        "source_time_status": "RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.92,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-26T16:47:59.213547+00:00"
      },
      {
        "camera_id": "cam10",
        "track_id": "TRK-SIM-0002",
        "first_seen_pts_ms": 60000.0,
        "recognition_pts_ms": 65000.0,
        "last_seen_pts_ms": 75000.0,
        "source_time": "2026-09-26T16:50:29.213547+00:00",
        "source_time_status": "RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.935,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-26T16:50:29.213547+00:00"
      }
    ],
    "vehicle_details": {
      "make_model": "Honda City",
      "color": "Grey",
      "class": "Sedan"
    },
    "total_distance_km": 2.08,
    "avg_speed_kmh": 49.9,
    "is_watchlist_match": true
  },
  {
    "vehicle_id": "VEH-GJ27PQ3783",
    "registration_number": "GJ27PQ3783",
    "normalized_registration_number": "GJ27PQ3783",
    "first_seen": {
      "camera_id": "cam07",
      "pts_ms": 0.0,
      "source_time": "2026-09-26T14:34:59.213547+00:00",
      "source_time_status": "RESOLVED"
    },
    "last_seen": {
      "camera_id": "cam08",
      "pts_ms": 180000.0,
      "source_time": "2026-09-26T16:38:16.188402+00:00",
      "source_time_status": "RESOLVED"
    },
    "camera_count": 4,
    "cameras": [
      "cam07",
      "cam09",
      "cam10",
      "cam08"
    ],
    "observation_count": 4,
    "track_count": 4,
    "best_consensus_score": 0.98,
    "average_consensus_score": 0.94,
    "status": "CONFIRMED",
    "timeline": [
      {
        "camera_id": "cam07",
        "track_id": "TRK-SIM-0001",
        "first_seen_pts_ms": 0.0,
        "recognition_pts_ms": 5000.0,
        "last_seen_pts_ms": 15000.0,
        "source_time": "2026-09-26T14:34:59.213547+00:00",
        "source_time_status": "RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.92,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-26T14:34:59.213547+00:00"
      },
      {
        "camera_id": "cam09",
        "track_id": "TRK-SIM-0002",
        "first_seen_pts_ms": 60000.0,
        "recognition_pts_ms": 65000.0,
        "last_seen_pts_ms": 75000.0,
        "source_time": "2026-09-26T16:33:16.188402+00:00",
        "source_time_status": "RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.935,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-26T16:33:16.188402+00:00"
      },
      {
        "camera_id": "cam10",
        "track_id": "TRK-SIM-0003",
        "first_seen_pts_ms": 120000.0,
        "recognition_pts_ms": 125000.0,
        "last_seen_pts_ms": 135000.0,
        "source_time": "2026-09-26T16:35:46.188402+00:00",
        "source_time_status": "RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.95,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-26T16:35:46.188402+00:00"
      },
      {
        "camera_id": "cam08",
        "track_id": "TRK-SIM-0004",
        "first_seen_pts_ms": 180000.0,
        "recognition_pts_ms": 185000.0,
        "last_seen_pts_ms": 195000.0,
        "source_time": "2026-09-26T16:38:16.188402+00:00",
        "source_time_status": "RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.965,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-26T16:38:16.188402+00:00"
      }
    ],
    "vehicle_details": {
      "make_model": "Tata Nexon",
      "color": "Blue",
      "class": "Compact SUV"
    },
    "total_distance_km": 71.2,
    "avg_speed_kmh": 34.7,
    "is_watchlist_match": false
  },
  {
    "vehicle_id": "VEH-GJ05PQ6575",
    "registration_number": "GJ05PQ6575",
    "normalized_registration_number": "GJ05PQ6575",
    "first_seen": {
      "camera_id": "cam06",
      "pts_ms": 0.0,
      "source_time": "2026-09-26T16:20:59.213547+00:00",
      "source_time_status": "RESOLVED"
    },
    "last_seen": {
      "camera_id": "cam11",
      "pts_ms": 180000.0,
      "source_time": "2026-09-26T16:28:38.856147+00:00",
      "source_time_status": "RESOLVED"
    },
    "camera_count": 4,
    "cameras": [
      "cam06",
      "cam10",
      "cam08",
      "cam11"
    ],
    "observation_count": 4,
    "track_count": 4,
    "best_consensus_score": 0.98,
    "average_consensus_score": 0.94,
    "status": "CONFIRMED",
    "timeline": [
      {
        "camera_id": "cam06",
        "track_id": "TRK-SIM-0001",
        "first_seen_pts_ms": 0.0,
        "recognition_pts_ms": 5000.0,
        "last_seen_pts_ms": 15000.0,
        "source_time": "2026-09-26T16:20:59.213547+00:00",
        "source_time_status": "RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.92,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-26T16:20:59.213547+00:00"
      },
      {
        "camera_id": "cam10",
        "track_id": "TRK-SIM-0002",
        "first_seen_pts_ms": 60000.0,
        "recognition_pts_ms": 65000.0,
        "last_seen_pts_ms": 75000.0,
        "source_time": "2026-09-26T16:23:29.213547+00:00",
        "source_time_status": "RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.935,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-26T16:23:29.213547+00:00"
      },
      {
        "camera_id": "cam08",
        "track_id": "TRK-SIM-0003",
        "first_seen_pts_ms": 120000.0,
        "recognition_pts_ms": 125000.0,
        "last_seen_pts_ms": 135000.0,
        "source_time": "2026-09-26T16:25:59.213547+00:00",
        "source_time_status": "RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.95,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-26T16:25:59.213547+00:00"
      },
      {
        "camera_id": "cam11",
        "track_id": "TRK-SIM-0004",
        "first_seen_pts_ms": 180000.0,
        "recognition_pts_ms": 185000.0,
        "last_seen_pts_ms": 195000.0,
        "source_time": "2026-09-26T16:28:38.856147+00:00",
        "source_time_status": "RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.965,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-26T16:28:38.856147+00:00"
      }
    ],
    "vehicle_details": {
      "make_model": "Maruti Suzuki Baleno",
      "color": "White",
      "class": "Hatchback"
    },
    "total_distance_km": 3.7,
    "avg_speed_kmh": 28.9,
    "is_watchlist_match": false
  },
  {
    "vehicle_id": "VEH-GJ02AB9042",
    "registration_number": "GJ02AB9042",
    "normalized_registration_number": "GJ02AB9042",
    "first_seen": {
      "camera_id": "cam05",
      "pts_ms": 0.0,
      "source_time": "2026-09-26T16:06:59.213547+00:00",
      "source_time_status": "RESOLVED"
    },
    "last_seen": {
      "camera_id": "cam02",
      "pts_ms": 180000.0,
      "source_time": "2026-09-26T16:22:03.691870+00:00",
      "source_time_status": "RESOLVED"
    },
    "camera_count": 4,
    "cameras": [
      "cam05",
      "cam01",
      "cam15",
      "cam02"
    ],
    "observation_count": 4,
    "track_count": 4,
    "best_consensus_score": 0.98,
    "average_consensus_score": 0.94,
    "status": "CONFIRMED",
    "timeline": [
      {
        "camera_id": "cam05",
        "track_id": "TRK-SIM-0001",
        "first_seen_pts_ms": 0.0,
        "recognition_pts_ms": 5000.0,
        "last_seen_pts_ms": 15000.0,
        "source_time": "2026-09-26T16:06:59.213547+00:00",
        "source_time_status": "RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.92,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-26T16:06:59.213547+00:00"
      },
      {
        "camera_id": "cam01",
        "track_id": "TRK-SIM-0002",
        "first_seen_pts_ms": 60000.0,
        "recognition_pts_ms": 65000.0,
        "last_seen_pts_ms": 75000.0,
        "source_time": "2026-09-26T16:12:08.619498+00:00",
        "source_time_status": "RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.935,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-26T16:12:08.619498+00:00"
      },
      {
        "camera_id": "cam15",
        "track_id": "TRK-SIM-0003",
        "first_seen_pts_ms": 120000.0,
        "recognition_pts_ms": 125000.0,
        "last_seen_pts_ms": 135000.0,
        "source_time": "2026-09-26T16:19:18.351538+00:00",
        "source_time_status": "RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.95,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-26T16:19:18.351538+00:00"
      },
      {
        "camera_id": "cam02",
        "track_id": "TRK-SIM-0004",
        "first_seen_pts_ms": 180000.0,
        "recognition_pts_ms": 185000.0,
        "last_seen_pts_ms": 195000.0,
        "source_time": "2026-09-26T16:22:03.691870+00:00",
        "source_time_status": "RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.965,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-26T16:22:03.691870+00:00"
      }
    ],
    "vehicle_details": {
      "make_model": "GSRTC Express Bus",
      "color": "Orange-White",
      "class": "Bus"
    },
    "total_distance_km": 9.49,
    "avg_speed_kmh": 37.8,
    "is_watchlist_match": false
  },
  {
    "vehicle_id": "VEH-GJ03CD4866",
    "registration_number": "GJ03CD4866",
    "normalized_registration_number": "GJ03CD4866",
    "first_seen": {
      "camera_id": "cam16",
      "pts_ms": 0.0,
      "source_time": "2026-09-26T15:20:59.213547+00:00",
      "source_time_status": "RESOLVED"
    },
    "last_seen": {
      "camera_id": "cam13",
      "pts_ms": 300000.0,
      "source_time": "2026-09-26T15:40:29.161893+00:00",
      "source_time_status": "RESOLVED"
    },
    "camera_count": 6,
    "cameras": [
      "cam16",
      "cam05",
      "cam01",
      "cam15",
      "cam02",
      "cam13"
    ],
    "observation_count": 6,
    "track_count": 6,
    "best_consensus_score": 0.98,
    "average_consensus_score": 0.94,
    "status": "CONFIRMED",
    "timeline": [
      {
        "camera_id": "cam16",
        "track_id": "TRK-SIM-0001",
        "first_seen_pts_ms": 0.0,
        "recognition_pts_ms": 5000.0,
        "last_seen_pts_ms": 15000.0,
        "source_time": "2026-09-26T15:20:59.213547+00:00",
        "source_time_status": "RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.92,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-26T15:20:59.213547+00:00"
      },
      {
        "camera_id": "cam05",
        "track_id": "TRK-SIM-0002",
        "first_seen_pts_ms": 60000.0,
        "recognition_pts_ms": 65000.0,
        "last_seen_pts_ms": 75000.0,
        "source_time": "2026-09-26T15:23:29.213547+00:00",
        "source_time_status": "RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.935,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-26T15:23:29.213547+00:00"
      },
      {
        "camera_id": "cam01",
        "track_id": "TRK-SIM-0003",
        "first_seen_pts_ms": 120000.0,
        "recognition_pts_ms": 125000.0,
        "last_seen_pts_ms": 135000.0,
        "source_time": "2026-09-26T15:27:57.036672+00:00",
        "source_time_status": "RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.95,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-26T15:27:57.036672+00:00"
      },
      {
        "camera_id": "cam15",
        "track_id": "TRK-SIM-0004",
        "first_seen_pts_ms": 180000.0,
        "recognition_pts_ms": 185000.0,
        "last_seen_pts_ms": 195000.0,
        "source_time": "2026-09-26T15:35:03.137226+00:00",
        "source_time_status": "RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.965,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-26T15:35:03.137226+00:00"
      },
      {
        "camera_id": "cam02",
        "track_id": "TRK-SIM-0005",
        "first_seen_pts_ms": 240000.0,
        "recognition_pts_ms": 245000.0,
        "last_seen_pts_ms": 255000.0,
        "source_time": "2026-09-26T15:37:59.161893+00:00",
        "source_time_status": "RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.98,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-26T15:37:59.161893+00:00"
      },
      {
        "camera_id": "cam13",
        "track_id": "TRK-SIM-0006",
        "first_seen_pts_ms": 300000.0,
        "recognition_pts_ms": 305000.0,
        "last_seen_pts_ms": 315000.0,
        "source_time": "2026-09-26T15:40:29.161893+00:00",
        "source_time_status": "RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.92,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-26T15:40:29.161893+00:00"
      }
    ],
    "vehicle_details": {
      "make_model": "Maruti Suzuki Baleno",
      "color": "White",
      "class": "Hatchback"
    },
    "total_distance_km": 11.42,
    "avg_speed_kmh": 35.1,
    "is_watchlist_match": false
  },
  {
    "vehicle_id": "VEH-GJ27AB3446",
    "registration_number": "GJ27AB3446",
    "normalized_registration_number": "GJ27AB3446",
    "first_seen": {
      "camera_id": "cam03",
      "pts_ms": 0.0,
      "source_time": "2026-09-26T15:28:59.213547+00:00",
      "source_time_status": "RESOLVED"
    },
    "last_seen": {
      "camera_id": "cam04",
      "pts_ms": 240000.0,
      "source_time": "2026-09-26T15:45:06.839325+00:00",
      "source_time_status": "RESOLVED"
    },
    "camera_count": 5,
    "cameras": [
      "cam03",
      "cam01",
      "cam15",
      "cam02",
      "cam04"
    ],
    "observation_count": 5,
    "track_count": 5,
    "best_consensus_score": 0.98,
    "average_consensus_score": 0.94,
    "status": "CONFIRMED",
    "timeline": [
      {
        "camera_id": "cam03",
        "track_id": "TRK-SIM-0001",
        "first_seen_pts_ms": 0.0,
        "recognition_pts_ms": 5000.0,
        "last_seen_pts_ms": 15000.0,
        "source_time": "2026-09-26T15:28:59.213547+00:00",
        "source_time_status": "RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.92,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-26T15:28:59.213547+00:00"
      },
      {
        "camera_id": "cam01",
        "track_id": "TRK-SIM-0002",
        "first_seen_pts_ms": 60000.0,
        "recognition_pts_ms": 65000.0,
        "last_seen_pts_ms": 75000.0,
        "source_time": "2026-09-26T15:32:49.053600+00:00",
        "source_time_status": "RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.935,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-26T15:32:49.053600+00:00"
      },
      {
        "camera_id": "cam15",
        "track_id": "TRK-SIM-0003",
        "first_seen_pts_ms": 120000.0,
        "recognition_pts_ms": 125000.0,
        "last_seen_pts_ms": 135000.0,
        "source_time": "2026-09-26T15:38:43.447210+00:00",
        "source_time_status": "RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.95,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-26T15:38:43.447210+00:00"
      },
      {
        "camera_id": "cam02",
        "track_id": "TRK-SIM-0004",
        "first_seen_pts_ms": 180000.0,
        "recognition_pts_ms": 185000.0,
        "last_seen_pts_ms": 195000.0,
        "source_time": "2026-09-26T15:42:36.839325+00:00",
        "source_time_status": "RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.965,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-26T15:42:36.839325+00:00"
      },
      {
        "camera_id": "cam04",
        "track_id": "TRK-SIM-0005",
        "first_seen_pts_ms": 240000.0,
        "recognition_pts_ms": 245000.0,
        "last_seen_pts_ms": 255000.0,
        "source_time": "2026-09-26T15:45:06.839325+00:00",
        "source_time_status": "RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.98,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-26T15:45:06.839325+00:00"
      }
    ],
    "vehicle_details": {
      "make_model": "Tata Nexon",
      "color": "Blue",
      "class": "Compact SUV"
    },
    "total_distance_km": 10.65,
    "avg_speed_kmh": 39.6,
    "is_watchlist_match": false
  },
  {
    "vehicle_id": "VEH-GJ27GH7050",
    "registration_number": "GJ27GH7050",
    "normalized_registration_number": "GJ27GH7050",
    "first_seen": {
      "camera_id": "cam15",
      "pts_ms": 0.0,
      "source_time": "2026-09-26T16:32:59.213547+00:00",
      "source_time_status": "RESOLVED"
    },
    "last_seen": {
      "camera_id": "cam04",
      "pts_ms": 120000.0,
      "source_time": "2026-09-26T16:38:57.423797+00:00",
      "source_time_status": "RESOLVED"
    },
    "camera_count": 3,
    "cameras": [
      "cam15",
      "cam02",
      "cam04"
    ],
    "observation_count": 3,
    "track_count": 3,
    "best_consensus_score": 0.98,
    "average_consensus_score": 0.94,
    "status": "CONFIRMED",
    "timeline": [
      {
        "camera_id": "cam15",
        "track_id": "TRK-SIM-0001",
        "first_seen_pts_ms": 0.0,
        "recognition_pts_ms": 5000.0,
        "last_seen_pts_ms": 15000.0,
        "source_time": "2026-09-26T16:32:59.213547+00:00",
        "source_time_status": "RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.92,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-26T16:32:59.213547+00:00"
      },
      {
        "camera_id": "cam02",
        "track_id": "TRK-SIM-0002",
        "first_seen_pts_ms": 60000.0,
        "recognition_pts_ms": 65000.0,
        "last_seen_pts_ms": 75000.0,
        "source_time": "2026-09-26T16:36:27.423797+00:00",
        "source_time_status": "RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.935,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-26T16:36:27.423797+00:00"
      },
      {
        "camera_id": "cam04",
        "track_id": "TRK-SIM-0003",
        "first_seen_pts_ms": 120000.0,
        "recognition_pts_ms": 125000.0,
        "last_seen_pts_ms": 135000.0,
        "source_time": "2026-09-26T16:38:57.423797+00:00",
        "source_time_status": "RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.95,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-26T16:38:57.423797+00:00"
      }
    ],
    "vehicle_details": {
      "make_model": "Honda City",
      "color": "Grey",
      "class": "Sedan"
    },
    "total_distance_km": 3.77,
    "avg_speed_kmh": 37.9,
    "is_watchlist_match": false
  },
  {
    "vehicle_id": "VEH-GJ06MN8904",
    "registration_number": "GJ06MN8904",
    "normalized_registration_number": "GJ06MN8904",
    "first_seen": {
      "camera_id": "cam01",
      "pts_ms": 0.0,
      "source_time": "2026-09-26T16:35:59.213547+00:00",
      "source_time_status": "RESOLVED"
    },
    "last_seen": {
      "camera_id": "cam20",
      "pts_ms": 60000.0,
      "source_time": "2026-09-26T16:43:15.893995+00:00",
      "source_time_status": "RESOLVED"
    },
    "camera_count": 2,
    "cameras": [
      "cam01",
      "cam20"
    ],
    "observation_count": 2,
    "track_count": 2,
    "best_consensus_score": 0.98,
    "average_consensus_score": 0.94,
    "status": "CONFIRMED",
    "timeline": [
      {
        "camera_id": "cam01",
        "track_id": "TRK-SIM-0001",
        "first_seen_pts_ms": 0.0,
        "recognition_pts_ms": 5000.0,
        "last_seen_pts_ms": 15000.0,
        "source_time": "2026-09-26T16:35:59.213547+00:00",
        "source_time_status": "RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.92,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-26T16:35:59.213547+00:00"
      },
      {
        "camera_id": "cam20",
        "track_id": "TRK-SIM-0002",
        "first_seen_pts_ms": 60000.0,
        "recognition_pts_ms": 65000.0,
        "last_seen_pts_ms": 75000.0,
        "source_time": "2026-09-26T16:43:15.893995+00:00",
        "source_time_status": "RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.935,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-26T16:43:15.893995+00:00"
      }
    ],
    "vehicle_details": {
      "make_model": "Royal Enfield Classic 350",
      "color": "Black",
      "class": "Two-Wheeler"
    },
    "total_distance_km": 3.96,
    "avg_speed_kmh": 32.7,
    "is_watchlist_match": true
  },
  {
    "vehicle_id": "VEH-GJ03ZZ5514",
    "registration_number": "GJ03ZZ5514",
    "normalized_registration_number": "GJ03ZZ5514",
    "first_seen": {
      "camera_id": "cam02",
      "pts_ms": 0.0,
      "source_time": "2026-09-26T14:50:59.213547+00:00",
      "source_time_status": "RESOLVED"
    },
    "last_seen": {
      "camera_id": "cam12",
      "pts_ms": 240000.0,
      "source_time": "2026-09-26T15:19:19.470668+00:00",
      "source_time_status": "RESOLVED"
    },
    "camera_count": 5,
    "cameras": [
      "cam02",
      "cam15",
      "cam01",
      "cam05",
      "cam12"
    ],
    "observation_count": 5,
    "track_count": 5,
    "best_consensus_score": 0.98,
    "average_consensus_score": 0.94,
    "status": "CONFIRMED",
    "timeline": [
      {
        "camera_id": "cam02",
        "track_id": "TRK-SIM-0001",
        "first_seen_pts_ms": 0.0,
        "recognition_pts_ms": 5000.0,
        "last_seen_pts_ms": 15000.0,
        "source_time": "2026-09-26T14:50:59.213547+00:00",
        "source_time_status": "RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.92,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-26T14:50:59.213547+00:00"
      },
      {
        "camera_id": "cam15",
        "track_id": "TRK-SIM-0002",
        "first_seen_pts_ms": 60000.0,
        "recognition_pts_ms": 65000.0,
        "last_seen_pts_ms": 75000.0,
        "source_time": "2026-09-26T14:54:06.796854+00:00",
        "source_time_status": "RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.935,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-26T14:54:06.796854+00:00"
      },
      {
        "camera_id": "cam01",
        "track_id": "TRK-SIM-0003",
        "first_seen_pts_ms": 120000.0,
        "recognition_pts_ms": 125000.0,
        "last_seen_pts_ms": 135000.0,
        "source_time": "2026-09-26T14:59:27.060966+00:00",
        "source_time_status": "RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.95,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-26T14:59:27.060966+00:00"
      },
      {
        "camera_id": "cam05",
        "track_id": "TRK-SIM-0004",
        "first_seen_pts_ms": 180000.0,
        "recognition_pts_ms": 185000.0,
        "last_seen_pts_ms": 195000.0,
        "source_time": "2026-09-26T15:04:32.583022+00:00",
        "source_time_status": "RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.965,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-26T15:04:32.583022+00:00"
      },
      {
        "camera_id": "cam12",
        "track_id": "TRK-SIM-0005",
        "first_seen_pts_ms": 240000.0,
        "recognition_pts_ms": 245000.0,
        "last_seen_pts_ms": 255000.0,
        "source_time": "2026-09-26T15:19:19.470668+00:00",
        "source_time_status": "RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.98,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-26T15:19:19.470668+00:00"
      }
    ],
    "vehicle_details": {
      "make_model": "Maruti Suzuki Baleno",
      "color": "White",
      "class": "Hatchback"
    },
    "total_distance_km": 17.37,
    "avg_speed_kmh": 36.8,
    "is_watchlist_match": false
  },
  {
    "vehicle_id": "VEH-GJ18PQ2287",
    "registration_number": "GJ18PQ2287",
    "normalized_registration_number": "GJ18PQ2287",
    "first_seen": {
      "camera_id": "cam13",
      "pts_ms": 0.0,
      "source_time": "2026-09-26T17:21:59.213547+00:00",
      "source_time_status": "RESOLVED"
    },
    "last_seen": {
      "camera_id": "cam01",
      "pts_ms": 180000.0,
      "source_time": "2026-09-26T17:34:13.437675+00:00",
      "source_time_status": "RESOLVED"
    },
    "camera_count": 4,
    "cameras": [
      "cam13",
      "cam02",
      "cam15",
      "cam01"
    ],
    "observation_count": 4,
    "track_count": 4,
    "best_consensus_score": 0.98,
    "average_consensus_score": 0.94,
    "status": "CONFIRMED",
    "timeline": [
      {
        "camera_id": "cam13",
        "track_id": "TRK-SIM-0001",
        "first_seen_pts_ms": 0.0,
        "recognition_pts_ms": 5000.0,
        "last_seen_pts_ms": 15000.0,
        "source_time": "2026-09-26T17:21:59.213547+00:00",
        "source_time_status": "RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.92,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-26T17:21:59.213547+00:00"
      },
      {
        "camera_id": "cam02",
        "track_id": "TRK-SIM-0002",
        "first_seen_pts_ms": 60000.0,
        "recognition_pts_ms": 65000.0,
        "last_seen_pts_ms": 75000.0,
        "source_time": "2026-09-26T17:24:41.234697+00:00",
        "source_time_status": "RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.935,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-26T17:24:41.234697+00:00"
      },
      {
        "camera_id": "cam15",
        "track_id": "TRK-SIM-0003",
        "first_seen_pts_ms": 120000.0,
        "recognition_pts_ms": 125000.0,
        "last_seen_pts_ms": 135000.0,
        "source_time": "2026-09-26T17:27:11.234697+00:00",
        "source_time_status": "RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.95,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-26T17:27:11.234697+00:00"
      },
      {
        "camera_id": "cam01",
        "track_id": "TRK-SIM-0004",
        "first_seen_pts_ms": 180000.0,
        "recognition_pts_ms": 185000.0,
        "last_seen_pts_ms": 195000.0,
        "source_time": "2026-09-26T17:34:13.437675+00:00",
        "source_time_status": "RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.965,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-26T17:34:13.437675+00:00"
      }
    ],
    "vehicle_details": {
      "make_model": "Royal Enfield Classic 350",
      "color": "Black",
      "class": "Two-Wheeler"
    },
    "total_distance_km": 7.81,
    "avg_speed_kmh": 38.3,
    "is_watchlist_match": false
  },
  {
    "vehicle_id": "VEH-GJ06CD7548",
    "registration_number": "GJ06CD7548",
    "normalized_registration_number": "GJ06CD7548",
    "first_seen": {
      "camera_id": "cam04",
      "pts_ms": 0.0,
      "source_time": "2026-09-26T15:21:59.213547+00:00",
      "source_time_status": "RESOLVED"
    },
    "last_seen": {
      "camera_id": "cam16",
      "pts_ms": 300000.0,
      "source_time": "2026-09-26T15:40:06.668980+00:00",
      "source_time_status": "RESOLVED"
    },
    "camera_count": 6,
    "cameras": [
      "cam04",
      "cam02",
      "cam15",
      "cam01",
      "cam05",
      "cam16"
    ],
    "observation_count": 6,
    "track_count": 6,
    "best_consensus_score": 0.98,
    "average_consensus_score": 0.94,
    "status": "CONFIRMED",
    "timeline": [
      {
        "camera_id": "cam04",
        "track_id": "TRK-SIM-0001",
        "first_seen_pts_ms": 0.0,
        "recognition_pts_ms": 5000.0,
        "last_seen_pts_ms": 15000.0,
        "source_time": "2026-09-26T15:21:59.213547+00:00",
        "source_time_status": "RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.92,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-26T15:21:59.213547+00:00"
      },
      {
        "camera_id": "cam02",
        "track_id": "TRK-SIM-0002",
        "first_seen_pts_ms": 60000.0,
        "recognition_pts_ms": 65000.0,
        "last_seen_pts_ms": 75000.0,
        "source_time": "2026-09-26T15:24:29.213547+00:00",
        "source_time_status": "RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.935,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-26T15:24:29.213547+00:00"
      },
      {
        "camera_id": "cam15",
        "track_id": "TRK-SIM-0003",
        "first_seen_pts_ms": 120000.0,
        "recognition_pts_ms": 125000.0,
        "last_seen_pts_ms": 135000.0,
        "source_time": "2026-09-26T15:27:11.440657+00:00",
        "source_time_status": "RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.95,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-26T15:27:11.440657+00:00"
      },
      {
        "camera_id": "cam01",
        "track_id": "TRK-SIM-0004",
        "first_seen_pts_ms": 180000.0,
        "recognition_pts_ms": 185000.0,
        "last_seen_pts_ms": 195000.0,
        "source_time": "2026-09-26T15:32:28.570714+00:00",
        "source_time_status": "RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.965,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-26T15:32:28.570714+00:00"
      },
      {
        "camera_id": "cam05",
        "track_id": "TRK-SIM-0005",
        "first_seen_pts_ms": 240000.0,
        "recognition_pts_ms": 245000.0,
        "last_seen_pts_ms": 255000.0,
        "source_time": "2026-09-26T15:37:36.668980+00:00",
        "source_time_status": "RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.98,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-26T15:37:36.668980+00:00"
      },
      {
        "camera_id": "cam16",
        "track_id": "TRK-SIM-0006",
        "first_seen_pts_ms": 300000.0,
        "recognition_pts_ms": 305000.0,
        "last_seen_pts_ms": 315000.0,
        "source_time": "2026-09-26T15:40:06.668980+00:00",
        "source_time_status": "RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.92,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-26T15:40:06.668980+00:00"
      }
    ],
    "vehicle_details": {
      "make_model": "Honda City",
      "color": "Grey",
      "class": "Sedan"
    },
    "total_distance_km": 11.29,
    "avg_speed_kmh": 37.4,
    "is_watchlist_match": true
  },
  {
    "vehicle_id": "VEH-GJ27RS5888",
    "registration_number": "GJ27RS5888",
    "normalized_registration_number": "GJ27RS5888",
    "first_seen": {
      "camera_id": "cam14",
      "pts_ms": 0.0,
      "source_time": "2026-09-26T14:50:59.213547+00:00",
      "source_time_status": "RESOLVED"
    },
    "last_seen": {
      "camera_id": "cam01",
      "pts_ms": 120000.0,
      "source_time": "2026-09-26T14:58:51.088650+00:00",
      "source_time_status": "RESOLVED"
    },
    "camera_count": 3,
    "cameras": [
      "cam14",
      "cam15",
      "cam01"
    ],
    "observation_count": 3,
    "track_count": 3,
    "best_consensus_score": 0.98,
    "average_consensus_score": 0.94,
    "status": "CONFIRMED",
    "timeline": [
      {
        "camera_id": "cam14",
        "track_id": "TRK-SIM-0001",
        "first_seen_pts_ms": 0.0,
        "recognition_pts_ms": 5000.0,
        "last_seen_pts_ms": 15000.0,
        "source_time": "2026-09-26T14:50:59.213547+00:00",
        "source_time_status": "RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.92,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-26T14:50:59.213547+00:00"
      },
      {
        "camera_id": "cam15",
        "track_id": "TRK-SIM-0002",
        "first_seen_pts_ms": 60000.0,
        "recognition_pts_ms": 65000.0,
        "last_seen_pts_ms": 75000.0,
        "source_time": "2026-09-26T14:54:12.043694+00:00",
        "source_time_status": "RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.935,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-26T14:54:12.043694+00:00"
      },
      {
        "camera_id": "cam01",
        "track_id": "TRK-SIM-0003",
        "first_seen_pts_ms": 120000.0,
        "recognition_pts_ms": 125000.0,
        "last_seen_pts_ms": 135000.0,
        "source_time": "2026-09-26T14:58:51.088650+00:00",
        "source_time_status": "RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.95,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-26T14:58:51.088650+00:00"
      }
    ],
    "vehicle_details": {
      "make_model": "Honda City",
      "color": "Grey",
      "class": "Sedan"
    },
    "total_distance_km": 6.19,
    "avg_speed_kmh": 47.2,
    "is_watchlist_match": false
  },
  {
    "vehicle_id": "VEH-GJ01EF2849",
    "registration_number": "GJ01EF2849",
    "normalized_registration_number": "GJ01EF2849",
    "first_seen": {
      "camera_id": "cam12",
      "pts_ms": 0.0,
      "source_time": "2026-09-26T15:05:59.213547+00:00",
      "source_time_status": "RESOLVED"
    },
    "last_seen": {
      "camera_id": "cam04",
      "pts_ms": 300000.0,
      "source_time": "2026-09-26T15:31:53.088353+00:00",
      "source_time_status": "RESOLVED"
    },
    "camera_count": 6,
    "cameras": [
      "cam12",
      "cam05",
      "cam01",
      "cam15",
      "cam02",
      "cam04"
    ],
    "observation_count": 6,
    "track_count": 6,
    "best_consensus_score": 0.98,
    "average_consensus_score": 0.94,
    "status": "CONFIRMED",
    "timeline": [
      {
        "camera_id": "cam12",
        "track_id": "TRK-SIM-0001",
        "first_seen_pts_ms": 0.0,
        "recognition_pts_ms": 5000.0,
        "last_seen_pts_ms": 15000.0,
        "source_time": "2026-09-26T15:05:59.213547+00:00",
        "source_time_status": "RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.92,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-26T15:05:59.213547+00:00"
      },
      {
        "camera_id": "cam05",
        "track_id": "TRK-SIM-0002",
        "first_seen_pts_ms": 60000.0,
        "recognition_pts_ms": 65000.0,
        "last_seen_pts_ms": 75000.0,
        "source_time": "2026-09-26T15:17:01.924877+00:00",
        "source_time_status": "RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.935,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-26T15:17:01.924877+00:00"
      },
      {
        "camera_id": "cam01",
        "track_id": "TRK-SIM-0003",
        "first_seen_pts_ms": 120000.0,
        "recognition_pts_ms": 125000.0,
        "last_seen_pts_ms": 135000.0,
        "source_time": "2026-09-26T15:21:51.064499+00:00",
        "source_time_status": "RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.95,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-26T15:21:51.064499+00:00"
      },
      {
        "camera_id": "cam15",
        "track_id": "TRK-SIM-0004",
        "first_seen_pts_ms": 180000.0,
        "recognition_pts_ms": 185000.0,
        "last_seen_pts_ms": 195000.0,
        "source_time": "2026-09-26T15:26:22.832625+00:00",
        "source_time_status": "RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.965,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-26T15:26:22.832625+00:00"
      },
      {
        "camera_id": "cam02",
        "track_id": "TRK-SIM-0005",
        "first_seen_pts_ms": 240000.0,
        "recognition_pts_ms": 245000.0,
        "last_seen_pts_ms": 255000.0,
        "source_time": "2026-09-26T15:28:52.832625+00:00",
        "source_time_status": "RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.98,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-26T15:28:52.832625+00:00"
      },
      {
        "camera_id": "cam04",
        "track_id": "TRK-SIM-0006",
        "first_seen_pts_ms": 300000.0,
        "recognition_pts_ms": 305000.0,
        "last_seen_pts_ms": 315000.0,
        "source_time": "2026-09-26T15:31:53.088353+00:00",
        "source_time_status": "RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.92,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-26T15:31:53.088353+00:00"
      }
    ],
    "vehicle_details": {
      "make_model": "Tata Nexon",
      "color": "Blue",
      "class": "Compact SUV"
    },
    "total_distance_km": 19.05,
    "avg_speed_kmh": 44.1,
    "is_watchlist_match": false
  },
  {
    "vehicle_id": "VEH-GJ18RS5303",
    "registration_number": "GJ18RS5303",
    "normalized_registration_number": "GJ18RS5303",
    "first_seen": {
      "camera_id": "cam20",
      "pts_ms": 0.0,
      "source_time": "2026-09-26T17:26:59.213547+00:00",
      "source_time_status": "RESOLVED"
    },
    "last_seen": {
      "camera_id": "cam15",
      "pts_ms": 120000.0,
      "source_time": "2026-09-26T17:32:42.338973+00:00",
      "source_time_status": "RESOLVED"
    },
    "camera_count": 3,
    "cameras": [
      "cam20",
      "cam02",
      "cam15"
    ],
    "observation_count": 3,
    "track_count": 3,
    "best_consensus_score": 0.98,
    "average_consensus_score": 0.94,
    "status": "CONFIRMED",
    "timeline": [
      {
        "camera_id": "cam20",
        "track_id": "TRK-SIM-0001",
        "first_seen_pts_ms": 0.0,
        "recognition_pts_ms": 5000.0,
        "last_seen_pts_ms": 15000.0,
        "source_time": "2026-09-26T17:26:59.213547+00:00",
        "source_time_status": "RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.92,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-26T17:26:59.213547+00:00"
      },
      {
        "camera_id": "cam02",
        "track_id": "TRK-SIM-0002",
        "first_seen_pts_ms": 60000.0,
        "recognition_pts_ms": 65000.0,
        "last_seen_pts_ms": 75000.0,
        "source_time": "2026-09-26T17:30:12.338973+00:00",
        "source_time_status": "RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.935,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-26T17:30:12.338973+00:00"
      },
      {
        "camera_id": "cam15",
        "track_id": "TRK-SIM-0003",
        "first_seen_pts_ms": 120000.0,
        "recognition_pts_ms": 125000.0,
        "last_seen_pts_ms": 135000.0,
        "source_time": "2026-09-26T17:32:42.338973+00:00",
        "source_time_status": "RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.95,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-26T17:32:42.338973+00:00"
      }
    ],
    "vehicle_details": {
      "make_model": "Mahindra Scorpio-N",
      "color": "Black",
      "class": "SUV"
    },
    "total_distance_km": 5.2,
    "avg_speed_kmh": 54.6,
    "is_watchlist_match": false
  },
  {
    "vehicle_id": "VEH-GJ03CD6427",
    "registration_number": "GJ03CD6427",
    "normalized_registration_number": "GJ03CD6427",
    "first_seen": {
      "camera_id": "cam16",
      "pts_ms": 0.0,
      "source_time": "2026-09-26T16:47:59.213547+00:00",
      "source_time_status": "RESOLVED"
    },
    "last_seen": {
      "camera_id": "cam02",
      "pts_ms": 240000.0,
      "source_time": "2026-09-26T17:01:36.505602+00:00",
      "source_time_status": "RESOLVED"
    },
    "camera_count": 5,
    "cameras": [
      "cam16",
      "cam05",
      "cam01",
      "cam15",
      "cam02"
    ],
    "observation_count": 5,
    "track_count": 5,
    "best_consensus_score": 0.98,
    "average_consensus_score": 0.94,
    "status": "CONFIRMED",
    "timeline": [
      {
        "camera_id": "cam16",
        "track_id": "TRK-SIM-0001",
        "first_seen_pts_ms": 0.0,
        "recognition_pts_ms": 5000.0,
        "last_seen_pts_ms": 15000.0,
        "source_time": "2026-09-26T16:47:59.213547+00:00",
        "source_time_status": "RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.92,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-26T16:47:59.213547+00:00"
      },
      {
        "camera_id": "cam05",
        "track_id": "TRK-SIM-0002",
        "first_seen_pts_ms": 60000.0,
        "recognition_pts_ms": 65000.0,
        "last_seen_pts_ms": 75000.0,
        "source_time": "2026-09-26T16:50:29.213547+00:00",
        "source_time_status": "RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.935,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-26T16:50:29.213547+00:00"
      },
      {
        "camera_id": "cam01",
        "track_id": "TRK-SIM-0003",
        "first_seen_pts_ms": 120000.0,
        "recognition_pts_ms": 125000.0,
        "last_seen_pts_ms": 135000.0,
        "source_time": "2026-09-26T16:54:27.036506+00:00",
        "source_time_status": "RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.95,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-26T16:54:27.036506+00:00"
      },
      {
        "camera_id": "cam15",
        "track_id": "TRK-SIM-0004",
        "first_seen_pts_ms": 180000.0,
        "recognition_pts_ms": 185000.0,
        "last_seen_pts_ms": 195000.0,
        "source_time": "2026-09-26T16:59:06.505602+00:00",
        "source_time_status": "RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.965,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-26T16:59:06.505602+00:00"
      },
      {
        "camera_id": "cam02",
        "track_id": "TRK-SIM-0005",
        "first_seen_pts_ms": 240000.0,
        "recognition_pts_ms": 245000.0,
        "last_seen_pts_ms": 255000.0,
        "source_time": "2026-09-26T17:01:36.505602+00:00",
        "source_time_status": "RESOLVED",
        "status": "CONFIRMED",
        "consensus_score": 0.98,
        "evidence_image": null,
        "evidence_filename_pts_status": "MATCH",
        "ingested_at_utc": "2026-09-26T17:01:36.505602+00:00"
      }
    ],
    "vehicle_details": {
      "make_model": "Royal Enfield Classic 350",
      "color": "Black",
      "class": "Two-Wheeler"
    },
    "total_distance_km": 9.61,
    "avg_speed_kmh": 42.3,
    "is_watchlist_match": false
  }
]) as unknown as ObservedVehicle[]
