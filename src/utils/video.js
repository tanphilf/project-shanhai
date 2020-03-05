
import ajax from "./ajax";

let host = '';
let part_urls = null;

var cb, step = 0, url_data;

window.jsonpCb = function (res) {
    if (step == 0) {
        url_data = res

    } else if (step >= 0) {
        cb(res)
    }
}


function requestVideoUrls(part_format_id, vid, fileName, callback) {
    cb = callback
    let url = `https://vv.video.qq.com/getkey?otype=json&platform=11&format=${part_format_id}&filename=${fileName}&vid=${vid}&appver=3.2.19.333`
    $.ajax({
        url,
        type: 'get',
        dataType: 'jsonp',
        jsonpCallback: 'jsonpCb'
    }).done(() => {
        step++
        // console.log('requestVideoUrls down:', step)
    })

    return ajax.get({
        url,
    }).then(res => {
        console.log('ajax axios请求：',res)
    })
}

function getVideoInfo(vid, callback = () => { }) {
    let urlString = `https://vv.video.qq.com/getinfo?otype=json&appver=3.2.19.333&platform=11&defnpayver=1&vid=${vid}`
    $.ajax({
        url: urlString,
        type: 'get',
        dataType: 'jsonp',
        jsonpCallback: "jsonpCb"
    }).done(() => {
        step++
        try {
            // console.log('视频信息返回：', JSON.stringify(url_data))
            let dataJson = JSON.stringify(url_data).replace(/QZOutputJson=/, '') + "qwe";
            let dataJson1 = dataJson.replace(/qwe/g, '');

            let data = JSON.parse(dataJson1)

            let fn_pre = data.vl.vi[0].lnk
            host = data['vl']['vi'][0]['ul']['ui'][0]['url']
            let streams = data['fl']['fi']
            let seg_cnt = data['vl']['vi'][0]['cl']['fc']
            if (parseInt(seg_cnt) == 0) {
                seg_cnt = 1
            }

            let part_format_id = streams[streams.length - 1]['id'], urls = [], deal = 0;
            for (let i = 1; i < (seg_cnt + 1); i++) {
                let filename = `${fn_pre}.p${part_format_id % 10000}.${i}.mp4`
                requestVideoUrls(part_format_id, vid, filename, (res) => {
                    // console.log('处理链接：', res)
                    if (res.key) {
                        urls.push(host + filename + '?vkey=' + res.key)
                    }
                    deal++
                    if (deal >= seg_cnt) {
                        callback(urls)
                    }
                })
            }

        } catch (e) {
            console.log(e)
        }
        
    }).fail((e) => {
        console.log('ajax fail', e)
    })

    // return ajax.get(urlString).then(res => {
    //     try {
    //         console.log('视频信息返回：', res)
    //         let dataJson = res.data.replace(/QZOutputJson=/, '') + "qwe";
    //         let dataJson1 = dataJson.replace(/;qwe/, '');
    //         let data = JSON.parse(dataJson1)
    //         let fn_pre = data.vl.vi[0].lnk
    //         host = data['vl']['vi'][0]['ul']['ui'][0]['url']
    //         let streams = data['fl']['fi']
    //         let seg_cnt = data['vl']['vi'][0]['cl']['fc']
    //         if (parseInt(seg_cnt) == 0) {
    //             seg_cnt = 1
    //         }
    //         let part_format_id = streams[streams.length - 1]['id']
    //         for (let i = 1; i < (seg_cnt + 1); i++) {
    //             let filename = `${fn_pre}.p${part_format_id % 10000}.${i}.mp4`
    //             requestVideoUrls(part_format_id, vid, filename, 'index' + i).then(url => {
    //                 console.log({ url })
    //                 resolve(url)
    //             }).catch(err => {
    //                 resolve(err)
    //             })
    //         }
    //     } catch (e) {
    //         reject(e)
    //     }
    // })
}

function getTencentVideoID(src) {
    src = String(src)
    let start = -1, type = ''
    if (src.indexOf('/cover/') >= 0) {
        start = src.indexOf('/cover/') || src.indexOf('/page/')
        type = 'vip'
    } else if (src.indexOf('/page/') >= 0) {
        start = src.indexOf('/page/') || src.indexOf('/page/')
        type = 'personal'
    }
    let end = src.indexOf('.html')
    let offset = (type === 'personal' && 6) || (type === 'vip' && 7) || 0
    return ((start >= 0 && end >= 0) && src.substring(start + offset, end)) || ''
}

export function parseVideoUrl(url, cb = () => { }) {
    if (String(url).indexOf('https://v.qq.com') >= 0) {
        return getVideoInfo(getTencentVideoID(url), cb)

    } else {
        console.log('其他视频链接：', url)
    }
}

export default {
    getVideoInfo,
    getTencentVideoID,
    parseVideoUrl
}