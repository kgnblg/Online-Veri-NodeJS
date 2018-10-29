module.exports = (req, res, next) => {
    res.append('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.append('Access-Control-Allow-Origin', 'http://localhost:51104');
    res.append('Access-Control-Max-Age', '3600');
    res.append('Cache-Control', 'private');
    res.append('Content-Type', 'application/json; charset=utf-8');
    next();
}