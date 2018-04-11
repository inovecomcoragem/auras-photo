#!/bin/bash

git checkout --orphan gh-pages
git rm --cached -r .

./node_modules/\@angular/cli/bin/ng build --prod --base-href "https://thiagohersan.github.io/-/"
ls -la | grep -v "\(dist\|CNAME\|.git\|publish.sh\)" | xargs rm -rf

cp -r dist/* .
rm -rf dist/

git add .
git commit -m "updates site"
git push origin :gh-pages
git push -u origin gh-pages

git rm -rf *
git checkout -f master
git branch -D gh-pages
