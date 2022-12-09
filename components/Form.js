import { useState, useEffect } from 'react'
import Head from 'next/head'
import { TextField, Button, Box, Paper, Checkbox, FormControlLabel, Typography } from "@mui/material"
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { DateRangePicker } from 'react-date-range'
import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'

const createMidnightDate = () => {
    let d = new Date()
    d.setHours(0, 0, 0, 0)
    return d
}

const Form = ({ setAppState }) => {
    const [Error, setError] = useState({ error: false, message: '' })
    const [Name, setName] = useState("")
    const [Callendar, setCallendar] = useState(false)
    const [Dates, setDates] = useState([{
        startDate: createMidnightDate(),
        endDate: createMidnightDate(),
        key: 'selection'
    }])
    const [Songs, setSongs] = useState(false)
    const dispatch = useDispatch()

    const handleCallendar = () => {
        setCallendar(!Callendar)
    }

    const onSubmit = async () => {
        if (typeof Name === 'undefined' || Name === '') setError({ error: true, message: 'Wpisz nazwę użytkownika' })
        else {
            let result = await axios.get('/api/tracks/' + Name + `?start=${Dates[0].startDate.getTime()}&end=${Dates[0].endDate.getTime()}&songs=${Songs}`)
            dispatch({ type: 'SET_CHART_DATA', chartData: result.data })
            setAppState(1)
        }
    }
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                background: 'rgba(0,0,0,0)',
            }}
        >
            <Head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
                <link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap" rel="stylesheet" />
            </Head>

            <Paper
                sx={{
                    flexDirection: 'column',
                    display: 'flex',
                    minWidth: 300,
                    maxWidth: '50%',
                    gap: '10px',
                    padding: '10px',
                    '& > div': {
                        background: '#ddd'
                    }
                }}>
                <Typography variant='h3' sx={{ fontFamily: 'Dancing Script', }}>Zobacz Czego Słuchasz</Typography>
                <Typography sx={{color: 'rgb(200,0,0)'}}>{Error.message}</Typography> 
                <TextField defaultValue="name" value={Name} label="name" onChange={e => setName(e.target.value)} />
                <TextField value={Dates[0].startDate.toLocaleDateString() + ' - ' + Dates[0].endDate.toLocaleDateString()} onClick={handleCallendar} />
                {Callendar &&
                    <DateRangePicker
                        onChange={item => setDates([item.selection])}
                        showSelectionPreview
                        months={1}
                        ranges={Dates}
                        direction='horizontal'
                        maxDate={new Date()}
                    />
                }
                <FormControlLabel control={<Checkbox onChange={() => setSongs(!Songs)} />} label="Uwzględnij piosenki" />
                <Button variant="contained" sx={{ background: '#ddd', color: 'black' }} onClick={async () => await onSubmit()} >Check Genres!</Button>
            </Paper>
        </Box>
    )
}

export default Form