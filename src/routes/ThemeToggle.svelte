<script>
    import LightDarkIcon from '$lib/components/LightDarkIcon.svelte'
    import { browser } from '$app/environment'
    import { onMount, tick } from 'svelte'
    import { theme } from '$lib/data/store'

    let prefersLight
    prefersLight = theme === "dark"
    const changeTheme = async () => {
        prefersLight = !prefersLight;
        if(browser){
            window.localStorage.setItem('prefersLight', JSON.stringify(prefersLight))
            await tick()
            if (!prefersLight) {
                document.querySelector('html').classList.add('dark')
            }
            else{
                document.querySelector('html').classList.remove('dark')
            }
        }
        
    }
    onMount(function () {
        //must be added in app.html also (for some reason)
        if (
        ('prefersLight' in localStorage && Boolean(JSON.parse(localStorage.getItem('prefersLight'))) === false) ||
        (!('prefersLight' in localStorage) &&
            window.matchMedia('(prefers-color-scheme: dark)').matches)
        ) {
            document.querySelector('html').classList.add('dark')
        }
        else {
            document.querySelector('html').classList.remove('dark')
        }
    })
</script>
<div class="!font-Inter !text-transparent bg-clip-text bg-gray-600 dark:bg-white">
    <button
    id="changeTheme"
    type="button"
    role="switch"
    aria-label="Toggle Dark Mode"
    aria-checked={!prefersLight}
    class="settings-toggle !rounded-2xl	!h-8 !w-8 sm:h-8 sm:w-8 sm:p-1 !z-10"
    class:dark={!prefersLight}
    aria-pressed={!prefersLight}
    on:click={changeTheme}
    >
    <LightDarkIcon />
</button>
</div>
