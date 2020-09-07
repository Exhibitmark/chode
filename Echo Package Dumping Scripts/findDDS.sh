#!/bin/bash

mkdir ./decompressed/temp
for f in ./decompressed/*
do
  grep -oa -L -Z -r "DX10" $f | xargs -0 -I{} mv {} ./decompressed/temp
done
