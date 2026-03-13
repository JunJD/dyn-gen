import unittest

from src.model import DEFAULT_REASONING, get_chat_model_kwargs


class ChatModelConfigTest(unittest.TestCase):
    def test_defaults_use_gpt5_with_reasoning(self) -> None:
        kwargs = get_chat_model_kwargs({})

        self.assertEqual(kwargs["model"], "gpt-5-mini")
        self.assertEqual(kwargs["reasoning"], DEFAULT_REASONING)
        self.assertNotIn("disable_streaming", kwargs)

    def test_compatible_provider_uses_env_model_and_disables_streaming(self) -> None:
        kwargs = get_chat_model_kwargs(
            {
                "OPENAI_BASE_URL": "https://dashscope.aliyuncs.com/compatible-mode/v1",
                "OPENAI_MODEL": "glm-4.6",
            }
        )

        self.assertEqual(kwargs, {"model": "glm-4.6", "disable_streaming": True})

    def test_official_openai_base_url_keeps_reasoning_enabled(self) -> None:
        kwargs = get_chat_model_kwargs(
            {
                "OPENAI_BASE_URL": "https://api.openai.com/v1",
                "OPENAI_MODEL": "gpt-5-mini",
            }
        )

        self.assertEqual(kwargs["model"], "gpt-5-mini")
        self.assertEqual(kwargs["reasoning"], DEFAULT_REASONING)
        self.assertNotIn("disable_streaming", kwargs)


if __name__ == "__main__":
    unittest.main()
