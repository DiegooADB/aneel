const cheerio = require('cheerio')
const request = require('request-promise')
const fs = require('fs')
const { Parser } = require('json2csv')

const dados = []

async function extracao(site) {
    const html = await request.get(site)
    const $ = await cheerio.load(html)

    for (let n = 3; n <= 1002; n++) {

        let arr = new Array
        let obj = new Object

        for(let m = 1;m <= 16;m++) {
            const informacao = $(`body > table > tbody > tr:nth-child(4) > td > table:nth-child(4) > tbody > tr:nth-child(${n}) > td:nth-child(${m})`).text().trim()
            
            arr.push(informacao)
            obj.distribuidora = arr[0],
            obj.codigo= arr[1],
            obj.titular= arr[2],
            obj.classe= arr[3],
            obj.subgrupo= arr[4],
            obj.modalidade= arr[5],
            obj.credito= arr[6],
            obj.municipio= arr[7],
            obj.uf= arr[8],
            obj.cep= arr[9],
            obj.data= arr[10],
            obj.fonte= arr[11],
            obj.potencia= arr[12],
            obj.modulo= arr[13],
            obj.inversores= arr[14],
            obj.arranjo= arr[15]
        }
        dados.push(obj)
        console.log(dados)
        const json2csvParser = new Parser()
        const csv = json2csvParser.parse(dados)
        fs.writeFileSync('./dados-aneel.csv', csv, 'utf8')
        await demora()
    }
}

async function demora() {
    await sleep(1000)
    await console.log(`Passado 1 segundo ...`)
}

async function sleep(ml) {
    return new Promise(resolve => setTimeout(resolve, ml))
}

async function pagina() {
    for(let count = 1; count <= 231; count++){
        let url = `http://www2.aneel.gov.br/scg/gd/gd_fonte_detalhe.asp?tipo=12&pagina=${count}`
        await extracao(url)
    }
}
pagina()