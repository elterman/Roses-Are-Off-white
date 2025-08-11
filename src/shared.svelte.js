import { random, sample } from 'lodash-es';
import { APP_STATE, BILLS, COLS, PROMPT_PLAY_AGAIN, ROWS, TICK_MS, TIME_OUT_SECS } from './const';
import { _sound } from './sound.svelte';
import { _prompt, _stats, ss } from './state.svelte';
import { post } from './utils';

export const log = (value) => console.log($state.snapshot(value));

export const persist = () => {
    const json = JSON.stringify({ ..._stats, sfx: _sound.sfx, music: _sound.music });
    localStorage.setItem(APP_STATE, json);
};

export const showIntro = (value, plop = true) => {
    _prompt.opacity = 0;

    plop && _sound.play('plop');
    ss.intro = true;
};

export const onStart = () => {
    if (!_sound.musicPlayed) {
        _sound.playMusic();
    }

    _sound.play('dice');

    delete ss.over;
    delete ss.selected;
    ss.score = 0;

    const cells = [];

    for (let row = 1; row <= ROWS; row++) {
        for (let col = 1; col <= COLS; col++) {
            cells.push({ row, col, value: sample(BILLS), back: random(0, 1) });
        }
    }

    ss.cells = cells;

    _stats.plays += 1;
    persist();

    stopTimer();
    ss.ticks = 0;

    post(() => {
        onTick();
        ss.timer = setInterval(onTick, TICK_MS);
    }, 1000);
};

const stopTimer = () => {
    clearInterval(ss.timer);
    delete ss.timer;
};

export const selectedCells = () => ss.cells.filter((c) => c.selected);

export const selectedValueCells = () => ss.cells.filter((c) => c.value && c.value === ss.selected);

const onTick = () => {
    if (ss.intro) {
        return;
    }

    ss.ticks += 1;
    const secs = elapsedSecs();

    if (secs >= TIME_OUT_SECS) {
        onOver('lost');
        return;
    }

    if (secs > 10 && secs % 2 === 0) {
        const i = random(1, ROWS * COLS);
        ss.cells[i - 1].flip = true;
    }
};

export const onOver = (over) => {
    if (ss.over) {
        return;
    }

    _sound.play(over);
    ss.over = over;
    stopTimer();

    if (over === 'won') {
        _stats.won += 1;
        const secs = elapsedSecs();

        _stats.total_secs += secs;
        _stats.total_points += ss.score;

        if (_stats.best_secs === 0 || secs < _stats.best_secs) {
            _stats.best_secs = secs;
            _stats.best_points = ss.score;
        }

        persist();
    }

    post(() => _prompt.set(PROMPT_PLAY_AGAIN), 1000);
};

export const elapsedSecs = () => Math.round(((ss.ticks || 0) * TICK_MS) / 1000);