<script>
    import { TIME_OUT_SECS } from './const';
    import { elapsedSecs } from './shared.svelte';
    import { ss } from './state.svelte';
    import Timer from './Timer.svelte';
</script>

<div class="counters">
    {#if elapsedSecs() >= TIME_OUT_SECS}
        <span>timed out at</span>
    {:else if ss.over}
        <span>{ss.over === 'lost' ? 'you failed at' : 'perfect garden in'}</span>
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
