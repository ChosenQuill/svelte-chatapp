<script>
    import {typingUsers, users, loggedIn} from '../api.js'; 
</script>

{#if $loggedIn}
    <div class="flex mt-5 shadow-lg px-4 py-2 justify-between">
        <div>
            {($typingUsers.length !== 0) ? $typingUsers.join(', ').concat(' is typing...') : ''}
        </div>
        <div>
            {$users.join(', ')} | {$users.length} Online User{$users.length !== 1 ? 's' : ''}
        </div>
    </div>
{/if}