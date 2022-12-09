import { CustomSankeyLink } from '.'
import { ResponsiveContainer, Sankey, Tooltip } from 'recharts'
import { useState, useEffect } from 'react'

const GenreToArtistChart = ({ data, createLinks }) => {
    const [CurrentData, setCurrentData] = useState(data)
    const [Focus, setFocus] = useState(false)

    useEffect(() => {
        setCurrentData(data)
    }, [data])

    const FocusOnGenre = (e) => {
        let links = []

        if (Focus) {
            setCurrentData(data)
            setFocus(false)
        }
        else if (!Focus) {

            if (e.payload.target) {
                links = FindConectedNodes(e.payload.target.sourceNodes[0])
            }
            else if (e.payload.sourceLinks.length) {
                links = FindConectedNodes(e.payload.sourceNodes[0])
            }
            else if (e.index) {
                links = FindConectedNodes(e.index)
            }
            setFocus(true)
            setCurrentData({ ...CurrentData, links: links })
        }
    }

    const FindConectedNodes = (index, child = false) => {
        if (!child) {
            return CurrentData.links.filter(link => link.source === index)

        }
        else if (child) {
            return CurrentData.links.filter(link => link.source === index)
        }
    }
    /* 
        const RemoveNodes = (kek, links) => {
            console.log(links)
            let sourceTaken = false
            let genre = {name:''}
            let aaa = []
            let artists = []
            links.forEach(link => {
                let nodes = CurrentData.nodes.map((node, index) => {
                    console.log(link)
                    if (!sourceTaken && link.source === index) {
                        genre = node
                        sourceTaken = true
                        aaa.push(node)
                    }
                    if (link.target === index) {
                        aaa.push({...node, count: link.value})
                    }
                })
            })
            aaa = aaa.map(a => {return {name: a.name, count: a.count, genre: genre.name}})
            console.log(aaa)
            return [artists, aaa]
        }
     */
    let colors = CurrentData.links.map(link => { return { sourceColor: link.sourceColor, targetColor: link.targetColor } })
    return (
        <>
            {(CurrentData.hasOwnProperty('links')) &&
                <ResponsiveContainer width="100%" minWidth="100%" minHeight={1200} height={1200} debounce={1}>
                    <Sankey
                        onClick={FocusOnGenre}
                        data={CurrentData}
                        /* nodePadding='1' */
                        /* node={<path className='recharts-rectangle recharts-sankey-node'/>} */
                        nodePadding={2}
                        link={<CustomSankeyLink colors={colors} />}
                    >
                        <Tooltip />
                    </Sankey>
                </ResponsiveContainer>
            }
            as
        </>
    )
}


export default GenreToArtistChart