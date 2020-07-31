const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const blogRoutes = require('./routes/blogRoutes');
// Crea la instancia de una app de express
const app = express();

// Middleware & static files
// Esta funcion nos permite dejar archivos como publicos, se usa para stylesheets
app.use(express.static("public"));
//Para obtener los datos del ejs
app.use(express.urlencoded({ extended: true }));
// Morgan es una api para middleware
app.use(morgan("dev"));

// Connect to mongodb
const dbURI =
	"mongodb+srv://mario:HelloThere!@nodeblog.gn17k.mongodb.net/nodeCourse?retryWrites=true&w=majority";

mongoose
	.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
	.then((result) => {
		console.log("connected to db");
		app.listen(3000);
	})
	.catch((err) => console.log(err));

app.set("view engine", "ejs");

// Listens for requests
//app.listen(3000); Lo pasamos a la promesa de mongoose

// Middleware
app.use((req, res, next) => {
	console.log("in the next middleware");
	// Esto hace que siga con el codigo, si no se queda trabado
	next();
});

// mongoose and mongo sandbox routes

//Guardamos un blog
app.get("/add-blog", (req, res) => {
	const blog = new Blog({
		title: "new blog",
		snippet: "about my new blog",
		body: "more about my new blog",
	});

	blog
		.save()
		.then((result) => {
			res.send(result);
		})
		.catch((err) => console.log(err));
});

// Capturamos todos los blogs guardados en la db
app.get("/all-blogs", (req, res) => {
	Blog.find()
		.then((result) => {
			res.send(result);
		})
		.catch((err) => console.log(err));
});

app.get("/single-blog", (req, res) => {
	Blog.findById("5f230db886f6e13228dbb881")
		.then((result) => {
			res.send(result);
		})
		.catch((err) => console.log(err));
});

app.get("/", (req, res) => {
	// Con esta linea nos evitamos decirle el tipo de contenido que le vamos a mandar
	//res.send();

	//res.sendFile("./views/index.html", { root: __dirname });

	// Esto es para ejs
	// const blogs = [
	// 	{ title: "Mrs. Grimshaw", snippet: "Gang member" },
	// 	{ title: "John Marston", snippet: "Gang member" },
	// ];

	// res.render("index", { title: "Home", blogs: blogs });
	res.redirect("/blogs");
});

// blog routes
app.use('/blogs', blogRoutes);

// Redirect
app.get("/home", (req, res) => {
	// Con esta linea nos evitamos decirle el tipo de contenido que le vamos a mandar
	res.redirect("/");
});

// 404 page
app.use((req, res) => {
	// Aqui si tenemos que mandar el status
	//res.status(404).sendFile("./views/404.html", { root: __dirname });
	res.render("404", { title: "Not found" });
});
