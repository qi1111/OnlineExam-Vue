export function dateFunction(time){
    var zoneDate = new Date(time).toJSON();
    var date = new Date(+new Date(zoneDate)+8*3600*1000).toISOString().replace(/T/g,' ').replace(/\.[\d]{3}Z/,'');
    return date;
}

export function getLocalDate(){
    const myDate = new Date()
    //获取当前年
    const year = myDate.getFullYear()
    //获取当前月
    const month = myDate.getMonth() + 1
    //获取当前日
    const date = myDate.getDate()
    //获取当前小时数(0-23)
    const h = myDate.getHours()
    //获取当前分钟数(0-59)
    const m = myDate.getMinutes()
    const s = myDate.getSeconds()

    function convert(val) {
        return val < 10 ? '0' + val : val
    }

    //获取当前时间
    const time =
        year +
        '-' +
        convert(month) +
        '-' +
        convert(date) +
        ' ' +
        convert(h) +
        ':' +
        convert(m) +
        ':' +
        convert(s)
    return time
}


