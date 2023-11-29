(async () => {
    const {Favourite} = require('./models')

    const date = new Date();

    const datetime_now = `${date.getFullYear()}-${date.getMonth()}-${date.getDay()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`

    //console.log(datetime_now)

    //const fav1 = await Favourite.create({f_data: datetime_now, f_name: 'Love this one'})
    //console.log(fav1.f_id)
    //console.log(fav1)

    /*
    const favourite = await Favourite.findByPk(1);
    favourite.f_name = 'Research Threads';
    await favourite.save()
    console.log(favourite)
    */
})();