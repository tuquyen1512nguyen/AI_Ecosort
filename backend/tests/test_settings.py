"""Unit tests for backend settings and waste classification rules."""

import unittest
from pathlib import Path
import sys

# Ensure backend root is on Python path
BACKEND_DIR = Path(__file__).resolve().parent.parent
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

import settings


class TestSettingsClassification(unittest.TestCase):
    """Test suite verifying classification lists, sets, and model paths in settings.py."""

    def test_categories_non_empty(self):
        """Verify that all 3 waste categories contain valid classes."""
        self.assertGreater(len(settings.RECYCLABLE), 0)
        self.assertGreater(len(settings.NON_RECYCLABLE), 0)
        self.assertGreater(len(settings.HAZARDOUS), 0)

    def test_sets_synchronization(self):
        """Verify that precomputed lookup sets match the original lists."""
        self.assertEqual(settings.RECYCLABLE_SET, set(settings.RECYCLABLE))
        self.assertEqual(settings.NON_RECYCLABLE_SET, set(settings.NON_RECYCLABLE))
        self.assertEqual(settings.HAZARDOUS_SET, set(settings.HAZARDOUS))

    def test_no_category_overlap(self):
        """Verify that a waste class is not ambiguously placed in multiple categories."""
        rec_and_nonrec = settings.RECYCLABLE_SET.intersection(settings.NON_RECYCLABLE_SET)
        rec_and_hazard = settings.RECYCLABLE_SET.intersection(settings.HAZARDOUS_SET)
        nonrec_and_hazard = settings.NON_RECYCLABLE_SET.intersection(settings.HAZARDOUS_SET)

        self.assertEqual(rec_and_nonrec, set(), f"Overlap detected between Recyclable & Non-Recyclable: {rec_and_nonrec}")
        self.assertEqual(rec_and_hazard, set(), f"Overlap detected between Recyclable & Hazardous: {rec_and_hazard}")
        self.assertEqual(nonrec_and_hazard, set(), f"Overlap detected between Non-Recyclable & Hazardous: {nonrec_and_hazard}")

    def test_confidence_threshold_valid(self):
        """Verify confidence threshold is between 0.0 and 1.0."""
        self.assertGreaterEqual(settings.CONFIDENCE_THRESHOLD, 0.0)
        self.assertLessEqual(settings.CONFIDENCE_THRESHOLD, 1.0)
        self.assertEqual(settings.CONFIDENCE_THRESHOLD, 0.5)

    def test_model_weight_path(self):
        """Verify DETECTION_MODEL path points to a file with .pt extension."""
        model_path = Path(settings.DETECTION_MODEL)
        self.assertTrue(model_path.name.endswith(".pt"), "Model file should have a .pt extension")
        self.assertTrue(model_path.exists(), f"Weight file should exist at {model_path}")


if __name__ == "__main__":
    unittest.main()
