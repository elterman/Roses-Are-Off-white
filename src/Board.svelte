<script>
    import Cell from './Cell.svelte';
    import { onStart } from './shared.svelte';
    import { ss } from './state.svelte';

    let _this = $state(null);

    $effect(() => {
        const onTransitionEnd = (e) => {
            if (e.propertyName !== 'transform') {
                return;
            }

            if (ss.swirl) {
                ss.swirl = false;
                onStart();
            }
        };

        _this.addEventListener('transitionend', onTransitionEnd);
        return () => _this.removeEventListener('transitionend', onTransitionEnd);
    });
</script>

<div class="board {ss.swirl ? 'swirled' : ''}" bind:this={_this}>
    {#each ss.cells as cell (cell.row * 10 + cell.col)}
        <Cell {cell} />
    {/each}
</div>

<style>
    .board {
        grid-area: 3/1;
        place-self: center;
        display: grid;
        grid: repeat(9, auto) / repeat(3, auto);
        transition: linear transform 0.5s;
    }

    .swirled {
        transform: rotateY(90deg);
    }

    .stamp {
        z-index: 1;
        width: 250px;
        place-self: center;
        transition: opacity 0.5s;
        -webkit-user-drag: none; /* For WebKit browsers (Chrome, Safari) */
        filter: drop-shadow(0 0 5px white);
    }
</style>
