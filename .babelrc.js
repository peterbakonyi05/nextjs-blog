module.exports = {
    "presets": [
        "next/babel"
    ],
    "plugins": [
        'babel-plugin-transform-typescript-metadata',

        [
            '@babel/plugin-proposal-decorators/lib/index.js',
            {
                legacy: true,
            },
        ],
        // TODO: check separately if these are needed in case injection is failing with some random issues
        // [
        //     '@babel/plugin-proposal-class-properties/lib/index.js',
        //     {
        //         loose: true,
        //     },
        // ],
        // [
        //     '@babel/plugin-proposal-private-methods/lib/index.js',
        //     {
        //         loose: true,
        //     },
        // ],
    ]

}