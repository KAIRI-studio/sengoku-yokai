"""Verify each editorial page anchor against the exact official PDF text.
Usage: pdftotext -layout downloaded-official.pdf social.txt
       python scripts/check-quiz-sources-v110.py social.txt
No PDF is redistributed by the game.
"""
from pathlib import Path
import json,sys
root=Path(__file__).resolve().parents[1]
questions=json.loads((root/'docs/quiz-source-map-v110.json').read_text())
pages=Path(sys.argv[1]).read_text().split('\f')
for q in questions:
    source=q['source']
    page=source['pdfPage']
    assert source['basis'] in ''.join(pages[page-1].split()), (q['id'],page,source['basis'])
assert len(questions)==48
print('All 48 official PDF page anchors verified.')
