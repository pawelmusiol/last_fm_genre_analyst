import { Line, LineChart, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { Paper } from '@mui/material'

const Chart = ({ data, allData }) => {
    return (
        <ResponsiveContainer width="100%" minWidth="100%" height={400}>
            <LineChart data={data}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip content={CustomTooltip} />
                {allData.map((row, index) => <Line dataKey={row.name} key={index} type="natural" stroke={row.color} />)}
                <Legend />
            </LineChart>
        </ResponsiveContainer>

    )
}

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <Paper sx={{padding: 1}}>
                <p>{label}</p>
                {payload.map(p => {
                    payload.sort((a, b) => b.value - a.value)
                    if (p.value > 0) {
                        return <p style={{color: p.stroke}}>{p.name} : {p.value}</p>
                    }
                })}
            </Paper>
        )
    }
    return null
}



export default Chart