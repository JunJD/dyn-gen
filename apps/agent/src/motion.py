from __future__ import annotations

import uuid
from collections.abc import Mapping
from typing import Any, Literal, TypedDict, cast

from langchain.agents import AgentState as BaseAgentState
from langchain.messages import ToolMessage
from langchain.tools import ToolRuntime, tool
from langgraph.types import Command
from pydantic import BaseModel, Field

ShotStatus = Literal["draft", "generating", "ready", "failed"]
ImageJobStatus = Literal["idle", "queued", "running", "ready", "failed"]
PreviewStatus = Literal["idle", "staged", "ready"]

VALID_SHOT_STATUSES: set[str] = {"draft", "generating", "ready", "failed"}
VALID_IMAGE_JOB_STATUSES: set[str] = {"idle", "queued", "running", "ready", "failed"}
VALID_PREVIEW_STATUSES: set[str] = {"idle", "staged", "ready"}


class ImageJob(TypedDict):
    id: str
    status: ImageJobStatus
    provider: str | None
    model: str | None
    prompt: str
    seed: int | None
    outputUrl: str | None
    error: str | None
    metadata: dict[str, Any]


class Shot(TypedDict):
    id: str
    number: int
    title: str
    sceneGoal: str
    narration: str
    imagePrompt: str
    visualStyle: str
    durationSeconds: int
    status: ShotStatus
    imageJob: ImageJob


class Project(TypedDict):
    id: str
    title: str
    concept: str
    audience: str
    deliverable: str
    creativeDirection: str


class Script(TypedDict):
    id: str
    title: str
    narrationTone: str
    aspectRatio: str
    revisionNotes: str
    totalDurationSeconds: int
    shots: list[Shot]


class PreviewScene(TypedDict):
    id: str
    shotId: str
    component: str
    label: str
    durationSeconds: int
    assetUrl: str | None


class Preview(TypedDict):
    status: PreviewStatus
    compositionId: str
    totalDurationSeconds: int
    scenes: list[PreviewScene]
    lastRenderAt: str | None


class AgentState(BaseAgentState):
    project: Project
    script: Script
    preview: Preview


class ImageJobInput(BaseModel):
    id: str | None = None
    status: ImageJobStatus | str = "idle"
    provider: str | None = None
    model: str | None = None
    prompt: str = ""
    seed: int | None = None
    outputUrl: str | None = None
    error: str | None = None
    metadata: dict[str, Any] = Field(default_factory=dict)


class ShotInput(BaseModel):
    id: str | None = None
    number: int | None = None
    title: str = ""
    sceneGoal: str = ""
    narration: str = ""
    imagePrompt: str = ""
    visualStyle: str = ""
    durationSeconds: int = 4
    status: ShotStatus | str = "draft"
    imageJob: ImageJobInput | None = None


class ProjectInput(BaseModel):
    id: str | None = None
    title: str = ""
    concept: str = ""
    audience: str = ""
    deliverable: str = ""
    creativeDirection: str = ""


class ScriptInput(BaseModel):
    id: str | None = None
    title: str = ""
    narrationTone: str = ""
    aspectRatio: str = "9:16"
    revisionNotes: str = ""
    shots: list[ShotInput] = Field(default_factory=list)


class PreviewInput(BaseModel):
    status: PreviewStatus | str | None = None
    compositionId: str | None = None
    lastRenderAt: str | None = None


def _new_id() -> str:
    return str(uuid.uuid4())


def _as_mapping(value: Any) -> Mapping[str, Any]:
    return value if isinstance(value, Mapping) else {}


def _as_string(value: Any, fallback: str = "") -> str:
    return value.strip() if isinstance(value, str) else fallback


def _as_positive_int(value: Any, fallback: int) -> int:
    if isinstance(value, bool):
        return fallback
    if isinstance(value, int):
        return value if value > 0 else fallback
    if isinstance(value, str):
        try:
            parsed = int(value)
        except ValueError:
            return fallback
        return parsed if parsed > 0 else fallback
    return fallback


def _as_status(value: Any, valid_statuses: set[str], fallback: str) -> str:
    if isinstance(value, str) and value in valid_statuses:
        return value
    return fallback


def _default_project() -> Project:
    return {
        "id": _new_id(),
        "title": "",
        "concept": "",
        "audience": "",
        "deliverable": "",
        "creativeDirection": "",
    }


def _default_script() -> Script:
    return {
        "id": _new_id(),
        "title": "",
        "narrationTone": "",
        "aspectRatio": "9:16",
        "revisionNotes": "",
        "totalDurationSeconds": 0,
        "shots": [],
    }


