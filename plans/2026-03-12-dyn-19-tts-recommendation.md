# DYN-19 TTS Recommendation

## Decision

Use **OpenAI `gpt-4o-mini-tts`** for the first voice pass when the product is ready to synthesize narration.

## Why this is the right phase-1 choice

- The workspace already carries `OPENAI_API_KEY`, so the integration path is shorter than starting a separate Google Cloud auth flow.
- OpenAI exposes a stable speech endpoint (`/v1/audio/speech`) with fixed voices and straightforward file outputs, which fits the current shell-first vertical slice.
- The media layer is already being designed as provider-agnostic, so choosing OpenAI for the first adapter does not block a later Gemini or Google Cloud adapter.

## Why not the other options first

### Gemini native audio

- Gemini’s native text-to-speech path is attractive for future expressive control and multi-speaker generation.
- It is still the riskier phase-1 choice because the feature set is moving quickly and would make the first audio slice harder to stabilize alongside the new image pipeline.

### Google Cloud Text-to-Speech

- Google Cloud TTS is strong if we later need broad voice inventory, enterprise policy controls, or SSML-heavy workflows.
- It is not the right first adapter here because it needs separate Cloud project setup and credentials that are not currently in the repo environment.

## Required metadata for the eventual TTS adapter

When we add the real adapter, every audio job should persist:

- provider
- model
- voice
- input text hash
- requested audio format
- duration milliseconds
- output asset URL
- manifest id
- created at
- failure message, when relevant

## Sources

- OpenAI text-to-speech guide: https://platform.openai.com/docs/guides/text-to-speech
- Gemini native audio docs: https://ai.google.dev/gemini-api/docs/speech-generation
- Google Cloud Text-to-Speech overview: https://cloud.google.com/text-to-speech/docs/create-audio-text-client-libraries
