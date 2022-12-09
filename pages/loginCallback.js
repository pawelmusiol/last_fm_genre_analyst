import { useEffect } from "react"
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from "react-redux"
import axios from "axios"


const useLogin = () => {
    const router = useRouter()
    const dispatch = useDispatch()
    useEffect(() => {
        let searchString = router.asPath.substring(router.asPath.indexOf("#")+1)
        let searchValues = searchString.split('&').map(str => str.split('=')[1] )
        console.log(searchValues)
        dispatch({type: "SET_TOKEN", token: {access_token: searchValues[0],expires_in: searchValues[2]}})
        axios.get('/api/tracks',{ headers: {authorization: searchValues[0]}})
    },[])
}

const LoginCallback = () => {
    useLogin()
    let x = new Date()
    return (
        
        <p>{x.to}</p>
    )
}

export default LoginCallback