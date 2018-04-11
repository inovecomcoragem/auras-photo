#!/bin/bash

mv ./node_modules ../

git checkout --orphan gh-pages
git rm --cached -r .

mv ../node_modules .
./node_modules/\@angular/cli/bin/ng build --prod --base-href "https://thiagohersan.github.io/auras-photo-app/"
ls -la | grep -v "\(dist\|CNAME\|.git\|publish.sh\|node_modules\)" | xargs rm -rf

cp -r dist/* .
rm -rf dist/

git add .
git commit -m "updates site"
git push origin :gh-pages
git push -u origin gh-pages

mv ./node_modules ../
git rm -rf *
git checkout -f master
git branch -D gh-pages
mv ../node_modules .
