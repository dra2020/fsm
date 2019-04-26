var libConfig = {
    entry: {
      library: './lib/all.ts'
	  },
    target: 'node',
    mode: 'development',
    output: {
        library: 'fsm',
        libraryTarget: 'umd',
        path: __dirname + '/dist',
        filename: 'fsm.js'
    },

    // Enable source maps
    devtool: "source-map",

	externals: {
    "@terrencecrowley/util": "commonjs @terrencecrowley/util"
	},
		

    module: {
		rules: [
			{ test: /\.tsx?$/, use: 'ts-loader', exclude: /node_modules/ },
			{ test: /\.json$/, loader: 'json-loader' },
			{ test: /\.js$/, enforce: "pre", loader: "source-map-loader" }
		]
    },

    resolve: {
        extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
    }

};

module.exports = [ libConfig ];
