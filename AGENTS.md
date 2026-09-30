# Agent instructions

When this repository is supplied as context for an AI-video request:

1. Read the latest `README.md` and execute the content between `OUTPUT-CONTRACT-BEGIN:V1` and `OUTPUT-CONTRACT-END:V1` as the highest-priority output contract for this repository.
2. Treat the repository as the rule set and the user's accompanying request as input data.
3. Return one merged production brief, not separate briefs for different roles.
4. For every real time segment, output exactly one `AI生成师负责：` label and one `设计师负责（剪辑）：` label.
5. Do not turn missing reference footage, language notes, review notes, or open questions into fake time segments.
6. Mark non-blocking gaps inline and reserve one short final confirmation note for genuinely blocking issues.
7. Read `llms-full.txt` only when the task explicitly requires a complete repository audit; then verify its begin/end manifest IDs and file closing markers.
8. State clearly when linked files or user-provided media cannot be accessed, without letting that limitation replace the requested production brief.

Do not infer a real project from examples or repository metadata.

For every public change:

- Keep the repository anonymous by default.
- Do not add a maintainer's real name, biography, employer, school, location, contact details, account details, project history, or other identifying information unless the maintainer explicitly requests that exact disclosure.
- Use neutral descriptions such as “the project” or “the maintainer” when attribution is needed.
- Scan source files, generated bundles, commit messages, and commit metadata for identifying information before publishing.
