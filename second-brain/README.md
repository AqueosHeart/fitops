# FitOps Second Brain

This folder is the persistent project memory for FitOps. Open the repository root as an Obsidian vault, then begin at [[index]].

## Knowledge flow

```text
raw notes -> reviewed project knowledge -> linked wiki pages -> decisions and sprint work
```

- `raw/` contains source notes and ideas that have been read or written by the project owner.
- `wiki/` contains maintained project knowledge with Obsidian links.
- `boards/` provides navigational sprint views; GitHub Projects becomes the execution source of truth.
- `templates/` contains reusable note structures.
- `assets/` contains safe project-specific attachments only.

## Optional integrations

The vault structure is compatible with normal Obsidian use without third-party plugins. If desired:

1. Install the `Second Brain` community plugin through Obsidian's Community Plugins browser.
2. Review its network and API-key behavior before enabling AI compilation.
3. Keep provider keys in local plugin settings; `.gitignore` excludes plugin `data.json` files.
4. For CLI-agent commands, review the upstream `obsidian-second-brain` Agent Skills installation instructions before adding anything under `.agents/skills/`.

The repository does not automatically execute external installers or background agents.

## Memory rule

Store stable knowledge, dated observations, or links to the authoritative source. Do not copy volatile status without an `as of` date. Never store credentials, private applicant data, personal contact information, or production records.
