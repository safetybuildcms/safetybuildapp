module.exports = function (api) {
  api.cache(true)
  return {
    presets: ['babel-preset-expo', '@babel/preset-flow'],
    plugins: [['module:react-native-dotenv']]
  }
}
