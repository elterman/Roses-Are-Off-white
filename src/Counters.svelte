<script>
    import Score from './Score.svelte';
    import { elapsedSecs } from './shared.svelte';
    import { ss } from './state.svelte';
    import Timer from './Timer.svelte';

    const color = $derived(ss.over === 'lost' ? 'red' : '');
</script>

<div class="counters {color}">
    <Score />
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
        color: var(--background);
        transition: color 1s;
    }

    .timer {
        font-size: 40px;
        color: var(--sn);
    }

    .red {
        color: brown;
    }
</style>
