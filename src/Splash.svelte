<script>
    import { scale } from 'svelte/transition';

    let classes = $state('splash');

    const onPointerDown = () => {
        localStorage.clear();
        classes = 'splash dark';
    };
</script>

<div class={classes} onpointerdown={onPointerDown} out:scale={{ opacity: 1 }}>
    <!-- <img src={BMG} alt="" width={bmgWidth}/> -->
</div>

<style>
    .splash {
        /* grid-area: 1/1; */
        position: absolute;
        width: 100dvw;
        height: 100dvh;
        display: grid;
        background: #202020;
        background-image:  url($lib/images/BMG.webp);
        background-size: calc(min(300px, min(100dvh, 100dvw) * 0.6));
        background-repeat: no-repeat;
        background-attachment: fixed;
        background-position: center;
        z-index: 300;
        /* transition: background-color 0.3s; */
    }

    .dark {
        background-color: #000000;
    }
</style>
