#!/usr/bin/perl

use strict;
use warnings;
use 5.010_000;
use FindBin qw($Bin);
use File::Util;
use File::Copy;

our $VERSION = "0.1";

my $f = File::Util->new();
my @args = @ARGV;

# analytics for upload to http://andrew-jones.com/
my $piwik = <<'PIWIK';
<!-- Piwik -->
<script type="text/javascript">
var pkBaseURL = (("https:" == document.location.protocol) ? "https://analytics.andrew-jones.com/" : "http://analytics.andrew-jones.com/");
document.write(unescape("%3Cscript src='" + pkBaseURL + "piwik.js' type='text/javascript'%3E%3C/script%3E"));
</script><script type="text/javascript">
try {
var piwikTracker = Piwik.getTracker(pkBaseURL + "piwik.php", 3);
piwikTracker.trackPageView();
piwikTracker.enableLinkTracking();
} catch( err ) {}
</script><noscript><p><img src="http://analytics.andrew-jones.com/piwik.php?idsite=3" style="border:0" alt="" /></p></noscript>
<!-- End Piwik Tag -->
PIWIK

given(shift @args){
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
        say "usage: $0 <minify|convert|build[--home]>";
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
    my $home = grep(/^--home$/, @args);
    
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
    
    # extra stuff for uploading to http://andrew-jones.com
    if( $home ){
        my $index = "$tmp/jquery-placeholder-plugin/index.htm";
        my($file) = $f->load_file($index);
        
        # add analytics
        $file =~ s!</body>!$piwik</body>!g;
        
        $f->write_file('file' => $index, 'content' => $file, mode => 'trunc');
    }
    
    chdir $tmp;
    `zip jquery-placeholder-plugin-$VERSION.zip jquery-placeholder-plugin/*`;
    say "created jquery-placeholder-plugin-$VERSION.zip";
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
