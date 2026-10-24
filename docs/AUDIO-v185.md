# iPhone audio compatibility, v1.1.69

Use navigator.audioSession.type=playback when supported, before constructing/resuming Web Audio. This addresses the iOS silent-switch routing described by WebKit: https://bugs.webkit.org/show_bug.cgi?id=251532#c6 . Unsupported/throwing implementations are ignored.

Prime a one-sample silent buffer synchronously in the gesture handler. Retry unlock on pointerup, touchend and click, in addition to pointerdown/keyboard. Only report successful unlock if AudioContext is actually running. The settings dialog includes an explicit sound-test button. Existing v184 volume storage and all original audio assets are preserved.

Tests include session selection/fallback, a suspended resume, and synchronous buffer priming. Physical iPhone output must be verified on the device; cloud Chrome cannot reproduce its silent switch or standalone iOS PWA.
