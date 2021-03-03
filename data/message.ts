import Archivo from "./files";
import * as moment from "moment";

let messList = new Archivo('messages')

const messages = async () => {
    await messList.leer()
};

async function addMess(data){
    let format = "YYYY-MM-DD HH:mm:ss"
    let date = new Date()
    data.time = moment(date).format(format)
    await messList.guardar(data)
    return messages
}

export {messages, addMess}