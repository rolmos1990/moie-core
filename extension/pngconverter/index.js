const Converter = require("./util");
const express = require('express')

const app = express()
const port = process.env.PORT || 3008;

app.use(express.json());

app.post('/', (req, res) => {
   const converter = new Converter();
    const {html,name} = req.body;
    const fs = require('fs');
    const fullName = `catalogs/${name}`;
   converter.convertHtmlInImage(html).then(response => {
       fs.writeFileSync(fullName, response);
       res.json({'success': true})
   });
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
