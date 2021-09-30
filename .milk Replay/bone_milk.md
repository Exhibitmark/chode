# .milk Replay Compression Format
This is specific to the bone_read api and doesn't include any of the information from /session

## Frame
A frame is defined as the data returned from 1 request to the /player_bones endpoint. A Milk frame consists of each players encoded data concatenated.
The size of any 1 frame can be calculated by:
322 bytes * <player count>

### Bone Orientation encoding
Each bones orientation is 4 consecutive values from the bone_o parameter.
Milk discards the max absolute value of that tuple while saving that values position.

```axis = {0:x, 1:y, 2:z, 3:w}```

Remaining values are then converted to half-precision floats and stored as bytes with axis being the first value

```axis, orientation data```


### Bone Position encoding
Each bones position is 3 consecutive values from the bone_t parameter.
Milk converts these to half-precision floats
  
  
## License
[MIT](https://choosealicense.com/licenses/mit/)
