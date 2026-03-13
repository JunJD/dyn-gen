export const motionCatalogComponentNames = [
  "TitleCard",
  "ImageSlide",
  "LowerThird",
  "NarrationCard",
];

export const motionTimelineCatalogPrompt = `Use the motion storyboard catalog with four components:
- TitleCard: full-frame opener or fallback scene with title and subtitle.
- ImageSlide: full-frame still image using a generated asset URL.
- LowerThird: short overlay for shot label and style cue.
- NarrationCard: grounded narration overlay with label, narration, and visual style.

Build a timeline spec with:
- composition: id, fps, width, height, durationInFrames
- tracks: main-video and overlay
- clips: one main scene clip per shot, plus optional overlay clips
- audio.tracks: empty unless a shot already carries an audio asset reference

Keep clips ordered by shot number and size every shot from durationSeconds * fps.`;
