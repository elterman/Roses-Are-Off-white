<script>
    import { CHEER_BEST_SCORE, PROMPT_NO, PROMPT_PLAY_AGAIN, PROMPT_RESET_STATS, PROMPT_RESTART } from './const';
    import PromptPanel from './Prompt Panel.svelte';
    import { onPlayAgain, persist } from './shared.svelte';
    import { _sound } from './sound.svelte';
    import { _prompt, _stats, ss } from './state.svelte';

    const label = $derived(_prompt.id);

    $effect(() => {
        const onTransitionEnd = (e) => {
            const id = e.target.id;

            if (id !== 'prompt') {
                return false;
            }

            if (e.propertyName !== 'opacity') {
                return;
            }

            if (_prompt.opacity == 0) {
                _prompt.set(ss.over && !ss.swirl ? PROMPT_PLAY_AGAIN : null);
            }
        };

        window.addEventListener('transitionend', onTransitionEnd);
        return () => window.removeEventListener('transitionend', onTransitionEnd);
    });

    const onResetStats = () => {
        _sound.play('link1', { rate: 0.7 });

        _stats.plays = ss.timer ? 1 : 0;
        _stats.won = 0;
        _stats.total_secs = 0;
        _stats.best_secs = 0;

        persist();
    };

    const style = `font-size: ${24}px;`;
</script>

<div id="prompt" class="prompt {_prompt.opacity ? 'visible' : ''} {_prompt.id === CHEER_BEST_SCORE ? 'pulse' : ''}">
    {#if label === PROMPT_PLAY_AGAIN}
        <PromptPanel ops={[{ label, style, onClick: onPlayAgain }]} />
    {:else if label === PROMPT_RESTART}
        <PromptPanel
            ops={[
                { label, style, onClick: onPlayAgain },
                { label: PROMPT_NO, style },
            ]} />
    {:else if label === PROMPT_RESET_STATS}
        <PromptPanel
            ops={[
                { label, style, onClick: onResetStats },
                { label: PROMPT_NO, style },
            ]} />
    {:else if label}
        <PromptPanel ops={[{ label, style }]} />
    {/if}
</div>

<style>
    .prompt {
        grid-area: 4/1;
        display: grid;
        place-self: center;
        transform: scale(0);
        opacity: 0;
        z-index: 1;
        transition: 0.3s;
        place-content: center;
    }

    .visible {
        opacity: 1;
        transform: scale(1);
    }

    .pulse {
        animation: pulse 0.2s alternate 10 ease-in-out;
    }

    @keyframes pulse {
        from {
            transform: scale(1);
        }
        to {
            transform: scale(0.85);
        }
    }
</style>
