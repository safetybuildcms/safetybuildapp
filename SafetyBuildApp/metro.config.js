const { getDefaultConfig } = require('expo/metro-config')
const { withNativeWind } = require('nativewind/metro')

const path = require('path')

// Find the workspace root (assuming this is the Expo app)
const projectRoot = __dirname
const workspaceRoot = path.resolve(projectRoot, '..')

const config = getDefaultConfig(projectRoot)

// Watch all files in the workspace root
config.watchFolders = [workspaceRoot]

// Ensure Metro resolves packages from the workspace root
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules')
]

// Ensure the correct file extensions are used
config.resolver.sourceExts = [...config.resolver.sourceExts, 'jsx', 'js', 'ts', 'tsx']

module.exports = withNativeWind(config, { input: './global.css' })
