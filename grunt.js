/*global module:false, require:false*/
module.exports = function (grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: '<json:package.json>',
    meta: {
      banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' + '<%= grunt.template.today("yyyy-mm-dd") %>\n' + '<%= pkg.homepage ? "* " + pkg.homepage + "\n" : "" %>' + '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' + ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */'
    },
    server: {
      port: 8085
    },
    concat: {
      dist: {
        src: ['<banner>', '<file_strip_banner:src/<%= pkg.name %>.js>'],
        dest: 'dist/<%= pkg.name %>.js'
      },
      distcss: {
        src: ['<banner>', '<file_strip_banner:src/<%= pkg.name %>.css>'],
        dest: 'dist/<%= pkg.name %>.css'
      }
    },
    min: {
      dist: {
        src: ['<banner>', '<config:concat.dist.dest>'],
        dest: 'dist/<%= pkg.name %>.min.js'
      }
    },
    cssmin: {
      dist: {
        src: ['<config:concat.distcss.dest>'],
        dest: 'dist/<%= pkg.name %>.min.css'
      },
      docs: {
        src: ['<config:less.index.dest>'],
        dest: 'dist/index.min.css'
      }
    },
    jade: {
      html: {
        src: ["src/index.jade"],
        dest: "dist",
        options: {
          client: false
        }
      }
    },
    less: {
      index: {
        src: "src/index.less",
        dest: "dist/index.css"
      }
    },
    qunit: {
      urls: ['1.9.1', '2.0.0b1'].map(function (version) {
        return 'http://localhost:<%= server.port %>/test/jquery.placeholder.html?jquery=' + version;
      })
    },
    lint: {
      files: ['grunt.js', 'src/**/*.js', 'test/**/*.js']
    },
    beautify: {
      files: '<config:lint.files>'
    },
    csslint: {
      files: ['src/**/*.css']
    },
    watch: {
      files: '<config:lint.files>',
      tasks: 'lint qunit'
    },
    replace: {
      dist: {
        options: {
          variables: {
            'version': '<%= pkg.version %>',
            'piwik': ''
          }
        },
        files: {
          'dist/': ['dist/index.html']
        }
      },
      deploy: {
        options: {
          variables: {
            'piwik': '<%= grunt.file.read("includes/piwik.html") %>'
          }
        },
        files: {
          'dist/': ['dist/index.html']
        }
      }
    },
    copy: {
      dist: {
        options: {
          flatten: true
        },
        files: {
          'dist/': ['CHANGES', 'LICENSE', 'README', 'ext/bootstrap/bootstrap.min.css']
        }
      }
    },
    compress: {
      zip: {
        options: {
          mode: "zip",
          rootDir: "jquery-placeholder-plugin"
        },
        files: {
          "jquery-placeholder-plugin-<%= pkg.version %>.zip": ["dist/**"]
        }
      }
    },
    // secret.json contains the host, username and password for a server to
    // scp to
    secret: '<json:secret.json>',
    sftp: {
      deploy: {
        files: {
          "./": "jquery-placeholder-plugin-<%= pkg.version %>.zip"
        },
        options: {
          host: '<%= secret.host %>',
          username: '<%= secret.username %>',
          password: '<%= secret.password %>'
        }
      }
    },
    clean: ['dist'],
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        browser: true
      },
      globals: {
        jQuery: true
      }
    },
    uglify: {}
  });

  // Default task.
  grunt.registerTask('default', 'lint csslint beautify qunit');
  grunt.registerTask('test', 'server lint qunit');
  grunt.registerTask('build', 'jade less concat min cssmin copy');
  grunt.registerTask('dist', 'build compress replace:dist');
  grunt.registerTask('deploy', 'build compress replace:deploy replace:dist sftp');

  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-bump');
  grunt.loadNpmTasks('grunt-css');
  grunt.loadNpmTasks('grunt-jade');
  grunt.loadNpmTasks('grunt-beautify');
  grunt.loadNpmTasks('grunt-ssh');
  grunt.loadNpmTasks('grunt-replace');

  grunt.registerTask('tidy', 'beautify');
};