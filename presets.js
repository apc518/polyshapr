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
        colorScale: 1,
        doColorRipple: false,
        doColorReflection: false,
        rotateCount: 1,
        globalRotationSpeed: 0,
        drawBackground: true,
        drawGlobalBorder: true,
        strokeWeight: 20,
        canvasWidth: canvasWidth,
        canvasHeight: canvasHeight,
        ngonShrinkFactor: 0.9,
        ngonInnerPolygonSideCount: 32,
        squareStyle: SQUARE_STYLES.WIREFRAME,
        sizeMultiplier: DEFAULT_SIZE_MULTIPLIER,
        backgroundColor: "#000",
        audioSampleIsCustom: false,
        audioSampleFilename: "assets/sounds/synth-pluck-C.wav",
        audioSampleDisplayName: "Sine Blip (Eb)",
        audioSampleBase64: null
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
        colorScale: 1,
        doColorRipple: false,
        doColorReflection: false,
        rotateCount: 1,
        globalRotationSpeed: 0,
        drawBackground: true,
        drawGlobalBorder: true,
        strokeWeight: 5,
        canvasWidth: canvasWidth,
        canvasHeight: canvasHeight,
        ngonShrinkFactor: 0.9,
        ngonInnerPolygonSideCount: 32,
        squareStyle: SQUARE_STYLES.WIREFRAME,
        sizeMultiplier: DEFAULT_SIZE_MULTIPLIER,
        backgroundColor: "#000",
        audioSampleIsCustom: false,
        audioSampleFilename: "assets/sounds/synth-pluck-C.wav",
        audioSampleDisplayName: "Sine Blip (Eb)",
        audioSampleBase64: null
    },
    {
        patchName: "Triaesthetic",
        animationMode: ANIMATION_MODES.TRIANGLES,
        rhythmMode: RHYTHM_MODES.NATURALS,
        rhythmOffset: 1,
        rhythmCount: 20,
        rhythmIsReversed: true,
        rhythms: [],
        cycleTime: 15,
        pitchMode: PITCH_MODES.PENTATONIC,
        tuningMode: TUNING_MODES.EDO12,
        pitches: [],
        pitchOffset: -12, // used if pitch mode is edo12
        pitchMultiplier: 1, // used if pitch mode is raw
        skips: [],
        colorInterpolationMode: COLOR_INTERPOLATION_MODES.HSL,
        colorKeyFrames: [
            new ColorKeyFrame({ idx: 0, rgbValues: [255, 0, 0] }),
            new ColorKeyFrame({ idx: -1, rgbValues: [255, 0, 1] }),
        ],
        colorScale: 3,
        doColorRipple: true,
        doColorReflection: true,
        rotateCount: 1,
        globalRotationSpeed: 0,
        drawBackground: true,
        drawGlobalBorder: true,
        strokeWeight: 2,
        canvasWidth: canvasWidth,
        canvasHeight: canvasHeight,
        ngonShrinkFactor: 0.9,
        ngonInnerPolygonSideCount: 32,
        squareStyle: SQUARE_STYLES.WIREFRAME,
        sizeMultiplier: DEFAULT_SIZE_MULTIPLIER,
        backgroundColor: "#000",
        audioSampleIsCustom: false,
        audioSampleFilename: "assets/sounds/synth-pluck-C.wav",
        audioSampleDisplayName: "Sine Blip (Eb)",
        audioSampleBase64: null
    },
    {
        patchName: "Jacob Collier D7",
        animationMode: ANIMATION_MODES.NGONS,
        rhythmMode: RHYTHM_MODES.NATURALS,
        rhythmOffset: 4,
        rhythmCount: 13,
        rhythmIsReversed: true,
        rhythms: [],
        cycleTime: 10,
        pitchMode: PITCH_MODES.CUSTOM,
        tuningMode: TUNING_MODES.EDO12,
        pitches: [0, 7, 16, 22, 25, 27, 30, 33, 35, 38, 41, 44, 49],
        pitchOffset: -13, // used if pitch mode is edo12
        pitchMultiplier: 1, // used if pitch mode is raw
        skips: [],
        colorInterpolationMode: COLOR_INTERPOLATION_MODES.RGB,
        colorKeyFrames: [
            new ColorKeyFrame({ idx: 0, rgbValues: [0, 0, 255] }),
            new ColorKeyFrame({ idx: -1, rgbValues: [255, 0, 0] }),
        ],
        colorScale: 1,
        doColorRipple: false,
        doColorReflection: false,
        rotateCount: 1,
        globalRotationSpeed: 0,
        drawBackground: true,
        drawGlobalBorder: true,
        strokeWeight: 3,
        canvasWidth: canvasWidth,
        canvasHeight: canvasHeight,
        ngonShrinkFactor: 0.9,
        ngonInnerPolygonSideCount: 32,
        squareStyle: SQUARE_STYLES.WIREFRAME,
        sizeMultiplier: DEFAULT_SIZE_MULTIPLIER,
        backgroundColor: "#000",
        audioSampleIsCustom: false,
        audioSampleFilename: "assets/sounds/sine-blip-Eb.wav",
        audioSampleDisplayName: "Sine Blip (Eb)",
        audioSampleBase64: null
    }
]