import http from 'http';
import {
    Readable
} from 'stream'

import {randomUUID} from 'crypto'

//Função generator (não espera processar a função inteira), retorna na medida que processar o dado (entrega os dados sobdemanda)...
function* run (){
    for (let index = 0; index <= 9; index ++){
        const data = {
            id: randomUUID(),
            name: `Data-${index}`
        }

        //Retorna uma parte do dado para que possa ser processado, porém executa o próximo passo do for
        yield data;
    }
}



function handler(request, response) {

    const readable = new Readable({
        read(){

            for(const data of run()){
                console.log('sending', data);
                this.push(`${JSON.stringify(data)}\n`);
            }

            //informa a readable stream que os dados acabaram
            this.push(null);
        }
    })

    //Chegou uma linha, passa para o pipe essa linha pra ser tratada, ao invés de receber tudo e tratar depois.
    readable.pipe(response)

}

http.createServer(handler)
    .listen(3000)
    .on('listening', () => console.log('server running at 3000'))