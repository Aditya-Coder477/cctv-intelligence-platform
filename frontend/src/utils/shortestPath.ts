import { Camera } from "../types"

export interface ShortestPathResult {
  origin: string
  destination: string
  shortest_path: string[]
  total_distance_km: number
  estimated_transit_minutes: number
  checkpoints: Array<{
    camera_id: string
    name: string
    latitude: number
    longitude: number
  }>
  redundant_paths_pruned: boolean
}

// Great circle distance in kilometers
export function haversineDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const r = 6371.0
  const dLat = ((lat2 - lat1) * Math.PI) / 180.0
  const dLon = ((lon2 - lon1) * Math.PI) / 180.0
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180.0) *
      Math.cos((lat2 * Math.PI) / 180.0) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return r * c
}

// Road network adjacency list connecting all 30 Gujarat CCTV cameras
const ROAD_EDGES: [string, string][] = [
  // 1. Ahmedabad Urban Grid
  ["cam05", "cam16"],
  ["cam03", "cam05"],
  ["cam03", "cam16"],
  ["cam01", "cam03"],
  ["cam01", "cam05"],
  ["cam01", "cam15"],
  ["cam01", "cam20"],
  ["cam15", "cam02"],
  ["cam15", "cam14"],
  ["cam14", "cam13"],
  ["cam13", "cam02"],
  ["cam13", "cam04"],
  ["cam02", "cam04"],
  ["cam02", "cam20"],
  ["cam04", "cam20"],

  // 2. Gandhinagar & North Gujarat Corridor
  ["cam05", "cam12"],
  ["cam16", "cam12"],
  ["cam12", "cam24"],
  ["cam24", "cam23"],
  ["cam23", "cam21"],
  ["cam21", "cam22"],

  // 3. Ahmedabad to Saurashtra Highway
  ["cam04", "cam17"],
  ["cam02", "cam17"],
  ["cam17", "cam18"],

  // 4. Rajkot to Kutch Highway
  ["cam17", "cam30"],
  ["cam18", "cam30"],

  // 5. Rajkot to Junagadh & Somnath Highway
  ["cam17", "cam11"],
  ["cam18", "cam11"],
  ["cam11", "cam08"],
  ["cam08", "cam10"],
  ["cam10", "cam06"],
  ["cam06", "cam09"],
  ["cam10", "cam09"],
  ["cam09", "cam07"],
  ["cam06", "cam07"],

  // 6. Ahmedabad to South Gujarat Highway (Navsari / Bilimora)
  ["cam04", "cam19"],
  ["cam20", "cam19"],
  ["cam19", "cam25"],
  ["cam19", "cam29"],
  ["cam25", "cam26"],
  ["cam26", "cam29"],
  ["cam29", "cam28"],
  ["cam28", "cam27"],
  ["cam27", "cam19"],
]

/**
 * Computes Dijkstra shortest path between two cameras from cameras 1-30.
 * Guarantees strictly ONE shortest path, suppressing all redundant routes.
 */
export function computeShortestPath(
  originId: string,
  destinationId: string,
  cameras: Camera[]
): ShortestPathResult | null {
  const camMap = new Map<string, Camera>()
  cameras.forEach((c) => {
    if (c.latitude != null && c.longitude != null) {
      camMap.set(c.camera_id.toLowerCase(), c)
    }
  })

  const origKey = originId.toLowerCase()
  const destKey = destinationId.toLowerCase()

  const originCam = camMap.get(origKey)
  const destCam = camMap.get(destKey)
  if (!originCam || !destCam) return null

  if (origKey === destKey) {
    return {
      origin: originCam.camera_id,
      destination: destCam.camera_id,
      shortest_path: [originCam.camera_id],
      total_distance_km: 0,
      estimated_transit_minutes: 0,
      checkpoints: [
        {
          camera_id: originCam.camera_id,
          name: originCam.name,
          latitude: originCam.latitude!,
          longitude: originCam.longitude!,
        },
      ],
      redundant_paths_pruned: true,
    }
  }

  // Build weighted adjacency map
  const adj = new Map<string, Array<{ to: string; weight: number }>>()
  camMap.forEach((_, cid) => adj.set(cid, []))

  ROAD_EDGES.forEach(([u, v]) => {
    const cu = camMap.get(u.toLowerCase())
    const cv = camMap.get(v.toLowerCase())
    if (cu && cv && cu.latitude != null && cv.latitude != null) {
      const d = haversineDistanceKm(cu.latitude, cu.longitude!, cv.latitude, cv.longitude!)
      adj.get(u.toLowerCase())?.push({ to: v.toLowerCase(), weight: d })
      adj.get(v.toLowerCase())?.push({ to: u.toLowerCase(), weight: d })
    }
  })

  // Priority Queue / Dijkstra algorithm
  const distances = new Map<string, number>()
  const previous = new Map<string, string>()
  const unvisited = new Set<string>()

  camMap.forEach((_, cid) => {
    distances.set(cid, Infinity)
    unvisited.add(cid)
  })
  distances.set(origKey, 0)

  while (unvisited.size > 0) {
    // Find unvisited node with smallest distance
    let current: string | null = null
    let smallestDist = Infinity

    unvisited.forEach((node) => {
      const dist = distances.get(node) ?? Infinity
      if (dist < smallestDist) {
        smallestDist = dist
        current = node
      }
    })

    if (!current || smallestDist === Infinity) break
    if (current === destKey) break

    unvisited.delete(current)

    const neighbors = adj.get(current) || []
    for (const neighbor of neighbors) {
      if (!unvisited.has(neighbor.to)) continue
      const alt = smallestDist + neighbor.weight
      if (alt < (distances.get(neighbor.to) ?? Infinity)) {
        distances.set(neighbor.to, alt)
        previous.set(neighbor.to, current)
      }
    }
  }

  // Reconstruct path
  const path: string[] = []
  let curr: string | undefined = destKey
  while (curr) {
    path.unshift(curr)
    curr = previous.get(curr)
  }

  if (path.length === 0 || path[0] !== origKey) {
    // Fallback: direct line if disconnected
    const directDist = haversineDistanceKm(
      originCam.latitude!,
      originCam.longitude!,
      destCam.latitude!,
      destCam.longitude!
    )
    return {
      origin: originCam.camera_id,
      destination: destCam.camera_id,
      shortest_path: [originCam.camera_id, destCam.camera_id],
      total_distance_km: Math.round(directDist * 100) / 100,
      estimated_transit_minutes: Math.round((directDist / 45.0) * 60.0),
      checkpoints: [
        {
          camera_id: originCam.camera_id,
          name: originCam.name,
          latitude: originCam.latitude!,
          longitude: originCam.longitude!,
        },
        {
          camera_id: destCam.camera_id,
          name: destCam.name,
          latitude: destCam.latitude!,
          longitude: destCam.longitude!,
        },
      ],
      redundant_paths_pruned: true,
    }
  }

  const checkpoints = path.map((cid) => {
    const cam = camMap.get(cid)!
    return {
      camera_id: cam.camera_id,
      name: cam.name,
      latitude: cam.latitude!,
      longitude: cam.longitude!,
    }
  })

  const totalDist = distances.get(destKey) ?? 0
  const transitMins = Math.round((totalDist / 45.0) * 60.0)

  return {
    origin: originCam.camera_id,
    destination: destCam.camera_id,
    shortest_path: checkpoints.map((c) => c.camera_id),
    total_distance_km: Math.round(totalDist * 100) / 100,
    estimated_transit_minutes: Math.max(2, transitMins),
    checkpoints,
    redundant_paths_pruned: true,
  }
}
