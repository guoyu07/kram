#!/bin/bash

echo "======================== build start ========================"

rm -rf output
mkdir output

echo "======================== npm install ========================"
npm install
cd client
npm install

echo "======================== build VUE ========================"
npm run build


echo "======================== zip ========================"
cd ..
zip output.zip -r ./* -x "logs/*" -x "outputProjects/*" -x "client/*" -x "dev.sh" -x "install.sh"

echo "======================== build complete ========================"
