<template>
    <div class="container">
        <div class="item1">
            <p class="header-text">name | num</p>
        </div>
        <img src="../assets/stockimage.png" alt="stockimage" class="img-min item2">
        <p class="item3">Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos quibusdam architecto cupiditate provident vero iure officiis veritatis voluptatem, maxime, voluptas laborum quas in, earum corrupti nobis labore vitae modi non amet nesciunt debitis praesentium deleniti! Eum libero et error ea accusantium dolores eaque explicabo, dolore, laboriosam cupiditate possimus eius quibusdam perferendis nemo nisi tempora consequatur! Quidem tempore aliquam deleniti optio minima illo laboriosam vero amet enim magnam ex in vitae maxime quasi aut laudantium necessitatibus assumenda, a unde. Autem beatae maxime ipsam quod eaque corporis magnam aspernatur aperiam sint quasi? Soluta, perspiciatis amet tenetur expedita iusto architecto doloremque repudiandae ullam ipsa mollitia illo vero sequi harum est sapiente aut distinctio explicabo? Ea magnam, vero veritatis, voluptatum modi, laboriosam ad sequi ex sunt cumque cum fuga eaque quidem? Est, ipsa asperiores quis excepturi fugiat minima quae minus voluptatum laudantium illo ea, modi aliquam dolore ipsam neque officia nesciunt? Voluptatibus, nostrum earum officiis rerum fugit, distinctio quia consequatur vitae voluptates cupiditate eius eos! Vel veritatis reiciendis voluptas, aspernatur illo minima. Eum qui tempora odit placeat voluptatem cumque optio, ipsum velit aliquam vel atque earum, architecto cum illum inventore saepe, maxime cupiditate magnam voluptatibus natus? Distinctio culpa ratione doloremque quaerat quae! Sequi unde, facere praesentium vel odit reiciendis, maiores dignissimos dolores quam, maxime consequuntur velit quisquam at? Nulla earum id illo laboriosam dicta quisquam numquam provident. Illo molestias quam beatae architecto? Esse optio tenetur sed eos, illum odit expedita laudantium minima asperiores quos libero saepe. Similique, quae. Autem impedit molestiae corporis culpa quidem.</p>
        <div class="item4">
            <p class="date-text">date</p>
        </div>
    </div>
    
</template>

<script>
export default{
    name: 'ThreadComponent'
}
</script>

<style>
.container{
    display: grid;
    grid-template-columns: auto auto auto auto;
    gap: 0px 0px;

    margin: 15px;

    background: lightgreen;

    border-style: solid;
    border-radius: 10px;
    border-color: rgb(0, 138, 34);    

    width: fit-content;    

    max-height: 750px;
    max-width: 75%;
}

.img-min{
    height: 150px;
}
.img-max{
    height: 350px;
}

.header-text{
    margin: 0;

    text-align: left;
}

.item1{
    margin: 0;

    padding-left: 15px;

    height: fit-content;

    grid-column: 1/5;

    background: rgb(0, 138, 34);
}

.item2{
    margin: 0;
    padding: 0;
}

.item3{
    margin: 0px 0px 0px 10px;
    padding: 0;

    grid-column: 2/5;

    min-width: 250px;

    text-align: left;
}

.item4{
    margin: 0;
    padding-right: 15px;
    background: rgb(226, 255, 226);

    height: fit-content;

    grid-column: 1/5;

    align-content: center;

    border-radius: 0 0 6px 6px;
}
.date-text{
    text-align: right;
    margin: 0;
}
/*
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
*/
</style>