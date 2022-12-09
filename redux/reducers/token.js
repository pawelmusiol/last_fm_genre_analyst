export const initialValues = {
    access_token: '',
    expires_time: 0,
}

const Token = (state = initialValues, action) => {
    switch (action.type) {
        case "SET_TOKEN":
            return action.token
        default:
            return state
    }
}

export default Token