def _default_preview() -> Preview:
    return {
        "status": "idle",
        "compositionId": "storyboard-preview-v1",
        "totalDurationSeconds": 0,
        "scenes": [],
        "lastRenderAt": None,
    }


def _normalize_image_job(raw: Any, *, shot: Mapping[str, Any], fallback: Mapping[str, Any] | None = None) -> ImageJob:
    source = fallback or {}
    candidate = _as_mapping(raw)
    prompt = _as_string(candidate.get("prompt")) or _as_string(shot.get("imagePrompt")) or _as_string(source.get("prompt"))
    seed = candidate.get("seed", source.get("seed"))
    normalized_seed = seed if isinstance(seed, int) and not isinstance(seed, bool) else None
    metadata = candidate.get("metadata", source.get("metadata", {}))

    return {
        "id": _as_string(candidate.get("id")) or _as_string(source.get("id")) or _new_id(),
        "status": cast(
            ImageJobStatus,
            _as_status(candidate.get("status", source.get("status")), VALID_IMAGE_JOB_STATUSES, "idle"),
        ),
        "provider": _as_string(candidate.get("provider")) or _as_string(source.get("provider")) or None,
        "model": _as_string(candidate.get("model")) or _as_string(source.get("model")) or None,
        "prompt": prompt,
        "seed": normalized_seed,
        "outputUrl": _as_string(candidate.get("outputUrl")) or _as_string(source.get("outputUrl")) or None,
        "error": _as_string(candidate.get("error")) or _as_string(source.get("error")) or None,
        "metadata": metadata if isinstance(metadata, dict) else {},
    }


def _normalize_shots(raw_shots: Any, fallback_shots: list[Shot] | None = None) -> list[Shot]:
    fallback_by_id = {shot["id"]: shot for shot in (fallback_shots or [])}
    fallback_by_number = {shot["number"]: shot for shot in (fallback_shots or [])}
    normalized: list[Shot] = []

    if not isinstance(raw_shots, list):
        raw_shots = []

    for index, raw_shot in enumerate(raw_shots, start=1):
        candidate = _as_mapping(raw_shot)
        existing_shot = fallback_by_id.get(_as_string(candidate.get("id"))) or fallback_by_number.get(index)
        image_job = _normalize_image_job(
            candidate.get("imageJob"),
            shot=candidate,
            fallback=existing_shot.get("imageJob") if existing_shot else None,
        )
        normalized.append(
            {
                "id": _as_string(candidate.get("id")) or (existing_shot["id"] if existing_shot else _new_id()),
                "number": index,
                "title": _as_string(candidate.get("title"), existing_shot["title"] if existing_shot else ""),
                "sceneGoal": _as_string(
                    candidate.get("sceneGoal"),
                    existing_shot["sceneGoal"] if existing_shot else "",
                ),
                "narration": _as_string(
                    candidate.get("narration"),
                    existing_shot["narration"] if existing_shot else "",
                ),
                "imagePrompt": _as_string(
                    candidate.get("imagePrompt"),
                    existing_shot["imagePrompt"] if existing_shot else "",
                ),
                "visualStyle": _as_string(
                    candidate.get("visualStyle"),
                    existing_shot["visualStyle"] if existing_shot else "",
                ),
                "durationSeconds": _as_positive_int(
                    candidate.get("durationSeconds"),
                    existing_shot["durationSeconds"] if existing_shot else 4,
                ),
                "status": cast(
                    ShotStatus,
                    _as_status(candidate.get("status", existing_shot["status"] if existing_shot else None), VALID_SHOT_STATUSES, "draft"),
                ),
                "imageJob": image_job,
            }
        )

    return normalized


def _normalize_project(raw_project: Any, fallback: Project | None = None) -> Project:
    existing = fallback or _default_project()
    candidate = _as_mapping(raw_project)
    return {
        "id": _as_string(candidate.get("id")) or existing["id"],
        "title": _as_string(candidate.get("title"), existing["title"]),
        "concept": _as_string(candidate.get("concept"), existing["concept"]),
        "audience": _as_string(candidate.get("audience"), existing["audience"]),
        "deliverable": _as_string(candidate.get("deliverable"), existing["deliverable"]),
        "creativeDirection": _as_string(
            candidate.get("creativeDirection"),
            existing["creativeDirection"],
        ),
    }


