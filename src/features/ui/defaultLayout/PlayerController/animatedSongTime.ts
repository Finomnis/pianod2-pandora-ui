import React from "react";

export const useAnimatedSongTime = (
    songPosition: {
        lastKnownPosition: number | null,
        lastPositionUpdate: number | null,
    },
    songDuration: number | null,
    playing: boolean
) => {
    const [animatedTime, setAnimatedTime] = React.useState<number | null>(0);

    React.useEffect(() => {
        const lastKnownPosition = songPosition.lastKnownPosition;
        const lastPositionUpdate = songPosition.lastPositionUpdate;

        if (!playing
            || lastKnownPosition === null
            || lastPositionUpdate === null
            || songDuration == null) {
            setAnimatedTime(lastKnownPosition);
            return () => { };
        }

        const animationFrame = { current: 0 };

        const animate = () => {
            // Has to be at the beginning!
            // Otherwise sometimes the animation doesn't get properly
            // cancelled
            animationFrame.current = requestAnimationFrame(animate);

            const now = Date.now();

            const timePassed = (now - lastPositionUpdate) / 1000.0;
            let extrapolatedPosition = lastKnownPosition + timePassed;
            if (extrapolatedPosition > songDuration) {
                extrapolatedPosition = songDuration;
            }

            setAnimatedTime(extrapolatedPosition);
        }

        animationFrame.current = requestAnimationFrame(animate);
        return () => {
            cancelAnimationFrame(animationFrame.current);
        }
    }, [
        // Only restart animation if input data changed
        songPosition.lastKnownPosition,
        songPosition.lastPositionUpdate,
        songDuration,
        playing,
    ]);

    return animatedTime;
};
