const presets = [
    {
        animationMode: ANIMATION_MODES.NGONS,
        rhythmMode: RHYTHM_MODES.NATURALS,
        rhythmOffset: 3,
        rhythmCount: 8,
        rhythmIsReversed: false,
        rhythms: [],
        cycleTime: 10,
        pitchMode: PITCH_MODES.SUHMM_CHORD,
        tuningMode: TUNING_MODES.EDO12,
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
        strokeWeight: 3,
        canvasWidth: canvasWidth,
        canvasHeight: canvasHeight,
        ngonShrinkFactor: 0.9,
        ngonInnerPolygonSideCount: 32,
        squareStyle: SQUARE_STYLES.WIREFRAME,
        size: DEFAULT_SIZE,
        backgroundColor: "#000"
    }
]