<script>
    import NumberFlow, { NumberFlowGroup } from '@number-flow/svelte';

    const { secs } = $props();

    const time = $derived.by(() => {
        const ds = (secs - Math.floor(secs)) * 10;
        const s = Math.floor(secs % 60);
        const m = Math.floor((secs / 60) % 60);
        const h = Math.floor(secs / (60 * 60));
        return { h, m, s, ds };
    });
</script>

<div class="timer">
    <NumberFlowGroup>
        <div
            style="font-variant-numeric: tabular-nums; --number-flow-char-height: 0.85em;"
            class="~text-3xl/4xl flex items-baseline font-semibold group">
            {#if time.h}
                <NumberFlow trend={1} value={time.h} />
            {/if}
            <NumberFlow prefix={time.h ? ':' : ''} trend={1} value={time.m} digits={{ 1: { max: 5 } }} />
            <NumberFlow prefix=":" trend={1} value={time.s} digits={{ 1: { max: 5 } }} format={{ minimumIntegerDigits: 2 }} />
        </div>
    </NumberFlowGroup>
</div>

<style>
    .timer {
        display: grid;
        font-family: Roboto;
        scale: 0.85 1;
        font-weight: bold;
        /* font-size: 40px; */
    }

    .group {
        display: grid;
        grid-auto-flow: column;
    }
</style>
