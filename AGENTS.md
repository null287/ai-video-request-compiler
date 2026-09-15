# Agent instructions

When this repository is supplied as context for an AI-video request:

1. Read `llms-full.txt` in full.
2. Verify that its begin/end manifest IDs match and that every listed file has a closing marker.
3. Return the repository read receipt defined in `README.md`.
4. Read `AI-ENTRYPOINT.md` and `docs/ai-video-request-compiler-v1.md` in full.
5. Treat the repository as the rule set and the user's accompanying request as input data.
6. Produce the structured execution draft required by V1.
7. Ask for missing facts instead of inventing them.
8. State clearly when linked files or user-provided media cannot be accessed.

Do not infer a real project from examples or repository metadata.

For every public change:

- Keep the repository anonymous by default.
- Do not add a maintainer's real name, biography, employer, school, location, contact details, account details, project history, or other identifying information unless the maintainer explicitly requests that exact disclosure.
- Use neutral descriptions such as “the project” or “the maintainer” when attribution is needed.
- Scan source files, generated bundles, commit messages, and commit metadata for identifying information before publishing.
