const presets = [
    {
        patchName: "The Original",
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
        colorInterpolationMode: COLOR_INTERPOLATION_MODES.RGB,
        colorKeyFrames: [
            new ColorKeyFrame({ idx: 0, rgbValues: [255, 0, 0] }),
            new ColorKeyFrame({ idx: -1, rgbValues: [0, 0, 255] }),
        ],
        doColorRipple: false,
        strokeWeight: 20,
        canvasWidth: canvasWidth,
        canvasHeight: canvasHeight,
        ngonShrinkFactor: 0.9,
        ngonInnerPolygonSideCount: 32,
        squareStyle: SQUARE_STYLES.WIREFRAME,
        sizeMultiplier: DEFAULT_SIZE_MULTIPLIER,
        backgroundColor: "#000"
    },
    {
        patchName: "The Viral One",
        animationMode: ANIMATION_MODES.SQUARES,
        rhythmMode: RHYTHM_MODES.NATURALS,
        rhythmOffset: 1,
        rhythmCount: 32,
        rhythmIsReversed: true,
        rhythms: [],
        cycleTime: 20,
        pitchMode: PITCH_MODES.HARMONIC_SERIES,
        tuningMode: TUNING_MODES.RAW,
        pitches: [],
        pitchOffset: -12, // used if pitch mode is edo12
        pitchMultiplier: 0.198, // used if pitch mode is raw
        skips: [],
        colorInterpolationMode: COLOR_INTERPOLATION_MODES.HSL,
        colorKeyFrames: [
            new ColorKeyFrame({ idx: 0, rgbValues: [255, 0, 0] }),
            new ColorKeyFrame({ idx: -1, rgbValues: [0, 0, 255] }),
        ],
        doColorRipple: false,
        strokeWeight: 5,
        canvasWidth: canvasWidth,
        canvasHeight: canvasHeight,
        ngonShrinkFactor: 0.9,
        ngonInnerPolygonSideCount: 32,
        squareStyle: SQUARE_STYLES.WIREFRAME,
        sizeMultiplier: DEFAULT_SIZE_MULTIPLIER,
        backgroundColor: "#000"
    }
]