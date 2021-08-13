/**
 * MILK FORMAT NOTES
 * 
 * .Milk is a lossy format when it comes to positional data.
 * Floating point values are stored as half-precision floats which is a loss of precision but is a large (50%) save in data. 
 * In tests it's generally within 2-4 decimal places of accuracy.
 * This should be a negligible data loss when recording at 60fps =< and using interpolation.
 * Modifications can be made to remove the half-precision conversion process and store the raw floats instead.
 * All non-float values are lossless however.
 * 
*/

const fs = require('fs');
const byteData = require('byte-data');
const struct = require('struct');

let mainBuffer = Buffer.from([])

let example = {
    "disc": {
        "position": [
            4.125,
            4.1870003,
            5.8390002
        ],
        "forward": [
            0.67600006,
            0.19600001,
            0.71000004
        ],
        "left": [
            0.72900003,
            -0.31800002,
            -0.60700005
        ],
        "up": [
            0.10700001,
            0.92800003,
            -0.35800001
        ],
        "velocity": [
            1.4690001,
            -4.4370003,
            0.094000004
        ],
        "bounce_count": 0
    },
    "orange_team_restart_request": 0,
    "sessionid": "4A7C65E9-D602-4BFD-B191-A6C18125AC8A",
    "game_clock_display": "02:07.30",
    "game_status": "playing",
    "sessionip": "107.182.226.157",
    "match_type": "Echo_Arena",
    "map_name": "mpl_arena_a",
    "right_shoulder_pressed2": 0.0,
    "teams": [
        {
            "players": [
                {
                    "name": "WaterBucket-",
                    "rhand": {
                        "pos": [
                            -2.73,
                            -0.38700002,
                            11.309001
                        ],
                        "forward": [
                            0.99700004,
                            0.028000001,
                            0.069000006
                        ],
                        "left": [
                            0.058000002,
                            0.28400001,
                            -0.95700002
                        ],
                        "up": [
                            -0.046000004,
                            0.95900005,
                            0.28100002
                        ]
                    },
                    "playerid": 1,
                    "stats": {
                        "possession_time": 25.433825,
                        "points": 0,
                        "saves": 0,
                        "goals": 0,
                        "stuns": 1,
                        "passes": 3,
                        "catches": 3,
                        "steals": 0,
                        "blocks": 0,
                        "interceptions": 1,
                        "assists": 1,
                        "shots_taken": 1
                    },
                    "userid": 3428244693854421,
                    "number": 69,
                    "level": 50,
                    "stunned": false,
                    "ping": 50,
                    "packetlossratio": 0.0,
                    "invulnerable": false,
                    "possession": false,
                    "holding_left": "none",
                    "head": {
                        "position": [
                            -3.1750002,
                            0.038000003,
                            11.319
                        ],
                        "forward": [
                            0.78800005,
                            0.273,
                            -0.55200005
                        ],
                        "left": [
                            -0.60400003,
                            0.16700001,
                            -0.78000003
                        ],
                        "up": [
                            -0.12,
                            0.94700003,
                            0.296
                        ]
                    },
                    "body": {
                        "position": [
                            -3.1750002,
                            0.038000003,
                            11.319
                        ],
                        "forward": [
                            0.78400004,
                            0.001,
                            -0.62100005
                        ],
                        "left": [
                            -0.62100005,
                            -0.001,
                            -0.78400004
                        ],
                        "up": [
                            -0.0020000001,
                            1.0,
                            0.0
                        ]
                    },
                    "holding_right": "none",
                    "lhand": {
                        "pos": [
                            -3.0510001,
                            -0.24300002,
                            11.085001
                        ],
                        "forward": [
                            0.86800003,
                            0.105,
                            -0.48600003
                        ],
                        "left": [
                            -0.29800001,
                            -0.671,
                            -0.67900002
                        ],
                        "up": [
                            -0.39700001,
                            0.73400003,
                            -0.551
                        ]
                    },
                    "blocking": false,
                    "velocity": [
                        9.7300005,
                        1.5370001,
                        -6.4050002
                    ]
                },
                {
                    "name": "4k-",
                    "rhand": {
                        "pos": [
                            5.8940001,
                            3.7570002,
                            32.487003
                        ],
                        "forward": [
                            0.068000004,
                            -0.56100005,
                            -0.82500005
                        ],
                        "left": [
                            -0.44900003,
                            -0.75600004,
                            0.47700003
                        ],
                        "up": [
                            -0.89100003,
                            0.33800003,
                            -0.303
                        ]
                    },
                    "playerid": 4,
                    "stats": {
                        "possession_time": 15.762239,
                        "points": 0,
                        "saves": 0,
                        "goals": 0,
                        "stuns": 5,
                        "passes": 3,
                        "catches": 2,
                        "steals": 0,
                        "blocks": 1,
                        "interceptions": 0,
                        "assists": 0,
                        "shots_taken": 1
                    },
                    "userid": 3311670572278895,
                    "number": 7,
                    "level": 50,
                    "stunned": false,
                    "ping": 100,
                    "packetlossratio": 0.0,
                    "invulnerable": false,
                    "possession": false,
                    "holding_left": "none",
                    "head": {
                        "position": [
                            5.7620001,
                            4.5770001,
                            32.775002
                        ],
                        "forward": [
                            -0.21700001,
                            -0.12400001,
                            -0.96800005
                        ],
                        "left": [
                            -0.97500002,
                            -0.026000001,
                            0.22200002
                        ],
                        "up": [
                            -0.052000001,
                            0.99200004,
                            -0.115
                        ]
                    },
                    "body": {
                        "position": [
                            5.7620001,
                            4.5770001,
                            32.775002
                        ],
                        "forward": [
                            -0.26900002,
                            0.028000001,
                            -0.96300006
                        ],
                        "left": [
                            -0.96300006,
                            0.0,
                            0.26900002
                        ],
                        "up": [
                            0.0070000002,
                            1.0,
                            0.027000001
                        ]
                    },
                    "holding_right": "none",
                    "lhand": {
                        "pos": [
                            5.5950003,
                            3.6880002,
                            32.917
                        ],
                        "forward": [
                            -0.67700005,
                            -0.72000003,
                            -0.15300001
                        ],
                        "left": [
                            -0.73400003,
                            0.64600003,
                            0.21100001
                        ],
                        "up": [
                            -0.053000003,
                            0.25500003,
                            -0.96600002
                        ]
                    },
                    "blocking": false,
                    "velocity": [
                        1.2570001,
                        0.76300001,
                        -1.1450001
                    ]
                },
                {
                    "name": "Phoenix_non_grata",
                    "rhand": {
                        "pos": [
                            1.0300001,
                            3.9630003,
                            8.2020006
                        ],
                        "forward": [
                            0.30700001,
                            -0.93700004,
                            0.16500001
                        ],
                        "left": [
                            0.32300001,
                            -0.060000002,
                            -0.94500005
                        ],
                        "up": [
                            0.89500004,
                            0.34300002,
                            0.28400001
                        ]
                    },
                    "playerid": 6,
                    "stats": {
                        "possession_time": 33.867298,
                        "points": 2,
                        "saves": 1,
                        "goals": 1,
                        "stuns": 7,
                        "passes": 3,
                        "catches": 3,
                        "steals": 0,
                        "blocks": 1,
                        "interceptions": 2,
                        "assists": 1,
                        "shots_taken": 4
                    },
                    "userid": 3289253514495454,
                    "number": 69,
                    "level": 50,
                    "stunned": false,
                    "ping": 54,
                    "packetlossratio": 0.0,
                    "invulnerable": false,
                    "possession": false,
                    "holding_left": "none",
                    "head": {
                        "position": [
                            0.92600006,
                            4.8360004,
                            7.8610005
                        ],
                        "forward": [
                            0.88400006,
                            -0.37900001,
                            -0.273
                        ],
                        "left": [
                            -0.23100001,
                            0.15400001,
                            -0.96100003
                        ],
                        "up": [
                            0.40600002,
                            0.91200006,
                            0.048
                        ]
                    },
                    "body": {
                        "position": [
                            0.92600006,
                            4.8360004,
                            7.8610005
                        ],
                        "forward": [
                            0.95500004,
                            -0.0020000001,
                            -0.29700002
                        ],
                        "left": [
                            -0.29700002,
                            0.0,
                            -0.95500004
                        ],
                        "up": [
                            0.0020000001,
                            1.0,
                            0.0
                        ]
                    },
                    "holding_right": "none",
                    "lhand": {
                        "pos": [
                            1.312,
                            4.3700004,
                            7.5770001
                        ],
                        "forward": [
                            0.91300005,
                            -0.39600003,
                            0.101
                        ],
                        "left": [
                            0.14300001,
                            0.080000006,
                            -0.98600006
                        ],
                        "up": [
                            0.38300002,
                            0.91500002,
                            0.13000001
                        ]
                    },
                    "blocking": false,
                    "velocity": [
                        5.3720002,
                        1.1950001,
                        -7.1810002
                    ]
                },
                {
                    "name": "Krypt-",
                    "rhand": {
                        "pos": [
                            -4.4370003,
                            -1.151,
                            12.118001
                        ],
                        "forward": [
                            -0.087000005,
                            0.39800003,
                            -0.91300005
                        ],
                        "left": [
                            -0.98300004,
                            -0.18400002,
                            0.013
                        ],
                        "up": [
                            -0.163,
                            0.89900005,
                            0.40700001
                        ]
                    },
                    "playerid": 7,
                    "stats": {
                        "possession_time": 31.657118,
                        "points": 2,
                        "saves": 1,
                        "goals": 1,
                        "stuns": 0,
                        "passes": 3,
                        "catches": 4,
                        "steals": 1,
                        "blocks": 0,
                        "interceptions": 2,
                        "assists": 0,
                        "shots_taken": 2
                    },
                    "userid": 3704378279635498,
                    "number": 99,
                    "level": 50,
                    "stunned": false,
                    "ping": 20,
                    "packetlossratio": 0.0,
                    "invulnerable": false,
                    "possession": false,
                    "holding_left": "none",
                    "head": {
                        "position": [
                            -4.7120004,
                            -0.85200006,
                            12.167001
                        ],
                        "forward": [
                            0.72600001,
                            0.37900001,
                            -0.57300001
                        ],
                        "left": [
                            -0.65300006,
                            0.12100001,
                            -0.74700004
                        ],
                        "up": [
                            -0.21400002,
                            0.91700006,
                            0.33600003
                        ]
                    },
                    "body": {
                        "position": [
                            -4.7120004,
                            -0.85200006,
                            12.167001
                        ],
                        "forward": [
                            0.81400001,
                            0.001,
                            -0.58000004
                        ],
                        "left": [
                            -0.58000004,
                            -0.0020000001,
                            -0.81400001
                        ],
                        "up": [
                            -0.0020000001,
                            1.0,
                            -0.001
                        ]
                    },
                    "holding_right": "none",
                    "lhand": {
                        "pos": [
                            -4.5950003,
                            -1.2410001,
                            11.926001
                        ],
                        "forward": [
                            0.86600006,
                            0.47300002,
                            -0.163
                        ],
                        "left": [
                            -0.18700001,
                            0.003,
                            -0.98200005
                        ],
                        "up": [
                            -0.46400002,
                            0.88100004,
                            0.091000006
                        ]
                    },
                    "blocking": false,
                    "velocity": [
                        7.2800002,
                        0.0,
                        -4.8850002
                    ]
                }
            ],
            "team": "BLUE TEAM",
            "possession": false,
            "stats": {
                "points": 4,
                "possession_time": 106.72048,
                "interceptions": 5,
                "blocks": 2,
                "steals": 1,
                "catches": 12,
                "passes": 12,
                "saves": 2,
                "goals": 2,
                "stuns": 13,
                "assists": 2,
                "shots_taken": 8
            }
        },
        {
            "players": [
                {
                    "name": "Kadecam77",
                    "rhand": {
                        "pos": [
                            -6.8510003,
                            0.257,
                            13.823001
                        ],
                        "forward": [
                            0.97400004,
                            0.050000001,
                            -0.22000001
                        ],
                        "left": [
                            -0.21400002,
                            -0.11400001,
                            -0.97000003
                        ],
                        "up": [
                            -0.074000001,
                            0.99200004,
                            -0.1
                        ]
                    },
                    "playerid": 2,
                    "stats": {
                        "possession_time": 9.7380381,
                        "points": 0,
                        "saves": 0,
                        "goals": 0,
                        "stuns": 0,
                        "passes": 0,
                        "catches": 0,
                        "steals": 1,
                        "blocks": 0,
                        "interceptions": 0,
                        "assists": 0,
                        "shots_taken": 0
                    },
                    "userid": 3358576367601602,
                    "number": 50,
                    "level": 50,
                    "stunned": false,
                    "ping": 69,
                    "packetlossratio": 0.0,
                    "invulnerable": false,
                    "possession": true,
                    "holding_left": "none",
                    "head": {
                        "position": [
                            -6.9860005,
                            0.75000006,
                            13.696001
                        ],
                        "forward": [
                            0.91900003,
                            0.116,
                            -0.37600002
                        ],
                        "left": [
                            -0.38000003,
                            0.014,
                            -0.92500007
                        ],
                        "up": [
                            -0.101,
                            0.99300003,
                            0.057000004
                        ]
                    },
                    "body": {
                        "position": [
                            -6.9860005,
                            0.75000006,
                            13.696001
                        ],
                        "forward": [
                            0.92100006,
                            0.0,
                            -0.38900003
                        ],
                        "left": [
                            -0.38900003,
                            -0.0020000001,
                            -0.92100006
                        ],
                        "up": [
                            -0.001,
                            1.0,
                            -0.0020000001
                        ]
                    },
                    "holding_right": "none",
                    "lhand": {
                        "pos": [
                            -6.6480002,
                            0.25500003,
                            13.758
                        ],
                        "forward": [
                            0.85500002,
                            -0.49600002,
                            0.148
                        ],
                        "left": [
                            -0.058000002,
                            -0.37600002,
                            -0.92500007
                        ],
                        "up": [
                            0.51500005,
                            0.78200006,
                            -0.35100001
                        ]
                    },
                    "blocking": false,
                    "velocity": [
                        4.349,
                        0.62900001,
                        -2.3260002
                    ]
                },
                {
                    "name": "GrimKid",
                    "rhand": {
                        "pos": [
                            -2.45,
                            1.659,
                            16.849001
                        ],
                        "forward": [
                            0.97100008,
                            0.23,
                            -0.061000004
                        ],
                        "left": [
                            0.010000001,
                            -0.29300001,
                            -0.95600003
                        ],
                        "up": [
                            -0.23800001,
                            0.92800003,
                            -0.287
                        ]
                    },
                    "playerid": 3,
                    "stats": {
                        "possession_time": 8.6674585,
                        "points": 0,
                        "saves": 1,
                        "goals": 0,
                        "stuns": 4,
                        "passes": 1,
                        "catches": 0,
                        "steals": 0,
                        "blocks": 0,
                        "interceptions": 0,
                        "assists": 0,
                        "shots_taken": 1
                    },
                    "userid": 2846841775428747,
                    "number": 0,
                    "level": 50,
                    "stunned": true,
                    "ping": 65,
                    "packetlossratio": 0.0,
                    "invulnerable": false,
                    "possession": false,
                    "holding_left": "none",
                    "head": {
                        "position": [
                            -2.7090001,
                            2.118,
                            16.818001
                        ],
                        "forward": [
                            0.46400002,
                            -0.027000001,
                            -0.88500005
                        ],
                        "left": [
                            -0.88300002,
                            -0.092000008,
                            -0.46000001
                        ],
                        "up": [
                            -0.069000006,
                            0.99500006,
                            -0.066
                        ]
                    },
                    "body": {
                        "position": [
                            -2.7090001,
                            2.118,
                            16.818001
                        ],
                        "forward": [
                            0.45500001,
                            0.0,
                            -0.89100003
                        ],
                        "left": [
                            -0.89100003,
                            -0.0020000001,
                            -0.45500001
                        ],
                        "up": [
                            -0.0020000001,
                            1.0,
                            -0.001
                        ]
                    },
                    "holding_right": "none",
                    "lhand": {
                        "pos": [
                            -2.6580002,
                            1.5610001,
                            16.677
                        ],
                        "forward": [
                            0.55600005,
                            -0.70900005,
                            -0.43400002
                        ],
                        "left": [
                            -0.81600004,
                            -0.36800003,
                            -0.44500002
                        ],
                        "up": [
                            0.156,
                            0.60200006,
                            -0.78300005
                        ]
                    },
                    "blocking": false,
                    "velocity": [
                        -0.012,
                        0.025,
                        -0.036000002
                    ]
                },
                {
                    "name": "VielkaRR",
                    "rhand": {
                        "pos": [
                            -2.677,
                            0.48500001,
                            24.999001
                        ],
                        "forward": [
                            0.71300006,
                            -0.55700004,
                            -0.42700002
                        ],
                        "left": [
                            -0.25500003,
                            0.36100003,
                            -0.89700001
                        ],
                        "up": [
                            0.65400004,
                            0.74800003,
                            0.115
                        ]
                    },
                    "playerid": 5,
                    "stats": {
                        "possession_time": 13.318789,
                        "points": 0,
                        "saves": 1,
                        "goals": 0,
                        "stuns": 8,
                        "passes": 1,
                        "catches": 1,
                        "steals": 0,
                        "blocks": 0,
                        "interceptions": 1,
                        "assists": 1,
                        "shots_taken": 1
                    },
                    "userid": 3893689154016159,
                    "number": 0,
                    "level": 50,
                    "stunned": false,
                    "ping": 124,
                    "packetlossratio": 0.0,
                    "invulnerable": true,
                    "possession": false,
                    "holding_left": "none",
                    "head": {
                        "position": [
                            -3.0570002,
                            1.1060001,
                            25.012001
                        ],
                        "forward": [
                            0.16500001,
                            0.049000002,
                            -0.98500007
                        ],
                        "left": [
                            -0.98600006,
                            0.014,
                            -0.16500001
                        ],
                        "up": [
                            0.0060000001,
                            0.99900007,
                            0.050000001
                        ]
                    },
                    "body": {
                        "position": [
                            -3.0570002,
                            1.1060001,
                            25.012001
                        ],
                        "forward": [
                            0.28100002,
                            -0.0020000001,
                            -0.96000004
                        ],
                        "left": [
                            -0.96000004,
                            -0.001,
                            -0.28100002
                        ],
                        "up": [
                            0.0,
                            1.0,
                            -0.0020000001
                        ]
                    },
                    "holding_right": "none",
                    "lhand": {
                        "pos": [
                            -3.0490003,
                            0.51900005,
                            24.795002
                        ],
                        "forward": [
                            0.97600007,
                            -0.1,
                            -0.193
                        ],
                        "left": [
                            0.035,
                            0.94900006,
                            -0.31400001
                        ],
                        "up": [
                            0.215,
                            0.30000001,
                            0.93000007
                        ]
                    },
                    "blocking": false,
                    "velocity": [
                        0.34600002,
                        -0.053000003,
                        0.12100001
                    ]
                },
                {
                    "name": "Soapy_",
                    "rhand": {
                        "pos": [
                            -6.1770005,
                            1.373,
                            19.408001
                        ],
                        "forward": [
                            0.98200005,
                            -0.13700001,
                            0.13000001
                        ],
                        "left": [
                            0.147,
                            0.11700001,
                            -0.98200005
                        ],
                        "up": [
                            0.119,
                            0.98400003,
                            0.13500001
                        ]
                    },
                    "playerid": 11,
                    "stats": {
                        "possession_time": 8.6561575,
                        "points": 3,
                        "saves": 0,
                        "goals": 1,
                        "stuns": 1,
                        "passes": 0,
                        "catches": 1,
                        "steals": 0,
                        "blocks": 0,
                        "interceptions": 1,
                        "assists": 0,
                        "shots_taken": 1
                    },
                    "userid": 2120870138037970,
                    "number": 69,
                    "level": 50,
                    "stunned": false,
                    "ping": 49,
                    "packetlossratio": 0.0,
                    "invulnerable": false,
                    "possession": false,
                    "holding_left": "none",
                    "head": {
                        "position": [
                            -6.5120001,
                            1.8210001,
                            19.333
                        ],
                        "forward": [
                            0.77200001,
                            -0.049000002,
                            -0.634
                        ],
                        "left": [
                            -0.63500005,
                            -0.029000001,
                            -0.77200001
                        ],
                        "up": [
                            0.020000001,
                            0.99800003,
                            -0.053000003
                        ]
                    },
                    "body": {
                        "position": [
                            -6.5120001,
                            1.8210001,
                            19.333
                        ],
                        "forward": [
                            0.76200002,
                            -0.032000002,
                            -0.64700001
                        ],
                        "left": [
                            -0.648,
                            -0.080000006,
                            -0.75800002
                        ],
                        "up": [
                            -0.027000001,
                            0.99600005,
                            -0.081
                        ]
                    },
                    "holding_right": "none",
                    "lhand": {
                        "pos": [
                            -6.4560003,
                            1.309,
                            19.268002
                        ],
                        "forward": [
                            0.68000001,
                            0.24800001,
                            -0.69000006
                        ],
                        "left": [
                            -0.72200006,
                            0.064000003,
                            -0.68900001
                        ],
                        "up": [
                            -0.127,
                            0.96700007,
                            0.22200002
                        ]
                    },
                    "blocking": false,
                    "velocity": [
                        4.3540001,
                        -0.97700006,
                        -2.158
                    ]
                }
            ],
            "team": "ORANGE TEAM",
            "possession": true,
            "stats": {
                "points": 3,
                "possession_time": 40.380444,
                "interceptions": 2,
                "blocks": 0,
                "steals": 1,
                "catches": 2,
                "passes": 2,
                "saves": 2,
                "goals": 1,
                "stuns": 13,
                "assists": 1,
                "shots_taken": 3
            }
        },
        {
            "players": [
                {
                    "name": "Exhibit",
                    "rhand": {
                        "pos": [
                            -0.25,
                            0.0,
                            -9.6200008
                        ],
                        "forward": [
                            0.0,
                            0.0,
                            1.0
                        ],
                        "left": [
                            1.0,
                            0.0,
                            0.0
                        ],
                        "up": [
                            0.0,
                            1.0,
                            0.0
                        ]
                    },
                    "playerid": 0,
                    "stats": {
                        "possession_time": 0.0,
                        "points": 0,
                        "saves": 0,
                        "goals": 0,
                        "stuns": 0,
                        "passes": 0,
                        "catches": 0,
                        "steals": 0,
                        "blocks": 0,
                        "interceptions": 0,
                        "assists": 0,
                        "shots_taken": 0
                    },
                    "userid": 1740295146011360,
                    "number": 22,
                    "level": 50,
                    "stunned": false,
                    "ping": 51,
                    "packetlossratio": 0.0,
                    "invulnerable": false,
                    "possession": false,
                    "holding_left": "none",
                    "head": {
                        "position": [
                            0.0,
                            0.0,
                            -10.0
                        ],
                        "forward": [
                            0.0,
                            0.0,
                            1.0
                        ],
                        "left": [
                            1.0,
                            0.0,
                            0.0
                        ],
                        "up": [
                            0.0,
                            1.0,
                            0.0
                        ]
                    },
                    "body": {
                        "position": [
                            0.0,
                            0.0,
                            -10.0
                        ],
                        "forward": [
                            0.0,
                            0.0,
                            1.0
                        ],
                        "left": [
                            1.0,
                            0.0,
                            0.0
                        ],
                        "up": [
                            0.0,
                            1.0,
                            0.0
                        ]
                    },
                    "holding_right": "none",
                    "lhand": {
                        "pos": [
                            0.25,
                            -0.25,
                            -10.0
                        ],
                        "forward": [
                            0.0,
                            0.0,
                            1.0
                        ],
                        "left": [
                            1.0,
                            0.0,
                            0.0
                        ],
                        "up": [
                            0.0,
                            1.0,
                            0.0
                        ]
                    },
                    "blocking": false,
                    "velocity": [
                        0.0,
                        0.0,
                        0.0
                    ]
                },
                {
                    "name": "6475616c67616d650a",
                    "rhand": {
                        "pos": [
                            -0.48600003,
                            2.039,
                            -14.596001
                        ],
                        "forward": [
                            -0.24200001,
                            -0.95800006,
                            -0.156
                        ],
                        "left": [
                            0.90500003,
                            -0.28,
                            0.32000002
                        ],
                        "up": [
                            -0.35000002,
                            -0.064000003,
                            0.93400002
                        ]
                    },
                    "playerid": 8,
                    "stats": {
                        "possession_time": 0.0,
                        "points": 0,
                        "saves": 0,
                        "goals": 0,
                        "stuns": 0,
                        "passes": 0,
                        "catches": 0,
                        "steals": 0,
                        "blocks": 0,
                        "interceptions": 0,
                        "assists": 0,
                        "shots_taken": 0
                    },
                    "userid": 2410975075615485,
                    "number": 1,
                    "level": 3,
                    "stunned": false,
                    "ping": 100,
                    "packetlossratio": 0.0,
                    "invulnerable": false,
                    "possession": false,
                    "holding_left": "none",
                    "head": {
                        "position": [
                            -0.34200001,
                            2.8390002,
                            -14.288001
                        ],
                        "forward": [
                            -0.34300002,
                            -0.68200004,
                            0.64600003
                        ],
                        "left": [
                            0.89600003,
                            -0.030000001,
                            0.44400004
                        ],
                        "up": [
                            -0.28300002,
                            0.73100001,
                            0.62100005
                        ]
                    },
                    "body": {
                        "position": [
                            -0.34200001,
                            2.8390002,
                            -14.288001
                        ],
                        "forward": [
                            -0.42300001,
                            0.0020000001,
                            0.90600002
                        ],
                        "left": [
                            0.90600002,
                            -0.001,
                            0.42300001
                        ],
                        "up": [
                            0.001,
                            1.0,
                            -0.001
                        ]
                    },
                    "holding_right": "none",
                    "lhand": {
                        "pos": [
                            -0.324,
                            2.723,
                            -14.183001
                        ],
                        "forward": [
                            0.55700004,
                            0.77600002,
                            0.29500002
                        ],
                        "left": [
                            0.65900004,
                            -0.19800001,
                            -0.72600001
                        ],
                        "up": [
                            -0.505,
                            0.59900004,
                            -0.62200004
                        ]
                    },
                    "blocking": false,
                    "velocity": [
                        -0.21200001,
                        0.55600005,
                        4.7140002
                    ]
                },
                {
                    "name": "Dualgame",
                    "rhand": {
                        "pos": [
                            0.0,
                            0.0,
                            0.0
                        ],
                        "forward": [
                            0.0,
                            0.0,
                            1.0
                        ],
                        "left": [
                            1.0,
                            0.0,
                            0.0
                        ],
                        "up": [
                            0.0,
                            1.0,
                            0.0
                        ]
                    },
                    "playerid": 9,
                    "stats": {
                        "possession_time": 0.0,
                        "points": 0,
                        "saves": 0,
                        "goals": 0,
                        "stuns": 0,
                        "passes": 0,
                        "catches": 0,
                        "steals": 0,
                        "blocks": 0,
                        "interceptions": 0,
                        "assists": 0,
                        "shots_taken": 0
                    },
                    "userid": 1692359857475604,
                    "number": 36,
                    "level": 50,
                    "stunned": false,
                    "ping": 91,
                    "packetlossratio": 0.0,
                    "invulnerable": false,
                    "possession": false,
                    "holding_left": "none",
                    "head": {
                        "position": [
                            0.0,
                            0.0,
                            0.0
                        ],
                        "forward": [
                            0.0,
                            0.0,
                            1.0
                        ],
                        "left": [
                            1.0,
                            0.0,
                            0.0
                        ],
                        "up": [
                            0.0,
                            1.0,
                            0.0
                        ]
                    },
                    "body": {
                        "position": [
                            0.0,
                            0.0,
                            0.0
                        ],
                        "forward": [
                            0.0,
                            0.0,
                            1.0
                        ],
                        "left": [
                            1.0,
                            0.0,
                            0.0
                        ],
                        "up": [
                            0.0,
                            1.0,
                            0.0
                        ]
                    },
                    "holding_right": "none",
                    "lhand": {
                        "pos": [
                            0.0,
                            0.0,
                            0.0
                        ],
                        "forward": [
                            0.0,
                            0.0,
                            1.0
                        ],
                        "left": [
                            1.0,
                            0.0,
                            0.0
                        ],
                        "up": [
                            0.0,
                            1.0,
                            0.0
                        ]
                    },
                    "blocking": false,
                    "velocity": [
                        0.0,
                        0.0,
                        0.0
                    ]
                },
                {
                    "name": "www.ignitevr.gg",
                    "rhand": {
                        "pos": [
                            -0.93700004,
                            2.0630002,
                            38.559002
                        ],
                        "forward": [
                            0.65900004,
                            -0.71000004,
                            -0.24600001
                        ],
                        "left": [
                            -0.75100005,
                            -0.61300004,
                            -0.24400002
                        ],
                        "up": [
                            0.023000002,
                            0.34600002,
                            -0.93800002
                        ]
                    },
                    "playerid": 10,
                    "stats": {
                        "possession_time": 0.0,
                        "points": 0,
                        "saves": 0,
                        "goals": 0,
                        "stuns": 0,
                        "passes": 0,
                        "catches": 0,
                        "steals": 0,
                        "blocks": 0,
                        "interceptions": 0,
                        "assists": 0,
                        "shots_taken": 0
                    },
                    "userid": 2540488886071982,
                    "number": 0,
                    "level": 1,
                    "stunned": false,
                    "ping": 31,
                    "packetlossratio": 0.0,
                    "invulnerable": false,
                    "possession": false,
                    "holding_left": "none",
                    "head": {
                        "position": [
                            -1.1370001,
                            2.937,
                            38.366001
                        ],
                        "forward": [
                            0.74700004,
                            -0.164,
                            -0.64400005
                        ],
                        "left": [
                            -0.65600002,
                            -0.022000002,
                            -0.75500005
                        ],
                        "up": [
                            0.11000001,
                            0.98600006,
                            -0.12400001
                        ]
                    },
                    "body": {
                        "position": [
                            -1.1370001,
                            2.937,
                            38.366001
                        ],
                        "forward": [
                            0.66300005,
                            -0.001,
                            -0.74900001
                        ],
                        "left": [
                            -0.74900001,
                            -0.0020000001,
                            -0.66300005
                        ],
                        "up": [
                            -0.001,
                            1.0,
                            -0.0020000001
                        ]
                    },
                    "holding_right": "none",
                    "lhand": {
                        "pos": [
                            -1.11,
                            2.0830002,
                            38.397003
                        ],
                        "forward": [
                            0.73800004,
                            -0.66500002,
                            0.112
                        ],
                        "left": [
                            0.21400002,
                            0.073000006,
                            -0.97400004
                        ],
                        "up": [
                            0.64000005,
                            0.74300003,
                            0.19600001
                        ]
                    },
                    "blocking": false,
                    "velocity": [
                        0.21200001,
                        0.0,
                        -1.2180001
                    ]
                },
                {
                    "name": "pena_miguel",
                    "rhand": {
                        "pos": [
                            0.0,
                            0.0,
                            0.0
                        ],
                        "forward": [
                            0.0,
                            0.0,
                            1.0
                        ],
                        "left": [
                            1.0,
                            0.0,
                            0.0
                        ],
                        "up": [
                            0.0,
                            1.0,
                            0.0
                        ]
                    },
                    "playerid": 12,
                    "stats": {
                        "possession_time": 0.0,
                        "points": 0,
                        "saves": 0,
                        "goals": 0,
                        "stuns": 0,
                        "passes": 0,
                        "catches": 0,
                        "steals": 0,
                        "blocks": 0,
                        "interceptions": 0,
                        "assists": 0,
                        "shots_taken": 0
                    },
                    "userid": 3293796410732799,
                    "number": 84,
                    "level": 50,
                    "stunned": false,
                    "ping": 512,
                    "packetlossratio": 0.0,
                    "invulnerable": false,
                    "possession": false,
                    "holding_left": "none",
                    "head": {
                        "position": [
                            0.0,
                            0.0,
                            0.0
                        ],
                        "forward": [
                            0.0,
                            0.0,
                            1.0
                        ],
                        "left": [
                            1.0,
                            0.0,
                            0.0
                        ],
                        "up": [
                            0.0,
                            1.0,
                            0.0
                        ]
                    },
                    "body": {
                        "position": [
                            0.0,
                            0.0,
                            0.0
                        ],
                        "forward": [
                            0.0,
                            0.0,
                            1.0
                        ],
                        "left": [
                            1.0,
                            0.0,
                            0.0
                        ],
                        "up": [
                            0.0,
                            1.0,
                            0.0
                        ]
                    },
                    "holding_right": "none",
                    "lhand": {
                        "pos": [
                            0.0,
                            0.0,
                            0.0
                        ],
                        "forward": [
                            0.0,
                            0.0,
                            1.0
                        ],
                        "left": [
                            1.0,
                            0.0,
                            0.0
                        ],
                        "up": [
                            0.0,
                            1.0,
                            0.0
                        ]
                    },
                    "blocking": false,
                    "velocity": [
                        0.0,
                        0.0,
                        0.0
                    ]
                }
            ],
            "team": "SPECTATORS",
            "possession": false,
            "stats": {
                "points": 0,
                "possession_time": 0.0,
                "interceptions": 0,
                "blocks": 0,
                "steals": 0,
                "catches": 0,
                "passes": 0,
                "saves": 0,
                "goals": 0,
                "stuns": 0,
                "assists": 0,
                "shots_taken": 0
            }
        }
    ],
    "blue_round_score": 0,
    "orange_points": 3,
    "player": {
        "vr_left": [
            -0.61200005,
            -0.0020000001,
            -0.79100001
        ],
        "vr_position": [
            -9.6410007,
            -0.41200003,
            16.075001
        ],
        "vr_forward": [
            0.78900003,
            0.062000003,
            -0.611
        ],
        "vr_up": [
            -0.050000001,
            0.99800003,
            0.037
        ]
    },
    "private_match": false,
    "blue_team_restart_request": 0,
    "tournament_match": false,
    "orange_round_score": 0,
    "total_round_count": 1,
    "left_shoulder_pressed2": 0.0,
    "left_shoulder_pressed": 0.0,
    "pause": {
        "paused_state": "unpaused",
        "unpaused_team": "none",
        "paused_requested_team": "none",
        "unpaused_timer": 0.0,
        "paused_timer": 0.0
    },
    "right_shoulder_pressed": 0.0,
    "blue_points": 4,
    "last_throw": {
        "arm_speed": 0.0,
        "total_speed": 0.0,
        "off_axis_spin_deg": 0.0,
        "wrist_throw_penalty": 0.0,
        "rot_per_sec": 0.0,
        "pot_speed_from_rot": 0.0,
        "speed_from_arm": 0.0,
        "speed_from_movement": 0.0,
        "speed_from_wrist": 0.0,
        "wrist_align_to_throw_deg": 0.0,
        "throw_align_to_movement_deg": 0.0,
        "off_axis_penalty": 0.0,
        "throw_move_penalty": 0.0
    },
    "client_name": "Exhibit",
    "game_clock": 127.30321,
    "possession": [
        1,
        0
    ],
    "last_score": {
        "disc_speed": 16.850527,
        "team": "orange",
        "goal_type": "LONG SHOT",
        "point_amount": 3,
        "distance_thrown": 16.670603,
        "person_scored": "Soapy_",
        "assist_scored": "VielkaRR"
    }
}

