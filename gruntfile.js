/**
 * Node.js Module Build
 *
 * @author potanin@UD
 * @version 0.0.2
 * @param grunt
 */
module.exports = function( grunt ) {

  grunt.initConfig( {

    pkg: grunt.file.readJSON( 'package.json' ),

    mochacli: {
      options: {
        require: [ 'should' ],
        reporter: 'list',
        ui: 'exports'
      },
      basic: [ 'test/api.js' ],
      advanced: [ 'test/service.js', 'test/benchmark.js' ]
    },

    yuidoc: {
      compile: {
        name: '<%= pkg.name %>',
        description: '<%= pkg.description %>',
        version: '<%= pkg.version %>',
        url: '<%= pkg.homepage %>',
        logo: 'http://media.usabilitydynamics.com/logo.png',
        options: {
          paths: [ "./bin", "./lib" ],
          outdir: './static/codex'
        }
      }
    },

    jscoverage: {
      options: {
        inputDirectory: 'lib',
        outputDirectory: './static/lib-cov',
        highlight: false
      }
    },

    watch: {
      options: {
        interval: 1000,
        debounceDelay: 500
      },
      docs: {
        files: [ 'readme.md' ],
        tasks: [ 'markdown' ]
      }
    },

    markdown: {
      all: {
        files: [ {
          expand: true,
          src: 'readme.md',
          dest: 'static/',
          ext: '.html'
        }
        ],
        options: {
          templateContext: {},
          markdownOptions: {
            highlight: 'manual',
            gfm: true,
            codeLines: {
              before: '<span>',
              after: '</span>'
            }
          }
        }
      }
    },

    clean: [
      ".dynamic/pid/*",
      ".dynamic/cache/*",
      ".dynamic/logs/*",
      '.DS_Store',
      "node_modules/abstract",
      "node_modules/auto",
      "node_modules/object-emitter",
      "node_modules/object-settings",
      "node_modules/object-validation"
    ],

    shell: {
      install: {
        options: { stdout: true },
        command: 'bash bin/bash/install.sh'
      },
      update: {
        options: { stdout: true },
        command: 'bash bin/bash/update.sh'
      },
      publish: {
        options: { stdout: true },
        command: 'bash bin/bash/publish.sh'
      },
      push: {
        options: { stdout: true },
        command: 'git add . && git commit -m "Automatic push." && git push'
      },
      pull: {
        options: { stdout: true },
        command: [ 'git pull', 'grunt install' ]
      }
    }

  });

  // Load tasks
  grunt.loadNpmTasks( 'grunt-markdown' );
  grunt.loadNpmTasks( 'grunt-mocha-cli' );
  grunt.loadNpmTasks( 'grunt-jscoverage' );
  grunt.loadNpmTasks( 'grunt-contrib-symlink' );
  grunt.loadNpmTasks( 'grunt-contrib-yuidoc' );
  grunt.loadNpmTasks( 'grunt-contrib-watch' );
  grunt.loadNpmTasks( 'grunt-contrib-less' );
  grunt.loadNpmTasks( 'grunt-contrib-clean' );
  grunt.loadNpmTasks( 'grunt-shell' );

  // Build Assets
  grunt.registerTask( 'default', [ 'jscoverage', 'yuidoc', 'mochacli:basic' ] );

  // Install environment
  grunt.registerTask( 'install', [ 'shell:install', 'yuidoc'  ] );

  // Update Environment
  grunt.registerTask( 'update', [ 'shell:pull', 'shell:update', 'yuidoc'   ] );

  // Prepare distribution
  grunt.registerTask( 'dist', [ 'clean', 'yuidoc', 'markdown'  ] );

  // Update Documentation
  grunt.registerTask( 'doc', [ 'yuidoc', 'markdown' ] );

  // Run Tests
  grunt.registerTask( 'test', [ 'jscoverage', 'mochacli:basic' ] );

  // Developer Mode
  grunt.registerTask( 'dev', [ 'watch' ] );

};