module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/cipher-chat/'
    : '/',

  pluginOptions: {
    vuetify: {
			// https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vuetify-loader
		}
  }
}
