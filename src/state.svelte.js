import { PROMPT_TRANSITION } from './const';
import { post } from './utils';

export const ss = $state({
    cells: [],
    intro: true,
    score: 0,
});

export const _prompt = $state({
    id: '',
    opacity: 0,

    hide: () => {
        _prompt.opacity = 0;
        post(() => _prompt.id = null, PROMPT_TRANSITION);
    },

    set: (id) => {
        const doSet = () => {
            _prompt.id = id;
            _prompt.opacity = id ? 1 : 0;
        };

        if (_prompt.id) {
            _prompt.hide(false);
            post(doSet, PROMPT_TRANSITION);
        } else {
            doSet();
        }
    }
});

export const _stats = $state({
    plays: 0,
    won: 0,
    total_secs: 0,
    total_points: 0,
    best_secs: 0,
    best_points: 0,
});