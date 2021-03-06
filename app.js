var express        = require("express"),
    app            = express(),
    bodyParser     = require("body-parser"),
    mongoose       = require("mongoose"),
    flash          = require("connect-flash"),
    passport       = require("passport"),
    LocalStrategy  = require("passport-local"),
    methodOverride = require("method-override"),
    //Fotografo    = require("./models/fotografo"),
    //Comentario   = require("./models/comentario"),
    Usuario        = require("./models/usuario"),
    seedDB         = require("./seeds");
    
// importando/requisitando routes
var comentarioRoutes  = require("./routes/comentarios"),
    fotografoRoutes   = require("./routes/fotografos"),
    indexRoutes       = require("./routes/index");

var urlBanco = process.env.DATABASEURL || "mongodb://localhost/buscafoto";
mongoose.connect(urlBanco);
var porta = process.env.PORT || 3000;
var ip = process.env.IP;

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

seedDB(); //seed do banco .. agora é purge

// Configurações do PASSPORT
app.use(require("express-session")({
    secret: "123456",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(Usuario.authenticate()));
passport.serializeUser(Usuario.serializeUser());
passport.deserializeUser(Usuario.deserializeUser());

app.use(function (req, res, next) {
    res.locals.usuarioAtual = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use("/", indexRoutes);
app.use("/fotografos", fotografoRoutes);
app.use("/fotografos/:id/comentarios", comentarioRoutes);

//Verifica se process.env.PORT é undefined. Comparar com void(qualquerCoisa) é um check seguro.
if (process.env.PORT === void (0)) {
    app.listen(porta, function () {
        console.log("O BuscaFoto está rodando...");
    });
} else {
    app.listen(process.env.PORT, process.env.IP, function () {
        console.log("O BuscaFoto está rodando...");
    });
}