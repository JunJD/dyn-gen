import os
from collections.abc import Mapping
from typing import Any

from langchain_openai import ChatOpenAI

DEFAULT_MODEL = "gpt-5-mini"
OPENAI_API_HOST = "api.openai.com"
DEFAULT_REASONING = {"effort": "low", "summary": "concise"}


def _uses_compatible_provider(base_url: str | None) -> bool:
    return bool(base_url and OPENAI_API_HOST not in base_url)


def get_chat_model_kwargs(environ: Mapping[str, str] | None = None) -> dict[str, Any]:
    env = environ or os.environ
    model_name = env.get("OPENAI_MODEL", DEFAULT_MODEL)
    base_url = env.get("OPENAI_BASE_URL")
    uses_compatible_provider = _uses_compatible_provider(base_url)

    kwargs: dict[str, Any] = {"model": model_name}

    # Compatible-mode providers can answer normal requests but fail LangChain's
    # streamed path with empty chunks, so fall back to invoke-backed streaming.
    if uses_compatible_provider:
        kwargs["disable_streaming"] = True

    if model_name.startswith("gpt-5") and not uses_compatible_provider:
        kwargs["reasoning"] = DEFAULT_REASONING

    return kwargs


def build_chat_model(environ: Mapping[str, str] | None = None) -> ChatOpenAI:
    return ChatOpenAI(**get_chat_model_kwargs(environ))
