const presets = [
    {
        animationMode: ANIMATION_MODES.SQUARES,
        rhythms: [3,4,5,6,7,8,9,10],
        cycleTime: 10,
        pitchPreset: PITCH_PRESETS.SUHMM_CHORD,
        pitchMode: PITCH_MODES.EDO12,
        pitches: [],
        pitchOffset: -7, // used if pitch mode is edo12
        pitchMultiplier: 1, // used if pitch mode is raw
        skips: [],
        colorMode: COLOR_MODES.RGB,
        colorKeyFrames: [
            new ColorKeyFrame({ idx: 0, values: [0, 100, 250] }),
            new ColorKeyFrame({ idx: -1, values: [127, 255, 50] }),
        ],
        doColorRipple: false,
        strokeWeight: 5,
        canvasWidth: canvasWidth,
        canvasHeight: canvasHeight,
        ngonShrinkFactor: 0.9,
        ngonInnerPolygonSideCount: 32,
        squareStyle: SQUARE_STYLES.WIREFRAME,
        size: DEFAULT_SIZE,
        backgroundColor: "#000"
    }
]