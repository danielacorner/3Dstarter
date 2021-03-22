import { useEffect, useState } from "react";
import useSound from "use-sound";
import music from "./music";
import { useStore } from "../../store";

export function useAudioTrack() {
  const started = useStore((s) => s.started);
  const soundOn = useStore((s) => s.soundOn);
  const busy = false;
  const [play, { isPlaying, pause }] = useSound(music, {
    volume: busy ? 0.4 : 1,
  });
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);

  // start the music when we click "ready" for the first time
  useEffect(() => {
    if (started && !isAudioEnabled) {
      setIsAudioEnabled(true);
    }
  }, [started, isAudioEnabled]);

  useEffect(() => {
    if (soundOn && isAudioEnabled && !isPlaying) {
      play();
    } else if (!isAudioEnabled && isPlaying) {
      pause();
    }
    return () => {
      pause();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAudioEnabled, soundOn]);
}
