export const initialValues = {
    days: [{
        artists: [
            {
                name: '',
                count: 0,
                tag: '',
            }
        ],
        songCount: 0,
    }]
}

const ChartData = (state = initialValues, action) => {
    switch (action.type) {
        case "SET_CHART_DATA":
            return action.chartData
        default:
            return state
    }
}

export default ChartData