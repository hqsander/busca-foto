var Fotografo = require("../models/fotografo");
var Comentario = require("../models/comentario");

// concentrar todo middleware aqui
var middlewareObj = {};

middlewareObj.verificaAutoriaFotografo = function (req, res, next) {
    if (req.isAuthenticated()) {
        Fotografo.findById(req.params.id, function (err, fotografoEncontrado) {
            if (err) {
                req.flash("error", "Fotógrafo não encontrado.");
                res.redirect("back");
            } else {
                // foi o usuário que criou o fotógrafo?
                if (fotografoEncontrado.autor.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "Negado. Você não tem permissão para isso.");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "Você precisa entrar em sua conta para executar essa função.");
        res.redirect("back");
    }
};

middlewareObj.verificaAutoriaComentario = function (req, res, next) {
    if (req.isAuthenticated()) {
        Comentario.findById(req.params.comentario_id, function (err, comentarioEncontrado) {
            if (err) {
                res.redirect("back");
            } else {
                // o comentário pertence ao usuário?
                if (comentarioEncontrado.autor.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "Negado. Você não tem permissão para isso.");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "Você precisa entrar em sua conta para executar essa função.");
        res.redirect("back");
    }
};

middlewareObj.isLoggedIn = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "Você precisa entrar em sua conta para executar essa função.");
    res.redirect("/login");
};

module.exports = middlewareObj;