if (process.argv.length < 4) {
  /*  console.error(` 
    ///////////////////////////////////////////
    //                                       //
    //        Echo Replay Compressor         //
    //                                       //
    ///////////////////////////////////////////

    Usage
    node compressor.js <input-replay> <output-file>
    `);
    process.exit(1); */
}
const file = {
    "name":''
}

const game_state = {
    "pre_match": 0,
    "round_start": 1,
    "playing": 2,
    "score": 3,
    "round_over": 4,
    "post_match": 5,
    "pre_sudden_death": 6,
    "sudden_death": 7,
    "post_sudden_death": 8
}

const match_type = {
    "Echo_Arena": false,
    "Echo_Combat": true
}

const Utils = {
    setMask(n, bitIndex, val) {
        //Bits are set with the leftmost bit being the last index
        if(val){
            const bitMask = 1 << bitIndex;
            return n | bitMask;
        }
        return n
    },
    returnHalfFloat(f) {
        return Buffer.from(byteData.pack(f, {bits: 16, fp: true}));
    }
};

buildFileHeader(example)
buildFrameHeader(example)
createChunk(example)
writeFile(`${file.name}.nut`,mainBuffer)

function buildFileHeader(json){
    file.name = json.sessionid
    const author = Buffer.from(json.client_name+'\0')
    const players_header = players(json)
    let match_byte = 0
    match_byte = Utils.setMask(match_byte, 8, json.private_match)
    match_byte = Utils.setMask(match_byte, 7, match_type[json.match_type])
    match_byte = Utils.setMask(match_byte, 6, json.tournament_match)

    let buffer_array = [mainBuffer,author,players_header,Buffer.alloc(1,match_byte)]
    let array_length = mainBuffer.length + author.length + players_header.length + 1
    mainBuffer = Buffer.concat(buffer_array, array_length) 
}

