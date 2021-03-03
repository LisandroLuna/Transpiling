import * as http from 'http'
import * as express from 'express'
import {Server} from 'socket.io'
import * as handlebars from 'express-handlebars'
import * as router from './routes/api'
import * as viewRouter from "./routes/web"
import * as product from './data/product'
import * as messages from './data/message'

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))


app.engine(
    'hbs',
    handlebars({
        extname: '.hbs',
        defaultLayout: 'index.hbs',
        layoutsDir: __dirname + '/views/layouts',
        partialsDir: __dirname + '/views/partials'
    })
)

app.set('view engine', 'hbs')
app.set('views', './views')
app.use(express.static('public'));

const port = 8080

app.use('/', viewRouter.default)
app.use('/api', router.default)

const server = http.createServer(app)

const io = new Server(server)

server.listen(port, () => {
    console.log('Server listen at port: ' + port)
})
io.on("connection", socket => {
    console.log("Client connected...");
    socket.emit('data', product.prodList)
    socket.emit('messages', messages.messages);
    socket.on('update', (newData) => {
        product.addProd(newData)
        socket.broadcast.emit('data', product.prodList)
    })
    socket.on('addMessages', (newMess) => {
        console.log(newMess)
        messages.addMess(newMess).then(mess => {
            socket.broadcast.emit('messages', mess)
        })
    })
});

