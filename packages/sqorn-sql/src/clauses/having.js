const { conditions } = require('../util')

module.exports = ctx => {
  if (ctx.hav.length === 0) return
  const txt = conditions(ctx, ctx.hav)
  return txt && 'having ' + txt
}
