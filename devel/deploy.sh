#!/bin/bash

set -ex

TARGET=gs://figurl/sortingview-gui-1

yarn build
gsutil -m cp -R ./build/* $TARGET/