#!/usr/bin/env python3
"""
Check that Evo SDK documentation artifacts are up to date with api-definitions.json
Outputs a documentation-check-report.txt (similar to wasm-sdk checker) and exits non-zero on errors.
"""

from pathlib import Path
from datetime import datetime
import sys
import json
import re
import subprocess

REPO_ROOT = Path(__file__).resolve().parent.parent
PUBLIC_DIR = REPO_ROOT / 'public'


def main():
    api_file = PUBLIC_DIR / 'api-definitions.json'

    docs_file = PUBLIC_DIR / 'docs.html'
    ai_file = PUBLIC_DIR / 'AI_REFERENCE.md'
    type_reference_file = PUBLIC_DIR / 'TYPE_REFERENCE.md'
    type_reference_html_file = PUBLIC_DIR / 'TYPE_REFERENCE.html'
    manifest_file = PUBLIC_DIR / 'docs_manifest.json'

    errors = []
    warnings = []

    if not api_file.exists():
        errors.append(f"ERROR: api-definitions.json not found at {api_file}")

    for f in (docs_file, ai_file, type_reference_file, type_reference_html_file, manifest_file):
        if not f.exists():
            errors.append(f"ERROR: Missing {f.name}. Run: python3 scripts/generate_docs.py")

    if not errors and manifest_file.exists():
        try:
            manifest = json.loads(manifest_file.read_text(encoding='utf-8'))
        except Exception as e:
            errors.append(f"ERROR: Invalid docs_manifest.json: {e}")
        else:
            sdk_package_file = REPO_ROOT / 'node_modules' / '@dashevo' / 'evo-sdk' / 'package.json'
            if not sdk_package_file.exists():
                errors.append('ERROR: Installed @dashevo/evo-sdk package metadata not found')
            else:
                sdk_package = json.loads(sdk_package_file.read_text(encoding='utf-8'))
                manifest_sdk = manifest.get('sdk_types', {})
                if manifest_sdk.get('version') != sdk_package.get('version'):
                    errors.append(
                        f"ERROR: Generated return types use SDK {manifest_sdk.get('version')}; "
                        f"installed SDK is {sdk_package.get('version')}"
                    )

            if manifest.get('documented_operations') != 94:
                errors.append('ERROR: Documentation manifest does not report 94 documented operations')

            if api_file.exists() and docs_file.exists() and api_file.stat().st_mtime > docs_file.stat().st_mtime:
                warnings.append('WARNING: api-definitions.json modified after docs.html was generated')
            if api_file.exists() and ai_file.exists() and api_file.stat().st_mtime > ai_file.stat().st_mtime:
                warnings.append('WARNING: api-definitions.json modified after AI_REFERENCE.md was generated')

            if docs_file.exists() and docs_file.read_text(encoding='utf-8').count('<div class="returns">') != 94:
                errors.append('ERROR: docs.html must contain return blocks for all 94 operations')
            if ai_file.exists() and ai_file.read_text(encoding='utf-8').count('\nReturns:\n') != 94:
                errors.append('ERROR: AI_REFERENCE.md must contain return blocks for all 94 operations')

            if ai_file.exists() and type_reference_file.exists():
                ai_text = ai_file.read_text(encoding='utf-8')
                type_text = type_reference_file.read_text(encoding='utf-8')
                linked_anchors = set(re.findall(r'TYPE_REFERENCE\.md#(type-[a-z0-9-]+)', ai_text))
                declared_anchors = set(re.findall(r'<a id="(type-[a-z0-9-]+)"></a>', type_text))
                missing_anchors = sorted(linked_anchors - declared_anchors)
                if missing_anchors:
                    errors.append(f"ERROR: Missing return type anchors: {', '.join(missing_anchors)}")

            if docs_file.exists() and type_reference_html_file.exists():
                docs_text = docs_file.read_text(encoding='utf-8')
                type_html = type_reference_html_file.read_text(encoding='utf-8')
                linked_anchors = set(re.findall(r'TYPE_REFERENCE\.html#(type-[a-z0-9-]+)', docs_text))
                declared_anchors = set(re.findall(r'id="(type-[a-z0-9-]+)"', type_html))
                missing_anchors = sorted(linked_anchors - declared_anchors)
                if missing_anchors:
                    errors.append(f"ERROR: Missing HTML return type anchors: {', '.join(missing_anchors)}")

            extractor = REPO_ROOT / 'scripts' / 'extract_sdk_types.mjs'
            extracted = subprocess.run(
                ['node', str(extractor), '--api', str(api_file)],
                cwd=REPO_ROOT,
                capture_output=True,
                text=True,
            )
            if extracted.returncode != 0:
                errors.append(f'ERROR: SDK return type extraction failed: {extracted.stderr.strip()}')
            else:
                metadata = json.loads(extracted.stdout)
                if len(metadata.get('methods', {})) != 93:
                    errors.append('ERROR: Expected 93 unique SDK methods for 94 documented operations')

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
