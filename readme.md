THIS FORMAT SPEC IS NOT COMPLETE AND HAS SOME INCORRECT INFORMATION
# .milk Replay Compression Format
### File Header
Below is the bit flags structure

| Bit number | Field name |
| ---------- | -----------|
| 7-4     | `Currently Unused Bits` |
| 3       | `Tournament Match Flag` |
| 2       | `Match Type, Arena = 0, Combat = 1`  |
| 1       | `Public or Private, Public = 0, Private = 1` |
| 0       | `Winner, 0 = Blue, 1 = Orange` |

## Frames
Compressed Milk data is made of one or more "frames". Frames contain n-chunks where n is the capture rate.
Each frame is independent and supports independent decompression.

### Frame Format
Below is the structure of a single frame.

| `Header` | `Clock in seconds` | `Blue Points` | `Orange Points` | `Last Score` | `Team Stats` | `Player Stats` |
|:--------:|:----------------:|:-------------:|:---------------:|:------------:|:------------:|:--------------:|
| `0xFEFD` |     6-bytes      |     1-byte    |     1-byte      |   n-bytes    |    n-bytes   |     n-bytes    |

## Chunks
Info on chunks will be written later

### Chunk Format
One chunk is one reading of data from the API

| `Header` | `Disc Position` |`Game State`| `Position Data` | `Possession` | `Blocking` | `Stunned` |
|:--------:|:---------------:|:----------:|:---------------:|:------------:|:----------:|:---------:|
| `0xFDFE` |     6-bytes     |   1 byte   |     n-bytes     |    1-byte    |   1-byte   |  1-byte   |

#### Game State
These values all have a length of 1-byte and use bit flags to determine state.
Below is the structure of these bytes
| Bit number | Field name |
| ---------- | -----------|
| 7       | `Post Sudden Death` |
| 6       | `Sudden Death`  |
| 5       | `Post Match`    |
| 4       | `Round Over`    |
| 3       | `Score`         |
| 2       | `Playing`       |
| 1       | `Round Start`   |
| 0       | `Pre-Match`     |

#### Possession, Blocking, Stunned
These values all have a length of 1-byte and use bit flags to determine state.
Below is the structure of these bytes
| Bit number | Field name |
| ---------- | -----------|
| 7-4        | `Orange Players State` |
| 3-0        | `Blue Players State`   |

Example of where Blue team's Player 3 has disc
|  `Flag_Value`  |   `0`   |  `0`  |  `1`  |  `0`  |  `0`  |  `0`  |  `0`  |  `0`  |
| -------------- | ----- | --- | --- | --- | --- | --- | --- | --- |
| `Player Index` |   `0`   |  `1`  |  `2`  |  `3`  |  `4`  |  `5`  |  `6`  |  `7`  |

The result of this would be 0x10

A bit is flagged as 1 if the field is true (ie. Player does have possession, player is stunned,etc)

## License
[MIT](https://choosealicense.com/licenses/mit/)