/** 
 * players(json)
 * -----------------
 * Only grabs Orange and Blue team. Could be done with just a for loop but I like smol lines.
 * [0xFF, team index] is used as a magic to denote each team section.
 * Each player contains a fixed 12 bytes of [playerid, player number, level, userid]
 * Then a null terminated string of their name
 */

function players(json){
    let teams = Buffer.from([])
    json.teams.forEach(function(e,i){
        if(i !== 2){
            let team = Buffer.from([255,i]);
            e.players.map(function(p) {
                const player = struct()
                    .word8('playerid')
                    .word16Ule('number')
                    .word8('level')
                    .word64Ule('userid')
                    .chars('name',p.name.length)
    
                player.allocate();
                Object.keys(player.fields).forEach(function(e){
                    player.set(e,p[e])
                });
                team = Buffer.concat([team, player.buffer()], team.length + player.buffer().length+1)
            });
            teams = Buffer.concat([teams,team],teams.length+team.length)
        }
    });
    return teams
}
/**
 * floatToByte(array)
 * --------------------------
 * Takes in an array of floats (4-bytes each) and returns an array of half-precision floats
 * 
*/
function floatToByte(array){
    let buffer = [];
    array.forEach(function(float){
       buffer = buffer.concat(byteData.pack(float, {bits: 16, fp: true}))
    });
    return Buffer.from(buffer)
}

