#!/bin/bash

for f in ./chunks/*.zst
do
   "./zstd.exe" -d $f $f.decompressed
done
