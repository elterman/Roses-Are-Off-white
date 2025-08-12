<script>
    import { elapsedSecs } from './shared.svelte';
    import { ss } from './state.svelte';
    import Timer from './Timer.svelte';
</script>

<div class="counters">
    {#if ss.over === 'lost'}
        <span>you failed at</span>
    {/if}
    <div class="timer">
        <Timer secs={elapsedSecs()} />
    </div>
</div>

<style>
    .counters {
        grid-area: 2/1;
        place-self: center;
        display: grid;
        justify-items: center;
        align-items: center;
        gap: 10px;
        font-family: Cinzel;
    }

    .timer {
        font-size: 40px;
    }
</style>
