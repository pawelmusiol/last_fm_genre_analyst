import { Grid, Button, Container } from '@mui/material'
import { MainChart, DataBox, SmallChart, GenreToArtistChart } from '.'
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

const ResponseData = ({ setAppState }) => {
    const [Error, setError] = useState(true)
    const data = useSelector(state => state.ChartData)
    const [MainChartData, setMainChartData] = useState('genres')
    const [GenresData, AllGenresList, PlayCount, AveragePlayCount] = useMregeGenres(data, setError)
    const [ArtistsData, AllArtistsList] = useMergeArtists(data, setError)
    const SamkeyData = useSamkeyData(data, setError, AllArtistsList, AllGenresList)

    const getChartData = () => {
        if (MainChartData === 'genres') {
            return { data: GenresData, allData: AllGenresList }
        }
        else if (MainChartData === 'artists') {
            return { data: ArtistsData, allData: AllArtistsList }
        }
    }
    const changeData = () => {
        if (MainChartData === 'genres') {
            setMainChartData('artists')
        }
        else if (MainChartData === 'artists') {
            setMainChartData('genres')
        }
    }

    return (
        <Container sx={{ background: '#fff' }}>
            <Button onClick={() => setAppState(0)}>Wróć</Button>
            {(!Error && data.days[0].songCount) &&
                <Grid container spacing={2}>
                    <Button onClick={changeData}>Zmień</Button>
                    <DataBox xs={12}>
                        <MainChart {...getChartData()} />
                    </DataBox>
                    <DataBox xs={12}>
                        <GenreToArtistChart data={SamkeyData} createLinks={createLinks} />
                    </DataBox>
                    <DataBox xs={4}>
                        Play Count: {PlayCount}
                        Average Play Count: {AveragePlayCount}
                    </DataBox>
                    <DataBox xs={4}>
                        <SmallChart data={AllArtistsList} />
                    </DataBox>
                    <DataBox xs={4}>
                        <SmallChart data={AllGenresList} />
                    </DataBox>
                </Grid>
            }
            {(data && !data.days[0].songCount) &&
                <p></p>
            }
        </Container>
    )
}

const ColorsArray = [
    "#696969",
    "#556b2f",
    "#8b4513",
    "#483d8b",
    "#008000",
    "#008b8b",
    "#9acd32",
    "#00008b",
    "#8fbc8f",
    "#800080",
    "#b03060",
    "#ff0000",
    "#ff8c00",
    "#ffd700",
    "#7fff00",
    "#00ff7f",
    "#dc143c",
    "#00ffff",
    "#00bfff",
    "#0000ff",
    "#b0c4de",
    "#ff00ff",
    "#1e90ff",
    "#fa8072",
    "#90ee90",
    "#ff1493",
    "#7b68ee",
    "#ee82ee",
    "#ffdead",
    "#ffb6c1"
]

const useSamkeyData = (data, setError, allArtistsList, allGenresList) => {
    const [Result, setResult] = useState({})
    let artists = []
    let genres = []
    let songs = []
    useEffect(() => {
        try {
            data.days.map(day => {
                day.artists.map(artist => {
                    let artistPosition = artists.findIndex(art => artist.name === art.name)
                    if (artistPosition === -1) artists.push({ name: artist.name, count: artist.playCount, genre: artist.genre })
                    else artists[artistPosition].count += artist.playCount

                    let genrePosition = genres.findIndex(genre => genre.name === artist.genre)
                    if (genrePosition === -1) genres.push({ name: artist.genre, count: artist.playCount })
                    else genres[genrePosition].count += artist.playCount
                    if (artist.songs) {
                        artist.songs.map(song => {
                            let songPosition = songs.findIndex(s => s.name === song && s.artist === artist.name)
                            if (songPosition === -1) songs.push({ name: song, artist: artist.name, count: 1 })
                            else songs[songPosition].count++
                        })
                    }
                })
            })
            let mergedList = createList(artists, genres, songs)
            let links = createLinks(artists, songs, mergedList, allArtistsList, allGenresList)
            setError(false)
            setResult({ nodes: mergedList, links: links })
        } catch (error) {
            console.error(error)
            setError(true)
        }
    }, [data, allArtistsList, allGenresList])
    return Result
}

