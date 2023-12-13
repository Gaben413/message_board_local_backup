<template>
    <div class="content">
        <div class="header-div">
            <p>name | num</p>
        </div>

        <div class="middle-div">
            <div class="image-div">
                <img src="../assets/stockimage.png" alt="stockimage" class="img-min">
            </div>
            <div class="comment-div">
                <p>comment</p>
            </div>
        </div>
        
        <div class="bottom-div">
            <p>date</p>
        </div>
    </div>
    
</template>

<script>
export default{
    name: 'ThreadsComponent'
}
</script>

<style>
.content{
    position: relative;
    margin: 15px;

    background: lightgreen;

    border-style: solid;
    border-radius: 10px;
    border-color: rgb(0, 138, 34);

    min-width: 450px;
    min-height: 200px;

    width: fit-content;    

    max-height: 750px;
    max-width: 75%;
}
.img-min{
    height: 150px;
}
.img-max{
    width: 100%;
}

.header-div{
    background: rgb(0, 138, 34);
}
.header-div > p{
    margin: 0;
    padding-left: 15px;

    color: white;
    text-align: left;
}



.bottom-div{
    position: absolute;
    bottom: 0;

    width: 100%;
    height: 18px;

    background: rgb(226, 255, 226);
    border-radius: 0 0 6px 6px;
}
.bottom-div > p{
    margin: 0;
    padding-right: 15px;

    text-align: right;
}

</style>