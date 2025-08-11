<script>
    import NumberFlow from '@number-flow/svelte';
    import { ss } from './state.svelte';
</script>

<div class="score">
    <span class='dollar'>$</span>
    <NumberFlow value={ss.score} />
</div>

<style>
    .score {
        display: grid;
        grid-auto-flow: column;
        align-items: start;
        font-family: Chevalier Stripes;
        font-size: 40px;
        scale: 0.7 1;
    }

    .dollar {
        font-size: 20px;
    }
</style>
