
                  SampleRangeConversion: LIMITED_RANGE_SQUEEZE | NONE,
                  Saturation: 'NUMBER_VALUE'
                },
                Deinterlacer: {
                  Algorithm: INTERPOLATE | INTERPOLATE_TICKER | BLEND | BLEND_TICKER,
                  Control: FORCE_ALL_FRAMES | NORMAL,
                  Mode: DEINTERLACE | INVERSE_TELECINE | ADAPTIVE
                },
                DolbyVision: {
                  L6Metadata: {
                    MaxCll: 'NUMBER_VALUE',
                    MaxFall: 'NUMBER_VALUE'
                  },
                  L6Mode: PASSTHROUGH | RECALCULATE | SPECIFY,
                  Profile: PROFILE_5
                },
                Hdr10Plus: {
                  MasteringMonitorNits: 'NUMBER_VALUE',
                  TargetMonitorNits: 'NUMBER_VALUE'
                },
                ImageInserter: {
                  InsertableImages: [
                    {
                      Duration: 'NUMBER_VALUE',
                      FadeIn: 'NUMBER_VALUE',
                      FadeOut: 'NUMBER_VALUE',
                      Height: 'NUMBER_VALUE',
                      ImageInserterInput: 'STRING_VALUE',
                      ImageX: 'NUMBER_VALUE',
                      ImageY: 'NUMBER_VALUE',
                      Layer: 'NUMBER_VALUE',
                      Opacity: 'NUMBER_VALUE',
                      StartTime: 'STRING_VALUE',
                      Width: 'NUMBER_VALUE'
                    },
                    /* more items */
                  ]
                },
                NoiseReducer: {
                  Filter: BILATERAL | MEAN | GAUSSIAN | LANCZOS | SHARPEN | CONSERVE | SPATIAL | TEMPORAL,
                  FilterSettings: {
                    Strength: 'NUMBER_VALUE'
                  },
                  SpatialFilterSettings: {
                    PostFilterSharpenStrength: 'NUMBER_VALUE',
                    Speed: 'NUMBER_VALUE',
                    Strength: 'NUMBER_VALUE'
                  },
                  TemporalFilterSettings: {
                    AggressiveMode: 'NUMBER_VALUE',
                    PostTemporalSharpening: DISABLED | ENABLED | AUTO,
                    Speed: 'NUMBER_VALUE',
                    Strength: 'NUMBER_VALUE'
                  }
                },
                PartnerWatermarking: {
                  NexguardFileMarkerSettings: {
                    License: 'STRING_VALUE',
                    Payload: 'NUMBER_VALUE',
                    Preset: 'STRING_VALUE',
                    Strength: LIGHTEST | LIGHTER | DEFAULT | STRONGER | STRONGEST
                  }
                },
                TimecodeBurnin: {
                  FontSize: 'NUMBER_VALUE',
                  Position: TOP_CENTER | TOP_LEFT | TOP_RIGHT | MIDDLE_LEFT | MIDDLE_CENTER | MIDDLE_RIGHT | BOTTOM_LEFT | BOTTOM_CENTER | BOTTOM_RIGHT,
                  Prefix: 'STRING_VALUE'
                }
              },
              Width: 'NUMBER_VALUE'
            }
          },
          /* more items */
        ]
      },
      /* more items */
    ],
    TimecodeConfig: {
      Anchor: 'STRING_VALUE',
      Source: EMBEDDED | ZEROBASED | SPECIFIEDSTART,
      Start: 'STRING_VALUE',
      TimestampOffset: 'STRING_VALUE'
    },
    TimedMetadataInsertion: {
      Id3Insertions: [
        {
          Id3: 'STRING_VALUE',
          Timecode: 'STRING_VALUE'
        },
        /* more items */
      ]
    }
  },
  AccelerationSettings: {
    Mode: DISABLED | ENABLED | PREFERRED /* required */
  },
  BillingTagsSource: QUEUE | PRESET | JOB_TEMPLATE | JOB,
  ClientRequestToken: 'STRING_VALUE',
  HopDestinations: [
    {
      Priority: 'NUMBER_VALUE',
      Queue: 'STRING_VALUE',
      WaitMinutes: 'NUMBER_VALUE'
    },
    /* more items */
  ],
  JobTemplate: 'STRING_VALUE',
  Priority: 'NUMBER_VALUE',
  Queue: 'STRING_VALUE',
  SimulateReservedQueue: DISABLED | ENABLED,
  StatusUpdateInterval: SECONDS_10 | SECONDS_12 | SECONDS_15 | SECONDS_20 | SECONDS_30 | SECONDS_60 | SECONDS_120 | SECONDS_180 | SECONDS_240 | SECONDS_300 | SECONDS_360 | SECONDS_420 | SECONDS_480 | SECONDS_540 | SECONDS_600,
  Tags: {
    '<__string>': 'STRING_VALUE',
    /* '<__string>': ... */
  },
  UserMetadata: {
    '<__string>': 'STRING_VALUE',
    /* '<__string>': ... */
  }
};
mediaconvert.createJob(params, function(err, data) {
  if (err) console.log(err, err.stack); // an error occurred
  else     console.log(data);           // successful response
});