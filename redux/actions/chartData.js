export const getToken = (chartData) => {
    return {
        type: 'GET_CHART_DATA',
        chartData
    }
}