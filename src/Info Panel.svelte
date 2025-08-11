<script>
    import NumberFlow, { NumberFlowGroup } from '@number-flow/svelte';
    import { selectedCells, selectedValueCells } from './shared.svelte';
    import { _prompt, ss } from './state.svelte';

    const count = $derived(selectedCells().length);
    const total = $derived(selectedValueCells().length);
</script>

<div class="info-panel {ss.selected && !ss.over && _prompt.opacity === 0 ? 'visible' : ''}">
    <div class="value"><NumberFlow prefix="$" value={(ss.selected || 0) * count} /></div>
    <span>•</span>
    <span class="label">SELECTED</span>
    <span>•</span>
    <NumberFlowGroup>
        <div class="count">
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
        grid-auto-flow: column;
        gap: 10px;
        font-family: Roboto;
        font-size: 20px;
        font-weight: bold;
        color: var(--gray);
        align-items: center;
        opacity: 0;
        transition: opacity 0.2s;
    }

    .visible {
        opacity: 1;
    }

    .label {
        font-family: PFD Mono;
    }

    .value {
        scale: 0.85 1;
        color: var(--sn);
    }

    .count {
        color: var(--sn);
        display: grid;
        grid-auto-flow: column;
    }
</style>
