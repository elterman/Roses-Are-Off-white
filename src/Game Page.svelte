<script>
    import { onMount } from 'svelte';
    import Board from './Board.svelte';
    import Counters from './Counters.svelte';
    import InfoPanel from './Info Panel.svelte';
    import Prompt from './Prompt.svelte';
    import Stats from './Stats.svelte';
    import Toolbar from './Toolbar.svelte';
    import { APP_STATE } from './const';
    import { _sound } from './sound.svelte';
    import { _stats, ss } from './state.svelte';
    import { post } from './utils';

    onMount(() => {
        const loadGame = () => {
            const json = localStorage.getItem(APP_STATE);
            const job = JSON.parse(json);

            if (job) {
                _stats.plays = job.plays;
                _stats.won = job.won;
                _stats.total_secs = job.total_secs;
                _stats.total_points = job.total_points;
                _stats.best_secs = job.best_secs;
                _stats.best_points = job.best_points;
                _sound.sfx = job.sfx;
                _sound.music = job.music;
            }
        };

        post(loadGame);
    });

    const hidden = $derived(ss.intro);
</script>

<div class="game-page {hidden ? 'hidden' : ''}">
    <Stats />
    <Counters/>
    <Board />
    <InfoPanel />
    <Prompt />
    <Toolbar />
</div>

<style>
    .game-page {
        grid-area: 1/1;
        display: grid;
        grid: auto 1fr auto 1fr auto / auto;
        padding: 40px 0;
        /* background: #0007; */
        width: 100%;
    }

    .hidden {
        opacity: 0;
    }
</style>
