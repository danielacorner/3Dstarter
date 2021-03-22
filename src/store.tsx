import create from "zustand";
import { MAX_SCALE, WORLD_RADIUS } from "./utils/constants";

type GlobalStateType = {
  /** temperature = particle velocity */
  temperature: number;
  /** mute the music */
  soundOn: boolean;
  /** has the app been started */
  started: boolean;
  /** is the game paused / temperature === 0 */
  paused: boolean;
  /** if a property in the store is animating e.g. scale, can turn things on/off */
  isPropertyAnimating: boolean;
  /** how high is the 3d container's ceiling */
  ceilingHeight: number;
  pointerDownStartTime: number | null;
  /** scale of the scene */
  scale: number;
  set: (newState: any) => any;
  setScale: (newScale: any) => any;
  setTemperature: (newTemp: any) => any;
};

const startsStarted = false && process.env.NODE_ENV === "development";

export const INITIAL_PLAYER_HP = 4000;
export const INITIAL_CEILING_HEIGHT = WORLD_RADIUS * 2;

export function getSettingsFromLS() {
  const settings = window.localStorage.getItem("settings");
  return JSON.parse(settings);
}

const initialSoundOn = (() => {
  const settings = getSettingsFromLS();
  return settings && "soundOn" in settings ? settings.soundOn : true;
})();

// zustand https://github.com/pmndrs/zustand
// with typescript https://react-tracked.js.org/docs/tutorial-zustand-01/
export const useStore = create<GlobalStateType>(
  (set): GlobalStateType => ({
    paused: false,
    soundOn: initialSoundOn,
    isPropertyAnimating: false,
    pointerDownStartTime: null,
    started: startsStarted,
    temperature: 1,
    ceilingHeight: INITIAL_CEILING_HEIGHT,
    scale: MAX_SCALE,
    setScale: (newValue) => set(() => ({ scale: newValue })),
    setTemperature: (newValue) => set(() => ({ temperature: newValue })),
    set: (newState) => set((state) => ({ ...state, ...newState })),
  })
);
