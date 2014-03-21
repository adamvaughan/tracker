/* jshint camelcase:false */

'use strict';

module.exports = function (grunt) {
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    yeoman: {
      app: require('./bower.json').appPath || 'app',
      dist: 'dist'
    },

    express: {
      options: {
        port: process.env.PORT || 9000
      },
      dev: {
        options: {
          script: 'server.js',
          debug: true
        }
      },
      prod: {
        options: {
          script: 'dist/server.js',
          node_env: 'production'
        }
      }
    },

    open: {
      server: {
        url: 'http://localhost:<%= express.options.port %>'
      }
    },

    watch: {
      client: {
        files: ['<%= yeoman.app %>/scripts/{,*/}*.js'],
        tasks: ['newer:jshint:client'],
        options: {
          livereload: true
        }
      },
      server: {
        files: ['server.js', 'lib/{,*/}*.js'],
        tasks: ['newer:jshint:server']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      styles: {
        files: ['<%= yeoman.app %>/styles/{,*/}*.less'],
        tasks: ['less:server', 'autoprefixer']
      },
      livereload: {
        files: [
          '<%= yeoman.app %>/views/{,*//*}*.html',
          '{.tmp,<%= yeoman.app %>}/styles/{,*/}*.css',
          '{.tmp,<%= yeoman.app %>}/scripts/{,*//*}*.js'
        ],
        options: {
          livereload: true
        }
      },
      express: {
        files: [
          'server.js',
          'lib/{,*/}*.js'
        ],
        tasks: ['newer:jshint:server', 'express:dev'],
        options: {
          livereload: true,
          nospawn: true //Without this option specified express won't be reloaded
        }
      }
    },

    jshint: {
      options: {
        reporter: require('jshint-stylish')
      },
      server: {
        options: {
          jshintrc: '.jshintrc'
        },
        src: [
          'Gruntfile.js',
          'server.js',
          'lib/{,*/}*.js'
        ]
      },
      client: {
        options: {
          jshintrc: 'app/.jshintrc'
        },
        src: ['app/scripts/{,*/}*.js']
      }
    },

    less: {
      server: {
        options: {
          paths: ['<%= yeoman.app %>/styles'],
          cleancss: false
        },
        files: {
          '.tmp/styles/main.css': '<%= yeoman.app %>/styles/main.less'
        }
      },
      dist: {
        options: {
          paths: ['<%= yeoman.app %>/styles'],
          cleancss: true
        },
        files: {
          '.tmp/styles/main.css': '<%= yeoman.app %>/styles/main.less'
        }
      }
    },

    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= yeoman.dist %>/views/*',
            '<%= yeoman.dist %>/public/*',
            '!<%= yeoman.dist %>/public/.git*',
          ]
        }]
      },
      server: '.tmp'
    },

    autoprefixer: {
      options: {
        browsers: ['last 1 version']
      },
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/styles/',
          src: '{,*/}*.css',
          dest: '.tmp/styles/'
        }]
      }
    },

    rev: {
      dist: {
        files: {
          src: [
            '<%= yeoman.dist %>/public/scripts/{,*/}*.js',
            '<%= yeoman.dist %>/public/styles/{,*/}*.css'
          ]
        }
      }
    },

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      html: ['<%= yeoman.app %>/views/index.html'],
      options: {
        dest: '<%= yeoman.dist %>/public'
      }
    },

    // Performs rewrites based on rev and the useminPrepare configuration
    usemin: {
      html: ['<%= yeoman.dist %>/views/{,*/}*.html'],
      css: ['<%= yeoman.dist %>/styles/{,*/}*.css'],
      options: {
        assetsDirs: ['<%= yeoman.dist %>/public']
      }
    },

    htmlmin: {
      dist: {
        options: {
          //collapseWhitespace: true,
          //collapseBooleanAttributes: true,
          //removeCommentsFromCDATA: true,
          //removeOptionalTags: true
        },
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/views',
          src: ['*.html', 'partials/*.html'],
          dest: '<%= yeoman.dist %>/views'
        }]
      }
    },

    concurrent: {
      dist: [
        'less:dist',
        'htmlmin'
      ]
    },

    copy: {
      dist: {
        files: [{
          expand: true,
          dest: '<%= yeoman.dist %>',
          src: [
            'package.json',
            'server.js',
            'lib/**/*'
          ]
        }]
      }
    }
  });

  grunt.registerTask('express-keepalive', 'Keep grunt running', function () {
    this.async();
  });

  grunt.registerTask('serve', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'express:prod', 'open', 'express-keepalive']);
    }

    grunt.task.run([
      'jshint',
      'clean:server',
      'less:server',
      'autoprefixer',
      'express:dev',
      'open',
      'watch'
    ]);
  });

  grunt.registerTask('build', [
    'clean:dist',
    'useminPrepare',
    'concurrent:dist',
    'autoprefixer',
    'concat',
    'copy:dist',
    'cssmin',
    'uglify',
    'rev',
    'usemin'
  ]);

  grunt.registerTask('default', [
    'newer:jshint',
    'build'
  ]);
};
