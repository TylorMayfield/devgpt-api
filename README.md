//this ReadME will be updated asap, for now, brief set-up instructions for OSS contributors follow:

1. Copy the same .env from our front-end repo but remove the NEXT_PUBLIC part of each variable name.
1. Download bun with: curl -fsSL https://bun.sh/install | bash
1. Install bun with the command that is given back in the terminal (e.g exec /bin/zsh)
1. bun i
1. comment out http_options in index.ts (these are for deployment only)
1. bun src/index.ts
