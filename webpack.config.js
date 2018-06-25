const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const { join } = require('path');
const webpackMerge = require('webpack-merge');
const { dev, prod } = require('@ionic/app-scripts/config/webpack.config');

const env = process.env.ENV || 'prod';

const customConfig = {
    resolve: {
        alias: {
            '@app': join(__dirname, './src/app'),
            '@core': join(__dirname, './src/app/core/'),
            '@shared': join(__dirname, './src/app/shared/'),
            '@assets': join(__dirname, './src/assets/'),
            '@env': join(__dirname, environmentPath(env)),
            '@theme': join(__dirname, './src/theme/')
        }
    }
};

function environmentPath(env) {
    var filePath = './src/environments/environment' + (env === 'prod' ? '' : '.' + env) + '.ts';
    if (!fs.existsSync(filePath)) {
        console.log(chalk.red('\n' + filePath + ' does not exist!'));
    } else {
        return filePath;
    }
}

const configs = {
    dev: webpackMerge(dev, customConfig),
    prod: webpackMerge(prod, customConfig),
}

module.exports = configs;
