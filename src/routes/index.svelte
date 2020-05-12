<script>
    import { TextField, Button } from "smelte";
    import { onMount, tick } from "svelte";
    import { messages, loggedIn, api } from "./_api";
    
    let input, messagebox;

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
        api.sendMessage(input);
        console.log("Message sent. Value: " + input);
        input = "";
    }
</script>

<div class="flex flex-col h-full shadow-lg p-4">
    {#if $loggedIn}
        <!-- This div contains all the messages and allows for overflowing. -->
        <div class="flex flex-col overflow-y-auto" bind:this={messagebox}>
            {#each $messages as {name, message, type}}
                <div class="my-1  {type === 'server' ? "font-black" : "font-medium"}" >
                    {#if type != 'server'}
                        <span class="font-bold">{name}:</span> 
                    {/if}
                    {message}
                </div>
            {/each}
        </div>
        <!-- Here we have our input and our send button, wrapped in a form so we can easily capture enter key events. -->
        <form class="flex mt-auto justify-evenly" on:submit={(e)=>{e.preventDefault(); submit();}}>
            <div class="w-5/6 ">
                <TextField bind:value={input} label="Message"/>
            </div>
            <Button add="h-12 mt-3 px-6">
                Send
            </Button>
        </form>
    {:else}
        <!-- Here we have our login box, which through the power of flex, is centered on the page. -->
        <div class="h-full flex items-center justify-center">
            <form class="flex flex-col m-3" on:submit="{(e)=>{e.preventDefault(); api.setName(e.target.username.value);}}">
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
