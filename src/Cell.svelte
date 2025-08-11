<script>
    import F1 from '$lib/images/$1.webp';
    import F10 from '$lib/images/$10.webp';
    import F100 from '$lib/images/$100.webp';
    import B100 from '$lib/images/$100B.webp';
    import B10 from '$lib/images/$10B.webp';
    import B1 from '$lib/images/$1B.webp';
    import F2 from '$lib/images/$2.webp';
    import F20 from '$lib/images/$20.webp';
    import B20 from '$lib/images/$20B.webp';
    import B2 from '$lib/images/$2B.webp';
    import F5 from '$lib/images/$5.webp';
    import F50 from '$lib/images/$50.webp';
    import B50 from '$lib/images/$50B.webp';
    import B5 from '$lib/images/$5B.webp';
    import Fake from '$lib/images/Fake.webp';
    import Real from '$lib/images/Real.webp';
    import { random, sample } from 'lodash-es';
    import { BILLS } from './const';
    import { onOver, selectedCells, selectedValueCells } from './shared.svelte';
    import { _sound } from './sound.svelte';
    import { _prompt, ss } from './state.svelte';
    import { cellIndex, post } from './utils';

    const { cell } = $props();
    let _this = $state(null);
    const bills = { 1: [F1, B1], 2: [F2, B2], 5: [F5, B5], 10: [F10, B10], 20: [F20, B20], 50: [F50, B50], 100: [F100, B100] };

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

                for (const cob of cells) {
                    delete cob.killed;
                    delete cob.penalty;
                    delete cob.selected;
                    delete cob.value;
                    delete cob.back;

                    const i = cellIndex(cob);
                    ss.cells[i].value = sample(BILLS);
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
        `cell ${disabled ? 'disabled' : ''} ${cell.flip ? 'flipped' : ss.over === 'won' ? 'pulse' : ss.over === 'lost' ? 'shake' : ''}`,
    );
</script>

<div bind:this={_this} class={classes} style="grid-area: {cell.row}/{cell.col};" onpointerdown={onPointerDown}>
    <div class="cell-inner {cell.killed ? 'pop' : ''}">
        <img class="img {cell.value && !cell.killed ? 'visible' : ''}" src={cell.value ? bills[cell.value][cell.back] : null} alt="" />
        {#if cell.selected && !ss.over}
            {@const style = 'user-drag: none;'}
            <img class="stamp {cell.killed ? 'fake-fade' : ''}" {style} src={Fake} alt="" />
        {:else if cell.penalty}
            {@const style = 'user-drag: none;'}
            <img class="stamp" {style} src={Real} alt="" />
        {/if}
    </div>
</div>

<style>
    .cell {
        display: grid;
        width: 123px;
        height: 52px;
        cursor: pointer;
        z-index: 1;
        transition: transform 0.6s linear;
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
        transition: opacity 0.5s;
        -webkit-user-drag: none; /* For WebKit browsers (Chrome, Safari) */
        filter: drop-shadow(0 0 5px white);
    }

    .fake-fade {
        opacity: 0;
    }

    .minus {
        font-weight: bold;
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
    }

    .pop {
        animation: pop 0.3s cubic-bezier(0.16, 0.87, 0.48, 0.99) forwards;
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
