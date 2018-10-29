var express = require('express');
var router = express.Router();

var ctrlSocket = require('../controllers/SocketController');
router.post('/anket-sonuclarini-getir', ctrlSocket.anketSonuclariniGetir);
router.post('/anket-sonuclarini-duzenle', ctrlSocket.anketSonuclariniDuzenle);
router.post('/anket-caprazlama-getir', ctrlSocket.anketCaprazlamaGetir);

module.exports = router;