def _normalize_script(raw_script: Any, fallback: Script | None = None) -> Script:
    existing = fallback or _default_script()
    candidate = _as_mapping(raw_script)
    shots = _normalize_shots(candidate.get("shots", existing["shots"]), existing["shots"])
    total_duration = sum(shot["durationSeconds"] for shot in shots)

    return {
        "id": _as_string(candidate.get("id")) or existing["id"],
        "title": _as_string(candidate.get("title"), existing["title"]),
        "narrationTone": _as_string(
            candidate.get("narrationTone"),
            existing["narrationTone"],
        ),
        "aspectRatio": _as_string(candidate.get("aspectRatio"), existing["aspectRatio"]) or "9:16",
        "revisionNotes": _as_string(
            candidate.get("revisionNotes"),
            existing["revisionNotes"],
        ),
        "totalDurationSeconds": total_duration,
        "shots": shots,
    }


def _derive_preview_status(shots: list[Shot]) -> PreviewStatus:
    if not shots:
        return "idle"
    if any(shot["imageJob"]["outputUrl"] for shot in shots):
        return "ready"
    return "staged"


def _preview_component_for_shot(shot: Shot) -> str:
    return "ImageSlide" if shot["imageJob"]["outputUrl"] else "TitleCard"


def _normalize_preview(raw_preview: Any, *, fallback: Preview | None = None, script: Script) -> Preview:
    existing = fallback or _default_preview()
    candidate = _as_mapping(raw_preview)
    scenes: list[PreviewScene] = []
    existing_scenes = {scene["shotId"]: scene for scene in existing["scenes"]}

    for shot in script["shots"]:
        prior_scene = existing_scenes.get(shot["id"])
        scenes.append(
            {
                "id": prior_scene["id"] if prior_scene else _new_id(),
                "shotId": shot["id"],
                "component": _preview_component_for_shot(shot),
                "label": shot["title"] or f"Shot {shot['number']}",
                "durationSeconds": shot["durationSeconds"],
                "assetUrl": shot["imageJob"]["outputUrl"],
            }
        )

    return {
        "status": cast(
            PreviewStatus,
            _as_status(
                candidate.get("status"),
                VALID_PREVIEW_STATUSES,
                _derive_preview_status(script["shots"]),
            ),
        ),
        "compositionId": _as_string(candidate.get("compositionId"), existing["compositionId"])
        or "storyboard-preview-v1",
        "totalDurationSeconds": script["totalDurationSeconds"],
        "scenes": scenes,
        "lastRenderAt": _as_string(candidate.get("lastRenderAt")) or existing["lastRenderAt"],
    }


def normalize_motion_workspace(
    raw_state: Mapping[str, Any] | None = None,
    *,
    project_override: Mapping[str, Any] | BaseModel | None = None,
    script_override: Mapping[str, Any] | BaseModel | None = None,
    preview_override: Mapping[str, Any] | BaseModel | None = None,
) -> dict[str, Any]:
    state = raw_state or {}
    existing_project = _normalize_project(state.get("project"))
    existing_script = _normalize_script(state.get("script"))
    existing_preview = _normalize_preview(state.get("preview"), fallback=None, script=existing_script)

    project = _normalize_project(
        project_override.model_dump(exclude_none=True) if isinstance(project_override, BaseModel) else project_override,
        existing_project,
    )
    script = _normalize_script(
        script_override.model_dump(exclude_none=True) if isinstance(script_override, BaseModel) else script_override,
        existing_script,
    )
    preview = _normalize_preview(
        preview_override.model_dump(exclude_none=True) if isinstance(preview_override, BaseModel) else preview_override,
        fallback=existing_preview,
        script=script,
    )

    return {
        "project": project,
        "script": script,
        "preview": preview,
    }


@tool
def get_motion_workspace(runtime: ToolRuntime) -> dict[str, Any]:
    """
    Return the current project, script, and preview state for the motion workspace.
    Call this before revising an existing shot table.
    """

    return normalize_motion_workspace(runtime.state)


@tool
def save_motion_workspace(
    script: ScriptInput,
    runtime: ToolRuntime,
    project: ProjectInput | None = None,
    preview: PreviewInput | None = None,
) -> Command:
    """
    Save the shared motion workspace.
    Use this whenever you create or revise the shot table, project brief, or preview metadata.
    """

    workspace = normalize_motion_workspace(
        cast(Mapping[str, Any], runtime.state),
        project_override=project,
        script_override=script,
        preview_override=preview,
    )
    shot_count = len(workspace["script"]["shots"])
    total_duration = workspace["script"]["totalDurationSeconds"]

    return Command(
        update={
            **workspace,
            "messages": [
                ToolMessage(
                    content=f"Saved motion workspace with {shot_count} shots and {total_duration}s total duration.",
                    tool_call_id=runtime.tool_call_id,
                )
            ],
        }
    )


motion_tools = [
    get_motion_workspace,
    save_motion_workspace,
]
