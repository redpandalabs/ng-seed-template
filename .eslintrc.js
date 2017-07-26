// eslint guide http://eslint.org/docs/user-guide/configuring

module.exports = {
    "env": {
        "es6": false,
        "browser": true
    },
    "extends": ["eslint:recommended", "angular" ],
    "plugins": [
        "angular"
    ],
    "rules": {

        "indent": [
            "error",
            4
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "never"
        ]
    }
};
