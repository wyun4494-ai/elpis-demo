/**
 * PostCSS 配置文件
 * 用于修复 Windows 路径处理问题
 *
 * 问题：Vue Compiler SFC 在 Windows 上处理 CSS 时，
 * PostCSS 无法正确处理包含反斜杠的文件路径
 *
 * 解决方案：禁用 PostCSS 的 URL 处理，让 Webpack 的 css-loader 处理
 */

module.exports = {
  // 不使用任何 PostCSS 插件，避免 Windows 路径问题
  plugins: {}
}

