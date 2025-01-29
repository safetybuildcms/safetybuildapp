# Welcome to SafetyBuild

SafetyBuild is a platform for managing and tracking contractors.

## Getting Started

We're pnpm workspace and VSCode workspace to manage the project.

### Opening The Project in VS Code

When prompted, click Open Workspace to open the project workspace.
Alternative, run `open safetybuild.code-workspace` on MacOS or `safetybuild.code-workspace` on Windows.
You can also select `safetybuild.code-workspace` via File->Open Workspace.

## Running the project

### Env

The following .env files are required:

SafetyBuildApp/.env:

```bash
SUPABASE_URL=http://192.168.1.100:54321 # If hosting supabase locally, use your network address, not localhost - so physical devices can find it
SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

SafetyBuildWeb/.env

````bash
VITE_SUPABASE_URL=http://localhost:54321 # or something like https://*.supabase.com if using a free hosted project
VITE_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
``

```bash
npm install -g pnpm
pnpm install
pnpm shared:build # required when shared code updates
pnpm shared:watch # watch for changes in shared code module
pnpm shared # used for running code within shared
pnpm web # run the web app
pnpm mobile # run the mobile app via expo
````

## Testing

```bash
pnpm mobile:test
pnpm web:test
```

## Project Structure

- `shared`: shared code module
  Any business logic should be in the shared module.
  Where possible, place code here instead of in the web or mobile app

- `SafetyBuildWeb`: web app
- `SafetyBuildApp`: mobile app

The module name of shared code is `safetybuild-shared`. Import code as follows:

```ts
import { someFunction } from 'safetybuild-shared'
```

## Adding dependencies

To add a dependency to the shared module, run the following command:

```bash
pnpm --filter safetybuild-shared add <dependency>
```

To add a dependency to the web or mobile app, run the following command:

```bash
pnpm --filter safetybuild-web add <dependency>
pnpm --filter safetybuild-app add <dependency>
```

# Code Formatting

## VSCode

Install the VSCode prettier extension:
`CTRL/COMMAND+SHIFT+P`: `ext install esbenp.prettier-vscode`

Create a .vscode/settings.json in the root and each project folder as follows:

```bash
code .vscode/settings.json
code SafetyBuildWeb/.vscode/settings.json
code SafetyBuildApp/.vscode/settings.json
code shared/.vscode/settings.json
```

```json
{
  "editor.tabSize": 2,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true
}
```
