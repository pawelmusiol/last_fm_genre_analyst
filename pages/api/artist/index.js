import axios from "axios"

export default async function (req, res) {
    const { method, query } = req
    const API_KEY = 'fd8f1cd0ee54fe80cb625be2849d6605'
    switch (method) {
        case 'GET':
            let artists = await getArtists(query.user)
            let artistsWithGenres = await getArtistsGenres(artists)
            res.send({ artists: artistsWithGenres })
            break
        default:
            res.send({ message: 'dupa' })
            break
    }
}

const getArtistsGenres = async (artists) => {
    return await Promise.all(artists.map(async (artist) => {
        let tags = await axios.get(`http://ws.audioscrobbler.com/2.0/?method=artist.getTopTags&artist=${encodeURIComponent(artist.name)}&api_key=fd8f1cd0ee54fe80cb625be2849d6605&format=json`)
        return { name: artist.name, tags: tags.data.toptags.tag }
    }))
}

const getArtists = async (user) => {

    let artists = []
    let page = 1
    let currentResult
    do {
        currentResult = ((await axios.get(`http://ws.audioscrobbler.com/2.0/?method=user.gettopartists&user=${user}&api_key=fd8f1cd0ee54fe80cb625be2849d6605&page=${page}&format=json`)).data).topartists
        artists.push(...currentResult.artist)
        page = parseInt(currentResult['@attr'].page) + 1
    } while (page <= /* currentResult['@attr'].totalPages */1)
    return artists
}