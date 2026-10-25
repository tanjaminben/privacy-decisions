# Local browser dependencies

These distributions are served locally by the portfolio tools. Preserve the notices alongside each distribution.

| Dependency | Source pin | Local notice | Use |
| --- | --- | --- | --- |
| Nutshell 1.0.8 | `ncase/nutshell` commit `d91469e1b2c9be8294d30542bf50f317953a9d01` | `nutshell/LICENSE.txt` plus bundled notices in `nutshell.js` | Authored expandable explanations |
| Rough Notation 0.5.1 | npm `rough-notation@0.5.1` | `rough-notation/LICENSE` | Result-ready underline and authored highlights, underlines, circles and brackets inside expandable explanations |

Upstream projects: https://github.com/ncase/nutshell, https://github.com/rough-stuff/rough-notation.

Local Nutshell patch, October 20, 2026: bubble removal uses `bubble.remove()` instead of `bubble.parentNode.removeChild(bubble)`. A host can replace field/scenario help before the closing animation finishes; removal must also be safe when the bubble is already detached. The upstream commit and notices above remain its provenance. SHA-256 before: `e7085b9bfe29aa03cec00ec27a998be43fc8f5efd77877a8a5ba46f817abef8f`; after: `c4a3c6773d34542adad9992d2843c2c39774d66c1db00ed53cc9ea8a5b1860fa`.

Additional local pointer patch, October 20, 2026: `ex.open` skips `display: contents` ancestors when measuring the click's parent origin. These wrappers have no box; using their zero X coordinate placed top-level pointers in blank space on Redactorium. Ordinary rendered-parent coordinates and the arrow shape/clamping remain unchanged. SHA-256 before: `c4a3c6773d34542adad9992d2843c2c39774d66c1db00ed53cc9ea8a5b1860fa`; after: `3f13933c917b57528d2fb78fe904c92a4b7b03d4cb78c999578bd599f6c505c2`.

The dependency notices above describe the bundled distributions and their local patches. File hashes are recorded in SOURCE-PINS.json at the repository root.
