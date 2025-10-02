import ValidationError from '../../audio/ValidationError.wav';

const sounds = {
    error: new Audio(ValidationError),
};

export default function useSounds() {
    return (sound: keyof typeof sounds) => sounds[sound].play();
}
