<script>
    import BMG from '$lib/images/BMG.webp';
    import { windowSize } from './utils';

    let bmgWidth = $state(0);
    let classes = $state('splash');

    $effect(() => {
        let { w, h } = windowSize();
        bmgWidth = Math.min(300, Math.min(w, h) * 0.6);
    });

    const onPointerDown = () => {
        localStorage.clear();
        classes = 'splash dark';
    };
</script>

<div class={classes} onpointerdown={onPointerDown}>
    <img src={BMG} alt='' width={bmgWidth} />
</div>

<style>
    .splash {
        /* grid-area: 1/1; */
        position: absolute;
        width: 100dvw;
        height: 100dvh;
        display: grid;
        background: #202020;
        background-image: radial-gradient(transparent, black 100%);
        place-content: center;
        color: #f0f8ff;
        z-index: 300;
        /* transition: background-color 0.3s; */
    }

    .dark {
        background-color: #000000;
    }
</style>
