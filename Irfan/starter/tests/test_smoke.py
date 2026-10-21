import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))

from myproject import hello


class SmokeTest(unittest.TestCase):
    def test_hello(self):
        self.assertEqual(hello(), "hello")


if __name__ == "__main__":
    unittest.main()
