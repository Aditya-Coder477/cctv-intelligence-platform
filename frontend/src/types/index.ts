export interface Camera {
  camera_id: string
  name: string
  location?: string
  latitude?: number | null
  longitude?: number | null
  status: string
  codec: string
  width?: number
  height?: number
  fps?: number
  bitrate?: number
  rtsp_url?: string
  hls_url?: string
  webrtc_url?: string
  department: string
  is_spatial: boolean
  camera_type?: string
  ai_capabilities?: string[]
  alert_count?: number
  observation_count?: number
}

export interface CameraHealth {
  camera_id: string
  connected: boolean
  frames_received: number
  last_pts_ms?: number
  last_receive_time?: number
  reconnect_count: number
  decode_errors: number
  pts_discontinuities: number
  width?: number
  height?: number
  codec?: string
  status_label: string
}

export interface StreamDescriptor {
  camera_id: string
  protocol: string
  stream_url: string
  stream_type: string
  requires_proxy: boolean
}

export interface VehicleObservation {
  observation_id: string
  camera_id: string
  track_id: string
  registration_number: string
  normalized_registration_number: string
  recognition_status: string
  consensus_score: number
  ocr_confidence: number
  first_seen_pts_ms?: number
  recognition_pts_ms?: number
  last_seen_pts_ms?: number
  source_time?: string | null
  source_time_status: string
  evidence_image_path?: string
  evidence_url?: string
  ingested_at_utc: string
}

export interface ObservedVehicle {
  vehicle_id: string
  registration_number: string
  normalized_registration_number: string
  camera_count: number
  observation_count: number
  track_count: number
  best_consensus_score: number
  average_consensus_score: number
  status: string
  cameras: string[]
  first_seen?: {
    camera_id: string
    pts_ms?: number
    source_time?: string | null
    source_time_status: string
  }
  last_seen?: {
    camera_id: string
    pts_ms?: number
    source_time?: string | null
    source_time_status: string
  }
  timeline: Array<{
    camera_id: string
    track_id: string
    first_seen_pts_ms?: number
    recognition_pts_ms?: number
    last_seen_pts_ms?: number
    source_time?: string | null
    source_time_status: string
    status: string
    consensus_score: number
    evidence_image?: string
    evidence_url?: string
    evidence_filename_pts_status?: string
    ingested_at_utc: string
  }>
  ingested_at_utc?: string
  updated_at_utc?: string
  vehicle_details?: {
    make_model?: string
    color?: string
    class?: string
  }
  total_distance_km?: number
  avg_speed_kmh?: number
  is_watchlist_match?: boolean
}

export interface WatchlistEntry {
  watchlist_id: string
  registration_number: string
  normalized_registration_number: string
  category: string
  priority: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW"
  reason?: string
  status: string
  synthetic: boolean
  source: string
  created_at_utc?: string
}

export interface AlertAuditEntry {
  timestamp: string
  action: string
  operator: string
  notes?: string
}

export interface Alert {
  alert_id: string
  match_id: string
  observation_id: string
  registration_number: string
  normalized_registration_number: string
  watchlist_id: string
  category: string
  priority: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW"
  decision: string
  camera_id: string
  track_id: string
  status: "NEW" | "ACKNOWLEDGED" | "UNDER_REVIEW" | "ESCALATED" | "RESOLVED" | "DISMISSED"
  recognition_confidence: number
  consensus_score: number
  first_seen_pts_ms?: number
  recognition_pts_ms?: number
  source_time?: string | null
  source_time_status: string
  evidence_image?: string
  evidence_url?: string
  matched_at_utc: string
  acknowledged_by?: string
  acknowledged_at?: string
  operator_notes?: string
  audit_history: AlertAuditEntry[]
}

export interface JourneySegment {
  segment_id: string
  vehicle_id: string
  registration_number: string
  camera_id: string
  track_id: string
  first_seen_pts_ms?: number
  recognition_pts_ms?: number
  last_seen_pts_ms?: number
  source_time?: string | null
  source_time_status: string
  recognition_status: string
  consensus_score: number
  ocr_confidence: number
  camera_name?: string
  camera_latitude?: number | null
  camera_longitude?: number | null
  evidence_image?: string
  evidence_url?: string
  supporting_observation_count: number
}

export interface JourneyLeg {
  from_camera: string
  to_camera: string
  duration_seconds?: number
  distance_m?: number
  implied_speed_kmh?: number
  plausibility: string
}

export interface JourneyDossier {
  journey_id: string
  vehicle_id: string
  registration_number: string
  normalized_registration_number: string
  ordering_mode: string
  status: string
  segments: JourneySegment[]
  legs: JourneyLeg[]
  confidence_score: {
    overall_score: number
    recognition_quality: number
    temporal_resolution: number
    spatial_resolution: number
    plausibility_consistency: number
    notes: string[]
    explanations: string[]
  }
  total_distance_m?: number | null
  total_duration_seconds?: number | null
  time_resolution: string
  spatial_resolution: string
  limitations: string[]
}

export interface DashboardStats {
  total_cameras: number
  online_cameras: number
  degraded_cameras: number
  offline_cameras: number
  ai_active_cameras: number
  total_observed_vehicles: number
  total_sightings: number
  active_watchlist_targets: number
  active_alerts: number
  critical_alerts: number
  recent_anpr_observations: Array<{
    observation_id: string
    registration_number: string
    camera_id: string
    consensus_score: number
    ocr_confidence: number
    first_seen_pts_ms?: number
    evidence_url?: string
    ingested_at_utc: string
  }>
  recent_alerts: Alert[]
}

export interface AnalyticsData {
  camera_distribution: Array<{ camera_id: string; count: number }>
  quality_distribution: Array<{ range: string; count: number }>
}
