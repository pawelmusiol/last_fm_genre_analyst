import { Grid } from '@mui/material'

const DataBox = ({xs, children}) => {
    return(
        <Grid item xs={xs}>
            {children}
        </Grid>
    )
}

export default DataBox