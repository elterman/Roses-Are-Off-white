<script>
    import MusicOff from '$lib/images/Music Off.webp';
    import MusicOn from '$lib/images/Music On.webp';
    import Help from '$lib/images/Question.webp';
    import ResetStats from '$lib/images/Reset Stats.webp';
    import Restart from '$lib/images/Restart.webp';
    import SoundOff from '$lib/images/Sound Off.webp';
    import SoundOn from '$lib/images/Sound On.webp';
    import { PROMPT_PLAY_AGAIN, PROMPT_RESET_STATS, PROMPT_RESTART } from './const';
    import { persist, showIntro } from './shared.svelte';
    import { _sound } from './sound.svelte';
    import { _prompt, _stats, ss } from './state.svelte';
    import ToolButton from './Tool Button.svelte';

    const onHelp = () => {
        if (ss.intro) {
            showIntro(false);

            if (ss.over) {
                _prompt.set(PROMPT_PLAY_AGAIN);
            }

            return;
        }

        showIntro(true);
    };

    const onResetStats = () => {
        if (_prompt.id == PROMPT_RESET_STATS) {
            _prompt.opacity = 0;
            return;
        }

        _sound.play('plop');
        _prompt.set(PROMPT_RESET_STATS);
    };

    const onRestart = () => {
        if (_prompt.id == PROMPT_RESTART) {
            _prompt.opacity = 0;
            return;
        }

        _sound.play('plop');
        _prompt.set(PROMPT_RESTART);
    };

    const onSound = () => {
        _sound.sfx = !_sound.sfx;

        if (_sound.sfx) {
            _sound.play('won', { rate: 4 });
        }

        persist();
    };

    const onMusic = () => {
        _sound.music = !_sound.music;

        if (_sound.music) {
            _sound.playMusic();
        } else {
            _sound.stopMusic();
        }

        persist();
    };
</script>

<div class="toolbar">
    <ToolButton id="tb-help" src={Help} onClick={onHelp} />
    <ToolButton id="tb-restart" src={Restart} onClick={onRestart} disabled={!ss.timer}/>
    <ToolButton id="tb-reset-stats" src={ResetStats} onClick={onResetStats} disabled={_stats.plays === 0} />
    <ToolButton id="tb-sfx" src={_sound.sfx ? SoundOn : SoundOff} onClick={onSound} />
    <ToolButton id="tb-music" src={_sound.music ? MusicOn : MusicOff} onClick={onMusic} />
</div>

<style>
    .toolbar {
        grid-area: 5/1;
        display: grid;
        grid-auto-flow: column;
        place-content: center;
        gap: 5px;
    }
</style>