/**
 * buildFrameHeader(json)
 * --------------------------
 * Builds the header for each frame.
 * Has a magic of 0xFEFD
 * game_clock_display is converted to 3 bytes, one byte for each value separated by the ":" or "." delimeter
 * Points are stored as 1 byte per team. [blue_points, orange_points]
 * Stat frames are collected and saved for each team and player
 * Everything is then added to the main buffer
*/

function buildFrameHeader(json){
    let bytes = Buffer.from([254,253])
    let time = stats_mapping("game_clock_display")(json.game_clock_display)
    let points = Buffer.from([json.blue_points,json.orange_points])
    bytes = Buffer.concat([bytes, time, points], bytes.length + time.length + points.length)

    json.teams.forEach(function(e,i){
        if(i !== 2){
            let team_stat_frame = collectStatFrame(e.stats)
            bytes = Buffer.concat([bytes, team_stat_frame], bytes.length + team_stat_frame.length)
            e.players.map(function(p) {
                let stat_frame = collectStatFrame(p.stats)
                bytes = Buffer.concat([bytes, stat_frame], bytes.length + stat_frame.length)
            });
        }
    });
    let buffer_array = [mainBuffer,bytes]
    let array_length = mainBuffer.length + bytes.length
    mainBuffer = Buffer.concat(buffer_array, array_length) 
}


