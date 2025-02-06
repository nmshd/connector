#!/usr/bin/env zsh

# bundle the connector
npx esbuild --format=cjs --target=node20 --platform=node --bundle --outfile=bundle.js src/index.ts

# copy the nodejs executable to the connector
cp $(command -v node) connector

# remove the signature from the connector
codesign --remove-signature connector

# create the sea-prep.blob
node --experimental-sea-config sea-config.json

# inject the sea-prep.blob into the connector
npx postject connector NODE_SEA_BLOB sea-prep.blob --sentinel-fuse NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2 --macho-segment-name NODE_SEA

# codesign the connector
codesign --sign - connector

# run the connector
./connector start
