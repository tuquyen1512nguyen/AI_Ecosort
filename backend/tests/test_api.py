"""Unit tests for FastAPI endpoint handlers and input validation."""

import asyncio
import unittest
from pathlib import Path
import sys

# Ensure backend root is on Python path
BACKEND_DIR = Path(__file__).resolve().parent.parent
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from fastapi import HTTPException, status
from main import app, health_check, root
from api.predict import predict


class TestApiEndpoints(unittest.TestCase):
    """Test suite for FastAPI core endpoints and route configurations."""

    def test_routes_registered(self):
        """Verify that all essential routes are registered on the FastAPI app."""
        route_paths = [route.path for route in app.routes]
        self.assertIn("/api/health", route_paths)
        self.assertIn("/api/predict", route_paths)
        self.assertIn("/", route_paths)

    def test_health_check_endpoint(self):
        """Verify health_check coroutine returns expected metadata."""
        response = asyncio.run(health_check())
        self.assertIsInstance(response, dict)
        self.assertEqual(response.get("status"), "healthy")
        self.assertEqual(response.get("service"), "EcoSort AI Backend")
        self.assertIn("version", response)

    def test_root_endpoint(self):
        """Verify root coroutine returns service info and docs link."""
        response = asyncio.run(root())
        self.assertIsInstance(response, dict)
        self.assertIn("EcoSort AI Backend API is running", response.get("message", ""))
        self.assertEqual(response.get("docs"), "/docs")

    def test_predict_endpoint_missing_file_validation(self):
        """Verify predict raises HTTP 400 when called with no file."""
        with self.assertRaises(HTTPException) as ctx:
            asyncio.run(predict(file=None))
        self.assertEqual(ctx.exception.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("hình ảnh hợp lệ", ctx.exception.detail)


if __name__ == "__main__":
    unittest.main()
