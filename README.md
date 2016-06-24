Deploytool
==========

A Node tool for deploying things like code to places like remote servers and services

## Installation

    npm install deploytool --save

## Usage

    var deploytool = require('deploytool');

    deploytool.deploy('production', 'e8ac002dc64111fce77c9c9d12c28c13c3f98aa2');

## Contributing

Take care to follow the same patterns as other Deploytool modules.

Don't extend Deplyotool itself to add new deployment types. Simply create new modules
prefixed with **deploytool-** that has a "deploy" method in it.
