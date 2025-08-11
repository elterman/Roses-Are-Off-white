<script>
    import { fade } from 'svelte/transition';
    import { PROMPT_RESUME, PROMPT_START } from './const';
    import PromptPanel from './Prompt Panel.svelte';
    import { ss } from './state.svelte';
    import { tapOrClick } from './utils';
    import { onStart } from './shared.svelte';
    import { _sound } from './sound.svelte';

    const ul = '<ul style="margin: 15px 0 0 0;">';
    const li = '<li style="margin: 5px 0 0 -20px;">';
    const click = tapOrClick();

    const CONTENT = `
        <span>Your rose garden is overrun with invasive flowers. Weed them out as quickly as possible. </span>
        ${ul}
        ${li}${click} a flower to select it.</li>
        ${li}Then select all other flowers of the same type.</li>
        ${li}Once complete, all selected flowers are removed and then replaced.</li>
        ${li}Selecting a rose instantly ends the game in failure.</li>
        ${li}Otherwise, the game ends when only roses remain.</li>
        </ul>`;

    const resume = $derived(ss.cells.length && !ss.over);
    const label = $derived(resume ? PROMPT_RESUME : PROMPT_START);
    const fsz = $derived(resume ? 29 : 32);

    const onClick = () => {
        _sound.play('plop');

        ss.intro = false;

        if (!resume) {
            onStart();
        }
    };
</script>

{#if ss.intro}
    <div class="intro">
        <div class="title">
            <span>Roses Are</span>
            <span>Off-white</span>
        </div>
        <div class="content" tabindex="-1">
            <!-- eslint-disable-next-line svelte/no-at-html-tags -->
            {@html CONTENT}
        </div>
        <div class="buttons">
            <PromptPanel ops={[{ label, style: `font-size: ${fsz}px;`, onClick }]} />
        </div>
    </div>
{/if}

<style>
    .intro {
        place-self: center;
        grid-area: 1/1;
        display: grid;
        justify-items: center;
    }

    .title {
        display: grid;
        place-items: center;
        font-family: Cinzel;
        font-size: 48px;
        line-height: 1.2em;
    }

    .content {
        font-family: Cinzel;
        font-weight: bold;
        font-size: 17px;
        display: grid;
        align-content: start;
        width: 330px;
        margin: 40px 0 50px;
    }

    .buttons {
        place-self: center;
    }
</style>
