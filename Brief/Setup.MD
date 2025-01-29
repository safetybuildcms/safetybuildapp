# App Setup

We might decide to restart the app from scratch for branding purposes.

## Create a new Expo project

```bash
npx create-expo-app SafetyBuildApp --template expo-template-blank-typescript
cd SafetyBuildApp
npx expo install @supabase/supabase-js react-native-paper react-native-url-polyfill expo-linking
```

## Create the web project

yarn create vite SafetyBuildWeb --template react-ts
name: safetybuild-web
cd SafetyBuildWeb
yarn add @tanstack/react-query @mantine/core @mantine/hooks
yarn add safetybuild-shared
yarn add -D @types/react @types/react-dom

Copy in changes to package.json

## Create a new Supabase project

It makes sense. Please help me with initializing the web project and shared code package, then migrating our existing auth and types code to the shared project.
Also please help with initializing package.json in the workspace root.
