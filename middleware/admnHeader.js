
const Headers = (req, res, next) => {
    res.set({
        'Access-Control-Expose-Headers': 'Content-Range',
        'Content-Range': 'posts 0-24/31'
    })
    next();
}

module.exports = { Headers};