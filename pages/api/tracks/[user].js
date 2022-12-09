import axios from "axios"
import res from "express/lib/response"

const getSongsByDay = async link => {
    let songs = {}
    try {
        songs = (await axios.get(link)).data

    } catch (error) {
        console.log(error)
    }
    return songs.recenttracks.track
}

const getSongDuration = async (song, artist, API_KEY) => {
    let songInfo = {}
    try {
        songInfo = (await axios.get(encodeURI(`http://ws.audioscrobbler.com/2.0/?method=track.getinfo&track=${song.replace(/\s+/g, '+')}&artist=${artist.replace(/\s+/g, '+')}&api_key=${API_KEY}&format=json`))).data
    } catch (error) {
        console.log(error)
    }

}
/**
 * 
 * @param {Array} songs 
 */
const PrepareSongs = async (songs, API_KEY) => {
    return Promise.all(songs.map(async song => {
        return {
            name: song.name,
            mbid: song.mbid,
            artist: song.artist,
            album: song.album,
            url: song.url,
            date: song.date,
        }
    }).slice(1, songs.length))
}
//artists = artists.map(artist => {return {...artist, name: artist.name.charAt(0).toUpperCase() + artist.name.slice(1) }})

const mergeArtistsSongs = (songs, getSongs) => {
    let artists = []
    //console.log(getSongs)
    songs.forEach(song => {
        let index = artists.findIndex(e => song.artist['#text'] === e.name)

        if (index === -1) {
            if (getSongs === 'true') artists.push({ name: song.artist['#text'].charAt(0).toUpperCase() + song.artist['#text'].slice(1), playCount: 1, songs: [song.name] })
            else artists.push({ name: song.artist['#text'].charAt(0).toUpperCase() + song.artist['#text'].slice(1), playCount: 1 })
        } else {
            if (getSongs === 'true') artists[index].songs.push(song.name)
            artists[index].playCount++
        }

    })
    return [artists, songs.length]
}


/**
 * 
 * @param {Array} artists
 * @param {String} API_KEY 
 */
const getTagsByArtist = async (artists, API_KEY) => {
    return Promise.all(artists.map(async artist => {
        try {
            let result = await axios.get(encodeURI(`http://ws.audioscrobbler.com/2.0/?method=artist.gettoptags&artist=${artist.name.replace(/\s+/g, '+')}&api_key=${API_KEY}&format=json`))
            console.log(result.data)
            result.data.toptags.tag[0] ? artist.genre = result.data.toptags.tag[0].name.charAt(0).toUpperCase() + result.data.toptags.tag[0].name.slice(1) : artist.genre = 'nie ma'
            return artist
        } catch (e) {
            console.log(e)
        }
    }))
}

/**
 * 
 * @param {Array} songs
 */

/* const getSongsTags = async (songs, API_KEY) => {

    return Promise.all(songs.map(async (song) => {
        let result = await axios.get(encodeURI(`http://ws.audioscrobbler.com/2.0/?method=track.gettoptags&track=${song.name.replace(/\s+/g, '+')}&artist=${song.artist['#text'].replace(/\s+/g, '+')}&api_key=${API_KEY}&format=json`))
    }))
} */


const getDates = (start) => {
    let nextDay = shortenDate(new Date(start.getTime() + 1000 * 60 * 60 * 24).getTime())
    start = shortenDate(start.getTime())
    console.log(['start', start])
    return [start, nextDay]
}

const shortenDate = (date) => {
    date = String(date)
    return date.slice(0, date.length - 3)
}

const getMoreDays = async (user, start, end, getSongs) => {
    const API_KEY = 'fd8f1cd0ee54fe80cb625be2849d6605'

    let data = { days: [] }
    for (start; start.getTime() <= end.getTime(); start = new Date(start.getTime() + 1000 * 60 * 60 * 24)) {
        let [current, nextDay] = getDates(start)
        let link = `http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&format=json&user=${user}&api_key=${API_KEY}&from=${current}&to=${nextDay}&limit=200`
        let songs = await getSongsByDay(link)
        if (songs.length) {
            let [artistsWithCount, songCount] = mergeArtistsSongs(songs, getSongs)
            artistsWithCount = await getTagsByArtist(artistsWithCount, API_KEY)
            data.days.push({ date: start, artists: artistsWithCount, songCount: songCount })
        }
        else {
            data.days.push({ date: start, artists: [], songCount: 0 })
        }
    }
    return data
}

export default async function (req, res) {


    const { method, query } = req
    console.log(query)
    switch (method) {
        case 'GET':
            let data = await getMoreDays(query.user, new Date(parseInt(query.start)), new Date(parseInt(query.end)), query.songs)
            res.send(data)
            break
        default:
            res.send({ message: 'dupa' })
            break
    }
}