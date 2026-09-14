# Step 5 Architecture -- Best-Frame Selection & License Plate Region Detection

## Overview

Step 5 processes vehicle tracks and candidate vehicle frames produced in Step 4 to answer one specific question:

> **"Where is the license plate region within the best frames of each tracked vehicle?"**

It performs candidate ranking, plate region localization, plate bounding box validation, crop extraction, image preprocessing, and multi-frame deduplication.

---

## Technical Pipeline

```
Step 4 Output (tracks.json + full-frame JPEGs) / Live RTSP Stream
                              |
                              v
                Vehicle Frame Quality Scoring
          (sharpness, contrast, area, brightness, truncation)
                              |
                              v
                  Top-N Vehicle Frames Selection
                              |
                              v
                 Vehicle ROI Crop Extraction
                              |
                              v
                   License Plate Region Detector
         (YOLO LP -> Haar Cascade -> Morphological Edge Contour)
                              |
                              v
               Full-Frame Coordinate Conversion
                              |
                              v
              Plate Bounding Box Validation
         (bounds, min area, dimensions, confidence)
                              |
                              v
                Plate-Level Quality Scoring
              (sharpness, brightness, contrast)
                              |
                              v
         Crop Extraction with Margin & Preprocessing
      (original, grayscale, upscaled, contrast, sharpened, denoised)
                              |
                              v
             Multi-Frame Candidate Deduplication
           (IoU spatial overlap + temporal proximity)
                              |
                              v
             Step 5 Outputs (JSONL, JSON, JPEGs)
```

---

## 1. Why Best-Frame Selection is Necessary

Real-world CCTV video (RTSP/H.264 feeds over public networks) suffers from:
- Motion blur on fast-moving vehicles
- Compression artifacts & packet drops
- Variable distance and perspective angle
- Severe lighting changes (headlight glare, night shadows)

Running plate detection on every single frame is computationally wasteful and produces noisy detections. By filtering to top-N quality-scored vehicle frames per track, processing time is reduced by ~80% while retaining optimal plate visibility.

---

## 2. Vehicle Frame Quality Scoring

Each vehicle frame is evaluated using five normalized metrics:

$$\text{Quality Score} = w_s \cdot S + w_a \cdot A + w_b \cdot B + w_c \cdot C + w_t \cdot T$$

| Metric | Symbol | Description |
|---|---|---|
| Sharpness | $S$ | Laplacian variance normalized to $[0, 1]$ |
| Bounding Box Area | $A$ | Pixel area normalized to 150k px |
| Brightness | $B$ | Proximity to ideal luminance (128) |
| Contrast | $C$ | RMS contrast normalized to $[0, 1]$ |
| Truncation | $T$ | Fraction of bbox inside image boundaries |

---

## 3. Plate Detector Modular Engine Architecture

The plate detector facade (`PlateDetector`) automatically selects the best available engine:

1. **`yolo_lp_v1`**: Loaded if `license_plate_detector.pt` is present in the workspace root.
2. **`haar_v1`**: OpenCV Haar cascade (`haarcascade_russian_plate_number.xml`) if available.
3. **`contour_v1`**: Guaranteed fallback using vertical Sobel edge density and morphological blackhat closing. Requires zero model weights or external dependencies.

All engines accept a vehicle ROI crop and return bounding boxes mapped back to full-frame pixel coordinates (`offset_x`, `offset_y`).

---

## 4. Plate Bounding Box Validation

Every proposed plate region is validated against physical constraints (`validate_plate_bbox`):
- `x1 >= 0`, `y1 >= 0`, `x2 <= frame_w`, `y2 <= frame_h`
- `width > 0`, `height > 0`
- `area >= min_area` (default: 150 px)
- `confidence >= min_confidence` (default: 0.35)
- `0.5 <= aspect_ratio <= 10.0`

Invalid candidates are logged with an explicit rejection reason (e.g. `too_small_area_120px`, `low_confidence_0.28`).

---

## 5. Plate Quality Scoring

A separate quality score is calculated for each plate crop (`score_plate`):
- `sharpness_score`: Laplacian variance on plate crop
- `brightness_score`: Mean luminance proximity to ideal
- `contrast_score`: RMS contrast

This score ranks candidates for Step 6 input selection. It does **not** represent text readability or OCR accuracy.

---

## 6. Preprocessing Variants

Each accepted plate crop is preserved untouched (`original`) and processed into variants:
- **`grayscale`**: 8-bit single-channel conversion
- **`upscaled`**: 2x bicubic interpolation for low-res crops
- **`contrast`**: CLAHE adaptive histogram equalization
- **`sharpened`**: Unsharp mask filtering
- **`denoised`**: Fast Non-Local Means Denoising

All variants are saved in structured directories under `data/snapshots/<camera_id>/plates_processed/<variant_name>/`.

---

## 7. Multi-Frame Candidate Management & Deduplication

A single vehicle track produces multiple plate candidates. `CandidateManager` performs spatial-temporal deduplication:
- Candidates within 10 frames of each other with bounding box IoU overlap $\ge 0.50$ are grouped.
- Only the candidate with highest combined score ($0.5 \cdot \text{Quality} + 0.5 \cdot \text{Confidence}$) is retained.
- Deduplicated top-N candidates (default: 5) are saved to `plate_candidates.jsonl` and `plate_summary.json`.

---

## 8. Architectural Scope Boundary (Critical)

> [!IMPORTANT]
> Step 5 ends at **"Where is the license plate region?"**
>
> It strictly does **NOT** contain text recognition, OCR, ANPR, or registration number extraction.
> No `registration_number` field exists in any Step 5 schema or JSON output.
> Text extraction belongs entirely to Step 6.
