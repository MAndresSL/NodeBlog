//Le decimos que vamos a usar el protocolo http
const http = require("http");
const fs = require("fs");
const _ = require("lodash");

//Creamos el servidor y el servidor nos responde
const server = http.createServer((req, res) => {
	//Esto nos imprime el tipo de request que se hizo
	console.log(req.url, req.method);

	// lodash
	const num = _.random(0, 20);
	console.log(num);

	const greet = _.once(() => {
		console.log(
			"Your lightsaber will make a fine addition to my collection"
		);
	});

	greet();
	//Set heaer content type
	//Le respondemos al browser con texto como tipo de contenido
	/*     res.setHeader('Content-Type', 'text/plain');
    res.write('Que pex');
    res.end(); */

	//Le respondemos al browser con un file de html
	res.setHeader("Content-Type", "text/html");

	let path = "./views/";

	//Vamos a leer el url que puso el usuario
	switch (req.url) {
		case "/":
			path += "index.html";
			res.statusCode = 200;
			break;
		//Si pone cualquier direccion que no existe le tira el 404
		case "/home":
			res.statusCode = 301;
			res.setHeader("Location", "/");
			res.end();
			break;
		default:
			path += "404.html";
			res.statusCode = 404;
			break;
	}

	//Le mandamos la file
	fs.readFile(path, (err, data) => {
		if (err) {
			console.log(err);
			res.end();
		} else {
			/* res.write(data);
            res.end(); */
			//Tambien se puede asi
			res.end(data);
		}
	});
});

//Montamos el servidor local para que escuche al puerto 3000
server.listen(3000, "localhost", () => {
	console.log("listening for request on port 3000");
});
