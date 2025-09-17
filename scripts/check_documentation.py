#!/usr/bin/env python3
"""
Check that Evo SDK documentation artifacts are up to date with api-definitions.json
Outputs a documentation-check-report.txt (similar to wasm-sdk checker) and exits non-zero on errors.
"""

from pathlib import Path
from datetime import datetime
import sys
import json

REPO_ROOT = Path(__file__).resolve().parent.parent
PUBLIC_DIR = REPO_ROOT / 'public'


def main():
    api_file = PUBLIC_DIR / 'api-definitions.json'

    docs_file = PUBLIC_DIR / 'docs.html'
    ai_file = PUBLIC_DIR / 'AI_REFERENCE.md'
    manifest_file = PUBLIC_DIR / 'docs_manifest.json'

    errors = []
    warnings = []

    if not api_file.exists():
        errors.append(f"ERROR: api-definitions.json not found at {api_file}")

    for f in (docs_file, ai_file, manifest_file):
        if not f.exists():
            errors.append(f"ERROR: Missing {f.name}. Run: python3 scripts/generate_docs.py")

    if not errors and manifest_file.exists():
        try:
            manifest = json.loads(manifest_file.read_text(encoding='utf-8'))
        except Exception as e:
            errors.append(f"ERROR: Invalid docs_manifest.json: {e}")
        else:
            if api_file.exists() and docs_file.exists() and api_file.stat().st_mtime > docs_file.stat().st_mtime:
                warnings.append('WARNING: api-definitions.json modified after docs.html was generated')
            if api_file.exists() and ai_file.exists() and api_file.stat().st_mtime > ai_file.stat().st_mtime:
                warnings.append('WARNING: api-definitions.json modified after AI_REFERENCE.md was generated')

    # Compose report
    lines = [
        '=' * 80,
        'Evo SDK Documentation Check',
        '=' * 80,
        f'Timestamp: {datetime.now().isoformat()}',
        ''
    ]
    if not errors and not warnings:
        lines.append('✅ All documentation is up to date!')
    else:
        if warnings:
            lines.append(f'⚠️  {len(warnings)} warnings found:\n')
            lines.extend(warnings)
            lines.append('')
        if errors:
            lines.append(f'❌ {len(errors)} errors found:\n')
            lines.extend(errors)
            lines.append('')
    lines.append('=' * 80)
    if errors:
        lines.append('\nTo fix these errors, run: python3 scripts/generate_docs.py')

    report = '\n'.join(lines)
    print(report)
    (PUBLIC_DIR / 'documentation-check-report.txt').write_text(report, encoding='utf-8')

    sys.exit(1 if errors else 0)

if __name__ == '__main__':
    main()
