import { PieChart, ResponsiveContainer, Pie, Tooltip, Cell } from 'recharts'

const SmallChart = ({data}) => {
    return(
        <ResponsiveContainer width="100%" height={200}>
        <PieChart>
            <Pie
             dataKey="count"
             cx="50%"
             cy="50%"
             data={data}
             >
                 {data.map((row, index) => <Cell key={index} fill={row.color} />)}
                 </Pie>
             <Tooltip />
        </PieChart>
        </ResponsiveContainer>
    )
}

export default SmallChart