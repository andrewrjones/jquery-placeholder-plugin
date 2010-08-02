#!/usr/bin/perl

use strict;
use warnings;
use 5.010_000;
use FindBin qw($Bin);
use File::Util;
use File::Copy;

our $VERSION = "0.1";

my $f = File::Util->new();

given($ARGV[0]){
    when("minify"){
        # minifies the js and css using CPAN modules
        minify();
    }
    when("convert"){
        # converts the haml and scss files to html and css respectively
        convert();
    }
    when("build"){
        # do everything and create a zip archive
        convert();
        minify();
        build();
    }
    default{
        say "usage: $0 <minify|convert|build>";
        exit(0);
    }
}

sub minify {
    eval { require JavaScript::Minifier } || die "JavaScript::Minifier not found. Can not minify.";
    eval { require CSS::Minifier } || die "CSS::Minifier not found. Can not minify.";
    
    my @js_files = <$Bin/../src/*.js>;
    foreach my $file( @js_files ){
        next if $file =~ m/jquery-1\.4\.2\.js$/;
        next if $file =~ m/-min\.js$/;
        my $outfile = $file;
        $outfile =~ s/\.js$/-min.js/;
        
        open( INFILE, '<', $file );
        open( OUTFILE, '>', $outfile );
        
        JavaScript::Minifier::minify(input => *INFILE, outfile => *OUTFILE);
        
        say "$file > $outfile";
        
        close INFILE;
        close OUTFILE;
    }
    
    my @css_files = <$Bin/../src/*.css>;
    foreach my $file( @css_files ){
        next if $file =~ m/-min\.css$/;
        my $outfile = $file;
        $outfile =~ s/\.css$/-min.css/;
        
        open( INFILE, '<', $file );
        open( OUTFILE, '>', $outfile );
        
        CSS::Minifier::minify(input => *INFILE, outfile => *OUTFILE);
        
        say "$file > $outfile";
        
        close INFILE;
        close OUTFILE;
    }
}

sub convert {
    my @haml_files = <$Bin/../src/*.haml>;
    foreach my $file( @haml_files ){
        my $outfile = $file;
        $outfile =~ s/haml$/htm/;
        `haml $file $outfile`;
        
        say "$file > $outfile";
    }
    
    my @scss_files = <$Bin/../src/*.scss>;
    foreach my $file( @scss_files ){
        my $outfile = $file;
        $outfile =~ s/scss$/css/;
        `sass $file $outfile`;
        
        say "$file > $outfile";
    }
}

sub build {
    my $tmp = "$Bin/tmp";
    if( -d $tmp ){
        remove_dir($tmp);
    }
    $f->make_dir("$tmp/jquery-placeholder-plugin/");
    
    my @files = qw(
        index.htm
        index-min.css
        jquery-1.4.2.js
        jquery-placeholder-plugin.css
        jquery-placeholder-plugin-min.css
        jquery-placeholder-plugin.js
        jquery-placeholder-plugin-min.js
    );
    foreach my $file( @files ){
        copy(
            "$Bin/../src/$file",
            "$tmp/jquery-placeholder-plugin/$file")
        or die "Copy failed: $!";
    }
    
    chdir $tmp;
    `zip jquery-placeholder-plugin-$VERSION.zip jquery-placeholder-plugin/*`;
}

# remove directory and everything in it
sub remove_dir {
    my ($removedir) = @_;
    my(@gonners) = $f->list_dir($removedir, '--follow');

    my $a = '';
    my $b = '';
    foreach (reverse(sort({ length($a) <=> length($b) } @gonners)), $removedir) {
      -d $_ ? rmdir($_) || die $! : unlink($_) || die $!;
    }
}
