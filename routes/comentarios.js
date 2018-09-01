var express = require("express");
var router = express.Router({ mergeParams: true });
var Fotografo = require("../models/fotografo");
var Comentario = require("../models/comentario");
var middleware = require("../middleware");

// Comentários não tem nem INDEX RESTful, nem SHOW RESTful

// NEW RESTful
router.get("/new", middleware.isLoggedIn, function (req, res) {
    console.log(req.params.id);
    // busca o fotógrafo pelo id
    Fotografo.findById(req.params.id, function (err, fotografo) {
        if (err) {
            console.log(err);
        } else {
            res.render("comentarios/new", { fotografo: fotografo });
        }
    });
});

// CREATE RESTful
router.post("/", middleware.isLoggedIn, function (req, res) {
    //procura fotógrafo por id
    Fotografo.findById(req.params.id, function (err, fotografo) {
        if (err) {
            console.log(err);
            res.redirect("/fotografos");
        } else {
            Comentario.create(req.body.comentario, function (err, comentario) {
                if (err) {
                    req.flash("error", "Oooops. Ocorreu um erro inesperado.");
                    console.log(err);
                } else {
                    //adiciona usuário e id
                    comentario.autor.id = req.user._id;
                    comentario.autor.username = req.user.username;
                    //e salva
                    comentario.save();
                    fotografo.comentarios.push(comentario);
                    fotografo.save();
                    console.log(comentario);
                    req.flash("success", "Comentário adicionado.");
                    res.redirect("/fotografos/" + fotografo._id);
                }
            });
        }
    });
});

// EDIT RESTful
router.get("/:comentario_id/edit", middleware.verificaAutoriaComentario, function (req, res) {
    Comentario.findById(req.params.comentario_id, function (err, comentarioEncontrado) {
        if (err) {
            res.redirect("back");
        } else {
            res.render("comentarios/edit", { fotografo_id: req.params.id, comentario: comentarioEncontrado });
        }
    });
});

// UPDATE RESTful
router.put("/:comentario_id", middleware.verificaAutoriaComentario, function (req, res) {
    Comentario.findByIdAndUpdate(req.params.comentario_id, req.body.comentario, function (err, comentarioAtualizado) {
        if (err) {
            res.redirect("back");
        } else {
            res.redirect("/fotografos/" + comentarioAtualizado.id);
        }
    });
});

// DESTROY RESTful
router.delete("/:comentario_id", middleware.verificaAutoriaComentario, function (req, res) {
    Comentario.findByIdAndRemove(req.params.comentario_id, function (err) {
        if (err) {
            res.redirect("back");
        } else {
            req.flash("success", "O comentário foi apagado.");
            res.redirect("/fotografos/" + req.params.id);
        }
    });
});

module.exports = router;