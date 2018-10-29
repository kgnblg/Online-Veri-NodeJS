var express = require('express');
var router = express.Router();

var ctrlSurvey = require('../controllers/SurveyController');
router.post('/anketi-getir', ctrlSurvey.anketiGetir);
router.post('/anket-duzenle', ctrlSurvey.anketEkleDuzenle);
router.post('/anket-kurallarini-getir', ctrlSurvey.anketKurallariniGetir);
router.post('/anket-kurallarini-kaydet', ctrlSurvey.anketKurallariniKaydet);
router.post('/anket-sorularini-kaydet', ctrlSurvey.anketSorulariniKaydet);
router.post('/anket-sonuclarini-getir', ctrlSurvey.anketSonuclariniGetir);

module.exports = router;