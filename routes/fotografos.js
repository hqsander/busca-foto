var express = require("express");
var router = express.Router();
var Fotografo = require("../models/fotografo");
var middleware = require("../middleware");


// INDEX RESTful
router.get("/", function (req, res) {
    //recupera todos os fotógrafos
    Fotografo.find({}, function (err, todosFotografos) {
        if (err) {
            console.log(err);
        } else {
            res.render("fotografos/index", { fotografos: todosFotografos });
        }
    });
});

// CREATE RESTful
router.post("/", middleware.isLoggedIn, function (req, res) {
    //recupera dados do form e adiciona ao array de fotógrafos
    var nome = req.body.nome;
    var imagem = req.body.imagem;
    var bio = req.body.bio;
    var autor = {
        id: req.user._id,
        username: req.user.username
    };
    
    //se o nome estiver vazio, preencher com traço
    if(nome === null || nome === '') {
        nome = "---";
    }
    //se imagem não der match com a regex, então que seja painful harold.
    if(!imagem.match(/^(http|https).*(jpg)$/)){
        imagem = "https://i.kym-cdn.com/entries/icons/original/000/016/546/hidethepainharold.jpg";
    }
    //se a bio estiver vazia, preencher com traço
    if(bio === null || bio === '') {
        bio = "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";
    }

    //cria o fotógrafo e manda para o banco
    var novoFotografo = { nome: nome, imagem: imagem, bio: bio, autor: autor };
    Fotografo.create(novoFotografo, function (err, recemCriado) {
        if (err) {
            console.log(err);
        } else {
            //após criar o fotógrafo, redirecionar para listagem
            res.redirect("/fotografos");
        }
    });
});

// NEW RESTful
router.get("/new", middleware.isLoggedIn, function (req, res) {
    res.render("fotografos/new");
});

// SHOW RESTful
router.get("/:id", function (req, res) {
    //procura fotografo pelo id
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
        Fotografo.findById(req.params.id).populate("comentarios").exec(function (err, fotografoEncontrado) {
            if (err) {
                console.log(err);
            } else {
                //exibe o fotógrafo
                res.render("fotografos/show", { fotografo: fotografoEncontrado });
            }
        });
    }
});

// EDIT RESTful
router.get("/:id/edit", middleware.verificaAutoriaFotografo, function (req, res) {
    Fotografo.findById(req.params.id, function (err, fotografoEncontrado) {
        res.render("fotografos/edit", { fotografo: fotografoEncontrado });
    });
});

// UPDATE RESTful
router.put("/:id", middleware.verificaAutoriaFotografo, function (req, res) {
    // procura e atualiza o fotógrafo
    //se imagem não der match com a regex, então que seja painful harold.
    if(!req.body.fotografo.imagem.match(/^(http|https).*(jpg)$/)){
        req.body.fotografo.imagem = "https://i.kym-cdn.com/entries/icons/original/000/016/546/hidethepainharold.jpg";
    }
    Fotografo.findByIdAndUpdate(req.params.id, req.body.fotografo, function (err, fotografoAtualizado) {
        if (err) {
            res.redirect("/fotografos");
        } else {
            //exibe fotógrafo atualizado
            res.redirect("/fotografos/" + fotografoAtualizado.id);
        }
    });
});

// DESTROY RESTful
router.delete("/:id", middleware.verificaAutoriaFotografo, function (req, res) {
    Fotografo.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            res.redirect("/fotografos");
        } else {
            res.redirect("/fotografos");
        }
    });
});


module.exports = router;

