<script>
    import NumberFlow, { NumberFlowGroup } from '@number-flow/svelte';
    import { selectedCells, selectedValueCells } from './shared.svelte';
    import { _prompt, ss } from './state.svelte';
    import { FLOWERS } from './const';

    const count = $derived(selectedCells().length);
    const total = $derived(selectedValueCells().length);
</script>

<div class="info-panel {ss.selected && !ss.over && _prompt.opacity === 0 ? 'visible' : ''}">
    <span class="label">{ss.selected ? FLOWERS[ss.selected - 1][1] : ''}</span>
    <NumberFlowGroup>
        <div class="count" style=" --number-flow-mask-height: 0em;">
            <NumberFlow value={count} />
            <NumberFlow prefix="/" value={total} />
        </div>
    </NumberFlowGroup>
</div>

<style>
    .info-panel {
        grid-area: 4/1;
        place-self: center;
        display: grid;
        justify-items: center;
        gap: 10px;
        font-family: Roboto;
        font-size: 20px;
        font-weight: bold;
        align-items: center;
        opacity: 0;
    }

    .visible {
        opacity: 1;
    }

    .label {
        font-family: PFD Mono;
    }

    .count {
        display: grid;
        grid-auto-flow: column;
    }
</style>
