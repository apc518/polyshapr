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
        pitchOffset: -9, // used if pitch mode is edo12
        pitchMultiplier: 1.5, // used if pitch mode is raw
        skips: [],
        colorMode: COLOR_MODES.HSL,
        colorKeyFrames: [
            new ColorKeyFrame({ idx: 0, values: [0, 100, 50] }),
            new ColorKeyFrame({ idx: -1, values: [255, 50, 50] }),
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