//Chunks contain everything
function createChunk(json){
    let bytes = Buffer.from([253,254])
    let states = Buffer.from([0,0,0])
    let disc = floatToByte(json.disc.position)
    let state = Buffer.from([game_state[json.game_status]])
    bytes = Buffer.concat([bytes, disc, state], bytes.length + disc.length + state.length)

    Object.keys(json.teams).forEach(function(key,i){
        json.teams[key].players.map(function(p,index) {
            let types = [p.head.position,p.body.position ,p.rhand.pos,p.lhand.pos]
            types.forEach(function(type){
                let x = floatToByte(type)
                bytes = Buffer.concat([bytes, x], bytes.length + x.length)
            });
            states[0] = Utils.setMask(states[0],index, p.possession)
            states[1] = Utils.setMask(states[1],index, p.blocking)
            states[2] = Utils.setMask(states[2],index, p.stunned)
        });
    });

    let buffer_array = [mainBuffer,bytes]
    let array_length = mainBuffer.length + bytes.length
    mainBuffer = Buffer.concat(buffer_array, array_length) 
    return
}

function stats_mapping(type){
    let fields = {
        "possession_time": (float) => {
            return Utils.returnHalfFloat(float)
        },
        "game_clock_display": (str) => {
            str = str.replace('.',':').split(':')
            return Buffer.from(str)
        },
        "default":(int) =>{
            return Buffer.alloc(1,int)
        }
    }
    return (fields[type] || fields['default'])
}

