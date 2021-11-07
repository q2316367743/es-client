module.exports = {
    runtimeCompiler: true,
    publicPath: process.env.NODE_ENV === 'production' ?
        './' : '/',
    outputDir: './electron/html',
}