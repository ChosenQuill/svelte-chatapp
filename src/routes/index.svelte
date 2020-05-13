<script>
    import { onMount, tick } from "svelte";
    import { fade } from 'svelte/transition';
    import { TextField, Button } from "smelte";
    import { messages, loggedIn, api, typing } from "../api";
    
    import UserDisplay from '../components/UserDisplay.svelte';
    
    let input, messagebox, 
    loginerror, messageboxerror;
    // Call typing on input change if it has a vlue.
    $: input && typing();

    // Update when messages have been changed.
    messages.subscribe(async ()=>{
        if(!messagebox)
            return;
        // Wait until dom state changes have been applied before changing the messagebox's scrollbar position.
        await tick();
        messagebox.scrollTop = messagebox.scrollHeight - messagebox.clientHeight;
    })
    
    function submit(){
        if(!input)
            return;
        if(input.length > 250) {
            messageboxerror = "The max limit for messages is 250 characters. Please shorten your message."
            return;
        } else if (messageboxerror) {
            messageboxerror = "";
        }
        api.sendMessage(input);
        console.log("Message sent. Value: " + input);
        input = "";
    }

    function submitName(name) {
        if(name.length > 12) {
            loginerror = "Your name can't be over 12 characters."
            return;
        } else if (loginerror) {
            loginerror = "";
        }

        api.setName(name);
    }

</script>

<div class="flex flex-col h-full shadow-lg p-4">
    {#if $loggedIn}
        <!-- This div contains all the messages and allows for overflowing. -->
        <div class="flex flex-col overflow-y-auto" bind:this={messagebox}>
            {#each $messages as {name, message, type, timestamp}}
                <div transition:fade="{{duration: 200}}" class="my-1 {type === "broadcast" ? "font-black" : "font-medium"}" >
                    {#if type != 'broadcast'}
                        <span class="font-bold {type === 'me' && 'text-orange-600'}"> {name}:</span> 
                    {/if}
                    {message}
                </div>
            {/each}
        </div>
        <!-- Here we have our input and our send button, wrapped in a form so we can easily capture enter key events. -->
        <form class="flex mt-auto justify-evenly" on:submit={(e)=>{e.preventDefault(); submit(); typing(false);}}>
            <div class="w-5/6 ">
                <TextField bind:value={input} bind:error={messageboxerror} label="Message"/>
            </div>
            <Button add="h-12 mt-3 px-6">
                Send
            </Button>`
        </form>
    {:else}
        <!-- Here we have our login box, which through the power of flex, is centered on the page. -->
        <div class="h-full flex items-center justify-center">
            <form class="flex flex-col m-3" on:submit="{(e)=>{e.preventDefault(); submitName(e.target.username.value);}}">
                <div class="text-xl">
                    Welcome <br class="sm:hidden"/> to the chat app!
                </div>
                <div class="mb-1">
                    Please login to continue.
                </div>
                <TextField label="Name" class="-mb-1" name="username" bind:error={loginerror} outlined/>
                <Button>Submit</Button>
            </form>
        </div>
    {/if}
</div>

<UserDisplay />