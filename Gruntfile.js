module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        clean: {
            dist: 'dist/**'
        },

        package2bower: {
            all: {
                fields: [
                    'name',
                    'description',
                    'version',
                    'homepage',
                    'license',
                    'keywords'
                ]
            }
        },

        watch: {
            build: {
                files: ['lib/**/*.js'],
                tasks: ['build']
            },
        },

        webpack: require('./webpack.config.js')
    });

    grunt.registerMultiTask('package2bower', 'Sync package.json to bower.json', function () {
        var npm = grunt.file.readJSON('package.json');
        var bower = grunt.file.readJSON('bower.json');
        var fields = this.data.fields || [];

        for (var i = 0, l = fields.length; i < l; i++) {
            var field = fields[i];
            bower[field] = npm[field];
        }

        grunt.file.write('bower.json', JSON.stringify(bower, null, 2));
    });

    grunt.registerTask('build', 'Run webpack and bundle the source', ['clean', 'webpack']);
};
