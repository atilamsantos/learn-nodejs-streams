import axios from "axios";
import {Transform, Writable} from 'stream';
import { isGeneratorObject } from "util/types";

const serverURL = 'http://localhost:3000';

async function consume() {
    const response = await axios({
        url: serverURL, 
        method: 'get',
        responseType: 'stream'
    })

    return response.data;
}


const stream = await consume();

/*
    Transformar o dado, a função transform recebe 3 parametros: 
     - Chunk:"parte da resposta"
     - Encoding da resposta
     - Função de callback
*/

stream.pipe(new Transform({
    transform(chunk, enc, callback){
        const item = JSON.parse(chunk);
        const number = /\d+/.exec(item.name)[0]
        
        let name = item.name;

        if(number %2 == 0){
            name = name.concat(' é par');
        }else{
            name = name.concat(' é impar');
        }

        console.log(number);
        callback(null, JSON.stringify(item));
    }
})).pipe(new Writable({
    write(chunk, enc, callback){
        //Escreve os dados em algum lugar
        console.log('Writable stream', chunk.toString())

        callback();
    }
}))

