/*global module:false, require:false*/
module.exports = function (grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    meta: {
      banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' + '<%= grunt.template.today("yyyy-mm-dd") %>\\n' + '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' + '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' + ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */'
    },
    connect: {
      server: {
        options: {
          port: 8085
        }
      }
    },
    concat: {
      options: {
        banner: '<%= meta.banner %>',
        stripBanners: true
      },
      dist: {
        src: ['src/<%= pkg.name %>.js'],
        dest: 'dist/<%= pkg.name %>.js'
      },
      distcss: {
        src: ['src/<%= pkg.name %>.css'],
        dest: 'dist/<%= pkg.name %>.css'
      }
    },
    uglify: {
      dist: {
        files: {
          'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
        }
      }
    },
    cssmin: {
      dist: {
        files: {
          'dist/<%= pkg.name %>.min.css': ['<%= concat.distcss.dest %>']
        }
      },
      docs: {
        files: {
          'dist/index.min.css': ['<%= less.index.dest %>']
        }
      }
    },
    jade: {
      compile: {
        files: {
          "dist/index.html": ["src/index.jade"]
        },
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
      all: {
        options: {
          urls: ['1.9.1', '1.10.0-beta1', '2.0.0'].map(function (version) {
            return 'http://localhost:<%= connect.server.options.port %>/test/jquery.placeholder.html?jquery=' + version;
          })
        }
      }
    },
    beautify: {
      files: '<%= jshint.files.src %>'
    },
    watch: {
      files: '<%= jshint.files.src %>',
      tasks: ['test']
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
        files: [{
          expand: true,
          flatten: true,
          dest: 'dist/',
          src: ['CHANGES', 'LICENSE', 'README', 'ext/bootstrap/bootstrap.min.css']
        }]
      }
    },
    compress: {
      zip: {
        options: {
          mode: "zip",
          rootDir: "jquery-placeholder-plugin",
          archive: "jquery-placeholder-plugin-<%= pkg.version %>.zip"
        },
        files: [{
          expand: true,
          flatten: true,
          cwd: 'dist/',
          dest: "",
          src: ["**"]
        }]
      }
    },
    // secret.json contains the host, username and password for a server to
    // scp to
    secret: grunt.file.readJSON('secret.json'),
    sftp: {
      deploy: {
        files: {
          "./": "jquery-placeholder-plugin-<%= pkg.version %>.zip"
        },
        options: {
          host: '<%= secret.host %>',
          username: '<%= secret.username %>',
          password: '<%= secret.password %>',
          path: '<%= secret.path %>'
        }
      }
    },
    clean: ['dist', '*zip'],
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
        browser: true,
        globals: {
          jQuery: true
        }
      },
      files: {
        src: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js']
      }
    }
  });

  // Default task.
  grunt.registerTask('default', ['jshint', 'beautify']);
  grunt.registerTask('test', ['connect', 'jshint', 'qunit']);
  grunt.registerTask('build', ['jade', 'less', 'concat', 'uglify', 'cssmin', 'copy']);
  grunt.registerTask('dist', ['build', 'replace:dist', 'compress']);
  grunt.registerTask('deploy', ['build', 'replace:deploy', 'replace:dist', 'compress', 'sftp']);

  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-bump');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-beautify');
  grunt.loadNpmTasks('grunt-ssh');
  grunt.loadNpmTasks('grunt-replace');

  grunt.registerTask('tidy', 'beautify');
};
