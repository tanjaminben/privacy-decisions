// Register authored help once, through the shared adapter after the app mounts.
// A second automatic Nutshell start would cache the already-hidden source text.
if (window.Nutshell) Nutshell.setOptions({ startOnLoad: false, dontEmbedHeadings: true });
