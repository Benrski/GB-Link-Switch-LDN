// The GB-Link Team cards from gblink-wondercards, built for the Switch's
// FireRed and LeafGreen (revision 10) by cards/build.mjs, which writes the
// payloads: FireRed's, and LeafGreen's as the bytes that differ from it. The
// Master Ball is a plain script for both games.

import { decodeBase64, romPayloads } from './payloads.js';

export const TEAM_EVENTS = [
    {
        id: 'custom-speed-0-5',
        label: 'Slow Down 0.5× (Press R)',
        description: 'Press R and the whole game runs at half speed; press R again to play normally. R works anywhere, and the speed stays as you set it until you press it again. In FireRed and LeafGreen, L still opens the Help menu. It lasts until the game is closed or reset; talk to the deliveryman again after a reset. Original speed-up event by Decryptu.',
        payloads: {
            ...romPayloads(decodeBase64(`6gNlAAIAAAAAAMK7xsAAzcq/v77////////////////////////////////////////MAOjp5uLn
AN3oAOPiANXi2ADj2tqr////////////////////////uwDn5NnX3dXgAOjm3dffAN3nAOvV3ejd
4tv//////////////////97p5+gA2uPmAO3j6av////////////////////////////////////Q
3efd6ADo3NkA2Nng3erZ5u3h1eIA4+IA6NzZ////////////////o+LYANrg4+PmAOPaANUAysnF
v8fJyAC9v8jOv8yt/////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIUrsFVAAACB+vAAAIRbsFVAAACB+8AAAICrsFVAAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAARyMVEAADjwC9XgAACGZtaGwCvZ0AAAhmbWhsAsrm2efnAMwA6OMA5ODV7QDV6ADc1eDaAOfk
2dnYq/7K5tnn5wDMANXb1d3iAOjjAOTg1e0A4uPm4dXg4O2t/87c3ecA293a6ADY49nn4rToAOvj
5t8A693o3P7o3N3nAOrZ5ufd4+IA49oA6NzZANvV4dmt/wBwtQDwHvgeiAAgGIAQTRSkEEgEOALU
IVgpUPrnDkgBaCofSxubCgHREWgA4BFgACkD0ApLGWBpHAFgAPAC+B6AcL2CI5sABCISBpsYcEfA
RgD8AwIMAgAA4CcAA7j9AwIwtXNIBIh0SAFoATEBYHpIACgB0AEhAXAA8H34APCI+GVLAPB3+AEg
BEIn0WxMZKUA8Cf4a0xkpQDwI/hsSAB4ACgb0GVIICHCfgAqB9CCeQN6mkID0cJ5Q3qaQg7QJDAB
OfHRXEhBaAExQWBZTAAsBNBSSwDwTvgBPPjnMLwBvABHALVaSAB4AChB0AAsP9BVSEFoamiRQjrR
AWgqaJFCNtFSScmIyQsy0QDwfvhTSQApENBIStJoUwAbGItCCtlFSAFpATEBYdEIATFSGgDVACLC
YBzgAbRDSAAhwYUBhitoAPAX+EBIQWhraJlCDtEA8BD4APBZ+AK8QBoA1eQwNUrQYJFoATGRYAE8
vucBsAG8AEcYRzZKNkgAiMBDwAXAD1F4UHCIQxF4QUARcHBHELUpSEFpACkG0CtKEWCBaVFgACFB
YYFhLkkAKSnQKEgCeAAqJdAgSMJpATKKQgDTACLCYQAqHNEfSxxoFEqUQgPRXGgTSpRCB9AcaBJK
lEIP0VxoEUqUQgvRGErSiNILB9ERSBxoRGFcaIRhGkwcYFxgELwBvABHcEcVSACIoDgA1eQwcEfA
RjUHAAhpLQAI7ZwFCG2dBQiBWwEInUgBCJwjAAMAAAAAYP8DAjQAAgIAAAAAAAAAAIAjAAO0egMC
gP8DAjABAARx8QMC5AAAAAYAAAQCAAAAqf0DAg==`), {
                'BPGE 1.10': decodeBase64(`XAEBRw==`),
            }),
        },
    },
    {
        id: 'custom-speed-0-75',
        label: 'Slow Down 0.75× (Press R)',
        description: 'Press R and the whole game runs at three-quarter speed; press R again to play normally. R works anywhere, and the speed stays as you set it until you press it again. In FireRed and LeafGreen, L still opens the Help menu. It lasts until the game is closed or reset; talk to the deliveryman again after a reset. Original speed-up event by Decryptu.',
        payloads: {
            ...romPayloads(decodeBase64(`6wNlAAMAAAAAAKGtqKa5AM3Kv7++///////////////////////////////////////MAOjp5uLn
AN3oAOPiANXi2ADj2tqr////////////////////////uwDn5NnX3dXgAOjm3dffAN3nAOvV3ejd
4tv//////////////////97p5+gA2uPmAO3j6av////////////////////////////////////Q
3efd6ADo3NkA2Nng3erZ5u3h1eIA4+IA6NzZ////////////////o+LYANrg4+PmAOPaANUAysnF
v8fJyAC9v8jOv8yt/////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIUrsFVAAACB+vAAAIRbsFVAAACB+8AAAICrsFVAAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAARyMVEAADkwC9XgAACGZtaGwCvZ8AAAhmbWhsAsrm2efnAMwA6OMA5ODV7QDVAODd6Ojg2QDn
4OPr2ear/srm2efnAMwA1dvV3eIA6OMA5ODV7QDi4+bh1eDg7a3/ztzd5wDb3droANjj2efitOgA
6+Pm3wDr3ejc/ujc3ecA6tnm593j4gDj2gDo3NkA29Xh2a3/AAAAcLUA8B74HogAIBiAEE0UpBBI
BDgC1CFYKVD65w5IAWgqH0sbmwoB0RFoAOARYAApA9AKSxlgaRwBYADwAvgegHC9giObAAQiEgab
GHBHwEYA/AMCDAIAAOAnAAO4/QMCMLVzSASIdEgBaAExAWB6SAAoAdABIQFwAPB9+ADwiPhlSwDw
d/gBIARCJ9FsTGSlAPAn+GtMZKUA8CP4bEgAeAAoG9BlSCAhwn4AKgfQgnkDeppCA9HCeUN6mkIO
0CQwATnx0VxIQWgBMUFgWUwALATQUksA8E74ATz45zC8AbwARwC1WkgAeAAoQdAALD/QVUhBaGpo
kUI60QFoKmiRQjbRUknJiMkLMtEA8H74U0kAKRDQSErSaFMAGxiLQgrZRUgBaQExAWHRCAExUhoA
1QAiwmAc4AG0Q0gAIcGFAYYraADwF/hASEFoa2iZQg7RAPAQ+ADwWfgCvEAaANXkMDVK0GCRaAEx
kWABPL7nAbABvABHGEc2SjZIAIjAQ8AFwA9ReFBwiEMReEFAEXBwRxC1KUhBaQApBtArShFggWlR
YAAhQWGBYS5JACkp0ChIAngAKiXQIEjCaQEyikIA0wAiwmEAKhzRH0scaBRKlEID0VxoE0qUQgfQ
HGgSSpRCD9FcaBFKlEIL0RhK0ojSCwfREUgcaERhXGiEYRpMHGBcYBC8AbwAR3BHFUgAiKA4ANXk
MHBHwEY1BwAIaS0ACO2cBQhtnQUIgVsBCJ1IAQicIwADAAAAAGD/AwI0AAICAAAAAAAAAACAIwAD
tHoDAoD/AwIwAQAEcfEDAuQAAAAGAAAEBAAAAKn9AwI=`), {
                'BPGE 1.10': decodeBase64(`XAEBRw==`),
            }),
        },
    },
    {
        id: 'custom-speed-2',
        label: 'Fast Forward 2× (Press R)',
        description: 'Press R and the game runs at double speed, including walking, battles and text; press R again to play normally. R works anywhere, and the speed stays as you set it until you press it again. In FireRed and LeafGreen, L still opens the Help menu. It lasts until the game is closed or reset; talk to the deliveryman again after a reset. Original speed-up event by Decryptu.',
        payloads: {
            ...romPayloads(decodeBase64(`7gNlAAYAAAAAAL7Jz7zGvwDNyr+/vv/////////////////////////////////////MAOjp5uLn
AN3oAOPiANXi2ADj2tqr////////////////////////uwDn5NnX3dXgAOjm3dffAN3nAOvV3ejd
4tv//////////////////97p5+gA2uPmAO3j6av////////////////////////////////////Q
3efd6ADo3NkA2Nng3erZ5u3h1eIA4+IA6NzZ////////////////o+LYANrg4+PmAOPaANUAysnF
v8fJyAC9v8jOv8yt/////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIUrsFVAAACB+vAAAIRbsFVAAACB+8AAAICrsFVAAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAARyMVEAADiwC9XgAACGZtaGwCvZgAAAhmbWhsAsrm2efnAMwA2uPmANjj6dbg2QDn5NnZ2Kv+
yubZ5+cAzADV29Xd4gDo4wDk4NXtAOLj5uHV4ODtrf/O3N3nANvd2ugA2OPZ5+K06ADr4+bfAOvd
6Nz+6Nzd5wDq2ebn3ePiAOPaAOjc2QDb1eHZrf8AAHC1APAe+B6IACAYgBBNFKQQSAQ4AtQhWClQ
+ucOSAFoKh9LG5sKAdERaADgEWAAKQPQCksZYGkcAWAA8AL4HoBwvYIjmwAEIhIGmxhwR8BGAPwD
AgwCAADgJwADuP0DAjC1c0gEiHRIAWgBMQFgekgAKAHQASEBcADwffgA8Ij4ZUsA8Hf4ASAEQifR
bExkpQDwJ/hrTGSlAPAj+GxIAHgAKBvQZUggIcJ+ACoH0IJ5A3qaQgPRwnlDeppCDtAkMAE58dFc
SEFoATFBYFlMACwE0FJLAPBO+AE8+OcwvAG8AEcAtVpIAHgAKEHQACw/0FVIQWhqaJFCOtEBaCpo
kUI20VJJyYjJCzLRAPB++FNJACkQ0EhK0mhTABsYi0IK2UVIAWkBMQFh0QgBMVIaANUAIsJgHOAB
tENIACHBhQGGK2gA8Bf4QEhBaGtomUIO0QDwEPgA8Fn4ArxAGgDV5DA1StBgkWgBMZFgATy+5wGw
AbwARxhHNko2SACIwEPABcAPUXhQcIhDEXhBQBFwcEcQtSlIQWkAKQbQK0oRYIFpUWAAIUFhgWEu
SQApKdAoSAJ4ACol0CBIwmkBMopCANMAIsJhACoc0R9LHGgUSpRCA9FcaBNKlEIH0BxoEkqUQg/R
XGgRSpRCC9EYStKI0gsH0RFIHGhEYVxohGEaTBxgXGAQvAG8AEdwRxVIAIigOADV5DBwR8BGNQcA
CGktAAjtnAUIbZ0FCIFbAQidSAEInCMAAwEAAABg/wMCNAACAgEAAAABAAAAgCMAA7R6AwKA/wMC
MAEABHHxAwLkAAAABgAABAAAAACp/QMC`), {
                'BPGE 1.10': decodeBase64(`XAEBRw==`),
            }),
        },
    },
    {
        id: 'custom-speed-3',
        label: 'Fast Forward 3× (Press R)',
        description: 'Press R and the game runs up to three times as fast, including walking, battles and text; press R again to play normally. R works anywhere, and the speed stays as you set it until you press it again. In FireRed and LeafGreen, L still opens the Help menu. It lasts until the game is closed or reset; talk to the deliveryman again after a reset. Original speed-up event by Decryptu.',
        payloads: {
            ...romPayloads(decodeBase64(`7wNlAAcAAAAAAM7Mw8rGvwDNyr+/vv/////////////////////////////////////MAOjp5uLn
AN3oAOPiANXi2ADj2tqr////////////////////////uwDn5NnX3dXgAOjm3dffAN3nAOvV3ejd
4tv//////////////////97p5+gA2uPmAO3j6av////////////////////////////////////Q
3efd6ADo3NkA2Nng3erZ5u3h1eIA4+IA6NzZ////////////////o+LYANrg4+PmAOPaANUAysnF
v8fJyAC9v8jOv8yt/////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIUrsFVAAACB+vAAAIRbsFVAAACB+8AAAICrsFVAAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAARyMVEAADiwC9XgAACGZtaGwCvZgAAAhmbWhsAsrm2efnAMwA2uPmAOjm3eTg2QDn5NnZ2Kv+
yubZ5+cAzADV29Xd4gDo4wDk4NXtAOLj5uHV4ODtrf/O3N3nANvd2ugA2OPZ5+K06ADr4+bfAOvd
6Nz+6Nzd5wDq2ebn3ePiAOPaAOjc2QDb1eHZrf8AAHC1APAe+B6IACAYgBBNFKQQSAQ4AtQhWClQ
+ucOSAFoKh9LG5sKAdERaADgEWAAKQPQCksZYGkcAWAA8AL4HoBwvYIjmwAEIhIGmxhwR8BGAPwD
AgwCAADgJwADuP0DAjC1c0gEiHRIAWgBMQFgekgAKAHQASEBcADwffgA8Ij4ZUsA8Hf4ASAEQifR
bExkpQDwJ/hrTGSlAPAj+GxIAHgAKBvQZUggIcJ+ACoH0IJ5A3qaQgPRwnlDeppCDtAkMAE58dFc
SEFoATFBYFlMACwE0FJLAPBO+AE8+OcwvAG8AEcAtVpIAHgAKEHQACw/0FVIQWhqaJFCOtEBaCpo
kUI20VJJyYjJCzLRAPB++FNJACkQ0EhK0mhTABsYi0IK2UVIAWkBMQFh0QgBMVIaANUAIsJgHOAB
tENIACHBhQGGK2gA8Bf4QEhBaGtomUIO0QDwEPgA8Fn4ArxAGgDV5DA1StBgkWgBMZFgATy+5wGw
AbwARxhHNko2SACIwEPABcAPUXhQcIhDEXhBQBFwcEcQtSlIQWkAKQbQK0oRYIFpUWAAIUFhgWEu
SQApKdAoSAJ4ACol0CBIwmkBMopCANMAIsJhACoc0R9LHGgUSpRCA9FcaBNKlEIH0BxoEkqUQg/R
XGgRSpRCC9EYStKI0gsH0RFIHGhEYVxohGEaTBxgXGAQvAG8AEdwRxVIAIigOADV5DBwR8BGNQcA
CGktAAjtnAUIbZ0FCIFbAQidSAEInCMAAwIAAABg/wMCNAACAgIAAAACAAAAgCMAA7R6AwKA/wMC
MAEABHHxAwLkAAAABgAABAAAAACp/QMC`), {
                'BPGE 1.10': decodeBase64(`XAEBRw==`),
            }),
        },
    },
    {
        id: 'custom-speed-4',
        label: 'Fast Forward 4× (Press R)',
        description: 'Press R and the game runs up to four times as fast, including walking, battles and text; press R again to play normally. R works anywhere, and the speed stays as you set it until you press it again. In FireRed and LeafGreen, L still opens the Help menu. It lasts until the game is closed or reset; talk to the deliveryman again after a reset. Original speed-up event by Decryptu.',
        payloads: {
            ...romPayloads(decodeBase64(`8ANlAAgAAAAAAKW5AM3Kv7++///////////////////////////////////////////MAOjp5uLn
AN3oAOPiANXi2ADj2tqr////////////////////////uwDn5NnX3dXgAOjm3dffAN3nAOvV3ejd
4tv//////////////////97p5+gA2uPmAO3j6av////////////////////////////////////Q
3efd6ADo3NkA2Nng3erZ5u3h1eIA4+IA6NzZ////////////////o+LYANrg4+PmAOPaANUAysnF
v8fJyAC9v8jOv8yt/////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIUrsFVAAACB+vAAAIRbsFVAAACB+8AAAICrsFVAAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAARyMVEAADjwC9XgAACGZtaGwCvZwAAAhmbWhsAsrm2efnAMwA6OMA5+TZ2dgA6NzZANvV4dkA
6eSr/srm2efnAMwA1dvV3eIA6OMA5ODV7QDi4+bh1eDg7a3/ztzd5wDb3droANjj2efitOgA6+Pm
3wDr3ejc/ujc3ecA6tnm593j4gDj2gDo3NkA29Xh2a3/AABwtQDwHvgeiAAgGIAQTRSkEEgEOALU
IVgpUPrnDkgBaCofSxubCgHREWgA4BFgACkD0ApLGWBpHAFgAPAC+B6AcL2CI5sABCISBpsYcEfA
RgD8AwIMAgAA4CcAA7j9AwIwtXNIBIh0SAFoATEBYHpIACgB0AEhAXAA8H34APCI+GVLAPB3+AEg
BEIn0WxMZKUA8Cf4a0xkpQDwI/hsSAB4ACgb0GVIICHCfgAqB9CCeQN6mkID0cJ5Q3qaQg7QJDAB
OfHRXEhBaAExQWBZTAAsBNBSSwDwTvgBPPjnMLwBvABHALVaSAB4AChB0AAsP9BVSEFoamiRQjrR
AWgqaJFCNtFSScmIyQsy0QDwfvhTSQApENBIStJoUwAbGItCCtlFSAFpATEBYdEIATFSGgDVACLC
YBzgAbRDSAAhwYUBhitoAPAX+EBIQWhraJlCDtEA8BD4APBZ+AK8QBoA1eQwNUrQYJFoATGRYAE8
vucBsAG8AEcYRzZKNkgAiMBDwAXAD1F4UHCIQxF4QUARcHBHELUpSEFpACkG0CtKEWCBaVFgACFB
YYFhLkkAKSnQKEgCeAAqJdAgSMJpATKKQgDTACLCYQAqHNEfSxxoFEqUQgPRXGgTSpRCB9AcaBJK
lEIP0VxoEUqUQgvRGErSiNILB9ERSBxoRGFcaIRhGkwcYFxgELwBvABHcEcVSACIoDgA1eQwcEfA
RjUHAAhpLQAI7ZwFCG2dBQiBWwEInUgBCJwjAAMEAAAAYP8DAjQAAgIDAAAAAwAAAIAjAAO0egMC
gP8DAjABAARx8QMC5AAAAAYAAAQAAAAAqf0DAg==`), {
                'BPGE 1.10': decodeBase64(`XAEBRw==`),
            }),
        },
    },
    {
        id: 'custom-fast-text',
        label: 'Max Text Speed',
        description: 'All text prints at top speed, in the overworld and in battle, until the game is closed or reset. Talk to the deliveryman again after a reset.',
        payloads: {
            ...romPayloads(decodeBase64(`DwQ7AScAAAAYAMC7zc4Azr/Szv/////////////////////////////////////////I4wDh4+bZ
AOvV3ejd4tv/////////////////////////////////u+DgAOjZ7OgA5Obd4ujnANXoAOjj5ADn
5NnZ2P///////////////+ni6N3gAO3j6QDo6ebiAOPa2gDt4+nmANvV4dmt///////////////Q
3efd6ADo3NkA2Nng3erZ5u3h1eIA4+IAo8D/////////////////49oA1QDKycUbx8nIAL2/yM6/
zK3//////////////////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIUrsFVAAACB+vAAAIRbsFVAAACB+8AAAICrsFVAAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAARyMVEAADjwC9XgAACGZtaGwCvZ0AAAhmbWhsArvg4ADo2ezoAOTm3eLo5wDV6ADo4+QA5+TZ
2dj+4uPruADp4ujd4ADt4+kA6Onm4gDj2toA6NzZANvV4dmt/87c3ecA293a6ADY49nn4rToAOvj
5t8A693o3P7o3N3nAOrZ5ufd4+IA49oA6NzZANvV4dmt/wBwtQDwHvgeiAAgGIAQTRSkEEgEOALU
IVgpUPrnDkgBaCofSxubCgHREWgA4BFgACkD0ApLGWBpHAFgAPAC+B6AcL2CI5sABCISBpsYcEfA
RgD8AwLgAQAA4CcAA5D9AwIwtWlIBIhqSAFoATEBYG9IACgB0AEhAXAA8Hf4XEsA8HP4ASAEQiPR
Y0xbpQDwI/hiTFulAPAf+F5IICHCfgAqB9CCeQN6mkID0cJ5Q3qaQg7QJDABOfHRVUhBaAExQWBS
TAAsBNBLSwDwTvgBPPjnMLwBvABHALVTSAB4AChB0AAsP9BOSEFoamiRQjrRAWgqaJFCNtFLScmI
yQsy0QDwcfhLSQApENBBStJoUwAbGItCCtk+SAFpATEBYdEIATFSGgDVACLCYBzgAbQ8SAAhwYUB
hitoAPAX+DlIQWhraJlCDtEA8BD4APBM+AK8QBoA1eQwLkrQYJFoATGRYAE8vucBsAG8AEcYRxC1
KEhBaQApBtAqShFggWlRYAAhQWGBYS1JACkp0CdIAngAKiXQH0jCaQEyikIA0wAiwmEAKhzRH0sc
aBRKlEID0VxoE0qUQgfQHGgSSpRCD9FcaBFKlEIL0RdK0ojSCwfREEgcaERhXGiEYRlMHGBcYBC8
AbwAR3BHE0gAiKA4ANXkMHBHNQcACGktAAjtnAUIbZ0FCIFbAQidSAEInCMAAwgAAABg/wMCNAAC
AgAAAAAAAAAAgCMAA7R6AwKA/wMCAAAAAOQAAAAGAAAEAAAAAIP9AwI=`), {
                'BPGE 1.10': decodeBase64(`XAEBRw==`),
            }),
        },
    },
    {
        id: 'custom-travel-anywhere',
        label: 'Travel Anywhere (Fly with R, Run & Bike Indoors)',
        description: 'Press R outdoors to open the Fly map, with no Pokémon that knows Fly and no badge needed, and fly to any town you’ve visited with the usual animation. It works wherever Fly does: on foot, on a bike or surfing, but not indoors, in caves or during a cutscene. B closes the map. You can also run and ride your Bike everywhere, indoors and in caves included, once you have the Running Shoes or a Bike. In FireRed and LeafGreen, L still opens the Help menu. It lasts until the game is closed or reset; talk to the deliveryman again after a reset, or to turn it off.',
        payloads: {
            ...romPayloads(decodeBase64(`FAQSACwAAAAEAM7Mu9C/xgC7yNPRwr/Mv//////////////////////////////////AxtMA693o
3ADMuAC8w8W/AN3i2OPj5uf/////////////////////yubZ5+cAzADj6ejY4+Pm5wDo4wDAxtO4
AOLj/////////////////8LHAOLZ2djZ2LgA1eLYAObp4gDV4tgAvMPFv//////////////////V
4u3r3Nnm2a0A0N3n3egA6NzZANjZ4N3q2ebt4dXi////////////4+IAo8AA49oA1QDKycUbx8nI
AL2/yM6/zK3//////////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIUrsFowAACB+vAAAIRbsFowAACB+8AAAICrsFowAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAARx9g/wMCAbsBdAAACL2tAAAIZm4UCCENgAAAuwGZAAAIIxUQAAM/Ab3jAAAIZm1obAK9HQEA
CGZuFAghDYABALsBmQAACCMVEAADUAG9QAEACGZtaGwCvVcBAAhmbWhsAr1rAQAIZm1obALN3NXg
4ADDAODZ6ADt4+kAwMbTAOvd6NwAzADV4tj+5uniANXi2AC8w8W/ANXi7evc2ebZrP++4+LZqwDJ
6ejY4+Pm57gA5ObZ5+cAzADo4wDAxtOt/sPoAODV5+jnAOni6N3gAO3j6QDm2efZ6K3/zubV6tng
ANXi7evc2ebZAN3nAOPirf7F2dnkAN3oAOPirP+81dffAOjjAOLj5uHV4ADo5tXq2eCr/73j4dkA
1tXX3wDV4u0A6N3h2av/ztzd5wDb3droANjj2efitOgA6+Pm3wDr3ejc/ujc3ecA6tnm593j4gDj
2gDo3NkA29Xh2a3/AAAAcLUSSx6IACAYgBFNFKQRSAQ4IVgpUPvRD0xgcAEgIHAOSAFoSxubCgLQ
YWBpHAFgBksegHC9CEgAIQFwAkgAKADQAXBwR8BGcfEDAggCAAQA/AMCzAEAAGD/AwLgJwAD8LVW
TCB4AChC0FVPuIvABz7RVUgAKAHQASEBcHhoU0mIQgvRYXgAKTLQACFhcFBKEWBMShFwT0l5YCng
TkmIQibRUElIfgIiEENIdgEgCHYAIGBw+I1AChrTSE0oeAAoFtFHSMB4ACgS0UZIwH1GSwDwc/gA
KAvQAPBG+P8oB9CgcAEgKHBBSFAhQUsA8GX4Y2gA8GL48LwBvABHELUoIUFDPExkGCCJACgQ0TpL
APBU+DpLAPBR+DlLAPBO+AEgACE4SwDwSfgBICCBEL02SMCIAAQX1CFIgXg1SlFyASFBcDJLAPA5
+DJLAPA2+DJLAPAz+DFLAPAw+BpIACEBcBdIL0lBYBC98LX/JgAkZCBgQyxNLRgoAAshAPAc+AAo
EtAoAC0hAPAW+AAoDNH/LgDRJgANJygAOQAA8Az4EygH0AE3ES/20QE0Bizf0TAA8L0gAPC9ACIb
SxhHYP8DAoAjAAO4JwADcfEDApGFEgjwQgADoZ8FCG2dBQicEAADdHADAvhtAwK1mQUInfwDAo2r
BwhgQwADUboJCBnBBggl/wUIYd8HCLR6AwJN5wcInLADAqmbBQjJtQgILasHCG2GDAiAQgICkTME
CA==`), {
                'BPGE 1.10': decodeBase64(`XAEBR8AEAWnsBAEl+AQBNQAFASEMBQGdFAUBQQ==`),
            }),
        },
    },
    {
        id: 'custom-pc-anywhere',
        label: 'PC Anywhere (Press R)',
        description: 'Press R in the field to open the Pokémon Storage System, the boxes you normally reach from a Pokémon Center’s PC: withdraw, deposit and move Pokémon and their items, then SEE YA! takes you back to where you were. It stays off in the Union Room. R no longer opens the Help menu while it’s on (L still does). It lasts until the game is closed or reset; talk to the deliveryman again to turn it off.',
        payloads: {
            ...romPayloads(decodeBase64(`KgSJAEIAAAAMAMq9ALvI09HCv8y////////////////////////////////////////T4+nmANbj
7NnnuADj4tkA1uno6OPiANXr1e3/////////////////yubZ5+cAzADd4gDo3NkA2t3Z4NgA6OMA
6efZ/////////////////+3j6eYAyr205wDKycUbx8nIANbj7NnnrQDQ3efd6P/////////////o
3NkA2Nng3erZ5u3h1eIA4+IA6NzZAKPi2P//////////////////2uDj4+YA49oA1QDKycUbx8nI
AL2/yM6/zK3//////////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIUrsFowAACB+vAAAIRbsFowAACB+8AAAICrsFowAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAARx9g/wMCAbsBdAAACL2tAAAIZm4UCCENgAAAuwGZAAAIIxUQAANHAb3jAAAIZm1obAK9HgEA
CGZuFAghDYABALsBmQAACCMVEAADWAG9PQEACGZtaGwCvWEBAAhmbWhsAr11AQAIZm1obALN3NXg
4ADDAODZ6ADt4+kA4+TZ4gDo3NkAyr3+693o3ADMuADr3Nnm2erZ5gDt4+kA1ebZrP++4+LZqwDK
5tnn5wDMAN3iAOjc2QDa3dng2ADo4/7p59kA6NzZAMq9uADp4ujd4ADt4+kA5tnn2eit/8q9ALvi
7evc2ebZAN3nAOPirf7F2dnkAN3oAOPirP+81dffAOjjAOjc2QDKvecA3eIAysnFG8fJyP69v8jO
v8zNq/+94+HZANbV198A1eLtAOjd4dmr/87c3ecA293a6ADY49nn4rToAOvj5t8A693o3P7o3N3n
AOrZ5ufd4+IA49oA6NzZANvV4dmt/wBwtRFLHogAIBiAEE0SpCwggAAEOCFYKVD70Q1MASAgcAxI
AWhLG5sKAtBhYGkcAWAFSx6AcL0GSAAhAXABSAFwcEfARnHxAwIIAgAEAPwDAmD/AwLgJwADkLUb
TCB4ACgq0BpPuIvABybRGUgBIQFw+I1ACiDTOGgXSYhCHNF4aBZJiEIY0RZIAHgAKBTRFUgAeAIo
ENEUSMB4ACgM0Q1IAHgCKAjSEUsA8Az4ACgD0RBID0sA8Ab4Y2gA8AP4kLwBvABHGEfARmD/AwKA
IwADcfEDAvatAwLtnAUIbZ0FCJwQAAOoDwADdHADAj3sEQhx0gYIoPwDAiNRugkIaS8CACU8ACdr
AgA=`), {
                'BPGE 1.10': decodeBase64(`XAEBR+gDARX1AwEl`),
            }),
        },
    },
    {
        id: 'custom-hm-moves',
        label: 'HM Moves Without HMs',
        description: 'With the badge that allows each move, your party uses Cut, Rock Smash, Strength, Surf and Waterfall without any Pokémon knowing it: talk to the tree, rock or boulder, or press A facing the water, as usual. The first Pokémon in your party that isn’t an Egg does the work. Dark caves light up by themselves once you have the Boulder Badge, as Flash would light them. It lasts until the game is closed or reset; talk to the deliveryman again to turn it off.',
        payloads: {
            ...romPayloads(decodeBase64(`LASDAEQAAAAAAMLHAMfJ0L/NuADIyQDCx+f////////////////////////////////T4+nmANbV
2NvZ5wDV5tkA2eLj6dvc////////////////////////vc/OuADNz8zAuADNzsy/yMHOwgDV4tgA
4ePm2bj//////////////+LjAMrJxRvHycgA4tnZ2OcA6OMA3+Lj6wDo3Nnhrf/////////////Q
3efd6ADo3NkA2Nng3erZ5u3h1eIA4+IAo8D/////////////////49oA1QDKycUbx8nIAL2/yM6/
zK3//////////////////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIUrsFogAACB+vAAAIRbsFogAACB+8AAAICrsFogAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAARx9g/wMCAbsBdAAACL2sAAAIZm4UCCENgAAAuwGYAAAIIxUQAAMzAb3YAAAIZm1obAK9EQEA
CGZuFAghDYABALsBmAAACBEAYP8DAr02AQAIZm1obAK9TAEACGZtaGwCvWABAAhmbWhsAtHV4ugA
6OMA6efZAMLHAOHj6tnnAOvd6Nzj6ej+6NnV19zd4tsA6NzZ4az/vuPi2asA0+Pp5gDW1djb2ecA
1ebZANXg4ADt4+n+4tnZ2ADi4+u4AOni6N3gAO3j6QDm2efZ6K3/yOMAwsfnAOLZ2djZ2ADi4+ut
/sXZ2eQA3egA6NzV6ADr1e2s/7zV198A6OMA6NnV19zd4tsAwsfnq/+94+HZANbV198A1eLtAOjd
4dmr/87c3ecA293a6ADY49nn4rToAOvj5t8A693o3P7o3N3nAOrZ5ufd4+IA49oA6NzZANvV4dmt
/wAAMLUKTQykgyCAAAQ4IVgpUPvRB0wBICBwBkgBaEsbmwoC0GFgaRwBYDC9wEYA/AMCYP8DAuAn
AAPwtVtMW0+4i8AHGtEAJiB4ACgV0HhoWEmIQhHRV0gAeAIoDdIA8BL4APA9+AYAYXgIQAXQAPBG
+AAoAdEA8HX4ZnBjaPC8AbyGRhhHYLVQTSh4ASgm0ehoYKYEIzFoiEID0Aw2ATv50RzgMIkA8H34
ACgX0LB6ACgE0E9LAPB2+AAoD9AA8GT4/ygL0EZJCIBwaE+hCIEADEiBqWAAIChwASBocGC9ACA7
SQl4ACkI0ThJCXgCKQTROEnJeAApANEBIHBHILX4jUAILNOBsGhGgRwrSwDwSvhqRhCIUYgBsChL
APBD+ChLAPBA+CdNACgQ0TRIAPA5+AAoFNAtSwDwNfgAKA/QLk0A8CL4/ygK0CVJCIAuoAWBKQxB
gSRLAPAl+AEgIL0AICC9ALUcSEB9ASgM0SVIAPAY+AAoB9EiSADwE/gAKALQHEsA8A/4AL0USQAg
ynxSB1IPAioE0GQxATAGKPbR/yBwRxBLGEfARmD/AwKAIwADbZ0FCPatAwKZ/AUIHccFCG3UBQgV
ohoIsA8AA6gPAAOcEAADdHADAvhtAwKAQgICzHADAj0eBwhx0gYIVQAGCDEABggl0wwI7KEaCCQI
AAAgCAAABggAACNRugkIaAAFAAAAAJIWHAg8FhwIIQgAAJwXHAg1FxwIJQgAAJAYHAhPGBwIIwgA
AAsaHAjXGRwIJggBAA==`), {
                'BPGE 1.10': decodeBase64(`XAEBR6wEAvGh3AQF+dIMCMjxBAEl/AQFbhYcCBgIBQV4FxwIERQFBWwYHAgrIAUF5xkcCLM=`),
            }),
        },
    },
    {
        id: 'custom-no-encounters',
        label: 'No Wild Encounters & Repel',
        description: 'Choose which wild Pokémon stay away: ALL OF THEM, until the game is closed or reset (fishing, Rock Smash and Sweet Scent still find Pokémon); the WEAKER ONES, with a Repel that lasts 65,535 steps and is saved with your game; or NONE, which brings them all back.',
        payloads: {
            ...romPayloads(decodeBase64(`/AMpABQAAAAcAMjJAL/IvcnPyM6/zM0ALQDMv8q/xv/////////////////////////R3eDYAMrJ
xRvHyci4AOfo1e0A1evV7av/////////////////////xdnZ5ADV4OAA693g2ADKycUbx8nIANXr
1e24/////////////////+PmAOPi4O0A6NzZAOvZ1d/Z5gDj4tnnrQDQ3efd6P/////////////o
3NkA2Nng3erZ5u3h1eIA4+IA6NzZAKPi2P//////////////////2uDj4+YA49oA1QDKycUbx8nI
AL2/yM6/zK3//////////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIUrsFtgAACB+vAAAIRbsFtgAACB+8AAAICrsFtgAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAAR73AAAAIZiMVEAADXQEnIQ2AAQC7AYIAAAghDYACALsBlwAACCENgAAAuwWsAAAIEQHYhgMC
veUAAAhmbWhsAhEA2IYDAhYgQP//vRQBAAhmbWhsAhEA2IYDAhYgQAAAvToBAAhmbWhsAr1bAQAI
Zm1obAK9bwEACGZtaGwC0dzd19wA693g2ADKycUbx8nIAOfc4+ng2P7n6NXtANXr1e2s/8jj4tkA
693g4ADV5OTZ1eYA6eLo3eAA7ePp/ujp5uIA49raAO3j6eYA29Xh2a3/xt3f2QDVAMy/yr/GAOjc
1egA4NXn6Of+p6a4pqSmAOfo2eTnq//R3eDYAMrJxRvHycgA1ebZANbV198A6OP+4uPm4dXgq/+9
4+HZANbV198A1eLtAOjd4dmr/87c3ecA293a6ADY49nn4rToAOvj5t8A693o3P7o3N3nAOrZ5ufd
4+IA49oA6NzZANvV4dmt/wAAAAGgAyEKIlbgu8bGAMnAAM7Cv8f/0b+7xb/MAMnIv83/yMnIv/8A
wEbwtYWwDQAXACtOACMCyAAiBsYBM6tC+dEnThwgwBsAIToALaNsHhtdJUwA8C/4BwAAISRMAPAq
+A4hAJEBlQKWACEDkQIhBJE4AAgiAiMeTADwHPgOIQCRAZUAIQKROAACIQAiAiMZTADwEPgAICkA
OgACIxZMAPAJ+AAgFUwA8AX4Dkj/IQGABbDwvSBHELWIsAAjnABsRCBgBHgBMP8s+9EDMIAIgAAB
M4tC8tFoRv/3pv8IsBC9sPsDAsxwAwK5DQoIya4PCHk0EQhpMBEIfQMKCB2fDwgCBAYHCQsNDg==`), {
                'BPGE 1.10': decodeBase64(`XAEBR+ADFo0NCgihrg8IUTQRCEEwEQhRAwoI9Z4=`),
            }),
        },
    },
    {
        id: 'custom-national-dex',
        label: 'National Pokédex Unlock',
        description: 'Upgrades your Pokédex to the National Pokédex right away, instead of after beating the Elite Four and catching 60 Kanto Pokémon. It also lets Kanto Pokémon evolve into later species, and Celio needs it before he sends you on the errand that earns the Rainbow Pass, which the Aurora and Mystic Tickets need. It opens up trading too: a game without the National Pokédex can’t trade away or be sent Pokémon from outside its regional Pokédex, or Eggs. With this card on both games, Emerald and FireRed or LeafGreen trade any Pokémon both ways, right away with this page’s National Dex bypass on, otherwise once both players have entered the Hall of Fame and the Switch player has finished the Sevii Islands story. You need a Pokédex first.',
        payloads: {
            ...romPayloads(decodeBase64(`CASJACAAAAAIAMi7zsPJyLvGAMrJxRu+v9L///////////////////////////////+/6tnm7QDK
ycUbx8nIuADm3dvc6ADV69Xt////////////////////z+Tb5tXY2QDt4+nmAMrJxRu+v9IA6OMA
6NzZ/////////////////8i7zsPJyLvGAMrJxRu+v9IA4uPrrQDQ3efd6P/////////////////o
3NkA2Nng3erZ5u3h1eIA4+IA6NzZAKPi2P//////////////////2uDj4+YA49oA1QDKycUbx8nI
AL2/yM6/zK3//////////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIUrsFfAAACB+vAAAIRbsFfAAACB+8AAAICrsFfAAACCspCLsAXgAACCtACLsBaAAACL2G
AAAIZm4UCCENgAAAuwFyAAAIJW8BvbwAAAhmbWhsAr3sAAAIZm1obAK9CgEACGZtaGwCvTgBAAhm
bWhsAr1MAQAIZm1obALN3NXg4ADDAOnk2+bV2NkA7ePp5gDKycUbvr/S/ujjAOjc2QDIu87Dyci7
xgDKycUbvr/SrP++4+LZqwDT4+nmAMrJxRu+v9IA3ecA4uPrAOjc2f7Iu87Dyci7xgDKycUbvr/S
rf/T4+kA2OPitOgA3NXq2QDVAMrJxRu+v9IA7dnoq//T4+nmAMrJxRu+v9IA3ecA1eDm2dXY7QDo
3Nn+yLvOw8nIu8YAysnFG76/0qv/vePh2QDW1dffANXi7QDo3eHZq//O3N3nANvd2ugA2OPZ5+K0
6ADr4+bfAOvd6Nz+6Nzd5wDq2ebn3ePiAOPaAOjc2QDb1eHZrf8=`), {
                'BPGE 1.10': decodeBase64(`XAEBRw==`),
            }),
        },
    },
    {
        id: 'custom-shiny-hunting',
        label: 'Shiny Hunting (Boosted Odds)',
        description: 'Wild Pokémon are shiny 1 in 1024 times instead of 1 in 8192, and the odds climb with a chain of one species: catching one adds 2, defeating one adds 1, reaching 1 in 64 at a chain of 30. Catching or defeating another species starts a new chain; running away leaves it as it is. Wild Pokémon may flee (1 turn in 20, never while asleep or in a legendary’s battle), and one that flees ends the chain. Press R in the field to see your chain; R no longer opens the Help menu (L still does). A Pokémon made shiny gets its nature and IVs from one roll of the game’s random number generator, as a wild shiny does, so PKHeX finds it legal; it keeps its gender, ability, moves and held item. Roaming legendaries and Unown are never made shiny (PKHeX expects them exactly as the game makes them). It lasts until the game is closed or reset.',
        payloads: {
            ...romPayloads(decodeBase64(`/gOCABYAAAAAAM3Cw8jTAMLPyM7DyMH////////////////////////////////////N3N3i7QDK
ycUbx8nIuADh4+bZAOPa6Nni////////////////////vdXo19wA4+YA2Nna2dXoAOPi2QDKycUb
x8nI/////////////////9Xb1d3iANXi2ADV29Xd4gDo4wDh2dnoAN3o///////////////////n
3N3i7a0A0N3n3egA6NzZANjZ4N3q2ebt4dXi////////////////4+IAo8AA49oA1QDKycUbx8nI
AL2/yM6/zK3//////////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIUrsFYAAACB+vAAAIRbsFYAAACB+8AAAICrsFYAAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAARx9g/wMCAbsBVgAACCMVEAADdwC9agAACGZtaGwCvZIAAAhmbWhsAsniAOni6N3gAO3j6QDm
2efZ6Kv+zADn3OPr5wDt4+nmANfc1d3irf/O3N3nANvd2ugA2OPZ5+K06ADr4+bfAOvd6Nz+6Nzd
5wDq2ebn3ePiAOPaAOjc2QDb1eHZrf8wtQpNDaQKSAQ4IVgpUPvRCEwgYGBgASAgcAdIAWhLG5sK
AtAhYWkcAWAwvQD8AwLEAgAAYP8DAuAnAAPwtYxMIHgAKAzQi0+4i8AHCNGYSAEhAXAA8Av4APBA
+ADwXPgjaQDwA/jwvAG8AEcYRwC1YHgAKDHQgkkKeAAqGtECKCvRgEkJaIBKkUIm0X9JCWgEKSLR
eElQMQl4SQcd0X1L//fk/8whCQGIQhbSeEkDIEhwEuAAIWFwBioN0AEgASoC0AIgByoI0SKJ44ia
QgHQ4oAA4KGICRihgAC9ALX4jUAKGNM4aHRJiEIU0XRIAHgAKBDRc0gAeAIoDNFtSAB4AigI0nFI
oYhBgOGIgYBwSG1L//er/wC9ALVXTS5o4GiwQj7Q5mB4aGRJiEIC0AwwiEI00VFIAGiBiQkEQIkI
Q2loiEIr0SgACyFTS//3jv8ggUtJACIKcFpJCXgBIgIpANECImJwySgb0AEA8zkCKRfZ4YgAIohC
A9GiiB4qANkeIgIyUgFoaHBAAQxIQAAEAAyQQgXSAPAF+OZgAeAAIGBwAL2QtYSwAJY2DADwWPgB
lquI6YhLQB8AAJgABDpJOkoEAExDpBgDDHtAATBkGCYMXkAILvnSBgx+QJ5COdEmDADwPfgBmpZC
79EGDCcMPwQ+Qy1KIABIQ4AYBABMQ6QYQABADGQAZAzkAyBDApAAmXFAKAAgMCwig1hLQINQBDr6
1S5gACcCmEEJApEfIQhAAJAnIckZAKooABdMAPAW+AE3Bi/v0SgAFkwA8A/4BLCQvRcmNgSAGU5D
pBmz5w9KckNSDLYathq2GnBHIEdg/wMCgCMAAyhAAgLcQgADhj4CAlRCAANFiAEISCsCAng9AgJx
hgQIkTMECCU7BAirqgAAJRwECG1OxkFzYAAAcfEDAvatAwLtnAUIbZ0FCJwQAAOoDwADcdIGCLxw
AwKY/gMCI1G6CQhpxwN9AAaAgwEFgGe0/gMCZm1oawLARv0CANfc1d3i8AD9A6v/wEY=`), {
                'BPGE 1.10': decodeBase64(`XAEBR+0EASU=`),
            }),
        },
    },
    {
        id: 'custom-roamer',
        label: 'Roaming Pokémon Finder & Lure',
        description: 'Tells you which Pokémon is roaming and the route it’s on right now, then offers to lure it: while the lure is on, it follows you onto the routes it roams, and 1 in 4 wild Pokémon you meet there is it. Entei, Raikou or Suicune roams after you bring Celio the Sapphire. The lure lasts until the game is closed or reset; talk to the deliveryman again to turn it off.',
        payloads: {
            ...romPayloads(decodeBase64(`EgT1ACoAAAAQAMzJu8fDyMEAysnFG8fJyP/////////////////////////////////A3eLYAN3o
uADo3NniAODp5tkA3ej/////////////////////////wN3i2ADj6egA69zZ5tkA6NzZAObj1eHd
4tv//////////////////8rJxRvHycgA3ecA1eLYAODp5tkA3egA6OMA7ePprf/////////////Q
3efd6ADo3NkA2Nng3erZ5u3h1eIA4+IAo8D/////////////////49oA1QDKycUbx8nIAL2/yM6/
zK3//////////////////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIUrsFxQAACB+vAAAIRbsFxQAACB+8AAAICrsFxQAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAARyMVEAADwwEhDYAAALsBsQAACL3PAAAIZm0fYP8DAgG7AY0AAAi96wAACGZuFAghDYAAALsB
uwAACCMVEAADwgG9KAEACGZtaGwCvVoBAAhmbhQIIQ2AAQC7AbsAAAgRAGD/AwK9fgEACGZtaGwC
vZ0BAAhmbWhsAr2+AQAIZm1obAK90gEACGZtaGwC/QIA3ecA5uPV4d3i2/79AwDm3dvc6ADi4+ut
/83c1eDgAMMA4Onm2QDd6ADo4wDt4+msAMPoAOvd4OD+2uPg4OPrAO3j6QDV4OPi2wDd6OcA5uPp
6Nnnrf++4+LZqwDG4+PfANrj5gDd6ADd4gDo1eDgANvm1efn/tXi2ADj4gDo3NkA69Xo2eat/8Po
tOcA2uPg4OPr3eLbAO3j6a3+xdnZ5ADg6ebd4tsA3eis/8PoAOvd4OAA5uPV4QDj4gDd6OcA4+vi
ANXb1d3irf/I4wDKycUbx8nIAN3nAObj1eHd4tsA5t3b3Oj+4uPrrf+94+HZANbV198A1eLtAOjd
4dmr/87c3ecA293a6ADY49nn4rToAOvj5t8A693o3P7o3N3nAOrZ5ufd4+IA49oA6NzZANvV4dmt
/xC1G0wkaBtIJBjgfBpJCIAAKBDQIYkZSBpLAPAn+BpKEHhReBlLAPAh+AF9FEgAIhdLAPAb+BC9
cLUWSx6IACAYgBVNGKQVSAQ4IVgpUPvRE0wBICBwE0gBaEsbmwoC0GFgaRwBYAtLHoBwvRhHwEbY
QgAD0DAAAMxwAwLQHAIC8BwCAnlHBAiq8wMC8YkFCO2EDAgIAgAEAPwDAlgAAABg/wMC4CcAAxC1
EEwgeAAoFNAPSABoD0lBXAApDtABeQMpC9FCeQxLGHiQQgPQBzP/KPnRAuAJSAFwQnBjaADwA/gQ
vAG8AEcYR8BGYP8DAthCAAPjMAAAZEZGCKrzAwI=`), {
                'BPGE 1.10': decodeBase64(`XAEBR+gDAcFQBAJQPw==`),
            }),
        },
    },
    {
        id: 'custom-legendary-respawn',
        label: 'Legendary Respawn',
        description: 'Brings back the legendary Pokémon you knocked out instead of catching, to where you met them: Articuno, Zapdos, Moltres, Mewtwo, Lugia, Ho-Oh and Deoxys. A roaming Pokémon you knocked out, or that left with Roar, roams again at full HP. Legendaries your Pokédex has as caught stay gone.',
        payloads: {
            ...romPayloads(decodeBase64(`EwSWACsAAAAcAMa/wb/IvrvM0wDMv83Ku9HI//////////////////////////////+7AOfZ1+Pi
2ADX3NXi19n/////////////////////////////////xtnb2eLY1ebtAMrJxRvHycgA7ePpANbZ
1ej//////////////////9bp6ADY3djitOgA19Xo19wA1+Ph2QDW1dffrf/////////////////Q
3efd6ADo3NkA2Nng3erZ5u3h1eIA4+IAo8D/////////////////49oA1QDKycUbx8nIAL2/yM6/
zK3//////////////////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIUrsFiwAACB+vAAAIRbsFiwAACB+8AAAICrsFiwAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAAR72VAAAIZm4UCCENgAAAuwGBAAAIIxUQAAMTASENgAAAuwF3AAAIgwANgL3QAAAIZm1obAK9
9gAACGZtaGwCvR8BAAhmbWhsAr0zAQAIZm1obALN3NXg4ADDANbm3eLbANbV198A6NzZAODZ29ni
2NXm7f7KycUbx8nIAO3j6QDY3djitOgA19Xo19ys/77j4tmrAP0CAODZ29ni2NXm7QDKycUbx8nI
/tfV4dkA1tXX363/yOMA4Nnb2eLY1ebtAMrJxRvHycgA4tnZ2OcA6OP+1+Ph2QDW1dffrf+94+HZ
ANbV198A1eLtAOjd4dmr/87c3ecA293a6ADY49nn4rToAOvj5t8A693o3P7o3N3nAOrZ5ufd4+IA
49oA6NzZANvV4dmt/wAAAPC1gbAAJzGkIIgAKBDQJUsA8Eb4ACgJ0GCIAPAz+AAoBNEgiCBLAPA7
+AE3BDTr5x5NLWgfSC0YKIkAKB7Q6XwAKRvRHEsA8Cv4APAb+AAoFNFoaACQGUgpiSp7K2gYTgDw
H/gVSFgwAIhogQAgaHMBIOh0E0sA8BP4ATcSSAeAAbDwvQAoCtABOMEICEoSaCgyUVwHIhBAwUAB
IAhAcEcYRzBHPR4HCBUeBwjYQgAD3EIAA9AwAABBagQIKEACAhEXBAjRWBQIzHADAr4CkAC/ApEA
vQKSALwClgD1AgAA9gIAAPcCAAAAAMBG`), {
                'BPGE 1.10': decodeBase64(`XAEBR4ADAak=`),
            }),
        },
    },
    {
        id: 'custom-instant-eggs',
        label: 'Instant Egg Hatch & Day Care Egg',
        description: 'Hatches every Egg in your party on the spot, each with the usual hatching scene and nickname prompt. With no Eggs to hatch, or if you say no, the deliveryman offers to have the Day Care’s Egg ready right away, when the two Pokémon there can have one.',
        payloads: {
            ...romPayloads(decodeBase64(`+AOcARAAAAAEAMPIzc67yM4Av8HBzf/////////////////////////////////////C1ejX3ADi
4+u4AOPmANvZ6ADj4tkA4uPr////////////////////wtXo19wA6NzZAL/Bwc0A7ePpANfV5ubt
uADj5v///////////////9vZ6ADo3NkAvrvTAL27zL+05wC/wcEA5t3b3Oj////////////////V
69XtrQDQ3efd6ADo3NkA2Nng3erZ5u3h1eL/////////////////4+IAo8AA49oA1QDKycUbx8nI
AL2/yM6/zK3//////////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIUrsF9QAACB+vAAAIRbsF9QAACB+8AAAICrsF9QAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAARyMVEAADIwIhDYAAALsBngAACL3/AAAIZm4UCCENgAAAuwGeAAAIaCMVEAADmAK4cQAACCMV
EAADFgIhDYAAALsBlAAACCXCACcoEAC5dgAACL01AQAIZm1obAK9TQEACGZuFAghDYAAALsB6wAA
CCtmArsB1wAACCMVEAADBQIhDYAAALsB4QAACL2HAQAIZm1obAK9sgEACGZtaGwCveMBAAhmbWhs
Ar0bAgAIZm1obAK9LwIACGZtaGwC0+PpANzV6tkAv8HBzQDr3ejcAO3j6av+zdzV4OAAwwDc1ejX
3ADo3NnhAObd29zoAOLj66z/ztXf2QDb4+PYANfV5tkA49oA6NzZ4av/zdzV4OAAwwDc1erZAOjc
2QC+u9MAvbvMv7Tn/r/BwQDm2dXY7QDa4+YA7ePpAObd29zoANXr1e2s/87c2QC+u9MAvbvMvwDc
1ecA1eIAv8HB/ubZ1djtANrj5gDt4+kA4uPrq//O3NkAvrvTAL27zL8A1eDm2dXY7QDc1ecA1eL+
v8HBAOvV3ejd4tsA2uPmAO3j6av/xtnV6tkA6OvjAMrJxRvHycgA6NzV6ADb2ej+1eDj4tsA1egA
6NzZAL670wC9u8y/ANrd5ufoq/+94+HZANbV198A1eLtAOjd4dmr/87c3ecA293a6ADY49nn4rTo
AOvj5t8A693o3P7o3N3nAOrZ5ufd4+IA49oA6NzZANvV4dmt/wAAACBIACEBOQGAHUgAIQYiw3xb
B1sPBisA0QExZDABOvbRGUgBgHBHF0saiAEyEgQSDGQhUUMSSEAYBioK0sF8SQdJDwYpAtBkMAEy
9ecagAEgAOAAIAxJCIBwRwC1C0gAaAtJQBgLSwDwCfgAKAPQCksA8AT4ASAESQiAAL0YR8BGgEIC
ArxwAwLMcAMC2EIAA4AvAAD1nAQI8ZEECAdIAGgHSUAYB0maaBIaUhiaYPkikgAEOoNYi1D70XBH
2EIAAyQ2AAAA/AMC`), {
                'BPGE 1.10': decodeBase64(`XAEBRw==`),
            }),
        },
    },
    {
        id: 'custom-trade-evolution',
        label: 'Trade Evolution Without Trading',
        description: 'Evolves a Pokémon from your party that normally evolves by trading, such as Kadabra, Machoke, Graveler or Haunter, with the usual evolution scene. One that needs to hold an item when traded (Onix, Scyther, Seadra, Slowpoke, Poliwhirl, Porygon) must be holding it, and uses it up as in a trade. Evolving into a Johto Pokémon needs the National Pokédex.',
        payloads: {
            ...romPayloads(decodeBase64(`EQRBACkAAAAIAM7Mu76/AL/QycbPzsPJyP/////////////////////////////////I4wDo5tXY
3eLbAOTV5uji2eYA4tnZ2NnY////////////////////v+rj4OrZANUAysnFG8fJyADo3NXoANnq
4+Dq2ef//////////////9btAOjm1djd4tu4AObd29zoANXr1e2tANDd593o///////////////o
3NkA2Nng3erZ5u3h1eIA4+IA6NzZAKPi2P//////////////////2uDj4+YA49oA1QDKycUbx8nI
AL2/yM6/zK3//////////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIUrsFrQAACB+vAAAIRbsFrQAACB+8AAAICrsFrQAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAAR723AAAIZm0jFRAAA6gBuFEAAAglnwAnIQSABgC7BKoAAAgmDYBHASENgJwBuwGgAAAIfwAE
gCMVEAADEQEhDYAAALsBlgAACCe96QAACGZtaGwCvf8AAAhmbWhsAr3UAAAIZm1obAJobAK9VAEA
CGZtaGwC0dzd19wAysnFG8fJyADn3OPp4NgA2erj4OrZrP+74gC/wcEA19XitOgA2erj4OrZq//O
1d/ZANvj49gA19Xm2QDj2gDd6Kv//QIA2OPZ5+K06ADZ6uPg6tkA1u3+6ObV2N3i2637zePh2QDK
ycUbx8nIAOLZ2dgA6OMA3OPg2ADV4v7d6NnhAOvc2eIA6NzZ7bTm2QDo5tXY2dit/87c3ecA293a
6ADY49nn4rToAOvj5t8A693o3P7o3N3nAOrZ5ufd4+IA49oA6NzZANvV4dmt/wAAMLUA8CX4BAAB
IQAiDEsA8BH4BQAL0AxIDEkBYAZLG3gAIikAIAAHTADwBfgBJQNIBYAwvRhHIEe8cAMCzHADAm1m
BAhRFQ0ITEYAA4mgBQgDSACIZCFIQwJJQBhwR8BGvHADAoBCAgIHSABoB0lAGAdJmmgSGlIYmmD5
IpIABDqDWItQ+9FwR9hCAAMkNgAAAPwDAg==`), {
                'BPGE 1.10': decodeBase64(`XAEBRyADASU=`),
            }),
        },
    },
    {
        id: 'custom-espeon-umbreon',
        label: 'Espeon & Umbreon (Evolve Eevee)',
        description: 'Evolves a friendly Eevee from your party into Espeon or Umbreon, your choice, with the usual evolution scene. FireRed and LeafGreen have no clock, so this is the only way to get them. Eevee needs 220 friendship, as in a normal evolution, and the National Pokédex.',
        payloads: {
            ...romPayloads(decodeBase64(`JwTEAD8AAAAMAL/Nyr/JyAAtAM/HvMy/ycj///////////////////////////////++1e0A4+YA
4t3b3Oi4AOLjANfg49ffAOLZ2djZ2P//////////////uwDa5t3Z4tjg7QC/v9C/vwDZ6uPg6tnn
AN3i6OP//////////////7/Nyr/JyADj5gDPx7zMv8nIuADt4+nmAOTd19+t///////////////Q
3efd6ADo3NkA2Nng3erZ5u3h1eIA4+IAo8D/////////////////49oA1QDKycUbx8nIAL2/yM6/
zK3//////////////////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIUrsFFAEACB+vAAAIRbsFFAEACB+8AAAICrsFFAEACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAAR70eAQAIZm0jFRAAA2ADuFEAAAglnwAnIQSABgC7BBEBAAgmDYBHASENgJwBuwEHAQAIfwAE
gCMVEAADsQEhDYABALsB2wAACCtACLsA5QAACCENgAIAuwHvAAAIvU4BAAhmIxUQAAOzASchDYB/
ALsB/QAACGgjFRAAA6cBJyYNgEcBIQ2AhQC7Af0AAAi9aQEACGZtaGwCvX8BAAhmbWhsAr2SAQAI
Zm1obAKDAQWAvbcBAAhmbWhsAr3hAQAIZm1obAK9OQEACGZtaGwCaGwCvfUBAAhmbWhsAtHc3dfc
AL+/0L+/AOfc4+ng2ADZ6uPg6tms/7viAL/BwQDX1eK06ADZ6uPg6tmr/9Hc3dfcANrj5uEA59zj
6eDYAN3oAOjV39ms/87V39kA2+Pj2ADX1ebZAOPaAN3oq//9AgDd5+K06ADV4gC/v9C/v6v/w+gA
4tnZ2OcA6NzZAMi7zsPJyLvGAMrJxRu+v9L+2t3m5+it//0CtOcA2ubd2eLY59zd5ADd5/79A60A
w+gA2erj4OrZ5wDV6ACjo6Gt/73j4dkA1tXX3wDV4u0A6N3h2av/ztzd5wDb3droANjj2efitOgA
6+Pm3wDr3ejc/ujc3ecA6tnm593j4gDj2gDo3NkA29Xh2a3/ADC1APCx+AQAICEA8CT4FElIgAIl
3CgA0wAlIAALIQDwGviFKADQASUOSAWAML0SoAIhCCJv4BC1DUgOSQFgAPCT+AhJCYjEMQEiBUsb
eAdMAPAE+BC9ACIDSxhHIEfARrxwAwLMcAMCkTMECFEVDQhMRgADiaAFCL/Nyr/JyP8Az8e8zL/J
yP/wtYWwDQAXACtOACMCyAAiBsYBM6tC+dEnThwgwBsAIToALaNsHhtdJUwA8C/4BwAAISRMAPAq
+A4hAJEBlQKWACEDkQIhBJE4AAgiAiMeTADwHPgOIQCRAZUAIQKROAACIQAiAiMZTADwEPgAICkA
OgACIxZMAPAJ+AAgFUwA8AX4Dkj/IQGABbDwvSBHELWIsAAjnABsRCBgBHgBMP8s+9EDMIAIgAAB
M4tC8tFoRv/3pv8IsBC9sPsDAsxwAwK5DQoIya4PCHk0EQhpMBEIfQMKCB2fDwgCBAYHCQsNDgNI
AIhkIUhDAklAGHBHwEa8cAMCgEICAgdIAGgHSUAYB0maaBIaUhiaYPkikgAEOoNYi1D70XBH2EIA
AyQ2AAAA/AMC`), {
                'BPGE 1.10': decodeBase64(`XAEBR+gDASXEBBaNDQoIoa4PCFE0EQhBMBEIUQMKCPWe`),
            }),
        },
    },
    {
        id: 'custom-move-tutor',
        label: 'Move Relearner, Deleter & Tutor Reset',
        description: 'Teaches a Pokémon from your party a move it could have learned by level up, like the Move Relearner but free, or makes it forget any move, HMs included. It can also let every one-time move tutor teach its move again.',
        payloads: {
            ...romPayloads(decodeBase64(`EATrACgAAAAUAMfJ0L8AzL/Gv7vMyL/MAC0Avr/Gv86/zP////////////////////+74tgA6NzZ
AOjp6OPm5wDo2dXX3ADV29Xd4v//////////////////zNng2dXm4gDVAOHj6tm4ANrj5tvZ6ADj
4tm4/////////////////+PmAODZ6ADo3NkA4ePq2QDo6ejj5ucA6NnV19z////////////////V
29Xd4q0A0N3n3egA6NzZANjZ4N3q2ebt4dXi////////////////4+IAo8AA49oA1QDKycUbx8nI
AL2/yM6/zK3//////////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIUrsFnQEACB+vAAAIRbsFnQEACB+8AAAICrsFnQEACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAARyMVEAADEwO4SgAACL2nAQAIZm4UCCENgAAAuwGZAAAIvfIBAAhmbSXbACchBIAGALsElgAA
CCVIASENgAEAuwEhAQAIIQWAAAC7ASsBAAgl4AAnaGwCvc8BAAhmbhQIIQ2AAAC7AT8BAAi98gEA
CGZtJZ8AJyEEgAYAuwSWAAAIJUgBIQ2AAQC7ASEBAAh/AASAJd8AIQ2AAQC7ATUBAAi9DgIACGZt
lwEl3AAnlwAhBYAEALsBlgAACCXeAL0rAgAIZm4UCCENgAAAuwGTAQAIJd0AvT4CAAhmbWhsAr1M
AgAIZm1obAK9bwIACGZtaGwCvZMCAAhmbWhsAr2rAgAIZm4UCCENgAAAuwGTAQAIKsACKsECKsIC
KsMCKsQCKsUCKsYCKscCKsgCKskCKsoCKssCKswCKs0CKs4CKt4CKt8CKuACveMCAAhmbWhsAr0M
AwAIZm1obAK9IAMACGZtaGwCzdzV4OAAwwDc2eDkANUAysnFG8fJyP7m2eHZ4dbZ5gDVAOHj6tms
/8nmAOfc1eDgAMMA4dXf2QDj4tkA2uPm29no/tUA4ePq2az/0dzd19wAysnFG8fJyADn3OPp4NgA
3egA1tms/9Hc3dfcAOHj6tkA59zj6eDYAN3oANrj5tvZ6Kz/x9Xf2QD9AgDa4+bb2ej+/QOs//0C
ANrj5tvj6AD9A6v/u+IAv8HBANjj2efitOgA3+Lj6wDV4u3+4ePq2ecA7dnoq//O3Nnm2bTnAOLj
AOHj6tkA2uPmAN3oAOjj/ubZ4dnh1tnmrf/9AgDf4uPr5wDj4uDtAOPi2f7h4+rZq//J5gDn3NXg
4ADDAODZ6ADo3NkA4ePq2QDo6ejj5uf+6NnV19wA6NzZ3eYA4ePq2ecA1dvV3eKs/77j4tmrAL/q
2ebtAOHj6tkA6Ono4+YA693g4P7o2dXX3ADV29Xd4q3/vePh2QDW1dffANXi7QDo3eHZq//O3N3n
ANvd2ugA2OPZ5+K06ADr4+bfAOvd6Nz+6Nzd5wDq2ebn3ePiAOPaAOjc2QDb1eHZrf8AAAdIAGgH
SUAYB0maaBIaUhiaYPkikgAEOoNYi1D70XBH2EIAAyQ2AAAA/AMC`), {
                'BPGE 1.10': decodeBase64(`XAEBRw==`),
            }),
        },
    },
    {
        id: 'custom-reusable-tms',
        label: 'Reusable TMs',
        description: 'Teaching a move with a TM no longer uses the TM up, as in later games, so one TM can teach as many Pokémon as you like. HMs work as before, and selling a TM at a shop still sells it. It lasts until the game is closed or reset; talk to the deliveryman again after a reset, or to turn it off.',
        payloads: {
            ...romPayloads(decodeBase64(`FQSJAC0AAAAYAMy/z827vMa/AM7H5//////////////////////////////////////O2dXX3ADV
AM7HANXb1d3iANXi2ADV29Xd4v//////////////////ztnV19zd4tsA1QDh4+rZAOvd6NwA1QDO
xwDi4////////////////+Dj4tvZ5gDp59nnAOjc2QDOxwDp5K0A0N3n3ej////////////////o
3NkA2Nng3erZ5u3h1eIA4+IA6NzZAKPi2P//////////////////2uDj4+YA49oA1QDKycUbx8nI
AL2/yM6/zK3//////////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIUrsFowAACB+vAAAIRbsFowAACB+8AAAICrsFowAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAARx9g/wMCAbsBdAAACL2tAAAIZm4UCCENgAAAuwGZAAAIIxUQAAMzAb3RAAAIZm1obAK9DAEA
CGZuFAghDYABALsBmQAACCMVEAADRAG9NQEACGZtaGwCvUwBAAhmbWhsAr1gAQAIZm1obALN3NXg
4ADDAOHV39kA7ePp5gDOx+cA4NXn6P7a4+bZ6tnmrP++4+LZqwDO2dXX3N3i2wDVAOHj6tkA6+Pi
tOgA6efZ/unkAOjc2QDOxwDp4ujd4ADt4+kA5tnn2eit/9Pj6eYAzsfnAODV5+gA2uPm2erZ5q3+
xdnZ5ADd6ADo3NXoAOvV7az/zsfnANvZ6ADp59nYAOnkANXb1d3irf+94+HZANbV198A1eLtAOjd
4dmr/87c3ecA293a6ADY49nn4rToAOvj5t8A693o3P7o3N3nAOrZ5ufd4+IA49oA6NzZANvV4dmt
/wAAcLUPSx6IACAYgA5NEaQOSAQ4IVgpUPvRDExgcAEgIHALSAFoSxubCgLQYWBpHAFgA0segHC9
BUgAIQFwcEfARggCAAQA/AMCtAAAAGD/AwLgJwAD8LUgTCB4ACg00B9PuIvABzDReGgdSYhCBtAj
SYhCEtAiSYhCD9AL4BlNECYZSShoiEIC0Sh5ACgK0Sg1AT720QAgYHAW4BpIAGgAKBLQA+ARSACK
ACgN0WB4ACgK0Q9IAIgPSUEaMikE0gEhYXANSwDwBvhjaADwA/jwvAG8AEcYR8BGYP8DAoAjAAOB
JhIIYEMAA9WXEgicsAMCLK0DAiEBAADp1wkIKYkSCN2JEgiMsAMC`), {
                'BPGE 1.10': decodeBase64(`XAEBR8gDAVnQAwGt4AMJvdcJCAGJEgi1`),
            }),
        },
    },
    {
        id: 'custom-physical-special-split',
        label: 'Gen 4 Physical/Special Split',
        description: 'Every damaging move is physical or special on its own, as from Diamond and Pearl on, instead of by its type: Fire Punch, Crunch and Dragon Claw hit with Attack, Shadow Ball, Hyper Beam and Sludge Bomb with Sp. Atk, and Hidden Power and Weather Ball are always special. Stat stages, Reflect and Light Screen, burns, Choice Band, Huge Power, Pure Power, Hustle’s boost, Guts, Counter and Mirror Coat follow the move’s kind too. In a link battle one of the two consoles runs the battle for both players, so use the card on both. It lasts until the game is closed or reset; talk to the deliveryman again after a reset, or to turn it off.',
        payloads: {
            ...romPayloads(decodeBase64(`JgRlAT4AAAAcAMG/yAClAMrC083DvbvGus3Kv73Du8YAzcrGw87////////////////H4+rZ5wDc
3egA1ecA3eIA4NXo2eYA29Xh2ef/////////////////v9XX3ADh4+rZAN3nAOTc7efd19XgAOPm
/////////////////////+fk2dfd1eAA4+IA3ejnAOPr4rgA4uPoANbtAN3o5//////////////o
7eTZrQDQ3efd6ADo3NkA2Nng3erZ5u3h1eL/////////////////4+IAo8AA49oA1QDKycUbx8nI
AL2/yM6/zK3//////////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIUrsFogAACB+vAAAIRbsFogAACB+8AAAICrsFogAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAARx9g/wMCAbsBdAAACL2sAAAIZm4UCCENgAAAuwGYAAAIIxUQAAMHAb3NAAAIZm1obAK97QAA
CGZuFAghDYABALsBmAAACBEAYP8DAr0KAQAIZm1obAK9HwEACGZtaGwCvTMBAAhmbWhsAtHV4ugA
6NzZAOTc7efd19Xguufk2dfd1eD+5+Tg3eis/77j4tmrAMPoAODV5+jnAOni6N3gAO3j6QDm2efZ
6K3/ztzZAOfk4N3oAN3nAOPirf7F2dnkAN3oAOPirP+81dffAOjjAOjc2QDj4NgA69Xtq/+94+HZ
ANbV198A1eLtAOjd4dmr/87c3ecA293a6ADY49nn4rToAOvj5t8A693o3P7o3N3nAOrZ5ufd4+IA
49oA6NzZANvV4dmt/wAAADC1Ck0MpI8ggAAEOCFYKVD70QdMASAgcAZIAWhLG5sKAtBhY2kcAWAw
vcBGAPwDAmD/AwLgJwAD8LV0THROsIvAB0fRYXgAKQHQAPCX+CB4ACg/0DBob0mIQjvRbkgAaAAo
N9FtSAdoeA4EKDLRbEgAiHShwgiJXAciAkDRQAElDUAMIUFDZ0hAGIZ4ZkgAaMF8OngAKQXQDCoB
0UsGAdQ/Jg5ACT72D65CE9AFKhbQwyoU0IYqEtAMKgvReXhdSAEpB9gA0VpIAHigcADwkfgCIWFw
Y2vwvAG8hkYYR1RIAPBn+AYAIQA4MQDwaPhRSADwX/gHACEdAPBj+ADwZ/gALSPQcIjxjbopAdFB
CEAYICFxXCUpAdBKKQDRQAA3KQHRQgiAGPJsPikE0QAqBdBCCIAYAuDSBgDVQAgwgXB+MHe4iHiB
uH54dxXgMIlwgDB/cHZ4ibiAeH+4dgAg8Y26KQDR8IUgIrFcRCkA0LBU8WwQIpFD8WQBIarnALUA
IGBwAikR0ADwIvgqSADwEfgBACAdAPAV+CVIAPAK+AEAIAA4MADwC/gAvaB4APAh+AC9AHhYIUhD
HElAGHBHUCIA4DAiBDqDWItQ+9FwRxlIAHgZSQhcwAeADxhJQBgBiEoISkDSB9IPUwAaQ1FAAYBw
RxAhQUMSSAkYSmiLaEtgimAKe0t7C3NKc3BHYP8DAoAjAAOBWwEIxDsCAnA9AgJGPQIC0OckCOQ/
AgLgOwICZz0CAmg9AgLSOwIC2j0CAog+AgL/3/7///8FAH8sAh/Mv/CnnfvV7/2f2Y/u+////Vc0
WoFP1o99/mawovnbUQAAwEY=`), {
                'BPGE 1.10': decodeBase64(`XAEBR+AEAaw=`),
            }),
        },
    },
    {
        id: 'custom-exp-share',
        label: 'Exp. Share for the Whole Party',
        description: 'Every Pokémon in your party gets experience from each battle, as with the Exp. Share of later games: the ones that battled get all of it instead of a share, and the rest get half. Eggs and fainted Pokémon get none. Trainer battles, traded Pokémon and the Lucky Egg still give their boosts, and the whole party gains EVs. It lasts until the game is closed or reset; talk to the deliveryman again to turn it off.',
        payloads: {
            ...romPayloads(decodeBase64(`KwTyAEMAAAAQAL/Syq0AzcK7zL8AwMnMALvGxv/////////////////////////////O3NkA69zj
4NkA5NXm6O0A2+bj6+f/////////////////////////v+rZ5u0AysnFG8fJyADd4gDt4+nmAOTV
5ujt/////////////////9vZ6OcAv9LKrQDa5uPhANnV19wA1tXo6ODZrf/////////////////Q
3efd6ADo3NkA2Nng3erZ5u3h1eIA4+IAo8D/////////////////49oA1QDKycUbx8nIAL2/yM6/
zK3//////////////////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIUrsFogAACB+vAAAIRbsFogAACB+8AAAICrsFogAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAARx9g/wMCAbsBdAAACL2sAAAIZm4UCCENgAAAuwGYAAAIIxUQAANfAb3fAAAIZm1obAK9NgEA
CGZuFAghDYABALsBmAAACBEAYP8DAr1jAQAIZm1obAK9eAEACGZtaGwCvYwBAAhmbWhsAs3c1eDg
AO3j6eYA69zj4NkA5NXm6O0A29noAL/Syq3+2ubj4QDZ6tnm7QDW1ejo4Nms/77j4tmrAM7c4+fZ
AOjc1egA1tXo6ODZANvZ6ADV4OD+6NzZAL/Syq24AOjc2QDm2efoANvZ6ADc1eDarfvD6ADg1efo
5wDp4ujd4ADt4+kA5tnn2eit/9Pj6eYA69zj4NkA5NXm6O0A29no5wC/0sqt/sXZ2eQA3egA6NzV
6ADr1e2s/7zV198A6OMA6NzZAOPg2ADr1e2r/73j4dkA1tXX3wDV4u0A6N3h2av/ztzd5wDb3dro
ANjj2efitOgA6+Pm3wDr3ejc/ujc3ecA6tnm593j4gDj2gDo3NkA29Xh2a3/AAAwtQpNDKRBIIAA
BDghWClQ+9EHTAEgIHAGSAFoSxubCgLQYWBpHAFgML3ARgD8AwJg/wMC4CcAA/C1M0wzSIGLyQdV
0SF4AClS0ABoMEmIQk7RMEgAaAAoStEvSABoQQ4EKUXRAHgjKELRLE0taCxPOH8CKB3QASg60SpI
AHhYIUhDKUlAGAGIKiKGXBwgSEMmSUAYQHpwQwchBt9ggAAgI0kIgCh0APAo+FMhaFQCIDh3Lnxh
iADwIPjwQMAHEtRkIHBDHEqAGMJ8UgdSDwIqDtFWIoJaACoK0FMj6lwBIAJD6lRJCAApANEBIVAi
qVJjaPC8AbyGRhhHCkgAeIAHwA8MShBccEdg/wMCgCMAA4FbAQjEOwICcD0CAuQ/AgLAPwICaT0C
AuA7AgJQIyUITj8CAko/AgKAQgIC`), {
                'BPGE 1.10': decodeBase64(`XAEBR0AEASw=`),
            }),
        },
    },
    {
        id: 'custom-pp-max',
        label: 'Max PP for All Moves',
        description: 'Gives every move of every Pokémon in your party the most PP it can have, as if it had three PP Ups, and fills it up.',
        payloads: {
            ...romPayloads(decodeBase64(`AwQkABsAAAAcAMrKAMe70v/////////////////////////////////////////////H4+rZ5wDV
6ADa6eDgAOTj69nm////////////////////////////v+rZ5u0A4ePq2QDd4gDt4+nmAOTV5ujt
ANvZ6Of//////////////+jc2QDh4+foAMrKAN3oANfV4gDc1erZrQDQ3efd6P/////////////o
3NkA2Nng3erZ5u3h1eIA4+IA6NzZAKPi2P//////////////////2uDj4+YA49oA1QDKycUbx8nI
AL2/yM6/zK3//////////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIUrsFcgAACB+vAAAIRbsFcgAACB+8AAAICrsFcgAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAAR718AAAIZm4UCCENgAAAuwFoAAAIIxUQAAPbAL25AAAIZm1obAK95wAACGZtaGwCvfsAAAhm
bWhsAs3c1eDgAMMA5tXd59kA6NzZAMrKAOPaANnq2ebt/uHj6tkA3eIA7ePp5gDk1ebo7QDo4wDo
3NkA4dXsrP++4+LZqwC/6tnm7QDh4+rZANzV5wDo3NkA4ePn6P7KygDd6ADX1eIA3NXq2a3/vePh
2QDW1dffANXi7QDo3eHZq//O3N3nANvd2ugA2OPZ5+K06ADr4+bfAOvd6Nz+6Nzd5wDq2ebn3ePi
AOPaAOjc2QDb1eHZrf8AAAAwtYGw/yAAkAtMBiXgfEAHQA8CKAnRIAAVIWpGB0sA8An4IAAGSwDw
BfhkNAE97dEBsDC9GEfARoBCAgIlOwQIgXoECA==`), {
                'BPGE 1.10': decodeBase64(`XAEBRw==`),
            }),
        },
    },
    {
        id: 'custom-stat-judge',
        label: 'IV/EV Stat Judge',
        description: 'Choose a Pokémon from your party and the deliveryman tells you its nature, its six IVs (0 to 31) and its six EVs with their total (at most 510). It works on Eggs too.',
        payloads: {
            ...romPayloads(decodeBase64(`+wOyABMAAAAYAMPQur/QAM3Ou84AxM++wb/////////////////////////////////D0Oe4AL/Q
5wDV4tgA4tXo6ebZ////////////////////////////venm3ePp5wDV1uPp6ADt4+nmAMrJxRvH
ycis/////////////////87c2QDY2eDd6tnm7eHV4gDj4gDo3NkAo+LY///////////////////a
4OPj5gDj2gDVAMrJxRvHycgAvb/Izr/MANfV4v//////////////59zj6wDd6OcAw9DnuAC/0OcA
1eLYAOLV6Onm2a3//////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIUrsFdgAACB+vAAAIRbsFdgAACB+8AAAICrsFdgAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAAR72AAAAIZm0jFRAAA0gCuFEAAAglnwAnIQSABgC7BHQAAAgjFRAAA20AZwDAAQJmbWhsAr2e
AAAIZm1obALR3N3X3ADKycUbx8nIAOfc4+ng2ADDAN7p2NvZrP/O3N3nANvd2ugA2OPZ5+K06ADr
4+bfAOvd6Nz+6Nzd5wDq2ebn3ePiAOPaAOjc2QDb1eHZrf/wtYiwQkgAiGQhSEM/TCQYACUAJych
Bi0A0xQhSRkgAD1LAPBx+GkAakZQUgYtANM/GAE1DC3t0WpGF4MAIAeQOqU0TgAnKHgBNf0oEND/
KAbRB5kAKQPQDQAAJweX8ucwcAE2/yju0Qiw8LwBvABHKHgBNTAoINIQKBbSACgK0SAAAiEyACRL
APA++DB4/yjZ0AE2+ucgACBLAPA1+IAAH0kJWADwD/jN5xA4QADAGWlGCFoA8A/4xecwOAwnR0MH
lS+lv+cIeP8oA9AwcAExATb453BHMLUAJBKlKYgCNQEpC9AAIohCAtNAGgEy+ucUQ/PQoTIycAE2
7+ehMDBwATYwvAG8AEcYR8BGgEICArxwAwIAwAECkTMECEVmBAhsGEYI6ANkAAoAAQD9ALTnAOLV
6Onm2QDd5wD9Aa3+wtnm2QDV5tkA3ejnAMPQ57gA4+noAOPaAKSi8Pv9MPvD6OcAv9DnANXY2ADp
5ADo4wD9HADj2gCmoqHw+/0x/wDCygD9ELgAu87Ou73FAP0RuAC+v8C/yM2/AP0S/s3KrQC7zsUA
/RS4AM3KrQC+v8AA/RW4AM3Kv7++AP0T/8BGB0gAaAdJQBgHSZpoEhpSGJpg+SKSAAQ6g1iLUPvR
cEfYQgADJDYAAAD8AwI=`), {
                'BPGE 1.10': decodeBase64(`XAEBR0QDApwS`),
            }),
        },
    },
    {
        id: 'custom-hidden-power',
        label: 'Hidden Power Checker & Max IVs',
        description: 'Choose a Pokémon from your party and the deliveryman tells you the type and power of its Hidden Power, then offers to raise all six of its IVs to 31, the maximum, which makes its Hidden Power Dark-type at power 70. Its stats update right away.',
        payloads: {
            ...romPayloads(decodeBase64(`BQTJAB0AAAAIAMLDvr6/yADKydG/zAAtAMPQzf////////////////////////////+93NnX3wDd
6LgA6NzZ4gDh1ewA3ej/////////////////////////zdnZANUAysnFG8fJyLTnAMLDvr6/yADK
ydG/zLj//////////////+jc2eIA5tXd59kA1eDgAN3o5wDD0OcA6OMApKL////////////////d
2gDt4+kA4N3f2a0A0N3n3egA6NzZAKPA////////////////////2Nng3erZ5u3h1eIA49oA1QC9
v8jOv8yt/////////////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIUrsF0gAACB+vAAAIRbsF0gAACB+8AAAICrsF0gAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAAR73cAAAIZm0jFRAAA3QCuFEAAAglnwAnIQSABgC7BM8AAAgmDYBHASENgJwBuwHFAAAIfwAE
gCMVEAADdQGDAgWAvR4BAAhmbb1GAQAIZm4UCCENgAAAuwG7AAAIIxUQAAOjASMVEAADSAGDAgWA
vWcBAAhmbWhsAr2mAQAIZm1obAK9/wAACGZtaGwCaGwCvboBAAhmbWhsAtHc4+fZAMLDvr6/yADK
ydG/zADn3OPp4NgAw/7X3NnX36z/u+IAv8HBAN/Z2eTnAN3o5wDk4+vZ5gDc3djY2eKr//0CtOcA
wsO+vr/IAMrJ0b/MAN3n/v0Drujt5Nm4AOTj69nmAP0Erf/N3NXg4ADDAObV3efZANXg4ADd6OcA
w9Dn/ujjAKSirP+74OAA3ejnAMPQ5wDV5tkApKIA4uPrq/vD6OcAwsO+vr/IAMrJ0b/MAN3n/v0D
rujt5Nm4AOTj69nmAP0Erf+94+HZANbV198A1eLtAOjd4dmr/87c3ecA293a6ADY49nn4rToAOvj
5t8A693o3P7o3N3nAOrZ5ufd4+IA49oA6NzZANvV4dmt//C1APBZ+AQAACUAJgAnIAAnIckZJ0sA
8ED4QQgBIhBAEUC4QLlABUMOQwE3Bi/u0SggcEM/IQbfHjAYSUiADyBoQz8hBt8BMAkoANMBMADw
Hvjwvf8g/+dwtYGwBgAA8Cv4BAAnJQEgMEB2CB4wAJAgACkAakYKSwDwD/gBNS0t8dEgAAdLAPAI
+AGwcL0HIUFDBUgJGAVIBUsYR7xwAwIlOwQIJRwECGzNJAjwHAICrcgACJEzBAgDSACIZCFIQwJJ
QBhwR8BGvHADAoBCAgIHSABoB0lAGAdJmmgSGlIYmmD5IpIABDqDWItQ+9FwR9hCAAMkNgAAAPwD
Ag==`), {
                'BPGE 1.10': decodeBase64(`XAEBR+gDAUg=`),
            }),
        },
    },
    {
        id: 'custom-hidden-power-type',
        label: 'Hidden Power Type Changer',
        description: 'Choose a Pokémon from your party, then physical or special and one of the eight types of that kind: its Hidden Power becomes that type at power 70, the most there is. Its IVs become 30 or 31 each, with HP and Attack at 31, and its stats update right away.',
        payloads: {
            ...romPayloads(decodeBase64(`IQTJADkAAAAYAMLDvr6/yADKydG/zADO08q///////////////////////////////+74u0A6O3k
2bgA5OPr2eYAqKH/////////////////////////////wd3q2QDVAMrJxRvHyci05wDCw76+v8gA
ysnRv8z//////////////+jc2QDo7eTZAO3j6QDX3OPj59mtANDd593o///////////////////o
3NkA2Nng3erZ5u3h1eIA4+IA6NzZAKPi2P//////////////////2uDj4+YA49oA1QDKycUbx8nI
AL2/yM6/zK3//////////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIUrsF2AAACB+vAAAIRbsF2AAACB+8AAAICrsF2AAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAAR73iAAAIZm0jFRAAA0wDuFEAAAglnwAnIQSABgC7BNUAAAgmDYBHASENgJwBuwHLAAAIfwAE
gL0lAQAIZiMVEAADRwEnIQ2AfwC7AcEAAAgZBoANgL1DAQAIZiMVEAADMQEnIQ2AfwC7AcEAAAgj
FRAAA1YBvU8BAAhmbWhsAr19AQAIZm1obAK9BgEACGZtaGwCaGwCvZEBAAhmbWhsAtHc4+fZAMLD
vr6/yADKydG/zADn3OPp4NgAw/7X3NXi29ms/7viAL/BwQDf2dnk5wDd6OcA5OPr2eYA3N3Y2Nni
q/+7AOTc7efd19XgAOPmANUA5+TZ193V4ADo7eTZrP/R3N3X3ADo7eTZrP++4+LZqwD9ArTnAMLD
vr6/yADKydG/zP7d5wD9A67o7eTZuADk4+vZ5gCooa3/vePh2QDW1dffANXi7QDo3eHZq//O3N3n
ANvd2ugA2OPZ5+K06ADr4+bfAOvd6Nz+6Nzd5wDq2ebn3ePiAOPaAOjc2QDb1eHZrf8AMKACIQgi
ruAAtYiwAPAS+AchSEMnSUAYACFqRlBQBzAEMSAp+dFoRgghByIA8FT4CLAAvRxIgIgJIUhDATBw
RxC1//f3/x5JDIgAGQDwJPgVSICIwAAAGYAAAzAA8AH4EL1wtYGwBgAA8Kb4BAAnJQEgMEB2CB4w
AJAgACkAakYKSwDwD/gBNS0t8dEgAAhLAPAI+AGwcL0HIUFDBUgJGAVIBksYR8BGvHADAiU7BAgl
HAQIbM0kCPAcAgKtyAAIzHADAsrC083DvbvG/wDARs3Kv73Du8b/8LWFsA0AFwArTgAjAsgAIgbG
ATOrQvnRJ04cIMAbACE6AC2jbB4bXSVMAPAv+AcAACEkTADwKvgOIQCRAZUClgAhA5ECIQSROAAI
IgIjHkwA8Bz4DiEAkQGVACECkTgAAiEAIgIjGUwA8BD4ACApADoAAiMWTADwCfgAIBVMAPAF+A5I
/yEBgAWw8L0gRxC1iLAAI5wAbEQgYAR4ATD/LPvRAzCACIAAATOLQvLRaEb/96b/CLAQvbD7AwLM
cAMCuQ0KCMmuDwh5NBEIaTARCH0DCggdnw8IAgQGBwkLDQ4DSACIZCFIQwJJQBhwR8BGvHADAoBC
AgIHSABoB0lAGAdJmmgSGlIYmmD5IpIABDqDWItQ+9FwR9hCAAMkNgAAAPwDAg==`), {
                'BPGE 1.10': decodeBase64(`XAEBR8wDAUiwBBaNDQoIoa4PCFE0EQhBMBEIUQMKCPWe`),
            }),
        },
    },
    {
        id: 'custom-ev-training',
        label: 'EV Reset & Training',
        description: 'Choose a Pokémon from your party, reset its EVs to 0 if you like, then pick the stats to max out, 252 each and 510 in total. Its stats update when you’re done.',
        payloads: {
            ...romPayloads(decodeBase64(`BgRqAB4AAAAAAL/QAM7Mu8PIw8jB///////////////////////////////////////O5tXd4gDr
3ejc4+noANbV6Ojg3eLb////////////////////////zNnn2egA1QDKycUbx8nItOcAv9DnAOPm
AOHV7P///////////////+jc2QDn6NXo5wDt4+kA19zj4+fZrQDQ3efd6P/////////////////o
3NkA2Nng3erZ5u3h1eIA4+IA6NzZAKPi2P//////////////////2uDj4+YA49oA1QDKycUbx8nI
AL2/yM6/zK3//////////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIUrsF4gAACB+vAAAIRbsF4gAACB+8AAAICrsF4gAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAAR73sAAAIZm0jFRAAAywDuFEAAAglnwAnIQSABgC7BN8AAAgmDYBHASENgJwBuwHVAAAIfwAE
gL0iAQAIZm4UCCENgAAAuwGUAAAIIxUQAANFAb1EAQAIZiMVEAADXgEnIQ2AfwC7AcQAAAgjFRAA
A1MBgwIFgL12AQAIZm25lAAACCMVEAADrAG9ggEACGZtaGwCvQoBAAhmbWhsAmhsAr2bAQAIZm1o
bALR3N3X3ADKycUbx8nIAOfc4+ng2ADDAOjm1d3irP+74gC/wcEA19XitOgA6ObV3eIA7dnoq//M
2efZ6ADV4OAA49oA/QK05/6/0OcA6OMAoQDa3ebn6Kz/0dzd19wAv9DnAOfc4+ng2ADDAOHV7Kz+
yubZ5+cAvADr3NniAO3j6bTm2QDY4+LZrf/9AwC/0OfwAP0Erf+74OAA2OPi2asAwePj2ADg6dff
uP79Aqv/ztzd5wDb3droANjj2efitOgA6+Pm3wDr3ejc/ujc3ecA6tnm593j4gDj2gDo3NkA29Xh
2a3/AAAAMLWBsADwwvgEAAAgAJAaJSAAKQBqRipLAPBI+AE1IC320QGwML0kSAYhCCJS4PC1gbAA
8Kv4BAAeSAeIACUAJr5CBtAgABohiRkcSwDwLvgtGAE2Bi7z0R1OdhsA1QAm/C4A2fwmIAAaIckZ
E0sA8B34hkIA0gYAAJYgABohyRlqRg9LAPAS+AlIRoC/AApJyVkNSA1LAPAJ+AGw8L0AtQDwdPgH
SwDwAfgAvRhHwEa8cAMCzHADApSwPwiRMwQIJTsECCUcBAjwHAICrcgACP4BAADwtYWwDQAXACFO
ACMCyAAiBsYBM6tC+dEdThwgwBsAIToAI6NsHhtdG0wA8C/4BwAAIRpMAPAq+A4hAJEBlQKWACED
kQIhBJE4AAgiAiMUTADwHPgOIQCRAZUAIQKROAACIQAiAiMPTADwEPgAICkAOgACIwxMAPAJ+AAg
C0wA8AX4BEj/IQGABbDwvSBHwEaw+wMCzHADArkNCgjJrg8IeTQRCGkwEQh9AwoIHZ8PCAIEBgcJ
Cw0OA0gAiGQhSEMCSUAYcEfARrxwAwKAQgICB0gAaAdJQBgHSZpoEhpSGJpg+SKSAAQ6g1iLUPvR
cEfYQgADJDYAAAD8AwI=`), {
                'BPGE 1.10': decodeBase64(`XAEBR9wDAtCukAQWjQ0KCKGuDwhRNBEIQTARCFEDCgj1ng==`),
            }),
        },
    },
    {
        id: 'custom-pokerus',
        label: 'Pokérus for Your Party',
        description: 'Gives every Pokémon in your party Pokérus, which doubles the EVs they earn in battle.',
        payloads: {
            ...romPayloads(decodeBase64(`9gNxAA4AAAAUAMrJxRvMz83///////////////////////////////////////////+719zj46v/
////////////////////////////////////////////uwDo3eLtAOrd5unnAOjc1egA3Nng5Of/
/////////////////////8rJxRvHycgA2+bj6wDn6Obj4tvZ5q0A0N3n3ej////////////////o
3NkA2Nng3erZ5u3h1eIA4+IA6NzZAKPi2P//////////////////2uDj4+YA49oA1QDKycUbx8nI
AL2/yM6/zK3//////////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIUrsFcgAACB+vAAAIRbsFcgAACB+8AAAICrsFcgAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAAR718AAAIZm4UCCENgAAAuwFoAAAIIxUQAAP7AL3bAAAIZm1obAK9BQEACGZtaGwCvR0BAAhm
bWhsAsrJxRvMz80A3ecA1QDo3eLtAOrd5unnAOjc1ej+3Nng5OcAysnFG8fJyADb5uPrAOfo5uPi
29nmrfvR1eLoAO3j6eYA5NXm6O0AysnFG8fJyP7o4wDX1ejX3ADd6Kz/u9fc4+OrANPj6eYA5NXm
6O0AysnFG8fJyP7X1enb3OgAysnFG8zPzav/zejV7QDc2dXg6NztAOPp6ADo3Nnm2av/ztzd5wDb
3droANjj2efitOgA6+Pm3wDr3ejc/ujc3ecA6tnm593j4gDj2gDo3NkA29Xh2a3/ADC1CUwGJeB8
AyEIQAIoBdEgAAMhACISIwDwKfhkNAE98dEwvAG8AEeAQgICyQbKDohCANNAGpFCAdBJCPjncEcw
tQQATQAgaBgh//fv/xyhCFzoQAMhCEAMIUhDIDAgGDC8ArwIRwFoQGhIQHBH8LUHAAy0//fk/wQA
OAD/9/P/BQAMvJEIiQBkGAMhEUDJACZobkAyAMpAEgYSDv8giECGQxgAiEAGQ25AJmCbGgggAUCL
QLiLwBi4g/C8AbwAR+S02Jx4bOGx0pNyY8mNxodOSzktNiceGw==`), {
                'BPGE 1.10': decodeBase64(`XAEBRw==`),
            }),
        },
    },
    {
        id: 'custom-friendship',
        label: 'Friendship Checker & Max Friendship',
        description: 'Choose a Pokémon from your party and the deliveryman tells you its friendship, out of 255, then offers to raise it to the maximum for that Pokémon or for your whole party. Pokémon that evolve through friendship, such as Pichu, Golbat and Chansey, then evolve at their next level up.',
        payloads: {
            ...romPayloads(decodeBase64(`+QOsABEAAAAQAMDMw7/Ivs3Cw8oAvcK/vcW/zP/////////////////////////////C4+sA1+Dj
59kA1ebZAO3j6az/////////////////////////////zdnZANzj6wDa5t3Z4tjg7QDVAMrJxRvH
ycgA3ee4/////////////+jc2eIA4dXf2QDd6ADj5gDt4+nmAOTV5ujtANXn///////////////a
5t3Z4tjg7QDV5wDX1eIA1tmtANDd593oAOjc2f//////////////2Nng3erZ5u3h1eIA4+IAo8AA
49oA1QC9v8jOv8yt/////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIUrsF4QAACB+vAAAIRbsF4QAACB+8AAAICrsF4QAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAAR73rAAAIZm0jFRAAAzgDuFEAAAglnwAnIQSABgC7BN4AAAgmDYBHASENgJwBuwHUAAAIfwAE
gCMVEAADeQGDAQWAvSwBAAhmbb1OAQAIZiMVEAADdQEnIQ2AAgC7BMoAAAgjFRAAA2oBIQ2AAAC7
BcAAAAi9dQEACGZtaGwCvYgBAAhmbWhsAr2pAQAIZm1obAK9DAEACGZtaGwCaGwCvb0BAAhmbWhs
AtHc4+fZANrm3dni2Ofc3eQA59zj6eDYAMP+19zZ19+s/7viAL/BwQDc1efitOgA4dXY2QDa5t3Z
4tjnAO3Z6Kv//QK05wDa5t3Z4tjn3N3kAN3n/v0DAOPp6ADj2gCjpqat/83c1eDgAMMA4dXf2QDd
6ADV5wDa5t3Z4tjg7f7V5wDX1eIA1tms//0CANXY4+bZ5wDt4+kA4uPrq//T4+nmAOvc4+DZAOTV
5ujtANXY4+bZ5wDt4+n+4uPrq/+94+HZANbV198A1eLtAOjd4dmr/87c3ecA293a6ADY49nn4rTo
AOvj5t8A693o3P7o3N3nAOrZ5ufd4+IA49oA6NzZANvV4dmt/wAAtQDwufggIRdLAPAm+BNJSIAA
vRagAyELIoTgMLWBsP8gAJAOSACIACgE0QDwpPgA8BD4DOALTAYl4HxAB0APAigC0SAAAPAF+GQ0
AT300QGwML0gIWpGBEsYR7xwAwLMcAMCgEICApEzBAglOwQIzsLDzQDKycUbx8nI/wDARtHCyca/
AMq7zM7T/8jJAM7Cu8jFzf/ARvC1hbANABcAK04AIwLIACIGxgEzq0L50SdOHCDAGwAhOgAto2we
G10lTADwL/gHAAAhJEwA8Cr4DiEAkQGVApYAIQORAiEEkTgACCICIx5MAPAc+A4hAJEBlQAhApE4
AAIhACICIxlMAPAQ+AAgKQA6AAIjFkwA8An4ACAVTADwBfgOSP8hAYAFsPC9IEcQtYiwACOcAGxE
IGAEeAEw/yz70QMwgAiAAAEzi0Ly0WhG//em/wiwEL2w+wMCzHADArkNCgjJrg8IeTQRCGkwEQh9
AwoIHZ8PCAIEBgcJCw0OA0gAiGQhSEMCSUAYcEfARrxwAwKAQgICB0gAaAdJQBgHSZpoEhpSGJpg
+SKSAAQ6g1iLUPvRcEfYQgADJDYAAAD8AwI=`), {
                'BPGE 1.10': decodeBase64(`XAEBR5wEFo0NCgihrg8IUTQRCEEwEQhRAwoI9Z4=`),
            }),
        },
    },
    {
        id: 'custom-nature-mint',
        label: 'Nature Mint (Change Nature)',
        description: 'Choose a Pokémon from your party, then the stat its new nature raises and the one it lowers (the same stat twice gives a neutral nature). It keeps its gender, ability and shininess, and its stats update right away.',
        payloads: {
            ...romPayloads(decodeBase64(`/wMrABcAAAAMAMi7zs/MvwDHw8jO//////////////////////////////////////+7ANrm2efc
AOLZ6wDi1ejp5tn/////////////////////////////yt3X3wDo3NkA5+jV6ADVAMrJxRvHyci0
5////////////////////+LV6Onm2QDm1d3n2ecA1eLYAOjc2QDj4tkA3ej////////////////g
4+vZ5uetANDd593oAOjc2QDY2eDd6tnm7eHV4v//////////////4+IAo8AA49oA1QDKycUbx8nI
AL2/yM6/zK3//////////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIUrsFyQAACB+vAAAIRbsFyQAACB+8AAAICrsFyQAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAAR73TAAAIZm0jFRAAA2gDuFEAAAglnwAnIQSABgC7BMYAAAh/AASAvfEAAAhmIxUQAAMXASch
DYB/ALsBxgAACBkFgA2AvQ0BAAhmIxUQAAP5ACchDYB/ALsBxgAACCMVEAAD8AAhDYAAALsBvAAA
CL0oAQAIZm1obAK9NgEACGZtaGwCaGwCvU8BAAhmbWhsAtHc4+fZAOLV6Onm2QDn3OPp4NgAwwDX
3NXi29ms/9Hc3dfcAOfo1egA59zj6eDYAN3oAObV3efZrP+74tgA69zd19wA59zj6eDYAN3oAODj
69nmrP/9AgDd5wD9AwDi4+ur/87c1egA2N3Y4rToAOvj5t+4AOfj5ubtq//O3N3nANvd2ugA2OPZ
5+K06ADr4+bfAOvd6Nz+6Nzd5wDq2ebn3ePiAOPaAOjc2QDb1eHZrf8AAAASSAQwBSEIIi7gMLUQ
SEWIBSFNQw9IAIgtGADw5fgEACF4KgAA8Hz4CkkIgAAoCtAgAAlLAPAI+AhJrQBJWQhICEsA8AH4
ML0YR8BGlLA/CLxwAwLMcAMCJRwECGwYRgjwHAICrcgACPC1hbANABcAIU4AIwLIACIGxgEzq0L5
0R1OHCDAGwAhOgAjo2weG10bTADwL/gHAAAhGkwA8Cr4DiEAkQGVApYAIQORAiEEkTgACCICIxRM
APAc+A4hAJEBlQAhApE4AAIhACICIw9MAPAQ+AAgKQA6AAIjDEwA8An4ACALTADwBfgESP8hAYAF
sPC9IEfARrD7AwLMcAMCuQ0KCMmuDwh5NBEIaTARCH0DCggdnw8IAgQGBwkLDQ7wtZCwBQANkQyS
LmgwDDEECQxIQA6QKAALISpLAPBQ+AEkACfJKALRBCS3Bb8POQINmAFDDphIQAAECEMPkBkhAPBO
+AyZiEIE0D8ZOAru0AAgLOAPnzAAAPAr+AyQOAAA8Cf4DZAAJAyY4EADIxhADCJQQyAwKBgNmeFA
GUBRQ2lEAyIDaHNAe0ALYAQwBDEBOvfRAjQILObRaUYoACAwLCKLWINQBDr71S9gASAQsPC9ALUY
IQDwE/gOoQhcAL0YR8BGkTMECANIAIhkIUhDAklAGHBHwEa8cAMCgEICAskGyg6IQgDTQBqRQgHQ
SQj453BH5LTYnHhs4bHSk3JjyY3Gh05LOS02Jx4bB0gAaAdJQBgHSZpoEhpSGJpg+SKSAAQ6g1iL
UPvRcEfYQgADJDYAAAD8AwI=`), {
                'BPGE 1.10': decodeBase64(`XAEBRyQDAtCuNAMCnBLYAxaNDQoIoa4PCFE0EQhBMBEIUQMKCPWe`),
            }),
        },
    },
    {
        id: 'custom-ability-capsule',
        label: 'Ability Capsule (Swap Ability)',
        description: 'Switches a Pokémon from your party to the other ability its species can have, keeping its nature, gender and shininess. Species with only one ability can’t switch.',
        payloads: {
            ...romPayloads(decodeBase64(`AATpABgAAAAYALu8w8bDztMAvbvKzc/Gv//////////////////////////////////O5u0A3ejn
AOPo3NnmANXW3eDd6O3/////////////////////////zevd6NfcANUAysnFG8fJyADo4wDo3NkA
4+jc2eb//////////////9XW3eDd6O0A3ejnAOfk2dfd2ecA19XiANzV6tmt///////////////Q
3efd6ADo3NkA2Nng3erZ5u3h1eIA4+IAo8D/////////////////49oA1QDKycUbx8nIAL2/yM6/
zK3//////////////////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIUrsFrAAACB+vAAAIRbsFrAAACB+8AAAICrsFrAAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAAR722AAAIZm0jFRAAA8gCuFEAAAglnwAnIQSABgC7BKkAAAgmDYBHASENgJwBuwGfAAAIfwAE
gCMVEAAD4QAhDYAAALsBlQAACL30AAAIZm1obAK9DAEACGZtaGwCvdUAAAhmbWhsAmhsAr0lAQAI
Zm1obALR3OPn2QDV1t3g3ejtAOfc4+ng2ADDAOfr3ejX3Kz/u+IAv8HBANfV4rToAOfr3ejX3ADV
1t3g3ejd2eer//0CtOcA1dbd4N3o7QDd5wDi4+v+/QOr//0CANzV5wDj4uDtAOPi2f7V1t3g3ejt
rf/O3N3nANvd2ugA2OPZ5+K06ADr4+bfAOvd6Nz+6Nzd5wDq2ebn3ePiAOPaAOjc2QDb1eHZrf8A
8LWBsADwtvgEAAshIUsA8D34HCFIQyFJRhgAIPF9ACkw0CV4ASdvQDJ8ACoL0P4qCdKVQoBBl0KJ
QYhCA9BvHmgIANNvHCBoGSEA8J/4AgA5ACAAAPAq+AAoE9ABIAdAAJcgAC4hakYLSwDwD/gWNvFd
DSBBQwpICRgKSApLAPAF+AEgAkkIgAGw8L0YR8BGzHADApEzBAglOwQIUCMlCAzYJAjwHAICrcgA
CPC1kLAFAA2RDJIuaDAMMQQJDEhADpAoAAshKksA8FD4ASQAJ8koAtEEJLcFvw85Ag2YAUMOmEhA
AAQIQw+QGSEA8E74DJmIQgTQPxk4Cu7QACAs4A+fMAAA8Cv4DJA4AADwJ/gNkAAkDJjgQAMjGEAM
IlBDIDAoGA2Z4UAZQFFDaUQDIgNoc0B7QAtgBDAEMQE699ECNAgs5tFpRigAIDAsIotYg1AEOvvV
L2ABIBCw8L0AtRghAPAT+A6hCFwAvRhHwEaRMwQIA0gAiGQhSEMCSUAYcEfARrxwAwKAQgICyQbK
DohCANNAGpFCAdBJCPjncEfktNiceGzhsdKTcmPJjcaHTks5LTYnHhsHSABoB0lAGAdJmmgSGlIY
mmD5IpIABDqDWItQ+9FwR9hCAAMkNgAAAPwDAg==`), {
                'BPGE 1.10': decodeBase64(`XAEBR0gDBiwjJQjo1w==`),
            }),
        },
    },
    {
        id: 'custom-poke-ball-changer',
        label: 'Poké Ball Changer',
        description: 'Moves a Pokémon from your party into the Poké Ball of your choice: any ball but the Safari Ball. Its summary shows the new ball.',
        payloads: {
            ...romPayloads(decodeBase64(`KARkAEAAAAAUAMrJxRsAvLvGxgC9wrvIwb/M//////////////////////////////+7AOLZ6wDc
4+HZANrj5gDVAMrJxRvHycj/////////////////////x+Pq2QDVAMrJxRvHycgA3eLo4wDo3NkA
ysnFG////////////////7y7xsYA49oA7ePp5gDX3OPd19mtANDd593o///////////////////o
3NkA2Nng3erZ5u3h1eIA4+IA6NzZAKPi2P//////////////////2uDj4+YA49oA1QDKycUbx8nI
AL2/yM6/zK3//////////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIUrsF3wAACB+vAAAIRbsF3wAACB+8AAAICrsF3wAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAAR73pAAAIZm0jFRAAAwwDuFEAAAglnwAnIQSABgC7BNwAAAgmDYBHASENgJwBuwHSAAAIfwAE
gBYGgAAAvT0BAAhmIxUQAAM6ASchDYB/ALsBswAACCMVEAADawEhDYAAALsFfgAACL1cAQAIZm1o
bAIhBoAAALsByAAACBYGgAAAuX4AAAi9dgEACGZtaGwCvRMBAAhmbWhsAmhsAr2KAQAIZm1obALR
3N3X3ADKycUbx8nIAOfc4+ng2ADb2egA1f7i2esAysnFGwC8u8bGrP+74gC/wcEA3NXn4rToANbZ
2eIA19Xp29zoAN3iANX+ysnFGwC8u8bGq//R3N3X3ADKycUbALy7xsYA6+Pp4NgA3egA4N3f2az/
/QIA4uPrANfV4ODnAN3o5/79AwDc4+HZq/+94+HZANbV198A1eLtAOjd4dmr/87c3ecA293a6ADY
49nn4rToAOvj5t8A693o3P7o3N3nAOrZ5ufd4+IA49oA6NzZANvV4dmt/zC1iLAlSICIKqQHJQAo
AdAHNAQlACPgXADwOfiZAGlECGABM6tC9tEHLQTRJKCZAGlECGABNWhGKQANIgDwRPgIsDC9ELWB
sBRLmIgUSQmIACgE0QcpA9EBIJiAE+AHMRSgRFwAlADwi/gmIWpGDUsA8BL4IAAA8Ar4AQALSAxL
APAK+AAgBkkIgAGwEL0sIUhDBUlAGHBHGEfARrxwAwLMcAMCJTsECCSLPQjwHAICrcgACAQDAgEG
BwgJCgsMAMfJzL+w/8BG8LWFsA0AFwAhTgAjAsgAIgbGATOrQvnRHU4cIMAbACE6ACOjbB4bXRtM
APAv+AcAACEaTADwKvgOIQCRAZUClgAhA5ECIQSROAAIIgIjFEwA8Bz4DiEAkQGVACECkTgAAiEA
IgIjD0wA8BD4ACApADoAAiMMTADwCfgAIAtMAPAF+ARI/yEBgAWw8L0gR8BGsPsDAsxwAwK5DQoI
ya4PCHk0EQhpMBEIfQMKCB2fDwgCBAYHCQsNDgNIAIhkIUhDAklAGHBHwEa8cAMCgEICAgdIAGgH
SUAYB0maaBIaUhiaYPkikgAEOoNYi1D70XBH2EIAAyQ2AAAA/AMC`), {
                'BPGE 1.10': decodeBase64(`XAEBR7gDAmCJcAQWjQ0KCKGuDwhRNBEIQTARCFEDCgj1ng==`),
            }),
        },
    },
    {
        id: 'custom-pokemon-gender',
        label: 'Pokémon Gender Change',
        description: 'Switches a Pokémon from your party between male and female, handy for breeding. It keeps its nature, ability and shininess. Species that are always one gender, or have none, can’t switch.',
        payloads: {
            ...romPayloads(decodeBase64(`AQQgABkAAAAQAMrJxRvHycgAwb/Ivr/MAL3Cu8jBv//////////////////////////A4+YA6NzZ
AOTZ5trZ1+gA5NXd5v//////////////////////////zevd6NfcANUAysnFG8fJyADW2ejr2dni
AOHV4Nn//////////////9Xi2ADa2eHV4NmtANDd593oAOjc2f/////////////////////////Y
2eDd6tnm7eHV4gDj4gDo3NkAo+LYANrg4+Pm////////////////49oA1QDKycUbx8nIAL2/yM6/
zK3//////////////////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIUrsFwQAACB+vAAAIRbsFwQAACB+8AAAICrsFwQAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAAR73LAAAIZm0jFRAAA7gCuFEAAAglnwAnIQSABgC7BL4AAAgmDYBHASENgJwBuwG0AAAIfwAE
gCMVEAADFQEhDYAAALsBqgAACCENgAIAuwGgAAAIvRYBAAhmbWhsAr0mAQAIZm1obAK9OAEACGZt
aGwCve8AAAhmbWhsAmhsAr1XAQAIZm1obALR3N3X3ADKycUbx8nIAOfc4+ng2ADn693o19z+29ni
2NnmrP/G2ei05wDr1d3oANrj5gDo3NkAv8HBAOjj/tzV6NfcANrd5ufoq//9AgDd5wDi4+sA4dXg
2av//QIA3ecA4uPrANrZ4dXg2av//QK05wDb2eLY2eYA19XitOj+1tkA5+vd6Nfc2dit/87c3ecA
293a6ADY49nn4rToAOvj5t8A693o3P7o3N3nAOrZ5ufd4+IA49oA6NzZANvV4dmt/wAAAHC1APCV
+AQACyEVSwDwJPgcIUhDE0lAGAJ8ACYAKhjQ/ioW0iV4EQBpQAEgAUABJpVCAdMCOgImVRggaBkh
APCD+AIAKQAgAADwDvgAKADRACYCSQ6AcL0YR8BGzHADApEzBAhQIyUI8LWQsAUADZEMki5oMAwx
BAkMSEAOkCgACyEqSwDwUPgBJAAnySgC0QQktwW/DzkCDZgBQw6YSEAABAhDD5AZIQDwTvgMmYhC
BNA/GTgK7tAAICzgD58wAADwK/gMkDgAAPAn+A2QACQMmOBAAyMYQAwiUEMgMCgYDZnhQBlAUUNp
RAMiA2hzQHtAC2AEMAQxATr30QI0CCzm0WlGKAAgMCwii1iDUAQ6+9UvYAEgELDwvQC1GCEA8BP4
DqEIXAC9GEfARpEzBAgDSACIZCFIQwJJQBhwR8BGvHADAoBCAgLJBsoOiEIA00AakUIB0EkI+Odw
R+S02Jx4bOGx0pNyY8mNxodOSzktNiceGwdIAGgHSUAYB0maaBIaUhiaYPkikgAEOoNYi1D70XBH
2EIAAyQ2AAAA/AMC`), {
                'BPGE 1.10': decodeBase64(`XAEBR0QDASw=`),
            }),
        },
    },
    {
        id: 'custom-unown-letters',
        label: 'Unown Letter Changer',
        description: 'Choose an Unown from your party and type the letter it should be, A to Z, ! or ?, on the naming screen; its nickname stays as it was. It keeps its nature and whether it is shiny.',
        payloads: {
            ...romPayloads(decodeBase64(`IATJADgAAAAYAM/IydHIAMa/zs6/zAC9wrvIwb/M///////////////////////////A5uPhALsA
6OMArP//////////////////////////////////////wd3q2QDV4gDPyMnRyADV4u0A49oA3ejn
AKOp/////////////////+DZ6OjZ5uetAMPoAN/Z2eTnAN3o5wDi1ejp5tmt///////////////Q
3efd6ADo3NkA2Nng3erZ5u3h1eIA4+IAo8D/////////////////49oA1QDKycUbx8nIAL2/yM6/
zK3//////////////////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIUrsF2QAACB+vAAAIRbsF2QAACB+8AAAICrsF2QAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAAR73jAAAIZm0jFRAAA2QDuFEAAAglnwAnIQSABgC7BNYAAAh/AASAJg2ARwEhDYDJALsFwgAA
CL3wAAAIZm1olwEjFRAAAysBJyMVEAADSQF/AASAIQ2AAAC7AcwAAAghDYACALsBtgAACL03AQAI
Zm1obAK9FAEACGZtuYAAAAi9UAEACGZtaGwCvWUBAAhmbWhsAmhsAr15AQAIZm1obALR3N3X3ADP
yMnRyKz/zu3k2QDd6OcA4tnrAODZ6OjZ5vD+uwDo4wDUuACrAOPmAKz/yeLZAODZ6OjZ5rgA5ODZ
1efZ8P67AOjjANS4AKsA4+YArP/9AgDd5wDo3NkA4Nno6Nnm/v0DAOLj66v/ztzV6LTnAOLj6ADV
4gDPyMnRyKv/vePh2QDW1dffANXi7QDo3eHZq//O3N3nANvd2ugA2OPZ5+K06ADr4+bfAOvd6Nz+
6Nzd5wDq2ebn3ePiAOPaAOjc2QDb1eHZrf8AELWCsADw2vgAaACQTUgBkElJ/yAIcAMgySL/I0hM
APCI+AKwEL3wtYSwQ0kAIgsAHHgBM/8sBNAALPnQIAABMvbnASoD0AAgYtMCIGDgAgC7OhoqCtMa
OhoqB9MaIqsoBNAbIqwoAdACIFHgAJK7IBoqANORIIAYCHD/IEhwAPCd+AQAJmgwABkhAPCj+AUA
YGgBDEhAAAQADAKQMQxxQAkECQxIQAgoAdMAIclDAZEAIAOQIUsA8Dv4BwAfSwDwN/gBmUocBNBA
B0APSEB4QAXgAQB5QAKaUUAIKQzTAAQHQzgAGSEA8HX4qEIE0QDwE/gAmYhCBtADmAEwA5AADNjQ
ACAE4CAAOQAA8B34ASAISQiABLDwvQAgGCGAADoAykADIxpAEEMIOffVHCFR4BhHIEfMcAMC8BwC
AnGGBAi5EAoIpaAFCPC1kLAFAA8ALmgwAADwK/gMkDgAAPAn+A2QACQMmOBAAyMYQAwiUEMgMCgY
DZnhQBlAUUNpRAMiA2hzQHtAC2AEMAQxATr30QI0CCzm0WlGKAAgMCwii1iDUAQ6+9UvYAEgELDw
vQC1GCEA8A/4DKEIXAC9A0gAiGQhSEMCSUAYcEfARrxwAwKAQgICyQbKDohCANNAGpFCAdBJCPjn
cEfktNiceGzhsdKTcmPJjcaHTks5LTYnHhsHSABoB0lAGAdJmmgSGlIYmmD5IpIABDqDWItQ+9Fw
R9hCAAMkNgAAAPwDAg==`), {
                'BPGE 1.10': decodeBase64(`XAEBR0AEAY0=`),
            }),
        },
    },
    {
        id: 'custom-max-conditions',
        label: 'Max Contest Conditions (Feebas to Milotic)',
        description: 'Raises a Pokémon’s Cool, Beauty, Cute, Smart and Tough conditions and its sheen to the maximum, as far as Pokéblocks can take them. A Feebas in this condition evolves into Milotic at its next level up, even in FireRed and LeafGreen, which have no way to raise Beauty.',
        payloads: {
            ...romPayloads(decodeBase64(`BARJARwAAAAEAMe70gC9yci+w87DycjN//////////////////////////////////+94+Lo2efo
AObZ1djtq///////////////////////////////////vcnJxrgAvL+7z87TuAC9z86/uADNx7vM
zgDV4tj//////////////87Jz8HCAOjjAOjc2QDh1ezwANUAwL+/vLvN///////////////////o
3NniANnq4+Dq2ecA1egA3ejnAOLZ7OgA4Nnq2eCt////////////0N3n3egAo8AA49oA1QDKycUb
x8nIAL2/yM6/zK3//////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIUrsFlwAACB+vAAAIRbsFlwAACB+8AAAICrsFlwAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAAR72hAAAIZm0jFRAAA3gBuFEAAAglnwAnIQSABgC7BJQAAAgmDYBHASENgJwBuwGKAAAIfwAE
gCMVEAAD/QC97QAACGZtaGwCvdAAAAhmbWhsAmhsAr0/AQAIZm1obALR3N3X3ADKycUbx8nIAOfc
4+ng2ADDANvZ6P7m2dXY7QDa4+YA1+Pi6Nnn6Oes/7viAL/BwQDX1eK06ADZ4ujZ5gDX4+Lo2efo
56v//QIA3ecA3eIA6OPkANfj4tjd6N3j4qv7uwDAv7+8u80A3eIA6Nzd5wDX4+LY3ejd4+IA693g
4P7Z6uPg6tkA1egA3ejnAOLZ7OgA4Nnq2eCt/87c3ecA293a6ADY49nn4rToAOvj5t8A693o3P7o
3N3nAOrZ5ufd4+IA49oA6NzZANvV4dmt/wAAACC1gbD/IACQACUA8BP4B6FJXWpGBEsA8AX4ATUG
LfTRAbAgvRhHwEYlOwQIFhcYIS8wwEYDSACIZCFIQwJJQBhwR8BGvHADAoBCAgIHSABoB0lAGAdJ
mmgSGlIYmmD5IpIABDqDWItQ+9FwR9hCAAMkNgAAAPwDAg==`), {
                'BPGE 1.10': decodeBase64(`XAEBRw==`),
            }),
        },
    },
    {
        id: 'custom-gender-swap',
        label: 'New Trainer Name/Gender',
        description: 'Offers you a new trainer name, then offers to switch your character between boy and girl on the spot, sprite included; say no to either to skip it. Your own Pokémon take the new name as their original trainer, so they still count as yours. Talk to the deliveryman again to switch back.',
        payloads: {
            ...romPayloads(decodeBase64(`9QOEAA0AAAAIAMi/0QDOzLvDyL/MAMi7x7+6wb/Ivr/M//////////////////////+7AOLZ6wDi
1eHZuADVAOLZ6wDg4+Pfq///////////////////////yNnrAOLV4dmsAMjZ6wDg4+PfrADQ3efd
6ADo3Nn//////////////9jZ4N3q2ebt4dXiAOPiAOjc2QCj4tgA2uDj4+b////////////////j
2gDVAMrJxRvHycgAvb/Izr/MAOjjAObZ4tXh2f//////////////4+YA5+vV5ADW2ejr2dniALzJ
0wDV4tgAwcPMxq3//////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIUrsFsAAACB+vAAAIRbsFsAAACB+8AAAICrsFsAAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAAR726AAAIZm4UCCENgAAAuwF8AAAIIxUQAAMzArheAAAIaJcBIxUQAANmAScjFRAAA34BvdUA
AAhmbb3rAAAIZm4UCCENgAAAuwGmAAAIaJcDIxUQAAP3AJcCvRIBAAhmbWhsAr1BAQAIZm1obAK9
VQEACGZtaGwC0ePp4NgA7ePpAODd39kA1QDi2esA4tXh2az/yN3X2QDo4wDh2dnoAO3j6bgA/QGr
/83c1eDgAMMA5+vV5ADt4+kA1tno69nZ4v68ydMA1eLYAMHDzMas/87VrtjVqwDO1eDfAOjjAOHZ
ANXb1d3iANXi7f7o3eHZAOjjAOfr1eQA1tXX363/vePh2QDW1dffANXi7QDo3eHZq//O3N3nANvd
2ugA2OPZ5+K06ADr4+bfAOvd6Nz+6Nzd5wDq2ebn3ePiAOPaAOjc2QDb1eHZrf8AMLUzSABoAXoB
IlFAAXIyTOFxZXkkIEVDMEgtGAAgM0sA8FP4AQAoADFLAPBO+Cl+CQcJDygAL0sA8Ef4MLwBvABH
ELWCsC1LAZMAIACQIEkJaAp6ACMAICdMAPA3+AKwEL3wtRpPP2gNIC0COVwNQwE4Cij52hpMBiZk
IgDwE/gYTCRoBDRpJrYAUCIA8Av4EEwkaBRIJBgCJowiAPAD+PC8AbwARwE+DtThfIkHCdVhaKlC
BtEhABQxByABODtcC1T70aQY7udwRxhHIEfARtxCAAPYQgADdHADAjRuAwKAQgIC4EIAA4AvAACF
/wUIBSgGCL0pBgi5EAoIiaAFCAdIAGgHSUAYB0maaBIaUhiaYPkikgAEOoNYi1D70XBH2EIAAyQ2
AAAA/AMC`), {
                'BPGE 1.10': decodeBase64(`XAEBR9QDAY0=`),
            }),
        },
    },
    {
        id: 'custom-rival-name',
        label: 'Rename Your Rival',
        description: 'Gives your rival a new name with the game’s own naming screen.',
        payloads: {
            ...romPayloads(decodeBase64(`DQSFACUAAAAQAMy/yLvHvwDTyc/MAMzD0LvG///////////////////////////////N4dng4ADt
1QDg1ejZ5qv/////////////////////////////////wd3q2QDt4+nmAObd6tXgANUA4tnrAOLV
4dmt/////////////////9Dd593oAOjc2QDY2eDd6tnm7eHV4gDj4gDo3Nn///////////////+j
4tgA2uDj4+YA49oA1QDKycUbx8nI////////////////////////vb/Izr/Mrf//////////////
/////////////////////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIUrsFggAACB+vAAAIRbsFggAACB+8AAAICrsFggAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAAR72MAAAIZm4UCCENgAAAuwF4AAAIIxUQAAMDAbheAAAIaJcBIxUQAAO8ACe9ugAACGZtaGwC
vdkAAAhmbWhsAr3tAAAIZm1obALR4+ng2ADt4+kA4N3f2QDo4wDb3erZAO3j6eb+5t3q1eAA1QDi
2esA4tXh2az/wObj4QDi4+sA4+K4AO3j6eYA5t3q1eAA3ef+/Qar/73j4dkA1tXX3wDV4u0A6N3h
2av/ztzd5wDb3droANjj2efitOgA6+Pm3wDr3ejc/ujc3ecA6tnm593j4gDj2gDo3NkA29Xh2a3/
ABC1grALSwGTACAAkAZJCWgGSokYACIAIwQgBUwA8AL4ArAQvSBHwEbYQgADTDoAALkQCgiJoAUI
B0gAaAdJQBgHSZpoEhpSGJpg+SKSAAQ6g1iLUPvRcEfYQgADJDYAAAD8AwI=`), {
                'BPGE 1.10': decodeBase64(`XAEBR6QCAY0=`),
            }),
        },
    },
    {
        id: 'custom-nickname',
        label: 'Nickname Change & Removal',
        description: 'Choose a Pokémon from your party to give it a new nickname, or to take its nickname away so it goes by its species name again. Works on Pokémon from trades too; one from another language’s game can get a new nickname, but your game doesn’t know its species name in that language to give back.',
        payloads: {
            ...romPayloads(decodeBase64(`/QPJABUAAAAMAMjDvcXIu8e/AL3Cu8jBv/////////////////////////////////+7AOLZ6wDi
1eHZuADj5gDi4+LZANXoANXg4P//////////////////wd3q2QDVAMrJxRvHycgA1QDi2esA4t3X
3+LV4dn//////////////+PmAN3o5wDn5NnX3dnnAOLV4dkA1tXX360A0N3n3ej////////////o
3NkA2Nng3erZ5u3h1eIA4+IA6NzZAKPi2P//////////////////2uDj4+YA49oA1QDKycUbx8nI
AL2/yM6/zK3//////////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIUrsF8wAACB+vAAAIRbsF8wAACB+8AAAICrsF8wAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAAR739AAAIZm0jFRAAA1QCuFEAAAglnwAnIQSABgC7BPEAAAgmDYBHASENgJwBuwHdAAAIfwAE
gL0cAQAIZm4UCCENgAEAuwHIAAAIIxUQAANpASENgAAAuwHnAAAIvTQBAAhmbhQIIQ2AAAC7AecA
AAgjFRAAA48BfwAEgL1jAQAIZm1obAJolwElngAnfwAEgL14AQAIZm1obAK9jgEACGZtaGwCva4B
AAhmbWhsAmwCvcIBAAhmbWhsAtHc4+fZAOLd19/i1eHZAOfc1eDgAMMA19zV4tvZrP/B3erZAP0C
ANUA4tnrAOLd19/i1eHZrP/N3OPp4NgA/QIA2+MA1tXX3wDo4/7d6OcA5+TZ193Z5wDi1eHZAN3i
5+jZ1dis/77j4tmrAMPotOcA/QIA1dvV3eKt/8Dm4+EA4uPrAOPiuADd6LTnAP0Cq/+74gC/wcEA
2OPZ5+K06ADc1erZANUA4tXh2QDt2eir/73j4dkA1tXX3wDV4u0A6N3h2av/ztzd5wDb3droANjj
2efitOgA6+Pm3wDr3ejc/ujc3ecA6tnm593j4gDj2gDo3NkA29Xh2a3/ELUA8C/4IAADISRLAPA9
+AIoAdAAIBTgIAACIR5KIDIeSwDwMvgcSAEAIDECeAt4mkIF0QEwATH/KvfRACAA4AEgFEkIgBC8
AbwARxC1APAJ+CAAAiEQShFLAPAW+BC8AbwARwC1CkgAiGQhSEMHTCQYIAALIQlLAPAH+AEABkgI
SwDwAvgBvABHGEeAQgICvHADAsxwAwIAwAECkTMECCU7BAh5RwQIB0gAaAdJQBgHSZpoEhpSGJpg
+SKSAAQ6g1iLUPvRcEfYQgADJDYAAAD8AwI=`), {
                'BPGE 1.10': decodeBase64(`XAEBRw==`),
            }),
        },
    },
    {
        id: 'custom-trainer-ids',
        label: 'Trainer & Secret ID Reveal',
        description: 'Shows your Trainer ID and the Secret ID the game never shows you. Together they decide which Pokémon you meet are shiny.',
        payloads: {
            ...romPayloads(decodeBase64(`BwQ/AB8AAAAYAM7Mu8PIv8wAw74AzL/Qv7vG//////////////////////////////+84+jcAOPa
AO3j6eYAw77n////////////////////////////////xtnV5uIA7ePp5gDOzLvDyL/MAMO+ANXi
2ADo3Nn//////////////82/vcy/zgDDvgDo3NkA29Xh2QDc3djZ563////////////////////Q
3efd6ADo3NkA2Nng3erZ5u3h1eIA4+IAo8D/////////////////49oA1QDKycUbx8nIAL2/yM6/
zK3//////////////////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIUrsFVAAACB+vAAAIRbsFVAAACB+8AAAICrsFVAAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAARyMVEAADtwC9XgAACGZtaGwCvcUAAAhmbWhsAtPj6eYAzsy7w8i/zADDvgDd5wD9Av7V4tgA
7ePp5gDNv73Mv84Aw74A3ecA/QOt+87j29no3NnmAOjc2e0A2NnX3djZAOvc3dfc/srJxRvHycgA
7ePpAOHZ2egA1ebZAOfc3eLtrf/O3N3nANvd2ugA2OPZ5+K06ADr4+bfAOvd6Nz+6Nzd5wDq2ebn
3ePiAOPaAOjc2QDb1eHZrf8AMLUITCRoCk1hiQdIAiIFIwDwB/ihiQVIAiIFIwDwAfgwvShH3EIA
A9AcAgLwHAICockACA==`), {
                'BPGE 1.10': decodeBase64(`XAEBRw==`),
            }),
        },
    },
    {
        id: 'custom-wishmkr-jirachi',
        label: 'Jirachi (WISHMKR Event)',
        description: 'A Jirachi like the one the Pokémon Colosseum Bonus Disc gave in North America: level 5, OT WISHMKR, ID 20043, from Ruby, knowing Wish, Confusion and Rest and holding a Salac or Ganlon Berry. Its nature, IVs and berry are rolled the way the disc rolled them, so it can even be shiny, as a few from the disc were. It joins your party, or goes to the PC when the party is full. One per card; receive the card again for another.',
        payloads: {
            ...romPayloads(decodeBase64(`FgSZAS4AAAAMANHDzcLHxcwAxMPMu73Cw//////////////////////////////////O3NkAvMnI
z80AvsPNvQDb3dro////////////////////////////ztzZAOvd59yu2+bV4ujd4tsAxMPMu73C
wwDj2v///////////////+jc2QC9ycbJzc2/z8cAvMnIz80AvsPNva3////////////////////Q
3efd6ADo3NkA2Nng3erZ5u3h1eIA4+IAo8D/////////////////49oA1QDKycUbx8nIAL2/yM6/
zK3//////////////////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIUrsFmQAACB+vAAAIRbsFmQAACB+8AAAICrsFmQAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAARyvYA7sBhQAACEMjFRAAAwUBIQ2AAgC7AY8AAAgp2AMxAQG9owAACGYybSENgAEAuwF7AAAI
aGwCvbgAAAhmbWhsAr3PAAAIZm1obAK9+wAACGZtaGwCvRsBAAhmbWhsAv0BAObZ19nd6tnYAMTD
zLu9wsOr/8PoAOvV5wDn2eLoAOjjAOjc2QDKva3/zNnX2d3q2QDo3NkA19Xm2ADV29Xd4gDa4+b+
1eLj6NzZ5gDEw8y7vcLDq//T4+nmAOTV5ujtANXi2ADo3NkAyr0A1ebZANrp4OCr/87c3ecA293a
6ADY49nn4rToAOvj5t8A693o3P7o3N3nAOrZ5ufd4+IA49oA6NzZANvV4dmt/wAAAPC1hrBapEpL
APCO+AYENgwA8ID4BwQA8H34B0MBlwEgAJABIAKQRUgDkADwc/hHBH8MAPBv+EAEgAg4QwSQAPBp
+AYAPkghiAUiACM9TwDwbPhFogchAPBl+AAgMSEA8F/4/yAjIQDwW/gCICUhAPBX+DAAAyEG3wEh
AUCqIEAaDCEA8E34AiADIQDwSfgEnicnHyAwQHYJOQAA8EH4ATctL/bRACZxAGEYSYgyACRIJk8A
8Dr4ATYELvTRIEgkTwDwM/gkTjd4HUgGLwPTI0sA8Cr4C+BkIXlDHkqJGGAig1iLUAQ6+9UBNzdw
ACAPSQiAAigM0CCIGUsA8BX4BgACIRhPAPAR+DAAAyEA8A34BrDwvQdIcEMHSUYYMAxwRwWQBaoG
SAhLGEc4R8xwAwJxhgQIbU7GQXNgAABLTgAAKEACAv0RBAglOwQIDSEECCUcBAiAQgICJUACAjlD
BAhBagQI2cUICNHDzcLHxcz/mQERAV0AnAAAAMBG`), {
                'BPGE 1.10': decodeBase64(`XAEBRwgEAa0=`),
            }),
        },
    },
    {
        id: 'custom-10-aniv-celebi',
        label: 'Celebi (10 ANIV Event)',
        description: 'A Celebi like the one the 2006 Pokémon 10th Anniversary “Journey Across America” tour gave: level 70, OT 10 ANIV, ID 00010, from Ruby, knowing Ancient Power, Future Sight, Baton Pass and Perish Song. Its nature, IVs and OT gender are rolled the way the tour rolled them, never shiny. It joins your party, or goes to the PC when the party is full. One per card; receive the card again for another.',
        payloads: {
            ...romPayloads(decodeBase64(`FwT7AC8AAAAEAKKhALvIw9AAvb/Gv7zD///////////////////////////////////O3NkAoqHo
3AC74uLd6tnm59Xm7QDb3dro////////////////////ztzZAL2/xr+8wwDj2gDo3NkAo6GhpwCi
oejc/////////////////7vi4t3q2ebn1ebtAOjj6eYA49oAu+HZ5t3X1a3////////////////Q
3efd6ADo3NkA2Nng3erZ5u3h1eIA4+IAo8D/////////////////49oA1QDKycUbx8nIAL2/yM6/
zK3//////////////////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIUrsFmQAACB+vAAAIRbsFmQAACB+8AAAICrsFmQAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAARyvYA7sBhQAACEMjFRAAAwEBIQ2AAgC7AY8AAAgp2AMxAQG9owAACGYybSENgAEAuwF7AAAI
aGwCvbcAAAhmbWhsAr3OAAAIZm1obAK9+QAACGZtaGwCvRkBAAhmbWhsAv0BAObZ19nd6tnYAL2/
xr+8w6v/w+gA69XnAOfZ4ugA6OMA6NzZAMq9rf/M2dfZ3erZAOjc2QDX1ebYANXb1d3iANrj5v7V
4uPo3NnmAL2/xr+8w6v/0+Pp5gDk1ebo7QDV4tgA6NzZAMq9ANXm2QDa6eDgq//O3N3nANvd2ugA
2OPZ5+K06ADr4+bfAOvd6Nz+6Nzd5wDq2ebn3ePiAOPaAOjc2QDb1eHZrf8A8LWGsFukS0sA8I/4
BgQ2DADwgfgHBADwfvgHQzgMeEBHSUhAAATADALRCDf/CP8AAZcBIACQASACkEFIA5AA8Gr4RwR/
DADwZvhABIAIOEMEkADwYPgGADpIIYhGIgAjOU8A8GP4QaIHIQDwXPjwQ8AJMSEA8FX4/yAjIQDw
UfgCICUhAPBN+AIgAyEA8En4BJ4nJx8gMEB2CTkAAPBB+AE3LS/20QAmcQBhGEmIMgAkSCdPAPA6
+AE2BC700SFIJE8A8DP4JU43eB5IBi8D0yNLAPAq+AvgZCF5Qx5KiRhgIoNYi1AEOvvVATc3cAAg
D0kIgAIoDNAgiBpLAPAV+AYAAiEYTwDwEfgwAAMhAPAN+Aaw8L0ISHBDCElGGDAMcEcFkAWqB0gI
SxhHOEfARsxwAwJxhgQIbU7GQXNgAAAKAAAAKEACAv0RBAglOwQIDSEECCUcBAiAQgICJUACAjlD
BAhBagQI2cUICKKhALvIw9D/+wD2APgA4gDDAMBG`), {
                'BPGE 1.10': decodeBase64(`XAEBRwgEAa0=`),
            }),
        },
    },
    {
        id: 'custom-10-aniv-kanto',
        label: 'Party of the Decade: Kanto (10 ANIV Event)',
        description: 'Choose one of the Kanto favorites of the 2006 Pokémon 10th Anniversary “Party of the Decade”: Bulbasaur, Charizard, Blastoise, the Pikachu that knows Fly, Alakazam or Dragonite. Each is level 70, OT 10 ANIV, ID 06808, from Ruby, with the event’s own moves, its nature, IVs and OT gender rolled the way the event rolled them, never shiny. It joins your party, or goes to the PC when the party is full. One per card; receive the card again for another.',
        payloads: {
            ...romPayloads(decodeBase64(`GAQZADAAAAAQAMq7zM7TAMnAAM7CvwC+v727vr/////////////////////////////Fu8jOyQDa
1erj5t3o2ef/////////////////////////////////vM/GvLvNu8/MuAC9wrvMw9S7zL64////
/////////////////////7zGu83OycPNv7gAysPFu73Cz7gAu8a7xbvUu8f////////////////j
5gC+zLvBycjDzr/wANfc4+Pn2QDj4tkA4+L/////////////////o8AA49oA1QDKycUbx8nIAL2/
yM6/zK3//////////////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIUrsF3AAACB+vAAAIRbsF3AAACB+8AAAICrsF3AAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAARyvYA7sBvgAACBYEgAAAIxUQAAOrAiENgAAAuwHSAAAIfQAGgL1pAQAIZm4UCCENgAEAuwGF
AAAIFwSAAQC5UQAACEMjFRAAAywBIQ2AAgC7AcgAAAgp2AMxAQG95gAACGYybSENgAEAuwG0AAAI
aGwCvfYAAAhmbWhsAr0NAQAIZm1obAK9NQEACGZtaGwCvVUBAAhmbWhsAr18AQAIZm1obAL9AQDm
2dfZ3erZ2AD9Aqv/w+gA69XnAOfZ4ugA6OMA6NzZAMq9rf/M2dfZ3erZAOjc2QDX1ebYANXb1d3i
ANrj5v7V4uPo3NnmAOPi2av/0+Pp5gDk1ebo7QDV4tgA6NzZAMq9ANXm2QDa6eDgq/+94+HZANbV
198A1eLtAOjd4dmr/9Hj6eDYAO3j6QDg3d/ZAP0CrP/O3N3nANvd2ugA2OPZ5+K06ADr4+bfAOvd
6Nz+6Nzd5wDq2ebn3ePiAOPaAOjc2QDb1eHZrf8AAPC1hrBqpGdIAIgKIUhDJBhWSwDwmPgGBDYM
APCK+AcEAPCH+AdDOAx4QFNJSEAABMAMAtEIN/8I/wABlwEgAJABIAKQTEgDkADwc/hHBH8MAPBv
+EAEgAg4QwSQAPBp+AYARkghiEYiACNFTwDwbPhNogchAPBl+PBDwAkxIQDwXvj/ICMhAPBa+AIg
JSEA8Fb4AiADIQDwUvhFoCIaPCoE0lKgghgCIQDwS/gEnicnHyAwQHYJOQAA8EH4ATctL/bRACZx
AGEYSYgyACtILk8A8Dr4ATYELvTRKEgrTwDwM/gsTjd4JUgGLwPTKksA8Cr4C+BkIXlDJUqJGGAi
g1iLUAQ6+9UBNzdwACAWSQiAAigM0CCIIUsA8BX4BgACIR9PAPAR+DAAAyEA8A34BrDwvQ9IcEMP
SUYYMAxwRwWQBaoOSA9LGEc4RxZIAYgAIgYpBdIKIlFDFaJRWoGAASIBSAKAcEfARsxwAwJxhgQI
bU7GQXNgAACYGgAAKEACAv0RBAglOwQIDSEECCUcBAiAQgICJUACAjlDBAhBagQI2cUICLxwAwKi
oQC7yMPQ/wEA5gBKAEwA6wAGABEAowBSAFMACQC2APAAggA4ABkAVQBXAHEAEwBBAPgAWwFeAA8B
lQBhANsAEQDIALzPxry7zbvPzP+9wrvMw9S7zL7/vMa7zc7Jw82//8rDxbu9ws////+7xrvFu9S7
x///vsy7wcnIw86//w==`), {
                'BPGE 1.10': decodeBase64(`XAEBR6QEAa0=`),
            }),
        },
    },
    {
        id: 'custom-10-aniv-legends',
        label: 'Party of the Decade: Legends (10 ANIV Event)',
        description: 'Choose one of the Legendary Pokémon of the 2006 Pokémon 10th Anniversary “Party of the Decade”: Articuno, Zapdos, Moltres, Raikou, Entei, Suicune, Latias or Latios. Each is level 70, OT 10 ANIV, ID 06808, from Ruby, with the event’s own moves, its nature, IVs and OT gender rolled the way the event rolled them, never shiny. It joins your party, or goes to the PC when the party is full. One per card; receive the card again for another.',
        payloads: {
            ...romPayloads(decodeBase64(`GQSQADEAAAAYAMq7zM7TAMnAAM7CvwC+v727vr/////////////////////////////G2dvZ4tjV
5u0AysnFG8fJyP//////////////////////////////u8zOw73PyMm4ANS7yr7JzbgAx8nGzsy/
zbj//////////////////8y7w8XJz7gAv8jOv8O4AM3Pw73PyL+4AMa7zsO7zf/////////////j
5gDGu87Dyc3wANfc4+Pn2QDj4tkA4+L/////////////////////o8AA49oA1QDKycUbx8nIAL2/
yM6/zK3//////////////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIUrsF3AAACB+vAAAIRbsF3AAACB+8AAAICrsF3AAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAARyvYA7sBvgAACBYEgAAAIxUQAAOrAiENgAAAuwHSAAAIfQAGgL1pAQAIZm4UCCENgAEAuwGF
AAAIFwSAAQC5UQAACEMjFRAAAywBIQ2AAgC7AcgAAAgp2AMxAQG95gAACGYybSENgAEAuwG0AAAI
aGwCvfYAAAhmbWhsAr0NAQAIZm1obAK9NQEACGZtaGwCvVUBAAhmbWhsAr18AQAIZm1obAL9AQDm
2dfZ3erZ2AD9Aqv/w+gA69XnAOfZ4ugA6OMA6NzZAMq9rf/M2dfZ3erZAOjc2QDX1ebYANXb1d3i
ANrj5v7V4uPo3NnmAOPi2av/0+Pp5gDk1ebo7QDV4tgA6NzZAMq9ANXm2QDa6eDgq/+94+HZANbV
198A1eLtAOjd4dmr/9Hj6eDYAO3j6QDg3d/ZAP0CrP/O3N3nANvd2ugA2OPZ5+K06ADr4+bfAOvd
6Nz+6Nzd5wDq2ebn3ePiAOPaAOjc2QDb1eHZrf8AAPC1hrBqpGdIAIgKIUhDJBhWSwDwmPgGBDYM
APCK+AcEAPCH+AdDOAx4QFNJSEAABMAMAtEIN/8I/wABlwEgAJABIAKQTEgDkADwc/hHBH8MAPBv
+EAEgAg4QwSQAPBp+AYARkghiEYiACNFTwDwbPhNogchAPBl+PBDwAkxIQDwXvj/ICMhAPBa+AIg
JSEA8Fb4AiADIQDwUvhFoCIaHioE0legghgCIQDwS/gEnicnHyAwQHYJOQAA8EH4ATctL/bRACZx
AGEYSYgyACtILk8A8Dr4ATYELvTRKEgrTwDwM/gsTjd4JUgGLwPTKksA8Cr4C+BkIXlDJUqJGGAi
g1iLUAQ6+9UBNzdwACAWSQiAAigM0CCIIUsA8BX4BgACIR9PAPAR+DAAAyEA8A34BrDwvQ9IcEMP
SUYYMAxwRwWQBaoOSA9LGEc4RxZIAYgAIggpBdIKIlFDFaJRWoGAASIBSAKAcEfARsxwAwJxhgQI
bU7GQXNgAACYGgAAKEACAv0RBAglOwQIDSEECCUcBAiAQgICJUACAjlDBAhBagQI2cUICLxwAwKi
oQC7yMPQ/5AAYQCqADoAcwCRAGEAxQBBAAwBkgBhAMsANQDbAPMAYgDRAHMA8gD0AFMAFwA1AM8A
9QAQAD4ANgDzAJcBKAFeAGkAzACYAScBXgBpAF0Bu8zOw73PyMn//9S7yr7Jzf/////HycbOzL/N
////wEY=`), {
                'BPGE 1.10': decodeBase64(`XAEBR6QEAa0=`),
            }),
        },
    },
    {
        id: 'custom-10-aniv-johto-hoenn',
        label: 'Party of the Decade: Johto & Hoenn (10 ANIV Event)',
        description: 'Choose one of the Johto and Hoenn favorites of the 2006 Pokémon 10th Anniversary “Party of the Decade”: Typhlosion, Espeon, Umbreon, Tyranitar, Blaziken or Absol. Each is level 70, OT 10 ANIV, ID 06808, from Ruby, with the event’s own moves, its nature, IVs and OT gender rolled the way the event rolled them, never shiny. It joins your party, or goes to the PC when the party is full. One per card; receive the card again for another.',
        payloads: {
            ...romPayloads(decodeBase64(`GgTEADIAAAAIAMq7zM7TAMnAAM7CvwC+v727vr/////////////////////////////EycLOyQAt
AMLJv8jIANrV6uPm3ejZ5///////////////////////ztPKwsbJzcPJyLgAv83Kv8nIuADPx7zM
v8nIuP///////////////87TzLvIw867zLgAvMa71MPFv8gA4+b///////////////////////+7
vM3JxvAA19zj4+fZAOPi2QDj4v//////////////////////////o8AA49oA1QDKycUbx8nIAL2/
yM6/zK3//////////////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIUrsF3AAACB+vAAAIRbsF3AAACB+8AAAICrsF3AAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAARyvYA7sBvgAACBYEgAAAIxUQAAOrAiENgAAAuwHSAAAIfQAGgL1pAQAIZm4UCCENgAEAuwGF
AAAIFwSAAQC5UQAACEMjFRAAAywBIQ2AAgC7AcgAAAgp2AMxAQG95gAACGYybSENgAEAuwG0AAAI
aGwCvfYAAAhmbWhsAr0NAQAIZm1obAK9NQEACGZtaGwCvVUBAAhmbWhsAr18AQAIZm1obAL9AQDm
2dfZ3erZ2AD9Aqv/w+gA69XnAOfZ4ugA6OMA6NzZAMq9rf/M2dfZ3erZAOjc2QDX1ebYANXb1d3i
ANrj5v7V4uPo3NnmAOPi2av/0+Pp5gDk1ebo7QDV4tgA6NzZAMq9ANXm2QDa6eDgq/+94+HZANbV
198A1eLtAOjd4dmr/9Hj6eDYAO3j6QDg3d/ZAP0CrP/O3N3nANvd2ugA2OPZ5+K06ADr4+bfAOvd
6Nz+6Nzd5wDq2ebn3ePiAOPaAOjc2QDb1eHZrf8AAPC1hrBqpGdIAIgKIUhDJBhWSwDwmPgGBDYM
APCK+AcEAPCH+AdDOAx4QFNJSEAABMAMAtEIN/8I/wABlwEgAJABIAKQTEgDkADwc/hHBH8MAPBv
+EAEgAg4QwSQAPBp+AYARkghiEYiACNFTwDwbPhNogchAPBl+PBDwAkxIQDwXvj/ICMhAPBa+AIg
JSEA8Fb4AiADIQDwUvhFoCIaMioE0lKgghgCIQDwS/gEnicnHyAwQHYJOQAA8EH4ATctL/bRACZx
AGEYSYgyACtILk8A8Dr4ATYELvTRKEgrTwDwM/gsTjd4JUgGLwPTKksA8Cr4C+BkIXlDJUqJGGAi
g1iLUAQ6+9UBNzdwACAWSQiAAigM0CCIIUsA8BX4BgACIR9PAPAR+DAAAyEA8A34BrDwvQ9IcEMP
SUYYMAxwRwWQBaoOSA9LGEc4RxZIAYgAIgYpBdIKIlFDFaJRWoGAASIBSAKAcEfARsxwAwJxhgQI
bU7GQXNgAACYGgAAKEACAv0RBAglOwQIDSEECCUcBAiAQgICJUACAjlDBAhBagQI2cUICLxwAwKi
oQC7yMPQ/50AYgCsAIEANQDEADwA9ABeAOoAxQC5ANQAZwDsAPgAJQC4APIAWQAaASsBowB3AEcB
eAFoAKMA+ADDAM7TysLGyc3Dyci/zcq/ycj/////z8e8zL/JyP///87TzLvIw867zP+8xrvUw8W/
yP//wEY=`), {
                'BPGE 1.10': decodeBase64(`XAEBR6QEAa0=`),
            }),
        },
    },
    {
        id: 'custom-doel-deoxys',
        label: 'Deoxys (DOEL Event)',
        description: 'A Deoxys like the one the DOEL distribution gave: level 70, OT DOEL, ID 28606, from Ruby, knowing Cosmic Power, Recover, Psycho Boost and Hyper Beam, marked as met in a fateful encounter so it obeys. Like any Deoxys it takes your game’s form: Attack Forme in FireRed, Defense Forme in LeafGreen. Never shiny. It joins your party, or goes to the PC when the party is full. One per card; receive the card again for another.',
        payloads: {
            ...romPayloads(decodeBase64(`GwSaATMAAAAYAL7Jv8YAvr/J0tPN///////////////////////////////////////A5uPhAOPp
6NnmAOfk1dfZ////////////////////////////////ztzZAL6/ydLTzQDj2gDo3NkAvsm/xv//
/////////////////////9jd5+jm3dbp6N3j4rgA5tnV2O0A6OMA49bZ7a3////////////////Q
3efd6ADo3NkA2Nng3erZ5u3h1eIA4+IAo8D/////////////////49oA1QDKycUbx8nIAL2/yM6/
zK3//////////////////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIUrsFmQAACB+vAAAIRbsFmQAACB+8AAAICrsFmQAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAARyvYA7sBhQAACEMjFRAAAwEBIQ2AAgC7AY8AAAgp2AMxAQG9owAACGYybSENgAEAuwF7AAAI
aGwCvbcAAAhmbWhsAr3OAAAIZm1obAK9+QAACGZtaGwCvRkBAAhmbWhsAv0BAObZ19nd6tnYAL6/
ydLTzav/w+gA69XnAOfZ4ugA6OMA6NzZAMq9rf/M2dfZ3erZAOjc2QDX1ebYANXb1d3iANrj5v7V
4uPo3NnmAL6/ydLTzav/0+Pp5gDk1ebo7QDV4tgA6NzZAMq9ANXm2QDa6eDgq//O3N3nANvd2ugA
2OPZ5+K06ADr4+bfAOvd6Nz+6Nzd5wDq2ebn3ePiAOPaAOjc2QDb1eHZrf8A8LWGsF2kTUsA8JP4
BgQ2DADwhfgHBADwgvgHQzgMeEBJSUhAAATADALRCDf/CP8AAZcBIACQASACkENIA5AA8G74RwR/
DADwavhABIAIOEMEkADwZPgGADxIIYhGIgAjO08A8Gf4Q6IHIQDwYPjwQ8AJMSEA8Fn4/yAjIQDw
VfgCICUhAPBR+AIgAyEA8E34ASBQIQDwSfgEnicnHyAwQHYJOQAA8EH4ATctL/bRACZxAGEYSYgy
ACRIJ08A8Dr4ATYELvTRIUgkTwDwM/glTjd4HkgGLwPTI0sA8Cr4C+BkIXlDHkqJGGAig1iLUAQ6
+9UBNzdwACAPSQiAAigM0CCIGksA8BX4BgACIRhPAPAR+DAAAyEA8A34BrDwvQhIcEMISUYYMAxw
RwWQBaoHSAhLGEc4R8BGzHADAnGGBAhtTsZBc2AAAL5vAAAoQAIC/REECCU7BAgNIQQIJRwECIBC
AgIlQAICOUMECEFqBAjZxQgIvsm/xv////+aAUIBaQBiAT8AwEY=`), {
                'BPGE 1.10': decodeBase64(`XAEBRxAEAa0=`),
            }),
        },
    },
    {
        id: 'custom-space-c-deoxys',
        label: 'Deoxys (SPACE C Event)',
        description: 'A Deoxys like the one the SPACE C distribution gave: level 70, OT SPACE C, ID 00010, from Ruby, knowing Cosmic Power, Recover, Psycho Boost and Hyper Beam, marked as met in a fateful encounter so it obeys. Like any Deoxys it takes your game’s form: Attack Forme in FireRed, Defense Forme in LeafGreen. Never shiny. It joins your party, or goes to the PC when the party is full. One per card; receive the card again for another.',
        payloads: {
            ...romPayloads(decodeBase64(`HASaATQAAAAUAM3Ku72/AL0Avr/J0tPN///////////////////////////////////A5uPhAOPp
6NnmAOfk1dfZ////////////////////////////////ztzZAL6/ydLTzQDj2gDo3NkAzcq7vb8A
vf///////////////////9jd5+jm3dbp6N3j4rgA5tnV2O0A6OMA49bZ7a3////////////////Q
3efd6ADo3NkA2Nng3erZ5u3h1eIA4+IAo8D/////////////////49oA1QDKycUbx8nIAL2/yM6/
zK3//////////////////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIUrsFmQAACB+vAAAIRbsFmQAACB+8AAAICrsFmQAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAARyvYA7sBhQAACEMjFRAAAwEBIQ2AAgC7AY8AAAgp2AMxAQG9owAACGYybSENgAEAuwF7AAAI
aGwCvbcAAAhmbWhsAr3OAAAIZm1obAK9+QAACGZtaGwCvRkBAAhmbWhsAv0BAObZ19nd6tnYAL6/
ydLTzav/w+gA69XnAOfZ4ugA6OMA6NzZAMq9rf/M2dfZ3erZAOjc2QDX1ebYANXb1d3iANrj5v7V
4uPo3NnmAL6/ydLTzav/0+Pp5gDk1ebo7QDV4tgA6NzZAMq9ANXm2QDa6eDgq//O3N3nANvd2ugA
2OPZ5+K06ADr4+bfAOvd6Nz+6Nzd5wDq2ebn3ePiAOPaAOjc2QDb1eHZrf8A8LWGsF2kTUsA8JP4
BgQ2DADwhfgHBADwgvgHQzgMeEBJSUhAAATADALRCDf/CP8AAZcBIACQASACkENIA5AA8G74RwR/
DADwavhABIAIOEMEkADwZPgGADxIIYhGIgAjO08A8Gf4Q6IHIQDwYPjwQ8AJMSEA8Fn4/yAjIQDw
VfgCICUhAPBR+AIgAyEA8E34ASBQIQDwSfgEnicnHyAwQHYJOQAA8EH4ATctL/bRACZxAGEYSYgy
ACRIJ08A8Dr4ATYELvTRIUgkTwDwM/glTjd4HkgGLwPTI0sA8Cr4C+BkIXlDHkqJGGAig1iLUAQ6
+9UBNzdwACAPSQiAAigM0CCIGksA8BX4BgACIRhPAPAR+DAAAyEA8A34BrDwvQhIcEMISUYYMAxw
RwWQBaoHSAhLGEc4R8BGzHADAnGGBAhtTsZBc2AAAAoAAAAoQAIC/REECCU7BAgNIQQIJRwECIBC
AgIlQAICOUMECEFqBAjZxQgIzcq7vb8Avf+aAUIBaQBiAT8AwEY=`), {
                'BPGE 1.10': decodeBase64(`XAEBRxAEAa0=`),
            }),
        },
    },
    {
        id: 'custom-aura-mew',
        label: 'Mew (Aura Event)',
        description: 'A Mew like the one the Aura distribution gave: level 10, OT Aura, ID 20078, from Ruby, knowing Pound and Transform, marked as met in a fateful encounter so it obeys. Never shiny. It joins your party, or goes to the PC when the party is full. One per card; receive the card again for another.',
        payloads: {
            ...romPayloads(decodeBase64(`HQSXADUAAAAMALvPzLsAx7/R///////////////////////////////////////////O3NkAu+nm
1QDb3dro////////////////////////////////////ztzZAMe/0QDj2gDo3NkAu+nm1f//////
/////////////////////9jd5+jm3dbp6N3j4rgA5tnV2O0A6OMA49bZ7a3////////////////Q
3efd6ADo3NkA2Nng3erZ5u3h1eIA4+IAo8D/////////////////49oA1QDKycUbx8nIAL2/yM6/
zK3//////////////////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIUrsFmQAACB+vAAAIRbsFmQAACB+8AAAICrsFmQAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAARyvYA7sBhQAACEMjFRAAA/0AIQ2AAgC7AY8AAAgp2AMxAQG9owAACGYybSENgAEAuwF7AAAI
aGwCvbQAAAhmbWhsAr3LAAAIZm1obAK98wAACGZtaGwCvRMBAAhmbWhsAv0BAObZ19nd6tnYAMe/
0av/w+gA69XnAOfZ4ugA6OMA6NzZAMq9rf/M2dfZ3erZAOjc2QDX1ebYANXb1d3iANrj5v7V4uPo
3NnmAMe/0av/0+Pp5gDk1ebo7QDV4tgA6NzZAMq9ANXm2QDa6eDgq//O3N3nANvd2ugA2OPZ5+K0
6ADr4+bfAOvd6Nz+6Nzd5wDq2ebn3ePiAOPaAOjc2QDb1eHZrf8AAADwtYawW6RLSwDwj/gGBDYM
APCB+AcEAPB++AdDOAx4QEdJSEAABMAMAtEIN/8I/wABlwEgAJABIAKQQUgDkADwavhHBH8MAPBm
+EAEgAg4QwSQAPBg+AYAOkghiAoiACM5TwDwY/hBogchAPBc+PBDwAkxIQDwVfj/ICMhAPBR+AIg
JSEA8E34ASBQIQDwSfgEnicnHyAwQHYJOQAA8EH4ATctL/bRACZxAGEYSYgyACRIJ08A8Dr4ATYE
LvTRIUgkTwDwM/glTjd4HkgGLwPTI0sA8Cr4C+BkIXlDHkqJGGAig1iLUAQ6+9UBNzdwACAPSQiA
AigM0CCIGksA8BX4BgACIRhPAPAR+DAAAyEA8A34BrDwvQhIcEMISUYYMAxwRwWQBaoHSAhLGEc4
R8BGzHADAnGGBAhtTsZBc2AAAG5OAAAoQAIC/REECCU7BAgNIQQIJRwECIBCAgIlQAICOUMECEFq
BAjZxQgIu+nm1f////+XAAEAkAAAAAAAwEY=`), {
                'BPGE 1.10': decodeBase64(`XAEBRwQEAa0=`),
            }),
        },
    },
    {
        id: 'custom-mystry-mew',
        label: 'Mew (MYSTRY Event)',
        description: 'A Mew like the one the MYSTRY distribution gave: level 10, OT MYSTRY, ID 06930, from Ruby, knowing Pound and Transform, marked as met in a fateful encounter so it obeys. It comes from one of the 86 seeds the real ones came from, as PKHeX expects. Never shiny. It joins your party, or goes to the PC when the party is full. One per card; receive the card again for another.',
        payloads: {
            ...romPayloads(decodeBase64(`HgSXADYAAAAEAMfTzc7M0wDHv9H////////////////////////////////////////O3NkAx9PN
zszTANvd2uj/////////////////////////////////ztzZAMe/0QDj2gDo3NkAx9PNzszT////
/////////////////////9jd5+jm3dbp6N3j4rgA5tnV2O0A6OMA49bZ7a3////////////////Q
3efd6ADo3NkA2Nng3erZ5u3h1eIA4+IAo8D/////////////////49oA1QDKycUbx8nIAL2/yM6/
zK3//////////////////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIUrsFmQAACB+vAAAIRbsFmQAACB+8AAAICrsFmQAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAARyvYA7sBhQAACEMjFRAAA/0AIQ2AAgC7AY8AAAgp2AMxAQG9owAACGYybSENgAEAuwF7AAAI
aGwCvbQAAAhmbWhsAr3LAAAIZm1obAK98wAACGZtaGwCvRMBAAhmbWhsAv0BAObZ19nd6tnYAMe/
0av/w+gA69XnAOfZ4ugA6OMA6NzZAMq9rf/M2dfZ3erZAOjc2QDX1ebYANXb1d3iANrj5v7V4uPo
3NnmAMe/0av/0+Pp5gDk1ebo7QDV4tgA6NzZAMq9ANXm2QDa6eDgq//O3N3nANvd2ugA2OPZ5+K0
6ADr4+bfAOvd6Nz+6Nzd5wDq2ebn3ePiAOPaAOjc2QDb1eHZrf8AAADwtYawaKRXSwDwqPgGBDYM
MABWIQbfSQBmoEBasgeSDwEyXkmIQgDRAiIFIUpDBgAA8Ir4ATr70QDwhvgHBADwg/gHQzgMeEBJ
SUhAAATADALRCDf/CP8AAZcBIACQASACkENIA5AA8G/4RwR/DADwa/hABIAIOEMEkADwZfgGADxI
IYgKIgAjO08A8Gj4RKIHIQDwYfgwAAMhBt8xIQDwWfj/ICMhAPBV+AIgJSEA8FH4AiADIQDwTfgB
IFAhAPBJ+ASeJycfIDBAdgk5AADwQfgBNy0v9tEAJnEAYRhJiDIAJEgmTwDwOvgBNgQu9NEgSCRP
APAz+CRON3gdSAYvA9MjSwDwKvgL4GQheUMeSokYYCKDWItQBDr71QE3N3AAIA9JCIACKAzQIIgZ
SwDwFfgGAAIhGE8A8BH4MAADIQDwDfgGsPC9B0hwQwdJRhgwDHBHBZAFqgZICEsYRzhHzHADAnGG
BAhtTsZBc2AAABIbAAAoQAIC/REECCU7BAgNIQQIJRwECIBCAgIlQAICOUMECEFqBAjZxQgIZWAA
AMfTzc7M0///lwABAJAAAAAAAMBGUgYyCRMMQw3uDmMSyRMUFgkcpR6/IIkjOSktMG4w8zTzRc5G
DUpjS3lMjlCrUEBSJ1O6VsxWQVhgWsFbK17zXmVgP2RXZKNnRGkGbmJuZ3bvd9J4VYaSikiL0JMd
lKCVfZaQljecQJycneSdhp5ToUOkrKgIrPuv8rExuJa+1MKFw87GLMlTyWLJQ8xHzZbN5NHt3yzm
zOYK6V3pkemy63/un+7I7+TwTv6d/g==`), {
                'BPGE 1.10': decodeBase64(`XAEBRzQEAa0=`),
            }),
        },
    },
    {
        id: 'custom-rocks-metang',
        label: 'Metang (ROCKS Event)',
        description: 'A Metang like the one the ROCKS distribution gave: level 30, OT ROCKS, ID 02005, from Ruby, knowing Take Down, Confusion, Metal Claw and Refresh, with the National Ribbon. Never shiny. It joins your party, or goes to the PC when the party is full. One per card; receive the card again for another.',
        payloads: {
            ...romPayloads(decodeBase64(`HwSPATcAAAAUAMzJvcXNAMe/zrvIwf/////////////////////////////////////R3ejcAOjc
2QDI1ejd4+LV4ADM3dbW4+L/////////////////////ztzZAMe/zrvIwQDj2gDo3NkAzMm9xc3/
/////////////////////9jd5+jm3dbp6N3j4rgA693o3ADd6OcA5t3W1uPirf/////////////Q
3efd6ADo3NkA2Nng3erZ5u3h1eIA4+IAo8D/////////////////49oA1QDKycUbx8nIAL2/yM6/
zK3//////////////////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIUrsFmQAACB+vAAAIRbsFmQAACB+8AAAICrsFmQAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAARyvYA7sBhQAACEMjFRAAAwEBIQ2AAgC7AY8AAAgp2AMxAQG9owAACGYybSENgAEAuwF7AAAI
aGwCvbcAAAhmbWhsAr3OAAAIZm1obAK9+QAACGZtaGwCvRkBAAhmbWhsAv0BAObZ19nd6tnYAMe/
zrvIwav/w+gA69XnAOfZ4ugA6OMA6NzZAMq9rf/M2dfZ3erZAOjc2QDX1ebYANXb1d3iANrj5v7V
4uPo3NnmAMe/zrvIwav/0+Pp5gDk1ebo7QDV4tgA6NzZAMq9ANXm2QDa6eDgq//O3N3nANvd2ugA
2OPZ5+K06ADr4+bfAOvd6Nz+6Nzd5wDq2ebn3ePiAOPaAOjc2QDb1eHZrf8A8LWGsFukS0sA8I/4
BgQ2DADwgfgHBADwfvgHQzgMeEBHSUhAAATADALRCDf/CP8AAZcBIACQASACkEFIA5AA8Gr4RwR/
DADwZvhABIAIOEMEkDxIIYgeIgAjO08A8Gb4QqIHIQDwX/gAIDEhAPBZ+P8gIyEA8FX4AiAlIQDw
UfgCIAMhAPBN+AEgTCEA8En4BJ4nJx8gMEB2CTkAAPBB+AE3LS/20QAmcQBhGEmIMgAkSCdPAPA6
+AE2BC700SFIJE8A8DP4JU43eB5IBi8D0yNLAPAq+AvgZCF5Qx5KiRhgIoNYi1AEOvvVATc3cAAg
D0kIgAIoDNAgiBpLAPAV+AYAAiEYTwDwEfgwAAMhAPAN+Aaw8L0ISHBDCElGGDAMcEcFkAWqB0gI
SxhHOEfARsxwAwJxhgQIbU7GQXNgAADVBwAAKEACAv0RBAglOwQIDSEECCUcBAiAQgICJUACAjlD
BAhBagQI2cUICMzJvcXN////jwEkAF0A6AAfAcBG`), {
                'BPGE 1.10': decodeBase64(`XAEBRwgEAa0=`),
            }),
        },
    },
    {
        id: 'custom-channel-jirachi',
        label: 'Jirachi (Pokémon Channel Event)',
        description: 'The Jirachi that Pokémon Channel gave in Europe, as it came: OT CHANNEL, ID 40122, level 5, holding a Ganlon or Salac Berry, with Wish, Confusion and Rest, and its trainer’s secret ID, game and gender from the same random numbers, the way PKHeX checks them. It can be shiny. One per card; receive the card again for another.',
        payloads: {
            ...romPayloads(decodeBase64(`LQSZAUUAAAAIAL3Cu8jIv8YAxMPMu73Cw//////////////////////////////////O3NkAysnF
G8fJyAC9wrvIyL/GANvd2uj/////////////////////ztzZAMTDzLu9wsMA6NzV6ADKycUbx8nI
/////////////////////73Cu8jIv8YA29Xq2QDd4gC/6ebj5Nmt///////////////////////Q
3efd6ADo3NkA2Nng3erZ5u3h1eIA4+IAo8D/////////////////49oA1QDKycUbx8nIAL2/yM6/
zK3//////////////////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIUrsFmQAACB+vAAAIRbsFmQAACB+8AAAICrsFmQAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAARyvYA7sBhQAACEMjFRAAAwUBIQ2AAgC7AY8AAAgp2AMxAQG9owAACGYybSENgAEAuwF7AAAI
aGwCvbgAAAhmbWhsAr3PAAAIZm1obAK9+wAACGZtaGwCvRsBAAhmbWhsAv0BAObZ19nd6tnYAMTD
zLu9wsOr/8PoAOvV5wDn2eLoAOjjAOjc2QDKva3/zNnX2d3q2QDo3NkA19Xm2ADV29Xd4gDa4+b+
1eLj6NzZ5gDEw8y7vcLDq//T4+nmAOTV5ujtANXi2ADo3NkAyr0A1ebZANrp4OCr/87c3ecA293a
6ADY49nn4rToAOvj5t8A693o3P7o3N3nAOrZ5ufd4+IA49oA6NzZANvV4dmt/wAAAPC1hrB9pGxL
APDS+AYENgxpSwDwzfgABAZDACUA8L74sA8BIYFADUMOLffTAPC2+ADwtPgA8LL4APCw+ADwrvgB
IYkDiEIG2QDwqPhdSYhCAdkA8KP4APCh+ADwn/gFAADwnPgHBADwmfgHQwEhCCgA0wAhOAxoQFNK
UECIQgLQASDAB0dALQQA8Ij4wAsFQwDwhPjAC0AABUMA8H/4wAuAAAVDACIAIwDwePjACphAAkMF
Mx4r99EEkgGXASAAkAEgApAoDAAEP0kIQwOQP0ghiAUiACM+TwDwa/hFogchAPBk+KgIMSEA8F74
/yAjIQDwWvhoCAEhCEABMCUhAPBT+AEgKECpMAwhAPBN+AAgJCEA8En4BJ4nJx8gMEB2CTkAAPBB
+AE3LS/20QAmcQBhGEmIMgAlSCdPAPA6+AE2BC700SFIJU8A8DP4JU43eB5IBi8D0yRLAPAq+Avg
ZCF5Qx9KiRhgIoNYi1AEOvvVATc3cAAgD0kIgAIoDNAgiBpLAPAV+AYAAiEZTwDwEfgwAAMhAPAN
+Aaw8L0HSHBDB0lGGDAMcEcFkAWqB0gJSxhHOEfMcAMCcYYECP1DAwDDniYAelQAALqcAAAoQAIC
/REECCU7BAgNIQQIJRwECIBCAgIlQAICOUMECEFqBAjZxQgIvcK7yMi/xv+ZAREBXQCcAAAAwEY=`), {
                'BPGE 1.10': decodeBase64(`XAEBR5QEAa0=`),
            }),
        },
    },
    {
        id: 'custom-box-eggs',
        label: 'Pokémon Box Eggs (Special Moves)',
        description: 'One of the Eggs Pokémon Box Ruby & Sapphire gave: Swablu with False Swipe, Zigzagoon with ExtremeSpeed, Skitty with Pay Day or Pichu with Surf. The deliveryman offers them in turn. It hatches as yours, as those did. One per card; receive the card again for another.',
        payloads: {
            ...romPayloads(decodeBase64(`LgScAUYAAAAQAMrJxRvHycgAvMnSAL/Bwc3///////////////////////////////+/wcHNAOvd
6NwA5+TZ193V4ADh4+rZ5///////////////////////zdG7vMbPuADUw8HUu8HJyci4AM3Fw87O
0wDj5v///////////////8rDvcLPAOvd6NwA1QDn5NnX3dXgAOHj6tnw///////////////////X
3OPj59kA4+LZAOPiAKPAAOPaANX/////////////////////////ysnFG8fJyAC9v8jOv8yt////
/////////////////////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIUrsF3AAACB+vAAAIRbsF3AAACB+8AAAICrsF3AAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAARyvYA7sBvgAACBYEgAAAIxUQAAOZAiENgAAAuwHSAAAIfQAGgL1tAQAIZm4UCCENgAEAuwGF
AAAIFwSAAQC5UQAACEMjFRAAAzQBIQ2AAgC7AcgAAAgp2AMxAQG95gAACGYybSENgAEAuwG0AAAI
aGwCvfoAAAhmbWhsAr0RAQAIZm1obAK9OQEACGZtaGwCvVkBAAhmbWhsAr2GAQAIZm1obAL9AQDm
2dfZ3erZ2ADV4gC/wcGr/8PoAOvV5wDn2eLoAOjjAOjc2QDKva3/zNnX2d3q2QDo3NkA19Xm2ADV
29Xd4gDa4+b+1eLj6NzZ5gC/wcGr/9Pj6eYA5NXm6O0A1eLYAOjc2QDKvQDV5tkA2ung4Kv/vePh
2QDW1dffANXi7QDo3eHZq//R4+ng2ADt4+kA4N3f2QDVAP0C/r/Bwaz/ztzd5wDb3droANjj2efi
tOgA6+Pm3wDr3ejc/ujc3ecA6tnm593j4gDj2gDo3NkA29Xh2a3/8LWGsGSkYUgAiAohSEMkGE9L
APCL+AYENgxNSwDwhvgABAZDAPB4+AcEAPB1+AdDAZcBIACQACACkElIA5AA8Gv4RwR/DADwZ/hA
BIAIOEMEkERIIYgFIgAjQ08A8Gf4S6IHIQDwYPgBIDEhAPBa+P8gIyEA8Fb4AiAAICQhAPBR+AEg
AyEA8E34TaICIQDwS/ggiBwhSEMwSUAYQHwgIQDwQPgBIC0hAPA8+ASeJycfIDBAdgk5AADwNPgB
Ny0v9tEAJnEAYRhJiDIAJUgoTwDwLfgBNgQu9NEiSCVPAPAm+CZON3gfSAYvA9MkSwDwHfgL4GQh
eUMfSokYYCKDWItQBDr71QE3N3AAIA9JCIACKP/QBrDwvQ5IcEMOSUYYMAxwRwWQBaoOSBBLGEc4
RxZIAYgAIgQpBdIKIlFDFqJRWoGAASIBSAKAcEfMcAMCcYYECG1OxkFzYAAAUCMlCAAAAAAoQAIC
/REECCU7BAgNIQQIJRwECIBCAgIlQAICOUMECEFqBAjZxQgIvHADArvUz827////ZgFAAC0AzgAA
ACABIQAtACcA9QA7AS0AIQAnAAYArABUAMwAOQAAAGBvi//////////ARg==`), {
                'BPGE 1.10': decodeBase64(`XAEBR2gEASyUBAGt`),
            }),
        },
    },
    {
        id: 'custom-colosseum-pikachu',
        label: 'Pikachu (Japanese Colosseum Bonus Disc)',
        description: 'The Pikachu that the Japanese Pokémon Colosseum bonus disc gave: a Japanese Pikachu, OT コロシアム, ID 31121, level 10, never shiny, made the way Colosseum made it. One per card; receive the card again for another.',
        payloads: {
            ...romPayloads(decodeBase64(`LwQZAEcAAAAUAL3JxsnNzb/PxwDKw8W7vcLP///////////////////////////////A5uPhAMTV
5NXitOcAvMnIz80AvsPNvf//////////////////////ztzZAMrDxbu9ws8A49oA6NzZAMTV5NXi
2efZ/////////////////73JxsnNzb/PxwC8ycjPzQC+w829rf/////////////////////////Q
3efd6ADo3NkA2Nng3erZ5u3h1eIA4+IAo8D/////////////////49oA1QDKycUbx8nIAL2/yM6/
zK3//////////////////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIUrsFmQAACB+vAAAIRbsFmQAACB+8AAAICrsFmQAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAARyvYA7sBhQAACEMjFRAAAwUBIQ2AAgC7AY8AAAgp2AMxAQG9owAACGYybSENgAEAuwF7AAAI
aGwCvbgAAAhmbWhsAr3PAAAIZm1obAK9+wAACGZtaGwCvRsBAAhmbWhsAv0BAObZ19nd6tnYAMrD
xbu9ws+r/8PoAOvV5wDn2eLoAOjjAOjc2QDKva3/zNnX2d3q2QDo3NkA19Xm2ADV29Xd4gDa4+b+
1eLj6NzZ5gDKw8W7vcLPq//T4+nmAOTV5ujtANXi2ADo3NkAyr0A1ebZANrp4OCr/87c3ecA293a
6ADY49nn4rToAOvj5t8A693o3P7o3N3nAOrZ5ufd4+IA49oA6NzZANvV4dmt/wAAAPC1hrBgpFBL
APCa+AYENgxNSwDwlfgABAZDNQAuAADwhfhHBH8MAPCB+EAEgAgHQwSXAPB7+ADwefgHBADwdvgH
QzgMeEBDSUhAAATADATRLgAA8Gv4NQDg5wGXASAAkAEgApA7SAOQO0ghiAoiACM6TwDwZvhCogch
APBf+AAgMSEA8Fn4/yAjIQDwVfgCICUhAPBR+AEgAyEA8E34PaICIQDwS/gEnicnHyAwQHYJOQAA
8EH4ATctL/bRACZxAGEYSYgyACRIJk8A8Dr4ATYELvTRIEgkTwDwM/gkTjd4HUgGLwPTI0sA8Cr4
C+BkIXlDHkqJGGAig1iLUAQ6+9UBNzdwACAPSQiAAigM0CCIGUsA8BX4BgACIRhPAPAR+DAAAyEA
8A34BrDwvQdIcEMHSUYYMAxwRwWQBaoGSAhLGEc4R8xwAwJxhgQI/UMDAMOeJgCReQAAKEACAv0R
BAglOwQIDSEECCUcBAiAQgICJUACAjlDBAhBagQI2cUICFp7XFFx/wAAGQBUAC0AJwBWAMBGnFZh
hVP/AAAAAMBG`), {
                'BPGE 1.10': decodeBase64(`XAEBRyAEAa0=`),
            }),
        },
    },
    {
        id: 'custom-ageto-celebi',
        label: 'Celebi (Japanese Colosseum Bonus Disc)',
        description: 'The Ageto Celebi of the Japanese Pokémon Colosseum bonus disc: a Japanese Celebi, OT アゲト, ID 31121, level 10, never shiny, made the way Colosseum made it. One per card; receive the card again for another.',
        payloads: {
            ...romPayloads(decodeBase64(`MAT7AEgAAAAMALvBv87JAL2/xr+8w//////////////////////////////////////A5uPhAMTV
5NXitOcAvMnIz80AvsPNvf//////////////////////ztzZAL2/xr+8wwDj2gDo3NkAxNXk1eLZ
59n//////////////////73JxsnNzb/PxwC8ycjPzQC+w829rf/////////////////////////Q
3efd6ADo3NkA2Nng3erZ5u3h1eIA4+IAo8D/////////////////49oA1QDKycUbx8nIAL2/yM6/
zK3//////////////////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIUrsFmQAACB+vAAAIRbsFmQAACB+8AAAICrsFmQAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAARyvYA7sBhQAACEMjFRAAAwEBIQ2AAgC7AY8AAAgp2AMxAQG9owAACGYybSENgAEAuwF7AAAI
aGwCvbcAAAhmbWhsAr3OAAAIZm1obAK9+QAACGZtaGwCvRkBAAhmbWhsAv0BAObZ19nd6tnYAL2/
xr+8w6v/w+gA69XnAOfZ4ugA6OMA6NzZAMq9rf/M2dfZ3erZAOjc2QDX1ebYANXb1d3iANrj5v7V
4uPo3NnmAL2/xr+8w6v/0+Pp5gDk1ebo7QDV4tgA6NzZAMq9ANXm2QDa6eDgq//O3N3nANvd2ugA
2OPZ5+K06ADr4+bfAOvd6Nz+6Nzd5wDq2ebn3ePiAOPaAOjc2QDb1eHZrf8A8LWGsGCkUEsA8Jr4
BgQ2DE1LAPCV+AAEBkM1AC4AAPCF+EcEfwwA8IH4QASACAdDBJcA8Hv4APB5+AcEAPB2+AdDOAx4
QENJSEAABMAMBNEuAADwa/g1AODnAZcBIACQASACkDtIA5A7SCGICiIAIzpPAPBm+EKiByEA8F/4
ASAxIQDwWfj/ICMhAPBV+AIgJSEA8FH4ASADIQDwTfg9ogIhAPBL+ASeJycfIDBAdgk5AADwQfgB
Ny0v9tEAJnEAYRhJiDIAJEgmTwDwOvgBNgQu9NEgSCRPAPAz+CRON3gdSAYvA9MjSwDwKvgL4GQh
eUMeSokYYCKDWItQBDr71QE3N3AAIA9JCIACKAzQIIgZSwDwFfgGAAIhGE8A8BH4MAADIQDwDfgG
sPC9B0hwQwdJRhgwDHBHBZAFqgZICEsYRzhHzHADAnGGBAj9QwMAw54mAJF5AAAoQAIC/REECCU7
BAgNIQQIJRwECIBCAgIlQAICOUMECEFqBAjZxQgIUYpk/wAAAAD7AF0AaQDXANsAwEZeepeA/wAA
AAAAwEY=`), {
                'BPGE 1.10': decodeBase64(`XAEBRxwEAa0=`),
            }),
        },
    },
    {
        id: 'custom-mattle-ho-oh',
        label: 'Ho-Oh (Colosseum Mt. Battle Prize)',
        description: 'The Ho-Oh Pokémon Colosseum gives for beating all 100 trainers of Mt. Battle: OT MATTLE, ID 10048, level 70, with Recover, Fire Blast, Sunny Day and Swift, never shiny, made the way Colosseum made it. One per card; receive the card again for another.',
        payloads: {
            ...romPayloads(decodeBase64(`MQT6AEkAAAAcAMe7zs7GvwDCya7Jwv/////////////////////////////////////O3NkAx86t
ALy7zs7GvwDk5t3u2f//////////////////////////ztzZAMLJrsnCAL3JxsnNzb/PxwDb1erZ
ANrj5v///////////////+vd4uLd4tsAoqGhAMfOrQC8u87Oxr8A2t3b3Ojnrf/////////////Q
3efd6ADo3NkA2Nng3erZ5u3h1eIA4+IAo8D/////////////////49oA1QDKycUbx8nIAL2/yM6/
zK3//////////////////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIUrsFmQAACB+vAAAIRbsFmQAACB+8AAAICrsFmQAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAARyvYA7sBhQAACEMjFRAAAwEBIQ2AAgC7AY8AAAgp2AMxAQG9owAACGYybSENgAEAuwF7AAAI
aGwCvbYAAAhmbWhsAr3NAAAIZm1obAK99wAACGZtaGwCvRcBAAhmbWhsAv0BAObZ19nd6tnYAMLJ
rsnCq//D6ADr1ecA59ni6ADo4wDo3NkAyr2t/8zZ19nd6tkA6NzZANfV5tgA1dvV3eIA2uPm/tXi
4+jc2eYAwsmuycKr/9Pj6eYA5NXm6O0A1eLYAOjc2QDKvQDV5tkA2ung4Kv/ztzd5wDb3droANjj
2efitOgA6+Pm3wDr3ejc/ujc3ecA6tnm593j4gDj2gDo3NkA29Xh2a3/AAAA8LWGsF6kTksA8Jb4
BgQ2DEtLAPCR+AAEBkM1AC4AAPCB+EcEfwwA8H34QASACAdDBJcA8Hf4APB1+AcEAPBy+AdDOAx4
QEFJSEAABMAMBNEuAADwZ/g1AODnAZcBIACQASACkDlIA5A5SCGIRiIAIzhPAPBi+ECiByEA8Fv4
ACAxIQDwVfj/ICMhAPBR+AEgJSEA8E34AiADIQDwSfgEnicnHyAwQHYJOQAA8EH4ATctL/bRACZx
AGEYSYgyACRIJk8A8Dr4ATYELvTRIEgkTwDwM/gkTjd4HUgGLwPTI0sA8Cr4C+BkIXlDHkqJGGAi
g1iLUAQ6+9UBNzdwACAPSQiAAigM0CCIGUsA8BX4BgACIRhPAPAR+DAAAyEA8A34BrDwvQdIcEMH
SUYYMAxwRwWQBaoGSAhLGEc4R8xwAwJxhgQI/UMDAMOeJgBAJwAAKEACAv0RBAglOwQIDSEECCUc
BAiAQgICJUACAjlDBAhBagQI2cUICMe7zs7Gv///+gBpAH4A8QCBAMBG`), {
                'BPGE 1.10': decodeBase64(`XAEBRxQEAa0=`),
            }),
        },
    },
    {
        id: 'custom-starter-egg',
        label: 'Starter Egg (Random First Partner)',
        description: 'An Egg with one of the nine first partners of Kanto, Johto and Hoenn inside, picked at random: Bulbasaur, Charmander, Squirtle, Chikorita, Cyndaquil, Totodile, Treecko, Torchic or Mudkip. It hatches like any Egg, with you as its trainer. Not an official event. It joins your party, or goes to the PC when the party is full. One per card; receive the card again for another.',
        payloads: {
            ...romPayloads(decodeBase64(`JAScATwAAAAQAM3Ou8zOv8wAv8HB///////////////////////////////////////R3N3X3ADj
4tkA693g4ADc1ejX3Kz/////////////////////////u+IAv8HBAOvd6NwA4+LZAOPaAOjc2QDi
3eLZ/////////////////9rd5ufoAOTV5uji2ebnAN3i593Y2a0A0N3n3ej////////////////o
3NkA2Nng3erZ5u3h1eIA4+IA6NzZAKPi2P//////////////////2uDj4+YA49oA1QDKycUbx8nI
AL2/yM6/zK3//////////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIUrsFmwAACB+vAAAIRbsFmwAACB+8AAAICrsFmwAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAARyvYA7sBhwAACCMVEAADAgF6BIAhDYACALsBkQAACCnYAzEBAb2lAAAIZjJtIQ2AAQC7AX0A
AAhobAK9uQAACGZtaGwCvdAAAAhmbWhsAr34AAAIZm1obAK9GAEACGZtaGwC/QEA5tnX2d3q2dgA
1eIAv8HBq//D6ADr1ecA59ni6ADo4wDo3NkAyr2t/8zZ19nd6tkA6NzZANfV5tgA1dvV3eIA2uPm
/tXi4+jc2eYAv8HBq//T4+nmAOTV5ujtANXi2ADo3NkAyr0A1ebZANrp4OCr/87c3ecA293a6ADY
49nn4rToAOvj5t8A693o3P7o3N3nAOrZ5ufd4+IA49oA6NzZANvV4dmt/wAAALUGSwDwCPgJIQbf
SQAFoEBaA0kIgAC9GEfARnGGBAi8cAMCAQAEAAcAmACbAJ4AFQEYARsBwEY=`), {
                'BPGE 1.10': decodeBase64(`XAEBRw==`),
            }),
        },
    },
    {
        id: 'custom-gift-box',
        label: 'Gift Box (Money, Rare Candies, Coins)',
        description: '¥100,000, 99 Rare Candies when your bag has room, and 1,000 Coins when you have the Coin Case and room for them. Money stops at ¥999,999 and Coins at 9,999, as in the game. One per card; receive the card again for another.',
        payloads: {
            ...romPayloads(decodeBase64(`JQRxAD0AAAAIAMHDwM4AvMnS///////////////////////////////////////////H4+LZ7bgA
19Xi2O0A1eLYAOHj5tn/////////////////////////t6KhobihoaG4AKqqAMy7zL8AvbvIvsO/
zQDV4tj//////////////6K4oaGhAL3Jw8jNrQDQ3efd6ADo3Nn////////////////////////Y
2eDd6tnm7eHV4gDj4gDo3NkAo+LYANrg4+Pm////////////////49oA1QDKycUbx8nIAL2/yM6/
zK3//////////////////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIUrsFogAACB+vAAAIRbsFogAACB+8AAAICrsFogAACCvYA7sBmAAACCnYA5CghgEAADEB
Ab2sAAAIZjJtRkQAYwAhDYAAALsBjAAACEREAGMAvcIAAAhmbUcEAQEAIQ2AAAC7AYkAAAi06AMh
DYAAALsFiQAACL0QAQAIZm1obAK93wAACGZtuWQAAAi9KQEACGZtaGwCvVYBAAhmbWhsAv0BAObZ
19nd6tnYALeioaG4oaGhq//9AQDm2dfZ3erZ2ACqqgDMu8y//r27yL7Dv82r/87c2ebZtOcA4uMA
5uPj4QDd4gDt4+nmANbV2/7a4+YAqqoAzLvMvwC9u8i+w7/Nq//9AQDm2dfZ3erZ2ACiuKGhoQC9
ycPIzav/zNnX2d3q2QDo3NkA19Xm2ADV29Xd4gDa4+b+1eLj6NzZ5gDBw8DOALzJ0qv/ztzd5wDb
3droANjj2efitOgA6+Pm3wDr3ejc/ujc3ecA6tnm593j4gDj2gDo3NkA29Xh2a3/`), {
                'BPGE 1.10': decodeBase64(`XAEBRw==`),
            }),
        },
    },
    {
        id: 'custom-rare-berries',
        label: 'Rare Event Berries',
        description: 'Gives an Enigma, a Lansat and a Starf Berry, which Gen 3 only ever handed out at events. One set per card; receive the card again for another. Without the e-Reader’s berry data the Enigma Berry has no effect in battle.',
        payloads: {
            ...romPayloads(decodeBase64(`CQQgASEAAAAUAMy7zL8AvL/MzMO/zf////////////////////////////////////+/yMPBx7u4
AMa7yM27zgDV4tgAzc67zMD/////////////////////ztzm2dkAvL/MzMO/zQDo3NXoAOvZ5tkA
4+Lg7f///////////////9nq2eYA293q2eIA4+noANXoANnq2eLo563////////////////////Q
3efd6ADo3NkA2Nng3erZ5u3h1eIA4+IAo8D/////////////////49oA1QDKycUbx8nIAL2/yM6/
zK3//////////////////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIUrsFlAAACB+vAAAIRbsFlAAACB+8AAAICrsFlAAACCvYA7sBgAAACEavAAEAIQ2AAAC7
AYoAAAhGrQABACENgAAAuwGKAAAIRq4AAQAhDYAAALsBigAACESvAAEARK0AAQBErgABACnYA72e
AAAIZm1obAK90gAACGZtaGwCvfwAAAhmbWhsAr0iAQAIZm1obALC2ebZAO3j6QDb4/AA1eIAv8jD
wce7uADV/sa7yM27zgDV4tgA1QDNzrvMwAC8v8zM06v/zNnX2d3q2QDo3N3nANfV5tgA1dvV3eIA
2uPm/uHj5tkAvL/MzMO/zav/ztzZ5tm05wDi4wDm4+PhANrj5gDo3NnhAN3i/u3j6eYAvLvBq//O
3N3nANvd2ugA2OPZ5+K06ADr4+bfAOvd6Nz+6Nzd5wDq2ebn3ePiAOPaAOjc2QDb1eHZrf8=`), {
                'BPGE 1.10': decodeBase64(`XAEBRw==`),
            }),
        },
    },
    {
        id: 'custom-gift-ribbons',
        label: 'Event Ribbons for Your Party',
        description: 'Gives every Pokémon in your party the seven gift ribbons, Marine, Land, Sky, Country, National, Earth and World, which Gen 3 only handed out at events. A ribbon whose caption came from a real event keeps it.',
        payloads: {
            ...romPayloads(decodeBase64(`DgRmASYAAAAAAMHDwM4AzMO8vMnIzf/////////////////////////////////////N2erZ4gDM
w7y8ycjNAOjjAOfc4+sA49ra////////////////////0+Pp5gDk1ebo7QDb2ejnAOjc2QDb3dro
/////////////////////8zDvLzJyM0A4+LX2QDj4uDtANvd6tniANXo///////////////////Z
6tni6OetANDd593oAOjc2QDY2eDd6tnm7eHV4v//////////////4+IAo8AA49oA1QDKycUbx8nI
AL2/yM6/zK3//////////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIUrsFdQAACB+vAAAIRbsFdQAACB+8AAAICrsFdQAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAAR71/AAAIZm4UCCENgAAAuwFrAAAIIxUQAAPbACk7CL2xAAAIZm1obAK95wAACGZtaGwCvfsA
AAhmbWhsAs3c1eDgAMMA293q2QDt4+nmAOTV5ujtAMrJxRvHycj+6NzZANvd2ugAzMO8vMnIzaz/
0+Pp5gDKycUbx8nIANvj6ADV4OAA59nq2eIA293a6P7Mw7y8ycjNqwDO1d/ZANUA4OPj363/vePh
2QDW1dffANXi7QDo3eHZq//O3N3nANvd2ugA2OPZ5+K06ADr4+bfAOvd6Nz+6Nzd5wDq2ebn3ePi
AOPaAOjc2QDb1eHZrf8AAABwtYGwE0wkaBNIJBgVpQAmoF0AKAHRqF2gVQE2By730QEgAJANTAYl
4HxAB0APAigJ0UgmIAAxAGpGCUsA8Aj4ATZPLvbRZDQBPe3RAbBwvRhHwEbYQgADnDAAAIBCAgIl
OwQINzo7PTw+PwA=`), {
                'BPGE 1.10': decodeBase64(`XAEBRw==`),
            }),
        },
    },
    {
        id: 'custom-master-ball',
        label: 'Master Ball',
        description: 'Gives a Master Ball, once per card; receive the card again for another. Original Master Ball event by Decryptu.',
        payloads: {
            frlg: [decodeBase64(`9wMjAA8AAAAAAMfTzc6/zNMAwcPAzv////////////////////////////////////+7AObZ5ODV
19nh2eLoAMe7zc6/zAC8u8bG////////////////////uwDHu83Ov8wAvLvGxgDd5wDj4gDd6OcA
69XtAOjj/////////////+bZ5ODV19kA6NzZAOPi2QDt4+kA6efZ2K3////////////////////O
1eDfAOjjAOjc2QDY2eDd6tnm7QDh1eIA4+IA6NzZ////////////o+LYANrg4+PmAOPaANUAysnF
v8fJyAC9v8jOv8yt/////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
WivYA7sBZAAACL2AAAAIZm1oKrYCIbZAAAC7ASsAAAi5WQAACL2kAAAIZm1oRgEAAQAhDYAAALsB
cQAACBoAgAEAGgGAAQAJABa2QAEAuVkAAAgp2AMptgK5fgAACL3AAAAIZm1ouX4AAAi95wAACGZt
aLl+AAAIbAK7AMe7zc6/zAC8u8bGANjZ4N3q2ebtANzV5wDV5ubd6tnYq//T4+kA5tnX2d3q2dgA
1QDHu83Ov8wAvLvGxqv/0+PpANXg5tnV2O0A1+Pg4NnX6NnYAOjc2QDHu83Ov8wAvLvGxq3/yOMA
5uPj4asAx9Xf2QDn5NXX2bgA6NzZ4v7X4+HZANbV19+t/w==`)],
        },
    },
    {
        id: 'custom-pocket-casino',
        label: 'Pocket Casino (Slots)',
        description: 'Talk to the delivery person on Pokémon Center 2F and he opens the Game Corner slots where you stand. The Game Corner music plays while the reels spin. If you have no Coin Case, he lends one for this game and takes it back when you quit. Your coins stay with you. If you have fewer than three coins, he gives you 100 to start. Quitting the machine brings you back to the delivery man on Pokémon Center 2F.',
        payloads: {
            ...romPayloads(decodeBase64(`8QM0AAAAAAAAAMrJvcW/zgC9u83DyMn////////////////////////////////////B1eHZAL3j
5uLZ5qv/////////////////////////////////////uwDn5NnX3dXgANvV4dkA3ecA69Xd6N3i
2////////////////////97p5+gA2uPmAO3j6av///////////////////////////////////+8
5t3i2wDVAL3Jw8gAvbvNvwDV4tgAvcnDyM2t////////////////wdXh2QDj4qv/////////////
/////////////////////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIUrsFKgEACB+vAAAIRbsFKgEACB+8AAAICrsFKgEACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAARxYBQAAAFgRAAAArQwK7AV4AAAgpQwIWBEABAEcEAQEAIQ2AAAC7BYgAAAhGBAEBACENgAAA
uwGIAAAIRAQBAQAWAUABABYDQAAAswJAIQJAAwC7BKMAAAi0ZAAWA0ABACEBQAEAuwHDAAAIIQNA
AQC7AeIAAAi9rwEACLnnAAAIIQNAAQC7AdgAAAi9YwEACLnnAAAIvTQBAAi55wAACL2TAQAIZm1o
MxEBACYNgB4BIxUQAANjAbj6AAAIiQ2AIQRAAQC7BRABAAgqQwIhAUABALsFKAEACEUEAQEAveUB
AAhmbWhsAr0fAgAIZm1obAK7AL3Jw8gAvbvNvwDV4tgAoqGhAL3Jw8jNuP7e6efoANrj5gDo3N3n
ANvV4dmt/9Pj6QDX1eIA1uPm5uPrANUAvcnDyAC9u82/uP7e6efoANrj5gDo3N3nANvV4dmt/8LZ
5tkA1ebZAKKhoQC9ycPIzQDo4wDk4NXtrf/C2dwA3NncuADg4+Pf5wDg3d/ZAOfj4dnj4tn+69Xi
6OcA6OMA5ODV7QDn4+HZAOfg4+jnrf/DAOvd4OAA6NXf2QDo3NkAvcnDyAC9u82/ANbV19+t/tPj
6eYAvcnDyM0A5+jV7QDr3ejcAO3j6a3/ztzd5wDb3droANjj2efitOgA6+Pm3wDr3ejc/ujc3ecA
6tnm593j4gDj2gDo3NkA29Xh2a3/AAAAB0gAaAdJQBgHSZpoEhpSGJpg+SKSAAQ6g1iLUPvRcEfY
QgADJDYAAAD8AwI=`), {
                'BPGE 1.10': decodeBase64(`XAEBRw==`),
            }),
        },
    },
];
