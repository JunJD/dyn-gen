from __future__ import annotations

import sys
from pathlib import Path


# Ensure test runs invoked via the pytest console script can import the local src package.
ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))
