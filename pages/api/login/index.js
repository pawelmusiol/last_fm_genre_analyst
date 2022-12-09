import axios from 'axios'

export default async function (req, res) {
    const { method } = req
    switch (method) {
        case 'POST':
            
            break;
        default:
            res.send({ message: 'dupa' })
            break
    }
}
