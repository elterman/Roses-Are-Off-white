<script>
    import { _prompt } from './state.svelte';
    import { post } from './utils';

    const { op } = $props();

    let scale = $state(1);
    const style = $derived(`transform: scale(${scale});`);

    $effect(() => {
        const onTransitionEnd = (e) => {
            if (e.target.id !== op.label) {
                return;
            }

            if (scale < 1) {
                scale = 1;
            } else {
                post(op.onClick);
                _prompt.opacity = 0;
            }
        };

        window.addEventListener('transitionend', onTransitionEnd);
        return () => window.removeEventListener('transitionend', onTransitionEnd);
    });
</script>

<div id={op.label} class='button-base no-highlight button' {style} onpointerdown={() => (scale = 0.8)}>
    <span style={op.style}>{op.label}</span>
</div>

<style>
    .button {
        cursor: pointer;
        font-family: Cinzel;
    }

    .button:hover {
        text-decoration: underline;
    }
</style>
