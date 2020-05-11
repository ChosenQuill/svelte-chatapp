<svelte:head>
  <title>About</title>
</svelte:head>

<style type="scss">
    a {
        color: lightseagreen;
        text-decoration: none;
        background-image: linear-gradient(currentColor, currentColor);
        background-position: 0% 100%;
        background-repeat: no-repeat;
        background-size: 0% 2px;
        transition: background-size .3s;

        &:hover, &:focus {
            background-size: 100% 2px;
        }
    }
</style>

<h1>About this site</h1>

<p class="text-xl">
    Welcome to the {"<insert chatapp name>"} site. This app is an example site made to learn the numerous frameworks it's made up of. Feel free to explore and try out the application. 
    <br /><br />
    If you have questions, join the <a href="https://discord.suredroid.com">discord server</a>, or if you want to see how it works, check out the <a href="https://github.com/SureDroid/svelte-chatapp">source code</a>. Hope you enjoy!
</p>