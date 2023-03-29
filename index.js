const fs = require('fs');
const http = require('http');
const url = require('url');
const slugify = require('slugify');
const replaceTemplate = require('./starter/modules/replaceTemplate')



////////////////////////////////
/////FILES
// // Blocking, synchronous way
// // This code read from a file
// const textIn = fs.readFileSync('./starter/txt/input.txt', 'utf-8');
// console.log(textIn);
// // This code write to a file 
// const textOut = `This is what we know about avocado: ${textIn}. \nCreated on ${Date.now( )}`;
// fs.writeFileSync('./starter?/txt/output.txt', textOut )
// console.log('File written');
// Non-blocking, asynchronous way
// fs.readFile('./starter/txt/start.txt','utf-8', (err, data1)=>{
//     if (err) return console.log('ERROR!');
//     // console.log(data1) *instead of logging the data/info in data1, 
//      we want to read the file that is named with the content of data1
//     fs.readFile(`./starter/txt/${data1}.txt`,'utf-8', (err, data2)=>{
//         console.log(data2);   
//         fs.readFile('./starter/txt/append.txt','utf-8', (err, data3)=>{
//             console.log(data3);   
//         fs.writeFile('./starter/txt/final.txt',`${data2}\n ${data3}`, 'utf-8', err=>{
//             console.log('Your file has been file written');

//         })    
//      });
//  });   
// });
// console.log('will read file');

////////////////////////////////
///// SERVER
const tempOverview = fs.readFileSync(`${__dirname}/starter/templates/template-overview.html`, 'utf-8')
const tempProduct = fs.readFileSync(`${__dirname}/starter/templates/template-product.html`, 'utf-8')
const tempCard = fs.readFileSync(`${__dirname}/starter/templates/template-card.html`, 'utf-8')
const data = fs.readFileSync(`${__dirname}/starter/dev-data/data.json`, 'utf-8')
const dataObj = JSON.parse(data);
const slugs = dataObj.map(el => slugify(el.productName,{lower:true}))
console.log(slugs);

const server = http.createServer((req, res)=>{
const {query, pathname} = url.parse(req.url, true);


    // Overview page
if (pathname ==='/' || pathname === '/overview') {
     res.writeHead(200, {'content-type': 'text/html'})

    const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('')
    const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);

    res.end(output);
}
    // Product page
else if (pathname === '/product') {
    res.writeHead(200, {'content-type': 'text/html'})
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product)
    res.end(output);
}
    // API page
else if (pathname === '/api') {     
        res.writeHead(200, {'content-type': 'application/json'})
         res.end(data);
}
else{
    res.writeHead(404,{
        'content-type': 'text/html',
        'my-own-head': 'hello world' });
        res.end('<h1>Page not found!</h1>');

}

})
server.listen(8000, '127.0.0.1',()=>{
    console.log('Listening to request on port 8000'); 

})