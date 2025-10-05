module.exports = (app) => {
  return async (ctx, next) => {
    console.log('demo middleware')
    await next()
  }
}