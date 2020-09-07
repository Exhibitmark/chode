#!/bin/bash

infile=$1
mkdir chunks
csplitb --prefix chunk --suffix .zst --number 4 28B52FFD $infile 

for f in ./*.zst
do
    mv $f ./chunks/$f
done
