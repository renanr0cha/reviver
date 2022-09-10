import 'little-state-machine';

declare module 'little-state-machine' {
  interface GlobalState {
    data: {
      blood_pressure_first_value: string,
      blood_pressure_second_value: string,
      heart_frequency: string,
      saturation: string,
      blood_glucose: string,
      feeling: string,
      motivation: string,
      depression: string,
      speech: string,
      swallowing: string,
      hygiene: string,
      movement_in_bed: string,
      walk: string,
      tremors: string,
      rise_from_chair: string,
      posture: string,
      marching: string,
      slowness: string
    }
  }
}