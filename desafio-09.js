const express = require("express");

const app = express();
const router = express.Router();
const port = 8080;
const server = app.listen(port, () => {
  console.info(`Servidor listo en el puerto ${port}`);
});

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use('/api/producto', router);
app.use(express.static(__dirname + 'public'));

server.on("error", (error) => {
  console.error(error);
});


class Memoria{
    constructor(){
        this.array = [];
        this.count = 0;
    }

    getArray(){
        return this.array
    }
    getProductById(id){
        const result = this.array.find((producto => producto.id == id))
        return result
    }

    addElement(objeto){
        this.array.push({...objeto,id:this.count+1});
        this.count++
        return objeto
    }

    updateElement(id, newObject){
      const element = this.getProductById(id)
      const index = this.array.indexOf(element)
      this.array[index] = newObject
      console.log(this.array[index])
      return newObject
    }

    deleteElement(id){
      const element = this.getProductById(id)
      console.log(element)
      const index = this.array.indexOf(element)
      this.array.splice(index, 1)
      console.log(this.array)
      return this.array
    }

}

const memoria = new Memoria();

router.get("/listar", (req, res) => {
    if(!memoria.getArray().length){ 
        res.json({error: 'no hay productos cargados'});
    }

    res.json(memoria.getArray())
});

router.get("/listar/:id", (req, res) => {
    const id = req.params.id;
    if(!memoria.getProductById(id)){
        res.json({error: 'producto no encontrado'});
    }
    res.json(memoria.getProductById(id));
    res.status(200).send()
  });

router.post("/guardar/post", (req, res) => {
    
    const producto = req.body;
    console.log(producto)
    memoria.addElement(producto);
    res.sendStatus(201);
  });

router.put("/actualizar/:id", (req, res) => {
  const id = req.params.id;
  const producto = req.body;
  console.log(producto)

    if(!memoria.getProductById(id)){
      res.json({error: 'producto no encontrado'});
    }
    res.json(memoria.updateElement(id, producto));  
  });

router.delete("/borrar/:id", (req, res) => {
    const id = req.params.id;
    if(!memoria.getProductById(id)){
      res.json({error: 'producto no encontrado'});
    }
    memoria.deleteElement(id)
    res.json(memoria.getProductById(id));
  })