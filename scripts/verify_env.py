"""
Environment verification script for EcoSort AI.
Validates Python runtime, required packages, and YOLOv8 model weights.
Usage:
    python scripts/verify_env.py
"""

import sys
from pathlib import Path


def check_python_version() -> bool:
    print(f"[*] Python Runtime: {sys.version.split()[0]}", end=" ")
    if sys.version_info >= (3, 9):
        print("[OK]")
        return True
    print("[FAIL] Python >= 3.9 is required.")
    return False


def check_packages() -> bool:
    required = ["torch", "ultralytics", "fastapi", "uvicorn", "PIL"]
    all_ok = True
    print("\n[*] Checking required Python dependencies:")
    for pkg in required:
        try:
            mod = __import__(pkg)
            version = getattr(mod, "__version__", "installed")
            print(f"  + {pkg:<15}: {version} [OK]")
        except ImportError:
            print(f"  - {pkg:<15}: NOT FOUND [MISSING]")
            all_ok = False
    return all_ok


def check_model_weights() -> bool:
    print("\n[*] Checking YOLOv8 model weights:")
    root = Path(__file__).resolve().parent.parent
    weights_path = root / "backend" / "weights" / "best.pt"

    if not weights_path.exists():
        print(f"  - Model weight not found at: {weights_path} [FAIL]")
        return False

    size_mb = weights_path.stat().st_size / (1024 * 1024)
    print(f"  + Found: {weights_path.name} ({size_mb:.2f} MB) [OK]")
    return True


def main():
    print("=" * 60)
    print("  EcoSort AI - Environment Diagnostic & Verification")
    print("=" * 60)

    py_ok = check_python_version()
    pkg_ok = check_packages()
    model_ok = check_model_weights()

    print("\n" + "=" * 60)
    if py_ok and pkg_ok and model_ok:
        print("  RESULT: All core checks passed! Environment is ready.")
        print("=" * 60)
        sys.exit(0)
    else:
        print("  RESULT: Some checks failed. Please review above output.")
        print("=" * 60)
        sys.exit(1)


if __name__ == "__main__":
    main()
