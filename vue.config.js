module.exports = {
    chainWebpack: config => {
        config.resolve.extensions
            .merge(['.ts', 'tsx'])
    }
}