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
                _stats.best_secs = job.best_secs;
                _sound.sfx = job.sfx;
                _sound.music = job.music;
            }
        };

        post(loadGame);
    });
</script>

<div class="game-page-container">
    <div class="game-page {ss.intro ? 'slide' : ''}">
        <Stats />
        <Counters />
        <Board />
        <InfoPanel />
        <Prompt />
        <Toolbar />
    </div>
</div>

<style>
    .game-page-container {
        grid-area: 1/1;
        display: grid;
        margin: 0 20px;
        overflow: hidden;
    }

    .game-page {
        display: grid;
        grid: auto 1.5fr auto 1fr auto / auto;
        padding: 40px 0;
        width: 100%;
        transition: transform 0.2s;
    }

    .slide {
        transform: translateX(400px);
    }
</style>
