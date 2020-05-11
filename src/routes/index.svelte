<script>
    import { TextField, Button } from "smelte";
    import { onMount } from "svelte";
    import { api } from "./_socket";
    
    let messages = [];
    let username;

    let input;
    function submit(){
        if(!input)
            return;
        messages = [...messages, {username, message: input}];
        console.log("Form submitted. Value: " + input,messages);
        input = "";
    }
</script>

<div class="flex flex-col h-full shadow-lg p-4">
    {#if username}
        {#each messages as {username, message}}
            <div class="my-1 font-medium">
                <span class="font-bold">{username}:</span> {message}
            </div>
        {/each}
        <form class="flex mt-auto justify-evenly" on:submit={(e)=>{e.preventDefault(); submit();}}>
            <div class="w-5/6 ">
                <TextField bind:value={input} label="Message"/>
            </div>
            <Button add="h-12 mt-3 px-6">
                Send
            </Button>
        </form>
    {:else}
        <div class="h-full flex items-center justify-center">
            <form class="flex flex-col m-3" on:submit="{(e)=>{e.preventDefault(); username = e.target.username.value;}}">
                <div class="text-xl">
                    Welcome <br class="sm:hidden"/> to the chat app!
                </div>
                <div>
                    Please login to continue.
                </div>
                <TextField label="Name" class="-mb-2" name="username" outlined/>
                <Button>Submit</Button>
            </form>
        </div>
    {/if}
</div>
