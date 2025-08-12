<script>
    import RoseKilled from '$lib/images/Rose Killed.webp';
    import { random, sample, sampleSize } from 'lodash-es';
    import { FLOWER_COUNT, FLOWERS } from './const';
    import { onOver, selectedCells, selectedValueCells } from './shared.svelte';
    import { _sound } from './sound.svelte';
    import { _prompt, ss } from './state.svelte';
    import { cellIndex, post, range } from './utils';

    const { cell } = $props();
    let _this = $state(null);

    const updateScore = (gain) => {
        ss.score += gain;
    };

    const emptyCells = () => ss.cells.filter((cell) => !cell.value);

    export const allOnes = () => emptyCells().length === 0 && ss.cells.every((cob) => cob.value === 1);

    const onPointerDown = () => {
        const i = cellIndex(cell);

        if (cell.value === 1) {
            onOver('lost');
            ss.cells[i].penalty = true;
            updateScore(-ss.score);

            return;
        }

        _sound.play('tap');

        const on = !cell.selected;

        if (on && ss.selected !== cell.value) {
            for (const cob of ss.cells.filter((c) => c !== cell && c.selected)) {
                cob.selected = false;
            }
        }

        ss.cells[i].selected = on;
        ss.selected = ss.cells.some((cob) => cob.selected && cob.value === cell.value) ? cell.value : null;

        if (!on) {
            return;
        }

        const cells = selectedCells();

        if (cells.length === selectedValueCells().length) {
            for (const cob of cells) {
                const i = cellIndex(cob);
                ss.cells[i].killed = true;
            }

            const gain = cells.reduce((sum, cob) => sum + cob.value, 0);
            updateScore(gain);

            _sound.play(gain < 100 ? 'coin1' : gain < 300 ? 'coin2' : 'coins');

            post(() => {
                delete ss.selected;

                const nonRoseCells = ss.cells.filter((cob) => cob.value > 1);
                const rangeCount = Math.min(nonRoseCells.length, 7);
                const nonRoses = range(FLOWER_COUNT).slice(1);

                for (const cob of cells) {
                    delete cob.killed;
                    delete cob.penalty;
                    delete cob.selected;
                    delete cob.value;
                    delete cob.back;

                    const i = cellIndex(cob);
                    const selectFrom = [1, ...sampleSize(nonRoses, rangeCount)];
                    console.log(selectFrom);

                    ss.cells[i].value = sample(selectFrom);
                    ss.cells[i].back = random(0, 1);

                    if (allOnes()) {
                        post(() => onOver('won'), 1000);
                    }
                }
            }, 500);
        }
    };

    $effect(() => {
        const onTransitionEnd = (e) => {
            if (e.propertyName !== 'transform') {
                return;
            }

            if (cell.flip) {
                const i = cellIndex(cell);
                delete ss.cells[i].flip;
                ss.cells[i].back = 1 - cell.back;
            }
        };

        _this.addEventListener('transitionend', onTransitionEnd);
        return () => _this.removeEventListener('transitionend', onTransitionEnd);
    });

    const disabled = $derived(!cell.value || ss.over || ss.cells.some((cob) => cob.killed) || _prompt.opacity);

    const classes = $derived(
        `cell ${cell.back ? 'back' : ''} ${disabled ? 'disabled' : ''} ${cell.flip ? 'flipped' : ss.over === 'won' ? 'pulse' : ss.over === 'lost' ? 'shake' : ''} no-highlight`,
    );
</script>

<div bind:this={_this} class={classes} style="grid-area: {cell.row}/{cell.col};" onpointerdown={onPointerDown}>
    <div class="cell-inner {cell.killed ? 'pop' : cell.selected && !ss.over ? 'border' : cell.penalty ? 'penalty' : ''}">
        <img
            class="img {cell.value && !cell.killed ? 'visible' : ''}"
            src={cell.penalty ? RoseKilled : cell.value ? FLOWERS[cell.value - 1][0] : null}
            alt="" />
    </div>
</div>

<style>
    .cell {
        display: grid;
        width: 75px;
        height: 75px;
        cursor: pointer;
        z-index: 1;
        transition: transform 0.6s linear;
        box-sizing: border-box;
    }

    .back {
        scale: -1 1;
    }

    .disabled {
        pointer-events: none;
    }

    .img {
        grid-area: 1/1;
        width: 100%;
        opacity: 0;
        scale: 0;
        transition: 0.5s;
    }

    .visible {
        opacity: 1;
        scale: 1;
    }

    .stamp {
        grid-area: 1/1;
        z-index: 1;
        width: 50%;
        place-self: center;
        -webkit-user-drag: none; /* For WebKit browsers (Chrome, Safari) */
    }

    .pulse {
        animation: pulse 0.2s alternate 6 ease-in-out;
    }

    @keyframes pulse {
        from {
            transform: scale(1);
        }
        to {
            transform: scale(0.85);
        }
    }

    .shake {
        animation: shake 0.2s alternate 2 ease-in-out;
    }

    @keyframes shake {
        from {
            transform: scale(1, 1);
        }
        33% {
            transform: scale(1, 1.2);
        }
        66% {
            transform: scale(1.2, 1);
        }
        to {
            transform: scale(1, 1);
        }
    }

    .cell-inner {
        display: grid;
        border: 1px solid transparent;
    }

    .border {
        border: 1px solid var(--offwhite);
    }

    .pop {
        animation: pop 0.3s cubic-bezier(0.16, 0.87, 0.48, 0.99) forwards;
    }

    .penalty {
        background: var(--offwhite);
    }

    @keyframes pop {
        from {
            opacity: 1;
            transform: translateZ(0) scale(1, 1);
        }
        to {
            opacity: 0;
            transform: translateZ(0) scale(1.75, 1.75);
        }
    }

    .flipped {
        transform: rotateY(90deg);
    }
</style>
