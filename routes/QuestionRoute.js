var express = require('express');
var router = express.Router();

var ctrlQuestion = require('../controllers/QuestionController');
router.post('/hazir-soru-ekle', ctrlQuestion.hazirSoruEkle);
router.post('/hazir-soru-sil', ctrlQuestion.hazirSoruSil);
router.post('/hazir-soru-getir', ctrlQuestion.hazirSoruGetir);
router.post('/hazir-sorulari-getir', ctrlQuestion.hazirSorulariGetir);
router.post('/hazir-cevap-getir', ctrlQuestion.hazirCevapGetir);
router.post('/hazir-cevaplari-getir', ctrlQuestion.hazirCevaplariGetir);
router.post('/hazir-cevap-ekle', ctrlQuestion.hazirCevapEkle);

module.exports = router;