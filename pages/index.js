import Head from 'next/head'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { styled, keyframes } from '@mui/system'
import { Container } from '@mui/material'
import { Form, ResponseData } from '../components'

const bgKeyframes = keyframes`
        0% {
            background-position: 0% 50%;
        }
        50% {
            background-position: 100% 50%;
        }
        100% {
        background-position: 0% 50%;
        }`

const BackgroundContainer = styled(Container)((props) => {
    console.log(props)
    return {
        background: props.appState === 0 ? `linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)` : `#fff`,
        backgroundSize: `400% 400%`,
        animation: `${bgKeyframes} 5s ease infinite`,
        height: `100vh`,
    }
})

export default function Home() {
    const [AppState, setAppState] = useState(0)
    return (
        <BackgroundContainer maxWidth='xl' appState={AppState}>
            <Container maxWidth="lg">
                {AppState === 0 &&
                    <Form setAppState={setAppState} />
                }
                {AppState === 1 &&
                    < ResponseData setAppState={setAppState} />
                }
            </Container>
        </BackgroundContainer>
    )
}
