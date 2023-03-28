const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
const port = 3000;

const items = [];

app.get('/items', (req, res) => {
    const {page, size} = req.query;
    const total = items.length;
    const start = (+page - 1) * +size;
    res.setHeader('Access-Control-Expose-Headers', 'total');
    res.setHeader('total', total);
    const paged = [...Array(+size)].map((_, i) => items[start + i]);
    res.json(paged.filter(i => i));
});

app.post('/items', (req, res) => {
    const data = req.body;
    items.push(data);
    res.send();
});

app.get('/items/:id', (req, res, next) => {
    const { id } = req.params;
    const index = items.findIndex((i) => i.id == id);
    index == -1 ? next('not found') : res.json(items[index]);
});

app.delete('/items/:id', (req, res, next) => {
    const { id } = req.params;
    const index = items.findIndex((i) => i.id == id);
    if (index != -1) {
        items.splice(index, 1);
        res.send('deleted');
    } else {
        next('not found');
    }
});

app.use((err, req, res, next) => {
    res.status(500).send('something is wrong');
});


app.listen(port, () => {
    for(var i = 0; i < 20; i++) {
        items.push({id: i+1, value: `item ${i+1}`});
    }
    console.log('app is running at ' + port + '.');
});
