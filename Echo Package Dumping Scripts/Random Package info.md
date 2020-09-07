All packages for EVR are zstd archives. Packages contain the actual content while manifests contain the log of everything in the package (minus any info on what each file actually is). Packages are just hundreds of concatenated ZSTD frames. For simplicity of finding files after decompression it makes the most sense to break apart all the frames into their own files with a .zst extension. After running each of those frames through decompression, you'll have to make sense of what file contains what resource. A lot of time, even after decompression they're still concatenated. Mainly around textures. Some easy patterns to search for that EVR uses is "BNK", "DDS", and "RIFF". 

None of this information should be used to do anything negative with the game. RAD made a great game and don't be the garbage person who ruins it with this small amount of info.

For ZSTD Frame splitting

```shell
csplitb --prefix chunk --suffix .zst --number 4 28B52FFD $infile > ./chunks/$infile
```

Pass all ZST frames to 

```shell
for /R %f in (*.zst) do ("zstd.exe" -d "%f" "%f")
```

Most audio is stored in .BNK containers. Use a tool like wwiseutil to dump the wwise formatted audio out of them and then convert them to .ogg with ww2ogg.

For RIFF chunk splitting

```shell
for f in ./*; do csplitb --prefix nut --suffix .wav --number 4 52494646 "$f"; done
```

For DDS chunk searching. All textures are stored as DDS files that are either in their own chunk or are concatenated. Split concatenated chunks at the pattern of DDS which is the start of a new DDS file.

```bash
for f in ./*; do grep -obai "DDS" "$f" > "$f.dump" ; done```