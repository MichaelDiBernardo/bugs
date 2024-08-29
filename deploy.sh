#!/bin/bash

# Stolen from https://www.savjee.be/2019/04/gitlab-ci-deploy-to-ftp-with-lftp/

# Take envvars from local file (ignored in .gitignore)
source env.sh

# Make the remote directory a mirror of _site, the Jekyll build output
# directory.
lftp -p 2222 -e "set ssl:verify-certificate no; open $BLOG_FTP_HOST; user $BLOG_FTP_USER '$BLOG_FTP_PWD'; mirror -X .* -X .*/ --reverse --verbose --delete . .; bye"
