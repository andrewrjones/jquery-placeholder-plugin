/*global module:false, require:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: '<json:package.json>',
    meta: {
      banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '<%= pkg.homepage ? "* " + pkg.homepage + "\n" : "" %>' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
        ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */'
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
      files: ['test/**/*.html']
    },
    lint: {
      files: ['grunt.js', 'src/**/*.js', 'test/**/*.js']
    },
    csslint: {
      files: ['src/**/*.css']
    },
    watch: {
      files: '<config:lint.files>',
      tasks: 'lint qunit'
    },
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
  grunt.registerTask('default', 'lint csslint qunit');
  
  grunt.registerTask('dist', 'default jade less concat min cssmin copy');

  grunt.loadNpmTasks('grunt-less');
  grunt.loadNpmTasks('grunt-css');
  grunt.loadNpmTasks('grunt-jade');
  
  // TODO: create generic copy task
  grunt.registerTask('copy', 'Copy misc files to dist', function() {
    var files = [
      'CHANGES',
      'LICENSE',
      'README',
      'ext/bootstrap/bootstrap.min.css'
    ];
    
    files.forEach(function(f) {
      var name = f.split("/").pop();
      grunt.file.copy(f, "dist/" + name);
    });
  });
};
