module.exports = function(grunt) {

    grunt.initConfig({
        jasmine_node: {
            task_name: {
                options: {
                    coverage: {
                        excludes: ["lib/**/*.spec.js", "tests/**"]
                    },
                    showColors: true,
                    forceExit: true,
                    specFolders: ['lib'],
                    extensions: 'js',
                    specNameMatcher: 'spec',
                    captureExceptions: true,
                    junitreport: {
                        report: false, //make a jasmine report xml
                        savePath: './build/reports/jasmine/',
                        useDotNotation: true,
                        consolidate: true
                    }
                },
                src: ['**/*.js']
            }
        }
    });

    grunt.loadNpmTasks('grunt-jasmine-node-coverage');

    grunt.registerTask('default', []);
    grunt.registerTask('test', ['jasmine_node']);

};