/**
 * collectStatFrame(json)
 * -------------------------
 * This loops over all the stat values and finds the action to do with them in stats_mapping()
 * This was done to be able to loop and use one action without needing if's to check for specific things like possession_time
 * It's effectively the same as a switch statement but there's too much redundency required in switch syntax so I prefer the object approach
*/

function collectStatFrame(json){
    let stat_frame = Buffer.from([]);
    Object.keys(json).forEach(function(key){
        let value = json[key];
        let out_val = stats_mapping(key)(value)
        stat_frame = Buffer.concat([stat_frame, out_val],stat_frame.length + out_val.length)
    });
    return stat_frame
}

module.exports = { 
    startCompress(out, rate) {
        fs.readFile("./temp", 'utf8', function(err, contents) {
            let file = JSON.parse(contents);
            buildFileHeader(file.frames[0])
            let allFrames = file.frames
            let iterations = allFrames.length/rate

            for(var i=0; i < iterations;i++){
                let arr = allFrames.slice(0, rate);
                allFrames = allFrames.slice(rate, allFrames.length);
                if(i == iterations.length-2){
                    console.log(allFrames)
                }
                buildFrameHeader(arr[0])
                arr.forEach(function(frame){
                    createChunk(frame)
                });
            }
            writeStream.end()
            writeStream.on('finish', () => {
                fs.unlinkSync('temp')
            });
        });
    }
}


function writeFile(name,buffer){
    fs.writeFile(name, buffer,function(err) {
        console.log(`Wrote file`)
    });
}
