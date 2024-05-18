<template>
    <h1>{{ display_username }} FAVOURITES</h1>
</template>

/*
    This seems to hold all of the answers
    https://www.youtube.com/watch?v=MgC6LGckDTc&t=0s
*/

<script>
    export default{
        props: ['username'],
        data(){
            return{
                display_username: "Placeholder"
            }
        }
    }
</script>