const createLinks = (artists, songs, mergedList, allArtistsList, allGenresList) => {

    let links = []

    artists.forEach(artist => {
        let artistPosition = mergedList.findIndex(pos => pos.name === artist.name)
        let genrePosition = mergedList.findIndex(pos => pos.name === artist.genre)
        let currentArtist = allArtistsList.find(pos => pos.name === artist.name)
        let currentGenre = allGenresList.find(pos => pos.name === artist.genre)
        if (currentArtist && currentGenre) {
            let artistColor = currentArtist.color
            let genreColor = currentGenre.color
            links.push({
                source: genrePosition,
                target: artistPosition,
                value: artist.count,
                sourceColor: genreColor,
                targetColor: artistColor
            })
        }
    })
    songs.forEach(song => {
        let artistPosition = mergedList.findIndex(pos => pos.name === song.artist)
        let songPosition = mergedList.findIndex(pos => pos.name === song.name)
        let currentArtist = allArtistsList.find(pos => pos.name === song.artist)

        if (currentArtist) {

            links.push({
                source: artistPosition,
                target: songPosition,
                value: song.count,
                sourceColor: currentArtist.color,
                targetColor: '#111'
            })
        }
    })
    return links
}

const createList = (artists, genres, songs) => {
    let mergedList = []
    artists.sort((a, b) => { return a.name > b.name ? 1 : a.name < b.name ? -1 : 0 })
    genres.sort((a, b) => { return a.name > b.name ? 1 : a.name < b.name ? -1 : 0 })
    songs.sort((a, b) => { return a.name > b.name ? 1 : a.name < b.name ? -1 : 0 })

    artists.forEach(artist => {
        mergedList.push({ name: artist.name })
    })
    genres.forEach(genre => {
        mergedList.push({ name: genre.name })
    })
    songs.forEach(song => {
        mergedList.push({ name: song.name })
    })

    return mergedList
}

const useMergeArtists = (data, setError) => {
    const [Result, setResult] = useState([]);
    let Colors = [...ColorsArray]
    useEffect(() => {
        try {
            let allArtists = []
            let artistsByDay = data.days.map((day) => {
                let dayData = {}
                dayData.date = day.date
                let artists = {}
                day.artists.forEach(artist => {
                    dayData[artist.name] = artist.playCount
                    let artistExists = artists[artist.name]
                    if (!artistExists) {
                        artists[artist.name] = artist.playCount
                    }
                    else artists[artist.name] += artist.playCount
                    let [currentColor, newColors] = reduceColors(Colors)
                    Colors = [...newColors]
                    let artistsPosition = allArtists.findIndex(art => artist.name === art.name)
                    if (artistsPosition === -1) allArtists.push({ name: artist.name, count: artist.playCount, color: currentColor })
                    else allArtists[artistsPosition].count += artist.playCount
                })
                return dayData
            })
            artistsByDay = fillZero(artistsByDay, allArtists)
            allArtists.sort((a, b) => b.count - a.count)
            setResult([artistsByDay, allArtists])
            setError(false)
        } catch (error) {
            setError(true)
            setResult(['', ''])
        }
    }, [data])
    return Result
}


const useMregeGenres = (data, setError) => {
    let Colors = [...ColorsArray]
    const [Result, setResult] = useState([]);
    useEffect(() => {
        try {
            let allGenres = []
            let playCount = 0
            let formatedData = data.days.map(day => {
                let data = {}
                data.date = day.date
                let genres = {}
                day.artists.forEach(artist => {
                    playCount += artist.playCount
                    let genreExists = genres[artist.genre]
                    if (!genreExists) {
                        genres[artist.genre] = artist.playCount
                    }
                    else genres[artist.genre] += artist.playCount
                    let genrePosition = allGenres.findIndex(genre => genre.name === artist.genre)
                    let [currentColor, newColors] = reduceColors(Colors)
                    Colors = [...newColors]
                    if (genrePosition === -1) allGenres.push({ name: artist.genre, count: artist.playCount, color: currentColor })
                    else allGenres[genrePosition].count += artist.playCount
                })
                data = { ...data, ...genres }
                return data
            })
            formatedData = fillZero(formatedData, allGenres)

            allGenres.sort((a, b) => b.count - a.count)
            setResult([formatedData, allGenres, playCount, Math.round(playCount / data.days.length)])
            setError(false)
        } catch (error) {
            console.error(error)
            setError(true)
            setResult(['', '', '', ''])
        }
    }, [data]);
    return Result
}
/**
 * @param {Array} Colors
 **/
const reduceColors = (Colors) => {
    let colorNumber = Math.floor(Math.random() * Colors.length)
    let currentColor = Colors[colorNumber]
    if (Colors.length === 0) { Colors = [...ColorsArray] }
    else if (Colors.length > 0) Colors.splice(colorNumber, 1)
    return [currentColor, Colors]
}

const sortArray = (a, b) => {

}

const fillZero = (data, allData) => {
    return data.map(row => {
        allData.forEach(d => {
            if (!row[d.name]) row[d.name] = 0
        })
        return row
    })
}

export default ResponseData