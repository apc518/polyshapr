const presets = [
    {
        animationMode: ANIMATION_MODES.SQUARES,
        rhythmMode: RHYTHM_MODES.NATURALS,
        rhythmOffset: 3,
        rhythmCount: 8,
        rhythmIsReversed: false,
        rhythms: [],
        cycleTime: 10,
        pitchMode: PITCH_MODES.SUHMM_CHORD,
        tuningMode: TUNING_MODES.EDO12,
        pitches: [],
        pitchOffset: -12, // used if pitch mode is edo12
        pitchMultiplier: 0.5, // used if pitch mode is raw
        skips: [],
        colorMode: COLOR_MODES.RGB,
        colorKeyFrames: [
            new ColorKeyFrame({ idx: 0, values: [0, 255, 0] }),
            new ColorKeyFrame({ idx: -1, values: [0, 127, 255] }),
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