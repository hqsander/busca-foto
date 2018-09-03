var express = require("express");
var router  = express.Router();
var passport = require("passport");
var Usuario = require("../models/usuario");

//essa é a root route
router.get("/", function(req, res){
    res.render("landing");
});

router.get("/cadastro", function (req, res) {
    res.render("cadastro");
});

//cadastra e faz o login em seguida
router.post("/cadastro", function (req, res) {
    var novoUsuario = new Usuario({ username: req.body.username });
    
    //se o nome de usuário e senha estiverem preenchidos, ok. Se não, exibe erro.
    if(req.body.username !== null && req.body.username !== '') {
        if(req.body.password !== null && req.body.password !== '') {
            Usuario.register(novoUsuario, req.body.password, function (err, usuario) {
                if (err) {
                    req.flash("error", err.message);
                    return res.render("cadastro");
                }
                passport.authenticate("local")(req, res, function () {
                    req.flash("success", "Seja bem-vindo, " + usuario.username + ".");
                    res.redirect("/fotografos");
                });
            });
        } else {
            req.flash("error", "Favor preencher o campo senha.");
            res.redirect("/cadastro");
        }
    } else {
        req.flash("error", "Informe um nome de usuário.");
        res.redirect("/cadastro");
    }
});

router.get("/login", function (req, res) {
    res.render("login");
});

//login com autenticação
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/fotografos",
        failureRedirect: "/login"
    }), function(req, res){
});

router.get("/logout", function (req, res) {
    req.logout();
    req.flash("success", "Conta fechada com sucesso. Até breve!");
    res.redirect("/fotografos");
});



module.exports = router;