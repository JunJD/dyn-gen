import unittest

from src.motion import ScriptInput, normalize_motion_workspace


class MotionWorkspaceNormalizationTest(unittest.TestCase):
    def test_defaults_create_empty_workspace(self) -> None:
        workspace = normalize_motion_workspace({})

        self.assertIn("project", workspace)
        self.assertIn("script", workspace)
        self.assertIn("preview", workspace)
        self.assertEqual(workspace["script"]["shots"], [])
        self.assertEqual(workspace["script"]["totalDurationSeconds"], 0)
        self.assertEqual(workspace["preview"]["status"], "idle")
        self.assertEqual(workspace["preview"]["scenes"], [])

    def test_script_override_renumbers_shots_and_derives_preview(self) -> None:
        workspace = normalize_motion_workspace(
            {},
            script_override=ScriptInput(
                title="Launch storyboard",
                shots=[
                    {
                        "number": 4,
                        "title": "Cold open",
                        "sceneGoal": "Introduce the product in motion.",
                        "narration": "A new workflow starts with one decisive action.",
                        "imagePrompt": "Product hero shot in a kinetic studio setup",
                        "visualStyle": "Warm cinematic macro",
                        "durationSeconds": 5,
                    },
                    {
                        "title": "Proof point",
                        "sceneGoal": "Show the interface solving a bottleneck.",
                        "narration": "The system resolves edits while the team stays aligned.",
                        "imagePrompt": "Dashboard close-up with layered timeline cards",
                        "visualStyle": "Editorial interface realism",
                        "durationSeconds": 7,
                        "status": "ready",
                        "imageJob": {
                            "status": "ready",
                            "outputUrl": "file:///tmp/shot-2.png",
                        },
                    },
                ],
            ),
        )

        first_shot, second_shot = workspace["script"]["shots"]

        self.assertEqual(first_shot["number"], 1)
        self.assertEqual(second_shot["number"], 2)
        self.assertEqual(first_shot["imageJob"]["prompt"], first_shot["imagePrompt"])
        self.assertEqual(workspace["script"]["totalDurationSeconds"], 12)
        self.assertEqual(workspace["preview"]["totalDurationSeconds"], 12)
        self.assertEqual(workspace["preview"]["status"], "ready")
        self.assertEqual(len(workspace["preview"]["scenes"]), 2)
        self.assertEqual(workspace["preview"]["scenes"][0]["component"], "TitleCard")
        self.assertEqual(workspace["preview"]["scenes"][1]["component"], "ImageSlide")
        self.assertEqual(workspace["preview"]["scenes"][1]["assetUrl"], "file:///tmp/shot-2.png")

    def test_existing_project_is_preserved_when_only_script_changes(self) -> None:
        raw_state = {
            "project": {
                "id": "project-1",
                "title": "Brand anthem",
                "concept": "A founder story told in layered stills.",
                "audience": "Creative founders",
                "deliverable": "30s storyboard",
                "creativeDirection": "Quiet luxury lighting",
            },
            "script": {
                "id": "script-1",
                "title": "Old script",
                "narrationTone": "Measured",
                "aspectRatio": "16:9",
                "revisionNotes": "",
                "totalDurationSeconds": 5,
                "shots": [
                    {
                        "id": "shot-1",
                        "number": 1,
                        "title": "Legacy shot",
                        "sceneGoal": "Legacy goal",
                        "narration": "Legacy narration",
                        "imagePrompt": "Legacy prompt",
                        "visualStyle": "Legacy style",
                        "durationSeconds": 5,
                        "status": "draft",
                        "imageJob": {
                            "id": "job-1",
                            "status": "idle",
                            "provider": None,
                            "model": None,
                            "prompt": "Legacy prompt",
                            "seed": None,
                            "outputUrl": None,
                            "error": None,
                            "metadata": {},
                        },
                    }
                ],
            },
            "preview": {
                "status": "staged",
                "compositionId": "custom-preview",
                "totalDurationSeconds": 5,
                "scenes": [],
                "lastRenderAt": None,
            },
        }

        workspace = normalize_motion_workspace(
            raw_state,
            script_override=ScriptInput(
                title="Revised script",
                shots=[
                    {
                        "title": "New opener",
                        "sceneGoal": "Reset the sequence.",
                        "narration": "The story starts cleaner.",
                        "imagePrompt": "Minimal opening frame",
                        "visualStyle": "Neutral studio",
                        "durationSeconds": 6,
                    }
                ],
            ),
        )

        self.assertEqual(workspace["project"]["title"], "Brand anthem")
        self.assertEqual(workspace["script"]["title"], "Revised script")
        self.assertEqual(workspace["script"]["shots"][0]["title"], "New opener")
        self.assertEqual(workspace["preview"]["compositionId"], "custom-preview")
        self.assertEqual(workspace["preview"]["status"], "staged")


if __name__ == "__main__":
    unittest.main()
