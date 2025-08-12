<script>
    import { elapsedSecs } from './shared.svelte';
    import { ss } from './state.svelte';
    import Timer from './Timer.svelte';

    const color = $derived(ss.over === 'lost' ? 'lost' : '');
</script>

<div class="counters {color}">
    <div class="timer {color}">
        <Timer secs={elapsedSecs()} />
    </div>
</div>

<style>
    .counters {
        grid-area: 2/1;
        place-self: center;
        display: grid;
        grid-auto-flow: column;
        align-items: center;
        gap: 50px;
        /* transition: color 1s; */
    }

    .timer {
        font-size: 40px;
    }

    .lost {
        background: var(--offwhite);
        color: var(--background);
        padding: 3px 5px;
    }
</style>
